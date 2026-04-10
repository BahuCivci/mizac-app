'use client';

import { useState } from 'react';
import Link from 'next/link';

const sorular = [
  {
    kategori: 'Temel Kavramlar',
    liste: [
      {
        soru: 'Mizaç nedir?',
        cevap: 'Mizaç, insanın doğuştan gelen ve hayatı boyunca temel yapısını koruyan karakter yapısıdır. Nasıl uyursunuz, ne yersiniz, nasıl öfkelenirsiniz, hangi hastalıklara yatkınsınız — bunların tamamı mizacınızla ilişkilidir. İbn-i Sina\'ya göre her insan dört temel mizaçtan birinin ağırlığını taşır: Safravî, Demevî, Balgamî ve Sevdavî.',
      },
      {
        soru: 'İbn-i Sina\'nın 4 mizaç teorisi nedir?',
        cevap: 'İbn-i Sina (980–1037) dört mizaç tipini dört elementle ilişkilendirir: Safravî (Ateş), Demevî (Hava), Balgamî (Su), Sevdavî (Toprak). Her elementin sıcaklık ve nem özelliği, o mizacın fiziksel ve psikolojik yapısını belirler. Bu sistem Antik Yunan\'dan başlayan, İslam dünyasında İbn-i Sina ile zirveye ulaşan bir tıp anlayışının ürünüdür.',
      },
      {
        soru: 'Mizaç hayat boyunca değişir mi?',
        cevap: 'Ana mizaç değişmez; doğuştan belirlenir. Ancak yaş, hastalık, çevre, beslenme ve alışkanlıklar mizacı yüzeysel olarak etkileyebilir. Örneğin, 40 yaş sonrası herkesin mizacı hafifçe Balgamîleşir (yavaşlar, sakinleşir). İbn-i Sina\'nın anlattığı "Nur Mizacı" ise tüm mizaçların dengelenmesi ve olgunlaşmasıdır — bir değişim değil, bir zirve.',
      },
      {
        soru: 'Hangi mizaç en iyisidir?',
        cevap: 'Hiçbir mizaç diğerinden üstün değildir. Her mizacın güçlü ve zayıf yönleri vardır. Hz. Ömer Safravî, Hz. Ebubekir Demevî, Hz. Osman Balgamî, Hz. Ali Sevdavî mizacındaydı — dördü de büyük liderdi. Amaç "en iyi" mizacı bulmak değil, kendi mizacını tanımak ve ona göre yaşamayı öğrenmektir.',
      },
      {
        soru: 'Mizacım birden fazla tip gösterirse ne olur?',
        cevap: 'Bu çok normaldir. Herkeste baskın bir mizaç ve ikincil bir mizaç bulunur. Örneğin, "Safravî ağırlıklı, Demevî ikincil" bir kişi lider ruhluyken aynı zamanda sosyal de olabilir. Test sonucunda puan dağılımınız bunu gösterir. Ana mizaç en yüksek puanlı, ikincil mizaç ikinci en yüksek puanlıdır.',
      },
    ],
  },
  {
    kategori: 'Safravî Mizaç',
    liste: [
      {
        soru: 'Safravî mizaç ne demek?',
        cevap: 'Safravî mizaç, ateş elementine karşılık gelir. Sıcak ve kuru yapıda olan bu mizaç; liderlik ruhu, kararlılık, yüksek enerji, adalet duygusu ve mükemmeliyetçilikle öne çıkar. Safravîler genellikle sabahları erken kalkar, hızlı karar verir ve çevresine doğruluk konusunda taviz vermez.',
      },
      {
        soru: 'Safravî hangi hastalıklara yatkın?',
        cevap: 'Safravî mizaçlılar mide yanması, reflü, safra kesesi problemleri, cilt kaşıntısı, bahar alerjisi ve diyabete yatkındır. Ağrıyı genellikle "yanma" hissi olarak yaşarlar. Öfke ve sinirlilik safra hıltını artırdığından, öfke yönetimi bu mizaç için kritik önem taşır.',
      },
      {
        soru: 'Safravî mizaç için hangi besinler iyi gelir?',
        cevap: 'Safravîler için soğutucu özellikte besinler önerilir: salatalık, yoğurt, nane, ayran, kavun, karpuz. Kızartma, aşırı baharat ve çok sıcak yiyeceklerden kaçınılmalıdır. Soğuk su yerine oda sıcaklığında su tercih edilmelidir.',
      },
      {
        soru: 'Safravî ile en uyumlu mizaç hangisi?',
        cevap: 'Safravî ile en uyumlu mizaç %92 oranıyla Balgamî\'dir. Ateş ve su olarak birbirini dengelerler. Safravî\'nin hızını Balgamî\'nin sakinliği tamamlar; biri karar verirken diğeri güvenilirlikle uygular. Demevî ile de %68 uyum bulunur.',
      },
    ],
  },
  {
    kategori: 'Demevî Mizaç',
    liste: [
      {
        soru: 'Demevî mizaç ne demek?',
        cevap: 'Demevî mizaç, hava elementine karşılık gelir. Sıcak ve ıslak yapıda olan bu mizaç; neşe, sosyallik, yaratıcılık, cömertlik ve maneviyatla öne çıkar. İbn-i Sina geleneğinde "aşk insanı" olarak tanımlanır. Demevîler çok uyur, insan içinde olmaktan güç alır ve sezgileri kuvvetlidir.',
      },
      {
        soru: 'Demevî hangi hastalıklara yatkın?',
        cevap: 'Demevî mizaçlılar migren, kalp çarpıntısı, yüksek tansiyon, karaciğer sorunları, hormonal dengesizlik ve egzamaya yatkındır. Ağrıyı "zonklama" hissi olarak yaşarlar. Aşırı sevinç ve heyecan kan hıltını artırarak kalp ve karaciğeri yorar.',
      },
      {
        soru: 'Demevî ile en uyumlu mizaç hangisi?',
        cevap: 'Demevî ile en uyumlu mizaç %90 oranıyla Sevdavî\'dir. Demevî\'nin neşesi ve sosyalliği, Sevdavî\'nin derin iç dünyasını aydınlatır. Safravî ile de %72 uyum bulunur. En zorlu uyum Balgamî ile yaşanır (%48).',
      },
    ],
  },
  {
    kategori: 'Balgamî Mizaç',
    liste: [
      {
        soru: 'Balgamî mizaç ne demek?',
        cevap: 'Balgamî mizaç, su elementine karşılık gelir. Soğuk ve ıslak yapıda olan bu mizaç; sabır, güvenilirlik, derin bağlılık, sakinlik ve uzlaşmacılıkla öne çıkar. Balgamîler karar vermeden önce iyice düşünür, bağlandıklarına ömür boyu sadık kalır ve çevrelerine huzur yayar.',
      },
      {
        soru: 'Balgamî hangi hastalıklara yatkın?',
        cevap: 'Balgamî mizaçlılar astım, nefes darlığı, eklem ağrıları, romatizma, obezite, sinüzit ve demir eksikliğine yatkındır. Ağrıyı "tutulma" hissi olarak yaşarlar. Keder ve üzüntü balgam hıltını artırdığından, duygusal ifade bu mizaç için çok önemlidir.',
      },
      {
        soru: 'Balgamî için hangi egzersiz uygundur?',
        cevap: 'Balgamîler için düzenli ve ısıtıcı egzersizler önerilir: tempolu yürüyüş, yoga, hafif aerobik. Sabah egzersizleri bu mizaç için özellikle faydalıdır. Kapalı ve nemli ortamlardan kaçınılmalıdır. Sauna, ıslak nem yerine kuru sauna tercih edilmelidir.',
      },
    ],
  },
  {
    kategori: 'Sevdavî Mizaç',
    liste: [
      {
        soru: 'Sevdavî mizaç ne demek?',
        cevap: 'Sevdavî mizaç, toprak elementine karşılık gelir. Soğuk ve kuru yapıda olan bu mizaç; derin düşünce, sanatsal yaratıcılık, felsefi merak, mükemmeliyetçilik ve yoğun sadakatle öne çıkar. Sevdavîler az konuşur, derine iner ve güveni kazanıldıktan sonra vazgeçilmez birer dost olurlar.',
      },
      {
        soru: 'Sevdavî hangi hastalıklara yatkın?',
        cevap: 'Sevdavî mizaçlılar kronik kemik ve iskelet ağrıları, uyku bozuklukları, kronik yorgunluk, sinir sistemi rahatsızlıkları ve melankoliye yatkındır. Ağrıyı "sızı" olarak tarif ederler. Vesvese ve kronik hüzün sevda hıltını artırdığından, yaratıcı uğraşlar bu mizaç için terapi değeri taşır.',
      },
      {
        soru: 'Sevdavî ile en uyumlu mizaç hangisi?',
        cevap: 'Sevdavî ile en uyumlu mizaç %90 oranıyla Demevî\'dir. Demevî\'nin ışıklı ve neşeli yapısı Sevdavî\'nin karanlık derinliğini dengeler. Balgamî ile de %74 derin bir uyum yaşanır. En zorlu uyum Safravî ile olur (%42).',
      },
    ],
  },
  {
    kategori: 'Uyum & İlişkiler',
    liste: [
      {
        soru: 'Zıt mizaçlar neden birbirini çeker?',
        cevap: 'İbn-i Sina\'ya göre doğada zıt elementler birbirini tamamlar: Ateş ve su, toprak ve hava. Safravî ve Balgamî, Demevî ve Sevdavî çiftleri bu yüzden yüksek uyum gösterir. Zıt mizaç, kendi eksik olduğumuz nitelikleri taşıdığından bizi tamamlar. Bu çekim başlangıçta güçlü, uzun vadede derin ve dengeli bir ilişki kurar.',
      },
      {
        soru: 'Aynı mizaçlar evlenir mi?',
        cevap: 'Evlenir, ama zorlukları vardır. İki Safravî güç çatışması yaşayabilir; ikisi de lider olmak ister. İki Sevdavî ortak melankolide derinleşebilir. İki Balgamî çok yavaş kalabilir, kimse inisiyatif almaz. Aynı mizaç çiftler için en önemli şey farkındalıktır: kendi yansımalarını birbirinde görmeleri.',
      },
      {
        soru: 'Çocuğumun mizacını nasıl anlayabilirim?',
        cevap: 'Çocuklarda mizaç bebeklikten itibaren belirgindir. Safravî bebek ağlayınca güçlü ve kararlı ağlar. Demevî bebek sosyal ortamda coşar. Balgamî bebek sakin ve uysal olur. Sevdavî bebek hassas ve sese tepkilidir. Çocuk mizacı sayfamızda bebeklik, okul öncesi ve okul dönemine göre detaylı rehber bulabilirsiniz.',
      },
      {
        soru: 'İş hayatında mizaç uyumu önemli mi?',
        cevap: 'Çok önemlidir. Safravî iyi lider olur; Balgamî\'nin uygulayıcı rolüyle mükemmel ekip kurar. Demevî ilişkileri güçlendirir, Sevdavî analitik derinlik katar. Çatışmaların %70\'i mizaç uyumsuzluğundan kaynaklanır. Ekibinizdeki mizaç çeşitliliği, farklı bakış açılarıyla daha güçlü kararlar almanızı sağlar.',
      },
    ],
  },
  {
    kategori: 'Çocuk & Aile',
    liste: [
      {
        soru: 'Kaç yaşından itibaren mizaç testi yapılabilir?',
        cevap: 'Mizaç testi genellikle 16 yaş ve üzeri için tasarlanmıştır. Daha küçük çocuklarda doğrudan test yerine gözlem önerilir: uyku düzeni, iştah, sosyal tepkiler ve ağlama biçimleri mizacı ele verir. Bebeklikten itibaren belirgin olan mizaç, 7-8 yaşından sonra tutarlı bir profil oluşturur.',
      },
      {
        soru: 'Eşim ve ben farklı mizaçtaysak evliliğimiz zor mu olur?',
        cevap: 'Farklı mizaçlar aslında ilişkiyi zenginleştirir — eksik kaldığınız yerleri birbirinizde tamamlarsınız. Zorluğun kaynağı fark değil, farkındalık eksikliğidir. Partnerinizin niçin öyle davrandığını anladığınızda çatışmalar çözüme kavuşur. Safravî–Balgamî ve Demevî–Sevdavî çiftleri bu yüzden istatistiksel olarak en kararlı ilişkileri kurar.',
      },
      {
        soru: 'Annem Safravî, babam Balgamî — ben ne çıkarım?',
        cevap: 'Mizaç kalıtsal bir bileşen içerse de doğrudan Mendel kalıtımı gibi aktarılmaz. Ebeveyn mizaçları, beslenme, doğum şartları ve erken çocukluk deneyimleri hepsi katkıda bulunur. Bu yüzden iki Balgamî ebeveynin Safravî çocuğu olabilir. Kendi testinizin sonucu her zaman anketinizden çıkan veridir.',
      },
    ],
  },
  {
    kategori: 'Beslenme & Sağlık',
    liste: [
      {
        soru: 'Oruç tutmak mizaca göre farklı mı etkilir?',
        cevap: 'Evet. Safravî mizaçlılar oruçta sinirlilik ve baş ağrısı yaşayabilir; soğuk su ve soğutucu besinlerle iftar açmaları önerilir. Demevîler genellikle oruca iyi adapte olur. Balgamîler metabolizmaları yavaşlayabileceğinden hafif egzersizle desteklemelidir. Sevdavîler ise enerji düşüklüğüne dikkat etmelidir; kuruyemiş ve hurmayı eksik bırakmamalıdırlar.',
      },
      {
        soru: 'Stres yönetimi mizaca göre nasıl değişir?',
        cevap: 'Safravî strese öfkeyle tepki verir — soğuma teknikleri ve yüzme/egzersiz yardımcı olur. Demevî strese sosyalleşerek kaçar; zaman zaman yalnız kalıp duygularını işlemesi gerekir. Balgamî stresi içe gömer; ifade sanatları ve günlük tutmak faydalıdır. Sevdavî strese izolasyonla tepki verir; düzenli güneş ışığı ve hareket kritik önem taşır.',
      },
      {
        soru: 'Uyku saatleri mizaca göre değişir mi?',
        cevap: 'Evet. Safravîler sabahçıdır ve az uyku ile yüksek verimle çalışır (6-7 saat yeterli). Demevîler uzun ve derin uyku ister (8-9 saat), geç kalkar. Balgamîler sabah kalkışta güçlük çeker ve en uzun uyuyan tiptir (8-10 saat). Sevdavîler ise uyku kalitesi düşük olduğundan az uyusa bile yorgun uyanabilir; 7-8 saate rağmen yorgunluk hissedebilirler.',
      },
    ],
  },
  {
    kategori: 'Test & Sonuçlar',
    liste: [
      {
        soru: 'Mizaç testi kaç sorudur ve ne kadar sürer?',
        cevap: 'Mizaç testimiz 50 sorudan oluşur ve yaklaşık 8-12 dakika sürer. Fiziksel özellikler, uyku düzeni, duygusal tepkiler, beslenme alışkanlıkları ve sosyal davranışı ölçen dengeli bir soru seti içerir. Sonuçta baskın ve ikincil mizacınızı, puan dağılımınızı ve detaylı profilinizi görürsünüz.',
      },
      {
        soru: 'Test sonucu her seferinde aynı çıkar mı?',
        cevap: 'Büyük ölçüde aynı çıkar çünkü ana mizaç sabittir. Ancak yorgun, hasta ya da stresli olduğunuzda ikincil mizacınız öne çıkabilir. En doğru sonuç için testi dingin, rahat bir anda yapmanız önerilir. Farklı zamanlarda yapılan testlerde %5-10 sapma normaldir.',
      },
      {
        soru: 'Sonucumu nasıl paylaşabilirim?',
        cevap: 'Sonuç sayfasında WhatsApp, link kopyalama ve hikaye kartı oluşturma seçenekleri bulunur. Her mizaç için özel bir URL var (örn. mizac.xyz/sonuc/safravi) — bunu arkadaşlarınıza atabilirsiniz. Instagram ve TikTok için 9:16 formatında hikaye kartı indirebilirsiniz.',
      },
    ],
  },
  {
    kategori: 'Şifa & Sağlık',
    liste: [
      {
        soru: 'Mizaç ve hastalık arasında ne ilişki var?',
        cevap: 'İbn-i Sina\'ya göre hastalıklar, kişinin mizaç dengesinin bozulmasından kaynaklanır. Hangi hılt (vücut sıvısı) baskınsa, o mizacın zayıf organları etkilenir. Ağrının şekli bile mizacı ele verir: Safravî yanma, Demevî zonklama, Balgamî tutulma, Sevdavî sızı yaşar.',
      },
      {
        soru: 'Esmaü\'l-Hüsna mizaç tedavisinde nasıl kullanılır?',
        cevap: 'İbn-i Sina geleneğinde her organ ve hastalık için şifa veren bir ilâhî isim belirlenmiştir. Örneğin Göz için "En-Nûr, El-Basîr", Akciğerler için "Er-Râzık", Böbrekler için "El-Hayy" okunur. Her mizacın da kendine özgü şifa esmaları vardır. Esma-Şifa sayfamızda hem organ haritasını hem mizaca göre esmaları bulabilirsiniz.',
      },
      {
        soru: 'Nefes egzersizi mizaca göre değişir mi?',
        cevap: 'Evet, yanlış nefes tekniği dengesizliği artırabilir. Safravî için soğutucu Sitali nefesi, Balgamî için ısıtıcı Kapalabhati (ateş nefesi), Demevî için dengeleyen Box Breathing, Sevdavî için topraklayıcı 4-7-8 tekniği önerilir. Her mizaç için adım adım nefes teknikleri Nefes sayfamızda bulunur.',
      },
    ],
  },
  {
    kategori: 'Hıltlar & Denge',
    liste: [
      {
        soru: 'Hılt nedir, kaç çeşit hılt vardır?',
        cevap: 'Hılt, İbn-i Sina tıbbında vücudun temel sıvılarını ifade eder. Dört hılt vardır: Kan (demevî, sıcak-nemli), Safra (safravî, sıcak-kuru), Balgam (balgamî, soğuk-nemli) ve Sevda (sevdavî, soğuk-kuru). Her hılt bir elementi, bir mevsimi ve bir organ grubunu temsil eder.',
      },
      {
        soru: 'Hılt dengesizliğini nasıl anlarım?',
        cevap: 'Hangi hılt fazlaysa o hıltın belirtileri ortaya çıkar: Safra fazlalığı öfke, yanma, sarılık; Kan fazlalığı çarpıntı, yüz kızarması; Balgam fazlalığı tembellik, ödem, soğuk algınlığı; Sevda fazlalığı kaygı, uykusuzluk, melankoli. Kronik belirtiler var ise mizaç ve hılt değerlendirmesi faydalı olabilir.',
      },
      {
        soru: 'Şifalı bitkiler kullanırken dikkat edilmesi gereken nedir?',
        cevap: 'Yanlış seçilen bitki dengesizliği artırabilir. Örneğin zencefil balgamî için ideal iken safravî için öfkeyi tetikleyebilir. İlaç kullanıyorsanız bitkisel ürünlerin etkileşimine dikkat edin — mutlaka hekiminize danışın. Bilgimiz genel rehber niteliğindedir, tıbbi tavsiye değildir.',
      },
    ],
  },
  {
    kategori: 'Namaz, Rüya & Bilinç',
    liste: [
      {
        soru: 'Namaz vakitleri gerçekten hılt döngüsüyle bağlantılı mı?',
        cevap: 'İbn-i Sina\'nın hılt teorisinde gün içinde hıltların yoğunluğu değişir: Sabah kan hıltı aktifleşir, öğle safrası zirvede olur, akşam sevda yükselir, gece balgam hakimdir. Beş vakit namaz bu döngülerle örtüşen bir ritimde olup her vakit kişinin o andaki hılt durumuna etki eder.',
      },
      {
        soru: 'Rüyalarım sürekli aynı temayı işliyorsa ne anlama gelir?',
        cevap: 'İbn-i Sina\'ya göre tekrar eden rüya temaları hılt dengesinin verdiği sinyallerdir: Sürekli ateş/çatışma rüyaları safra fazlalığını, su/deniz rüyaları balgam fazlalığını, karanlık/kayıp rüyaları sevda fazlalığını gösterebilir. Uyku düzeninizi, yatmadan önceki alışkanlıklarınızı ve mizacınızı birlikte değerlendirin.',
      },
      {
        soru: 'Hz. Peygamber\'in nebevî sağlık tavsiyeleri bilimsel midir?',
        cevap: 'Çörekotu\'nun (Nigella sativa) anti-inflamatuvar etkisi, balın antimikrobiyal özellikleri ve zeytinyağının kardiyoprotektif faydaları modern araştırmalarla desteklenmektedir. Oruç ve hacamatın bazı etkileri de incelenmektedir. Ancak bu bilgiler genel sağlık bilgisi düzeyinde değerlendirilmeli; tedavi amacıyla kullanılmadan önce hekime danışılmalıdır.',
      },
    ],
  },
];

function EmailCaptureSSS() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, tip: 'sss' }),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-3xl p-8 text-center mb-6 bg-stone-800">
        <div className="text-4xl mb-3">📬</div>
        <p className="font-bold text-white text-lg">Eklendi!</p>
        <p className="text-sm text-stone-400 mt-1">Gelen kutunuzu kontrol edin.</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl p-8 mb-6 bg-stone-800">
      <p className="text-xs font-semibold uppercase tracking-widest mb-2 text-amber-400">
        Haftalık Mizaç Bülteni
      </p>
      <h3 className="text-xl font-bold text-white mb-2">
        Her soru bir başlangıç.
      </h3>
      <p className="text-sm text-stone-400 mb-6">
        Mizaç, sağlık ve bilinç hakkında daha fazlası — her Pazartesi.
      </p>
      <form onSubmit={submit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@adresiniz.com"
          required
          className="flex-1 px-4 py-3 rounded-full text-sm outline-none bg-stone-700 text-stone-100 border border-stone-600 placeholder:text-stone-500"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-6 py-3 rounded-full text-sm font-semibold text-stone-900 shrink-0 transition-all hover:opacity-90 disabled:opacity-60 bg-amber-400"
        >
          {status === 'loading' ? '⏳' : 'Gönder'}
        </button>
      </form>
      {status === 'error' && (
        <p className="text-xs text-red-400 mt-2">Bir hata oluştu, tekrar deneyin.</p>
      )}
    </div>
  );
}

export default function SSSPage() {
  const [acik, setAcik] = useState<string | null>(null);

  const toggle = (id: string) => setAcik(acik === id ? null : id);

  return (
    <main className="min-h-screen bg-linear-to-b from-stone-50 to-white">
      {/* Hero */}
      <section className="py-14 px-4 text-center bg-linear-to-b from-stone-900 to-stone-800 text-white">
        <div className="max-w-2xl mx-auto">
          <p className="text-stone-400 text-sm tracking-widest uppercase mb-3">Sık Sorulan Sorular</p>
          <h1 className="text-4xl font-bold mb-3">Mizaç Hakkında Her Şey</h1>
          <p className="text-stone-300 leading-relaxed">
            İbn-i Sina geleneğine dayalı mizaç sistemi hakkında en çok sorulan soruların cevapları.
          </p>
        </div>
      </section>

      {/* İçerik */}
      <section className="max-w-3xl mx-auto px-4 py-12">
        {sorular.map((kategori) => (
          <div key={kategori.kategori} className="mb-10">
            <h2 className="text-xs font-bold tracking-widest uppercase text-stone-400 mb-4 px-1">
              {kategori.kategori}
            </h2>
            <div className="space-y-2">
              {kategori.liste.map((item, idx) => {
                const id = `${kategori.kategori}-${idx}`;
                const isAcik = acik === id;
                return (
                  <div
                    key={id}
                    className={`bg-white rounded-2xl border transition-all ${isAcik ? 'border-stone-300 shadow-sm' : 'border-stone-100'}`}
                  >
                    <button
                      onClick={() => toggle(id)}
                      className="w-full text-left px-5 py-4 flex items-start justify-between gap-3"
                    >
                      <span className="font-semibold text-stone-800 text-sm leading-relaxed">{item.soru}</span>
                      <span className={`text-stone-400 text-sm shrink-0 mt-0.5 transition-transform ${isAcik ? 'rotate-180' : ''}`}>
                        ▾
                      </span>
                    </button>
                    {isAcik && (
                      <div className="px-5 pb-5 border-t border-stone-50">
                        <p className="text-stone-600 text-sm leading-relaxed pt-4">{item.cevap}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Email Capture */}
        <EmailCaptureSSS />

        {/* Hâlâ Sorusu Var mı? */}
        <div className="rounded-3xl p-8 text-center mt-4 bg-stone-800 text-white">
          <div className="text-3xl mb-3">✦</div>
          <h2 className="text-xl font-bold mb-2">Sorunun cevabını bulamadın mı?</h2>
          <p className="text-stone-300 text-sm mb-6">En hızlı yöntem: mizaç testini yap, profil sayfanda tüm detayları gör.</p>
          <Link
            href="/test"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-bold text-stone-900 bg-amber-400 hover:bg-amber-300 transition-colors"
          >
            ✦ Ücretsiz Testi Başlat
          </Link>
        </div>
      </section>
    </main>
  );
}
