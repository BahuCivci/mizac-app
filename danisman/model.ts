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
}

/** Ölçümde 72B'nin en iyi çalıştığı bağlam. Gereksiz büyütmek yükleme süresidir. */
const VARSAYILAN_BAGLAM = 8192;

/* ------------------------------------------------------------------ Ollama */

export interface OllamaAyar {
  adres?: string;
  model?: string;
  baglam?: number;
  /** Model bellekte ne kadar tutulsun. Verilmezse her tur soğuk açılış olur. */
  sicakKalma?: string;
}

export function ollama(ayar: OllamaAyar = {}): Saglayici {
  const adres = ayar.adres ?? process.env.MIZAC_OLLAMA ?? 'http://localhost:11434';
  const model = ayar.model ?? process.env.MIZAC_MODEL ?? 'qwen2.5vl:72b';
  const baglam = ayar.baglam ?? VARSAYILAN_BAGLAM;
  const sicakKalma = ayar.sicakKalma ?? '30m';

  return {
    ad: `ollama:${model}`,
    async sor(mesajlar, secenekler = {}) {
      const cevap = await fetch(`${adres}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      });

      if (!cevap.ok) throw new Error(`Ollama ${cevap.status}: ${await cevap.text()}`);
      const d = await cevap.json();
      if (d.error) throw new Error(`Ollama: ${d.error}`);
      return d.message?.content ?? '';
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
  const model = ayar.model ?? process.env.MIZAC_CLAUDE_MODEL ?? 'claude-sonnet-4-5';

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
