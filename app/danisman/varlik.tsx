'use client';

import type { SesDurumu } from './ses';

/**
 * Danışmanın görünür varlığı.
 *
 * Kasıtlı olarak soyut: sahte bir insan yüzü takmıyoruz. Sağlığa değen bir
 * konuda konuşan yapay zekâya gerçek görünümlü bir surat vermek, karşısındakine
 * hekimle konuştuğunu düşündürebilir. Ama ölü bir metin kutusu da değil —
 * dinlerken sakin, konuşurken canlı bir form.
 *
 * Halkalar gerçek ses genliğine göre değil zamana göre oynuyor: `speechSynthesis`
 * ürettiği sesi Web Audio'ya vermiyor, yani genliği okumanın yolu yok. Sahte bir
 * "ses analizi" yazmaktansa dürüst bir nefes ritmi tercih edildi.
 */
export default function Varlik({ durum }: { durum: SesDurumu }) {
  return (
    <div
      className="relative mx-auto mb-5"
      style={{ width: 96, height: 96 }}
      aria-hidden="true"
    >
      <style>{`
        @keyframes mizac-nefes {
          0%, 100% { transform: scale(1);    opacity: .55; }
          50%      { transform: scale(1.06); opacity: .8;  }
        }
        @keyframes mizac-dinle {
          0%   { transform: scale(.8); opacity: .55; }
          100% { transform: scale(1.5); opacity: 0;  }
        }
        @keyframes mizac-konus {
          0%, 100% { transform: scale(1);    opacity: .85; }
          25%      { transform: scale(1.12); opacity: 1;   }
          60%      { transform: scale(.96);  opacity: .7;  }
        }
        /* Hareketin rahatsız ettiği kullanıcılar için: sistem ayarı varsa dur. */
        @media (prefers-reduced-motion: reduce) {
          .mizac-halka { animation: none !important; }
        }
      `}</style>

      {[0, 1, 2].map((i) => {
        const olcu = 96 - i * 22;
        const stil =
          durum === 'dinliyor'
            ? { animation: `mizac-dinle 2.2s ${i * 0.55}s ease-out infinite` }
            : durum === 'konusuyor'
              ? { animation: `mizac-konus ${0.9 + i * 0.25}s ${i * 0.1}s ease-in-out infinite` }
              : { animation: `mizac-nefes ${4 + i}s ${i * 0.4}s ease-in-out infinite` };

        return (
          <span
            key={i}
            className="mizac-halka absolute rounded-full"
            style={{
              width: olcu,
              height: olcu,
              top: (96 - olcu) / 2,
              left: (96 - olcu) / 2,
              border: `1.5px solid #c4973a`,
              ...stil,
            }}
          />
        );
      })}

      <span
        className="absolute rounded-full"
        style={{
          width: 12,
          height: 12,
          top: 42,
          left: 42,
          background: '#c4973a',
          opacity: durum === 'bos' ? 0.5 : 0.9,
          transition: 'opacity .4s',
        }}
      />
    </div>
  );
}
