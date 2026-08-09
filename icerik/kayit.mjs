/**
 * Node çözümleyici kancası.
 *
 * Uygulama kodu Next'in kurallarına göre yazılmış: `@/lib/...` alias'ı ve
 * uzantısız göreli import'lar kullanıyor. Node ESM ikisini de çözemez.
 * Bu kanca üretim scriptleri için ikisini de destekler, böylece uygulama
 * kodunda hiçbir değişiklik gerekmez.
 *
 * Kullanım: node --import ./icerik/kayit.mjs icerik/uret.ts
 */
import { registerHooks } from 'node:module';
import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const KOK = path.resolve(import.meta.dirname, '..');
const UZANTILAR = ['.ts', '.tsx', '/index.ts', '/index.tsx'];

registerHooks({
  resolve(specifier, context, nextResolve) {
    let hedef = specifier;

    // @/... -> proje kökü
    if (hedef.startsWith('@/')) {
      hedef = pathToFileURL(path.join(KOK, hedef.slice(2))).href;
    }

    try {
      return nextResolve(hedef, context);
    } catch (hata) {
      // Uzantısız göreli/mutlak yol olabilir; .ts / .tsx dene
      let taban;
      if (hedef.startsWith('file:')) {
        taban = fileURLToPath(hedef);
      } else if (hedef.startsWith('.') && context.parentURL) {
        taban = path.resolve(path.dirname(fileURLToPath(context.parentURL)), hedef);
      } else {
        throw hata;
      }
      for (const ek of UZANTILAR) {
        if (existsSync(taban + ek)) {
          return nextResolve(pathToFileURL(taban + ek).href, context);
        }
      }
      throw hata;
    }
  },
});
