/**
 * Model çağrısının tek kapısı.
 *
 * Bugün üniversite sunucusundaki Ollama'ya, yarın Claude API'ye konuşacağız.
 * Çağıran taraf hangisi olduğunu bilmemeli — yoksa geçiş, bütün kod tabanına
 * yayılmış bir refactor'a döner. Buradaki `Saglayici` arayüzü o geçişi tek
 * dosyalık işe indirir.
 *
 * Ölçümden gelen kural: `num_ctx` **her zaman** açıkça verilir. Verilmezse
 * model kendi varsayılanını kullanır ve bu, 122B'de 262.144 token demek —
 * makineyi kilitlemeye yeter (bkz. olcum-sonuclari.md).
 */

export type Rol = 'sistem' | 'kullanici' | 'danisman';

/**
 * Çıktı dili. Burada duruyor çünkü `model.ts`'in başka bağımlılığı yok;
 * persona ve kriz ayrı ayrı tanımlayınca ikisi birbirinden ayrışabilirdi.
 */
export type Dil = 'tr' | 'en';

export interface Mesaj {
  rol: Rol;
  metin: string;
}

export interface SorSecenekleri {
  sicaklik?: number;
  enFazlaJeton?: number;
  /** Modelden düz metin değil JSON bekleniyorsa. */
  jsonMu?: boolean;
}

export interface Saglayici {
  readonly ad: string;
  sor(mesajlar: Mesaj[], secenekler?: SorSecenekleri): Promise<string>;
  /**
   * Parça parça üretir. Her yeni metin parçası `parca` ile bildirilir, tam
   * metin döner. Sağlayıcı desteklemiyorsa tanımsız olabilir — çağıran taraf
   * `sor`'a düşer.
   */
  akisli?(
    mesajlar: Mesaj[],
    parca: (metin: string) => void,
    secenekler?: SorSecenekleri
  ): Promise<string>;
}

/**
 * Gösterge tablosu (~3K token) çıkarıcı promptuna eklendiğinden 8192 dar
 * kalıyordu. 16384, 72B'nin 128K penceresi içinde rahat; yükleme süresini
 * ölçülebilir biçimde artırmıyor.
 */
const VARSAYILAN_BAGLAM = 16384;

/* ------------------------------------------------------------------ Ollama */

export interface OllamaAyar {
  adres?: string;
  model?: string;
  baglam?: number;
  /** Model bellekte ne kadar tutulsun. Verilmezse her tur soğuk açılış olur. */
  sicakKalma?: string;
  /** Tünelin önündeki vekilin beklediği anahtar. Yerel Ollama'da gerekmez. */
  anahtar?: string;
}

export function ollama(ayar: OllamaAyar = {}): Saglayici {
  const adres = ayar.adres ?? process.env.MIZAC_OLLAMA ?? 'http://localhost:11434';
  const anahtar = ayar.anahtar ?? process.env.MIZAC_OLLAMA_ANAHTAR;

  // Üretimde Ollama'ya doğrudan değil, kimlik doğrulayan bir vekil üzerinden
  // gidiliyor (danisman/sunucu/vekil.py). Anahtar yoksa başlık hiç
  // gönderilmiyor; yereldeki Ollama'yı bozmasın.
  const basliklar: Record<string, string> = { 'Content-Type': 'application/json' };
  if (anahtar) basliklar.Authorization = `Bearer ${anahtar}`;
  // gemma3:27b, qwen2.5vl:72b'nin yerini ölçümle aldı: Türkçesi düzgün
  // (qwen "uzlaşmaca zamanı", "biravukatlık" gibi var olmayan sözcükler
  // üretiyordu), strateji yönergesine uyuyor, cevapları 186 karakter
  // civarında kalıyor ve model 17 GB — 72B'nin üçte biri.
  // Bkz. olcum-sonuclari.md, "Model seçimi".
  const model = ayar.model ?? process.env.MIZAC_MODEL ?? 'gemma3:27b';
  const baglam = ayar.baglam ?? VARSAYILAN_BAGLAM;
  const sicakKalma = ayar.sicakKalma ?? '30m';

  /**
   * Soğuk açılış Node'un undici katmanındaki 300 sn'lik başlık zaman aşımını
   * aşabiliyor: 72B'yi yüklemek dakikalar sürüyor ve `num_ctx` değişince Ollama
   * modeli baştan yüklüyor. İstek düşse de sunucu yüklemeye devam ettiği için
   * tekrar denemek işe yarıyor — ikinci deneme sıcak modeli bulur.
   */
  async function denemeliIstek(gonder: () => Promise<Response>): Promise<Response> {
    let sonHata: unknown;
    for (let deneme = 0; deneme < 3; deneme++) {
      try {
        return await gonder();
      } catch (e) {
        sonHata = e;
        await new Promise((r) => setTimeout(r, 20_000 * (deneme + 1)));
      }
    }
    throw sonHata;
  }

  return {
    ad: `ollama:${model}`,
    async sor(mesajlar, secenekler = {}) {
      const cevap = await denemeliIstek(() => fetch(`${adres}/api/chat`, {
        method: 'POST',
        headers: basliklar,
        body: JSON.stringify({
          model,
          stream: false,
          keep_alive: sicakKalma,
          format: secenekler.jsonMu ? 'json' : undefined,
          options: {
            temperature: secenekler.sicaklik ?? 0.7,
            num_predict: secenekler.enFazlaJeton ?? 512,
            num_ctx: baglam,
          },
          messages: mesajlar.map((m) => ({
            role: m.rol === 'sistem' ? 'system' : m.rol === 'kullanici' ? 'user' : 'assistant',
            content: m.metin,
          })),
        }),
      }));

      if (!cevap.ok) throw new Error(`Ollama ${cevap.status}: ${await cevap.text()}`);
      const d = await cevap.json();
      if (d.error) throw new Error(`Ollama: ${d.error}`);
      return d.message?.content ?? '';
    },

    async akisli(mesajlar, parca, secenekler = {}) {
      const cevap = await denemeliIstek(() => fetch(`${adres}/api/chat`, {
        method: 'POST',
        headers: basliklar,
        body: JSON.stringify({
          model,
          stream: true,
          keep_alive: sicakKalma,
          options: {
            temperature: secenekler.sicaklik ?? 0.7,
            num_predict: secenekler.enFazlaJeton ?? 512,
            num_ctx: baglam,
          },
          messages: mesajlar.map((m) => ({
            role: m.rol === 'sistem' ? 'system' : m.rol === 'kullanici' ? 'user' : 'assistant',
            content: m.metin,
          })),
        }),
      }));

      if (!cevap.ok) throw new Error(`Ollama ${cevap.status}: ${await cevap.text()}`);
      if (!cevap.body) throw new Error('Ollama: gövde yok');

      // Ollama akışta satır başına bir JSON gönderiyor; parçalar satır
      // ortasında bölünebildiği için tampon tutuluyor.
      const okuyucu = cevap.body.getReader();
      const cozucu = new TextDecoder();
      let tampon = '';
      let tam = '';

      for (;;) {
        const { done, value } = await okuyucu.read();
        if (done) break;
        tampon += cozucu.decode(value, { stream: true });
        const satirlar = tampon.split('\n');
        tampon = satirlar.pop() ?? '';
        for (const satir of satirlar) {
          if (!satir.trim()) continue;
          try {
            const d = JSON.parse(satir);
            if (d.error) throw new Error(`Ollama: ${d.error}`);
            const p = d.message?.content ?? '';
            if (p) {
              tam += p;
              parca(p);
            }
          } catch {
            // Bozuk satır akışı kesmemeli.
          }
        }
      }
      return tam;
    },
  };
}

/* ------------------------------------------------------------------ Claude */

export interface ClaudeAyar {
  anahtar?: string;
  model?: string;
}

export function claude(ayar: ClaudeAyar = {}): Saglayici {
  const anahtar = ayar.anahtar ?? process.env.ANTHROPIC_API_KEY;
  // 'claude-sonnet-4-5' yazıyordu — böyle bir model kimliği yok, ilk gerçek
  // istekte 404 dönerdi. Ucuzlatmak istenirse MIZAC_CLAUDE_MODEL ile
  // 'claude-haiku-4-5' verilebilir; bu kararı kod değil kullanıcı vermeli.
  const model = ayar.model ?? process.env.MIZAC_CLAUDE_MODEL ?? 'claude-opus-5';

  return {
    ad: `claude:${model}`,
    async sor(mesajlar, secenekler = {}) {
      if (!anahtar) throw new Error('ANTHROPIC_API_KEY tanımlı değil');

      // Claude sistem mesajını mesaj dizisinde değil ayrı alanda alır.
      const sistem = mesajlar.filter((m) => m.rol === 'sistem').map((m) => m.metin).join('\n\n');
      const kalan = mesajlar.filter((m) => m.rol !== 'sistem');

      const cevap = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anahtar,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model,
          max_tokens: secenekler.enFazlaJeton ?? 1024,
          temperature: secenekler.sicaklik ?? 0.7,
          system: sistem || undefined,
          messages: kalan.map((m) => ({
            role: m.rol === 'kullanici' ? 'user' : 'assistant',
            content: m.metin,
          })),
        }),
      });

      if (!cevap.ok) throw new Error(`Claude ${cevap.status}: ${await cevap.text()}`);
      const d = await cevap.json();
      return d.content?.[0]?.text ?? '';
    },
  };
}

/* ------------------------------------------------------------------ seçim */

/** `MIZAC_SAGLAYICI=claude` ile değiştirilir; varsayılan sunucudaki Ollama. */
export function saglayiciSec(): Saglayici {
  return process.env.MIZAC_SAGLAYICI === 'claude' ? claude() : ollama();
}
