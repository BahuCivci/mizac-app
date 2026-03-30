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
  yasak: string[];
  yasakEn: string[];
  detoks: string[];
  detoksEn: string[];
  iliski: string;
  iliskiEn: string;
  sevgiDili: string;
  sevgiDiliEn: string;
  fiziksel: string[];
  fizikselEn: string[];
  renkOnerilir: string[];
  renkOnerilirEn: string[];
  renkOnerilmez: string[];
  renkOnerilmezEn: string[];
  halife: string;
  halifeEn: string;
  mevsim: string;
  mevsimEn: string;
  vakit: string;
  vakitEn: string;
  esmalar: string[];
  emoji: string;
  kariyer: string[];
  kariyerEn: string[];
  hastaliklar: string[];
  hastaliklarEn: string[];
  cocukOzellikleri: string[];
  cocukOzellikleriEn: string[];
  duygular: string[];
  duygularEn: string[];
  yasDonem: string;
  yasDonemEn: string;
  agriTipi: string;
  agriTipiEn: string;
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
    anahtarKelimeler: ['Liderlik', 'Kararlılık', 'Adalet', 'Estetik', 'Mükemmeliyetçilik'],
    anahtarKelimelerEn: ['Leadership', 'Determination', 'Justice', 'Aesthetics', 'Perfectionism'],
    kisaAciklama: 'Ateş gibi enerjik, lider ruhlu ve adalet duygusu güçlü mizaç. Dobra, cesur ve görselliğe düşkün.',
    kisaAciklamaEn: 'Energetic like fire, natural leader with a strong sense of justice. Frank, brave and keen on aesthetics.',
    uzunAciklama: 'Safravî mizaçlı kişiler ateş elementini taşır; hıltları safrâ (öd suyu) dir. Sıcak ve kuru yapıdadırlar. Dobra ve dürüsttürler; "Ya hep ya hiç" anlayışıyla hareket ederler. Mükemmeliyetçi ve simetri severler; estetik zekâları güçlüdür. Adaleti çok önemserler, haksızlığa tahammülleri yoktur. Az ama derin arkadaşlık kurarlar. Öfkeleri çabuk tutuşur ama çabuk da söner. Sabah erken kalkarlar, gece düşünerek geç uyurlar. En merhametli mizaç olarak kabul edilirler.',
    uzunAciklamaEn: 'Cholerics carry the fire element; their humor is bile (acid). They are hot and dry by nature. They are frank and honest, acting on an "all or nothing" principle. Perfectionists who love symmetry with strong aesthetic intelligence. They deeply value justice and cannot tolerate injustice. They form few but deep friendships. Their anger flares quickly but also passes quickly. They wake up early and go to sleep late after much thought. They are considered the most compassionate temperament.',
    gucluYonler: ['Güçlü liderlik ve adalet duygusu', 'Hızlı ve kararlı karar verme', 'Yüksek estetik zekâ', 'Cesaret ve girişimcilik', 'Merhamet (çocuk ve yaşlılara)'],
    gucluYonlerEn: ['Strong leadership and sense of justice', 'Quick and decisive decision-making', 'High aesthetic intelligence', 'Courage and entrepreneurship', 'Compassion (for children and elderly)'],
    zayifYonler: ['Ani öfke patlamaları', 'Sabırsızlık ve aceleci davranma', 'Eleştiriye kapalılık', 'Aşırı mükemmeliyetçilik'],
    zayifYonlerEn: ['Sudden outbursts of anger', 'Impatience and impulsiveness', 'Closed to criticism', 'Excessive perfectionism'],
    saglikEgilimleri: ['Safra kesesi sorunları', 'Mide-reflü ve gastrit', 'Baş ağrısı ve migren', 'Bahar alerjisi', 'Sivilce ve cilt hassasiyeti', 'Sinir sistemi sorunları'],
    saglikEgilimleriEn: ['Gallbladder issues', 'Stomach reflux and gastritis', 'Headache and migraine', 'Spring allergies', 'Acne and skin sensitivity', 'Nervous system issues'],
    beslenme: ['Yeşillikler (ıspanak, marul)', 'Salatalık ve yoğurt', 'Ayran ve karpuz', 'Soğuk meyveler (kavun, elma)'],
    beslenmeEn: ['Greens (spinach, lettuce)', 'Cucumber and yogurt', 'Ayran and watermelon', 'Cold fruits (melon, apple)'],
    yasak: ['Acı ve baharatlı yiyecekler', 'Kızartmalar', 'Kahve ve siyah çay', 'Çikolata', 'Sıcak ve kuru gıdalar'],
    yasakEn: ['Spicy and hot foods', 'Fried foods', 'Coffee and black tea', 'Chocolate', 'Hot and dry foods'],
    detoks: ['Avokado + şeftali + patates püresi', 'Çam sakızlı süt', 'Ispanak + marul smoothie'],
    detoksEn: ['Avocado + peach + mashed potato', 'Pine gum milk', 'Spinach + lettuce smoothie'],
    iliski: 'Safravî ve Demevî mizaçlarla iyi uyum sağlar (sıcak mizaçlar). Sevgi dili hediye almaktır — hediye aldığında sevildiğini hisseder. İlişkide adalet ve saygı ön plandadır; haksızlığa tahammülü yoktur.',
    iliskiEn: 'Gets along well with Choleric and Sanguine temperaments (warm types). Love language is receiving gifts — feels loved when given gifts. Justice and respect come first; cannot tolerate injustice.',
    sevgiDili: 'Hediye Alma — "Bana hediye alırsan seviyorsundur"',
    sevgiDiliEn: 'Receiving Gifts — "If you give me a gift, I know you love me"',
    fiziksel: ['Sarımtırak veya solgun ten rengi (sarı alt tabaka)', 'Kızıl, kestane veya sarı saç; yağlı ve ince telli', 'İnce, sıkı yapılı bünye; kilo almakta güçlük', 'Göz beyazı sarımsı', 'Ayaklar soğuk, baş sıcak (zıt kutuplaşma)', 'Az terleme; ter kuru'],
    fizikselEn: ['Yellowish or pale skin (yellow undertone)', 'Red, chestnut or blonde hair; oily and fine-textured', 'Lean and firm build; difficulty gaining weight', 'Yellowish whites of eyes', 'Cold feet, warm head (opposite poles)', 'Little sweating; dry sweat'],
    renkOnerilir: ['Yeşil', 'Mavi', 'Gri', 'Soğuk tonlar'],
    renkOnerilirEn: ['Green', 'Blue', 'Gray', 'Cool tones'],
    renkOnerilmez: ['Sarı', 'Kırmızı', 'Turuncu', 'Sıcak renkler'],
    renkOnerilmezEn: ['Yellow', 'Red', 'Orange', 'Warm colors'],
    halife: 'Hz. Ömer (r.a.) — Adaletli, heybetli, mükemmeliyetçi; öfkeli ama çabuk sakinleşir',
    halifeEn: 'Umar ibn al-Khattab — Just, majestic, perfectionist; angry but quickly calms down',
    mevsim: 'Yaz (kendi mevsiminde daha çok hastalanır)',
    mevsimEn: 'Summer (most prone to illness in their own season)',
    vakit: 'Sabah-Öğle arası',
    vakitEn: 'Late morning to noon',
    esmalar: ['Ya Hâlim', 'Ya Selim', 'Ya Gafûr', 'Ya Sabûr', 'Ya Hâkem', 'Ya Selam', 'Ya Mâlikel Mülk', 'Ya Muksit'],
    emoji: '🔥',
    kariyer: ['İç mimar / dekoratör — görsel zekâları çok iyidir, ortamı kişiselleştirmeyi ve değiştirmeyi severler', 'Ticaret / girişimcilik — para hareketliliği çok olduğu için ticarette başarılıdırlar', 'Komutanlık / koçluk — disiplinli ve net duruşlarıyla liderlik rollerine uygundurlar', 'Avukatlık — inandıkları davayı sonuna kadar savunabilirler', 'Uygun olmayan: Masa başı ve hareketsiz işler; tatlı dille ikna gerektiren meslekler'],
    kariyerEn: ['Interior designer / decorator — strong visual intelligence, love personalizing spaces', 'Trade / entrepreneurship — successful in business due to high energy and initiative', 'Command / coaching — disciplined and clear-principled, suited to leadership roles', 'Law — can defend what they believe in to the end', 'Not suited: Desk-bound sedentary jobs; roles requiring constant gentle persuasion'],
    hastaliklar: ['Safra kesesi hastalıkları (taş, çamurlaşma) — en belirgin rahatsızlıktır', 'Mide hastalıkları — reflü, gastrit, mide yanması ve kramplar', 'Cilt rahatsızlıkları — sivilce, ani kızarıklıklar, saç derisi kaşıntısı', 'Alerjik rahatsızlıklar ve bahar alerjisi', 'Karaciğer ve safra yolu hastalıkları', 'Ayakta yanma hissi'],
    hastaliklarEn: ['Gallbladder diseases (stones, sludge) — most prominent condition', 'Stomach diseases — reflux, gastritis, heartburn and cramps', 'Skin issues — acne, sudden redness, scalp itching', 'Allergic conditions and spring allergies', 'Liver and bile duct diseases', 'Burning sensation in feet'],
    cocukOzellikleri: ['Bebek: Geceleri pek uyumayan, çığlık atarak ağlayan, kucak isteyen ama hareketten duramayan bebekler. Dış seslere hassastırlar, her seste irkilirler', 'Çocuk: Zayıf yapılı ama güçlü, çok hareketli ve inatçı; aynı zamanda merhametli. Yemekte seçici ve değişkendir', 'Okul: Öğretmenin en çok şikâyet ettiği, çok hareketli çocuk. Görsel dersler ve sporla öne çıkar. Oturabilmesi sağlandığında başarı kendiliğinden gelir', 'Uyarı: Safrasını bilmeden artırırsanız hiperaktif olur'],
    cocukOzellikleriEn: ['Baby: Rarely sleeps at night, cries loudly, wants to be held but can\'t stay still. Startles at every sound', 'Child: Thin but strong, very energetic and stubborn; yet compassionate. Picky and changeable about food', 'School: The child teachers complain about most — very active. Excels in visual subjects and sports. Success comes naturally when sitting is managed', 'Warning: Increasing their bile unknowingly causes hyperactivity'],
    duygular: ['Öfke ve gerilim — en bilinen duygu özelliğidir; çabuk tutuşur ama çabuk söner', 'Merhamet — öfkeli görünseler de merhametli yapılarını korurlar', 'Hırs ve rekabetçilik — güçlü bir rekabet duygusu taşırlar', 'Öfkeli bir yaşam safrayı artırır; kısır döngü oluşabilir'],
    duygularEn: ['Anger and tension — most known emotional trait; flares quickly but passes fast', 'Compassion — despite appearing angry, they retain their compassionate nature', 'Ambition and competitiveness — carry a strong competitive drive', 'An angry lifestyle increases bile; a vicious cycle can form'],
    yasDonem: 'Gençlik (12–40 yaş) — safravî mizaçla ilişkilendirilir; vücuttaki nem azalır, kuruma başlar, büyüme enine gerçekleşir',
    yasDonemEn: 'Youth (12–40 years) — associated with choleric temperament; body moisture decreases, drying begins, growth becomes lateral',
    agriTipi: 'Yanma — ağrı "cayır cayır yanıyor" şeklinde hissedilir',
    agriTipiEn: 'Burning — pain felt as a searing, fiery sensation',
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
    anahtarKelimeler: ['Sosyallik', 'Neşe', 'Cömertlik', 'Yaratıcılık', 'Maneviyat'],
    anahtarKelimelerEn: ['Sociability', 'Joy', 'Generosity', 'Creativity', 'Spirituality'],
    kisaAciklama: 'Hava gibi özgür, sosyal ve neşeli mizaç. "Aşk insanı"; çok uykucu, cömert ve maneviyata yatkın.',
    kisaAciklamaEn: 'Free like air, social and joyful temperament. "Person of love"; loves to sleep, generous and spiritually inclined.',
    uzunAciklama: 'Demevî mizaçlı kişiler hava elementini taşır; hıltları dem (kan) dır. Sıcak ve ıslak yapıdadırlar. Çok hızlı arkadaşlık kurarlar; ortama neşe ve enerji katarlar. Övgü ve ilgiden beslenirler; eleştiriyi sevmezler. En çok uyuyan mizaçtır — sabah kalkmakta çok zorlanırlar. Cömert ve hayırseverdirler; maneviyata ve ibadete doğaları gereği yatkındırlar. Olayları ve duyguları abartırlar; coşkuludurlar.',
    uzunAciklamaEn: 'Sanguines carry the air element; their humor is blood. They are hot and moist by nature. They make friends very quickly and bring joy and energy to any setting. They thrive on praise and attention; they dislike criticism. They are the temperament that sleeps the most — they really struggle to wake up in the morning. They are generous and charitable; by nature they are inclined toward spirituality and worship. They tend to exaggerate events and emotions; they are enthusiastic.',
    gucluYonler: ['Güçlü sosyallik ve iletişim', 'Doğal ikna kabiliyeti', 'Cömertlik ve yardımseverlik', 'Yaratıcılık ve yenilikçilik', 'Maneviyata yatkınlık'],
    gucluYonlerEn: ['Strong sociability and communication', 'Natural persuasion ability', 'Generosity and helpfulness', 'Creativity and innovation', 'Spiritually inclined'],
    zayifYonler: ['Sabah kalkmakta güçlük', 'Dağınıklık ve unutkanlık', 'Eleştiriye kapalılık (küser)', 'Abartma eğilimi', 'Odak güçlüğü'],
    zayifYonlerEn: ['Difficulty waking up in the morning', 'Messiness and forgetfulness', 'Closed to criticism (sulks)', 'Tendency to exaggerate', 'Difficulty focusing'],
    saglikEgilimleri: ['Karaciğer sorunları', 'Kalp çarpıntısı', 'Baş ağrısı ve migren', 'Akne ve çıban (bacak/kalça)', 'Âdet problemleri ve miyom', 'Tansiyon yüksekliği'],
    saglikEgilimleriEn: ['Liver issues', 'Heart palpitations', 'Headache and migraine', 'Acne and boils (legs/hips)', 'Menstrual problems and fibroids', 'High blood pressure'],
    beslenme: ['Ekşi meyveler (alıç, nar, erik)', 'Soğuk ve ekşi gıdalar', 'Alıç sirkesi', 'Demirhindi', 'Ekşi nar suyu'],
    beslenmeEn: ['Sour fruits (hawthorn, pomegranate, plum)', 'Cold and sour foods', 'Hawthorn vinegar', 'Tamarind', 'Sour pomegranate juice'],
    yasak: ['Kızartma ve yağlı yemekler', 'Şeker ve tatlılar', 'Alkol', 'Sıcak ve ıslak gıdalar'],
    yasakEn: ['Fried and fatty foods', 'Sugar and sweets', 'Alcohol', 'Hot and moist foods'],
    detoks: ['Alıç sirkesi kürü', 'Demirhindi şerbeti', 'Ekşi nar suyu', 'Sarı erik hoşafı'],
    detoksEn: ['Hawthorn vinegar cure', 'Tamarind sherbet', 'Sour pomegranate juice', 'Yellow plum compote'],
    iliski: 'Demevî ve Safravî mizaçlarla iyi uyum sağlar (sıcak mizaçlar). Sevgi dili sözel takdirdir — "Ne kadar güzelsin", "Çok yeteneklisin" gibi övgüler çok değerlidir.',
    iliskiEn: 'Gets along well with Sanguine and Choleric temperaments (warm types). Love language is words of affirmation — praise like "You are so beautiful" and "You are so talented" is highly valued.',
    sevgiDili: 'Sözel Takdir — "Översen sevildiğimi hissederim"',
    sevgiDiliEn: 'Words of Affirmation — "I feel loved when you praise me"',
    fiziksel: ['Pembe veya kırmızı alt tabanlı ten (canlı, ışıltılı)', 'Kumral veya siyah saç; kalın telli, dalgalı, gür ve yağlı', 'Orta yapılı; kilo alınca kaslara yansır', 'Eller ılık-sıcak, nemli cilt', 'Tüylenmeye müsait vücut', 'Göz beyazlarında neşe ve parlaklık'],
    fizikselEn: ['Pink or rosy skin tone (vibrant, glowing)', 'Auburn or black hair; thick-textured, wavy, full and oily', 'Medium build; weight gain shows in muscles', 'Warm hands, moist skin', 'Prone to body hair', 'Bright and joyful eyes'],
    renkOnerilir: ['Mavi', 'Beyaz', 'Gri', 'Mor', 'Soğuk tonlar'],
    renkOnerilirEn: ['Blue', 'White', 'Gray', 'Purple', 'Cool tones'],
    renkOnerilmez: ['Kırmızı', 'Turuncu', 'Sarı', 'Sıcak renkler'],
    renkOnerilmezEn: ['Red', 'Orange', 'Yellow', 'Warm colors'],
    halife: 'Hz. Ebu Bekir (r.a.) — Cömert, sevecen, aşk ehli; Resülullah\'a derin bağlılığıyla tanınır',
    halifeEn: 'Abu Bakr al-Siddiq — Generous, loving, person of love; known for deep devotion to the Prophet',
    mevsim: 'İlkbahar (kendi mevsiminde daha çok hastalanır; hacamat mevsimi)',
    mevsimEn: 'Spring (most prone to illness in their own season; cupping season)',
    vakit: 'Sabah (en zorlandıkları vakit)',
    vakitEn: 'Morning (the time they struggle most)',
    esmalar: ['Ya Hasib', 'Ya Tevvâb', 'Ya Afüvv', 'Ya Muksid', 'Ya Hâdi', 'Ya Hafîz', 'Ya Semî', 'Er Raşid'],
    emoji: '💨',
    kariyer: ['Öğretmenlik / rehber öğretmenlik — pozitif enerji ve sıcakkanlılıkla öğrencileri çeker', 'Tiyatrocu / sanatçı — rol yapma ve taklit etme yetenekleri çok gelişmiştir', 'Turist rehberi — iletişim ve konuşma becerileri çok güçlüdür', 'Emlâkçı / pazarlama — ikna kabiliyetleri yüksek olduğu için ürün ve hizmet satışında başarılıdırlar', 'Vaizlik / liderlik — bütüncül bakış açısı ve yorumlama yeteneği gerektiren alanlarda öne çıkarlar', 'Uygun olmayan: Matematik ağırlıklı ve çok fazla dikkat gerektiren meslekler'],
    kariyerEn: ['Teaching / guidance counseling — draws students with positive energy and warmth', 'Actor / artist — highly developed talent for acting and imitation', 'Tour guide — very strong communication and speaking skills', 'Real estate / marketing — high persuasion ability leads to sales success', 'Preaching / leadership — excels in fields requiring holistic perspective and interpretation', 'Not suited: Math-heavy jobs or those requiring sustained intense focus'],
    hastaliklar: ['Karaciğer ve kalp hastalıkları — kanla ilgili hastalıklar ağırlıklıdır', 'Çarpıntı — kalpleri ara ara aniden hızlanır, farkında olmayabilirler', 'Baş ağrısı ve migren — kan fazlalığı veya kirli kanın bir bölgede toplanması nedeniyle', 'Akne ve çıban — daha çok bacak ve kalça bölgelerinde görülür', 'Âdet problemleri, miyom ve hormon bozukluğu', 'Tansiyon rahatsızlıkları'],
    hastaliklarEn: ['Liver and heart diseases — blood-related conditions are predominant', 'Palpitations — heart suddenly speeds up occasionally, may go unnoticed', 'Headache and migraine — due to excess blood or dirty blood pooling', 'Acne and boils — mostly on legs and hips', 'Menstrual problems, fibroids and hormonal imbalances', 'Blood pressure disorders'],
    cocukOzellikleri: ['Bebek: Güleryüzlü, kendini sevdiren bebeklerdir. Saçları kıvır kıvır olmaya meyillidir. Herkese el sallayan, arkadaş canlısı; konuşmayı çabuk öğrenir', 'Çocuk: Sevecen, hareketli ve oyun seven. Aynanın karşısında şarkı söyler, taklit yapar. Süslenmeyi ve beğenilmeyi sever', 'Okul: Sınıfın popüleri; öğretmenlerin adını ezbere bildiği çocuk. Sözel derslerde başarılı, matematikten sıkıntı yaşar. 23 Nisan törenlerinde hep ön sırada', 'Uyarı: Demini bilmeden artırırsanız yasaklara meyli olur, merakının esiri olur'],
    cocukOzellikleriEn: ['Baby: Smiley, lovable babies. Hair tends to curl. Waves at everyone, friendly; learns to talk quickly', 'Child: Affectionate, active, loves to play. Sings and imitates in front of mirrors. Loves dressing up and being admired', 'School: The class star; teacher knows their name by heart. Excels in verbal subjects, struggles with math. Always at the front in school ceremonies', 'Warning: Increasing their blood unknowingly makes them prone to rule-breaking and impulsiveness'],
    duygular: ['Aşık olmak, arkadaşlık ve cömertlik — en bilinen duygu özelliğidir', 'Neşe ve maneviyat duygusu çok güçlüdür', 'Aşık olduğunda kanı artar; demevi neşesi yerine gelir ve insanlarla görüşmek ister', 'Sabırsızlık ve heyecan duyguları da ön plandadır'],
    duygularEn: ['Being in love, friendship and generosity — most known emotional traits', 'Joy and spiritual feelings are very strong', 'When in love, blood increases; sanguine joy returns and they want to be with people', 'Impatience and excitement are also prominent feelings'],
    yasDonem: 'Çocukluk (3–12 yaş) — demevî mizaçla ilişkilendirilir; vücut çok kan üretir, bu dönemdeki kaliteli kan ömür boyu kullanılır',
    yasDonemEn: 'Childhood (3–12 years) — associated with sanguine temperament; body produces much blood, quality blood from this period lasts a lifetime',
    agriTipi: 'Zonklama — ağrı zonklayarak hissedilir',
    agriTipiEn: 'Throbbing — pain felt as a pulsating throb',
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
    anahtarKelimeler: ['Sabır', 'Güven', 'Fedakârlık', 'Sakinlik', 'Analiz'],
    anahtarKelimelerEn: ['Patience', 'Trust', 'Selflessness', 'Calm', 'Analysis'],
    kisaAciklama: 'Su gibi sakin, sabırlı, temkinli ve güvenilir mizaç. Kırgınlıklarını içine atar; bağlandığında derin ve sadıktır.',
    kisaAciklamaEn: 'Calm like water, patient, cautious and reliable temperament. Holds grievances inside; when attached, deep and loyal.',
    uzunAciklama: 'Balgamî mizaçlı kişiler su elementini taşır; hıltları balgam (mukus) dur. Soğuk ve ıslak yapıdadırlar. Sakin, barışçıl ve uzlaşmacıdırlar. Temkinlidirler; risk almazlar, güvenilmesi zaman ister. Karar vermekte güçlük çekerler. Konfora düşkündürler; hareketsizliğe ve kilo almaya meyillidirler. Kin tutarlar — kırgınlıklarını içlerinde saklarlar ama konuşmazlar. İrade zayıflığı en büyük mücadele alanlarıdır.',
    uzunAciklamaEn: 'Phlegmatics carry the water element; their humor is phlegm (mucus). They are cold and moist by nature. They are calm, peaceful and conciliatory. They are cautious; they don\'t take risks and take time to trust. They have difficulty making decisions. They love comfort; they tend toward inactivity and weight gain. They hold grudges — they hide their grievances inside but won\'t talk about them. Weakness of will is their greatest challenge.',
    gucluYonler: ['Sabır ve uzun soluklu dayanıklılık', 'Fedakârlık ve güvenilirlik', 'Sakinlik ve uzlaşma yeteneği', 'Analitik ve pratik düşünce', 'Derin sadakat'],
    gucluYonlerEn: ['Patience and long-term endurance', 'Selflessness and reliability', 'Calmness and conciliation ability', 'Analytical and practical thinking', 'Deep loyalty'],
    zayifYonler: ['Karar vermekte güçlük', 'Kırgınlıkları içine atma', 'Hareketsizliğe ve kilo almaya meyil', 'İrade zayıflığı', 'Obsesif eğilimler'],
    zayifYonlerEn: ['Difficulty making decisions', 'Holding grievances inside', 'Tendency toward inactivity and weight gain', 'Weakness of will', 'Obsessive tendencies'],
    saglikEgilimleri: ['Astım ve bronşit', 'Sinüzit ve kronik öksürük', 'Eklem ağrıları ve romatizma', 'Obezite ve metabolizma yavaşlığı', 'Boğaz ve akciğer sorunları', 'Uyku apnesi'],
    saglikEgilimleriEn: ['Asthma and bronchitis', 'Sinusitis and chronic cough', 'Joint pain and rheumatism', 'Obesity and slow metabolism', 'Throat and lung issues', 'Sleep apnea'],
    beslenme: ['Zencefil ve tarçın', 'Sıcak baharatlı çorbalar', 'Kuru meyveler', 'Sıcak ve kuru gıdalar'],
    beslenmeEn: ['Ginger and cinnamon', 'Hot spicy soups', 'Dried fruits', 'Hot and dry foods'],
    yasak: ['Soğuk su ve soğuk içecekler', 'Süt ürünleri (aşırı)', 'Hamur işleri ve şeker', 'Soğuk ve ıslak gıdalar'],
    yasakEn: ['Cold water and cold drinks', 'Dairy products (excess)', 'Pastries and sugar', 'Cold and moist foods'],
    detoks: ['Aspir yağı kürü', 'Greyfurt suyu', 'Kereviz + havuç çorbası', 'Sauna ve ter atma tedavisi'],
    detoksEn: ['Safflower oil cure', 'Grapefruit juice', 'Celery + carrot soup', 'Sauna and sweat therapy'],
    iliski: 'Balgamî ve Sevdavî mizaçlarla iyi uyum sağlar (soğuk mizaçlar). Sevgi dili dokunmadır — el tutma, sarılma ve fiziksel yakınlık çok değerlidir.',
    iliskiEn: 'Gets along well with Phlegmatic and Melancholic temperaments (cold types). Love language is physical touch — holding hands, hugging and physical closeness is very valuable.',
    sevgiDili: 'Dokunma — "Elimi tutarsan, sarılırsan sevildiğimi hissederim"',
    sevgiDiliEn: 'Physical Touch — "I feel loved when you hold my hand or hug me"',
    fiziksel: ['Açık, bebek teni gibi beyaz cilt', 'Açık kumral, sarışın veya beyaz saç; ince ve düz', 'Kilolu veya tombul yapı; karın bölgesinde yağlanma', 'El ve ayaklar soğuk; soğuk ter', 'Omuzlar düşük', 'Dudaklar açık kırmızı, tırnaklar açık pembe'],
    fizikselEn: ['Light, baby-like white skin', 'Light auburn, blonde or white hair; thin and straight', 'Plump or overweight build; fat accumulates around abdomen', 'Cold hands and feet; cold sweat', 'Drooping shoulders', 'Light red lips, light pink nails'],
    renkOnerilir: ['Turuncu', 'Kırmızı', 'Sarı', 'Sıcak pembe', 'Açık yeşil'],
    renkOnerilirEn: ['Orange', 'Red', 'Yellow', 'Warm pink', 'Light green'],
    renkOnerilmez: ['Mavi', 'Siyah', 'Beyaz', 'Soğuk tonlar'],
    renkOnerilmezEn: ['Blue', 'Black', 'White', 'Cool tones'],
    halife: 'Hz. Osman (r.a.) — Sakin, sessiz, utangaç; Kur\'an-ı Kerim\'i çoğaltma hizmetiyle tanınır',
    halifeEn: 'Uthman ibn Affan — Calm, quiet, shy; known for his service in compiling the Quran',
    mevsim: 'Kış (kendi mevsiminde daha çok hastalanır)',
    mevsimEn: 'Winter (most prone to illness in their own season)',
    vakit: 'Gece',
    vakitEn: 'Night',
    esmalar: ['Ya Vedûd', 'Ya Kaviyy', 'Ya Metîn', 'Ya Muhyî', 'Ya Şekûr', 'Ya Bâri', 'Ya Bâsid'],
    emoji: '💧',
    kariyer: ['Doktor / cerrah — çok zeki olduklarından tıp alanında kendilerini iyi geliştirirler', 'Mühendislik (makine, matematik) — hareketsiz ve zekâ gerektiren mühendislik dallarında başarılıdırlar', 'Muhasebe / mali müşavir / bankacı — kafaları hızlı çalıştığı için sayısal ve dikkat gerektiren işlerde öne çıkarlar', 'Masa başında zekâ ve dikkat gerektiren her meslek uygundur', 'Uygun olmayan: Bedenen çok efor gerektiren işler (garsonluk, inşaat işçiliği, futbol hakemliği vb.)'],
    kariyerEn: ['Doctor / surgeon — highly intelligent, develop themselves well in medicine', 'Engineering (mechanical, math) — successful in engineering fields not requiring heavy physical work', 'Accounting / financial advisor / banking — quick thinkers who excel in numerical and attention-demanding roles', 'Any desk job requiring intelligence and focus is suitable', 'Not suited: Physically demanding jobs (waitstaff, construction, sports referee, etc.)'],
    hastaliklar: ['Astım, bronşit, zatürre ve nefes darlığı — mukus akciğerleri etkileyerek solunum yolu hastalıklarına yol açar', 'Sinüzit ve kronik geniz akıntısı', 'Eklem ağrıları ve romatizma', 'Obezite ve kilo alma eğilimi', 'Ağız kokusu ve kabızlık — bağırsak atıklarından kaynaklanır', 'Göz kuruluğu, ter kokusu ve demir eksikliği'],
    hastaliklarEn: ['Asthma, bronchitis, pneumonia and shortness of breath — mucus affects the lungs causing respiratory conditions', 'Sinusitis and chronic nasal discharge', 'Joint pain and rheumatism', 'Obesity and tendency to gain weight', 'Bad breath and constipation — from intestinal waste buildup', 'Eye dryness, body odor and iron deficiency'],
    cocukOzellikleri: ['Bebek: Çok ağlamayan, uslu bebeklerdir. Tombul yapılıdır; bir yere oturtulunca beş dakika sonra aynı yerlerinde oyuncaklarıyla oynarlar', 'Çocuk: Kilolu, sakin, kavga etmeyen çocuklar. Çok zekidirler; bir hareketi bir kere görseler yaparlar. İçe kapanık ve alıngan ama temkinli', 'Okul: İki tip görülür — arka sırada kendini görünmez yapan ya da öne oturup görünmek istemeyen ama sayısal derslerde parlayan. Matematikten 99 alıp ağlayan çocuklar genelde bu gruptandır', 'Uyarı: Balgamını bilmeden artırırsanız tembel ve içine kapanık olur'],
    cocukOzellikleriEn: ['Baby: Rarely cries, well-behaved babies. Chubby build; when placed somewhere, five minutes later still found in the same spot playing with toys', 'Child: Chubby, calm, non-confrontational. Very intelligent; can repeat a movement after seeing it once. Introverted and sensitive but cautious', 'School: Two types — one makes themselves invisible in the back row, the other sits in front but doesn\'t want attention yet excels in math. Kids who cry over getting 99% in math are usually this type', 'Warning: Increasing their phlegm unknowingly makes them lazy and withdrawn'],
    duygular: ['Üzüntü ve geçmiş düşünceler — en bilinen duygu özelliğidir; kırgınlıklarını içine atar', 'Tedirginlik ve endişe duyguları ağır basar', 'Kendini ifade etmede güçlük ve utangaçlık; boğaz bölgesinden en çok sorun yaşarlar', 'Üzüldüklerinde balgamı artar; üzüntüyle hastalık arasında güçlü bir bağ vardır'],
    duygularEn: ['Sadness and dwelling on the past — most known emotional trait; swallows grievances', 'Anxiety and worry feelings dominate', 'Difficulty expressing themselves and shyness; most issues arise around the throat area', 'When sad, phlegm increases; there is a strong link between sadness and illness'],
    yasDonem: 'Bebeklik (0–3 yaş) — balgamî mizaçla ilişkilendirilir; tüm bebekler bu dönemde balgami özellikler taşır, anne karnındaki su ortamından gelirler',
    yasDonemEn: 'Infancy (0–3 years) — associated with phlegmatic temperament; all babies carry phlegmatic traits in this period, coming from the watery womb environment',
    agriTipi: 'Tutulma ve kilitlenme — ağrı "tutuluyor, kilitlenmiş" şeklinde hissedilir',
    agriTipiEn: 'Stiffness and locking — pain felt as a gripping, locked-up sensation',
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
    anahtarKelimeler: ['Derinlik', 'Sadakat', 'Analiz', 'Titizlik', 'Güçlü hafıza'],
    anahtarKelimelerEn: ['Depth', 'Loyalty', 'Analysis', 'Meticulousness', 'Strong memory'],
    kisaAciklama: 'Toprak gibi sağlam ve derin mizaç. Ketum, analitik, sadık ve güçlü hafızalı. Yalnızlığı ve sessizliği sever.',
    kisaAciklamaEn: 'Solid and deep like earth. Reserved, analytical, loyal with strong memory. Loves solitude and silence.',
    uzunAciklama: 'Sevdavî mizaçlı kişiler toprak elementini taşır; hıltları sovda (kara safra / toksin) dur. Soğuk ve kuru yapıdadırlar. Ketum ve duygularını göstermezler. Analitik, titiz ve detaycıdırlar; güçlü hafızaları vardır. Çabuk ikna olmazlar; mantıkla ikna edilirler. Başlamakta güçlük çekerler (prokrastinasyon) ama bir karar verince inatla uygularlar. Yalnız kalmayı severler; az ama derin arkadaşlıkları vardır. Depresyon ve vesvese riski taşırlar.',
    uzunAciklamaEn: 'Melancholics carry the earth element; their humor is black bile (toxin). They are cold and dry by nature. They are reserved and don\'t show their emotions. Analytical, meticulous and detail-oriented with strong memory. They are not easily convinced; logic convinces them. They have difficulty starting (procrastination) but once they decide, they apply it stubbornly. They love solitude; they have few but deep friendships. They carry risks of depression and obsessive thoughts.',
    gucluYonler: ['Güçlü hafıza ve dikkat', 'Derin analitik düşünce', 'Sadakat ve vefakârlık', 'Titizlik ve güvenilirlik', 'Soğukkanlılık ve sabır'],
    gucluYonlerEn: ['Strong memory and attention', 'Deep analytical thinking', 'Loyalty and faithfulness', 'Meticulousness and reliability', 'Composure and patience'],
    zayifYonler: ['Prokrastinasyon (başlamakta güçlük)', 'Vesvese ve aşırı düşünme', 'Karamsarlık ve depresyon eğilimi', 'Ketum ve sosyal çekilme', 'Tutumluluğun cimriliğe kaçması'],
    zayifYonlerEn: ['Procrastination (difficulty starting)', 'Obsessive thinking and overthinking', 'Pessimism and depression tendency', 'Withdrawn and socially isolated', 'Thriftiness turning into stinginess'],
    saglikEgilimleri: ['İskelet ve kronik vücut ağrıları', 'Tırnak, saç ve diş problemleri', 'Kronik yorgunluk ve varis', 'Demir eksikliği ve anemi', 'Depresyon ve kaygı bozuklukları', 'Işık ve ses hassasiyeti'],
    saglikEgilimleriEn: ['Skeletal and chronic body aches', 'Nail, hair and tooth problems', 'Chronic fatigue and varicose veins', 'Iron deficiency and anemia', 'Depression and anxiety disorders', 'Light and sound sensitivity'],
    beslenme: ['Hurma ve incir', 'Kemik suyu ve et çorbası', 'Bal ve zeytinyağı', 'Pişmiş sebzeler ve baklagiller'],
    beslenmeEn: ['Dates and figs', 'Bone broth and meat soup', 'Honey and olive oil', 'Cooked vegetables and legumes'],
    yasak: ['Kahve ve siyah çay', 'Çikolata ve kakao', 'Baharatlı ve acı yiyecekler', 'Soğuk ve kuru gıdalar'],
    yasakEn: ['Coffee and black tea', 'Chocolate and cocoa', 'Spicy and hot foods', 'Cold and dry foods'],
    detoks: ['Zeytinyağlı incir kürü (40 gün)', 'Hurma lapası', 'Kemik suyu kürü', 'Nohut + fasulye çorbası'],
    detoksEn: ['Olive oil fig cure (40 days)', 'Date paste', 'Bone broth cure', 'Chickpea + bean soup'],
    iliski: 'Sevdavî ve Balgamî mizaçlarla iyi uyum sağlar (soğuk mizaçlar). Sevgi dili hizmettir — bir şey yapıldığında, ilgilenildiğinde sevildiğini hisseder. Uzun süre gözlemler, sonra bağlanır; bağlanınca çok derindir.',
    iliskiEn: 'Gets along well with Melancholic and Phlegmatic temperaments (cold types). Love language is acts of service — feels loved when something is done for them. Observes for a long time, then attaches; when attached, it is very deep.',
    sevgiDili: 'Hizmet — "Benim için bir şey yaparsan sevildiğimi hissederim"',
    sevgiDiliEn: 'Acts of Service — "I feel loved when you do something for me"',
    fiziksel: ['Gri veya solgun ten (gri alt tabaka)', 'Göz altı koyuluğu ve donuk bakış', 'Kemiksi, kuru ve zayıf yapı; kilo alamaz', 'El ve ayaklar soğuk; az terler', 'Yüz hatları belirgin (elmacık kemikleri çıkık)', 'Dudaklar ve tırnaklar koyu renk'],
    fizikselEn: ['Gray or pale skin (gray undertone)', 'Dark circles under eyes and dull gaze', 'Bony, dry and thin build; cannot gain weight', 'Cold hands and feet; little sweating', 'Defined facial features (prominent cheekbones)', 'Dark lips and nails'],
    renkOnerilir: ['Turuncu', 'Kırmızı', 'Sarı', 'Sıcak pembe', 'Sıcak ve canlı renkler'],
    renkOnerilirEn: ['Orange', 'Red', 'Yellow', 'Warm pink', 'Warm and vibrant colors'],
    renkOnerilmez: ['Siyah', 'Koyu mavi', 'Koyu gri', 'Karanlık ve soğuk tonlar'],
    renkOnerilmezEn: ['Black', 'Dark blue', 'Dark gray', 'Dark and cool tones'],
    halife: 'Hz. Ali (r.a.) — Titiz, planlı, güçlü hafızalı, vefalı ve derin düşünen; ketumluğuyla tanınır',
    halifeEn: 'Ali ibn Abi Talib — Meticulous, planned, strong memory, faithful and deep thinker; known for his reserved nature',
    mevsim: 'Sonbahar (kendi mevsiminde daha çok hastalanır)',
    mevsimEn: 'Autumn (most prone to illness in their own season)',
    vakit: 'İkindi-Akşam arası',
    vakitEn: 'Late afternoon to evening',
    esmalar: ['Ya Vedûd', 'Ya Kaviyy', 'Ya Metîn', 'Ya Muhyî', 'Ya Şekûr', 'Ya Bâri', 'Ya Bâsid'],
    emoji: '🌿',
    kariyer: ['Arşiv görevlisi / hafız — hafızaları çok kuvvetlidir, uzun süre hatırlayabilirler', 'Askerlik — verilen görevi dört dörtlük yerine getirirler', 'Muhasebe — dikkat ve matematik gerektiren işlerde başarılıdırlar', 'Hâkimlik / savcılık — tarafsız karar alabilirler; iyi sorgulayıcı yapıları vardır', 'Araştırmacılık / derin ilim — belirli bir yaştan sonra çok büyük eserler ortaya koyabilirler', 'Uygun olmayan: Çok aciliyet gerektiren işler (acil servis, ambulans vb.); ikna gerektiren meslekler'],
    kariyerEn: ['Archive keeper / memorizer — very strong memory, can retain information for a long time', 'Military service — carry out given duties with complete thoroughness', 'Accounting — successful in jobs requiring attention and mathematical thinking', 'Judgeship / prosecution — can make impartial decisions; naturally good investigators', 'Research / deep scholarship — can produce great works after a certain age', 'Not suited: Jobs with high urgency (ER, ambulance); persuasion-based professions'],
    hastaliklar: ['Bacak sendromları — geceleri bacaklar uyuşabilir; en yaygın rahatsızlıktır', 'İskelet ağrıları ve kronik vücut ağrıları — soğukluk kemik yapısını etkiler', 'Tırnak, saç ve diş problemleri', 'Demir eksikliği, vitamin ve mineral eksikliği, genel zayıflık', 'Yüzde solgunluk ve göz altı koyuluğu', 'Hemoroid ve varis', 'Hayvan tüyü alerjisi ve sese/ışığa hassasiyet'],
    hastaliklarEn: ['Leg syndromes — legs may go numb at night; most common condition', 'Skeletal pain and chronic body aches — coldness affects bone structure', 'Nail, hair and tooth problems', 'Iron deficiency, vitamin and mineral deficiency, general weakness', 'Facial pallor and dark circles under eyes', 'Hemorrhoids and varicose veins', 'Animal fur allergy and sensitivity to sound/light'],
    cocukOzellikleri: ['"Büyümüş de küçülmüş" çocuklardır — çocuksu hareketleri pek yoktur; büyüklerin konuşmalarına kulak kabartırlar', 'Yargılayıcı cümleler kurabilirler: "Ben anne olursam senin gibi olmayacağım"', 'Donuk ve sinsi bakarlar; gözaltlarında çukur ve koyuluk olur. Kıskanç ve inatçı olabilirler', 'Okul: Derse ilgisiz görünür ama soru sorulunca doğru cevap verir. Hafızaları kuvvetlidir', 'Ten renkleri esmere yakındır; ağlama şekilleri sızlanma gibidir', 'Uyarı: Sovdasını bilmeden artırırsanız yalnız, bencil ve uzak olur'],
    cocukOzellikleriEn: ['"Old soul" children — rarely act childish; listen in on adult conversations', 'Can make judgmental statements: "When I\'m a mother I won\'t be like you"', 'Tend to have a blank or guarded look; dark circles and hollows under eyes. Can be jealous and stubborn', 'School: Appears disinterested but gives correct answers when asked. Strong memory', 'Skin tends toward darker/olive tones; crying sounds more like whimpering', 'Warning: Increasing their black bile unknowingly makes them lonely, selfish and distant'],
    duygular: ['Yalnızlık, pişmanlık, güvensizlik ve hüzün — en bilinen duygu özellikleridir', 'Mantık, temkin ve erteleme duygusu ağır basar', 'Geçmişe takılma ve geçmişi düşünme eğilimi çok güçlüdür', 'Haset yapan biri hangi mizaçtan olursa olsun sevdavi özellikler gösterir; sevgi veremez, haz alamaz, ağlayamaz'],
    duygularEn: ['Loneliness, regret, insecurity and sadness — most known emotional traits', 'Logic, caution and postponement feelings dominate', 'Very strong tendency to dwell on and revisit the past', 'Anyone who becomes envious — regardless of temperament — shows melancholic traits; cannot give love, feel pleasure or cry'],
    yasDonem: 'Yaşlılık (60+ yaş) — sovdavî mizaçla ilişkilendirilir; yaşlandıkça herkes sovdalaşır, kemikler ağrır, içe kapanıklık artar',
    yasDonemEn: 'Old age (60+ years) — associated with melancholic temperament; everyone becomes more melancholic with age, bones ache, introversion increases',
    agriTipi: 'Sızı — ağrı "sızım sızım sızlıyor" şeklinde hissedilir',
    agriTipiEn: 'Aching — pain felt as a deep, persistent dull ache',
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
