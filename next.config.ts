import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PDF fontları çalışma anında dosya sisteminden okunuyor; Next'in izleyicisi
  // bunu koddan çıkaramadığı için serverless pakete elle dahil edilmeli.
  outputFileTracingIncludes: {
    '/api/rapor/indir': ['./lib/pdf/fonts/**'],
  },

  async redirects() {
    return [
      // Site iki adresten de yayında: mizac.xyz ve Vercel'in varsayılan
      // mizac-app.vercel.app adresi. Canonical etiketleri zaten mizac.xyz'yi
      // gösteriyor ve Google kopyaları dizine eklemiyor ("Doğru standart
      // etikete sahip alternatif sayfa"), ama vercel.app 200 döndüğü sürece
      // taranmaya devam ediyor. Kalıcı yönlendirme o taramayı bitiriyor.
      //
      // Önizleme dağıtımları (*-git-*.vercel.app) kasıtlı olarak dışarıda:
      // onlar test için var ve mizac.xyz'ye yönlenirlerse test edilemezler.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'mizac-app.vercel.app' }],
        destination: 'https://mizac.xyz/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
