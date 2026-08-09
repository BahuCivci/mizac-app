'use client';

import Link from 'next/link';
import { SORU_SAYISI } from '@/lib/mizac-data';
import { useLang } from '@/lib/lang-context';

export default function HakkindaPage() {
  const { lang } = useLang();
  const tr = lang === 'tr';

  return (
    <main className="min-h-screen px-4 py-12" style={{ background: 'var(--background)' }}>
      <div className="max-w-2xl mx-auto">

        <div className="text-center mb-10">
          <div className="text-4xl mb-3" style={{ color: 'var(--gold)' }}>✦</div>
          <h1 className="text-4xl font-bold mb-3" style={{ color: 'var(--foreground)' }}>
            {tr ? 'Hakkında' : 'About'}
          </h1>
          <p className="opacity-60">
            {tr ? 'Mizaç nedir ve bu uygulama nasıl çalışır?' : 'What is temperament and how does this app work?'}
          </p>
        </div>

        <div className="space-y-6">

          <div className="rounded-2xl p-6" style={{ background: 'var(--cream)' }}>
            <h2 className="font-bold text-xl mb-3" style={{ color: 'var(--earth)' }}>
              {tr ? '🌿 Mizaç Nedir?' : '🌿 What is Temperament?'}
            </h2>
            <p className="leading-relaxed opacity-80 text-sm">
              {tr
                ? 'Mizaç, İslam ve Yunan tıbbının temel kavramlarından biridir. İbn-i Sina (980-1037), El-Kanun fi\'t-Tıbb adlı eserinde insan bedenini ve ruhunu dört temel elementin (ateş, hava, su, toprak) dengesi olarak açıklamıştır. Bu dengeye göre her insanın baskın bir mizaç tipi vardır: Safravî, Demevî, Balgamî veya Sevdavî.'
                : 'Temperament is one of the fundamental concepts of Islamic and Greek medicine. Ibn Sina (980-1037) explained the human body and soul as a balance of four basic elements (fire, air, water, earth) in his work Al-Qanun fi al-Tibb. According to this balance, each person has a dominant temperament type: Choleric, Sanguine, Phlegmatic, or Melancholic.'}
            </p>
          </div>

          <div className="rounded-2xl p-6" style={{ background: 'var(--cream)' }}>
            <h2 className="font-bold text-xl mb-3" style={{ color: 'var(--earth)' }}>
              {tr ? '📝 Test Nasıl Çalışır?' : '📝 How Does the Test Work?'}
            </h2>
            <p className="leading-relaxed opacity-80 text-sm mb-3">
              {tr
                ? `Testimiz, kitap içeriğinden çıkarılmış ${SORU_SAYISI} sorudan oluşmaktadır. Fiziksel özellikler, duygusal tepkiler, sosyal davranışlar, çalışma stili ve günlük rutinler gibi farklı kategorilerdeki sorular, dört mizaç tipinden hangisine daha yakın olduğunuzu belirler.`
                : `Our test consists of ${SORU_SAYISI} questions extracted from book content. Questions in categories such as physical traits, emotional responses, social behaviors, work style and daily routines determine which of the four temperament types you are closest to.`}
            </p>
            <p className="leading-relaxed opacity-80 text-sm">
              {tr
                ? 'Her soru dört seçenek sunar ve her seçenek dört mizaç tipine farklı puanlar verir. Testin sonunda en yüksek puanı alan mizaç tipi sizin baskın mizacınız olarak belirlenir.'
                : 'Each question offers four options and each option gives different points to the four temperament types. At the end of the test, the temperament type with the highest score is determined as your dominant temperament.'}
            </p>
          </div>

          <div className="rounded-2xl p-6" style={{ background: 'var(--cream)' }}>
            <h2 className="font-bold text-xl mb-3" style={{ color: 'var(--earth)' }}>
              {tr ? '📚 Kaynak' : '📚 Source'}
            </h2>
            <p className="leading-relaxed opacity-80 text-sm">
              {tr
                ? 'Bu uygulama, Zeynep Işık Büyükbay tarafından yazılan "Varlığın Tahlili" adlı mizaç kitabındaki bilgilere dayanmaktadır. Sorular ve mizaç profilleri doğrudan kitabın içeriğinden derlenmiştir.'
                : 'This application is based on information from the temperament book "Varlığın Tahlili" written by Zeynep Işık Büyükbay. Questions and temperament profiles are compiled directly from the book\'s content.'}
            </p>
          </div>

          <div className="rounded-2xl p-6" style={{ background: 'var(--cream)' }}>
            <h2 className="font-bold text-xl mb-3" style={{ color: 'var(--earth)' }}>
              {tr ? '⚠️ Önemli Not' : '⚠️ Important Note'}
            </h2>
            <p className="leading-relaxed opacity-80 text-sm">
              {tr
                ? 'Bu test eğitim ve kişisel farkındalık amaçlıdır. Tıbbi bir tanı aracı değildir. Sağlık sorunlarınız için lütfen bir uzmana danışın.'
                : 'This test is for educational and personal awareness purposes. It is not a medical diagnostic tool. Please consult a specialist for health concerns.'}
            </p>
          </div>

        </div>

        <div className="text-center mt-10">
          <Link
            href="/test"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold text-lg transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, var(--earth), var(--gold))' }}
          >
            ✦ {tr ? 'Testi Başlat' : 'Start the Test'}
          </Link>
        </div>
      </div>
    </main>
  );
}
