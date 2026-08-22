# Dikey yapay zekâ — sektör ne yapıyor, biz ne yapıyoruz

Ağustos 2026 taraması. Soru şuydu: mizaç danışmanı gibi bir dikey YZ'yi
astroloji, psikoloji, koçluk sektörleri nasıl kuruyor; biz nerede yanlıştayız.

## Doğru yaptığımız üç şey

**1. Kararı motora bırakmak.** Co-Star üretken YZ'yi ana yorumlarda
kullanmıyor; gökyüzü verisini yapılandırılmış bir "olgular" nesnesinde tutup
modele yalnız o sınırların içinde yazdırıyor. Bizim `kazananBelirle()` +
kanıt çıkarma mimarimiz aynı kalıp: model okur, motor karar verir.

**2. Kuralları koda almak.** Sektörün cümlesi net: *sistem promptu guardrail
değildir; modelin çoğu zaman uyduğu, en kritik anda görmezden geldiği bir
öneridir.* Üretim kalıbı üretimi doğrulamadan ayırmak. `danisman/bicim.ts`
tam olarak bu — ve promptla üç kez denedikten sonra mecburen vardığımız yer,
sektörün başlangıç noktasıymış.

**3. Modeli kitabın kendi göstergelerine oturtmak.** Astroloji uygulamaları da
yorum kütüphanelerini RAG ile bağlayıp modelin uydurmasını kesiyor. Gösterge
tablosu bizde balgamî senaryosunu %7'den %100'e çıkardı.

## Yanlış yaptığımız / eksik bıraktığımız beş şey

### 1. Konuşma stratejimiz tek: "gözlemle ve sor"

En önemli bulgu bu. Koçluk/terapi YZ'lerinde standart çerçeve **motivasyonel
görüşme** ve danışmanın elinde tek değil ~11 strateji var: açık uçlu soru,
**basit yansıtma**, **yeniden çerçeveleyen yansıtma**, **duygulanım
yansıtması**, onaylama, özetleme, izin isteyerek tavsiye.

GPTCoach (CHI 2025) iki aşamalı kuruyor: **bir ajan stratejiyi seçer**, ikinci
ajan cevabı o stratejiyle yazar.

Bizim danışmanın repertuvarında yalnız "soru" var. "Mülakatçı gibi" hissi
üslup kusuru değil, **eksik tasarım**. Üstelik araştırma şunu da söylüyor:
MI davranışı, LLM'lerin talimat-takip ve soru-cevap eğilimiyle *çatışır* —
yani promptla rica ederek düzelmemesi beklenen bir şeymiş.

Ayrıca bir MI kuralı bizim tasarımı doğrudan ilgilendiriyor: *danışan
motivasyonu doğrudan sorulmaz.* Biz nem eksenini doğrudan sorduruyoruz.

### 2. Değerlendirmemiz gerçek sohbeti ölçmüyor

`sohbet-testi.ts` sabit senaryo okuyor — "kullanıcı" danışmanın söylediğine
tepki vermiyor. Sektör pratiği **LLM'in kullanıcıyı canlandırması** (persona +
senaryo verilip konuşturulması) ve **LLM-as-judge** ile çok turlu ölçütler:
rol tutarlılığı, bilgi hatırda tutma, sohbet bütünlüğü, görev tamamlama.

Tek turlu metrikler çok tura taşınmıyor; **bağlam kayması, bilgi kaybı ve
tutarlılık ancak turlar arasında ortaya çıkıyor**. Bizde üslup çöküşü tam da
böyle ortaya çıktı — ama tesadüfen, ölçtüğüm için değil.

### 3. Guardrail tek katman ve regex

Ölçülmüş oranlar: regex filtreler enjeksiyonun %60-70'ini, LLM tabanlı
sınıflandırıcılar %89-94'ünü yakalıyor; ikisi + çıktı doğrulaması birlikte
%99.1. Bizim tıbbi tavsiye filtremiz **saf regex** — bugün "antiperspirant"ı
yakaladı, yarınki ifadeyi kaçırır.

Önerilen üç katman: **girdi doğrulama → yürütme kısıtı → çıktı filtreleme.**
Bizde girdi katmanı yok (rol enjeksiyonunu kesiyoruz ama içerik enjeksiyonunu
değil).

### 4. Modeli yanlış eksende seçtim

`qwen2.5vl:72b`'yi "sunucuda yüklenen tek büyük model" olduğu için seçtim —
Türkçe sohbet yeteneği hiç ölçülmedi. Oysa Türkçe için ayrı kıyaslamalar
(TurkBench, Cetvel) ve Türkçe'ye ayarlanmış modeller var: Trendyol-LLM,
wiroai-turkish-llm-8b, Aya-23, Commencis-LLM. Bunların **temel aldıkları
modeli Türkçe'de geçtikleri** raporlanıyor.

Yani 8B'lik Türkçe-ayarlı bir model, 72B'lik görsel-dil modelinden daha iyi
konuşuyor olabilir — ve 6 kat küçük. Çince karakter sızdırması da bu yanlış
seçimin belirtisi.

### 5. Regülasyon hiç düşünülmedi

ABD'de **dört eyalet** (Illinois, Nevada, Rhode Island, Maine) YZ'nin terapi
sunmasını yasakladı; Illinois'te ceza 10.000 dolara kadar. Dört eyalet daha
(Utah, New York, California, Nebraska) yasaklamayıp **ifşa + kriz yönlendirme
+ reşit olmayan koruması** şartı koydu. FTC Eylül 2025'te yedi şirkete
soruşturma açtı.

Türkiye bu listede değil ama ürün iki dilli ve açık internette. Bizde uyarı
metni var, **kriz protokolü yok** — "intihar düşüncesi" promptta bir satır,
kodda karşılığı yok.

## Skill kullanmalı mıyız?

**Hayır, bu iş için değil.** Agent Skills, ajanın göreve göre yükleyip
çalıştırdığı, betik ve kaynak içerebilen uzmanlık paketleri; Code Execution
aracını gerektiriyor. Bizim ihtiyacımız persona + alan verisi + katı çıktı
biçimi — bunlar sistem promptu, veri ve guardrail işi. Skill eklemek iki
gerçek sorunun (konuşma stratejisi, model kalitesi) hiçbirini çözmez,
üzerine altyapı bindirir.

## Yapılacaklar (öncelik sırasıyla)

1. **Strateji katmanı.** Cevap üretmeden önce strateji seç: yansıtma /
   onaylama / açık uçlu soru / özet / sessiz kalma. En büyük kalite kazancı,
   en ucuz değişiklik. `danisman/strateji.ts`.
2. **Türkçe'ye ayarlı model dene.** Trendyol-LLM ve Aya-23'ü mevcut sınavdan
   geçir; 72B ile kıyasla. Model seçimi ölçümle yapılmalı, erişilebilirlikle
   değil.
3. **Guardrail'i ikinci katmana çıkar.** Regex kalsın, üzerine küçük bir LLM
   sınıflandırıcı: "bu cevap tıbbi tavsiye içeriyor mu?" Ayrıca girdi katmanı.
4. **Simüle kullanıcı + hakem ile değerlendirme.** Sabit senaryoyu LLM'in
   canlandırdığı personayla değiştir; rol tutarlılığı ve bağlam kaymasını ölç.
5. **Kriz protokolü.** Kod düzeyinde: kriz ifadeleri yakalandığında sohbet
   durur, yardım hattı gösterilir. Promptta bir satır olarak bırakılamaz.

## Kaynaklar

- [Co-Star nasıl kuruluyor](https://www.apptunix.com/blog/how-to-develop-an-astrology-app-like-co-star/) ·
  [Co-Star ve astrolojik veri](https://asapjournal.com/node/as-above-so-below-astrological-data-in-the-age-of-co-star/)
- [GPTCoach (CHI 2025)](https://dl.acm.org/doi/10.1145/3706598.3713819) ·
  [MI tarzı yansıtma üretimi](https://arxiv.org/html/2402.01051v1) ·
  [Motivasyon-farkında YZ koçluk çerçevesi (CHI 2026)](https://dl.acm.org/doi/full/10.1145/3772318.3791123)
- [Çok turlu değerlendirme 2026](https://www.confident-ai.com/blog/multi-turn-llm-evaluation-in-2026) ·
  [Langfuse: simüle sohbet değerlendirme](https://langfuse.com/blog/2025-10-09-evaluating-multi-turn-conversations) ·
  [SimulatorArena](https://arxiv.org/pdf/2510.05444)
- [LLM guardrails üretim kalıbı](https://www.digitalapplied.com/blog/llm-guardrails-production-safety-layers-reference-2026) ·
  [Wiz: LLM guardrails](https://www.wiz.io/academy/ai-security/llm-guardrails)
- [YZ terapi yasakları haritası](https://psychology.com/ai-therapy/state-bans) ·
  [Illinois yasağı](https://www.aei.org/technology-and-innovation/illinois-bans-ai-therapy-questions-about-enforcement-remain/)
- [TurkBench](https://arxiv.org/html/2601.07020v1) ·
  [Cetvel](https://arxiv.org/pdf/2508.16431) ·
  [Türkçe LLM performans karşılaştırması](https://arxiv.org/pdf/2404.17010)
- [Agent Skills](https://claude.com/blog/skills)
