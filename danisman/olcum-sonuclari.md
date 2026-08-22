# Aşama 1 — Ölçüm sonuçları

Kapadokya Üniversitesi sunucusu (192.168.1.40), Ollama, `num_ctx=8192`,
`temperature=0`. Her satır gerçek bir koşu; tahmin yok.

## Modellerin çalışabilirlik durumu

| Model | Boyut | Durum |
|---|---|---|
| `qwen2.5vl:7b` | 6.0 GB | **Çalışıyor** — 15 sn'de yükleniyor, 0.6 sn/madde |
| `qwen2.5vl:32b` | 21.2 GB | **Bozuk** — `Failed to load CLIP model`; blob tam boyutta (21.159.298.208 bayt) ama görsel katmanı yüklenmiyor. `/api/pull` ile onarım denendi |
| `qwen2.5vl:32b-q8_0` | 36.2 GB | Denenmedi |
| `qwen2.5vl:72b` | 48.7 GB | Denenmedi |
| `qwen3.5:122b` | 81.4 GB | **Yüklenmiyor** — 9 dk %100 CPU, 974 MB RSS, GPU'ya hiç konmuyor. Bağlam ayarıyla ilgisi yok; kapsam dışı |

## Doğruluk

| Model | Sınav | Doğruluk | Cevapsız | Süre |
|---|---|---|---|---|
| `qwen2.5vl:7b` | taban (238) | **%51.3** (122/238) | 0 | 138 sn |
| `qwen2.5vl:7b` | gerçekçi (40) | **%42.5** (17/40) | 0 | 23 sn |

Karar kuralı taban ≥%85 / gerçekçi ≥%70 idi. 7B ikisinde de çok uzak.

## Asıl bulgu: sevdavi yanlılığı

Taban sınavı, karışıklık matrisi (satır = gerçek, sütun = tahmin):

| gerçek \ tahmin | safravi | demevi | balgami | sevdavi |
|---|---|---|---|---|
| **safravi** | 29 | 5 | 1 | **25** |
| **demevi** | 7 | 29 | 5 | **19** |
| **balgami** | 4 | 7 | 15 | **33** |
| **sevdavi** | 4 | 1 | 5 | 49 |

Model 238 maddenin **126'sına** sevdavi demiş; gerçekte 59 tane var. Sevdavi'yi
bulma oranı yüksek (49/59) ama isabeti düşük (49/126). Balgami'yi neredeyse hiç
göremiyor: 59'un 15'i, 33'ünü sevdavi sanıyor.

Gerçekçi sınavda aynı örüntü: 40 maddenin 20'sine sevdavi, safravi'yi 10'da 1.

### Yanlılık sınaması: suç promptta değil

Aynı sınav, mizaçlar promptta **ters sırada** sunularak tekrar koşuldu
(`--sira sevdavi,balgami,demevi,safravi`) — sevdavi artık listenin başında,
safravi sonunda:

| gerçek \ tahmin | safravi | demevi | balgami | sevdavi |
|---|---|---|---|---|
| **safravi** | 29 | 2 | 0 | **29** |
| **demevi** | 12 | 21 | 3 | **24** |
| **balgami** | 0 | 2 | 16 | **41** |
| **sevdavi** | 3 | 0 | 8 | 48 |

Doğruluk %47.9 (114/238) — değişmedi. Sevdavi tahmini ise 126'dan **142'ye
çıktı**, oysa sevdavi artık listenin *başında*.

Yanlılık konumu takip etmiyor. Küçük modellerde beklenen "listenin sonundaki
seçeneğe kayma" burada yok; model, nereye koyulursa koyulsun sevdavi diyor.
**Yanlılık modelin, ölçüm aletinin değil.** Sınav 32B'yi yargılamak için
kullanılabilir.

## Sıradaki

1. ~~7B yanlılık sınaması~~ — yapıldı, yukarıda
2. 32B onarımı bitince taban + gerçekçi
3. Gerekirse 72B
