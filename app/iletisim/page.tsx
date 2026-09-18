'use client';

import Link from 'next/link';
import { useLang } from '@/lib/lang-context';

/**
 * İletişim sayfası.
 *
 * NEDEN VAR (18 Eyl 2026)
 * Sitede ziyaretçinin ulaşabileceği tek bir yol yoktu: adres yalnız kullanım
 * koşullarının içine gömülüydü ve o adres (`destek@mizac.xyz`) ÇALIŞMIYORDU —
 * alan adının MX kaydı yok, yazılan her posta geri dönüyordu. Ödeme sonrası
 * sayfası da müşteriyi oraya yönlendiriyordu.
 */
const EPOSTA = 'safra943@gmail.com';

export default function IletisimPage() {
  const { lang } = useLang();
  const tr = lang === 'tr';

  const konular = tr
    ? [
        { baslik: '📄 Rapor desteği', metin: 'Satın aldığınız rapor size ulaşmadıysa ya da yeniden indirmeniz gerekiyorsa, ödeme sırasında kullandığınız e-posta adresini yazın.' },
        { baslik: '🔒 Gizlilik ve veriler', metin: 'Verilerinizin silinmesini isteyebilir, hangi verilerin tutulduğunu sorabilirsiniz. Ayrıntı gizlilik politikasında.' },
        { baslik: '💬 Geri bildirim', metin: 'Yanlış bulduğunuz bir bilgi, çalışmayan bir sayfa ya da önerileriniz için yazabilirsiniz.' },
      ]
    : [
        { baslik: '📄 Report support', metin: 'If your purchased report did not arrive or you need to download it again, write to us with the e-mail address you used at checkout.' },
        { baslik: '🔒 Privacy and data', metin: 'You may ask what data is kept about you, or ask for it to be deleted. Details are in the privacy policy.' },
        { baslik: '💬 Feedback', metin: 'Write to us about anything you found inaccurate, a page that does not work, or a suggestion.' },
      ];

  return (
    <main className="min-h-screen px-4 py-12" style={{ background: 'var(--background)' }}>
      <div className="max-w-2xl mx-auto">

        <div className="text-center mb-10">
          <div className="text-4xl mb-3" style={{ color: 'var(--gold)' }}>✦</div>
          <h1 className="text-4xl font-bold mb-3" style={{ color: 'var(--foreground)' }}>
            {tr ? 'İletişim' : 'Contact'}
          </h1>
          <p className="opacity-60">
            {tr
              ? 'Sorularınız ve geri bildirimleriniz için bize e-posta ile ulaşın.'
              : 'Reach us by e-mail for questions and feedback.'}
          </p>
        </div>

        <div className="rounded-2xl p-6 mb-6 text-center" style={{ background: 'var(--cream)' }}>
          <p className="text-sm opacity-70 mb-2">{tr ? 'E-posta' : 'E-mail'}</p>
          <a
            href={`mailto:${EPOSTA}`}
            className="text-xl font-bold break-all hover:underline"
            style={{ color: 'var(--earth)' }}
          >
            {EPOSTA}
          </a>
          <p className="text-xs opacity-60 mt-3">
            {tr
              ? 'Genelde birkaç gün içinde yanıtlıyoruz.'
              : 'We usually reply within a few days.'}
          </p>
        </div>

        <div className="space-y-4">
          {konular.map((k) => (
            <div key={k.baslik} className="rounded-2xl p-6" style={{ background: 'var(--cream)' }}>
              <h2 className="font-bold text-lg mb-2" style={{ color: 'var(--earth)' }}>{k.baslik}</h2>
              <p className="leading-relaxed opacity-80 text-sm">{k.metin}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl p-6 mt-6" style={{ background: 'var(--cream)' }}>
          <p className="leading-relaxed opacity-80 text-sm">
            {tr
              ? 'Mizaç.xyz bir sağlık kuruluşu değildir ve tıbbi tavsiye vermez. Şikâyetiniz varsa hekime başvurun; acil durumlarda 112.'
              : 'Mizac.xyz is not a healthcare provider and does not give medical advice. See a physician for symptoms; in an emergency call your local emergency number.'}
          </p>
        </div>

        <div className="flex gap-4 justify-center mt-8 text-sm">
          <Link href="/gizlilik" className="hover:underline" style={{ color: 'var(--earth)' }}>
            {tr ? 'Gizlilik Politikası' : 'Privacy Policy'}
          </Link>
          <span className="opacity-40">·</span>
          <Link href="/kullanim-kosullari" className="hover:underline" style={{ color: 'var(--earth)' }}>
            {tr ? 'Kullanım Koşulları' : 'Terms of Service'}
          </Link>
          <span className="opacity-40">·</span>
          <Link href="/hakkinda" className="hover:underline" style={{ color: 'var(--earth)' }}>
            {tr ? 'Hakkında' : 'About'}
          </Link>
        </div>
      </div>
    </main>
  );
}
