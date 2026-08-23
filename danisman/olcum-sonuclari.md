# Aşama 1 — Ölçüm sonuçları

Kapadokya Üniversitesi sunucusu (192.168.1.40), Ollama, `num_ctx=8192`,
`temperature=0`. Her satır gerçek bir koşu; tahmin yok. Ham çıktılar
`sonuclar/` altında, madde madde.

## Modellerin çalışabilirlik durumu

| Model | Boyut | Durum |
|---|---|---|
| `qwen2.5vl:7b` | 6.0 GB | Çalışıyor — 15 sn'de yükleniyor, 0.6 sn/madde |
| `qwen2.5vl:32b` | 21.2 GB | **Bozuk** — `Failed to load CLIP model` |
| `qwen2.5vl:32b-q8_0` | 36.2 GB | **Bozuk** — aynı hata, **farklı blob** |
| `qwen2.5vl:72b` | 48.7 GB | **Çalışıyor** — ~90 sn soğuk yükleme, ~1.0 sn/madde |
| `qwen3.5:122b` | 81.4 GB | **Yüklenmiyor** — 9 dk %100 CPU, 974 MB RSS, GPU'ya hiç konmuyor |

32B'nin iki varyantı da aynı hatayı **ayrı blob'larla** veriyor, yani tek bir
bozuk dosya değil; Ollama'nın bu yapıyla sorunu var. `/api/pull` onarımı aynı
saniyede `{"status":"success"}` döndü — Ollama dosyaları eksiksiz sayıyor,
hiçbir şey indirmedi. Bu yoldan onarım mümkün değil.

## Doğruluk — hepsi

| Model | Sınav | Yöntem | Doğruluk | Süre |
|---|---|---|---|---|
| 7b | taban (238) | doğrudan | %51.3 | 138 sn |
| 7b | taban (238) | doğrudan, ters sıra | %47.9 | 146 sn |
| 7b | gerçekçi (40) | doğrudan | %42.5 | 23 sn |
| **72b** | **taban (238)** | **doğrudan** | **%71.0** | 224 sn |
| **72b** | **taban (238)** | **doğrudan, ters sıra** | **%73.5** | 226 sn |
| **72b** | **gerçekçi (40)** | **doğrudan** | **%72.5** | 38 sn |
| 72b | gerçekçi (40) | eksen (ısı+nem) | %67.5 | 45 sn |
| 72b | taban (238) | eksen (ısı+nem) | %63.4 | 260 sn |

7B elendi. **En iyi kurulum: 72B + doğrudan dörtlü soru, ~%71-73.**

## Sınavın kendisi hakkında öğrenilenler

**Yanlılık promptta değil.** 7B, 238 maddenin 126'sına sevdavi demişti (gerçek:
59). Mizaçları promptta ters sırayla sunup tekrar koştum: sevdavi tahmini
142'ye *çıktı*, oysa sevdavi artık listenin başındaydı. Küçük modellerde
beklenen "listenin sonuna kayma" burada yok — yanlılık modelin.

**Taban sınavı "kolay" değil, gürültülü.** 72B gerçekçi sınavda (%72.5) taban
sınavından (%71.0) *daha iyi*. Sebep: taban maddeleri testin şıkları ve şıklar
ancak birbirlerine göre anlam taşıyor. Tek başına sunulduğunda bazıları gerçekten
belirsiz — "Az terlerim" (safravî) ile "Neredeyse hiç terlemem" (sevdavî) gibi.
Yani **%85'lik taban eşiğini ben yanlış kalibre etmişim**; o eşik maddelerin
kendinden menkul ayırt edici olduğunu varsayıyordu, değiller.

## Asıl hata: ıslak/kuru ekseni

72B'nin gerçekçi sınavdaki 11 hatasının **7'si kendi sıcaklık grubunun içinde**:

- safravî (sıcak-kuru) ↔ demevî (sıcak-**ıslak**) — 3 hata
- balgamî (soğuk-ıslak) ↔ sevdavî (soğuk-**kuru**) — 4 hata

Örnekler: *"sırtım sırılsıklam oluyor"* (bol terleme = demevî) → safravî dedi.
*"elim ayağım buz gibi"* (balgamî) → sevdavî dedi.

Model **sıcak/soğuk eksenini okuyor, ıslak/kuru eksenini kaçırıyor.**

### Denenen düzeltme — işe yaramadı

Dört mizaç zaten iki nitelikten türediği için, tek dörtlü seçim yerine iki ikili
seçim (ısı + nem) sorup eşleştirmeyi denedim (`olc.py --eksen`). Hipotez: model
doğru bildiği ekseni kaybetmez.

Sonuç: taban %71.0 → **%63.4**, gerçekçi %72.5 → **%67.5**. İkisi de düştü.

Matris nedenini gösteriyor: safravî 44/60'tan 27/60'a çöktü, 16'sı demevî oldu.
Modeli nem ekseninde açıkça karar vermeye zorlayınca zayıf bilgisi doğrudan
sonuca yansıyor; dörtlü soruda ise bütünsel ipuçlarıyla telafi edebiliyor.
Hedeflenen balgamî karışıklığı biraz düzeldi (27→29) ama bedeli ağır.

**Hipotez ölçümle çürütüldü. Doğrudan dörtlü soru kalıyor.**

## Aşama 2 için sonuç

**İnce ayara (Aşama 4) gerek yok** — ama karar kuralı sağladığı için değil:

1. Hedef Claude API; Qwen üzerine LoRA taşınmaz (planda zaten kararlıydı)
2. Gerçekçi eşiği (%70) geçildi; taban eşiği ise yanlış kalibre edilmişti
3. Danışman tek ifadeye bakıp karar vermiyor — sohbet boyunca 8-10 gözlem
   biriktirip kararı `lib/puanlama.ts` veriyor

**Ama dikkat:** balgamî→sevdavî hatası **sistematik, rastgele değil**. Sistematik
hata gözlem sayısı arttıkça sönmez, birikir. Yani danışman balgamî kişileri
sevdavî okumaya eğilimli olacak. Bunun tasarım cevabı gerekiyor:

- İlk iki aday balgamî/sevdavî olduğunda danışman **ayırt edici sinyali doğrudan
  yoklamalı**: terleme, cilt nemi, kilo eğilimi, uyku süresi. Planda zaten olan
  "eksik sinyal takibi" bu çifte özel kural kazanmalı.
- Gözlemler modelin güven derecesiyle ağırlıklandırılmalı; zayıf kanıt puanı
  az taşımalı.

## Aşama 2-3 — uçtan uca sohbet testi

`danisman/sohbet-testi.ts`, dört mizaç için sekizer turluk senaryo koşar.
Ölçüt planın doğrulama maddesi: aynı kişi profili danışmanda ve testte aynı
mizacı vermeli.

| Senaryo | Sonuç | Güven | İlk doğru tur |
|---|---|---|---|
| balgamî | ✓ balgamî | %100 | 3 |
| safravî | ✓ safravî | %100 | 2 |
| demevî | ✓ demevî | %56 | 3 |
| sevdavî | ✓ sevdavî | %100 | 3 |

**4/4.** Ama ilk koşu 0/4'tü ve aradaki fark üç düzeltmeden geliyor:

1. **Gösterge tablosu.** Çıkarıcı modelin kendi mizaç bilgisiyle çalışıyordu ve
   balgamî'de sistematik yanılıyordu ("elim ayağım buz gibi" → sevdavî, "terim
   soğuk olur" → demevî; ikisi de kitapta balgamî). Testin 240 puanlanmış
   göstergesi prompta tablo olarak konunca balgamî senaryosu demevî %7'den
   balgamî %100'e çıktı.
2. **Üslup hatırlatması her turda.** Kurallar yalnız açılış mesajındayken
   bağlam uzadıkça sulanıyor, danışman ders anlatmaya dönüyordu.
3. **`danisman/bicim.ts` — kodda dayatma.** Hatırlatma da yetmedi. Prompt bir
   ricadır, garanti değildir; cümle sınırı, liste temizliği, tedavi önerisi
   ayıklama ve mizaç adı kapısı artık deterministik olarak uygulanıyor.

### Modelin promptla düzelmeyen kusurları

Bunlar `bicim.ts` ile yakalanıyor ama kaynağı model:

- **Tıbbi tavsiye veriyor** — "antiperspirant kullanın", "düzenli egzersiz
  dolaşımı hızlandırır", "bir terapiste danışın". Sağlık sınırı promptta yazılı
  olmasına rağmen.
- **Motorunkinden farklı mizaç adı söylüyor** — motor balgamî derken danışman
  "demevî eğilimi" dedi. Kullanıcı çelişki görürdü.
- **Çince karakter sızdırıyor** — "derin katmanlarda扎根 olduğunu".
- Resmî/samimi kayıt arasında gidip geliyor.

Üçü de `qwen2.5vl:72b`'nin talimat takibindeki zayıflığı; görsel-dil modeli,
sıcak Türkçe sohbet için ayarlanmamış. Asıl kaldıraç prompt değil sağlayıcı
(`MIZAC_SAGLAYICI=claude`).

## Model seçimi — 72B'den gemma3:27b'ye

Modeli başta "sunucuda yüklenen tek büyük model" olduğu için seçmiştim; Türkçe
yeteneği hiç ölçülmedi. Sohbet testinde doğru mizacı bulurken *"uzlaşmaca
zamanı"*, *"biravukatlık yaparak"*, *"insensellikten yoksun"* gibi var olmayan
sözcükler üretti. Doğruluk ve dil kalitesi ayrı şeyler; `dil-karsilastir.ts`
ikincisini ölçmek için yazıldı.

| Model | Türkçe | Stratejiye uyum | Ort. cevap | Latin dışı sızıntı |
|---|---|---|---|---|
| `qwen2.5vl:72b` (48.7 GB) | uydurma sözcükler | kısmen | uzun, dağınık | var |
| `aya-expanse:8b` (5.1 GB) | **akıcı** | **yok** — 957 karakterlik makale, madde listesi, ilk turda mizaç adı, B12/demir tavsiyesi | 957 krk | 0/3 |
| `gemma3:27b` (17.4 GB) | **akıcı** | **uyuyor** — yansıtmada soru sormuyor | **186 krk** | 0/3 |

Gemma'nın duygulanım yansıtması:

> *"İşler kötü gittiğinde kendini toparlamak için böyle bir yolun olması…
> yorucu olmalı. Hem fiziksel olarak yatmak hem de duygusal olarak
> ağlayabilmek, bir çeşit teslimiyet gibi sanki."*

### Sohbet testi — iki model yan yana

| Senaryo | qwen2.5vl:72b | gemma3:27b |
|---|---|---|
| balgamî | ✓ %88, tur 3 | ✓ %75, tur 3 |
| safravî | ✓ %100, tur 2 | ✓ %78, tur 2 |
| demevî | ✓ %56, tur 3 | ✓ %57, **tur 2** |
| sevdavî | ✓ %100, tur 3 | ✓ %84, **tur 2** |

İkisi de 4/4. Gemma'nın güven sayıları biraz düşük ama doğruya **daha erken**
varıyor, sohbeti kıyaslanamayacak kadar iyi ve model üçte bir boyutta.
Varsayılan `gemma3:27b` oldu.

Not: aya-expanse örneği, "Türkçesi iyi model" ile "işi yapan model"in aynı şey
olmadığını gösteriyor. Dil kalitesi gerek şart, yeter şart değil.

## İşletme notları

- 72B soğuk yükleme ~90 sn, sonrası ~1.0 sn/madde → sohbet turu için yeterli
- Ollama boştaki modeli düşürüyor; `keep_alive` verilmezse her tur soğuk açılış
- Her istekte `num_ctx` **açıkça** verilmeli (122B'nin varsayılanı 262.144)
