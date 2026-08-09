import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PDF fontları çalışma anında dosya sisteminden okunuyor; Next'in izleyicisi
  // bunu koddan çıkaramadığı için serverless pakete elle dahil edilmeli.
  outputFileTracingIncludes: {
    '/api/rapor/indir': ['./lib/pdf/fonts/**'],
  },
};

export default nextConfig;
