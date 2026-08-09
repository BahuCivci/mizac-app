'use client';

import Link from 'next/link';
import { SORU_SAYISI } from '@/lib/mizac-data';
import { useLang } from '@/lib/lang-context';
import { ShareBar } from '@/components/share-bar';
import { EmailCapture } from '@/components/email-capture';

const mizacMeslekler = [
  {
    id: 'safravi',
    mizac: 'Safravî',
    mizacEn: 'Choleric',
    sembol: '🔥',
    renk: '#c0392b',
    renkAcik: '#fadbd8',
    slogan: 'Lider, Karar Verici, Yapıcı',
    sloganEn: 'Leader, Decision Maker, Builder',
    meslekler: [
      { isim: 'Girişimci / CEO', neden: 'Hızlı karar alma, liderlik, risk toleransı' },
      { isim: 'Cerrah', neden: 'Keskin karar, hızlı el-göz koordinasyonu, stres altında soğukkanlılık' },
      { isim: 'Avukat / Savcı', neden: 'Adalet duygusu, güçlü argüman, baskı altında performans' },
      { isim: 'Sporcu / Antrenör', neden: 'Rekabetçi yapı, fiziksel enerji, disiplin' },
      { isim: 'İç Mimar / Tasarımcı', neden: 'Estetik duyarlılık, görsel zeka, yaratıcı liderlik' },
      { isim: 'Politikacı / Yönetici', neden: 'Karizmatik liderlik, ikna gücü, stratejik düşünme' },
      { isim: 'Askeri Komutan', neden: 'Stratejik planlama, hızlı karar, otorite' },
      { isim: 'Tüccar / Pazarlamacı', neden: 'Satış yapma, ikna, fırsatları görme' },
    ],
    mesleklerEn: [
      { isim: 'Entrepreneur / CEO', neden: 'Fast decision-making, leadership, risk tolerance' },
      { isim: 'Surgeon', neden: 'Sharp decision-making, fast hand-eye coordination, composure under stress' },
      { isim: 'Lawyer / Prosecutor', neden: 'Sense of justice, strong argument, performance under pressure' },
      { isim: 'Athlete / Coach', neden: 'Competitive nature, physical energy, discipline' },
      { isim: 'Interior Designer', neden: 'Aesthetic sensitivity, visual intelligence, creative leadership' },
      { isim: 'Politician / Manager', neden: 'Charismatic leadership, persuasion, strategic thinking' },
      { isim: 'Military Commander', neden: 'Strategic planning, fast decision, authority' },
      { isim: 'Merchant / Marketer', neden: 'Sales ability, persuasion, spotting opportunities' },
    ],
    dikkat: 'Safravî liderler, ekiplerini zorlama eğilimindedir. En başarılı olduğunuz alan: sonuç odaklı, rekabetçi ve karar gerektiren ortamlar.',
    dikkatEn: 'Choleric leaders tend to push their teams hard. Your most successful environments: results-oriented, competitive settings that require decisive action.',
    uygunDegil: ['Monoton büro işleri', 'Uzun bekleme gerektiren meslekler', 'Yaratıcılığı kısıtlayan rutinler'],
    uygunDegılEn: ['Monotonous office work', 'Professions requiring long waits', 'Routines that restrict creativity'],
  },
  {
    id: 'demevi',
    mizac: 'Demevî',
    mizacEn: 'Sanguine',
    sembol: '💨',
    renk: '#2980b9',
    renkAcik: '#d6eaf8',
    slogan: 'İletişimci, İlham Veren, Yaratıcı',
    sloganEn: 'Communicator, Inspirer, Creative',
    meslekler: [
      { isim: 'Öğretmen / Eğitimci', neden: 'İnsanlarla bağ kurma, heyecan yaratma, bilgiyi aktarma becerisi' },
      { isim: 'Tiyatrocu / Oyuncu / Sanatçı', neden: 'Duygusal ifade, yaratıcılık, sahne enerjisi' },
      { isim: 'Sosyal Medya Uzmanı', neden: 'İçerik üretme, insanlarla etkileşim, yaratıcılık' },
      { isim: 'Turizm / Rehber', neden: 'İnsanları bir araya getirme, coşku, hikaye anlatımı' },
      { isim: 'Vaiz / Din Görevlisi', neden: 'İnsanları etkileme, duygusal bağ, ilham verme' },
      { isim: 'Halkla İlişkiler', neden: 'Sosyal beceri, iletişim, imaj yönetimi' },
      { isim: 'Müzisyen / Besteci', neden: 'Duygusal derinlik, yaratıcılık, performans' },
      { isim: 'Terapist / Koç', neden: 'Empati, insanları dinleme, ilham verme' },
    ],
    mesleklerEn: [
      { isim: 'Teacher / Educator', neden: 'Building connections with people, creating excitement, transferring knowledge' },
      { isim: 'Actor / Performer / Artist', neden: 'Emotional expression, creativity, stage energy' },
      { isim: 'Social Media Specialist', neden: 'Content creation, interaction with people, creativity' },
      { isim: 'Tourism / Guide', neden: 'Bringing people together, enthusiasm, storytelling' },
      { isim: 'Preacher / Religious Official', neden: 'Influencing people, emotional connection, inspiration' },
      { isim: 'Public Relations', neden: 'Social skills, communication, image management' },
      { isim: 'Musician / Composer', neden: 'Emotional depth, creativity, performance' },
      { isim: 'Therapist / Coach', neden: 'Empathy, listening to people, inspiring' },
    ],
    dikkat: 'Demevî çalışanlar monoton ve sosyal olmayan ortamlarda verimsizleşir. En iyi olduğunuz alan: insanlarla etkileşim, yaratıcılık ve ifade özgürlüğü.',
    dikkatEn: 'Sanguine workers become inefficient in monotonous and unsocial environments. Your best area: interaction with people, creativity and freedom of expression.',
    uygunDegil: ['Yalnız çalışma gerektiren izole işler', 'Yüksek detay ve tekrar gerektiren roller', 'Katı hiyerarşik yapılar'],
    uygunDegılEn: ['Isolated work requiring solitude', 'Roles requiring high detail and repetition', 'Rigid hierarchical structures'],
  },
  {
    id: 'balgami',
    mizac: 'Balgamî',
    mizacEn: 'Phlegmatic',
    sembol: '💧',
    renk: '#27ae60',
    renkAcik: '#d5f5e3',
    slogan: 'Güvenilir, Analitik, Uzun Soluklu',
    sloganEn: 'Reliable, Analytical, Long-term',
    meslekler: [
      { isim: 'Doktor (Dahiliye)', neden: 'Sabırlı teşhis, güven verme, uzun vadeli hasta takibi' },
      { isim: 'Muhasebeci / Mali Müşavir', neden: 'Detay odaklılık, güvenilirlik, sistematik çalışma' },
      { isim: 'Bankacı / Risk Analisti', neden: 'Temkinli karar, analitik düşünce, güven' },
      { isim: 'Araştırmacı / Bilim İnsanı', neden: 'Uzun vadeli odak, sabır, metodolojik çalışma' },
      { isim: 'Psikolog / Danışman', neden: 'Derin dinleme, sabır, güven yaratma' },
      { isim: 'Mühendis (Kalite Kontrol)', neden: 'Standartlara uyum, detay dikkati, sistematik kontrol' },
      { isim: 'Hemşire / Bakıcı', neden: 'Sabır, şefkat, uzun süreli destek verme' },
      { isim: 'Arşivci / Kütüphaneci', neden: 'Organizasyon, sabır, bilgiye saygı' },
    ],
    mesleklerEn: [
      { isim: 'Doctor (Internal Medicine)', neden: 'Patient diagnosis, building trust, long-term patient follow-up' },
      { isim: 'Accountant / Financial Advisor', neden: 'Detail orientation, reliability, systematic work' },
      { isim: 'Banker / Risk Analyst', neden: 'Cautious decision-making, analytical thinking, trust' },
      { isim: 'Researcher / Scientist', neden: 'Long-term focus, patience, methodological work' },
      { isim: 'Psychologist / Counselor', neden: 'Deep listening, patience, building trust' },
      { isim: 'Engineer (Quality Control)', neden: 'Compliance with standards, attention to detail, systematic control' },
      { isim: 'Nurse / Caregiver', neden: 'Patience, compassion, providing long-term support' },
      { isim: 'Archivist / Librarian', neden: 'Organization, patience, respect for knowledge' },
    ],
    dikkat: 'Balgamî çalışanlar hızlı karar gerektiren ve kaotik ortamlarda yorulur. En iyi olduğunuz alan: güvenilirlik, uzun vadeli planlama ve istikrar.',
    dikkatEn: 'Phlegmatic workers tire in environments requiring fast decisions and chaos. Your best area: reliability, long-term planning and stability.',
    uygunDegil: ['Yüksek hızlı karar gerektiren acil durumlar', 'Sürekli değişen ortamlar', 'Ön plansız spontane roller'],
    uygunDegılEn: ['Emergencies requiring high-speed decisions', 'Constantly changing environments', 'Spontaneous roles without prior planning'],
  },
  {
    id: 'sevdavi',
    mizac: 'Sevdavî',
    mizacEn: 'Melancholic',
    sembol: '🌍',
    renk: '#7d3c98',
    renkAcik: '#e8daef',
    slogan: 'Derin Düşünür, Mükemmeliyetçi, Uzman',
    sloganEn: 'Deep Thinker, Perfectionist, Expert',
    meslekler: [
      { isim: 'Yazar / Şair', neden: 'Derin düşünce, duygu yoğunluğu, anlam arayışı' },
      { isim: 'Felsefeci / Akademisyen', neden: 'Analitik derinlik, sistematik düşünce, uzun vadeli araştırma' },
      { isim: 'Arkeolog / Tarihçi', neden: 'Geçmişe ilgi, detay dikkati, sabırlı araştırma' },
      { isim: 'Mühendis / Matematikçi', neden: 'Sistematik düşünce, problem çözme, mükemmeliyetçilik' },
      { isim: 'Hâkim / Savcı', neden: 'Prensipli yapı, adalet duygusu, detaylı analiz' },
      { isim: 'Hafız / Dini Âlim', neden: 'Derin hafıza, metodik çalışma, mükemmeliyetçilik' },
      { isim: 'Dedektif / Analist', neden: 'Analitik düşünce, şüpheci bakış, detay takibi' },
      { isim: 'Müzisyen (Klasik)', neden: 'Duygusal derinlik, mükemmeliyetçilik, uzun çalışma süreci' },
    ],
    mesleklerEn: [
      { isim: 'Writer / Poet', neden: 'Deep thinking, emotional intensity, search for meaning' },
      { isim: 'Philosopher / Academic', neden: 'Analytical depth, systematic thinking, long-term research' },
      { isim: 'Archaeologist / Historian', neden: 'Interest in the past, attention to detail, patient research' },
      { isim: 'Engineer / Mathematician', neden: 'Systematic thinking, problem solving, perfectionism' },
      { isim: 'Judge / Prosecutor', neden: 'Principled structure, sense of justice, detailed analysis' },
      { isim: 'Hafiz / Religious Scholar', neden: 'Deep memory, methodical work, perfectionism' },
      { isim: 'Detective / Analyst', neden: 'Analytical thinking, skeptical view, detail tracking' },
      { isim: 'Musician (Classical)', neden: 'Emotional depth, perfectionism, long work process' },
    ],
    dikkat: 'Sevdavî çalışanlar yüzeysel ve sosyal baskılı ortamlarda verimini kaybeder. En iyi olduğunuz alan: uzmanlık gerektiren, bağımsız çalışabileceğiniz ve derinleşebildiğiniz alanlar.',
    dikkatEn: 'Melancholic workers lose efficiency in superficial and socially pressured environments. Your best area: fields requiring expertise where you can work independently and delve deeply.',
    uygunDegil: ['Yüzeysel sosyal etkileşim gerektiren satış rolleri', 'Sürekli açık ofis ortamları', 'Sık sık bölünme gerektiren görevler'],
    uygunDegılEn: ['Sales roles requiring superficial social interaction', 'Constant open office environments', 'Tasks requiring frequent interruption'],
  },
];

export default function MesleklerPage() {
  const { lang } = useLang();
  const tr = lang === 'tr';

  return (
    <main className="min-h-screen" style={{ background: 'var(--background)' }}>

      {/* Hero */}
      <section className="py-20 px-4 text-center" style={{ background: 'linear-gradient(180deg, #0f0a04 0%, #1a1207 100%)' }}>
        <div className="max-w-2xl mx-auto">
          <p className="text-xs tracking-widest uppercase mb-6" style={{ color: '#c4973a' }}>
            {tr ? 'Kariyer · Mizaç Bilimi' : 'Career · Temperament Science'}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {tr ? (
              <>Yanlış işte<br /><span style={{ color: '#c4973a' }}>doğru insan olmak.</span></>
            ) : (
              <>Being the right person<br /><span style={{ color: '#c4973a' }}>in the wrong job.</span></>
            )}
          </h1>
          <p className="text-lg leading-relaxed mb-4" style={{ color: '#9a8060' }}>
            {tr
              ? 'Safravî bir insan monoton büroda solar. Balgamî bir insan hızlı tempolu satışta yorulur. Mesleğin mizacınla örtüşmüyorsa hayat ağır gelir — bu karaktersizlik değil, uyumsuzluk.'
              : 'A choleric person fades in a monotonous office. A phlegmatic person burns out in fast-paced sales. When your career doesn\'t match your temperament, life feels heavy — not a character flaw, just a mismatch.'}
          </p>
          <p className="text-sm" style={{ color: '#6b5230' }}>
            {tr ? 'İbn-i Sina geleneğine dayalı kariyer rehberi' : 'Career guide based on Ibn Sina\'s tradition'}
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12">

        {/* Mizaç-Meslek kartları */}
        <div className="space-y-10">
          {mizacMeslekler.map((m) => (
            <div key={m.id} className="rounded-3xl overflow-hidden border" style={{ borderColor: m.renk + '30' }}>

              {/* Header */}
              <div className="p-6" style={{ background: `linear-gradient(135deg, ${m.renkAcik}, white)` }}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl">{m.sembol}</span>
                  <div>
                    <h2 className="text-2xl font-bold" style={{ color: m.renk }}>
                      {tr ? m.mizac : m.mizacEn}
                    </h2>
                    <p className="text-sm opacity-60">{tr ? m.slogan : m.sloganEn}</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Meslekler */}
                <h3 className="font-bold mb-4 text-sm uppercase tracking-widest opacity-50">
                  {tr ? 'Uygun Meslekler' : 'Suitable Careers'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                  {(tr ? m.meslekler : m.mesleklerEn).map((meslek, i) => (
                    <div key={i} className="rounded-xl p-3 border" style={{ background: m.renkAcik, borderColor: m.renk + '20' }}>
                      <p className="font-semibold text-sm" style={{ color: m.renk }}>{meslek.isim}</p>
                      <p className="text-xs opacity-60 mt-0.5">{meslek.neden}</p>
                    </div>
                  ))}
                </div>

                {/* Dikkat */}
                <div className="rounded-xl p-4 mb-4" style={{ background: 'var(--cream)' }}>
                  <p className="text-sm leading-relaxed opacity-80">
                    <span className="font-semibold">💡 </span>
                    {tr ? m.dikkat : m.dikkatEn}
                  </p>
                </div>

                {/* Uygun değil */}
                <div>
                  <p className="text-xs font-semibold opacity-40 uppercase tracking-wider mb-2">
                    {tr ? 'Zorlu Alanlar' : 'Challenging Areas'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(tr ? m.uygunDegil : m.uygunDegılEn).map((u, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded-full bg-gray-100 opacity-60">{u}</span>
                    ))}
                  </div>
                </div>

                <Link href={`/mizaclar/${m.id}`} className="inline-flex items-center gap-1 mt-4 text-sm font-semibold hover:gap-2 transition-all" style={{ color: m.renk }}>
                  {tr ? `${m.mizac} profilini detaylı incele →` : `Explore ${m.mizacEn} profile in detail →`}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Email capture */}
        <div className="mt-10">
          <EmailCapture
            title={tr ? 'Mizacına göre kariyer rehberi' : 'Career guide by temperament'}
            subtitle={tr ? 'Her Pazartesi — mizacına uygun kariyer adımları. Ücretsiz.' : 'Every Monday — career steps matching your temperament. Free.'}
            cta={tr ? 'Gönder' : 'Send'}
          />
        </div>

        {/* Share */}
        <div className="flex justify-center mt-8 mb-2">
          <ShareBar
            title="Mizaca Göre Kariyer Rehberi — mizac.xyz"
            description="Hangi meslek hangi mizaca uygun? Safravi, demevi, balgami ve sovdavi için ideal kariyerler."
            url="https://mizac.xyz/meslekler"
          />
        </div>

        {/* CTA */}
        <div className="rounded-3xl p-8 text-center mt-12" style={{ background: 'linear-gradient(135deg, var(--cream), var(--gold-light))' }}>
          <div className="text-3xl mb-3">✦</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
            {tr ? 'Önce mizacını öğren' : 'First discover your temperament'}
          </h2>
          <p className="opacity-60 text-sm mb-5">
            {tr ? `${SORU_SAYISI} soruluk ücretsiz mizaç testi` : `${SORU_SAYISI}-question free temperament test`}
          </p>
          <Link href="/test" className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, var(--earth), var(--gold))' }}>
            ✦ {tr ? 'Testi Başlat' : 'Start Test'}
          </Link>
        </div>

        <p className="text-center text-xs opacity-30 mt-8">
          Varlığın Tahlili · Zeynep Işık Büyükbay
        </p>
      </div>
    </main>
  );
}
