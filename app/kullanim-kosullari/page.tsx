/*
 * TASLAK — YAYINA ALMADAN ÖNCE HUKUKÇUYA OKUTUN
 *
 * Aşağıdaki metin bir avukat tarafından hazırlanmadı; site sahibinin ve
 * yazan aracın hukuk eğitimi yok. Mevcut uygulamayı (₺99 tek seferlik PDF
 * rapor, LemonSqueezy ödemesi, 7 gün geçerli indirme bağlantısı, yapay zekâ
 * danışmanı) dürüstçe tarif etmeye çalışır, ama bağlayıcı bir sözleşme
 * denetiminden geçmemiştir.
 *
 * Özellikle şu maddeler doğrulanmalı:
 *   - 6. madde, cayma hakkı istisnası: Mesafeli Sözleşmeler Yönetmeliği
 *     m.15/1-ğ atfı ve gönüllü 14 günlük iade taahhüdü.
 *   - 7. madde, sorumluluğun ödenen tutarla sınırlanması — tüketici
 *     sözleşmelerinde bu tür sınırlamalar geçersiz sayılabiliyor.
 *   - 4. madde, 18 yaş sınırı: uygulamada bir yaş doğrulaması YOK; metin
 *     tutmadığı bir şeyi vaat ediyor olabilir.
 *   - 10. madde, yetkili mahkeme/hakem heyeti ifadesi.
 *   - Satıcı kimliği: LemonSqueezy "merchant of record" olarak yazıldı;
 *     mağaza ayarlarındaki gerçek yapılandırmayla eşleştiğini teyit edin.
 */
import Link from 'next/link';

export default function KullanimKosullariPage() {
  return (
    <main className="min-h-screen px-4 py-16" style={{ background: 'var(--background)' }}>
      <div className="max-w-2xl mx-auto">

        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] mb-3" style={{ color: '#c4973a' }}>
            Yasal
          </p>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
            Kullanım Koşulları
          </h1>
          <p className="text-sm opacity-50">Son güncelleme: Eylül 2026</p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed" style={{ color: 'var(--foreground)' }}>

          <section>
            <h2 className="font-bold text-base mb-3" style={{ color: 'var(--earth)' }}>1. Taraflar ve Kapsam</h2>
            <p className="opacity-80">
              Bu Kullanım Koşulları, <strong>mizac.xyz</strong>{' '}adresinde yayımlanan Mizaç platformu (bundan sonra
              &laquo;Site&raquo;) ile Site&apos;yi kullanan kişi (bundan sonra &laquo;Kullanıcı&raquo;) arasındaki
              ilişkiyi düzenler. Site&apos;yi ziyaret ederek, testi çözerek, Mizaç Danışmanı ile sohbet ederek veya
              ücretli bir ürün satın alarak bu koşulları okuduğunuzu ve kabul ettiğinizi beyan etmiş olursunuz.
              Koşulları kabul etmiyorsanız Site&apos;yi kullanmayınız.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-base mb-3" style={{ color: 'var(--earth)' }}>2. Hizmetin Tanımı</h2>
            <div className="space-y-3 opacity-80">
              <div className="rounded-xl p-4" style={{ background: 'var(--cream)' }}>
                <p className="font-semibold mb-1">Mizaç testi</p>
                <p>
                  Safravî, Demevî, Balgamî ve Sevdavî mizaçlarından hangisinin baskın olduğuna dair bir eğilim
                  gösterir. Sorular ve puanlama, Zeynep Işık Büyükbay&apos;ın <em>Varlığın Tahlili</em> adlı
                  eserinden derlenmiştir. Yanıtlarınız ve sonucunuz yalnızca tarayıcınızın yerel deposunda saklanır.
                </p>
              </div>
              <div className="rounded-xl p-4" style={{ background: 'var(--cream)' }}>
                <p className="font-semibold mb-1">Site içeriği</p>
                <p>
                  Mizaç profilleri, hıltlar, şifalı bitkiler, beslenme, mevsim, meslek ve benzeri konulardaki
                  yazılar ile blog içeriği; İbn-i Sina geleneğine dayanan <strong>genel bilgilendirme</strong>
                  {' '}niteliğindedir.
                </p>
              </div>
              <div className="rounded-xl p-4" style={{ background: 'var(--cream)' }}>
                <p className="font-semibold mb-1">Mizaç Danışmanı (sohbet)</p>
                <p>
                  Bir yapay zekâ dil modeliyle çalışan sohbet arayüzüdür. Yanıtlar otomatik üretilir; hatalı,
                  eksik veya tutarsız olabilir. Danışman bir uzmanın, hekimin veya terapistin yerine geçmez.
                  Hizmet üçüncü taraf altyapıya bağlı olduğundan geçici olarak yanıt vermeyebilir ya da tamamen
                  kapatılabilir.
                </p>
              </div>
              <div className="rounded-xl p-4" style={{ background: 'var(--cream)' }}>
                <p className="font-semibold mb-1">Derin Mizaç Raporu (ücretli)</p>
                <p>
                  Test sonucunuza göre üretilen, e-posta ile teslim edilen PDF rapordur. Ayrıntılar 6. maddededir.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-bold text-base mb-3" style={{ color: 'var(--earth)' }}>3. Tıbbi Tavsiye Değildir</h2>
            <div
              className="rounded-xl p-5 mb-3"
              style={{ background: 'var(--cream)', border: '1.5px solid #c4973a' }}
            >
              <p className="font-semibold mb-2">Önemli</p>
              <p className="opacity-90">
                Site&apos;deki tüm içerik — test sonuçları, mizaç profilleri, bitki, beslenme ve yaşam önerileri,
                danışman yanıtları ve ücretli rapor dâhil — <strong>eğitim ve kişisel farkındalık amaçlıdır</strong>.
                Hiçbiri tıbbi teşhis, tedavi, reçete veya psikolojik danışmanlık niteliği taşımaz; hekim,
                diyetisyen, psikolog veya eczacı değerlendirmesinin yerine geçmez.
              </p>
            </div>
            <ul className="space-y-2 opacity-80 pl-4">
              {[
                'Bir sağlık şikâyetiniz varsa yetkili bir sağlık kuruluşuna başvurun.',
                'Reçeteli tedavinizi Site’deki bilgilere dayanarak bırakmayın, değiştirmeyin veya dozunu ayarlamayın.',
                'Bitkisel ürünler ilaçlarla etkileşime girebilir; kullanmadan önce hekiminize veya eczacınıza danışın.',
                'Hamilelik, emzirme, kronik hastalık ve çocuklarda önerileri mutlaka bir hekimin onayıyla değerlendirin.',
                'Acil durumlarda 112’yi arayın; danışmanla sohbet etmeyin.',
              ].map((item) => (
                <li key={item}>✦ {item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-base mb-3" style={{ color: 'var(--earth)' }}>4. Kullanıcının Sorumlulukları</h2>
            <ul className="space-y-2 opacity-80 pl-4">
              {[
                'Site 18 yaş ve üzeri kullanıcılar için tasarlanmıştır; daha küçükseniz veli veya vasi gözetiminde kullanın.',
                'Teste verdiğiniz yanıtların ve satın alma sırasında girdiğiniz bilgilerin doğruluğundan siz sorumlusunuz; yanlış yanıt yanlış bir mizaç sonucu üretir.',
                'Danışmana kimlik numarası, adres, ayrıntılı sağlık geçmişi gibi hassas bilgiler yazmayın.',
                'Site’yi hukuka aykırı bir amaçla, başkalarının haklarını ihlal edecek biçimde veya başka kişiler hakkında teşhis koymak için kullanmayın.',
                'Otomatik araçlarla toplu istek göndermek, hız sınırlarını aşmaya çalışmak, kaynak kodu veya API’leri tersine mühendislikle çözmek yasaktır.',
                'Ücretli raporunuzun indirme bağlantısı size özeldir; başkalarıyla paylaşmayın.',
              ].map((item) => (
                <li key={item}>✦ {item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-base mb-3" style={{ color: 'var(--earth)' }}>5. Fikri Mülkiyet</h2>
            <p className="opacity-80 mb-3">
              Site&apos;deki metinler, görseller, test soruları ve puanlama mantığı, mizaç profilleri, tasarım ve
              ücretli raporlar mizac.xyz&apos;e aittir ve 5846 sayılı Fikir ve Sanat Eserleri Kanunu kapsamında
              korunur. İçeriğin dayandığı <em>Varlığın Tahlili</em>{' '}adlı eserin hakları yazarı Zeynep Işık
              Büyükbay&apos;a aittir.
            </p>
            <ul className="space-y-2 opacity-80 pl-4">
              {[
                'İçeriği kişisel ve ticari olmayan amaçlarla okuyabilir, kaynak ve bağlantı göstererek alıntılayabilir veya paylaşabilirsiniz.',
                'İçeriğin izinsiz kopyalanması, çoğaltılması; kurs, kitap, uygulama veya başka bir sitede yeniden yayımlanması yasaktır.',
                'Site içeriğinin yapay zekâ modeli eğitmek amacıyla toplu olarak kazınması (scraping) izne tabidir.',
                'Satın alınan PDF rapor kişisel kullanım içindir; çoğaltılamaz, satılamaz veya dağıtılamaz.',
              ].map((item) => (
                <li key={item}>✦ {item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-base mb-3" style={{ color: 'var(--earth)' }}>6. Ödeme, Teslimat ve İade</h2>
            <div className="space-y-3 opacity-80">
              <div className="rounded-xl p-4" style={{ background: 'var(--cream)' }}>
                <p className="font-semibold mb-1">Ürün ve ödeme</p>
                <p>
                  Site&apos;de satılan tek ürün, tek seferlik ödemeyle alınan <strong>Derin Mizaç Raporu</strong>
                  {' '}(PDF) hizmetidir. Güncel fiyat satın alma ekranında gösterilir. Ödemeler{' '}
                  <strong>Lemon Squeezy</strong>{' '}altyapısı üzerinden alınır; kart bilgileriniz Site&apos;ye
                  ulaşmaz ve Site tarafından saklanmaz. Fatura ve vergi işlemleri, kayıtlı satıcı (merchant of
                  record) sıfatıyla Lemon Squeezy tarafından yürütülür.
                </p>
              </div>
              <div className="rounded-xl p-4" style={{ background: 'var(--cream)' }}>
                <p className="font-semibold mb-1">Teslimat</p>
                <p>
                  Ödeme onaylandıktan sonra raporunuzun indirme bağlantısı birkaç dakika içinde, satın alma
                  sırasında verdiğiniz e-posta adresine gönderilir. Bağlantı <strong>7 gün</strong> geçerlidir.
                  E-posta ulaşmazsa önce spam klasörünüze bakın, sonra bize yazın; bağlantıyı yeniler veya
                  raporu yeniden göndeririz.
                </p>
              </div>
              <div className="rounded-xl p-4" style={{ background: 'var(--cream)' }}>
                <p className="font-semibold mb-1">Cayma hakkı ve iade</p>
                <p className="mb-2">
                  Rapor, elektronik ortamda anında teslim edilen gayrimaddi bir dijital üründür. Mesafeli
                  Sözleşmeler Yönetmeliği&apos;nin cayma hakkının istisnalarını düzenleyen hükmü uyarınca, teslim
                  gerçekleştikten sonra cayma hakkı kural olarak kullanılamaz.
                </p>
                <p>
                  Buna rağmen, aşağıdaki durumlarda satın alma tarihinden itibaren <strong>14 gün</strong> içinde
                  başvurmanız hâlinde ücretinizi koşulsuz iade ediyoruz: rapor hiç ulaşmadıysa, dosya açılmıyorsa
                  veya yanlış mizaç için üretilmişse. Talebinizi{' '}
                  <a href="mailto:destek@mizac.xyz" style={{ color: 'var(--earth)' }}>destek@mizac.xyz</a>{' '}
                  adresine iletin; iade, ödemeyi yaptığınız yönteme yapılır.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-bold text-base mb-3" style={{ color: 'var(--earth)' }}>7. Sorumluluğun Sınırı</h2>
            <p className="opacity-80 mb-3">
              Site &laquo;olduğu gibi&raquo; sunulur. Kesintisiz, hatasız veya her zaman güncel olacağı taahhüt
              edilmez. Özellikle Mizaç Danışmanı, üçüncü taraf sunucu ve ağ altyapısına bağlı olduğundan zaman
              zaman yanıt vermeyebilir.
            </p>
            <ul className="space-y-2 opacity-80 pl-4">
              {[
                'Site’deki bilgilere dayanarak aldığınız sağlık, beslenme, kariyer veya ilişki kararlarının sonucundan Site sorumlu değildir.',
                'Yapay zekâ danışmanının ürettiği yanlış veya eksik bilgiden doğan zararlarda sorumluluk kabul edilmez.',
                'Site’den verilen dış bağlantıların içeriğinden ilgili site sahipleri sorumludur.',
                'Her hâlükârda toplam sorumluluk, ilgili ürün için ödediğiniz tutarı aşmaz.',
              ].map((item) => (
                <li key={item}>✦ {item}</li>
              ))}
            </ul>
            <p className="opacity-80 mt-3">
              Bu sınırlamalar, tüketici mevzuatının emredici hükümlerinin tanıdığı hakları ortadan kaldırmaz.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-base mb-3" style={{ color: 'var(--earth)' }}>8. Hizmette Değişiklik ve Erişimin Askıya Alınması</h2>
            <p className="opacity-80">
              Site&apos;deki sayfaları, testi, danışmanı ve ücretli ürünü önceden bildirimde bulunmaksızın
              değiştirme, geçici olarak durdurma veya tamamen kaldırma hakkımız saklıdır. Bu koşulları ihlal eden
              ya da altyapıya zarar veren kullanımlarda erişimi kısıtlayabiliriz. Ücretini ödediğiniz ancak henüz
              teslim edilmemiş bir hizmet kaldırılırsa, bedeli iade edilir.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-base mb-3" style={{ color: 'var(--earth)' }}>9. Koşullardaki Değişiklikler</h2>
            <p className="opacity-80">
              Bu Kullanım Koşulları zaman zaman güncellenebilir. Yürürlükteki sürüm her zaman bu sayfada yayımlanır
              ve başlığın altındaki &laquo;Son güncelleme&raquo; tarihi değiştirilir. Değişiklikten sonra Site&apos;yi
              kullanmaya devam etmeniz güncel koşulları kabul ettiğiniz anlamına gelir. Bu sayfayı arada bir
              gözden geçirmenizi öneririz.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-base mb-3" style={{ color: 'var(--earth)' }}>10. Uygulanacak Hukuk</h2>
            <p className="opacity-80">
              Bu koşullara Türkiye Cumhuriyeti hukuku uygulanır. Doğabilecek uyuşmazlıklarda, parasal sınırlara
              göre Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri yetkilidir.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-base mb-3" style={{ color: 'var(--earth)' }}>11. İletişim</h2>
            <p className="opacity-80">
              Bu koşullar, siparişiniz veya iade talebiniz hakkında sorularınız için:{' '}
              <a href="mailto:destek@mizac.xyz" style={{ color: 'var(--earth)' }}>destek@mizac.xyz</a>.
              Kişisel verilerinizin nasıl işlendiğini{' '}
              <Link href="/gizlilik" style={{ color: 'var(--earth)' }}>Gizlilik Politikası</Link>{' '}
              sayfasında bulabilirsiniz.
            </p>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t flex flex-wrap gap-x-6 gap-y-2" style={{ borderColor: 'var(--gold-light)' }}>
          <Link href="/" className="text-sm opacity-50 hover:opacity-100 transition-opacity" style={{ color: 'var(--earth)' }}>
            ← Ana Sayfaya Dön
          </Link>
          <Link href="/gizlilik" className="text-sm opacity-50 hover:opacity-100 transition-opacity" style={{ color: 'var(--earth)' }}>
            Gizlilik Politikası
          </Link>
        </div>

      </div>
    </main>
  );
}
