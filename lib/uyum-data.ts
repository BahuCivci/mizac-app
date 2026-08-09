import { MizacTip } from '@/lib/mizac-data';

// Mizaç uyum matrisi ve karşılaştırma sayfalarının kanonik listesi.
// Tek kaynak: /uyum, /karsilastir, OG image'lar ve sitemap buradan okur.
//
// Puanlar simetriktir — aynı çift hangi yönden bakılırsa bakılsın aynı sayıyı
// verir. Açıklama/güçler/zorluklar ise bilerek her mizacın kendi bakışından
// yazılmıştır, bu yüzden yön yön farklıdır.

export type UyumHucre = {
  puan: number;
  baslik: string;
  baslikEn: string;
  aciklama: string;
  aciklamaEn: string;
  gucler: string[];
  guclerEn: string[];
  zorluklar: string[];
  zorluklarEn: string[];
};

export const uyumVerisi: Record<MizacTip, Record<MizacTip, UyumHucre>> = {
  safravi: {
    safravi: {
      puan: 55,
      baslik: "Güçlü Rekabet",
      baslikEn: "Strong Competition",
      aciklama: "İki safravi birlikte harika şeyler başarabilir — ama ikisi de lider olmak istediğinden çatışma kaçınılmazdır. Birbirlerinin mükemmeliyetçiliğine saygı duyarlar.",
      aciklamaEn: "Two cholerics together can achieve great things — but conflict is inevitable since both want to lead. They respect each other's perfectionism.",
      gucler: ["Yüksek verimlilik","Ortak hedefler","Karşılıklı saygı"],
      guclerEn: ["High productivity","Shared goals","Mutual respect"],
      zorluklar: ["Liderlik çatışması","İkisi de haklı olmak ister","Öfke yönetimi"],
      zorluklarEn: ["Leadership conflicts","Both want to be right","Anger management"],
    },
    demevi: {
      puan: 68,
      baslik: "Sıcak Dinamizm",
      baslikEn: "Warm Dynamism",
      aciklama: "Her ikisi de sıcak mizaçtır. Safravi hedef koyar, demevi sosyalleştirir. Birbirlerini güzel tamamlarlar — safravi odaklanmayı, demevi eğlenceyi getirir.",
      aciklamaEn: "Both are warm temperaments. Choleric sets goals, sanguine socializes. They complement each other well — choleric brings focus, sanguine brings fun.",
      gucler: ["Ortak enerji ve hız","Birbirini motive eder","Sosyal ve üretken"],
      guclerEn: ["Shared energy and speed","Motivate each other","Social and productive"],
      zorluklar: ["Demevi dağınıklığı safraviyi sinir eder","Safravi eleştirisi demeviyi kırar","İkisi de sabırsız"],
      zorluklarEn: ["Sanguine messiness irritates choleric","Choleric criticism hurts sanguine","Both are impatient"],
    },
    balgami: {
      puan: 92,
      baslik: "Mükemmel Denge",
      baslikEn: "Perfect Balance",
      aciklama: "En yüksek uyumlu çiftlerden biri. Safravi'nin ateşini balgami'nin suyu söndürür. Safravi liderlik eder, balgami güvenilirliği sağlar. Zıt kutuplar birbirini dengeler.",
      aciklamaEn: "One of the highest compatibility pairs. Phlegmatic's water extinguishes choleric's fire. Choleric leads, phlegmatic provides reliability. Opposites balance each other.",
      gucler: ["Birbirini tamamlayan özellikler","Safravi karar verir, balgami uygular","Derin güven bağı"],
      guclerEn: ["Complementary traits","Choleric decides, phlegmatic executes","Deep trust bond"],
      zorluklar: ["Safravi'nin hızı balgamiyi yorabilir","Balgami'nin temposu safraviyi sinir edebilir"],
      zorluklarEn: ["Choleric's speed can exhaust phlegmatic","Phlegmatic's pace can frustrate choleric"],
    },
    sevdavi: {
      puan: 38,
      baslik: "Zor Ama Derin",
      baslikEn: "Difficult But Deep",
      aciklama: "Her ikisi de mükemmeliyetçi, detaycı ve inatçıdır. Safravi ateşli ve hızlı, sevdavi yavaş ve derin. Uzun vadede karşılıklı saygı gelişebilir ama sabır gerektirir.",
      aciklamaEn: "Both are perfectionists, detail-oriented and stubborn. Choleric is fiery and fast, melancholic is slow and deep. Mutual respect can develop long-term but requires patience.",
      gucler: ["Ortak mükemmeliyetçilik","Derin anlayış","Uzun vadeli sadakat"],
      guclerEn: ["Shared perfectionism","Deep understanding","Long-term loyalty"],
      zorluklar: ["Hız farkı çok büyük","İki taraf da pes etmez","Duygusal mesafe"],
      zorluklarEn: ["Huge speed difference","Neither side gives in","Emotional distance"],
    },
  },
  demevi: {
    safravi: {
      puan: 68,
      baslik: "Sıcak Dinamizm",
      baslikEn: "Warm Dynamism",
      aciklama: "Safravi'nin odağı ile demevi'nin sosyalliği güzel birleşir. Safravi demeviye yön verir, demevi safraviye neşe katar.",
      aciklamaEn: "Choleric's focus combines well with sanguine's sociability. Choleric gives direction to sanguine, sanguine adds joy to choleric.",
      gucler: ["Ortak hız ve enerji","Tamamlayıcı güçlü yönler","Üretkenlik"],
      guclerEn: ["Shared speed and energy","Complementary strengths","Productivity"],
      zorluklar: ["Safravi eleştirisi demeviyi kırar","Demevi dağınıklığı safraviyi sinir eder"],
      zorluklarEn: ["Choleric criticism hurts sanguine","Sanguine messiness irritates choleric"],
    },
    demevi: {
      puan: 65,
      baslik: "Eğlenceli Kaos",
      baslikEn: "Fun Chaos",
      aciklama: "İki demevi bir araya gelince ortalık neşeye bürünür. Ama ikisi de dağınık ve unutkandır — pratik işler yarım kalabilir. Sosyal enerjileri harika, disiplinleri zayıf.",
      aciklamaEn: "When two sanguines come together, everything fills with joy. But both are messy and forgetful — practical tasks may go unfinished. Their social energy is great, discipline is weak.",
      gucler: ["Çok eğlenceli","Birbirini sürekli motive eder","Derin maneviyat paylaşımı"],
      guclerEn: ["Very fun","Constantly motivate each other","Deep spirituality sharing"],
      zorluklar: ["Pratik işler ihmal edilir","İkisi de hatırlamayı sever","Odak kaybı"],
      zorluklarEn: ["Practical tasks neglected","Both love to be remembered","Loss of focus"],
    },
    balgami: {
      puan: 48,
      baslik: "Hız Farkı",
      baslikEn: "Speed Gap",
      aciklama: "Demevi hızlı ve sosyal, balgami yavaş ve temkinli. Birbirlerine sabır gerektirir. Balgami demeviyi güvenle tamamlar, demevi balgamiyi hayata katabilir.",
      aciklamaEn: "Sanguine is fast and social, phlegmatic is slow and cautious. Both require patience from each other. Phlegmatic reliably completes sanguine, sanguine can bring phlegmatic to life.",
      gucler: ["Demevi balgamiyi sosyalleştirir","Balgami demeviyi dengeler","Uzun vadede güven"],
      guclerEn: ["Sanguine socializes phlegmatic","Phlegmatic balances sanguine","Long-term trust"],
      zorluklar: ["Hız uyumsuzluğu","Balgami demeviyi yüzeysel bulur","İletişim tarzı farkı"],
      zorluklarEn: ["Speed mismatch","Phlegmatic finds sanguine superficial","Different communication styles"],
    },
    sevdavi: {
      puan: 90,
      baslik: "Zıt Kutupların Çekimi",
      baslikEn: "Opposite Poles Attract",
      aciklama: "En yüksek uyumlu çiftlerden biri. Demevi'nin ışığı sevdavi'nin karanlığını aydınlatır. Sevdavi demeviyi derinleştirir, demevi sevdaviyi hayata bağlar. Güçlü bir denge.",
      aciklamaEn: "One of the highest compatibility pairs. Sanguine's light illuminates melancholic's darkness. Melancholic deepens sanguine, sanguine connects melancholic to life. A powerful balance.",
      gucler: ["Güçlü tamamlayıcılık","Birbirini büyüten ilişki","Derin anlayış"],
      guclerEn: ["Strong complementarity","A relationship that grows each other","Deep understanding"],
      zorluklar: ["Enerji seviyesi çok farklı","Sevdavi zaman zaman geri çekilir","Demevi'nin sürekli sosyal olma isteği"],
      zorluklarEn: ["Very different energy levels","Melancholic sometimes withdraws","Sanguine's constant desire to socialize"],
    },
  },
  balgami: {
    safravi: {
      puan: 92,
      baslik: "Mükemmel Denge",
      baslikEn: "Perfect Balance",
      aciklama: "Su ile ateş — birbirini dengeleyerek harika bir uyum oluşturur. Safravi yön gösterir, balgami sağlamlık sağlar. En güçlü uyumlu çiftlerden biri.",
      aciklamaEn: "Water and fire — balancing each other to form a wonderful harmony. Choleric provides direction, phlegmatic provides stability. One of the strongest compatible pairs.",
      gucler: ["Birbirini mükemmel tamamlar","Uzun vadeli istikrar","Güçlü güven"],
      guclerEn: ["Perfectly complement each other","Long-term stability","Strong trust"],
      zorluklar: ["Hız uyumsuzluğu zaman zaman","Safravi eleştirisi balgamiyi içe çekebilir"],
      zorluklarEn: ["Occasional speed mismatch","Choleric criticism can make phlegmatic withdraw"],
    },
    demevi: {
      puan: 48,
      baslik: "Farklı Dünyalar",
      baslikEn: "Different Worlds",
      aciklama: "Balgami temkinli ve içe kapanık, demevi neşeli ve dışa dönük. Uzlaşabilirler ama doğal akışları farklı. Birbirlerinden çok şey öğrenebilirler.",
      aciklamaEn: "Phlegmatic is cautious and introverted, sanguine is joyful and extroverted. They can reconcile but their natural flows are different. They can learn a lot from each other.",
      gucler: ["Birbirinden öğrenme","Demevi balgamiyi dışarı çeker","Balgami demeviyi dengeler"],
      guclerEn: ["Learning from each other","Sanguine draws phlegmatic out","Phlegmatic balances sanguine"],
      zorluklar: ["Sosyallik farkı büyük","Balgami demeviyi yorucu bulabilir","Hız uyumsuzluğu"],
      zorluklarEn: ["Big sociability gap","Phlegmatic may find sanguine exhausting","Speed mismatch"],
    },
    balgami: {
      puan: 68,
      baslik: "Sakin Birliktelik",
      baslikEn: "Calm Partnership",
      aciklama: "İki balgami birlikte sakin, huzurlu ve güvenli bir ortam yaratır. Ama ikisi de karar vermekte zorlanır, harekete geçmekte güçlük çekebilirler.",
      aciklamaEn: "Two phlegmatics together create a calm, peaceful and safe environment. But both struggle to make decisions and may have difficulty taking action.",
      gucler: ["Derin güven","Çatışmasız ilişki","Huzurlu ortam"],
      guclerEn: ["Deep trust","Conflict-free relationship","Peaceful environment"],
      zorluklar: ["İkisi de hareketsizliğe kayar","Kararlar çok gecikebilir","Kırgınlıklar dile getirilmez"],
      zorluklarEn: ["Both drift toward inactivity","Decisions can be greatly delayed","Grievances go unspoken"],
    },
    sevdavi: {
      puan: 76,
      baslik: "Soğuk Mizaçların Uyumu",
      baslikEn: "Cold Temperaments in Harmony",
      aciklama: "Her ikisi de soğuk mizaçtır; bu ortak zemin derin bir anlayış sağlar. Balgami sevdaviyi daha sosyal yapar, sevdavi balgamiye derinlik katar.",
      aciklamaEn: "Both are cold temperaments; this common ground provides deep understanding. Phlegmatic makes melancholic more social, melancholic adds depth to phlegmatic.",
      gucler: ["Derin anlayış","Birbirini zorlamaz","Uzun vadeli bağ"],
      guclerEn: ["Deep understanding","Neither forces the other","Long-term bond"],
      zorluklar: ["İkisi de içe kapanık olunca dışarıya açılmak güçleşir","Ortak hareketsizlik riski"],
      zorluklarEn: ["When both are introverted, opening up becomes harder","Risk of shared inactivity"],
    },
  },
  sevdavi: {
    safravi: {
      puan: 38,
      baslik: "Zor Ama Derin",
      baslikEn: "Difficult But Deep",
      aciklama: "İkisi de mükemmeliyetçi ve detaycı — ama hızları çok farklı. Safravi ateşli ve hızlı hareket ederken sevdavi yavaş ve derin düşünür. Uzun vadede birbirlerine saygı gelişir.",
      aciklamaEn: "Both are perfectionists and detail-oriented — but their speeds are very different. Choleric acts fiery and fast while melancholic thinks slow and deep. Long-term respect develops.",
      gucler: ["Ortak mükemmeliyetçilik","Safravi sevdaviyi harekete geçirebilir","Derin bağ"],
      guclerEn: ["Shared perfectionism","Choleric can mobilize melancholic","Deep bond"],
      zorluklar: ["Büyük hız farkı","İki taraf da pes etmez","Safravi'nin öfkesi sevdaviyi kapatır"],
      zorluklarEn: ["Big speed difference","Neither side gives in","Choleric's anger shuts down melancholic"],
    },
    demevi: {
      puan: 90,
      baslik: "Zıt Kutupların Çekimi",
      baslikEn: "Opposite Poles Attract",
      aciklama: "Sevdavi derinliği ile demevi neşesi birleşince güçlü bir bütün oluşur. Demevi sevdaviyi hayata bağlar, sevdavi demeviyi derinleştirir.",
      aciklamaEn: "When melancholic depth and sanguine joy combine, a powerful whole is formed. Sanguine connects melancholic to life, melancholic deepens sanguine.",
      gucler: ["Birbirini bütünler","Derin ve keyifli birliktelik","Büyüten ilişki"],
      guclerEn: ["Complete each other","Deep and enjoyable partnership","A growing relationship"],
      zorluklar: ["Enerji farkı yorucu olabilir","Sevdavi zaman zaman geri çekilmek ister"],
      zorluklarEn: ["Energy difference can be tiring","Melancholic sometimes wants to withdraw"],
    },
    balgami: {
      puan: 76,
      baslik: "Soğuk Mizaçların Uyumu",
      baslikEn: "Cold Temperaments in Harmony",
      aciklama: "Soğuk mizaçların ortak zemini derin bir anlayış yaratır. Sessizliğe, yalnızlığa ve düşünmeye birlikte alan açarlar. Güçlü ve sakin bir birliktelik.",
      aciklamaEn: "The common ground of cold temperaments creates deep understanding. They create space together for silence, solitude and thought. A strong and calm partnership.",
      gucler: ["Birbirini zorlamaz","Derin güven","Sakin ve istikrarlı"],
      guclerEn: ["Neither forces the other","Deep trust","Calm and stable"],
      zorluklar: ["İkisi de harekete geçmekte güçlük çeker","Sosyal hayat kısıtlanabilir"],
      zorluklarEn: ["Both struggle to take action","Social life may become limited"],
    },
    sevdavi: {
      puan: 62,
      baslik: "Derin Sessizlik",
      baslikEn: "Deep Silence",
      aciklama: "İki sevdavi birlikte olunca derin, analitik ve ciddi bir ilişki doğar. Birbirlerini çok iyi anlarlar ama ikisi de harekete geçmekte zorlanır. Ortak depresyon riskine dikkat.",
      aciklamaEn: "When two melancholics come together, a deep, analytical and serious relationship is born. They understand each other very well but both struggle to take action. Watch out for shared depression risk.",
      gucler: ["Eşsiz anlayış derinliği","Sessizliğe ihtiyaç duymazlar","Derin sadakat"],
      guclerEn: ["Unmatched depth of understanding","Don't need to fill silence","Deep loyalty"],
      zorluklar: ["İkisi de içe kapanık","Hareketsizlik riski yüksek","Ortak karamsarlık"],
      zorluklarEn: ["Both are introverted","High risk of inactivity","Shared pessimism"],
    },
  },
};

export const kombinasyonlar = [
  { slug: 'safravi-vs-demevi', a: 'safravi' as MizacTip, b: 'demevi' as MizacTip },
  { slug: 'safravi-vs-balgami', a: 'safravi' as MizacTip, b: 'balgami' as MizacTip },
  { slug: 'safravi-vs-sevdavi', a: 'safravi' as MizacTip, b: 'sevdavi' as MizacTip },
  { slug: 'demevi-vs-balgami', a: 'demevi' as MizacTip, b: 'balgami' as MizacTip },
  { slug: 'demevi-vs-sevdavi', a: 'demevi' as MizacTip, b: 'sevdavi' as MizacTip },
  { slug: 'balgami-vs-sevdavi', a: 'balgami' as MizacTip, b: 'sevdavi' as MizacTip },
];
