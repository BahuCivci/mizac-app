'use client';

import { useState, useEffect } from 'react';

export function ReadingProgress({ renk }: { renk?: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function update() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0);
    }
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  if (progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 z-50 h-0.5 transition-all duration-100"
      style={{
        width: `${progress}%`,
        background: renk ?? '#c4973a',
      }}
    />
  );
}
