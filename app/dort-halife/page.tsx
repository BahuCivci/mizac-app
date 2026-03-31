'use client';

import Link from 'next/link';
import { useLang } from '@/lib/lang-context';
import { ShareBar } from '@/components/share-bar';
import { EmailCapture } from '@/components/email-capture';

const halifeler = [
  {
    isim: 'Hz. Ebubekir (r.a.)',
    isimEn: 'Abu Bakr (r.a.)',
    mizac: 'Demevî',
    mizacEn: 'Sanguine',
    sembol: '💨',
    renk: '#2980b9',
    renkAcik: '#d6eaf8',
    lakap: 'Sıddîk',
    lakapEn: 'The Truthful',
    fiziksel: 'Beyaz tenli, yumuşak hatları olan, güler yüzlü bir yapıya sahipti. Saçları dolgundu, bedeni orta yapılıydı.',
    fizikselEn: 'Fair-skinned with soft features and a cheerful appearance. He had full hair and a medium build.',
    psikolojik: [
      'Son derece cömert — mal varlığının tamamını Allah yolunda verdi',
      'Sosyal ve sıcakkanlı — insanlarla kolayca bağ kurdu',
      'Yaratıcı zeka — Kur\'an\'ı ilk toplayan ve kitap haline getiren sahabe',
      'Duygusal zeka — Hz. Peygamber\'in her halini anında hissetti',
      'Güçlü sezgi — Risalet\'i ilk kabul eden yetişkin erkek',
      'İnsan ilişkilerinde üstad — ticaret hayatında da sevilen biri',
    ],
    psikolojikEn: [
      'Extraordinarily generous — gave all his wealth in the way of Allah',
      'Social and warm — easily connected with people',
      'Creative intelligence — the first to compile the Quran into book form',
      'Emotional intelligence — immediately sensed every state of the Prophet',
      'Strong intuition — the first adult male to accept the prophethood',
      'Master of human relations — beloved in his business life too',
    ],
    tarihselAnekdot: 'Hz. Ebubekir, hicret öncesinde servetinin tamamını İslam\'a harcadı. Sekiz köle satın alıp azat etti, her biri işkence gören Müslümanlardı. Bu cömertlik demevi mizacın en net tezahürüdür: kendi menfaatini düşünmeksizin vermek.',
    tarihselAnekdotEn: 'Before the migration, Abu Bakr spent his entire fortune on Islam. He purchased and freed eight slaves, each of whom was being tortured for their faith. This generosity is the clearest manifestation of the sanguine temperament: giving without thought for personal gain.',
    mizacDersi: 'Demevî mizacın en yüce hali, cömertliği ve sosyal bağı ruhani bir seviyeye taşımaktır. Hz. Ebubekir bunu hayatıyla göstermiştir.',
    mizacDersiEn: 'The highest state of the sanguine temperament is elevating generosity and social connection to a spiritual level. Abu Bakr demonstrated this with his life.',
  },
  {
    isim: 'Hz. Ömer (r.a.)',
    isimEn: 'Umar (r.a.)',
    mizac: 'Safravî',
    mizacEn: 'Choleric',
    sembol: '🔥',
    renk: '#c0392b',
    renkAcik: '#fadbd8',
    lakap: 'Faruk',
    lakapEn: 'The Distinguisher of Truth from Falsehood',
    fiziksel: 'İri yapılı, uzun boylu, güçlü bir bedene sahipti. Yüzü esmer ve heybetliydi. Yürüyüşü çabuk ve kararlıydı.',
    fizikselEn: 'Large-framed, tall, with a powerful build. His face was dark and imposing. His walk was fast and decisive.',
    psikolojik: [
      'Kararlı ve hızlı karar verici — savaş anında bile tereddütsüz hareket etti',
      'Adalet duygusu çok güçlü — "Ya hep ya hiç" anlayışı',
      'Çabuk öfkelenir ama çabuk soğur — safravî mizacın en tipik özelliği',
      'Güçlü liderlik — İran ve Mısır\'ı fethetti, dev bir devlet inşa etti',
      'Fakire şefkat — geceleri kılık değiştirip fakirlerin kapısını çalardı',
      'Zamanla olgunlaşma — hilafet sürecinde daha ölçülü hale geldi',
    ],
    psikolojikEn: [
      'Decisive and fast decision-maker — acted without hesitation even in battle',
      'Very strong sense of justice — "all or nothing" mentality',
      'Quick to anger but quick to cool — the most typical trait of the choleric temperament',
      'Strong leadership — conquered Iran and Egypt, built a vast state',
      'Compassion for the poor — would disguise himself at night and knock on the doors of the needy',
      'Maturing over time — became more measured during his caliphate',
    ],
    tarihselAnekdot: 'Hz. Ömer halife olduktan sonra geceleri kılık değiştirerek Medine sokaklarında dolaşır, aç ve muhtaç insanları bizzat sırtında taşıdığı yiyeceklerle beslerdi. Bu, safravî mizacın zirve hali: güç ve liderliğin merhametle birleşmesi.',
    tarihselAnekdotEn: 'After becoming caliph, Umar would disguise himself and walk the streets of Medina at night, feeding the hungry and needy with food he carried on his own back. This is the peak state of the choleric temperament: the merging of power and leadership with compassion.',
    mizacDersi: 'Safravî mizacın en büyük sınavı öfkeyi yönetmektir. Hz. Ömer bu sınavı geçerek tarihinin en adil liderlerinden biri olmuştur.',
    mizacDersiEn: 'The greatest test of the choleric temperament is managing anger. Umar passed this test and became one of the most just leaders in history.',
  },
  {
    isim: 'Hz. Osman (r.a.)',
    isimEn: 'Uthman (r.a.)',
    mizac: 'Balgamî',
    mizacEn: 'Phlegmatic',
    sembol: '💧',
    renk: '#27ae60',
    renkAcik: '#d5f5e3',
    lakap: 'Zinnureyn',
    lakapEn: 'Possessor of Two Lights',
    fiziksel: 'Orta boylu, yumuşak yüz hatları olan, güzel görünümlüydü. Saçları ve sakalları gür ve güzeldi. Beyaz tenli, sakin bakışlıydı.',
    fizikselEn: 'Medium height with soft facial features and a handsome appearance. His hair and beard were full and beautiful. Fair-skinned with a calm gaze.',
    psikolojik: [
      'Utangaç ve mütevazı — "hayâ" onun en belirgin özelliğiydi',
      'Son derece sabırlı — fitne döneminde kendisine yapılan zulme bile sabırla katlandı',
      'Güvenilir — Hz. Peygamber iki kızını ona verdi',
      'Analitik zeka — Kur\'an mushafını standartlaştırdı, çoğalttı ve dünyaya gönderdi',
      'Hayır-demeyi bilememe — bu hem erdemi hem de zayıf yönüydü',
      'Mali cömertlik — Müslümanların suyuna ihtiyacı olduğunda kuyuyu satın aldı ve vakfetti',
    ],
    psikolojikEn: [
      'Shy and modest — "hayâ" (modesty) was his most distinctive quality',
      'Extremely patient — endured the injustice done to him even during the fitna with patience',
      'Trustworthy — the Prophet gave two of his daughters to him',
      'Analytical intelligence — standardized the Quran mushaf, multiplied it and sent it to the world',
      'Could not say no — this was both his virtue and his weakness',
      'Financial generosity — when Muslims needed water, he bought the well and endowed it',
    ],
    tarihselAnekdot: 'Hz. Osman, kendi kanı Kur\'an sayfalarına damlayarak şehit edildi. Mushafın üzerinde okurken can verdi. Balgamî mizacın en derin özelliği olan sadakat ve sabırla, hayatının sonuna kadar yerini terk etmedi.',
    tarihselAnekdotEn: 'Uthman was martyred as his own blood dripped onto the pages of the Quran. He gave his life while reading the mushaf. With the loyalty and patience that is the deepest quality of the phlegmatic temperament, he never abandoned his post until the end of his life.',
    mizacDersi: 'Balgamî mizacın en büyük gelişim alanı sınır koymayı öğrenmektir. Hz. Osman\'ın hikayesi, sabır ve güvenilirliğin yanı sıra iradenin de ne kadar önemli olduğunu gösterir.',
    mizacDersiEn: 'The greatest area of growth for the phlegmatic temperament is learning to set boundaries. Uthman\'s story shows how important willpower is, alongside patience and reliability.',
  },
  {
    isim: 'Hz. Ali (r.a.)',
    isimEn: 'Ali (r.a.)',
    mizac: 'Sevdavî',
    mizacEn: 'Melancholic',
    sembol: '🌍',
    renk: '#7d3c98',
    renkAcik: '#e8daef',
    lakap: 'Kerremallahu Vechehu',
    lakapEn: 'May Allah Honor His Face',
    fiziksel: 'Kısa-orta boylu, geniş omuzlu, güçlü yapılıydı. Gözleri derindi ve düşünceli bakardı. Yüzü esmer, saçları ve sakalları siyahtı.',
    fizikselEn: 'Short to medium height with broad shoulders and a strong build. His eyes were deep and his gaze thoughtful. His face was dark with black hair and beard.',
    psikolojik: [
      'Derin bilgi — "Ben ilmin şehriyim, Ali ise kapısıdır" hadisinin muhatabi',
      'Metodik ve sistematik — hiçbir konuya aceleyle yaklaşmadı',
      'Sözünde duran — verdiği sözü hayatı pahasına tuttu',
      'Derin düşünür — şiir yazdı, felsefi düzeyde konuştu',
      'Sadık ve prensipli — haksızlık karşısında hiç taviz vermedi',
      'Karar sürecinde uzun — bu bazen fırsatların kaçmasına yol açtı',
    ],
    psikolojikEn: [
      'Deep knowledge — the addressee of the hadith "I am the city of knowledge and Ali is its gate"',
      'Methodical and systematic — never approached any subject hastily',
      'True to his word — kept his promises at the cost of his life',
      'Deep thinker — wrote poetry, spoke at a philosophical level',
      'Loyal and principled — never compromised in the face of injustice',
      'Long decision-making process — this sometimes led to missed opportunities',
    ],
    tarihselAnekdot: 'Hz. Ali, Hz. Peygamber\'in yatağına yatarak canını ortaya koydu. Mekke\'deki müşriklerin suikast planını, kılık değiştirerek uyuyan Hz. Ali\'nin varlığıyla boşa çıkardı. Bu fedakarlık, sevdavî mizacın en yüce hali: prensiplere olan bağlılığın ölümü bile göze almasıdır.',
    tarihselAnekdotEn: 'Ali put his life on the line by sleeping in the Prophet\'s bed. The assassination plot by the Meccan polytheists was foiled by Ali\'s presence, sleeping in disguise. This sacrifice is the highest state of the melancholic temperament: devotion to principles that makes one ready to face even death.',
    mizacDersi: 'Sevdavî mizacın en büyük gücü derin sadakat ve prensip bağlılığıdır. Hz. Ali bu gücü en yüce amaç uğrunda kullanmıştır.',
    mizacDersiEn: 'The greatest strength of the melancholic temperament is deep loyalty and commitment to principles. Ali used this strength for the highest purpose.',
  },
];

export default function DortHalifePage() {
  const { lang } = useLang();
  const tr = lang === 'tr';

  return (
    <main className="min-h-screen" style={{ background: 'var(--background)' }}>

      {/* Hero */}
      <section className="py-20 px-4 text-center" style={{ background: 'linear-gradient(180deg, #0f0a04 0%, #1a1207 100%)' }}>
        <div className="max-w-2xl mx-auto">
          <p className="text-xs tracking-widest uppercase mb-6" style={{ color: '#c4973a' }}>
            {tr ? 'İslam Tarihi · Mizaç Bilimi' : 'Islamic History · Temperament Science'}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {tr ? (
              <>4 halifeden biri<br /><span style={{ color: '#c4973a' }}>senin mizacını taşıyor.</span></>
            ) : (
              <>One of the 4 caliphs<br /><span style={{ color: '#c4973a' }}>carries your temperament.</span></>
            )}
          </h1>
          <p className="text-lg leading-relaxed mb-4" style={{ color: '#9a8060' }}>
            {tr
              ? 'Hz. Ebubekir\'in cömertliği, Hz. Ömer\'in adaleti, Hz. Osman\'ın sabrı, Hz. Ali\'nin derinliği — bunlar tesadüf değil, mizacın en yüce hâlleri.'
              : 'Abu Bakr\'s generosity, Umar\'s justice, Uthman\'s patience, Ali\'s depth — not coincidences, but temperament at its highest.'}
          </p>
          <p className="text-sm" style={{ color: '#6b5230' }}>
            {tr ? 'Varlığın Tahlili · Zeynep Işık Büyükbay' : 'Varlığın Tahlili · Zeynep Işık Büyükbay'}
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12">

        {/* Halifeler */}
        <div className="space-y-10">
          {halifeler.map((halife) => (
            <div key={halife.isim} className="rounded-3xl overflow-hidden border" style={{ borderColor: halife.renk + '30' }}>
              {/* Header */}
              <div className="p-8" style={{ background: `linear-gradient(135deg, ${halife.renkAcik}, white)` }}>
                <div className="flex items-start gap-4">
                  <div className="text-5xl">{halife.sembol}</div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h2 className="text-2xl font-bold" style={{ color: halife.renk }}>
                        {tr ? halife.isim : halife.isimEn}
                      </h2>
                      <span className="text-xs px-2 py-0.5 rounded-full text-white" style={{ background: halife.renk }}>
                        {tr ? halife.lakap : halife.lakapEn}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold px-3 py-1 rounded-full text-white" style={{ background: halife.renk }}>
                        {tr ? halife.mizac : halife.mizacEn} {halife.sembol}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {/* Fiziksel */}
                <div>
                  <h3 className="font-bold mb-2 text-sm uppercase tracking-widest opacity-50">
                    {tr ? 'Fiziksel Görünüm' : 'Physical Appearance'}
                  </h3>
                  <p className="text-sm leading-relaxed opacity-80">
                    {tr ? halife.fiziksel : halife.fizikselEn}
                  </p>
                </div>

                {/* Psikolojik */}
                <div>
                  <h3 className="font-bold mb-3 text-sm uppercase tracking-widest opacity-50">
                    {tr ? 'Karakter Özellikleri' : 'Character Traits'}
                  </h3>
                  <ul className="space-y-1.5">
                    {(tr ? halife.psikolojik : halife.psikolojikEn).map((o, i) => (
                      <li key={i} className="text-sm opacity-80 flex gap-2">
                        <span style={{ color: halife.renk }}>✦</span>
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tarihi Anekdot */}
                <div className="rounded-2xl p-5" style={{ background: halife.renkAcik }}>
                  <h3 className="font-bold mb-2" style={{ color: halife.renk }}>
                    {tr ? '📖 Tarihi Bir An' : '📖 A Historical Moment'}
                  </h3>
                  <p className="text-sm leading-relaxed opacity-90">
                    {tr ? halife.tarihselAnekdot : halife.tarihselAnekdotEn}
                  </p>
                </div>

                {/* Mizaç Dersi */}
                <div className="rounded-2xl p-4 border-l-4" style={{ borderColor: halife.renk, background: 'var(--cream)' }}>
                  <p className="text-sm italic leading-relaxed opacity-70">
                    {tr ? halife.mizacDersi : halife.mizacDersiEn}
                  </p>
                </div>

                {/* Mizaç linki */}
                <div>
                  <Link
                    href={`/mizaclar/${halife.mizac === 'Safravî' ? 'safravi' : halife.mizac === 'Demevî' ? 'demevi' : halife.mizac === 'Balgamî' ? 'balgami' : 'sevdavi'}`}
                    className="text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
                    style={{ color: halife.renk }}
                  >
                    {tr ? `${halife.mizac} profilini incele →` : `Explore ${halife.mizacEn} profile →`}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Email capture */}
        <div className="mt-10 mb-2">
          <EmailCapture
            title={tr ? 'Tarihin en büyük karakterlerinden öğren' : 'Learn from history\'s greatest characters'}
            subtitle={tr ? 'Her Pazartesi — sahabe hayatları ve mizaç dersleri. Ücretsiz.' : 'Every Monday — companion life stories and temperament lessons. Free.'}
            cta={tr ? 'Gönder' : 'Send'}
          />
        </div>

        {/* Share */}
        <div className="flex justify-center mt-8 mb-2">
          <ShareBar
            title="Dört Halifenin Mizacı — mizac.xyz"
            description="Hz. Ebubekir, Ömer, Osman ve Ali — dört halifenin mizaç analizi. İbn-i Sina geleneğiyle İslam tarihi."
            url="https://mizac.xyz/dort-halife"
          />
        </div>

        {/* CTA */}
        <div className="rounded-3xl p-8 text-center mt-12" style={{ background: 'linear-gradient(135deg, var(--cream), var(--gold-light))' }}>
          <div className="text-3xl mb-3">✦</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
            {tr ? 'Sen hangi halifenin mizacındasın?' : 'Which caliph shares your temperament?'}
          </h2>
          <p className="opacity-60 text-sm mb-5">
            {tr ? '50 soruluk ücretsiz mizaç testi' : '50-question free temperament test'}
          </p>
          <Link href="/test" className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, var(--earth), var(--gold))' }}>
            ✦ {tr ? 'Testi Başlat' : 'Start Test'}
          </Link>
        </div>

        {/* Kitap kredisi */}
        <p className="text-center text-xs opacity-30 mt-8">
          {tr ? 'Varlığın Tahlili · Zeynep Işık Büyükbay' : 'Varlığın Tahlili · Zeynep Işık Büyükbay'}
        </p>
      </div>
    </main>
  );
}
