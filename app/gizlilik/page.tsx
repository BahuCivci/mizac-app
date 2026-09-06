import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Gizlilik Politikası · Mizaç',
  description: 'Mizaç.xyz gizlilik politikası. Kişisel verilerinizin nasıl toplandığı, kullanıldığı ve korunduğu hakkında bilgi.',
  alternates: { canonical: 'https://mizac.xyz/gizlilik' },
  robots: { index: true, follow: false },
};

export default function GizlilikPage() {
  return (
    <main className="min-h-screen px-4 py-16" style={{ background: 'var(--background)' }}>
      <div className="max-w-2xl mx-auto">

        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] mb-3" style={{ color: '#c4973a' }}>
            Yasal
          </p>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
            Gizlilik Politikası
          </h1>
          <p className="text-sm opacity-50">Son güncelleme: Mart 2026</p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed" style={{ color: 'var(--foreground)' }}>

          <section>
            <h2 className="font-bold text-base mb-3" style={{ color: 'var(--earth)' }}>1. Veri Sorumlusu</h2>
            <p className="opacity-80">
              Bu gizlilik politikası, <strong>mizac.xyz</strong> adresinde faaliyet gösteren Mizaç platformuna aittir.
              Kişisel verilerinizin işlenmesinden sorumlu taraf olarak 6698 sayılı KVKK kapsamındaki yükümlülüklerimizi yerine getirmeyi taahhüt ederiz.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-base mb-3" style={{ color: 'var(--earth)' }}>2. Toplanan Veriler</h2>
            <div className="space-y-3 opacity-80">
              <div className="rounded-xl p-4" style={{ background: 'var(--cream)' }}>
                <p className="font-semibold mb-1">E-posta adresi</p>
                <p>Bülten kaydı veya profil gönderimi için isteğe bağlı olarak sağlarsanız toplanır. Zorunlu değildir.</p>
              </div>
              <div className="rounded-xl p-4" style={{ background: 'var(--cream)' }}>
                <p className="font-semibold mb-1">Test verileri</p>
                <p>Mizaç testi yanıtlarınız ve sonuçlarınız yalnızca tarayıcınızın yerel deposunda (localStorage) saklanır. Sunucularımıza gönderilmez.</p>
              </div>
              <div className="rounded-xl p-4" style={{ background: 'var(--cream)' }}>
                <p className="font-semibold mb-1">Analitik veriler</p>
                <p>Google Analytics 4 aracılığıyla sayfa görüntüleme, oturum süresi ve genel trafik verileri anonim olarak toplanır. IP adresiniz anonimleştirilir.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-bold text-base mb-3" style={{ color: 'var(--earth)' }}>3. Verilerin Kullanım Amacı</h2>
            <ul className="space-y-2 opacity-80 pl-4">
              {[
                'Haftalık mizaç bülteni göndermek (e-posta aboneleri için)',
                'Sitenin performansını ve kullanıcı deneyimini iyileştirmek',
                'Hizmet kalitesini ölçmek ve analiz etmek',
                'Yasal yükümlülükleri yerine getirmek',
              ].map((item) => (
                <li key={item}>✦ {item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-base mb-3" style={{ color: 'var(--earth)' }}>4. Veri Paylaşımı</h2>
            <p className="opacity-80">
              Kişisel verileriniz üçüncü taraflarla satılmaz, kiralanmaz veya ticari amaçla paylaşılmaz.
              Yalnızca e-posta servisi sağlayıcısı (bülten altyapısı) ve Google Analytics ile teknik işlem amacıyla paylaşılabilir.
              Her iki taraf da GDPR uyumludur.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-base mb-3" style={{ color: 'var(--earth)' }}>5. Çerezler (Cookies)</h2>
            <p className="opacity-80 mb-3">
              Sitemizdeki çerezler şunlardır:
            </p>
            <div className="space-y-2 opacity-80">
              <div className="rounded-xl p-4" style={{ background: 'var(--cream)' }}>
                <p className="font-semibold mb-1">Zorunlu çerezler</p>
                <p>Sitenin işlevselliği için gereklidir. Devre dışı bırakılamaz.</p>
              </div>
              <div className="rounded-xl p-4" style={{ background: 'var(--cream)' }}>
                <p className="font-semibold mb-1">Analitik çerezler (Google Analytics)</p>
                <p>Tarayıcı ayarlarınızdan veya Google Analytics Opt-out aracından devre dışı bırakabilirsiniz.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-bold text-base mb-3" style={{ color: 'var(--earth)' }}>6. Haklarınız (KVKK Md. 11)</h2>
            <ul className="space-y-2 opacity-80 pl-4">
              {[
                'Kişisel verilerinizin işlenip işlenmediğini öğrenme',
                'İşlenmişse buna ilişkin bilgi talep etme',
                'İşlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme',
                'Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme',
                'Verilerin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme',
                'KVKK kapsamında silinmesini veya yok edilmesini isteme',
                'İşleme itiraz etme ve zararın giderilmesini talep etme',
              ].map((item) => (
                <li key={item}>✦ {item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-base mb-3" style={{ color: 'var(--earth)' }}>7. Saklama Süresi</h2>
            <p className="opacity-80">
              E-posta adresiniz aboneliğinizi sonlandırana kadar saklanır.
              Analitik veriler Google&apos;ın standart saklama politikasına (14 ay) tabidir.
              Test verileri yalnızca tarayıcınızda saklanır; silmek için tarayıcı önbelleğinizi temizleyebilirsiniz.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-base mb-3" style={{ color: 'var(--earth)' }}>8. YouTube API Servisleri</h2>
            <p className="opacity-80 mb-3">
              Sitenin günlük videoları, site sahibinin kendi YouTube kanalına <strong>YouTube API Servisleri</strong>
              {' '}aracılığıyla yükleniyor. Bu bölüm, YouTube&apos;un geliştirici şartlarının gerektirdiği açıklamadır.
            </p>
            <ul className="space-y-2 opacity-80 pl-4">
              <li>✦ Bu özelliği kullanan tek kişi site sahibidir; ziyaretçilerden YouTube ile ilgili hiçbir veri toplanmaz.</li>
              <li>✦ Saklanan tek şey, site sahibinin kendi hesabı için verdiği yükleme yetkisinin (OAuth) belirtecidir. Yalnızca sunucuda tutulur, üçüncü taraflarla paylaşılmaz.</li>
              <li>✦ İstenen tek izin video yüklemedir (<code>youtube.upload</code>). Kanal verileri, izleyici bilgileri ve analiz verileri okunmaz.</li>
              <li>✦ Yetki istendiği an geri alınabilir:{' '}
                <a href="https://myaccount.google.com/permissions" className="underline" target="_blank" rel="noopener noreferrer">
                  Google Hesabı → Üçüncü taraf erişimi
                </a>. Yetki geri alındığında sakladığımız belirteç geçersiz olur ve ilk çalıştırmada silinir.
              </li>
              <li>✦ Saklanan belirteç talep üzerine derhal silinir; iletişim adresi aşağıdadır.</li>
            </ul>
            <p className="opacity-80 mt-3">
              Bu özelliği kullanırken{' '}
              <a href="https://www.youtube.com/t/terms" className="underline" target="_blank" rel="noopener noreferrer">
                YouTube Hizmet Şartları
              </a>{' '}
              geçerlidir. Google&apos;ın verilerinizi nasıl işlediği:{' '}
              <a href="https://policies.google.com/privacy" className="underline" target="_blank" rel="noopener noreferrer">
                Google Gizlilik Politikası
              </a>.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-base mb-3" style={{ color: 'var(--earth)' }}>9. İletişim</h2>
            <p className="opacity-80">
              Gizlilik politikamız veya kişisel verileriniz hakkında sorularınız için:{' '}
              <strong>mizac.xyz/hakkinda</strong> adresindeki iletişim bilgilerini kullanabilirsiniz.
            </p>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t" style={{ borderColor: 'var(--gold-light)' }}>
          <Link href="/" className="text-sm opacity-50 hover:opacity-100 transition-opacity" style={{ color: 'var(--earth)' }}>
            ← Ana Sayfaya Dön
          </Link>
        </div>

      </div>
    </main>
  );
}
