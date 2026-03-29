export type MizacTip = 'safravi' | 'demevi' | 'balgami' | 'sevdavi';

export interface MizacProfil {
  id: MizacTip;
  isim: string;
  isimEn: string;
  element: string;
  elementEn: string;
  elementSembol: string;
  renk: string;
  renkAcik: string;
  sicaklik: string;
  nem: string;
  anahtarKelimeler: string[];
  anahtarKelimelerEn: string[];
  kisaAciklama: string;
  kisaAciklamaEn: string;
  uzunAciklama: string;
  uzunAciklamaEn: string;
  gucluYonler: string[];
  gucluYonlerEn: string[];
  zayifYonler: string[];
  zayifYonlerEn: string[];
  saglikEgilimleri: string[];
  saglikEgilimleriEn: string[];
  beslenme: string[];
  beslenmeEn: string[];
  iliski: string;
  iliskiEn: string;
  emoji: string;
}

export const mizacProfiller: Record<MizacTip, MizacProfil> = {
  safravi: {
    id: 'safravi',
    isim: 'Safravî',
    isimEn: 'Choleric',
    element: 'Ateş',
    elementEn: 'Fire',
    elementSembol: '🔥',
    renk: '#c0392b',
    renkAcik: '#fadbd8',
    sicaklik: 'Sıcak',
    nem: 'Kuru',
    anahtarKelimeler: ['Hareket', 'Denge', 'Liderlik', 'Kararlılık', 'Tutku'],
    anahtarKelimelerEn: ['Action', 'Balance', 'Leadership', 'Determination', 'Passion'],
    kisaAciklama: 'Ateş gibi enerjik, lider ruhlu, kararlı ve hızlı hareket eden mizaç.',
    kisaAciklamaEn: 'Energetic like fire, natural leader, decisive and fast-moving temperament.',
    uzunAciklama: 'Safravî mizaçlı kişiler ateş elementini taşırlar. Doğaları gereği hareketli, dinamik ve liderlik vasfına sahiptirler. Hızlı karar verirler ve kararlılıkla hedeflerine yürürler. Ateşin yukarı doğru yükselen yapısı gibi, Safravîler de daima zirveye ulaşmak isterler. Öfkeleri çabuk tutuşur ama geçer de. İş hayatında başarılıdırlar, girişimcidirler. Zorluklar karşısında yılmazlar.',
    uzunAciklamaEn: 'Choleric temperament individuals carry the fire element. By nature they are active, dynamic, and possess leadership qualities. They make quick decisions and march toward their goals with determination. Like fire that rises upward, Cholerics always want to reach the top. Their anger flares quickly but also passes. They succeed in business life and are entrepreneurial. They do not give up in the face of difficulties.',
    gucluYonler: ['Güçlü liderlik', 'Hızlı karar verme', 'Yüksek enerji', 'Girişimcilik', 'Kararlılık'],
    gucluYonlerEn: ['Strong leadership', 'Quick decision-making', 'High energy', 'Entrepreneurship', 'Determination'],
    zayifYonler: ['Aceleci davranma', 'Öfke kontrolü', 'Sabırsızlık', 'Başkalarını dinlememe'],
    zayifYonlerEn: ['Impulsiveness', 'Anger management', 'Impatience', 'Not listening to others'],
    saglikEgilimleri: ['Tansiyon yükselmeleri', 'Sindirim sorunları', 'Baş ağrıları', 'Ateşli hastalıklar'],
    saglikEgilimleriEn: ['High blood pressure', 'Digestive issues', 'Headaches', 'Inflammatory conditions'],
    beslenme: ['Soğutucu gıdalar (salatalık, yoğurt)', 'Az baharatlı', 'Bol su', 'Taze meyveler'],
    beslenmeEn: ['Cooling foods (cucumber, yogurt)', 'Less spicy food', 'Plenty of water', 'Fresh fruits'],
    iliski: 'İlişkilerinde tutkulu ve koruyucudur. Eşine karşı sahiplenicidir. Balgamî mizaçlarla iyi uyum sağlar.',
    iliskiEn: 'Passionate and protective in relationships. Possessive toward partner. Gets along well with Phlegmatic temperaments.',
    emoji: '🔥',
  },
  demevi: {
    id: 'demevi',
    isim: 'Demevî',
    isimEn: 'Sanguine',
    element: 'Hava',
    elementEn: 'Air',
    elementSembol: '💨',
    renk: '#2980b9',
    renkAcik: '#d6eaf8',
    sicaklik: 'Sıcak',
    nem: 'Islak',
    anahtarKelimeler: ['Uyum', 'Hız', 'Değişkenlik', 'Sosyallik', 'Neşe'],
    anahtarKelimelerEn: ['Harmony', 'Speed', 'Adaptability', 'Sociability', 'Joy'],
    kisaAciklama: 'Hava gibi özgür, sosyal, neşeli ve değişken mizaç. Her ortama kolayca uyum sağlar.',
    kisaAciklamaEn: 'Free like air, social, joyful and adaptable temperament. Easily adapts to any environment.',
    uzunAciklama: 'Demevî mizaçlı kişiler hava elementini taşırlar. Sosyal, neşeli ve uyum sağlayıcı kişilerdir. Havanın her yere yayılması gibi, Demevîler de insanlarla kaynaşmayı severler. Çabuk arkadaşlık kurarlar, ortamı güzelleştirirler. Değişkenlik onların doğasında vardır; sıkılgan ve yeniliğe açık olurlar. Yaratıcılıkları yüksektir.',
    uzunAciklamaEn: 'Sanguine temperament individuals carry the air element. They are social, cheerful, and adaptable. Like air spreading everywhere, Sanguines love to blend with people. They quickly make friends and brighten any environment. Change is in their nature; they get bored easily and are open to novelty. They have high creativity.',
    gucluYonler: ['Yüksek sosyallik', 'Yaratıcılık', 'Uyum yeteneği', 'Neşe ve pozitiflik', 'İletişim gücü'],
    gucluYonlerEn: ['High sociability', 'Creativity', 'Adaptability', 'Joy and positivity', 'Communication skills'],
    zayifYonler: ['Kararsızlık', 'Odak kaybı', 'Söz tutmama', 'Yüzeysellik'],
    zayifYonlerEn: ['Indecisiveness', 'Lack of focus', 'Not keeping promises', 'Superficiality'],
    saglikEgilimleri: ['Solunum yolları hassasiyeti', 'Alerji', 'Sinir sistemi sorunları', 'Uyku düzensizliği'],
    saglikEgilimleriEn: ['Respiratory sensitivity', 'Allergies', 'Nervous system issues', 'Sleep irregularity'],
    beslenme: ['Dengeli beslenme', 'Islatılmış kuruyemişler', 'Zeytinyağlı yemekler', 'Bitki çayları'],
    beslenmeEn: ['Balanced diet', 'Soaked nuts', 'Olive oil dishes', 'Herbal teas'],
    iliski: 'İlişkilerinde eğlenceli ve romantiktir. Rutin ilişkilerden sıkılabilir. Sevdavî mizaçlarla denge sağlar.',
    iliskiEn: 'Fun and romantic in relationships. May get bored with routine relationships. Balances well with Melancholic temperaments.',
    emoji: '💨',
  },
  balgami: {
    id: 'balgami',
    isim: 'Balgamî',
    isimEn: 'Phlegmatic',
    element: 'Su',
    elementEn: 'Water',
    elementSembol: '💧',
    renk: '#27ae60',
    renkAcik: '#d5f5e3',
    sicaklik: 'Soğuk',
    nem: 'Islak',
    anahtarKelimeler: ['Berraklık', 'Eğilim', 'Hassasiyet', 'Sabır', 'Derin düşünce'],
    anahtarKelimelerEn: ['Clarity', 'Flexibility', 'Sensitivity', 'Patience', 'Deep thinking'],
    kisaAciklama: 'Su gibi derin, sakin, hassas ve uyumlu mizaç. Akan suya benzer şekilde her şekle girebilir.',
    kisaAciklamaEn: 'Deep like water, calm, sensitive and harmonious temperament. Like flowing water, can adapt to any shape.',
    uzunAciklama: 'Balgamî mizaçlı kişiler su elementini taşırlar. Sakin, derin düşünceli ve hassas kişilerdir. Suyun akışkanlığı gibi, Balgamîler de her ortama uyum sağlayabilirler. Sezgileri güçlüdür, insanları iyi anlayabilirler. Sabırlı ve yardımseverdirler. Bazen aşırı duygusallıkları sorun yaratabilir. Sanata ve müziğe yatkınlıkları vardır.',
    uzunAciklamaEn: 'Phlegmatic temperament individuals carry the water element. They are calm, deep-thinking, and sensitive. Like the fluidity of water, Phlegmatics can adapt to any environment. They have strong intuitions and can understand people well. They are patient and helpful. Sometimes their excessive emotionality can cause problems. They have an inclination toward art and music.',
    gucluYonler: ['Derin empati', 'Sabır', 'Sezgi gücü', 'Sadakat', 'Dinleme yeteneği'],
    gucluYonlerEn: ['Deep empathy', 'Patience', 'Intuition', 'Loyalty', 'Listening skills'],
    zayifYonler: ['Aşırı duygusallık', 'Kararsızlık', 'Pasiflik', 'Çabuk etkilenme'],
    zayifYonlerEn: ['Excessive emotionality', 'Indecisiveness', 'Passiveness', 'Easily influenced'],
    saglikEgilimleri: ['Eklem ağrıları', 'Şişmanlama eğilimi', 'Sindirim yavaşlığı', 'Kilo sorunları'],
    saglikEgilimleriEn: ['Joint pain', 'Weight gain tendency', 'Slow digestion', 'Weight issues'],
    beslenme: ['Hafif ve kurutucu gıdalar', 'Az şeker', 'Baharatlı yiyecekler (ısıtıcı)', 'Zencefil, tarçın'],
    beslenmeEn: ['Light and drying foods', 'Less sugar', 'Spicy foods (warming)', 'Ginger, cinnamon'],
    iliski: 'İlişkilerinde sadık, anlayışlı ve fedakardır. Çatışmadan kaçınır. Safravî mizaçlarla güzel denge kurar.',
    iliskiEn: 'Loyal, understanding, and self-sacrificing in relationships. Avoids conflict. Creates a good balance with Choleric temperaments.',
    emoji: '💧',
  },
  sevdavi: {
    id: 'sevdavi',
    isim: 'Sevdavî',
    isimEn: 'Melancholic',
    element: 'Toprak',
    elementEn: 'Earth',
    elementSembol: '🌿',
    renk: '#8e44ad',
    renkAcik: '#e8daef',
    sicaklik: 'Soğuk',
    nem: 'Kuru',
    anahtarKelimeler: ['Sabır', 'Çekim', 'Etkenlik', 'Düzen', 'Mükemmeliyetçilik'],
    anahtarKelimelerEn: ['Patience', 'Depth', 'Effectiveness', 'Order', 'Perfectionism'],
    kisaAciklama: 'Toprak gibi sağlam, düzenli, derin ve mükemmeliyetçi mizaç. Her şeyi kökünden ele alır.',
    kisaAciklamaEn: 'Solid like earth, organized, deep and perfectionist temperament. Approaches everything from its roots.',
    uzunAciklama: 'Sevdavî mizaçlı kişiler toprak elementini taşırlar. Düzenli, detaycı ve mükemmeliyetçi kişilerdir. Toprağın yerinde durması ve her şeyi kökünden beslemesi gibi, Sevdavîler de her konuyu derinlemesine incelerler. Analitik düşünceleri güçlüdür, güvenilirlikleriyle bilinirler. Melankoli eğilimleri olabilir. Sanat ve felsefede derinleşebilirler.',
    uzunAciklamaEn: 'Melancholic temperament individuals carry the earth element. They are organized, detail-oriented, and perfectionistic. Like earth that stays in place and nourishes everything from its roots, Melancholics examine every subject in depth. They have strong analytical thinking and are known for their reliability. They may have melancholic tendencies. They can deepen in art and philosophy.',
    gucluYonler: ['Analitik düşünce', 'Güvenilirlik', 'Detaycılık', 'Bağlılık', 'Derinlik'],
    gucluYonlerEn: ['Analytical thinking', 'Reliability', 'Attention to detail', 'Commitment', 'Depth'],
    zayifYonler: ['Aşırı endişe', 'Mükemmeliyetçilik stresi', 'Sosyal çekingenlik', 'Karamsarlık eğilimi'],
    zayifYonlerEn: ['Excessive worry', 'Perfectionism stress', 'Social shyness', 'Tendency to pessimism'],
    saglikEgilimleri: ['Eklem sorunları', 'Depresyon eğilimi', 'Cilt problemleri', 'Bağırsak hassasiyeti'],
    saglikEgilimleriEn: ['Joint issues', 'Depression tendency', 'Skin problems', 'Intestinal sensitivity'],
    beslenme: ['Isıtıcı baharatlar', 'Kuru meyveler', 'Et yemekleri', 'Zeytinyağı ve bal'],
    beslenmeEn: ['Warming spices', 'Dried fruits', 'Meat dishes', 'Olive oil and honey'],
    iliski: 'İlişkilerinde sadık, derin bağlılık gösterir. Seçici arkadaşlık kurar. Demevî mizaçlarla dengelenir.',
    iliskiEn: 'Deeply loyal and committed in relationships. Selective in friendships. Balances with Sanguine temperaments.',
    emoji: '🌿',
  },
};

export const sorular = [
  // --- FİZİKSEL ÖZELLİKLER ---
  {
    id: 1,
    kategori: 'fiziksel',
    soru: 'Ten renginiz ve cilt yapınız nasıldır?',
    soruEn: 'What is your skin tone and texture like?',
    secenekler: [
      { metin: 'Sarımtırak, bazen solgun, kızıl ya da kumral tona sahip', metinEn: 'Yellowish or pale, sometimes with reddish or amber tones', puan: { safravi: 3, demevi: 0, balgami: 0, sevdavi: 1 } },
      { metin: 'Pembe-kızarık, canlı ve ışıltılı', metinEn: 'Pinkish-rosy, lively and glowing', puan: { safravi: 0, demevi: 3, balgami: 1, sevdavi: 0 } },
      { metin: 'Açık, soluk beyaz; nemli ve yumuşak', metinEn: 'Light, pale white; moist and soft', puan: { safravi: 0, demevi: 1, balgami: 3, sevdavi: 0 } },
      { metin: 'Gri veya mat, bazen koyu halkalar gözlerin altında', metinEn: 'Grayish or dull, often with dark circles under eyes', puan: { safravi: 1, demevi: 0, balgami: 0, sevdavi: 3 } },
    ],
  },
  {
    id: 2,
    kategori: 'fiziksel',
    soru: 'Saçlarınızı en iyi hangisi tanımlar?',
    soruEn: 'Which best describes your hair?',
    secenekler: [
      { metin: 'Kızıl, kumral ya da sarı; ince telli ve çabuk yağlanan', metinEn: 'Red, auburn or blonde; fine-textured and quick to get oily', puan: { safravi: 3, demevi: 0, balgami: 0, sevdavi: 0 } },
      { metin: 'Koyu, dalgalı, gür ve yağlı', metinEn: 'Dark, wavy, thick and oily', puan: { safravi: 0, demevi: 3, balgami: 0, sevdavi: 0 } },
      { metin: 'Açık renk, ince, düz ve az hacimli', metinEn: 'Light-colored, thin, straight and low-volume', puan: { safravi: 0, demevi: 0, balgami: 3, sevdavi: 0 } },
      { metin: 'Siyah ya da koyu; kuru ve donuk', metinEn: 'Black or very dark; dry and lackluster', puan: { safravi: 0, demevi: 0, balgami: 0, sevdavi: 3 } },
    ],
  },
  {
    id: 3,
    kategori: 'fiziksel',
    soru: 'Vücut yapınız genel olarak nasıl?',
    soruEn: 'How would you describe your body build?',
    secenekler: [
      { metin: 'İnce, sıkı yapılı; yağ yerine kas tutar', metinEn: 'Lean and firm; builds muscle rather than fat', puan: { safravi: 3, demevi: 1, balgami: 0, sevdavi: 1 } },
      { metin: 'Orta kilolu; kilo alınca kaslara yansır', metinEn: 'Medium build; weight gain shows as muscle', puan: { safravi: 0, demevi: 3, balgami: 0, sevdavi: 0 } },
      { metin: 'Dolgun ya da kiloya meyilli; göbek bölgesinde yağlanma', metinEn: 'Full-figured or prone to weight gain; fat accumulates around abdomen', puan: { safravi: 0, demevi: 0, balgami: 3, sevdavi: 0 } },
      { metin: 'Kemikli ve zayıf; kilo almakta zorlanır', metinEn: 'Bony and thin; struggles to gain weight', puan: { safravi: 1, demevi: 0, balgami: 0, sevdavi: 3 } },
    ],
  },
  {
    id: 4,
    kategori: 'fiziksel',
    soru: 'El ve ayaklarınızın ısısı nasıldır?',
    soruEn: 'How are the temperatures of your hands and feet?',
    secenekler: [
      { metin: 'Ellerim ılık ama ayaklarım çoğu zaman soğuk', metinEn: 'My hands are warm but my feet are usually cold', puan: { safravi: 3, demevi: 0, balgami: 0, sevdavi: 0 } },
      { metin: 'Her ikisi de genellikle ılık ya da sıcak', metinEn: 'Both are usually warm or hot', puan: { safravi: 1, demevi: 3, balgami: 0, sevdavi: 0 } },
      { metin: 'El ve ayaklarım çoğunlukla soğuktur', metinEn: 'My hands and feet are usually cold', puan: { safravi: 0, demevi: 0, balgami: 3, sevdavi: 2 } },
      { metin: 'Bütün vücudum soğuk hisseder, özellikle kış aylarında', metinEn: 'My whole body feels cold, especially in winter', puan: { safravi: 0, demevi: 0, balgami: 1, sevdavi: 3 } },
    ],
  },
  {
    id: 5,
    kategori: 'fiziksel',
    soru: 'Tırnak renginiz ve yapınız nasıl?',
    soruEn: 'How are your nails in terms of color and texture?',
    secenekler: [
      { metin: 'Sarımsı ya da mat; kırılgan ve ince', metinEn: 'Yellowish or dull; brittle and thin', puan: { safravi: 3, demevi: 0, balgami: 0, sevdavi: 1 } },
      { metin: 'Pembemsi, parlak ve sağlıklı görünümlü', metinEn: 'Pinkish, shiny and healthy-looking', puan: { safravi: 0, demevi: 3, balgami: 1, sevdavi: 0 } },
      { metin: 'Açık pembe, yumuşak ve esnek', metinEn: 'Light pink, soft and flexible', puan: { safravi: 0, demevi: 0, balgami: 3, sevdavi: 0 } },
      { metin: 'Koyu ya da grimsi; sert ama mat', metinEn: 'Dark or grayish; hard but dull', puan: { safravi: 0, demevi: 0, balgami: 0, sevdavi: 3 } },
    ],
  },
  {
    id: 6,
    kategori: 'fiziksel',
    soru: 'Terleme düzeyiniz nasıldır?',
    soruEn: 'How much do you sweat?',
    secenekler: [
      { metin: 'Çabuk ve çok terliyorum; ter bazen keskin kokuyor', metinEn: 'I sweat quickly and heavily; sweat can sometimes smell sharp', puan: { safravi: 3, demevi: 1, balgami: 0, sevdavi: 0 } },
      { metin: 'Normal düzeyde terliyorum; tatlımsı bir koku var', metinEn: 'I sweat normally; with a slightly sweet scent', puan: { safravi: 0, demevi: 3, balgami: 1, sevdavi: 0 } },
      { metin: 'Kolay terlerim ve ter kokusu belirgindir', metinEn: 'I sweat easily and the odor is noticeable', puan: { safravi: 0, demevi: 0, balgami: 3, sevdavi: 0 } },
      { metin: 'Az terlerim; cildim çoğu zaman kuru kalır', metinEn: 'I sweat little; my skin stays mostly dry', puan: { safravi: 1, demevi: 0, balgami: 0, sevdavi: 3 } },
    ],
  },
  {
    id: 7,
    kategori: 'fiziksel',
    soru: 'İştahınız ve yeme alışkanlığınız nasıl?',
    soruEn: 'How is your appetite and eating habit?',
    secenekler: [
      { metin: 'Çabuk acıkırım, hızlı yerim ve çabuk doyarım', metinEn: 'I get hungry fast, eat quickly and get full fast', puan: { safravi: 3, demevi: 1, balgami: 0, sevdavi: 0 } },
      { metin: 'Her şeyi severim, yemek sosyal bir etkinlik', metinEn: 'I enjoy everything; eating is a social activity', puan: { safravi: 0, demevi: 3, balgami: 1, sevdavi: 0 } },
      { metin: 'Ağır ve tatlı yiyeceklere meyilliyim; az hareketle kilo alırım', metinEn: 'I crave heavy and sweet foods; I gain weight with little exercise', puan: { safravi: 0, demevi: 0, balgami: 3, sevdavi: 0 } },
      { metin: 'İştahım azdır; yemeği çok fazla düşünmem', metinEn: 'My appetite is low; I don\'t think much about food', puan: { safravi: 0, demevi: 0, balgami: 0, sevdavi: 3 } },
    ],
  },
  {
    id: 8,
    kategori: 'fiziksel',
    soru: 'Uyku ihtiyacınız ve düzeniniz nasıl?',
    soruEn: 'How is your sleep need and pattern?',
    secenekler: [
      { metin: 'Az uyuyabilirim (5-6 saat yeterli), sabah erken kalkarım', metinEn: 'I can manage with little sleep (5-6 hrs), I wake up early', puan: { safravi: 3, demevi: 0, balgami: 0, sevdavi: 1 } },
      { metin: 'Çok uyumayı severim, uykusuz kaldığımda huysuzlaşırım', metinEn: 'I love sleeping a lot; I get irritable when sleep-deprived', puan: { safravi: 0, demevi: 3, balgami: 1, sevdavi: 0 } },
      { metin: 'Uzun ve derin uyku isterim, yataktan zor kalkarım', metinEn: 'I need long deep sleep; getting out of bed is hard', puan: { safravi: 0, demevi: 0, balgami: 3, sevdavi: 0 } },
      { metin: 'Düzenli ama hafif uyurum; uykum sık bölünür', metinEn: 'I sleep regularly but lightly; my sleep is often interrupted', puan: { safravi: 0, demevi: 0, balgami: 0, sevdavi: 3 } },
    ],
  },
  // --- DUYGUSAL TEPKİLER ---
  {
    id: 9,
    kategori: 'duygusal',
    soru: 'Öfkelendiğinizde nasıl davranırsınız?',
    soruEn: 'How do you behave when you get angry?',
    secenekler: [
      { metin: 'Çabuk parlıyorum ama öfkem çabuk söner', metinEn: 'I flare up quickly but my anger fades fast', puan: { safravi: 3, demevi: 1, balgami: 0, sevdavi: 0 } },
      { metin: 'Konuşarak, şakalaşarak çözmeye çalışırım', metinEn: 'I try to resolve it by talking and even joking', puan: { safravi: 0, demevi: 3, balgami: 0, sevdavi: 0 } },
      { metin: 'İçime atarım, üzülürüm ama dışarıya vurmam', metinEn: 'I bottle it up; I feel hurt but don\'t show it', puan: { safravi: 0, demevi: 0, balgami: 3, sevdavi: 1 } },
      { metin: 'Uzun süre sessizce taşırım; kolay affetmem', metinEn: 'I carry it quietly for a long time; I don\'t forgive easily', puan: { safravi: 1, demevi: 0, balgami: 0, sevdavi: 3 } },
    ],
  },
  {
    id: 10,
    kategori: 'duygusal',
    soru: 'Üzüldüğünüzde nasıl başa çıkarsınız?',
    soruEn: 'How do you cope when you feel sad?',
    secenekler: [
      { metin: 'Kısa süre yaşarım, hemen bir şey yaparak geçiririm', metinEn: 'It\'s brief; I quickly do something to move past it', puan: { safravi: 3, demevi: 1, balgami: 0, sevdavi: 0 } },
      { metin: 'Arkadaşlarımla vakit geçirir, sohbetle atlatırım', metinEn: 'I spend time with friends and talk it out', puan: { safravi: 0, demevi: 3, balgami: 1, sevdavi: 0 } },
      { metin: 'Çok derinlemesine hissederim, ağlamak rahatlatır', metinEn: 'I feel it deeply; crying brings relief', puan: { safravi: 0, demevi: 0, balgami: 3, sevdavi: 1 } },
      { metin: 'Yalnız kalırım, içime çekilir ve sessizce işlerim', metinEn: 'I retreat into solitude and process it silently', puan: { safravi: 1, demevi: 0, balgami: 1, sevdavi: 3 } },
    ],
  },
  {
    id: 11,
    kategori: 'duygusal',
    soru: 'Sevinç ve heyecanınızı nasıl ifade edersiniz?',
    soruEn: 'How do you express joy and excitement?',
    secenekler: [
      { metin: 'Yüksek sesle gülerim, hemen harekete geçerim', metinEn: 'I laugh loudly and immediately spring into action', puan: { safravi: 3, demevi: 1, balgami: 0, sevdavi: 0 } },
      { metin: 'Herkesle paylaşırım, coşkum ortama yayılır', metinEn: 'I share with everyone; my enthusiasm fills the room', puan: { safravi: 0, demevi: 3, balgami: 0, sevdavi: 0 } },
      { metin: 'Hafifçe gülümserim, içten hissederim ama sakin kalırım', metinEn: 'I smile gently; I feel it deeply but stay calm', puan: { safravi: 0, demevi: 1, balgami: 3, sevdavi: 0 } },
      { metin: 'Nadiren dışa vururum; sevinç içimde sessizce yaşar', metinEn: 'I rarely show it; joy lives quietly within me', puan: { safravi: 0, demevi: 0, balgami: 0, sevdavi: 3 } },
    ],
  },
  {
    id: 12,
    kategori: 'duygusal',
    soru: 'Eleştiri aldığınızda nasıl tepki verirsiniz?',
    soruEn: 'How do you react when you receive criticism?',
    secenekler: [
      { metin: 'Savunmaya geçerim ya da hemen karşı çıkarım', metinEn: 'I get defensive or immediately push back', puan: { safravi: 3, demevi: 1, balgami: 0, sevdavi: 0 } },
      { metin: 'Kısa süre üzülürüm ama hızla unuturum', metinEn: 'I feel briefly hurt but quickly forget it', puan: { safravi: 0, demevi: 3, balgami: 0, sevdavi: 0 } },
      { metin: 'Çok etkiliyor beni; hissettiklerimi içimde işlerim', metinEn: 'It affects me deeply; I process my feelings internally', puan: { safravi: 0, demevi: 0, balgami: 3, sevdavi: 1 } },
      { metin: 'Ciddiye alırım; üzerinde uzun süre düşünürüm', metinEn: 'I take it seriously and think about it for a long time', puan: { safravi: 1, demevi: 0, balgami: 0, sevdavi: 3 } },
    ],
  },
  {
    id: 13,
    kategori: 'duygusal',
    soru: 'Beklenmedik bir güzel haber geldiğinde tepkiniz ne olur?',
    soruEn: 'How do you react when unexpected good news arrives?',
    secenekler: [
      { metin: 'Anında harekete geçerim, planlamaya başlarım', metinEn: 'I immediately take action and start planning', puan: { safravi: 3, demevi: 1, balgami: 0, sevdavi: 0 } },
      { metin: 'Çığlık atarım, herkesin haberi olsun isterim', metinEn: 'I shout with joy and want everyone to know', puan: { safravi: 1, demevi: 3, balgami: 0, sevdavi: 0 } },
      { metin: 'Gözlerim dolar, içten bir mutluluk yaşarım', metinEn: 'My eyes fill with tears; I feel a deep inner happiness', puan: { safravi: 0, demevi: 0, balgami: 3, sevdavi: 1 } },
      { metin: 'Sakin kalırım; önce doğruluğunu sorgulamak isterim', metinEn: 'I stay calm; I want to verify it first', puan: { safravi: 0, demevi: 0, balgami: 0, sevdavi: 3 } },
    ],
  },
  // --- SOSYAL DAVRANIŞ ---
  {
    id: 14,
    kategori: 'sosyal',
    soru: 'Yeni insanlarla arkadaşlık kurarken nasıl davranırsınız?',
    soruEn: 'How do you behave when making new friends?',
    secenekler: [
      { metin: 'Seçiciyim, az ama derin arkadaşlıklar kurarım', metinEn: 'I am selective; I form few but deep friendships', puan: { safravi: 3, demevi: 0, balgami: 0, sevdavi: 1 } },
      { metin: 'İlk dakikada arkadaş olabilirim, insanlara kolay açılırım', metinEn: 'I can make a friend in minutes; I open up easily', puan: { safravi: 0, demevi: 3, balgami: 1, sevdavi: 0 } },
      { metin: 'Zaman alır, güveni yavaş yavaş inşa ederim', metinEn: 'It takes time; I build trust slowly', puan: { safravi: 0, demevi: 0, balgami: 3, sevdavi: 1 } },
      { metin: 'Çok zaman alır; insanlara mesafeli başlarım', metinEn: 'It takes a long time; I start from a distance', puan: { safravi: 1, demevi: 0, balgami: 0, sevdavi: 3 } },
    ],
  },
  {
    id: 15,
    kategori: 'sosyal',
    soru: 'Kalabalık bir ortamda kendinizi nasıl hissedersiniz?',
    soruEn: 'How do you feel in a crowd?',
    secenekler: [
      { metin: 'Enerjik hisseder, dikkat çekmeyi ve yönetmeyi severim', metinEn: 'I feel energized; I like to stand out and lead', puan: { safravi: 3, demevi: 1, balgami: 0, sevdavi: 0 } },
      { metin: 'Harika hissederim; kalabalık bana güç veriyor', metinEn: 'I feel great; crowds energize me', puan: { safravi: 0, demevi: 3, balgami: 0, sevdavi: 0 } },
      { metin: 'Başta güzel ama uzun süre yoruyor', metinEn: 'Nice at first, but tiring over time', puan: { safravi: 0, demevi: 1, balgami: 3, sevdavi: 0 } },
      { metin: 'Kısa sürede bunalır, yalnızlığı tercih ederim', metinEn: 'I quickly feel overwhelmed; I prefer solitude', puan: { safravi: 0, demevi: 0, balgami: 0, sevdavi: 3 } },
    ],
  },
  {
    id: 16,
    kategori: 'sosyal',
    soru: 'Bir tartışmada rolünüz nedir?',
    soruEn: 'What is your role in an argument?',
    secenekler: [
      { metin: 'Doğrudan söylerim; "Ya hep ya hiç" mantığıyla ilerlerim', metinEn: 'I speak directly; I operate on an "all or nothing" basis', puan: { safravi: 3, demevi: 1, balgami: 0, sevdavi: 0 } },
      { metin: 'Şakacı bir dille yumuşatmaya çalışırım', metinEn: 'I try to lighten the mood with humor', puan: { safravi: 0, demevi: 3, balgami: 1, sevdavi: 0 } },
      { metin: 'Barışı korumak için geri adım atabilirim', metinEn: 'I can step back to keep the peace', puan: { safravi: 0, demevi: 0, balgami: 3, sevdavi: 0 } },
      { metin: 'Sessiz kalır, haklı bile olsam söylemeyebilirim', metinEn: 'I stay quiet; I may not speak even when I\'m right', puan: { safravi: 0, demevi: 0, balgami: 1, sevdavi: 3 } },
    ],
  },
  {
    id: 17,
    kategori: 'sosyal',
    soru: 'Beğenilme ve takdir görme ihtiyacınız ne kadar?',
    soruEn: 'How much do you need appreciation and recognition?',
    secenekler: [
      { metin: 'Sonuçlar beni takdir ettirir, iltifata fazla ihtiyaç duymam', metinEn: 'Results speak for me; I don\'t need much praise', puan: { safravi: 3, demevi: 0, balgami: 0, sevdavi: 1 } },
      { metin: 'Çok ihtiyaç duyarım; eleştirilmek içimi yakar', metinEn: 'I need it a lot; criticism stings deeply', puan: { safravi: 0, demevi: 3, balgami: 1, sevdavi: 0 } },
      { metin: 'Sevgi ve kabullenilmek benim için takdirden önemli', metinEn: 'Love and acceptance matter more to me than praise', puan: { safravi: 0, demevi: 1, balgami: 3, sevdavi: 0 } },
      { metin: 'Takdirden çok adaletli davranılmak isterim', metinEn: 'I care more about being treated fairly than praised', puan: { safravi: 0, demevi: 0, balgami: 0, sevdavi: 3 } },
    ],
  },
  {
    id: 18,
    kategori: 'sosyal',
    soru: 'Bir grup içindeyken genellikle hangi rolü üstlenirsiniz?',
    soruEn: 'What role do you usually take in a group?',
    secenekler: [
      { metin: 'Liderlik ederim, karar alırım', metinEn: 'I lead and make decisions', puan: { safravi: 3, demevi: 1, balgami: 0, sevdavi: 0 } },
      { metin: 'Motivasyon kaynağı olurum, herkesi canlandırırım', metinEn: 'I become the motivator and energize everyone', puan: { safravi: 1, demevi: 3, balgami: 0, sevdavi: 0 } },
      { metin: 'Destekleyici olmayı tercih ederim, uyum sağlarım', metinEn: 'I prefer to be supportive and go with the flow', puan: { safravi: 0, demevi: 0, balgami: 3, sevdavi: 0 } },
      { metin: 'Eleştirmen ya da analist rolünü üstlenirim', metinEn: 'I take on the critic or analyst role', puan: { safravi: 0, demevi: 0, balgami: 0, sevdavi: 3 } },
    ],
  },
  // --- ÇALIŞMA STİLİ ---
  {
    id: 19,
    kategori: 'calisma',
    soru: 'Bir işe başlama konusunda kendinizi nasıl tanımlarsınız?',
    soruEn: 'How would you describe yourself when it comes to starting tasks?',
    secenekler: [
      { metin: 'Hemen başlarım; ertelemek benim için yoktur', metinEn: 'I start right away; procrastination is not for me', puan: { safravi: 3, demevi: 2, balgami: 0, sevdavi: 0 } },
      { metin: 'Coşkuyla başlarım ama bitirmek bazen zor gelir', metinEn: 'I start enthusiastically but finishing can be hard', puan: { safravi: 0, demevi: 3, balgami: 0, sevdavi: 0 } },
      { metin: 'Başlamak için motive olabilmek zaman alır', metinEn: 'Getting motivated to start takes some time', puan: { safravi: 0, demevi: 0, balgami: 3, sevdavi: 0 } },
      { metin: 'Başlamadan önce uzun süre planlar, sonra takılabilirim', metinEn: 'I plan extensively before starting, and can get stuck', puan: { safravi: 0, demevi: 0, balgami: 0, sevdavi: 3 } },
    ],
  },
  {
    id: 20,
    kategori: 'calisma',
    soru: 'Çalışma hızınız nasıldır?',
    soruEn: 'How would you describe your work speed?',
    secenekler: [
      { metin: 'Hızlı ve atik; yavaşlıktan nefret ederim', metinEn: 'Fast and agile; I hate slowness', puan: { safravi: 3, demevi: 2, balgami: 0, sevdavi: 0 } },
      { metin: 'Hızlı ama dağınık; çok işi aynı anda götürürüm', metinEn: 'Fast but scattered; I handle many things at once', puan: { safravi: 1, demevi: 3, balgami: 0, sevdavi: 0 } },
      { metin: 'Yavaş ve istikrarlı; aceleden hatalar yaparım', metinEn: 'Slow and steady; I make mistakes when rushed', puan: { safravi: 0, demevi: 0, balgami: 3, sevdavi: 0 } },
      { metin: 'Metodolojik; adım adım, eksiksiz yapmalıyım', metinEn: 'Methodical; step by step, it must be done perfectly', puan: { safravi: 0, demevi: 0, balgami: 0, sevdavi: 3 } },
    ],
  },
  {
    id: 21,
    kategori: 'calisma',
    soru: 'Düzen ve plan konusunda nasılsınız?',
    soruEn: 'How are you with order and planning?',
    secenekler: [
      { metin: 'Kafamda planlar kurgulamayı severim, kağıt-kalem gerekmiyor', metinEn: 'I plan in my head; I don\'t need paper or lists', puan: { safravi: 3, demevi: 1, balgami: 0, sevdavi: 0 } },
      { metin: 'Düzensizim ama yaratıcıyım; kaos beni yıldırmaz', metinEn: 'I\'m disorganized but creative; chaos doesn\'t bother me', puan: { safravi: 0, demevi: 3, balgami: 0, sevdavi: 0 } },
      { metin: 'Rutine ve alışılagelen prosedürlere bağlıyım', metinEn: 'I stick to routine and established procedures', puan: { safravi: 0, demevi: 0, balgami: 3, sevdavi: 1 } },
      { metin: 'Her şeyin yerli yerinde olmasını isterim; düzensizlik beni strese sokar', metinEn: 'I need everything in order; disorder stresses me', puan: { safravi: 0, demevi: 0, balgami: 0, sevdavi: 3 } },
    ],
  },
  {
    id: 22,
    kategori: 'calisma',
    soru: 'Detaylara verdiğiniz önem nasıl?',
    soruEn: 'How much attention do you pay to details?',
    secenekler: [
      { metin: 'Büyük resme odaklanırım; detaylar başkalarının işi', metinEn: 'I focus on the big picture; details are for others', puan: { safravi: 3, demevi: 1, balgami: 0, sevdavi: 0 } },
      { metin: 'Genel hatları görürüm; ayrıntıları çabuk unuturum', metinEn: 'I see the broad strokes; I quickly forget the details', puan: { safravi: 0, demevi: 3, balgami: 0, sevdavi: 0 } },
      { metin: 'Ayrıntılara dikkat ederim, özellikle usule uygun işler için', metinEn: 'I pay attention to details, especially procedural tasks', puan: { safravi: 0, demevi: 0, balgami: 3, sevdavi: 1 } },
      { metin: 'Her ayrıntıyı kontrol etmeden geçemem', metinEn: 'I can\'t move on without checking every single detail', puan: { safravi: 0, demevi: 0, balgami: 0, sevdavi: 3 } },
    ],
  },
  {
    id: 23,
    kategori: 'calisma',
    soru: 'Risk almaya karşı tutumunuz nedir?',
    soruEn: 'What is your attitude toward taking risks?',
    secenekler: [
      { metin: 'Risk almaktan keyif alırım; büyük kazanım büyük riskle gelir', metinEn: 'I enjoy taking risks; big gains come with big risks', puan: { safravi: 3, demevi: 1, balgami: 0, sevdavi: 0 } },
      { metin: 'Sezgisel kararlarla risk alabilirim', metinEn: 'I can take risks based on intuition', puan: { safravi: 1, demevi: 3, balgami: 0, sevdavi: 0 } },
      { metin: 'Güvenli olanı tercih ederim; risk beni tedirgin eder', metinEn: 'I prefer the safe option; risk makes me uneasy', puan: { safravi: 0, demevi: 0, balgami: 3, sevdavi: 1 } },
      { metin: 'Her ihtimali hesaplarım; hesaplanmış risk alırım', metinEn: 'I calculate every possibility; I take only calculated risks', puan: { safravi: 0, demevi: 0, balgami: 0, sevdavi: 3 } },
    ],
  },
  {
    id: 24,
    kategori: 'calisma',
    soru: 'Öğrenme ve bilgi edinme şekliniz nasıl?',
    soruEn: 'How do you learn and absorb information?',
    secenekler: [
      { metin: 'Yaparak öğrenirim; teori beni sıkar', metinEn: 'I learn by doing; theory bores me', puan: { safravi: 3, demevi: 1, balgami: 0, sevdavi: 0 } },
      { metin: 'Hızlı kavrarım ama çabuk da unuturum', metinEn: 'I grasp things quickly but forget them fast too', puan: { safravi: 0, demevi: 3, balgami: 0, sevdavi: 0 } },
      { metin: 'Yavaş ama kalıcı öğrenirim; tekrar ederek pekiştiririm', metinEn: 'I learn slowly but permanently; repetition helps me', puan: { safravi: 0, demevi: 0, balgami: 3, sevdavi: 0 } },
      { metin: 'Derin araştırma yaparım; yüzeysel kalmaktan nefret ederim', metinEn: 'I research deeply; I hate staying on the surface', puan: { safravi: 0, demevi: 0, balgami: 0, sevdavi: 3 } },
    ],
  },
  // --- KARAR VERME ---
  {
    id: 25,
    kategori: 'karar',
    soru: 'Önemli bir karar vermeniz gerektiğinde nasıl davranırsınız?',
    soruEn: 'How do you act when you need to make an important decision?',
    secenekler: [
      { metin: 'Hızla karar veririm; içgüdülerime güvenirim', metinEn: 'I decide quickly; I trust my gut', puan: { safravi: 3, demevi: 1, balgami: 0, sevdavi: 0 } },
      { metin: 'Çevremdeki insanlara sorar, onların görüşünü alırım', metinEn: 'I ask the people around me for their input', puan: { safravi: 0, demevi: 3, balgami: 1, sevdavi: 0 } },
      { metin: 'Uzun süre düşünür, değişikliği sevmediğim için geciktiririm', metinEn: 'I think for a long time; I delay because I dislike change', puan: { safravi: 0, demevi: 0, balgami: 3, sevdavi: 0 } },
      { metin: 'Her seçeneği analiz ederim; yanlış karardan çok korkarım', metinEn: 'I analyze every option; I\'m very afraid of making the wrong call', puan: { safravi: 0, demevi: 0, balgami: 1, sevdavi: 3 } },
    ],
  },
  {
    id: 26,
    kategori: 'karar',
    soru: 'Kararınızdan pişman olduğunuzda ne yaparsınız?',
    soruEn: 'What do you do when you regret a decision?',
    secenekler: [
      { metin: 'Hemen düzeltmeye girişirim; geride kalanı düşünmem', metinEn: 'I immediately move to fix it; I don\'t dwell on the past', puan: { safravi: 3, demevi: 1, balgami: 0, sevdavi: 0 } },
      { metin: 'Paylaşırım ve olumsuzluğu hızla arkamda bırakırım', metinEn: 'I share it and quickly leave the negativity behind', puan: { safravi: 0, demevi: 3, balgami: 0, sevdavi: 0 } },
      { metin: 'Içimde uzun süre taşırım; kendimi suçlarım', metinEn: 'I carry it for a long time; I blame myself', puan: { safravi: 0, demevi: 0, balgami: 3, sevdavi: 1 } },
      { metin: 'Defalarca gözden geçiririm; "neden?" sorusunu uzun sorgularım', metinEn: 'I review it many times; I ask "why?" for a long time', puan: { safravi: 0, demevi: 0, balgami: 0, sevdavi: 3 } },
    ],
  },
  // --- STRES VE BASKI ---
  {
    id: 27,
    kategori: 'stres',
    soru: 'Baskı ve stres altında nasıl tepki verirsiniz?',
    soruEn: 'How do you react under pressure and stress?',
    secenekler: [
      { metin: 'Daha sert, sabırsız ve saldırgan olurum', metinEn: 'I become harsher, more impatient and aggressive', puan: { safravi: 3, demevi: 0, balgami: 0, sevdavi: 1 } },
      { metin: 'Kaçarım; eğlence ve sosyal ortamda rahatlarım', metinEn: 'I escape; socializing and fun help me relax', puan: { safravi: 0, demevi: 3, balgami: 0, sevdavi: 0 } },
      { metin: 'Geri çekilirim; ağlar ya da uyurum', metinEn: 'I withdraw; I cry or sleep it off', puan: { safravi: 0, demevi: 0, balgami: 3, sevdavi: 1 } },
      { metin: 'Aşırı analiz ederim; donup kalabilirim', metinEn: 'I over-analyze; I can freeze up', puan: { safravi: 0, demevi: 0, balgami: 0, sevdavi: 3 } },
    ],
  },
  {
    id: 28,
    kategori: 'stres',
    soru: 'Zaman baskısı altında çalışmak sizi nasıl etkiler?',
    soruEn: 'How does working under time pressure affect you?',
    secenekler: [
      { metin: 'Daha odaklı ve verimli olurum; baskı beni güçlendirir', metinEn: 'I become more focused and efficient; pressure energizes me', puan: { safravi: 3, demevi: 1, balgami: 0, sevdavi: 0 } },
      { metin: 'Çoğunlukla son dakikaya bırakırım ama hallederim', metinEn: 'I usually leave it to the last minute but manage', puan: { safravi: 0, demevi: 3, balgami: 0, sevdavi: 0 } },
      { metin: 'Baskı altında hata yaparım; panikleyebilirim', metinEn: 'I make mistakes under pressure; I can panic', puan: { safravi: 0, demevi: 0, balgami: 3, sevdavi: 0 } },
      { metin: 'Stres verici buluyorum; önce detaylıca planlamam gerekiyor', metinEn: 'I find it stressful; I need to plan thoroughly first', puan: { safravi: 0, demevi: 0, balgami: 0, sevdavi: 3 } },
    ],
  },
  {
    id: 29,
    kategori: 'stres',
    soru: 'Hayal kırıklığıyla nasıl başa çıkarsınız?',
    soruEn: 'How do you deal with disappointment?',
    secenekler: [
      { metin: 'Sinirlenebilirim ama hızla yeni bir hedef koyarım', metinEn: 'I may get angry but quickly set a new goal', puan: { safravi: 3, demevi: 1, balgami: 0, sevdavi: 0 } },
      { metin: 'Bir süre üzülür ama sosyal ortamda atlatırım', metinEn: 'I feel sad for a bit but get over it in social settings', puan: { safravi: 0, demevi: 3, balgami: 0, sevdavi: 0 } },
      { metin: 'Çok etkiliyor; uzun süre hissettiklerimi taşıyabilirim', metinEn: 'It hits me hard; I can carry those feelings for a long time', puan: { safravi: 0, demevi: 0, balgami: 3, sevdavi: 1 } },
      { metin: 'Sessizce içime çekerim; "neden böyle oldu?" diye uzun süre sorgulamam', metinEn: 'I quietly internalize it and ask "why did this happen?" for long', puan: { safravi: 0, demevi: 0, balgami: 0, sevdavi: 3 } },
    ],
  },
  // --- İLİŞKİ TARZI ---
  {
    id: 30,
    kategori: 'iliski',
    soru: 'Sevginizi en çok nasıl ifade edersiniz?',
    soruEn: 'How do you most express your love?',
    secenekler: [
      { metin: 'Koruyarak, sahiplenerek ve hediyeyle', metinEn: 'By protecting, claiming and giving gifts', puan: { safravi: 3, demevi: 0, balgami: 0, sevdavi: 1 } },
      { metin: 'Sürekli temas, dokunma ve sözel ifadeyle', metinEn: 'Through constant contact, touch, and words of affirmation', puan: { safravi: 0, demevi: 3, balgami: 1, sevdavi: 0 } },
      { metin: 'Hizmet ederek, ihtiyaçları karşılayarak', metinEn: 'By serving and meeting their needs', puan: { safravi: 0, demevi: 0, balgami: 3, sevdavi: 0 } },
      { metin: 'Kaliteli vakit geçirerek ve derin sohbetle', metinEn: 'Through quality time and deep conversations', puan: { safravi: 0, demevi: 0, balgami: 0, sevdavi: 3 } },
    ],
  },
  {
    id: 31,
    kategori: 'iliski',
    soru: 'İlişkide sizi en çok ne rahatsız eder?',
    soruEn: 'What bothers you most in a relationship?',
    secenekler: [
      { metin: 'Bağımsızlığıma kısıtlama getirilmesi', metinEn: 'Having restrictions placed on my independence', puan: { safravi: 3, demevi: 0, balgami: 0, sevdavi: 1 } },
      { metin: 'Rutin ve sıkıcı bir ilişki; heyecan olmaması', metinEn: 'A boring routine relationship with no excitement', puan: { safravi: 0, demevi: 3, balgami: 0, sevdavi: 0 } },
      { metin: 'Sevgisizlik, ilgisizlik ve yalnız bırakılmak', metinEn: 'Lack of love, indifference and being left alone', puan: { safravi: 0, demevi: 1, balgami: 3, sevdavi: 0 } },
      { metin: 'Güvensizlik ve sözünde durmamak', metinEn: 'Lack of trust and not keeping promises', puan: { safravi: 0, demevi: 0, balgami: 1, sevdavi: 3 } },
    ],
  },
  {
    id: 32,
    kategori: 'iliski',
    soru: 'Yakınlarınızla tartışırken nasılsınız?',
    soruEn: 'How are you when arguing with loved ones?',
    secenekler: [
      { metin: 'Dobra konuşur, gerekirse sert çıkabilirim', metinEn: 'I speak bluntly and can be harsh if needed', puan: { safravi: 3, demevi: 1, balgami: 0, sevdavi: 0 } },
      { metin: 'Hızla çözmeye ya da konuyu değiştirmeye çalışırım', metinEn: 'I try to resolve it quickly or change the subject', puan: { safravi: 0, demevi: 3, balgami: 0, sevdavi: 0 } },
      { metin: 'Çatışmadan kaçınırım; geri adım atarım', metinEn: 'I avoid conflict; I take a step back', puan: { safravi: 0, demevi: 0, balgami: 3, sevdavi: 0 } },
      { metin: 'Sessizce küserim; küslüğüm uzun sürebilir', metinEn: 'I go cold and silent; my sulking can last a long time', puan: { safravi: 0, demevi: 0, balgami: 1, sevdavi: 3 } },
    ],
  },
  // --- GÜNLÜK RUTINLER ---
  {
    id: 33,
    kategori: 'rutin',
    soru: 'Sabahları nasıl uyanırsınız?',
    soruEn: 'How do you wake up in the mornings?',
    secenekler: [
      { metin: 'Çok erken, dinç ve enerjik; sabahları verimli çalışırım', metinEn: 'Very early, fresh and energetic; I\'m productive in the morning', puan: { safravi: 3, demevi: 0, balgami: 0, sevdavi: 2 } },
      { metin: 'Uyandığımda heyecanlıyım ama biraz rötarlıyım', metinEn: 'I wake up excited but tend to run a bit late', puan: { safravi: 0, demevi: 3, balgami: 0, sevdavi: 0 } },
      { metin: 'Yataktan çıkmak zordur; birkaç kez alarm kurarım', metinEn: 'Getting out of bed is hard; I set multiple alarms', puan: { safravi: 0, demevi: 0, balgami: 3, sevdavi: 0 } },
      { metin: 'Sakin kalkar, rutinimi düzenli uygularım', metinEn: 'I wake up calmly and follow my routine steadily', puan: { safravi: 0, demevi: 0, balgami: 0, sevdavi: 3 } },
    ],
  },
  {
    id: 34,
    kategori: 'rutin',
    soru: 'Alışveriş yaparken nasılsınız?',
    soruEn: 'How are you when shopping?',
    secenekler: [
      { metin: 'Hızlı karar veririm; en iyisini, en güzelini isterim', metinEn: 'I decide quickly; I want the best and most beautiful', puan: { safravi: 3, demevi: 1, balgami: 0, sevdavi: 0 } },
      { metin: 'Dükkânda çok vakit geçiririm; kontrolsüz harcama yapabilirim', metinEn: 'I spend a lot of time in shops; I can overspend impulsively', puan: { safravi: 0, demevi: 3, balgami: 1, sevdavi: 0 } },
      { metin: 'Rutin yerlerden alırım; değişiklik gerekmez', metinEn: 'I buy from regular places; I don\'t need variety', puan: { safravi: 0, demevi: 0, balgami: 3, sevdavi: 0 } },
      { metin: 'Çok araştırır, fiyat-kalite kıyaslarım; acele etmem', metinEn: 'I research extensively and compare price-quality; no rushing', puan: { safravi: 0, demevi: 0, balgami: 0, sevdavi: 3 } },
    ],
  },
  {
    id: 35,
    kategori: 'rutin',
    soru: 'Boş zamanınızı genellikle nasıl değerlendirirsiniz?',
    soruEn: 'How do you usually spend your free time?',
    secenekler: [
      { metin: 'Spor, rekabetli oyun ya da yeni bir proje başlatırım', metinEn: 'Sports, competitive games or launching a new project', puan: { safravi: 3, demevi: 0, balgami: 0, sevdavi: 1 } },
      { metin: 'Arkadaşlarla buluşur, eğlencelere katılırım', metinEn: 'Meeting friends and attending fun events', puan: { safravi: 0, demevi: 3, balgami: 0, sevdavi: 0 } },
      { metin: 'Evde dinlenir, müzik ya da yemek yaparım', metinEn: 'Relaxing at home, music or cooking', puan: { safravi: 0, demevi: 1, balgami: 3, sevdavi: 0 } },
      { metin: 'Okur, araştırır, sessiz bir köşeye çekilirim', metinEn: 'Reading, researching, retreating to a quiet corner', puan: { safravi: 0, demevi: 0, balgami: 0, sevdavi: 3 } },
    ],
  },
  {
    id: 36,
    kategori: 'rutin',
    soru: 'Eviniz ya da çalışma ortamınız nasıldır?',
    soruEn: 'How is your home or work environment?',
    secenekler: [
      { metin: 'Simetrik ve estetik olmasına önem veririm', metinEn: 'I care about it being symmetrical and aesthetic', puan: { safravi: 3, demevi: 0, balgami: 0, sevdavi: 1 } },
      { metin: 'Renkli ve hareketli; biraz dağınık olabilir', metinEn: 'Colorful and lively; it can get a bit messy', puan: { safravi: 0, demevi: 3, balgami: 0, sevdavi: 0 } },
      { metin: 'Rahat ve sıcak; köşelere yığılmış şeyler olabilir', metinEn: 'Cozy and warm; things might pile up in corners', puan: { safravi: 0, demevi: 0, balgami: 3, sevdavi: 0 } },
      { metin: 'Düzenli ve sade; her şeyin yeri bellidir', metinEn: 'Organized and minimal; everything has its place', puan: { safravi: 0, demevi: 0, balgami: 0, sevdavi: 3 } },
    ],
  },
  // --- SAĞLIK EĞİLİMLERİ ---
  {
    id: 37,
    kategori: 'saglik',
    soru: 'Hastalandığınızda genellikle nasıl bir tablo ortaya çıkar?',
    soruEn: 'What symptoms typically appear when you get sick?',
    secenekler: [
      { metin: 'Ateş ve iltihaplanmalar; hızlı başlar, hızlı geçer', metinEn: 'Fever and inflammation; starts fast and passes fast', puan: { safravi: 3, demevi: 1, balgami: 0, sevdavi: 0 } },
      { metin: 'Solunum yolu hastalıkları ve enerji düşüşleri', metinEn: 'Respiratory illnesses and energy crashes', puan: { safravi: 0, demevi: 3, balgami: 0, sevdavi: 0 } },
      { metin: 'Soğuk algınlığı, balgamlı öksürük, şişme ve eklem ağrıları', metinEn: 'Colds, phlegmy cough, swelling and joint aches', puan: { safravi: 0, demevi: 0, balgami: 3, sevdavi: 0 } },
      { metin: 'Kronik yorgunluk, cilt sorunları ve sindirim bozuklukları', metinEn: 'Chronic fatigue, skin problems and digestive issues', puan: { safravi: 0, demevi: 0, balgami: 0, sevdavi: 3 } },
    ],
  },
  {
    id: 38,
    kategori: 'saglik',
    soru: 'Vücudunuzun genel sıcaklık eğilimi nedir?',
    soruEn: 'What is your body\'s general temperature tendency?',
    secenekler: [
      { metin: 'Baş ve üst bölgem sıcak, altım soğuk (ayaklar)', metinEn: 'My head and upper body are warm, but my lower body (feet) are cold', puan: { safravi: 3, demevi: 0, balgami: 0, sevdavi: 0 } },
      { metin: 'Genelde sıcak; sıcak ortamlardan çabuk etkilenirim', metinEn: 'Generally warm; I\'m quickly affected by hot environments', puan: { safravi: 1, demevi: 3, balgami: 0, sevdavi: 0 } },
      { metin: 'Her zaman soğuk hissederim; soğuk iklimler zor gelir', metinEn: 'I always feel cold; cold climates are hard for me', puan: { safravi: 0, demevi: 0, balgami: 3, sevdavi: 3 } },
      { metin: 'Değişken; hem soğuğa hem sıcağa çabuk uyum sağlarım', metinEn: 'Variable; I adapt quickly to both cold and heat', puan: { safravi: 0, demevi: 2, balgami: 0, sevdavi: 0 } },
    ],
  },
  // --- KİŞİLİK VE DEĞERLER ---
  {
    id: 39,
    kategori: 'kisilik',
    soru: 'Başkalarını ikna etme konusunda kendinizi nasıl tanımlarsınız?',
    soruEn: 'How would you describe yourself when it comes to persuading others?',
    secenekler: [
      { metin: 'Doğrudan ve hızlıyım; mantıkla ya da baskıyla ikna ederim', metinEn: 'I\'m direct and fast; I persuade with logic or assertiveness', puan: { safravi: 3, demevi: 1, balgami: 0, sevdavi: 0 } },
      { metin: 'Heyecanla ve coşkuyla; söylemim insanları etkiler', metinEn: 'With enthusiasm; my words have infectious energy', puan: { safravi: 0, demevi: 3, balgami: 0, sevdavi: 0 } },
      { metin: 'Empatiyle; karşımdakini anlayarak ilerlerim', metinEn: 'With empathy; I proceed by understanding the other person', puan: { safravi: 0, demevi: 1, balgami: 3, sevdavi: 0 } },
      { metin: 'Verilerle ve örneklerle; duygusal değil mantıksal ilerlerim', metinEn: 'With data and examples; I use logic, not emotion', puan: { safravi: 0, demevi: 0, balgami: 0, sevdavi: 3 } },
    ],
  },
  {
    id: 40,
    kategori: 'kisilik',
    soru: 'Mükemmeliyetçilik konusunda nasılsınız?',
    soruEn: 'How are you when it comes to perfectionism?',
    secenekler: [
      { metin: 'Hızlıyım; "yeterince iyi" mantığıyla ilerlerim', metinEn: 'I\'m fast; I operate on "good enough" logic', puan: { safravi: 3, demevi: 1, balgami: 0, sevdavi: 0 } },
      { metin: 'Değil; daha önemli şeyler var hayatta', metinEn: 'Not at all; there are more important things in life', puan: { safravi: 0, demevi: 3, balgami: 1, sevdavi: 0 } },
      { metin: 'Değilim; mükemmel olmasa da sorun değil, önemli olan huzur', metinEn: 'I\'m not; imperfection is fine, peace of mind matters more', puan: { safravi: 0, demevi: 0, balgami: 3, sevdavi: 0 } },
      { metin: 'Yüksek; standartlarımın altında iş yapmaktan rahatsızlık duyarım', metinEn: 'High; I\'m uncomfortable doing work below my standards', puan: { safravi: 0, demevi: 0, balgami: 0, sevdavi: 3 } },
    ],
  },
  {
    id: 41,
    kategori: 'kisilik',
    soru: 'Bağımsızlığa verdiğiniz önem nasıl?',
    soruEn: 'How much do you value independence?',
    secenekler: [
      { metin: 'Çok önem veririm; kontrol edilmekten nefret ederim', metinEn: 'Very much; I hate being controlled', puan: { safravi: 3, demevi: 1, balgami: 0, sevdavi: 2 } },
      { metin: 'Önemli ama insanlarla birlikte olmayı daha çok severim', metinEn: 'Important but I love being with people more', puan: { safravi: 0, demevi: 3, balgami: 0, sevdavi: 0 } },
      { metin: 'Bağımlı olmayı sevmem ama biri yanımda olsa da iyi olur', metinEn: 'I don\'t like dependence but having someone around is nice too', puan: { safravi: 0, demevi: 0, balgami: 3, sevdavi: 0 } },
      { metin: 'Önemli; ama bağımsızlıktan çok prensiplerime bağlıyım', metinEn: 'Important; but I\'m more loyal to my principles than to independence', puan: { safravi: 0, demevi: 0, balgami: 0, sevdavi: 3 } },
    ],
  },
  {
    id: 42,
    kategori: 'kisilik',
    soru: 'Değişime ve yeniliğe karşı tutumunuz nedir?',
    soruEn: 'What is your attitude toward change and novelty?',
    secenekler: [
      { metin: 'Severim; yeni zorluklar ve değişimler beni heyecanlandırır', metinEn: 'I love it; new challenges and changes excite me', puan: { safravi: 3, demevi: 2, balgami: 0, sevdavi: 0 } },
      { metin: 'Büyük tutkuyla karşılarım; yeniliğe açığım', metinEn: 'I embrace it wholeheartedly; I\'m open to novelty', puan: { safravi: 1, demevi: 3, balgami: 0, sevdavi: 0 } },
      { metin: 'Zor gelir; alışkanlıklarımı bozulmasını sevmem', metinEn: 'I find it hard; I dislike disrupting my habits', puan: { safravi: 0, demevi: 0, balgami: 3, sevdavi: 0 } },
      { metin: 'Temkinliyim; değişim iyi analiz edilmiş olmalı', metinEn: 'I\'m cautious; change needs to be well-analyzed', puan: { safravi: 0, demevi: 0, balgami: 0, sevdavi: 3 } },
    ],
  },
  {
    id: 43,
    kategori: 'kisilik',
    soru: 'Güven ve sadakat konusunda kendinizi nasıl görürsünüz?',
    soruEn: 'How do you see yourself regarding trust and loyalty?',
    secenekler: [
      { metin: 'Güvenilir ama bağımsızlığım önce; koşulsuz bağlılık yok', metinEn: 'Reliable but independence first; no unconditional commitment', puan: { safravi: 3, demevi: 0, balgami: 0, sevdavi: 1 } },
      { metin: 'Dostlarıma sonuna kadar bağlıyım; hayatı paylaşmayı severim', metinEn: 'I\'m devoted to my friends; I love sharing life with them', puan: { safravi: 0, demevi: 3, balgami: 1, sevdavi: 0 } },
      { metin: 'Çok sadığım; insanlara kalbimi sonuna kadar açarım', metinEn: 'Very loyal; I open my heart completely to people', puan: { safravi: 0, demevi: 0, balgami: 3, sevdavi: 0 } },
      { metin: 'Güvendiğim insanlara tam bağlıyım; güveni kıranı zor affederim', metinEn: 'Fully committed to those I trust; hard to forgive betrayal', puan: { safravi: 0, demevi: 0, balgami: 0, sevdavi: 3 } },
    ],
  },
  // --- EK SORULAR ---
  {
    id: 44,
    kategori: 'fiziksel',
    soru: 'Gözlerinizin ifadesi ve genel görünümü nasıldır?',
    soruEn: 'What is the expression and general look of your eyes?',
    secenekler: [
      { metin: 'Parlak, keskin ve belirleyici bir bakışım var', metinEn: 'My gaze is bright, sharp and commanding', puan: { safravi: 3, demevi: 0, balgami: 0, sevdavi: 1 } },
      { metin: 'Neşeli ve gülen gözlerim var; ifadem sıcak', metinEn: 'My eyes are joyful and smiling; my expression is warm', puan: { safravi: 0, demevi: 3, balgami: 1, sevdavi: 0 } },
      { metin: 'Yumuşak ve hüzünlü görünümlü; bazen içe dönük', metinEn: 'Soft and slightly sad-looking; sometimes inward', puan: { safravi: 0, demevi: 0, balgami: 3, sevdavi: 1 } },
      { metin: 'Derin ve ciddi; göz altlarımda esmerlik var', metinEn: 'Deep and serious; I have dark circles under my eyes', puan: { safravi: 0, demevi: 0, balgami: 0, sevdavi: 3 } },
    ],
  },
  {
    id: 45,
    kategori: 'sosyal',
    soru: 'Topluluk önünde konuşmak zorunda kalsanız nasıl hissedersiniz?',
    soruEn: 'How would you feel if you had to speak in public?',
    secenekler: [
      { metin: 'Rahat ve doğal; dikkat merkezinde olmayı severim', metinEn: 'Comfortable and natural; I enjoy being the center of attention', puan: { safravi: 3, demevi: 1, balgami: 0, sevdavi: 0 } },
      { metin: 'Heyecanlı ve keyifli; kalabalığa konuşmak beni canlandırır', metinEn: 'Excited and fun; speaking to a crowd energizes me', puan: { safravi: 0, demevi: 3, balgami: 0, sevdavi: 0 } },
      { metin: 'Tedirgin; hazırlıklı olsam bile gerginim', metinEn: 'Nervous; even when prepared I get tense', puan: { safravi: 0, demevi: 0, balgami: 3, sevdavi: 1 } },
      { metin: 'Stresli; mükemmel olmak zorundaymışım gibi hissederim', metinEn: 'Stressed; I feel like I have to be perfect', puan: { safravi: 0, demevi: 0, balgami: 0, sevdavi: 3 } },
    ],
  },
  {
    id: 46,
    kategori: 'calisma',
    soru: 'Ekip çalışmasında nasılsınız?',
    soruEn: 'How are you in teamwork?',
    secenekler: [
      { metin: 'Ekibi yönlendiririm; başkalarına iş bölümü yapmayı severim', metinEn: 'I direct the team; I like delegating tasks to others', puan: { safravi: 3, demevi: 1, balgami: 0, sevdavi: 0 } },
      { metin: 'Olmazsa olmaz; ekip enerjisinden beslenirim', metinEn: 'Essential for me; I feed off team energy', puan: { safravi: 0, demevi: 3, balgami: 1, sevdavi: 0 } },
      { metin: 'İyi uyum sağlarım; uyumlu bir ekip üyesiyim', metinEn: 'I adapt well; I\'m a harmonious team member', puan: { safravi: 0, demevi: 0, balgami: 3, sevdavi: 0 } },
      { metin: 'Yalnız çalışmayı tercih ederim; kalite garantisi istiyorum', metinEn: 'I prefer working alone; I want quality assurance', puan: { safravi: 0, demevi: 0, balgami: 0, sevdavi: 3 } },
    ],
  },
  {
    id: 47,
    kategori: 'kisilik',
    soru: 'Kendinize en yakın gördüğünüz hayvan hangisi?',
    soruEn: 'Which animal do you feel closest to?',
    secenekler: [
      { metin: 'Aslan ya da kartal — güçlü ve bağımsız', metinEn: 'Lion or eagle — powerful and independent', puan: { safravi: 3, demevi: 0, balgami: 0, sevdavi: 1 } },
      { metin: 'Papağan ya da köpek — sosyal ve neşeli', metinEn: 'Parrot or dog — social and cheerful', puan: { safravi: 0, demevi: 3, balgami: 1, sevdavi: 0 } },
      { metin: 'Kedi ya da inek — sakin ve konforunu seven', metinEn: 'Cat or cow — calm and comfort-loving', puan: { safravi: 0, demevi: 0, balgami: 3, sevdavi: 0 } },
      { metin: 'Baykuş ya da karga — bilge ve yalnız', metinEn: 'Owl or raven — wise and solitary', puan: { safravi: 0, demevi: 0, balgami: 0, sevdavi: 3 } },
    ],
  },
  {
    id: 48,
    kategori: 'rutin',
    soru: 'Zaman yönetimi konusunda nasılsınız?',
    soruEn: 'How are you when it comes to time management?',
    secenekler: [
      { metin: 'Dakikim; geç kalınca çok sinirlenebilirim', metinEn: 'I\'m punctual; being late can make me very angry', puan: { safravi: 3, demevi: 0, balgami: 0, sevdavi: 2 } },
      { metin: 'Sık gecikirim; zaman kavramım esnektir', metinEn: 'I\'m often late; my sense of time is flexible', puan: { safravi: 0, demevi: 3, balgami: 1, sevdavi: 0 } },
      { metin: 'Genellikle zamanında yetişirim ama acele etmem', metinEn: 'I usually make it on time but don\'t rush', puan: { safravi: 0, demevi: 0, balgami: 3, sevdavi: 0 } },
      { metin: 'Çok önceden planlar; geç kalma ihtimaline karşı erken çıkarım', metinEn: 'I plan well ahead; I leave early to avoid being late', puan: { safravi: 0, demevi: 0, balgami: 0, sevdavi: 3 } },
    ],
  },
  {
    id: 49,
    kategori: 'duygusal',
    soru: 'Hangi cümle size en çok uyuyor?',
    soruEn: 'Which sentence fits you the most?',
    secenekler: [
      { metin: '"Hemen harekete geç, sonra düşün"', metinEn: '"Act first, think later"', puan: { safravi: 3, demevi: 1, balgami: 0, sevdavi: 0 } },
      { metin: '"Hayat kısa, gül ve eğlen"', metinEn: '"Life is short, laugh and enjoy"', puan: { safravi: 0, demevi: 3, balgami: 0, sevdavi: 0 } },
      { metin: '"Herkesle barışık ol, kimseyi üzme"', metinEn: '"Be at peace with everyone, hurt no one"', puan: { safravi: 0, demevi: 1, balgami: 3, sevdavi: 0 } },
      { metin: '"Doğru yap ya da yapma"', metinEn: '"Do it right or don\'t do it at all"', puan: { safravi: 0, demevi: 0, balgami: 0, sevdavi: 3 } },
    ],
  },
  {
    id: 50,
    kategori: 'kisilik',
    soru: 'Sizi en iyi tanımlayan ifade hangisi?',
    soruEn: 'Which expression describes you best?',
    secenekler: [
      { metin: 'Hedeflerim var, bunları gerçekleştirmek için her şeyi göze alırım', metinEn: 'I have goals and risk everything to achieve them', puan: { safravi: 3, demevi: 0, balgami: 0, sevdavi: 1 } },
      { metin: 'Yaşamı dolu dolu yaşıyorum, her anın tadını çıkarıyorum', metinEn: 'I live life to the fullest and enjoy every moment', puan: { safravi: 0, demevi: 3, balgami: 1, sevdavi: 0 } },
      { metin: 'Huzur ve güven benim için en önemli şeyler', metinEn: 'Peace and security are the most important things for me', puan: { safravi: 0, demevi: 0, balgami: 3, sevdavi: 0 } },
      { metin: 'Kaliteyi ve doğruyu ararım; kolaya kaçmam', metinEn: 'I seek quality and truth; I never take shortcuts', puan: { safravi: 0, demevi: 0, balgami: 0, sevdavi: 3 } },
    ],
  },
];
