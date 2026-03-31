import type { Metadata } from 'next';

const isimler: Record<string, string> = {
  safravi: 'Safravî',
  demevi: 'Demevî',
  balgami: 'Balgamî',
  sevdavi: 'Sevdavî',
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [tipA, tipB] = slug.split('-vs-');
  const a = isimler[tipA] ?? tipA;
  const b = isimler[tipB] ?? tipB;

  return {
    title: `${a} ve ${b} Uyumu · Karşılaştırma`,
    description: `${a} ve ${b} mizaçları arasındaki uyum, güçlü yönler ve zorluklar. İbn-i Sina geleneğiyle ${a} ${b} ilişki analizi.`,
    keywords: [`${tipA} ${tipB} uyumu`, `${tipA} ${tipB} farkı`, `${tipA} ve ${tipB}`, 'mizaç uyumu', 'mizaç karşılaştırma'],
    alternates: { canonical: `https://mizac.xyz/karsilastir/${slug}` },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
