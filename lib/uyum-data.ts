import { MizacTip } from '@/lib/mizac-data';

// Mizaç uyum matrisi ve karşılaştırma sayfalarının kanonik listesi.
// Tek kaynak: karsilastir sayfaları, OG image'lar ve sitemap buradan okur.

export const uyumVerisi: Record<MizacTip, Record<MizacTip, { puan: number; baslik: string; aciklama: string; gucler: string[]; zorluklar: string[] }>> = {
  safravi: {
    safravi: { puan: 55, baslik: 'Güçlü Rekabet', aciklama: 'İki safravi birlikte harika şeyler başarabilir — ama ikisi de lider olmak istediğinden çatışma kaçınılmazdır. Birbirlerinin mükemmeliyetçiliğine saygı duyarlar.', gucler: ['Yüksek verimlilik', 'Ortak hedefler', 'Karşılıklı saygı'], zorluklar: ['Liderlik çatışması', 'İkisi de haklı olmak ister', 'Öfke yönetimi'] },
    demevi: { puan: 68, baslik: 'Sıcak Dinamizm', aciklama: 'Her ikisi de sıcak mizaçtır. Safravi hedef koyar, demevi sosyalleştirir. Birbirlerini güzel tamamlarlar — safravi odaklanmayı, demevi eğlenceyi getirir.', gucler: ['Ortak enerji ve hız', 'Birbirini motive eder', 'Sosyal ve üretken'], zorluklar: ['Demevi dağınıklığı safraviyi sinir eder', 'Safravi eleştirisi demeviyi kırar', 'İkisi de sabırsız'] },
    balgami: { puan: 92, baslik: 'Mükemmel Denge', aciklama: 'En yüksek uyumlu çiftlerden biri. Safravi\'nin ateşini balgami\'nin suyu söndürür. Safravi liderlik eder, balgami güvenilirliği sağlar. Zıt kutuplar birbirini dengeler.', gucler: ['Birbirini tamamlayan özellikler', 'Safravi karar verir, balgami uygular', 'Derin güven bağı'], zorluklar: ['Safravi\'nin hızı balgamiyi yorabilir', 'Balgami\'nin temposu safraviyi sinir edebilir'] },
    sevdavi: { puan: 38, baslik: 'Zor Ama Derin', aciklama: 'Her ikisi de mükemmeliyetçi, detaycı ve inatçıdır. Safravi ateşli ve hızlı, sevdavi yavaş ve derin. Uzun vadede karşılıklı saygı gelişebilir ama sabır gerektirir.', gucler: ['Ortak mükemmeliyetçilik', 'Derin anlayış', 'Uzun vadeli sadakat'], zorluklar: ['Hız farkı çok büyük', 'İki taraf da pes etmez', 'Duygusal mesafe'] },
  },
  demevi: {
    safravi: { puan: 68, baslik: 'Sıcak Dinamizm', aciklama: 'Safravi\'nin odağı ile demevi\'nin sosyalliği güzel birleşir. Safravi demeviye yön verir, demevi safraviye neşe katar.', gucler: ['Ortak hız ve enerji', 'Tamamlayıcı güçlü yönler', 'Üretkenlik'], zorluklar: ['Safravi eleştirisi demeviyi kırar', 'Demevi dağınıklığı safraviyi sinir eder'] },
    demevi: { puan: 65, baslik: 'Eğlenceli Kaos', aciklama: 'İki demevi bir araya gelince ortalık neşeye bürünür. Ama ikisi de dağınık ve unutkandır — pratik işler yarım kalabilir.', gucler: ['Çok eğlenceli', 'Birbirini sürekli motive eder', 'Derin maneviyat paylaşımı'], zorluklar: ['Pratik işler ihmal edilir', 'Odak kaybı', 'İkisi de hatırlamayı sever'] },
    balgami: { puan: 48, baslik: 'Hız Farkı', aciklama: 'Demevi hızlı ve sosyal, balgami yavaş ve temkinli. Birbirlerine sabır gerektirir. Balgami demeviyi güvenle tamamlar, demevi balgamiyi hayata katabilir.', gucler: ['Demevi balgamiyi sosyalleştirir', 'Balgami demeviyi dengeler', 'Uzun vadede güven'], zorluklar: ['Hız uyumsuzluğu', 'Balgami demeviyi yüzeysel bulur', 'İletişim tarzı farkı'] },
    sevdavi: { puan: 90, baslik: 'Zıt Kutupların Çekimi', aciklama: 'En yüksek uyumlu çiftlerden biri. Demevi\'nin ışığı sevdavi\'nin karanlığını aydınlatır. Sevdavi demeviyi derinleştirir, demevi sevdaviyi hayata bağlar.', gucler: ['Güçlü tamamlayıcılık', 'Birbirini büyüten ilişki', 'Derin anlayış'], zorluklar: ['Enerji seviyesi çok farklı', 'Sevdavi zaman zaman geri çekilir', 'Demevi\'nin sürekli sosyal olma isteği'] },
  },
  balgami: {
    safravi: { puan: 92, baslik: 'Mükemmel Denge', aciklama: 'Su ile ateş — birbirini dengeleyerek harika bir uyum oluşturur. Safravi yön gösterir, balgami sağlamlık sağlar. En güçlü uyumlu çiftlerden biri.', gucler: ['Birbirini mükemmel tamamlar', 'Uzun vadeli istikrar', 'Güçlü güven'], zorluklar: ['Hız uyumsuzluğu zaman zaman', 'Safravi eleştirisi balgamiyi içe çekebilir'] },
    demevi: { puan: 50, baslik: 'Farklı Dünyalar', aciklama: 'Balgami temkinli ve içe kapanık, demevi neşeli ve dışa dönük. Uzlaşabilirler ama doğal akışları farklı. Birbirlerinden çok şey öğrenebilirler.', gucler: ['Birbirinden öğrenme', 'Demevi balgamiyi dışarı çeker', 'Balgami demeviyi dengeler'], zorluklar: ['Sosyallik farkı büyük', 'Balgami demeviyi yorucu bulabilir', 'Hız uyumsuzluğu'] },
    balgami: { puan: 68, baslik: 'Sakin Birliktelik', aciklama: 'İki balgami birlikte sakin, huzurlu ve güvenli bir ortam yaratır. Ama ikisi de karar vermekte zorlanır, harekete geçmekte güçlük çekebilirler.', gucler: ['Derin güven', 'Çatışmasız ilişki', 'Huzurlu ortam'], zorluklar: ['İkisi de hareketsizliğe kayar', 'Kararlar çok gecikebilir', 'Kırgınlıklar dile getirilmez'] },
    sevdavi: { puan: 76, baslik: 'Soğuk Mizaçların Uyumu', aciklama: 'Her ikisi de soğuk mizaçtır; bu ortak zemin derin bir anlayış sağlar. Balgami sevdaviyi daha sosyal yapar, sevdavi balgamiye derinlik katar.', gucler: ['Derin anlayış', 'Birbirini zorlamaz', 'Uzun vadeli bağ'], zorluklar: ['İkisi de içe kapanık olunca dışarıya açılmak güçleşir', 'Ortak hareketsizlik riski'] },
  },
  sevdavi: {
    safravi: { puan: 42, baslik: 'Zor Ama Derin', aciklama: 'İkisi de mükemmeliyetçi ve detaycı — ama hızları çok farklı. Safravi ateşli ve hızlı hareket ederken sevdavi yavaş ve derin düşünür. Uzun vadede birbirlerine saygı gelişir.', gucler: ['Ortak mükemmeliyetçilik', 'Safravi sevdaviyi harekete geçirebilir', 'Derin bağ'], zorluklar: ['Büyük hız farkı', 'İki taraf da pes etmez', 'Safravi\'nin öfkesi sevdaviyi kapatır'] },
    demevi: { puan: 90, baslik: 'Zıt Kutupların Çekimi', aciklama: 'Sevdavi derinliği ile demevi neşesi birleşince güçlü bir bütün oluşur. Demevi sevdaviyi hayata bağlar, sevdavi demeviyi derinleştirir.', gucler: ['Birbirini bütünler', 'Derin ve keyifli birliktelik', 'Büyüten ilişki'], zorluklar: ['Enerji farkı yorucu olabilir', 'Sevdavi zaman zaman geri çekilmek ister'] },
    balgami: { puan: 74, baslik: 'Soğuk Mizaçların Uyumu', aciklama: 'Soğuk mizaçların ortak zemini derin bir anlayış yaratır. Sessizliğe, yalnızlığa ve düşünmeye birlikte alan açarlar. Güçlü ve sakin bir birliktelik.', gucler: ['Birbirini zorlamaz', 'Derin güven', 'Sakin ve istikrarlı'], zorluklar: ['İkisi de harekete geçmekte güçlük çeker', 'Sosyal hayat kısıtlanabilir'] },
    sevdavi: { puan: 62, baslik: 'Derin Sessizlik', aciklama: 'İki sevdavi birlikte olunca derin, analitik ve ciddi bir ilişki doğar. Birbirlerini çok iyi anlarlar ama ikisi de harekete geçmekte zorlanır.', gucler: ['Eşsiz anlayış derinliği', 'Sessizliğe ihtiyaç duymazlar', 'Derin sadakat'], zorluklar: ['İkisi de içe kapanık', 'Hareketsizlik riski yüksek', 'Ortak karamsarlık'] },
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
