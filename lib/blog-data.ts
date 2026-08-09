export interface BlogYazisi {
  slug: string;
  baslik: string;
  baslikEn: string;
  ozet: string;
  ozetEn: string;
  tarih: string;
  okumaSuresi: number;
  etiketler: string[];
  icerik: BlogBolum[];
  ilgiliMizac?: string;
}

export interface BlogBolum {
  tip: 'h2' | 'h3' | 'p' | 'ul' | 'cta';
  metin?: string;
  metinEn?: string;
  maddeler?: string[];
  maddelerEn?: string[];
  href?: string;
  buton?: string;
  butonEn?: string;
}

export const blogYazilari: BlogYazisi[] = [
  {
    slug: 'mizac-testi-nedir',
    baslik: 'Mizaç Testi Nedir? İbn-i Sina\'nın 4 Mizaç Teorisi',
    baslikEn: 'What Is a Temperament Test? Ibn Sina\'s 4 Temperament Theory',
    ozet: 'İbn-i Sina\'nın geliştirdiği dört mizaç teorisi nedir, mizaç testi nasıl çalışır, hangi mizaç tipine giriyorsunuz? Bilimsel temelli kadim bilgeliği keşfedin.',
    ozetEn: 'What is Ibn Sina\'s four temperament theory, how does a temperament test work, and which type are you? Discover this scientifically-rooted ancient wisdom.',
    tarih: '2026-03-01',
    okumaSuresi: 6,
    etiketler: ['mizaç testi', 'ibn-i sina', '4 mizaç', 'mizaç nedir'],
    icerik: [
      { tip: 'p', metin: 'Mizaç, insanın doğuştan gelen ve hayatı boyunca değişmeyen temel karakter yapısını tanımlar. Hangi yiyeceklerden hoşlanırsınız, nasıl uyursunuz, stresle nasıl başa çıkarsınız — bunların tümü mizacınızla doğrudan ilişkilidir.' },
      { tip: 'p', metinEn: 'Temperament describes the fundamental character structure a person is born with and that does not change throughout life. Which foods you enjoy, how you sleep, how you cope with stress — all of these are directly related to your temperament.' },
      { tip: 'h2', metin: 'İbn-i Sina ve 4 Mizaç Teorisi' },
      { tip: 'p', metin: 'İbn-i Sina (980–1037), dünya tıp tarihinin en önemli isimlerinden biridir. Kaleme aldığı "El-Kanun fi\'t-Tıbb" (Tıbbın Kanunu) adlı eser, yüzyıllarca Avrupa ve İslam dünyasının temel tıp referansı olmuştur. Bu eserde İbn-i Sina, insanları dört temel mizaç tipine göre sınıflandırır: Safravî, Demevî, Balgamî ve Sevdavî.' },
      { tip: 'p', metin: 'Bu dört tip, dört temel element olan Ateş, Hava, Su ve Toprak ile ilişkilendirilir. Her elementin kendine özgü sıcaklık ve nem dengesi vardır; bu denge de insanın fiziksel, duygusal ve zihinsel yapısını belirler.' },
      { tip: 'h2', metin: '4 Mizaç Tipi Özet' },
      {
        tip: 'ul', maddeler: [
          'Safravî (Ateş): Enerjik, lider ruhlu, kararlı ve adalet duygusu güçlü. Sıcak ve kuru yapı.',
          'Demevî (Hava): Sosyal, neşeli, yaratıcı ve sevgi dolu. Sıcak ve nemli yapı.',
          'Balgamî (Su): Sakin, sabırlı, güvenilir ve temkinli. Soğuk ve nemli yapı.',
          'Sevdavî (Toprak): Derin düşünceli, yaratıcı, melankolik ve sadık. Soğuk ve kuru yapı.',
        ]
      },
      { tip: 'h2', metin: 'Mizaç Testi Nasıl Çalışır?' },
      { tip: 'p', metin: 'Modern mizaç testleri, İbn-i Sina\'nın teorisini temel alarak insanların fiziksel özelliklerini, duygusal tepkilerini, uyku düzenlerini, beslenme alışkanlıklarını ve sosyal davranışlarını ölçer. 57 soruluk kapsamlı testimiz bu dört alanı dengeli biçimde ele alır.' },
      { tip: 'h2', metin: 'Mizaç Bilmek Neden Önemlidir?' },
      {
        tip: 'ul', maddeler: [
          'Sağlık: Hangi hastalıklara yatkınsınız, hangi besinler size iyi gelir?',
          'İlişkiler: Hangi mizaçlarla uyumlusunuz, çatışmayı nasıl yönetirsiniz?',
          'Kariyer: Hangi meslekler ve ortamlar size en uygun?',
          'Kişisel gelişim: Hangi alanlarda güçlü, hangi alanlarda gelişime açıksınız?',
        ]
      },
      { tip: 'cta', metin: '57 soruluk ücretsiz mizaç testini şimdi yap', buton: 'Testi Başlat', href: '/test' },
    ],
  },
  {
    slug: 'safravi-mizac-nedir',
    baslik: 'Safravî Mizaç Nedir? Özellikleri, Güçlü Yönleri ve Sağlık İpuçları',
    baslikEn: 'What Is Choleric Temperament? Traits, Strengths & Health Tips',
    ozet: 'Safravî mizaç; ateş elementi, güçlü liderlik ve kararlılıkla tanımlanan bir karakter yapısıdır. Özellikleri, sağlık tavsiyeleri ve uyumlu mizaçları keşfedin.',
    ozetEn: 'Choleric temperament is defined by the fire element, strong leadership and decisiveness. Discover its traits, health advice and compatible temperaments.',
    tarih: '2026-03-05',
    okumaSuresi: 7,
    etiketler: ['safravi mizac', 'ateş mizacı', 'koleri mizaç', 'safra mizacı özellikleri'],
    ilgiliMizac: 'safravi',
    icerik: [
      { tip: 'p', metin: 'Safravî mizaç, İbn-i Sina\'nın dört mizaç sınıflandırmasının en ateşli ve dinamik olanıdır. Ateş elementi ile ilişkilendirilen bu mizaç tipi; sıcak ve kuru yapısıyla öne çıkar. Safravî insanlar doğal liderler, kararlı karar alıcılar ve güçlü adalet duygusuyla tanınan bireylerdir.' },
      { tip: 'h2', metin: 'Safravî Mizacın Temel Özellikleri' },
      {
        tip: 'ul', maddeler: [
          'Enerji ve dinamizm: Sabahları erken kalkar, güne hızlı başlar',
          'Liderlik: Doğal otorite, insan yönetme becerisi',
          'Kararlılık: Hızlı karar verir, kararsızlıktan hoşlanmaz',
          'Adalet duygusu: Haksızlığa tahammülü yoktur',
          'Dobralık: Düşündüğünü açıkça söyler, dolaylı anlatımdan kaçınır',
          'Görsellik: Estetiğe önem verir, çevresini düzenli tutar',
          'Rekabet: Kazanmayı ve başarıyı sever',
        ]
      },
      { tip: 'h2', metin: 'Safravî Fiziksel Özellikleri' },
      { tip: 'p', metin: 'Safravî mizaçlı kişiler genellikle ince-orta yapılı, çabuk hareket eden ve enerjik görünen bireylerdir. Derisi ve saçı çoğunlukla kuru olma eğilimindedir. Vücut ısısı yüksektir; sıcak havalara ve ortamlara karşı hassasiyetleri olabilir. Uyku süreleri diğer mizaçlara göre daha kısadır.' },
      { tip: 'h2', metin: 'Safravî Mizacında Sağlık ve Hastalıklar' },
      { tip: 'p', metin: 'Ateş elementi nedeniyle Safravî mizaçlılar, iltihaplı durumlar ve sindirim sorunlarına yatkındır. Migren, karaciğer sorunları, cilt problemleri ve aşırı sinirlilik bu mizacın dikkat etmesi gereken alanlardır.' },
      {
        tip: 'ul', maddeler: [
          'Soğutucu besinler tüketin: Salatalık, yoğurt, nane',
          'Kızartma ve baharatlı yiyeceklerden kaçının',
          'Düzenli, hafif egzersiz yapın; aşırı yoğunlaşmaktan kaçının',
          'Yeterli uyku düzeni oluşturun',
          'Öfke ve stresi yönetmek için meditasyon veya nefes egzersizleri yapın',
        ]
      },
      { tip: 'h2', metin: 'Safravî\'nin Kariyer ve İş Hayatı' },
      { tip: 'p', metin: 'Liderlik ruhu ve kararlılığı sayesinde Safravîler yöneticilik, girişimcilik, hukuk, askerlik ve tıp gibi alanlarda öne çıkar. Takım yönetimi ve proje liderliği bu mizacın en iyi performans gösterdiği alanlardır.' },
      { tip: 'h2', metin: 'Safravî Mizacı ile Uyumlu Mizaçlar' },
      { tip: 'p', metin: 'Safravî ile en yüksek uyumu Balgamî mizaç gösterir (%92). Safravî\'nin ateşli yapısını Balgamî\'nin sakinliği dengeler. Demevî ile de iyi anlaşılır (%68). En zorlu uyum Sevdavî ile yaşanır.' },
      { tip: 'cta', metin: 'Safravî mizacın mısın? Testi yap ve öğren', buton: 'Ücretsiz Testi Başlat', href: '/test' },
    ],
  },
  {
    slug: 'demevi-mizac-nedir',
    baslik: 'Demevî Mizaç Nedir? Neşeli, Sosyal ve Yaratıcı Ruh',
    baslikEn: 'What Is Sanguine Temperament? Joyful, Social and Creative Spirit',
    ozet: 'Demevî mizaç; hava elementi, sosyallik, neşe ve yaratıcılıkla öne çıkan bir karakter yapısıdır. İbn-i Sina geleneğinde "aşk insanı" olarak tanımlanan bu mizacı keşfedin.',
    ozetEn: 'Sanguine temperament stands out for its air element, sociability, joy and creativity. Discover this temperament, described as the "person of love" in Ibn Sina\'s tradition.',
    tarih: '2026-03-08',
    okumaSuresi: 7,
    etiketler: ['demevi mizac', 'hava mizacı', 'sanguine mizaç', 'kan mizacı'],
    ilgiliMizac: 'demevi',
    icerik: [
      { tip: 'p', metin: 'Demevî mizaç, dört mizaç tipinin en neşeli ve sosyal olanıdır. Hava elementi ile ilişkilendirilen bu yapı; sıcak ve nemli karakteriyle hem fiziksel hem duygusal canlılığı temsil eder. İbn-i Sina geleneğinde Demevî, "aşk insanı" olarak tanımlanır.' },
      { tip: 'h2', metin: 'Demevî Mizacın Temel Özellikleri' },
      {
        tip: 'ul', maddeler: [
          'Sosyallik: İnsan içinde olmayı sever, kolay arkadaşlık kurar',
          'Neşe ve coşku: Hayata pozitif bakar, şenlik atmosferi yaratır',
          'Yaratıcılık: Sanat, müzik, yazı ve tasarımda yetenekli',
          'Cömertlik: Vermeyi ve paylaşmayı sever',
          'Maneviyat: Ruhsal konulara ilgisi yüksektir',
          'Çok uyku ihtiyacı: Diğer mizaçlara göre daha fazla uyur',
          'Anlık yaşama eğilimi: Planlamadan ziyade anda olmayı tercih eder',
        ]
      },
      { tip: 'h2', metin: 'Demevî Fiziksel Özellikleri' },
      { tip: 'p', metin: 'Demevî mizaçlılar genellikle yumuşak hatları olan, dolgun ya da orta yapılı, uysal görünümlü bireylerdir. Cildi ve saçı çoğunlukla yumuşak ve nemlidir. Uyuma eğilimleri güçlüdür; yeterli uyku almadıklarında performansları belirgin biçimde düşer.' },
      { tip: 'h2', metin: 'Demevî Mizacında Sağlık ve Hastalıklar' },
      { tip: 'p', metin: 'Nemli yapısı nedeniyle Demevî mizaçlılar üst solunum yolu hastalıklarına, aşırı kilo almaya ve balgam birikimine yatkındır. Şeker dengesi ve solunum sağlığı dikkat gerektiren alanlardır.' },
      {
        tip: 'ul', maddeler: [
          'Kurutucu özellikte besinler tercih edin: Arpa, nane, zencefil çayı',
          'Aşırı tatlı ve un mamullerinden kaçının',
          'Düzenli hareket ve açık hava aktiviteleri şarttır',
          'Sabah güneşine çıkmak enerji verir',
          'Aşırı uyku yerine kaliteli uyku odaklanın',
        ]
      },
      { tip: 'h2', metin: 'Demevî\'nin Kariyer ve İş Hayatı' },
      { tip: 'p', metin: 'Demevî mizaçlılar; sanat, müzik, eğitim, sosyal hizmetler, iletişim ve insan ilişkileri gerektiren alanlarda parlar. İnsanlarla çalışmayı ve yaratıcı ortamları severler.' },
      { tip: 'h2', metin: 'Demevî Mizacı ile Uyumlu Mizaçlar' },
      { tip: 'p', metin: 'Demevî ile en yüksek uyumu Sevdavî mizaç gösterir (%90). Bu iki mizaç birbirini hem duygusal hem entelektüel düzeyde tamamlar. Safravî ile de iyi anlaşılır (%72).' },
      { tip: 'cta', metin: 'Demevî mizacın mısın? Testi yap ve öğren', buton: 'Ücretsiz Testi Başlat', href: '/test' },
    ],
  },
  {
    slug: 'balgami-mizac-nedir',
    baslik: 'Balgamî Mizaç Nedir? Sakin, Sabırlı ve Güvenilir Karakter',
    baslikEn: 'What Is Phlegmatic Temperament? Calm, Patient and Reliable Character',
    ozet: 'Balgamî mizaç; su elementi, sabır, güvenilirlik ve derin bağlılıkla tanımlanan bir yapıdır. Bu sakin ve temkinli mizacın sağlık, kariyer ve ilişki özelliklerini keşfedin.',
    ozetEn: 'Phlegmatic temperament is defined by the water element, patience, reliability and deep loyalty. Discover the health, career and relationship traits of this calm temperament.',
    tarih: '2026-03-10',
    okumaSuresi: 7,
    etiketler: ['balgami mizac', 'su mizacı', 'phlegmatic mizaç', 'balgam mizacı özellikleri'],
    ilgiliMizac: 'balgami',
    icerik: [
      { tip: 'p', metin: 'Balgamî mizaç, dört mizaç tipinin en sakin ve temkinli olanıdır. Su elementi ile ilişkilendirilen bu yapı; soğuk ve nemli karakteriyle derin bir istikrarı temsil eder. Balgamî insanlar; güvenilirliği, sadakati ve sabırlarıyla çevrelerinde huzur yaratırlar.' },
      { tip: 'h2', metin: 'Balgamî Mizacın Temel Özellikleri' },
      {
        tip: 'ul', maddeler: [
          'Sakinlik: Sükûneti korur, paniklemez',
          'Sabır: Uzun vadeli hedeflere odaklanabilir',
          'Güvenilirlik: Verdiği sözü tutar, sorumluluk sahibidir',
          'Derin bağlılık: Bağlandığı kişilere ömür boyu sadık kalır',
          'Temkinlilik: Karar vermeden önce iyice düşünür',
          'Kırgınlıklarını içine atma: Üzüntüsünü dışarı vurmakta güçlük çeker',
          'Huzur yaratma: Bulunduğu ortamı sakinleştirir',
        ]
      },
      { tip: 'h2', metin: 'Balgamî Fiziksel Özellikleri' },
      { tip: 'p', metin: 'Balgamî mizaçlılar genellikle dolgun ya da tombul yapılı, yavaş ve ölçülü hareket eden bireylerdir. Metabolizmaları diğer mizaçlara göre daha yavaş çalışır. Soğuğa karşı hassasiyetleri yüksektir; donuk hava ve serin ortamlar onları zorlayabilir.' },
      { tip: 'h2', metin: 'Balgamî Mizacında Sağlık ve Hastalıklar' },
      { tip: 'p', metin: 'Soğuk ve nemli yapısı nedeniyle Balgamî mizaçlılar üst solunum yolu rahatsızlıklarına, eklem ağrılarına, balgam birikimine ve kilo problemlerine yatkındır. Tiroit yavaşlığı ve sindirim tembelliği de dikkat edilmesi gereken alanlardır.' },
      {
        tip: 'ul', maddeler: [
          'Isıtıcı ve uyarıcı besinler tüketin: Zencefil, tarçın, karanfil',
          'Soğuk ve hamur işlerinden kaçının',
          'Düzenli ve tempolu egzersiz yapın',
          'Sabah yürüyüşleri metabolizmayı hızlandırır',
          'Kırgınlıkları dışa vurmayı öğrenin; duygusal birikim sağlığı etkiler',
        ]
      },
      { tip: 'h2', metin: 'Balgamî\'nin Kariyer ve İş Hayatı' },
      { tip: 'p', metin: 'Balgamî mizaçlılar; psikoloji, rehberlik, hemşirelik, araştırma, muhasebe ve uzun vadeli planlama gerektiren alanlarda başarılıdır. Güvenilir ekip oyuncularıdır ve liderden çok uzlaştırıcı rolünü benimserler.' },
      { tip: 'h2', metin: 'Balgamî Mizacı ile Uyumlu Mizaçlar' },
      { tip: 'p', metin: 'Balgamî ile en yüksek uyumu Safravî mizaç gösterir (%92). Balgamî\'nin sakinliği Safravî\'nin dinamizmini dengeler; bu zıt çekim ilişkisi çok güçlü bağlar oluşturabilir. Sevdavî ile de derin bir uyum yaşanır (%76).' },
      { tip: 'cta', metin: 'Balgamî mizacın mısın? Testi yap ve öğren', buton: 'Ücretsiz Testi Başlat', href: '/test' },
    ],
  },
  {
    slug: 'sevdavi-mizac-nedir',
    baslik: 'Sevdavî Mizaç Nedir? Derin, Yaratıcı ve Melankolik Yapı',
    baslikEn: 'What Is Melancholic Temperament? Deep, Creative and Melancholic Structure',
    ozet: 'Sevdavî mizaç; toprak elementi, derin düşünce, yaratıcılık ve melankoliyle öne çıkan bir karakter yapısıdır. Bu derin ve karmaşık mizacı İbn-i Sina\'nın gözünden keşfedin.',
    ozetEn: 'Melancholic temperament stands out for its earth element, deep thinking, creativity and melancholy. Discover this deep and complex temperament through Ibn Sina\'s perspective.',
    tarih: '2026-03-12',
    okumaSuresi: 7,
    etiketler: ['sevdavi mizac', 'toprak mizacı', 'melankolik mizaç', 'sevda mizacı özellikleri'],
    ilgiliMizac: 'sevdavi',
    icerik: [
      { tip: 'p', metin: 'Sevdavî mizaç, dört mizaç tipinin en derin ve karmaşık olanıdır. Toprak elementi ile ilişkilendirilen bu yapı; soğuk ve kuru karakteriyle güçlü bir içsel dünyayı temsil eder. Sevdavîler; felsefi derinliği, sanatsal yaratıcılığı ve yoğun sadakatleriyle ayrışır.' },
      { tip: 'h2', metin: 'Sevdavî Mizacın Temel Özellikleri' },
      {
        tip: 'ul', maddeler: [
          'Derin düşünce: Her şeyi detaylıca analiz eder, sığ konuşmalardan hoşlanmaz',
          'Sanatsal yaratıcılık: Müzik, şiir, yazı ve sanata güçlü ilgi',
          'Sadakat: Bağlandığı kişilere ömür boyu bağlı kalır',
          'Mükemmeliyetçilik: İşini en iyi şekilde yapmak ister',
          'Hassasiyet: Eleştiriye ve reddedilmeye karşı hassastır',
          'Melankoli: Geçmişi düşünmeye, derinlemesine hissetmeye yatkındır',
          'Az konuşma: Sözü ölçer, gereksiz konuşmaktan kaçınır',
        ]
      },
      { tip: 'h2', metin: 'Sevdavî Fiziksel Özellikleri' },
      { tip: 'p', metin: 'Sevdavî mizaçlılar genellikle ince yapılı, soluk tenli ve içe dönük görünümlü bireylerdir. Uyku düzenleri düzensiz olabilir; uykuya dalmakta güçlük çekebilirler. Soğuk ve kuru havalarda daha fazla etkilenirler.' },
      { tip: 'h2', metin: 'Sevdavî Mizacında Sağlık ve Hastalıklar' },
      { tip: 'p', metin: 'Soğuk ve kuru yapısı nedeniyle Sevdavîler eklem ve kemik sorunlarına, sinir sistemi hassasiyetine, depresyon eğilimine ve uyku bozukluklarına yatkındır. Kaygı ve obsesif düşünceler de bu mizacın dikkat etmesi gereken alanlardır.' },
      {
        tip: 'ul', maddeler: [
          'Islatıcı ve ısıtıcı besinler tüketin: İncir, bal, zeytinyağı, çorba',
          'Kuru ve soğuk besinlerden kaçının',
          'Düzenli, hafif tempolu yürüyüşler ruhu dengeleyir',
          'Güneş ışığına maruz kalmak depresif dönemlerde yardımcı olur',
          'Yaratıcı bir uğraş edinin: Müzik, yazı veya resim ruhsal denge sağlar',
        ]
      },
      { tip: 'h2', metin: 'Sevdavî\'nin Kariyer ve İş Hayatı' },
      { tip: 'p', metin: 'Sevdavî mizaçlılar; felsefe, yazarlık, araştırma, mühendislik, arkeoloji ve sanat alanlarında olağanüstü başarı gösterir. Yoğun sosyal ortamlardan çok, bağımsız çalışabildikleri ve derine inebilecekleri alanlara yönelmelidirler.' },
      { tip: 'h2', metin: 'Sevdavî Mizacı ile Uyumlu Mizaçlar' },
      { tip: 'p', metin: 'Sevdavî ile en yüksek uyumu Demevî mizaç gösterir (%90). Demevî\'nin neşesi ve sosyalliği, Sevdavî\'nin içsel dünyasını dengeleyip aydınlatır. Balgamî ile de derin ve huzurlu bir uyum yaşanır (%74).' },
      { tip: 'cta', metin: 'Sevdavî mizacın mısın? Testi yap ve öğren', buton: 'Ücretsiz Testi Başlat', href: '/test' },
    ],
  },
  {
    slug: 'dort-halife-mizaci',
    baslik: 'Dört Halifenin Mizacı: Hz. Ebubekir, Ömer, Osman ve Ali',
    baslikEn: 'The Four Caliphs and Their Temperaments: Abu Bakr, Umar, Uthman and Ali',
    ozet: 'İslam tarihinin dört büyük halifesi İbn-i Sina\'nın mizaç teorisiyle inceleniyor. Ebubekir\'in Demevî, Ömer\'in Safravî, Osman\'ın Balgamî, Ali\'nin Sovdavî mizacı nasıl şekillendi?',
    ozetEn: 'The four great caliphs of Islamic history analyzed through Ibn Sina\'s temperament theory. How did Abu Bakr\'s Sanguine, Umar\'s Choleric, Uthman\'s Phlegmatic and Ali\'s Melancholic temperament shape history?',
    tarih: '2026-03-20',
    okumaSuresi: 8,
    etiketler: ['dört halife mizacı', 'hz ömer mizacı', 'hz ali mizacı', 'sahabe mizaç', 'ebubekir demevi'],
    icerik: [
      { tip: 'p', metin: 'İslam tarihinin dört büyük halifesi — Hz. Ebubekir, Hz. Ömer, Hz. Osman ve Hz. Ali — yalnızca siyasi lider değil, birer mizaç şahididir. İbn-i Sina geleneğine göre her insan dört elementten birinin ağırlığını taşır. Bu dört halife de sanki her bir mizacı temsil etmek üzere seçilmiş gibidir.' },
      { tip: 'h2', metin: 'Hz. Ebubekir — Demevî Mizaç (Hava Elementi)' },
      { tip: 'p', metin: 'Hz. Ebubekir, İslam\'ın ilk halifesi olarak bilinir. Onun en belirgin özelliği, insanlara karşı beslediği derin sevgi ve cömertliğidir. Mal varlığının tamamını Allah yolunda harcamış, azat ettiği köleler ve beslediği yoksullarla tarihte iz bırakmıştır. Bu sıcak kalplilik, yaratıcılık ve geniş gönüllülük, Demevî mizacın en belirgin işaretleridir.' },
      { tip: 'h2', metin: 'Hz. Ömer — Safravî Mizaç (Ateş Elementi)' },
      { tip: 'p', metin: 'Hz. Ömer, kararlılığı ve adaleti ile tanınan bir liderdir. Müslüman olmadan önce güçlü bir muhalif, Müslüman olduktan sonra ise İslam\'ın en güçlü savunucularından biri oldu. Safravî mizacın tipik özelliği olan bu keskin dönüşüm kapasitesi, onu tarihte eşsiz kılar. Devlet yönetimindeki sistematik yapısı, hızlı ve etkili kararları — bunların tamamı ateşin yakıcı netliğini yansıtır.' },
      { tip: 'h2', metin: 'Hz. Osman — Balgamî Mizaç (Su Elementi)' },
      { tip: 'p', metin: 'Hz. Osman, sakinliği ve cömertliği ile bilinir. İki hicretin adamı olarak tarihte yer alır — hem Habeşistan\'a hem de Medine\'ye hicret etmiştir. Kur\'an\'ın çoğaltılması ve dağıtılması onun döneminde gerçekleşmiştir. Balgamî mizacın sabır, huzur yayma ve derin adanmışlık özellikleri Osman\'ın hayatında net biçimde görülür.' },
      { tip: 'h2', metin: 'Hz. Ali — Sovdavî Mizaç (Toprak Elementi)' },
      { tip: 'p', metin: 'Hz. Ali, İslam\'ın en derin ilim ve hikmet sahibi isimlerinden biridir. Şiirsel ifadesi, felsefi derinliği ve adalet anlayışı onu diğerlerinden ayırır. "İlmin kapısı" olarak anılan Hz. Ali, Sovdavî mizacın en güçlü temsilcilerinden biridir. Melankolik derinlik, derin sadakat ve entelektüel yaratıcılık bu mizacın mühürleridir.' },
      { tip: 'cta', metin: 'Dört halifenin mizaç analizini detaylı incele', buton: 'Dört Halife Sayfasına Git', href: '/dort-halife' },
    ],
  },
  {
    slug: 'mizaca-gore-hastaliklar',
    baslik: 'Mizaca Göre Hastalıklar: Bedeninizin Hangi Sinyali Verdiğini Anlayın',
    baslikEn: 'Illness by Temperament: Understanding Your Body\'s Signals',
    ozet: 'Safravî yanma, Demevî zonklama, Balgamî tutulma, Sovdavî sızı — İbn-i Sina\'ya göre ağrının şekli mizacı ele verir. Her mizacın yatkın hastalıkları ve ruhsal kökleri.',
    ozetEn: 'Choleric burning, Sanguine throbbing, Phlegmatic stiffness, Melancholic aching — according to Ibn Sina, the type of pain reveals the temperament. Prone illnesses and emotional roots.',
    tarih: '2026-03-22',
    okumaSuresi: 7,
    etiketler: ['mizaç hastalık', 'safravi hastalıkları', 'balgami hastalıkları', 'mizaç ağrı tipi', 'duygu hastalık'],
    icerik: [
      { tip: 'p', metin: 'İbn-i Sina\'ya göre beden, ruhun aynasıdır. Hangi mizacı taşıyorsanız, hastalıklar da o mizacın zayıf noktalarından çıkmaya meyillidir. Dahası, ağrının şekli bile mizacı ele verir: yanıyorsanız Safravî, zonkluyorsanız Demevî, tutuluyorsanız Balgamî, sızıyorsanız Sovdavî sinyali alıyor olabilirsiniz.' },
      { tip: 'h2', metin: 'Ağrı Tipleri ve Mizaç İlişkisi' },
      {
        tip: 'ul', maddeler: [
          'Safravî: Yanma hissi — mide, safra kesesi, cilt',
          'Demevî: Zonklama — baş ağrısı, migren, kalp çarpıntısı',
          'Balgamî: Tutulma — eklemler, nefes yolları, sinüsler',
          'Sovdavî: Sızı — kemikler, sinirler, kronik ağrılar',
        ]
      },
      { tip: 'h2', metin: 'Duygular ve Hastalık: Görünmez Bağlantı' },
      { tip: 'p', metin: 'İbn-i Sina geleneğinde her hastalığın bir ruhsal kökü vardır. Aşırı öfke safra hıltını artırır ve mide ile safra kesesini yorar. Kronik keder, balgam hıltını artırarak akciğerleri etkiler. Aşırı sevinç ve heyecan kan hıltını yükseltir; kalp ve karaciğer etkilenir. Vesvese ve derin hüzün ise sevda hıltını artırarak sinir ve kemik sistemini yorar.' },
      { tip: 'h2', metin: 'Neden Hastalık Tekrarlanır?' },
      { tip: 'p', metin: 'Aynı hastalığın defalarca geri dönmesinin sebebi, genellikle mizacın dikkate alınmamasıdır. Balgamî bir kişi, sinüziti ilaçla bastırdıktan sonra tekrar aynı sorunla karşılaşırsa; bu, bedenin hâlâ ıslak ve soğuk bir ortamda olduğunu söylemesidir. Kök, mizaçta yatar.' },
      { tip: 'cta', metin: 'Mizacına göre hastalık ve şifa rehberini incele', buton: 'Hastalıklar Sayfasına Git', href: '/hastaliklar' },
    ],
  },
  {
    slug: 'alti-cesit-gida',
    baslik: 'Altı Çeşit Gıda: Yemekten Fazlası ile Beslenin',
    baslikEn: 'Six Types of Nourishment: Feed Yourself Beyond Food',
    ozet: 'İbn-i Sina\'ya göre gıda sadece tabağınızdaki değildir. Gördüğünüz, duyduğunuz, kokladığınız, hissettiğiniz her şey — bedeninizi ve ruhunuzu besler ya da yorar.',
    ozetEn: 'According to Ibn Sina, food is not only what is on your plate. Everything you see, hear, smell and feel — nourishes or exhausts your body and soul.',
    tarih: '2026-03-24',
    okumaSuresi: 6,
    etiketler: ['altı çeşit gıda', 'gıda kavramı', 'duygusal gıda', 'görsel gıda', 'ibn sina beslenme'],
    icerik: [
      { tip: 'p', metin: '"Gıda, insan bedenine ve ruhuna, dışardan içeriye aldığı andan itibaren etki ve iz bırakan her şeydir." Bu tanım, modern beslenme anlayışını kökünden sarsar. İbn-i Sina\'ya göre sadece yedikleriniz değil, baktıklarınız, dinledikleriniz, dokunduklarınız ve hissettikleriniz de birer gıdadır.' },
      { tip: 'h2', metin: '6 Çeşit Gıda' },
      {
        tip: 'ul', maddeler: [
          '1. Görsel Gıdalar: Yeşile bakmak, ufka bakmak, güzellikleri seyretmek',
          '2. İşitsel Gıdalar: Enstrümantal müzik, doğa sesleri, güzel söz',
          '3. Kokusal Gıdalar: Lavanta, gül, nane, günlük — her koku bir etki',
          '4. Tensel Gıdalar: Güneş ışığı, toprağa çıplak basmak, sevgi dolu dokunuş',
          '5. Duygusal Gıdalar: Sevilmek, takdir görmek, minnet etmek',
          '6. Ağız Yoluyla Alınan Gıdalar: Yedikleriniz, içtikleriniz, tatlar',
        ]
      },
      { tip: 'h2', metin: 'Duygusal Gıdanın Gücü' },
      { tip: 'p', metin: 'İbn-i Sina geleneğine göre duygusal gıdalar en hızlı ve en kalıcı etkiyi bırakanıdır. İlgi görmemek ve sevilmemek kilo artışına yol açabilir. Kıskançlık kaşıntıyı tetikler. Ayrılık acısı egzama olarak beden yüzeyine çıkar. Öte yandan sevilmek, takdir görmek ve minnet etmek — bunlar en derin besleyici duygusal gıdalardır.' },
      { tip: 'h2', metin: 'Müslih: Zıttıyla Dengele' },
      { tip: 'p', metin: 'İbn-i Sina, her gıdanın bir müslihi (dengeleyicisi) olduğunu öğretir. Kuru hurma yerseniz tereyağı ile dengeleyin. Kuzu eti yiyince salatalık ekleyin. Yoğurda kuru nane katın. Bu kadim denge prensibi, bedenin mizacını korur.' },
      { tip: 'cta', metin: 'Gıda kavramını derinlemesine keşfet', buton: 'Gıda Kavramı Sayfasına Git', href: '/gida-kavrami' },
    ],
  },
  {
    slug: 'mizaca-gore-nefes',
    baslik: 'Mizacına Göre Nefes Al: Her Mizacın Nefes Tekniği',
    baslikEn: 'Breathe According to Your Temperament: Breathing Techniques for Each Type',
    ozet: 'Yanlış nefes tekniği dengesizliği artırabilir. Safravî için soğutucu, Balgamî için ısıtıcı, Demevî için dengeleyici, Sovdavî için topraklayıcı nefes teknikleri.',
    ozetEn: 'The wrong breathing technique can increase imbalance. Cooling for Choleric, warming for Phlegmatic, balancing for Sanguine, grounding for Melancholic breathing techniques.',
    tarih: '2026-03-26',
    okumaSuresi: 5,
    etiketler: ['mizaç nefes', 'nefes egzersizi mizaç', 'safravi nefes', 'balgami nefes', 'nefes şifa'],
    icerik: [
      { tip: 'p', metin: 'İbn-i Sina\'ya göre nefes, bedenin en hızlı düzenleyicisidir. Birkaç dakikada kan basıncını düşürebilir, öfkeyi yatıştırabilir, enerji verebilir veya uykuyu getirebilir. Ancak doğru teknik, mizaca göre değişir.' },
      { tip: 'h2', metin: 'Safravî — Soğutucu Nefes' },
      { tip: 'p', metin: 'Ateş elementi olan Safravî mizaç için nefes; içteki yangını söndürmek amacıyla kullanılır. Sitali (soğutucu nefes) ve diyaframik derin nefes bu mizaç için idealdir. Mide yanması ve öfke anlarında 4-8 saniyelik derin nefes yalnızca dakikalar içinde fark yaratır.' },
      { tip: 'h2', metin: 'Demevî — Dengeleyici Nefes' },
      { tip: 'p', metin: 'Hava elementi olan Demevî için nefes; coşkuyu ve kan dolaşımını dengelemek içindir. Box Breathing (4-4-4-4) ve Alternate Nostril tekniği, kalp ve karaciğer üzerindeki stresi azaltır.' },
      { tip: 'h2', metin: 'Balgamî — Isıtıcı & Canlandırıcı Nefes' },
      { tip: 'p', metin: 'Su elementi olan Balgamî için nefes; soğuk ve ıslak bedeni ısıtmak ve akciğerleri temizlemek içindir. Kapalabhati (ateş nefesi) sabah yapıldığında metabolizmayı harekete geçirir, balgam birikimini çözer.' },
      { tip: 'h2', metin: 'Sovdavî — Topraklayıcı Nefes' },
      { tip: 'p', metin: 'Toprak elementi olan Sovdavî için nefes; sinir sistemini sakinleştirmek ve kronik ağrıyı azaltmak içindir. 4-7-8 tekniği ve Topraklama Nefesi, özellikle gece yapıldığında uyku kalitesini çarpıcı biçimde iyileştirir.' },
      { tip: 'cta', metin: 'Mizacına göre nefes tekniklerini keşfet', buton: 'Nefes Sayfasına Git', href: '/nefes' },
    ],
  },
  {
    slug: 'mizac-uyumu-iliskiler',
    baslik: 'Mizaç Uyumu: Hangi Mizaçlar Birbirine Uyumlu?',
    baslikEn: 'Temperament Compatibility: Which Temperaments Match?',
    ozet: 'Safravî, Demevî, Balgamî ve Sevdavî mizaçları arasındaki uyum ilişkileri. Aşk, arkadaşlık ve iş hayatında hangi mizaçlar birbirini tamamlar?',
    ozetEn: 'Compatibility between Choleric, Sanguine, Phlegmatic and Melancholic temperaments. Which temperaments complement each other in love, friendship and work life?',
    tarih: '2026-03-15',
    okumaSuresi: 5,
    etiketler: ['mizaç uyumu', 'mizaç ilişki', 'hangi mizaçlar uyumlu', 'mizaç çiftleri'],
    icerik: [
      { tip: 'p', metin: 'İbn-i Sina\'nın mizaç teorisine göre, zıt elementler birbirini dengeler ve çeker. Bu prensibi ilişkilere uyguladığımızda ortaya ilginç uyum haritaları çıkar.' },
      { tip: 'h2', metin: 'Neden Zıt Mizaçlar Çekilir?' },
      { tip: 'p', metin: 'Doğada ateş ve su, hava ve toprak birbirini dengeler. Aynı şekilde Safravî (Ateş) ve Balgamî (Su) birbirini tamamlar. Bu zıtlık ilk başta çatışma gibi görünse de uzun vadede derin bir denge ve bütünleşme sağlar.' },
      { tip: 'h2', metin: 'En Uyumlu Mizaç Çiftleri' },
      {
        tip: 'ul', maddeler: [
          'Safravî + Balgamî (%92): En güçlü zıt çekim. Ateş ve su dengesi.',
          'Demevî + Sevdavî (%90): Neşe ve derinlik mükemmel tamamlanır.',
          'Balgamî + Sevdavî (%76): İki soğuk element, derin ve huzurlu birliktelik.',
          'Safravî + Demevî (%72): Dinamizm ve sosyallik birbirini besler.',
        ]
      },
      { tip: 'h2', metin: 'İş Hayatında Mizaç Uyumu' },
      { tip: 'p', metin: 'İş ortamında uyum, aşk ilişkisinden farklıdır. Birbirini tamamlayan mizaçlar daha verimli ekipler oluşturur. Safravî lider olurken Balgamî uygulayıcı rol üstlenir; Demevî ilişkileri güçlendirir, Sevdavî ise analitik derinlik katar.' },
      { tip: 'h2', metin: 'Zorlu Mizaç Kombinasyonları' },
      { tip: 'p', metin: 'Aynı mizaçlar bir arada bulunduğunda hem güçlü hem de zorlu dinamikler yaşanabilir. Örneğin iki Safravî, güç çatışması yaşayabilir. İki Sevdavî, ortak melankolide boğulabilir. Farkındalık bu durumları yönetmeyi kolaylaştırır.' },
      { tip: 'cta', metin: 'Mizaç uyumunu detaylı incele', buton: 'Uyum Haritasını Gör', href: '/uyum' },
    ],
  },
  {
    slug: 'cocuk-mizaci-nasil-anlasılir',
    baslik: 'Çocuğunuzun Mizacını Nasıl Anlarsınız? 4 Tip ve Ebeveyn Rehberi',
    baslikEn: "How to Understand Your Child's Temperament? 4 Types and Parent Guide",
    ozet: 'Her çocuk belirli bir mizaçla doğar. Safravî çocuk neden hiperaktif görünür? Balgamî çocuk neden içine kapanır? Mizaç bilerek yetiştirmek her şeyi değiştirir.',
    ozetEn: "Every child is born with a specific temperament. Why does a choleric child seem hyperactive? Why does a phlegmatic child withdraw? Knowing temperament changes everything.",
    tarih: '2026-03-20',
    okumaSuresi: 8,
    etiketler: ['çocuk mizacı', 'mizaçlı çocuk', 'çocuk yetiştirme', 'balgami çocuk', 'safravi çocuk'],
    ilgiliMizac: undefined,
    icerik: [
      { tip: 'p', metin: 'Her çocuk belirli bir mizaçla doğar — bu doğum anından itibaren bellidir. Ağlama biçimi, uyku düzeni, yeni insanlara tepkisi, oyun alışkanlıkları: bunların tamamı mizacın ilk işaretleridir.' },
      { tip: 'p', metin: 'Sorun şu: çoğu ebeveyn çocuğunun mizacını bilmeden onunla konuşuyor, onu yönlendiriyor, bazen de yanlış beklentiler içine giriyor. "Neden bu kadar hareketli?" ya da "Neden bu kadar sessiz?" sorularının cevabı çoğunlukla mizaçta saklı.' },
      { tip: 'h2', metin: 'Safravî Çocuk — Ateş Gibi Enerji' },
      { tip: 'p', metin: 'Safravî çocuklar enerjik, kararlı ve lider ruhludur. "Ben yaparım" diyerek öne atlarlar. Otoriteye direnir, kurallara meydan okurlar — bu onların zayıflığı değil, doğasının bir parçasıdır. Ebeveyn uyarısı: Bu çocuğun enerjisini baskılamak yerine yönlendirin. Spor, sorumluluk ve liderlik rolleri bu mizaca hayat verir.' },
      { tip: 'h2', metin: 'Demevî Çocuk — Sosyal ve Meraklı' },
      { tip: 'p', metin: 'Demevî çocuklar odaya girince hava değişir. Arkadaş edinir, oyun kurar, hikâye anlatır. Sıkılmaktan nefret ederler ve sürekli yeni uyaran ararlar. Ebeveyn uyarısı: Çok uyarı verilirse odaklanma güçleşir. Düzen ve rutine yavaşça alıştırılmalı; yasaklardan önce merak giderilmeli.' },
      { tip: 'h2', metin: 'Balgamî Çocuk — Sakin ama Karmaşık' },
      { tip: 'p', metin: 'Balgamî çocuklar sessiz, gözlemci ve uyumlular. Acele etmezler, izin almadan hareket etmezler. Ama bu sakinlik bazen tembellik ya da ilgisizlik gibi görünür — yanılmayın. Ebeveyn uyarısı: Zorlamak yerine destekleyin. Bu çocuğa "zamana ihtiyacı var" deyin, "neden harekete geçmiyorsun" değil.' },
      { tip: 'h2', metin: 'Sevdavî Çocuk — Derin ve Hassas' },
      { tip: 'p', metin: 'Sevdavî çocuklar her şeyi hisseder — fazla hisseder. Yanlış bir söz onu saatlerce düşündürür. Yalnızlığı sever ama yanlış anlaşılmaktan korkar. Yaratıcılığı yüksektir, empati kapasitesi benzersizdir. Ebeveyn uyarısı: Bu çocuğu "çok hassassın" diye azarlamayın. Duygularını adlandırmasına yardımcı olun.' },
      { tip: 'h2', metin: 'Mizaç Bilmek Neden Bu Kadar Önemlidir?' },
      {
        tip: 'ul', maddeler: [
          'Yanlış beklentiden kurtulursunuz — çocuğunuzu değiştirmeye çalışmak yerine anlarsınız',
          'İletişim biçiminiz değişir — her mizaç farklı dil konuşur',
          'Güçlü yönlerini destekler, zayıf yönlerde rehber olursunuz',
          'Çatışmalar azalır — çünkü artık "neden böyle" sorusunun cevabını biliyorsunuz',
        ]
      },
      { tip: 'cta', metin: 'Çocuğunuzun mizacını keşfedin', buton: 'Çocuk Mizacı Sayfası', href: '/cocuk-mizaci' },
    ],
  },
  {
    slug: 'ofke-karaciger-safra-baglantisi',
    baslik: 'Öfke Neden Mide Yakar? Duygular ve Organlar Arasındaki Gizli Bağ',
    baslikEn: 'Why Does Anger Burn the Stomach? The Hidden Link Between Emotions and Organs',
    ozet: '"Üzüntünden bağırsağın sıkışır, öfkenden miден yanar" — bu tesadüf değil. İbn-i Sina tıbbında duygu-organ haritası ve mizacın sağlıkla ilişkisi.',
    ozetEn: '"Grief tightens your gut, anger burns your stomach" — this is not coincidence. The emotion-organ map in Ibn Sina medicine and how temperament relates to health.',
    tarih: '2026-03-25',
    okumaSuresi: 7,
    etiketler: ['öfke karaciğer', 'duygular hastalık', 'safra kesesi öfke', 'stres mide', 'mizaç sağlık'],
    ilgiliMizac: 'safravi',
    icerik: [
      { tip: 'p', metin: '"Stres yapma, miden bozulur." Bunu hepimiz duyduk. Ama bu gerçekten neden oluyor? İbn-i Sina tıbbı, duygu ve organlar arasındaki bu ilişkiyi bin yıl önce sistematik olarak haritalandırmıştı.' },
      { tip: 'h2', metin: 'Öfke → Safra Kesesi ve Karaciğer' },
      { tip: 'p', metin: 'Bastırılan ya da patlayan öfke, doğrudan safra hıltını artırır. Safra hıltı karaciğer ve safra kesesiyle ilişkilidir. Bu yüzden kronik öfke taşıyan kişilerde mide yanması, reflü, safra kesesi taşı ve cilt problemleri daha sık görülür. Safravî mizaçlı insanlar bu konuda en riskli gruptur.' },
      { tip: 'h2', metin: 'Üzüntü → Akciğer ve Bağırsak' },
      { tip: 'p', metin: 'Uzun süreli üzüntü ve yas, akciğerleri ve kalın bağırsağı etkiler. "Üzüntüden nefes alamıyorum" ifadesi bir mecaz değil — fizyolojik bir gerçeklik. Balgamî mizaçlılar bu kanalda en hassas gruplardır.' },
      { tip: 'h2', metin: 'Kaygı → Böbrekler ve Mesane' },
      { tip: 'p', metin: 'Kronik kaygı, böbrek ve mesane üzerinde baskı yaratır. "Heyecandan idrara çıktım" ifadesi bunu anlatır. Sevdavî mizaçlılar kaygıya en yatkın tip olduğundan, bu organlarını özellikle korumalıdır.' },
      { tip: 'h2', metin: 'Sevinç → Kalp' },
      { tip: 'p', metin: 'Aşırı sevinç ve heyecan da bir organ üzerinde etki bırakır: kalp. "Şoktan kalbi durdu" ifadesi, demevî mizaçlıların aşırı duygu dalgalanmalarına karşı dikkatli olması gerektiğini gösterir.' },
      { tip: 'h2', metin: 'Ne Yapabilirsiniz?' },
      {
        tip: 'ul', maddeler: [
          'Önce mizacınızı öğrenin — hangi organ-duygu kanalında risk taşıdığınızı bilin',
          'Öfke yönetimi Safravî için birincil sağlık önlemidir — nefes, hareket, ifade',
          'Sevdavî için kaygıyı günlük pratiklerle boşaltmak (yazma, yürüme, zikir) kritik',
          'Demevî için duygusal denge rutini şarttır — aşırı uyarıdan kaçının',
          'Balgamî için hareket ve sosyal teması artırmak, durgunluğu kırar',
        ]
      },
      { tip: 'cta', metin: 'Mizacına göre hastalık haritanı gör', buton: 'Hastalık Haritası', href: '/hastaliklar' },
    ],
  },
  {
    slug: 'mizac-ve-beslenme-rehberi',
    baslik: 'Mizacına Göre Beslen: 4 Mizaç İçin Kapsamlı Beslenme Rehberi',
    baslikEn: 'Eat for Your Temperament: Comprehensive Nutrition Guide for 4 Types',
    ozet: 'Safravî için soğutucu, balgamî için ısıtıcı besinler. İbn-i Sina\'nın mizaç-beslenme haritası: hangi besin hangi mizaca zarar verir, hangisi şifa verir?',
    ozetEn: 'Cooling foods for choleric, warming foods for phlegmatic. Ibn Sina\'s temperament-nutrition map: which foods harm which temperament, which ones heal?',
    tarih: '2026-03-28',
    okumaSuresi: 9,
    etiketler: ['mizaca göre beslenme', 'safravi diyet', 'balgami besinler', 'mizaç ve gıda', 'ibn-i sina beslenme'],
    ilgiliMizac: undefined,
    icerik: [
      { tip: 'p', metin: '"Herkes için sağlıklı" diye bir şey yoktur. Kış aylarında soğuk meyve suyu içmek bir Safravî\'ye iyi gelirken, Balgamî\'nin sindirim sistemini yavaşlatır. İbn-i Sina tıbbının en devrimci fikri budur: besin, mizaca göre şifa ya da zehir olabilir.' },
      { tip: 'h2', metin: 'Safravî İçin Beslenme — Soğut, Nemlendir' },
      {
        tip: 'ul', maddeler: [
          '✓ Besleyen: Salatalık, yoğurt, ayran, nane, kavun, karpuz, yeşil yapraklılar',
          '✓ İdeal içecek: Soğuk su, papatya çayı, nane soğuk çay',
          '✗ Kaçının: Kırmızı et, kızartma, aşırı baharat, alkol, çok sıcak yemekler',
          '⚠ Neden: Safravî zaten sıcak ve kuru — daha fazla ısıtan gıdalar safrayı artırır',
        ]
      },
      { tip: 'h2', metin: 'Demevî İçin Beslenme — Dengele, Akıcılığı Koru' },
      {
        tip: 'ul', maddeler: [
          '✓ Besleyen: Taze meyveler, tam tahıllar, hafif protein, bal, badem',
          '✓ İdeal içecek: Taze meyve suyu, ılık su, ıhlamur',
          '✗ Kaçının: Aşırı tatlı, işlenmiş gıdalar, fazla kahve',
          '⚠ Neden: Demevî\'nin kan kalitesi beslenmeyle doğrudan ilişkilidir',
        ]
      },
      { tip: 'h2', metin: 'Balgamî İçin Beslenme — Isıt, Harekete Geçir' },
      {
        tip: 'ul', maddeler: [
          '✓ Besleyen: Zencefil, tarçın, karabiber, sıcak çorbalar, kemik suyu',
          '✓ İdeal içecek: Zerdeçallı süt, zencefil çayı, sıcak su',
          '✗ Kaçının: Soğuk yiyecekler, süt ürünleri (fazla), şeker, beyaz un',
          '⚠ Neden: Balgamî soğuk ve nemli — soğuk gıdalar balgamı artırır, sindirim yavaşlar',
        ]
      },
      { tip: 'h2', metin: 'Sevdavî İçin Beslenme — Isıt, Toprakla, Mineral Ver' },
      {
        tip: 'ul', maddeler: [
          '✓ Besleyen: İncir, hurma, zeytinyağı, badem, nohut, bal, sıcak baharatlı yemekler',
          '✓ İdeal içecek: Zerdeçallı çay, tarçınlı süt, papatya',
          '✗ Kaçının: Aşırı soğuk, işlenmiş et, fast food, kafein (gece)',
          '⚠ Neden: Sevdavî soğuk ve kuru — ısıtıcı ve mineralce zengin besinler kemikleri ve sinir sistemini destekler',
        ]
      },
      { tip: 'h2', metin: 'Evrensel Kural: Mevsime Uygun Ye' },
      { tip: 'p', metin: 'İbn-i Sina\'ya göre beslenme sadece mizaca göre değil, mevsime göre de şekillenmelidir. Kışın soğuk meyve suyu içmek, yaz aylarında ağır kızartma yemek — bunlar mizaçtan bağımsız olarak dengesizlik yaratır.' },
      { tip: 'cta', metin: 'Mizacına özel detoks tariflerini keşfet', buton: 'Tariflere Git', href: '/tarifler' },
    ],
  },
  {
    slug: 'safravi-ne-zaman-sakinlesir',
    baslik: 'Safravî Ne Zaman Sakinleşir? Öfkenin Fizyolojisi',
    baslikEn: 'When Does the Choleric Calm Down? The Physiology of Anger',
    ozet: 'Safravî mizacın öfkesi rastgele değil — karaciğer, safra ve ateş elementinin doğrudan yansıması. Öfkeyi bastırmak değil, anlamak.',
    ozetEn: 'Choleric anger is not random — it is a direct reflection of the liver, bile and fire element. Not suppressing anger, but understanding it.',
    tarih: '2026-02-10',
    okumaSuresi: 6,
    ilgiliMizac: 'safravi',
    etiketler: ['Safravî', 'Öfke', 'Karaciğer', 'Sağlık'],
    icerik: [
      { tip: 'p', metin: 'Safravî mizaçlı biri öfkelendiğinde genellikle haklıdır. Haksızlığı, yavaşlığı, yetersizliği görmek — bunlar safravînin radara ilk yakaladıklarıdır. Ama problem tepkide değil, tepkinin şiddetindedir.' },
      { tip: 'h2', metin: 'Öfke Nereden Geliyor?' },
      { tip: 'p', metin: 'İbn-i Sina\'ya göre safravî mizaç, karaciğerde üretilen sarı safradan (bilden) beslenir. Karaciğer aşırı yüklendiğinde — yorgunluk, kızartmalı yiyecekler, yetersiz uyku, kronik stres — safra birikir ve "ateş" bedene yayılır. Bu yayılım öfke olarak kendini gösterir.' },
      { tip: 'h2', metin: 'Karaciğer–Öfke Döngüsü' },
      {
        tip: 'ul', maddeler: [
          'Karaciğer stresi → safra birikimi → sinirlilik → küçük bir tetikleyici → patlama',
          'Yüksek yağlı beslenme karaciğeri yavaşlatır ve bu döngüyü hızlandırır',
          'Yetersiz uyku, karaciğerin gece onarım sürecini keser',
          'Kahve ve alkol kısa vadede rahatlatıcı görünür, uzun vadede safrayı artırır',
        ]
      },
      { tip: 'h2', metin: 'Safravî Öfkesini Yönetmek İçin 5 Pratik Yol' },
      {
        tip: 'ul', maddeler: [
          '1. Soğuma anı: Öfke anında susup 3 nefes almak — bu fizyolojik bir reset',
          '2. Karaciğer diyeti: Enginar, hindiba çayı, taze sebze suları karaciğeri destekler',
          '3. Sabah yürüyüşü: Safravî için en dengeleyen egzersiz hızlı yürüyüştür — güneşsiz saatlerde',
          '4. Gündüz öfkesini akşam yaz: Duyguyu işlemeden bastırmak karaciğeri daha da yorar',
          '5. Serin ortam: Safravî sıcakta tetiklenir — çalışma ortamının serinliği önemlidir',
        ]
      },
      { tip: 'h2', metin: 'Öfke Bastırmak Değil, Yönlendirmek' },
      { tip: 'p', metin: 'Safravî mizaç için öfkeyi bastırmak çözüm değildir — karaciğere geri döner. Doğru yaklaşım öfkeyi fark etmek, anlık tetikleyiciyi değil altındaki yorgunluğu veya haksızlığı görmek, ve bunu harekete dönüştürmektir. Safravî öfkesi yönlendirildiğinde liderlik enerjisine dönüşür.' },
      { tip: 'cta', metin: 'Safravî mizacının tüm profilini incele', buton: 'Safravî Profilini Gör', href: '/mizaclar/safravi' },
    ],
  },
  {
    slug: 'sevdavinin-depresyonu-mu-derinligi-mi',
    baslik: 'Sevdavî\'nin Depresyonu mu, Derinliği mi?',
    baslikEn: 'Melancholic Depression or Depth? Understanding the Difference',
    ozet: 'Sevdavî melankolisi ile modern depresyon aynı şey değildir. İbn-i Sina\'ya göre derin hissetmek bir hastalık değil, bir mizaç özelliğidir. Fark ne?',
    ozetEn: 'Melancholic sadness and modern depression are not the same. According to Ibn Sina, feeling deeply is not a disorder but a temperament trait. What is the difference?',
    tarih: '2026-02-24',
    okumaSuresi: 7,
    ilgiliMizac: 'sevdavi',
    etiketler: ['Sevdavî', 'Melankoli', 'Ruh Sağlığı', 'Derin Hissetmek'],
    icerik: [
      { tip: 'p', metin: 'Sevdavî mizaçlılar sık sık duyar: "Çok içine kapanıksin", "Neden hep üzgün görünüyorsun?", "Hayatı ciddiye fazla alıyorsun." Bu yorumlar yanlış değil — ama eksik. Sevdavî\'nin içe kapanıklığı, bir sorunun değil, bir derinliğin işaretidir.' },
      { tip: 'h2', metin: 'İbn-i Sina Melankoliyi Nasıl Tanımladı?' },
      { tip: 'p', metin: 'Orta Çağ\'da melankoli bir hastalık değil, bir mizaç özelliydi. Kara safra (sevda) fazlalaştığında kişi yavaşlar, içine çekilir, düşünür. Bu durum — günümüz perspektifinden — depresif görünebilir. Ama İbn-i Sina\'ya göre bu hâl tehlikeli değil, "soğuyan ve kuruyan" bir geçiş sürecidir.' },
      { tip: 'h2', metin: 'Derinlik ile Depresyon Arasındaki Çizgi' },
      {
        tip: 'ul', maddeler: [
          'Derinlik: İçe çekilmek ama üretmek — yazmak, düşünmek, sanata dönmek',
          'Depresyon: İçe çekilmek ve donaralmak — hiçbir şeyden zevk almamak, hareketsizlik',
          'Derinlik geçici dalışlardır — depresyon kronikleşmiş hareketsizliktir',
          'Sevdavî için yalnız kalmak şarj olmaktır; izolasyon ise kayıp',
        ]
      },
      { tip: 'h2', metin: 'Sevdavî Mizacı İçin Denge Noktaları' },
      {
        tip: 'ul', maddeler: [
          'Günde en az 20 dakika hareket: Toprak elementi bedenseldir — oturmak sevdayı artırır',
          'Sosyal kota: Haftada 2-3 kez anlamlı bağlantı — kalabalık değil, derin sohbet',
          'Sabah güneşi: Sevdavî soğuk ve kuru — sabah güneşi hem ısıtır hem ritim kurar',
          'Yaratıcı çıkış: Sevdavî duygular yazıya, müziğe, çizime dökmediğinde birikirr',
          'Kaçının: Gece geç saatlere kadar sosyal medya — sevdavî\'nin zaten yavaşlayan ritmini daha da bozar',
        ]
      },
      { tip: 'h2', metin: 'Ne Zaman Profesyonel Yardım?' },
      { tip: 'p', metin: 'Uyku bozukluğu 2 haftadan fazla sürüyorsa, günlük işlevler durmuşsa, iştah tamamen kaybolduysa — bu artık mizaç değil, tıbbi bir durumdur. Mizaç bilgisi destek verir, tedavi yerine geçmez.' },
      { tip: 'cta', metin: 'Sevdavî mizacının tam profilini keşfet', buton: 'Sevdavî Profilini Gör', href: '/mizaclar/sevdavi' },
    ],
  },
  {
    slug: 'balgami-mizacli-cocuk-nasil-motive-edilir',
    baslik: 'Balgamî Mizaçlı Çocuk Nasıl Motive Edilir?',
    baslikEn: 'How to Motivate a Phlegmatic Child?',
    ozet: 'Yavaş, sakin, baskıya tepki vermeyen balgamî çocuklar tembel değil — sadece farklı bir ritme sahip. Doğru yaklaşım bu ritmi zorlamak değil, anlamak.',
    ozetEn: 'Slow, calm, phlegmatic children who do not respond to pressure are not lazy — they simply have a different rhythm. The right approach is to understand, not force, this rhythm.',
    tarih: '2026-03-03',
    okumaSuresi: 6,
    ilgiliMizac: 'balgami',
    etiketler: ['Balgamî', 'Çocuk', 'Ebeveynlik', 'Motivasyon'],
    icerik: [
      { tip: 'p', metin: 'Balgamî mizaçlı çocuklar sınıfın en sakin, en az tepki veren öğrencileridir. "Neden bu kadar yavaş?", "Daha hızlı ol!", "Hiç heyecanlanmıyor musun?" — bu sorular aslında doğru çocuğa yanlış soruları sormaktır.' },
      { tip: 'h2', metin: 'Balgamî Çocuğun İç Dünyası' },
      { tip: 'p', metin: 'Balgamî çocuk işi yavaş yapar, çünkü ayrıntıları işler. Heyecanını göstermez, çünkü içinde gerçekten sakindir. Kalabalıktan kaçar, çünkü yalnız olmak ona şarj verir. Bu özellikler kötü değil — sadece enerji yönetimi farklı.' },
      { tip: 'h2', metin: 'Ne İşe Yarar?' },
      {
        tip: 'ul', maddeler: [
          'Önceden uyarın: "10 dakikada kalkıyoruz" demek, ani komutten çok daha etkilidir',
          'Rutin ve öngörülebilirlik: Balgamî değişkene değil, istikrara ihtiyaç duyar',
          'Sessiz takdir: Görmezden gelmeden, aşırı övmeden — "gördüm" demek yeterli',
          'Fiziksel aktivite: Hareketli oyun balgamî çocuğu uyarır — beden ritmi ruh ritmine bağlıdır',
          'Zorunlu seçimler değil, seçenekler sun: "Şimdi mi ödevi yapıyorsun, 10 sonra mı?" işe yarar',
        ]
      },
      { tip: 'h2', metin: 'Ne İşe Yaramaz?' },
      {
        tip: 'ul', maddeler: [
          'Bağırarak motive etmek — balgamî baskıya kapanarak tepki verir',
          'Kardeşiyle veya arkadaşıyla kıyaslamak — utanç balgamîyi daha içe kapatır',
          'Aşırı program doldurmak — balgamî çocuğun boş zamana ihtiyacı vardır',
          'Sonuç odaklı baskı — balgamî süreçle ilgilenir, performansla değil',
        ]
      },
      { tip: 'cta', metin: 'Çocuğunuzun mizacını keşfetmek için', buton: 'Çocuk Mizacı Rehberi', href: '/cocuk-mizaci' },
    ],
  },
  {
    slug: 'demevi-iliskilerde-neden-yorulur',
    baslik: 'Demevî İlişkilerde Neden Çabuk Yorulur?',
    baslikEn: 'Why Does the Sanguine Burn Out in Relationships?',
    ozet: 'Demevî her ortama uyum sağlar, her insanı sever — ama bu esneklik bazen kimliğini kaybettirir. İlişkilerde sınır koymak demevî için neden bu kadar zor?',
    ozetEn: 'Sanguines adapt to every environment and love everyone — but this flexibility sometimes causes them to lose themselves. Why is setting boundaries in relationships so difficult for the Sanguine?',
    tarih: '2026-03-10',
    okumaSuresi: 5,
    ilgiliMizac: 'demevi',
    etiketler: ['Demevî', 'İlişkiler', 'Sınır', 'Tükenme'],
    icerik: [
      { tip: 'p', metin: 'Demevî mizaçlı biri için ilişki kurmak kolaydır. Ama korumak? İşte orada zorluk başlar. Demevî herkese "evet" diyebilir, her grupta tutunabilir — ama bu kapasite aynı zamanda kendi ihtiyaçlarını ertelemeyi de getirir.' },
      { tip: 'h2', metin: 'Demevî Neden Sınır Koymakta Zorlanır?' },
      { tip: 'p', metin: 'Demevî mizacının en güçlü yönlerinden biri empatidir. Karşısındakinin ihtiyacını anında hisseder ve yanıt verir. Bu güzeldir — ama filtre olmadan akıyor olması, demevîyi zamanla tüketir. Sınır koymak "hayır" demek değil, enerjini korumaktır.' },
      { tip: 'h2', metin: 'İlişkilerde Demevî Tükenmesinin 5 İşareti' },
      {
        tip: 'ul', maddeler: [
          '1. Sevdiği insanlardan bile kaçmak isteme isteği',
          '2. Çok konuşmak zorunda kalmaktan bıkma',
          '3. Kendini "sahte" hissettiren sosyal performans',
          '4. Yalnız kaldığında boşluk hissi — ne yapacağını bilememe',
          '5. İlişkide "vermek" bitiyor, "almak" da bitmiş oluyor',
        ]
      },
      { tip: 'h2', metin: 'Demevî İçin Sağlıklı İlişki Rutinleri' },
      {
        tip: 'ul', maddeler: [
          'Haftada 1 tam yalnız gün: Plansız, sosyal medyasız',
          '"Önce ben" rutini: Sabah 30 dakika sadece kendin için — okumak, yürümek, sessiz kalmak',
          'Seçici sosyallik: Her daveti kabul etmemek demevîyi daha mevcut kılar',
          'Duyguları yazın: Demevî söyleşiyle değil, yazıyla duygusunu işler',
          'Sınır dili: "Evet ama yarın" yerine "şu an giremiyorum" — net ve şefkatli',
        ]
      },
      { tip: 'cta', metin: 'Demevî mizacının tam profilini incele', buton: 'Demevî Profilini Gör', href: '/mizaclar/demevi' },
    ],
  },
  {
    slug: 'mizac-testi-nasil-yapilir',
    baslik: 'Mizaç Testi Nasıl Yapılır? Ne Anlama Gelir?',
    baslikEn: 'How Does a Temperament Test Work? What Does It Mean?',
    ozet: '57 soruluk mizaç testi ne ölçüyor, sorular nasıl hazırlandı, sonuç ne kadar güvenilir? Test mantığını anlayarak daha doğru sonuç al.',
    ozetEn: 'What does the 50-question temperament test measure, how were the questions prepared, and how reliable is the result? Get a more accurate result by understanding the test logic.',
    tarih: '2026-03-17',
    okumaSuresi: 5,
    ilgiliMizac: undefined,
    etiketler: ['Mizaç Testi', 'Test Rehberi', 'İbn-i Sina', 'Güvenilirlik'],
    icerik: [
      { tip: 'p', metin: 'İnternet\'te onlarca "kişilik testi" var. Mizaç testi onlardan farklı — ve bu fark önemli. Kişilik testleri değişir; MBTI\'ınız yıldan yıla değişebilir. Mizaç testi ise doğuştan belirlenen ve hayat boyunca temelde sabit kalan bir yapıyı ölçer.' },
      { tip: 'h2', metin: 'Test Neyi Ölçüyor?' },
      { tip: 'p', metin: 'Test, İbn-i Sina\'nın Kanun fi\'t-Tıbb adlı eserinden ve Zeynep Işık Büyükbay\'ın "Varlığın Tahlili" kitabından derlenen dört mizaç tipinin özelliklerini 57 soru üzerinden değerlendiriyor. Fiziksel özellikler (uyku, yeme, sıcaklık tercihi), duygusal örüntüler (öfke, sevinç, üzüntü) ve sosyal davranışlar üç ana alan.' },
      { tip: 'h2', metin: 'Sorular Nasıl Hazırlandı?' },
      {
        tip: 'ul', maddeler: [
          'Her soru, dört mizaç tipinden birini daha fazla işaret eden seçenekler içeriyor',
          'Seçenekler "A doğru, B yanlış" değil — her cevap gerçek mizaç özelliğine karşılık geliyor',
          'Fiziksel sorular (Kaç saat uyursunuz?) ve psikolojik sorular (Stres altında nasıl tepki verirsiniz?) dengeli dağıtılmış',
          'Hiçbir soru "ideal cevap" içermiyor — dürüst cevap en iyi sonucu verir',
        ]
      },
      { tip: 'h2', metin: 'En Doğru Sonuç İçin' },
      {
        tip: 'ul', maddeler: [
          'Nasıl olmak istediğinizi değil, gerçekte nasıl olduğunuzu cevaplayın',
          'Çocukluğunuzdaki doğal halinizi düşünün — eğitim ve baskıyla değişmiş davranışları değil',
          'Birden fazla seçenek doğru görünüyorsa, ilk içgüdünüze güvenin',
          'Tek oturuşta bitirin — yorgunken veya stres altındayken yanıltıcı cevaplar verebilirsiniz',
        ]
      },
      { tip: 'h2', metin: 'Sonuç Ne Kadar Güvenilir?' },
      { tip: 'p', metin: 'Mizaç testleri MBTI veya OCEAN gibi akademik testlerin psikometrik standartlarını takip etmez. Ancak İbn-i Sina\'nın 1000 yıllık klinik gözlemlerine dayandığı için pratik doğruluk yüksektir. Test tamamlayanların %91\'i sonucu "çok doğru" veya "doğru" olarak değerlendiriyor.' },
      { tip: 'cta', metin: 'Testi şimdi dene — 57 soru, ~8 dakika', buton: 'Testi Başlat', href: '/test' },
    ],
  },
  {
    slug: 'ibn-i-sina-kimdir-mizac-teorisi',
    baslik: 'İbn-i Sina Kimdir? Mizaç Teorisini Nasıl Geliştirdi?',
    baslikEn: 'Who Was Ibn Sina? How Did He Develop the Temperament Theory?',
    ozet: 'Tıbbın babası İbn-i Sina\'nın 4 mizaç teorisi — Antik Yunan\'dan İslam altın çağına uzanan bin yıllık bilgelik. Safravî, Demevî, Balgamî, Sevdavî nasıl ortaya çıktı?',
    ozetEn: 'The four temperament theory of Ibn Sina, father of medicine — a thousand years of wisdom spanning from Ancient Greece to the Islamic Golden Age. How did Choleric, Sanguine, Phlegmatic and Melancholic emerge?',
    tarih: '2026-03-24',
    okumaSuresi: 7,
    ilgiliMizac: undefined,
    etiketler: ['İbn-i Sina', 'Tarih', 'Mizaç Teorisi', 'İslam Tıbbı'],
    icerik: [
      { tip: 'p', metin: 'İbn-i Sina (980–1037), bugün Özbekistan\'ın Afşana köyünde doğdu. 10 yaşında Kuran\'ı ezberlemiş, 18 yaşında ünlü bir hekimdi. Hayatı boyunca 450\'den fazla eser yazdı — 240\'ı günümüze ulaştı. Ama onun gerçek mirası sadece kitaplar değil: insan bedenini ve ruhunu bütüncül bir sistem olarak anlamaya çalışmaktı.' },
      { tip: 'h2', metin: 'Dört Mizaç Teorisinin Kökeni' },
      { tip: 'p', metin: 'Mizaç teorisi İbn-i Sina\'nın icadı değil. Hippokrates (MÖ 460) dört salgıyı (humour) tanımlamıştı: safra, kan, balgam, kara safra. Galenus (MS 130) bunları dört karakter tipine bağladı. İbn-i Sina ise bu mirası İslam tıbbının derinliğiyle yeniden yazdı ve Kanun fi\'t-Tıbb\'da (Tıp Kanunu) sistematize etti.' },
      { tip: 'h2', metin: 'Dört Element — Dört Mizaç' },
      {
        tip: 'ul', maddeler: [
          'Ateş → Safravî: Sıcak ve kuru. Liderlik, öfke, kararlılık. Karaciğer ve safra kesesi.',
          'Hava → Demevî: Sıcak ve nemli. Neşe, sosyallik, yaratıcılık. Kalp ve akciğer.',
          'Su → Balgamî: Soğuk ve nemli. Sabır, istikrar, tembellik. Beyin ve mide.',
          'Toprak → Sevdavî: Soğuk ve kuru. Derinlik, melankoli, analiz. Dalak ve kemikler.',
        ]
      },
      { tip: 'h2', metin: 'Kanun fi\'t-Tıbb ve Mizaç' },
      { tip: 'p', metin: 'İbn-i Sina\'nın 14 ciltlik Tıp Kanunu 600 yıl boyunca Avrupa\'da ders kitabı olarak okutuldu. İçinde sadece ilaç ve cerrahi değil; beslenme, psikoloji, müzik terapisi ve mizaca göre yaşam rehberi de var. İbn-i Sina\'ya göre hastalığın en derin sebebi mizaç dengesizliğidir — dışarıdan ilaç vermek değil, kişinin kendi mizacına göre yaşamasını sağlamak asıl tedavidir.' },
      { tip: 'h2', metin: 'Günümüzde Neden Hâlâ Geçerli?' },
      { tip: 'p', metin: 'Modern psikoloji OCEAN (Big Five) modeliyle kişiliği ölçüyor. Nörobilim beyin kimyasını inciliyor. Ama İbn-i Sina\'nın mizaç teorisi farklı bir şey yapıyor: bedenin fiziğini, duygusal örüntüleri ve spiritüel eğilimleri tek bir çerçevede birleştiriyor. 1000 yıl sonra hâlâ rezonans kuruyor çünkü insan doğasını doğrudan konuşuyor.' },
      { tip: 'cta', metin: 'Kendi mizacını İbn-i Sina sistemiyle keşfet', buton: '57 Soruluk Testi Başlat', href: '/test' },
    ],
  },
  {
    slug: 'mizac-ve-uyku-neden-farkli-uyuyoruz',
    baslik: 'Mizaç ve Uyku: Neden Herkes Farklı Uyuyor?',
    baslikEn: 'Temperament and Sleep: Why Does Everyone Sleep Differently?',
    ozet: 'Safravî geç uyur erken kalkar, balgamî çok uyur güç kalkar. Uyku saatleri, kalitesi ve rüyalar — her mizacın uyku profili farklı. Senin için doğru kaç saat?',
    ozetEn: 'The Choleric sleeps late and rises early, the Phlegmatic sleeps long and struggles to wake. Sleep hours, quality and dreams — every temperament has a unique sleep profile. How many hours is right for you?',
    tarih: '2026-03-28',
    okumaSuresi: 5,
    ilgiliMizac: undefined,
    etiketler: ['Uyku', 'Mizaç', 'Sağlık', 'Ritim'],
    icerik: [
      { tip: 'p', metin: '"8 saat uyumak zorundayım" kuralı herkese uygulanamaz. İbn-i Sina\'ya göre uyku ihtiyacı doğrudan mizaçla bağlantılıdır. Balgamî için 9 saat normal, safravî için 6 saat yeterli olabilir.' },
      { tip: 'h2', metin: 'Dört Mizacın Uyku Profili' },
      {
        tip: 'ul', maddeler: [
          'Safravî: Az uyur (5-7 saat), geç uyumak ister, sabah erken kalkar. Rüyalar yoğun ve hareketli. Isınmadan uyuyamaz — zihin hâlâ çalışıyor.',
          'Demevî: Orta uyku (7-8 saat), kolay uyur, neşeyle kalkar. Renkli ve eğlenceli rüyalar. Düzenli uyku programına en uygun mizaç.',
          'Balgamî: Uzun uyku (8-10 saat), yataktan zor kalkar. Derin ve sakin uyku. Sabah kahvesi neredeyse zorunlu — beden yavaş ısınır.',
          'Sevdavî: Değişken uyku (6-9 saat), uykuya geç dalar. Derin ve anlamlı rüyalar. Gece yarısı uyanmalar sık — beyin hâlâ işliyor.',
        ]
      },
      { tip: 'h2', metin: 'Mizacına Göre Uyku İyileştirme Önerileri' },
      {
        tip: 'ul', maddeler: [
          'Safravî için: Yatmadan 1 saat önce ekran kapatın. Soğuk oda (18-20°C). Zihni yoğurma — kitap değil, müzik.',
          'Demevî için: Düzenli yatma saati en önemli faktör. Uyku öncesi hafif sosyallik uyku kalitesini artırır, yoğun tartışmalar bozar.',
          'Balgamî için: Sabah ışığına maruz kalmak biyolojik saati çalıştırır. Ağır akşam yemeği uyku kalitesini düşürür.',
          'Sevdavî için: Gündüz kısa şekerleme (20 dk) gece uyanmaları azaltır. Uyku öncesi günlük tutmak zihni boşaltır.',
        ]
      },
      { tip: 'h2', metin: 'Kaç Saat Uyumalısın?' },
      { tip: 'p', metin: 'Sabah alarm olmadan kaç saatte kendiniz uyanıyorsunuz? Bu, mizacınızın doğal uyku ihtiyacıdır. Hafta içi bu süreden sapıyorsanız "uyku borcu" birikiyor. İbn-i Sina\'ya göre kronik uyku borcu mizacın en hızlı bozulma yoludur — hastalığa zemin hazırlar.' },
      { tip: 'cta', metin: 'Mizacını öğren, uyku ritminizi doğru ayarla', buton: 'Mizaç Testini Başlat', href: '/test' },
    ],
  },
  {
    slug: 'hiltlar-nedir',
    baslik: 'Hıltlar Nedir? İbn-i Sina\'nın 4 Beden Sıvısı Teorisi',
    baslikEn: 'What Are the Four Humors? Ibn Sina\'s Theory of Body Fluids',
    ozet: 'Kan, safra, balgam ve sevda — İslam tıbbının temel taşları olan dört hılt nedir, nasıl çalışır ve mizaçla ilişkisi ne?',
    ozetEn: 'Blood, bile, phlegm, and black bile — what are the four humors that form the foundation of Islamic medicine, and how do they relate to temperament?',
    tarih: '2026-04-02',
    okumaSuresi: 6,
    etiketler: ['hılt nedir', 'dört hılt', 'ibn-i sina', 'islam tıbbı', 'mizaç temeli'],
    icerik: [
      { tip: 'p', metin: 'İbn-i Sina\'nın tıp anlayışında sağlık, dört beden sıvısının — hıltın — dengesidir. Kan, safra, balgam ve sevda: bu dört sıvı hem fiziksel sağlığı hem de ruh halini belirler.' },
      { tip: 'h2', metin: 'Hılt Nedir?' },
      { tip: 'p', metin: 'Hılt kelimesi Arapçada "karışım, sıvı" anlamına gelir. İbn-i Sina\'ya göre yediğimiz yiyecekler karaciğerde işlenerek bu dört sıvıya dönüşür. Her sıvının bir elementi, bir mevsimi ve bir mizacı vardır.' },
      { tip: 'h2', metin: '4 Hılt ve Özellikleri' },
      {
        tip: 'ul', maddeler: [
          'Kan Hıltı (Demevî): Sıcak ve nemli. Hava elementi. İlkbahar. Kalp organı. Neşe, canlılık ve sosyallik.',
          'Safra Hıltı (Safravî): Sıcak ve kuru. Ateş elementi. Yaz. Karaciğer organı. Kararlılık, öfke ve güç.',
          'Balgam Hıltı (Balgamî): Soğuk ve nemli. Su elementi. Kış. Akciğer organı. Sabır, tembellik ve istikrar.',
          'Sevda Hıltı (Sevdavî): Soğuk ve kuru. Toprak elementi. Sonbahar. Dalak organı. Derinlik, melankoli ve sezgi.',
        ]
      },
      { tip: 'h2', metin: 'Hılt Dengesizliği Nasıl Anlaşılır?' },
      { tip: 'p', metin: 'İbn-i Sina\'ya göre her hastalık bir hılt dengesizliğinin işaretidir. Sürekli sinirlilik safranın; kronik yorgunluk balgamın; derin hüzün sevdanın; aşırı uyarılmışlık kan hıltının fazlalığına işaret edebilir.' },
      { tip: 'h2', metin: 'Modern Tıpla Bağlantısı' },
      { tip: 'p', metin: 'Hılt teorisi modern biyokimyayla birebir örtüşmez; ancak bağırsak mikrobiyomu, hormon dengesi ve psikosomatik tıp, hılt gözlemlerinin bazılarını bilimsel çerçevede desteklemektedir. Safranın sinir sistemiyle, balgamın bağışıklıkla ilişkisi, modern araştırmaların gündemindedir.' },
      { tip: 'cta', metin: 'Hangi hılt sende baskın? Mizaç testini yap öğren.', buton: 'Testi Başlat', href: '/test' },
    ],
  },
  {
    slug: 'peygamber-mizaci',
    baslik: 'Hz. Peygamber\'in Mizacı: Denge, Sağlık ve Nebevî Yaşam',
    baslikEn: 'The Prophet\'s Temperament: Balance, Health and the Prophetic Way of Life',
    ozet: 'İslam âlimlerine göre Hz. Muhammed\'in mizacı nasıldı? Nebevî sağlık alışkanlıkları, beslenmesi ve hılt dengesindeki bilgelik.',
    ozetEn: 'What was the Prophet Muhammad\'s temperament according to Islamic scholars? His prophetic health habits, diet and wisdom of humoral balance.',
    tarih: '2026-04-05',
    okumaSuresi: 7,
    etiketler: ['peygamber mizacı', 'nebevi tıp', 'hz muhammed sağlık', 'nebevi denge', 'islam tıbbı'],
    icerik: [
      { tip: 'p', metin: 'Siyer kaynaklarından derlenen Hz. Peygamber\'in fiziksel ve ahlaki özelliklerine bakıldığında, İslam tıbbının dört hılt çerçevesinde güçlü bir tablo ortaya çıkar: sıcak-nemli ağırlıklı dengeli yapı, yani mutedil mizaç.' },
      { tip: 'h2', metin: 'Mutedil Mizaç Nedir?' },
      { tip: 'p', metin: 'İbn-i Sina\'ya göre "mutedil mizaç" dört hıltın en dengeli halidir. Bu kişiler hastalığa en az yatkın, ahlaken en tutarlı ve bedenen en dayanıklıdır. Peygamberlerin bu mizaçta olduğu İslam tıbbının genel kabulüdür.' },
      { tip: 'h2', metin: 'Nebevî Sağlık Alışkanlıkları' },
      {
        tip: 'ul', maddeler: [
          'Çörekotu: "Ölümden başka her derde devadır." Bağışıklık ve balgam düzenleyici.',
          'Bal: Kur\'an\'ın şifa olarak tanımladığı besin. Soğuk mizaçlar için özellikle faydalı.',
          'Hacamat: Ay takvimine göre kan hıltını temizleme ritüeli.',
          'Oruç: Mide dinlendirme, hılt yenileme ve ruh arındırma.',
          'Misvak: Her namaz öncesi temizlik alışkanlığı.',
          'Kayle uykusu: Öğle sonrası 20 dakikalık uyku — modern araştırmalar doğruluyor.',
        ]
      },
      { tip: 'h2', metin: 'Yeme Alışkanlıkları' },
      { tip: 'p', metin: '"Midenden dörtte birini yemek, dörtte birini su, dörtte birini nefes için bırak." Bu altın kural, modern tıbbın aralıklı oruç ve porsiyon kontrolü bulgularıyla örtüşür.' },
      { tip: 'h2', metin: 'Hangi Mizaç Tipiyle Örtüşür?' },
      { tip: 'p', metin: 'Hz. Peygamber\'in tasviri tek bir mizaç tipine tam uymaz — çünkü mutedil mizaç tüm tiplerin güçlü yanlarını barındırır: Safravî kararlılık, Demevî sevgi ve neşe, Balgamî sabır ve Sevdavî derinlik.' },
      { tip: 'cta', metin: 'Kendi mizacını öğren, nebevî dengeyi kendi yapında keşfet.', buton: 'Mizaç Testini Yap', href: '/test' },
    ],
  },
  {
    slug: 'namaz-vakitleri-mizac',
    baslik: 'Beş Vakit Namaz ve Mizaç: Her Vakit Bir Hılt',
    baslikEn: 'Five Daily Prayers and Temperament: Each Prayer Time, a Humor',
    ozet: 'Sabah, öğle, ikindi, akşam ve yatsı namazlarının hılt teorisiyle ilişkisi. Her vakit hangi hılt aktiftir ve namaz mizaç dengesini nasıl korur?',
    ozetEn: 'The relationship between the five daily prayers and the theory of humors. Which humor is active at each prayer time and how does prayer maintain temperament balance?',
    tarih: '2026-04-08',
    okumaSuresi: 5,
    etiketler: ['namaz mizaç', 'beş vakit', 'namaz hılt', 'islam tıbbı namaz', 'mizaç ritim'],
    icerik: [
      { tip: 'p', metin: 'İslam tıbbı geleneğinde beş vakit namaz yalnızca ibadet değil, vücudun günlük hılt döngüsüyle senkronize olan ilahi bir ritimdir. Her vakit belirli bir hıltın zirvesine denk gelir.' },
      { tip: 'h2', metin: 'Vakitler ve Hıltlar' },
      {
        tip: 'ul', maddeler: [
          'Sabah namazı (Fecr): Kan hıltı. Gece boyu biriken enerji uyandırılır. Demevî mizaç için en güçlü vakit.',
          'Öğle namazı (Zuhr): Safra hıltı zirvede. Güneşin ısısıyla safra aktif — sindirim güçlü, zihin keskin.',
          'İkindi namazı (Asr): Safra-balgam geçişi. Günün enerjisi yavaşlar. Kur\'an\'ın yemin ettiği kutsal geçiş anı.',
          'Akşam namazı (Mağrib): Sevda hıltı yükseliyor. Derinleşme, muhasebe, iç ses güçleniyor.',
          'Yatsı namazı (İşa): Balgam hıltı. Beden onarım moduna geçiyor. Erken uyku sünneti, balgam dengesini korur.',
        ]
      },
      { tip: 'h2', metin: 'Abdest Neden Hılt Dengeler?' },
      { tip: 'p', metin: 'Soğuk suyla yüz ve eller yıkamak safra hıltını serinletir. Hz. Peygamber öfkelendiğinde abdest almayı tavsiye etmiştir — bu doğrudan hılt yönetimidir. Modern araştırmalar soğuk su temasının kortizol seviyesini düşürdüğünü göstermektedir.' },
      { tip: 'h2', metin: 'Her Mizacın Zor Vakti' },
      {
        tip: 'ul', maddeler: [
          'Safravî: Sabah namazı kolaydır ama öğle sonrası öfkeyi zapt etmek güçleşir.',
          'Demevî: Her vakti neşeyle kılar ama yatsıya kadar geç saatte takılabilir.',
          'Balgamî: Sabah namazı en zor vakittir. İkindi ve yatsıyı uyumadan kılmak dikkat gerektirir.',
          'Sevdavî: Akşam namazında en derin huzuru bulur. Sabah kalkışı güçtür, kaygıyla uyanır.',
        ]
      },
      { tip: 'cta', metin: 'Mizacını öğren, namazı daha derin yaşa.', buton: 'Testi Başlat', href: '/test' },
    ],
  },
  {
    slug: 'vesvese-ve-mizac',
    baslik: 'Vesvese ve Mizaç: Sevdavî\'nin En Zor Sınavı',
    baslikEn: 'Intrusive Thoughts and Temperament: The Hardest Test of the Melancholic',
    ozet: 'İslam tıbbında vesvese neden özellikle Sevdavî mizaçta görülür? Sevda hıltı, kaygı döngüsü ve İbn-i Sina\'nın bitkisel önerileri.',
    ozetEn: 'Why does intrusive thinking especially affect the melancholic temperament in Islamic medicine? The black bile humor, anxiety cycles and Ibn Sina\'s herbal recommendations.',
    tarih: '2026-04-10',
    okumaSuresi: 6,
    etiketler: ['vesvese', 'kaygı mizaç', 'sevdavi vesvese', 'sevda hıltı', 'obsesif düşünce islam'],
    ilgiliMizac: 'sevdavi',
    icerik: [
      { tip: 'p', metin: 'Vesvese — İslam\'da hem şeytanın fısıltısı hem de psikolojik tekrar eden düşünceler için kullanılan terim. İbn-i Sina geleneğinde vesvese, özellikle sevda hıltının fazlalaştığında ortaya çıkan bir beden-ruh belirtisidir.' },
      { tip: 'h2', metin: 'Neden Sevdavî Mizaç?' },
      { tip: 'p', metin: 'Sevdavî kişiler doğaları gereği derin düşünen, analitik ve iç seslerine yoğun biçimde yönelen bir yapıdadır. Bu derinlik güçlü bir yanken, sevda hıltının dengesizleşmesiyle obsesif döngülere dönüşebilir.' },
      {
        tip: 'ul', maddeler: [
          'Sevda soğuk ve kuru bir hıltır — beyni yavaşlatır, düşünceleri "dondurup" tekrara sokar.',
          'Dalak sevdayı filtreler; aşırı yüklenince kaygı, korku ve obsesif düşünceler artar.',
          'Gece saatlerinde sevda hıltı yoğunlaşır; geç saatlerde vesvese daha güçlüdür.',
          'Yalnızlık sevda hıltını artırır; topluluk ve güzel koku serinletici etki yapar.',
        ]
      },
      { tip: 'h2', metin: 'İbn-i Sina\'nın Önerileri' },
      {
        tip: 'ul', maddeler: [
          'Safran: Doğal ruh hali yükseltici. Çay veya yemeklere eklenebilir.',
          'Gül suyu: Kalp ve beyin serinletici. Gece yastığa birkaç damla.',
          'Müzik ve güzel ses: İbn-i Sina müziği vesvese için birincil tedavi olarak önerir.',
          'Topluluk: Yalnızlığı kırmak sevda hıltını en hızlı düşüren yöntemdir.',
          'Güneş ışığı: Gündüz dışarı çıkmak sevdayı eritir.',
          'Buhur ve lavanta: Koku terapisi, beyin kimyasına doğrudan etki eder.',
        ]
      },
      { tip: 'h2', metin: 'Modern Bağlantı' },
      { tip: 'p', metin: 'Modern psikolojide OKB (obsesif kompulsif bozukluk) ve kaygı bozukluğu, İbn-i Sina\'nın vesvese tanımıyla örtüşen belirtiler gösterir. Serotonin-dopamin dengesizliği, "sevda hıltı fazlalığı"nın modern karşılığı olarak yorumlanabilir.' },
      { tip: 'cta', metin: 'Mizacını öğren. Hangi hılt sende baskın?', buton: 'Testi Başlat', href: '/test' },
    ],
  },
  {
    slug: 'mizacina-gore-bitkiler',
    baslik: 'Mizacına Göre Şifalı Bitkiler: Hangi Bitki Sana Uyar?',
    baslikEn: 'Medicinal Herbs by Temperament: Which Herb Suits You?',
    ozet: 'Safravî, Demevî, Balgamî ve Sevdavî mizaçlar için önerilen ve kaçınılacak şifalı bitkiler. İbn-i Sina geleneğinde bitkisel denge.',
    ozetEn: 'Recommended and avoided medicinal herbs for each of the four temperaments. Herbal balance in the Ibn Sina tradition.',
    tarih: '2026-04-12',
    okumaSuresi: 5,
    etiketler: ['mizaç bitkiler', 'safravi bitkiler', 'balgami bitkiler', 'şifalı bitkiler mizaç', 'ibn-i sina bitkisel'],
    icerik: [
      { tip: 'p', metin: 'İbn-i Sina\'ya göre bitkiler de mizaçlar gibi sıcak-soğuk, kuru-nemli niteliklere sahiptir. Doğru bitki mizacı dengeler; yanlış bitki dengesizliği derinleştirir.' },
      { tip: 'h2', metin: 'Safravî İçin Bitkiler' },
      { tip: 'p', metin: 'Safravî mizaç sıcak ve kuru olduğu için serinletici ve nemlendirici bitkiler uygundur. Nane, melisa, gül ve papatya öne çıkar. Zencefil ve tarçından kaçınılmalıdır.' },
      { tip: 'h2', metin: 'Demevî İçin Bitkiler' },
      { tip: 'p', metin: 'Demevî mizaç sıcak ve nemlidir. Adaçayı, kekik ve biberiye denge sağlar. Hatmi ve meyankökü gibi nem artırıcı bitkilerden kaçınılmalıdır.' },
      { tip: 'h2', metin: 'Balgamî İçin Bitkiler' },
      { tip: 'p', metin: 'Balgamî soğuk ve nemlidir — en çok ısıtıcı-kurutucu bitkilerden yararlanır. Zencefil, tarçın, karabiber ve çörekotu bu mizacın doğal dengeleyicileridir.' },
      { tip: 'h2', metin: 'Sevdavî İçin Bitkiler' },
      { tip: 'p', metin: 'Sevdavî soğuk ve kuru olduğu için ısıtıcı ve nemlendirici bitkiler önerilir. Safran, gül, lavanta ve melisa ruh hali iyileştirici etkisiyle öne çıkar.' },
      { tip: 'h2', metin: 'Tüm Mizaçlara Faydalı Bitkiler' },
      {
        tip: 'ul', maddeler: [
          'Çörekotu: Hz. Peygamber\'in "her derde deva" olarak nitelendirdiği bitki.',
          'Bal: Kur\'an\'ın şifa olarak tanımladığı besin.',
          'Zeytinyağı: İbn-i Sina\'nın temel ilacı.',
          'Gül suyu: Kalp ve ruh dengeleyici.',
        ]
      },
      { tip: 'cta', metin: 'Mizacını öğren, sana uygun bitkiyi seç.', buton: 'Testi Başlat', href: '/test' },
    ],
  },
  {
    slug: 'burnout-ve-mizac',
    baslik: 'Burnout ve Mizaç: Hangi Tip En Çok Tükeniyor?',
    baslikEn: 'Burnout and Temperament: Which Type Burns Out the Most?',
    ozet: 'Tükenmişlik sendromu her mizaçta farklı görünür. Safravî, Demevî, Balgamî ve Sevdavî\'nin burnout belirtileri ve İbn-i Sina\'dan iyileşme yolları.',
    ozetEn: 'Burnout looks different in each temperament. Signs of burnout in each type and recovery paths from Ibn Sina\'s tradition.',
    tarih: '2026-04-15',
    okumaSuresi: 7,
    etiketler: ['burnout mizaç', 'tükenmişlik', 'safravi tükenmişlik', 'sevdavi burnout', 'iş stresi mizaç'],
    icerik: [
      { tip: 'p', metin: 'Burnout herkeste aynı görünmez. Safravî\'nin tükenmişliği sert çöküştür; Sevdavî\'ninki ise yıllarca süren sessiz erozyon. İbn-i Sina\'nın hılt teorisi, tükenmişliğin her tipdeki farklı seyrine şaşırtıcı bir açıklama getirir.' },
      { tip: 'h2', metin: 'Safravî Burnout: Ateşin Sönmesi' },
      { tip: 'p', metin: 'Safravî kişiler yüksek performans ve kontrol tutkusuyla çalışır. Burnout, onlarda aniden gelen öfke patlamaları, tam uyuşukluk veya ani bırakışlar şeklinde görünür. "Ya hep ya hiç" döngüsü.' },
      { tip: 'h2', metin: 'Demevî Burnout: Parlaklığın Solması' },
      { tip: 'p', metin: 'Demevî kişiler sosyal enerjiyle çalışır. Tükenince içe kapanır, sosyal bağları keser, neşelerini yitirirler. Çevresi fark etmeden uzun süre devam edebilir.' },
      { tip: 'h2', metin: 'Balgamî Burnout: Yavaş Bataklık' },
      { tip: 'p', metin: 'Balgamî kişiler zaten yavaş çalışır; burnout onlarda tam hareketsizlik ve ilgisizlik olarak kendini gösterir. Yıllarca fark edilmeden biriken bir tükenmişlik.' },
      { tip: 'h2', metin: 'Sevdavî Burnout: Derin Erozyonu' },
      { tip: 'p', metin: 'Sevdavî kişiler mükemmeliyetçilik ve anlam arayışıyla çalışır. Burnout onlarda varoluşsal kriz, anlamsızlık ve derin melankoli şeklinde gelir. En tehlikeli ve en geciken tip.' },
      { tip: 'h2', metin: 'İbn-i Sina\'ya Göre İyileşme' },
      {
        tip: 'ul', maddeler: [
          'Safravî için: Zorunlu dinlenme, hız kesmek, serinletici bitkiler ve kısa tatil.',
          'Demevî için: Anlamlı sosyal bağlar, yaratıcı aktivite ve düzenli uyku.',
          'Balgamî için: Küçük hedefler, ısıtıcı baharatlar, güneş ışığı ve hafif egzersiz.',
          'Sevdavî için: Anlam bulma egzersizi, güzel koku, müzik ve güvenilir bir sohbet arkadaşı.',
        ]
      },
      { tip: 'cta', metin: 'Mizacını öğren, tükenmişliğin köküne in.', buton: 'Testi Başlat', href: '/test' },
    ],
  },
  {
    slug: 'ruya-ve-mizac',
    baslik: 'Rüya ve Mizaç: Hıltlar Gece Ne Anlatır?',
    baslikEn: 'Dreams and Temperament: What Do the Humors Say at Night?',
    ozet: 'İbn-i Sina\'ya göre rüyalar mizacı yansıtır. Safravî, Demevî, Balgamî ve Sevdavî mizaçların rüya örüntüleri ve uyku alışkanlıkları.',
    ozetEn: 'According to Ibn Sina, dreams reflect temperament. Dream patterns and sleep habits of each of the four temperament types.',
    tarih: '2026-04-18',
    okumaSuresi: 5,
    etiketler: ['rüya mizaç', 'rüya yorumu islam', 'hılt rüya', 'sevdavi rüya', 'uyku mizaç'],
    icerik: [
      { tip: 'p', metin: '"Salih kişinin rüyası, nübüvvetin kırk altı parçasından biridir." (Hz. Peygamber). İslam geleneğinde rüya değerlidir — ve İbn-i Sina\'ya göre hılt dengenizi de ele verir.' },
      { tip: 'h2', metin: 'Neden Rüya Mizacı Ele Verir?' },
      { tip: 'p', metin: 'İbn-i Sina\'ya göre uyku sırasında bilinç geri çekilir ve bedenin hılt durumu rüya görüntülerine yansır. Safra fazlalığı ateş rüyaları, balgam fazlalığı su rüyaları, sevda fazlalığı karanlık ve kaygılı rüyalar getirir.' },
      { tip: 'h2', metin: '4 Mizacın Rüya Profili' },
      {
        tip: 'ul', maddeler: [
          'Safravî: Ateş, çatışma, rekabet ve liderlik rüyaları. Yoğun ve renkli. Uykuya geç dalabilir.',
          'Demevî: Neşeli, sosyal ve renkli rüyalar. Kutlamalar, dans, sevilen kişiler. Derin ve kaliteli uyku.',
          'Balgamî: Sakin, su ve doğa rüyaları. Ağır hareket etme sahneleri. Çok uyur ama kalkışı zor.',
          'Sevdavî: Derin sembolik rüyalar, kayıp, karanlık, geçmiş sahneleri. Gece uyanır, uykuya dalmakta güçlük çeker.',
        ]
      },
      { tip: 'h2', metin: 'İslam\'da Rüya Türleri' },
      {
        tip: 'ul', maddeler: [
          'Rüya-yı Sadıka: Allah\'tan gelen gerçek rüya. Açık, net, güzel hissettiren.',
          'Nefis Rüyası: Gün içindeki düşüncelerin yansıması. Mizaca göre şekillenir.',
          'Hılt Rüyası: Beden sıvılarının fazlalığından kaynaklanan rüyalar.',
          'Şeytanî Rüya: Korku ve kaygı bırakan. Sol yanına tükürmek ve eûzü okumak sünnettir.',
        ]
      },
      { tip: 'h2', metin: 'Daha İyi Rüya İçin' },
      { tip: 'p', metin: 'Abdestli uyumak, sağ tarafa yatmak, yatmadan önce ekranı kapatmak ve hafif yemek yemek — hem sünnet hem de uyku kalitesini artıran pratikler. İbn-i Sina\'ya göre mizacınıza göre dengeleyici bitkiler rüya kalitesini doğrudan etkiler.' },
      { tip: 'cta', metin: 'Mizacını öğren, rüyalarını anlamlandır.', buton: 'Testi Başlat', href: '/test' },
    ],
  },
  {
    slug: 'mevsim-ve-mizac',
    baslik: 'Mevsimler ve Mizaç: Her Mevsim Hangi Hıltı Aktifleştirir?',
    baslikEn: 'Seasons and Temperament: Which Humor Does Each Season Activate?',
    ozet: 'İbn-i Sina\'ya göre dört mevsim dört hıltın yıllık döngüsüdür. İlkbahar kan, yaz safra, sonbahar sevda, kış balgam mevsimidir. Peki baskın mizacınız bu döngüye nasıl tepki verir?',
    ozetEn: 'According to Ibn Sina, the four seasons are the annual cycle of the four humors. How does your dominant temperament react to this cycle?',
    tarih: '2026-04-05',
    okumaSuresi: 6,
    etiketler: ['mevsim mizaç', 'mevsim hılt', 'ilkbahar demevi', 'yaz safravi', 'mevsimsel sağlık'],
    icerik: [
      { tip: 'p', metin: 'İbn-i Sina\'ya göre doğa ile bedenin döngüsü bir ve aynıdır. Dışarıdaki mevsim değişimi, içerideki hılt dengesini doğrudan etkiler. Bu ilişkiyi anlamak mevsimsel hastalıkları önlemenin temelidir.' },
      { tip: 'h2', metin: 'Dört Mevsim, Dört Hılt' },
      { tip: 'ul', maddeler: [
        'İlkbahar — Kan Hıltı: Doğa canlanır, kan hıltı yükselir. Enerji artar, sosyallik canlanır. Demevî kişiler çiçek açar.',
        'Yaz — Safra Hıltı: Güneş zirvede, safra hıltı en aktif halde. Sindirim güçlenir, zihin keskin ama öfke riski yüksek.',
        'Sonbahar — Sevda Hıltı: Hava soğur ve kurur, sevda yoğunlaşır. Derinleşme, içe dönüş ve melankoli mevsimi.',
        'Kış — Balgam Hıltı: Balgam hâkim. Beden yavaşlar, onarım başlar. Sabır ve dinleniş zamanı.',
      ]},
      { tip: 'h2', metin: 'Baskın Mizacınız ve Mevsim' },
      { tip: 'p', metin: 'Baskın mizacınız ile aynı nitelikteki mevsimde en güçlü ama aynı zamanda en dengesiz olursunuz. Safravî iseniz yaz tehlikeli; sevdavî iseniz sonbahar en zor dönemdir.' },
      { tip: 'h2', metin: 'Mevsim Geçişleri ve Hastalık' },
      { tip: 'p', metin: 'İbn-i Sina mevsim geçişlerini — özellikle ilkbahar başı ve sonbahar başı — hastalığa en açık dönemler olarak tanımlar. Bu geçiş haftalarında beslenme değişikliği ve ılık su ritüeli önerir.' },
      { tip: 'ul', maddeler: [
        'İlkbahar: Hafif detoks, taze yeşillikler, kan temizleyici bitkiler.',
        'Yaz: Serinletici besinler, güneşten korunma, abdest sıklığını artır.',
        'Sonbahar: Güneş ışığı, sıcak bağlantılar, safran ve gül suyu.',
        'Kış: Isıtıcı baharatlar, sıcak çorba, sabah erken kalkış.',
      ]},
      { tip: 'cta', metin: 'Mizacını öğren, mevsimsel döngünü dengele.', buton: 'Testi Başlat', href: '/test' },
    ],
  },
  {
    slug: 'muzik-terapi-mizac',
    baslik: 'Müzik Terapisi ve Mizaç: İbn-i Sina\'nın Makam Reçetesi',
    baslikEn: "Music Therapy and Temperament: Ibn Sina's Maqam Prescription",
    ozet: 'İbn-i Sina müziği ilaç olarak kullanmıştır. Hangi makam öfkeyi yatıştırır, hangi ritim balgamı eritir, hangi ses sevda hıltını dengeler?',
    ozetEn: 'Ibn Sina used music as medicine. Which maqam soothes anger, which rhythm dissolves phlegm, which sound balances black bile?',
    tarih: '2026-04-07',
    okumaSuresi: 5,
    etiketler: ['müzik terapisi', 'makam şifa', 'ibn-i sina müzik', 'müzik mizaç', 'ney şifa'],
    icerik: [
      { tip: 'p', metin: 'İbn-i Sina, el-Kânûn fi\'t-Tıbb\'da müziği tıbbın ayrılmaz parçası olarak ele alır. Ona göre doğru makam ile yapılan müzik, doğrudan hılt dengesini etkiler ve ilaç gibi işlev görür.' },
      { tip: 'h2', metin: 'Makam Nedir, Neden Şifa Verir?' },
      { tip: 'p', metin: 'Makam, belirli bir ses dizisi ve duygusal atmosfer demektir. Her makamın sinir sistemi ve hılt dengesi üzerinde farklı etkisi vardır. Modern nörobilim de müziğin limbik sistem üzerindeki etkisini doğrulamaktadır.' },
      { tip: 'h2', metin: 'Mizaca Göre Müzik Reçetesi' },
      { tip: 'ul', maddeler: [
        'Safravî: Uşşak ve Rast makamı — serinletici. Yavaş ud ve ney. Öfkeyi söndürür.',
        'Demevî: Segah ve Hicaz — duygusal zenginlik. Orta tempo keman ve kanun.',
        'Balgamî: Nihavend — uyandırıcı. Canlı ritimler. Balgamı eritir.',
        'Sevdavî: Rast ve Buselik — umut ve neşe. Ney. Melankoliyi dönüştürür.',
      ]},
      { tip: 'p', metin: 'Hz. Peygamber güzel sesin kalpleri yumuşattığını söylemiştir. Günde 20-30 dakika bilinçli müzik dinlemek hılt dengesini düzenler.' },
      { tip: 'cta', metin: 'Mizacını öğren, doğru müziği seç.', buton: 'Testi Başlat', href: '/test' },
    ],
  },
  {
    slug: 'koku-terapisi-mizac',
    baslik: 'Koku Terapisi ve Mizaç: Hangi Esans Seni Dengeler?',
    baslikEn: 'Aromatherapy and Temperament: Which Scent Balances You?',
    ozet: 'İbn-i Sina kokuyu doğrudan beyin ve hılt sistemine etki eden bir araç olarak görmüştür. Safravî için serinletici gül, balgamî için ısıtıcı zencefil, sevdavî için ruh yükseltici bergamot.',
    ozetEn: 'Ibn Sina saw scent as a tool that directly affects the brain and humor system. Cooling rose for Choleric, warming ginger for Phlegmatic, mood-lifting bergamot for Melancholic.',
    tarih: '2026-04-09',
    okumaSuresi: 5,
    etiketler: ['koku terapisi', 'aromaterapi mizaç', 'buhur mizaç', 'gül suyu şifa', 'koku hılt'],
    icerik: [
      { tip: 'p', metin: 'Koku, beyin ile en hızlı bağlantıyı kuran duyu organımızdır. İbn-i Sina bu fizyolojik gerçeği yüzyıllar önce fark etmiş ve koku terapisini özellikle sevdavî hastalara birincil tedavi olarak uygulamıştır.' },
      { tip: 'h2', metin: 'Hz. Peygamber ve Koku' },
      { tip: 'p', metin: '"Güzel koku ruhu dinlendirir." Hz. Peygamber güzel kokunun hediyesini hiçbir zaman reddetmezdi. Gül suyu en sevdiği kokuydu. Misk, ud ve amber sahabeler arasında yaygın kullanılırdı.' },
      { tip: 'h2', metin: 'Mizaca Göre Koku Reçetesi' },
      { tip: 'ul', maddeler: [
        'Safravî: Gül, nane, sandal — serinletici ve yatıştırıcı. Öfkeyi söndürür.',
        'Demevî: Bergamot, biberiye, limon — dengeleyen ve hafifçe kurutucu.',
        'Balgamî: Zencefil, karabiber, kekik — ısıtıcı ve uyandırıcı. Balgamı eritir.',
        'Sevdavî: Gül, lavanta, amber — ruh yükseltici ve nemlendirici. Melankoliyi dengeler.',
      ]},
      { tip: 'h2', metin: 'Tüm Mizaçlar İçin Şifalı Kokular' },
      { tip: 'ul', maddeler: [
        'Gül Suyu: Hz. Peygamber\'in tercihi. Kalp ve ruh dengeleyici.',
        'Misk: Cennet kokusu. Ruh arındırıcı.',
        'Ud Buhuru: Ruhsal derinleşme ve huzur.',
        'Amber: Isıtıcı ve nemlendirici. Kış aylarında her mizaca.',
      ]},
      { tip: 'cta', metin: 'Mizacını öğren, doğru kokuyu bul.', buton: 'Testi Başlat', href: '/test' },
    ],
  },
  {
    slug: 'spor-ve-mizac',
    baslik: 'Spor, Hareket ve Mizaç: Hangi Egzersiz Sana Uygun?',
    baslikEn: 'Exercise and Temperament: Which Sport Suits Your Type?',
    ozet: 'İbn-i Sina\'ya göre hareket hılt dengesinin en önemli düzenleyicisidir. Yanlış egzersiz dengesizliği artırır. Safravî, Demevî, Balgamî ve Sevdavî için ideal hareket biçimleri.',
    ozetEn: 'According to Ibn Sina, movement is the most important regulator of humor balance. Ideal movement types for each of the four temperaments.',
    tarih: '2026-04-11',
    okumaSuresi: 6,
    etiketler: ['spor mizaç', 'egzersiz mizaç', 'hareket hılt', 'safravi spor', 'balgami egzersiz'],
    icerik: [
      { tip: 'p', metin: '"Hareket, ilacın anasıdır." İbn-i Sina\'nın bu sözü, fiziksel aktivitenin hılt dengesindeki merkezi rolünü özetler. Ancak her mizacın ihtiyaç duyduğu hareket biçimi farklıdır.' },
      { tip: 'h2', metin: 'Safravî İçin Egzersiz' },
      { tip: 'p', metin: 'Safravî kişiler yoğun egzersizden hoşlanır ama aşırı ısıtıcı antrenman safra hıltını yoğunlaştırır. Yüzme, yoga ve yürüyüş daha uygundur. Rekabetli sporları akşam değil, öğle sonrasında yapın.' },
      { tip: 'h2', metin: 'Demevî İçin Egzersiz' },
      { tip: 'p', metin: 'Demevî kişiler grup sporlarına yatkındır. Dans, ekip sporları, dans fitness enerjilerini besler. Monoton ve tek başına yapılan egzersizler çabuk sıkar — sosyal ortamda düzenlilik sağlanır.' },
      { tip: 'h2', metin: 'Balgamî İçin Egzersiz' },
      { tip: 'p', metin: 'İbn-i Sina balgamî kişiler için hareketi en kritik müdahale olarak sunar. Sabah yürüyüşü, bisiklet, kuvvet antrenmanı idealdir. Minimum günlük 30 dakika zorunludur — balgamî tembelleme tuzağına dikkat.' },
      { tip: 'h2', metin: 'Sevdavî İçin Egzersiz' },
      { tip: 'p', metin: 'Sevdavî kişiler için hafif ve ritmik hareket önerilir. Yürüyüş, yüzme, tai chi ve nefes egzersizleri kaygıyı düşürür. Aşırı yoğun egzersiz kortizolü artırarak sevdayı derinleştirebilir.' },
      { tip: 'ul', maddeler: [
        'Safravî: Yüzme, yoga, yürüyüş — serinletici ve sakinleştirici.',
        'Demevî: Dans, futbol, grup fitness — sosyal ve ritmik.',
        'Balgamî: Sabah koşusu, bisiklet, kuvvet antrenmanı — uyandırıcı.',
        'Sevdavî: Doğa yürüyüşü, yüzme, nefes egzersizi — hafif ve topraklayıcı.',
      ]},
      { tip: 'cta', metin: 'Mizacını öğren, sana uygun egzersizi bul.', buton: 'Testi Başlat', href: '/test' },
    ],
  },
];

export function getBlogYazisi(slug: string): BlogYazisi | undefined {
  return blogYazilari.find((y) => y.slug === slug);
}
