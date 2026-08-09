import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // OG image'ler satori, PDF raporu @react-pdf/renderer ile render edilir —
  // ikisi de DOM değil ve HTML entity çözmez. Buralarda &apos; / &quot;
  // kullanmak görüntüde düz metin olarak çıkar, o yüzden kural kapalı.
  {
    files: ["app/**/opengraph-image.tsx", "app/**/apple-icon.tsx", "lib/pdf/**"],
    rules: { "react/no-unescaped-entities": "off" },
  },
]);

export default eslintConfig;
