import { ImageResponse } from 'next/og';
import { OgStar } from '@/lib/og-star';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #c4973a 0%, #8b5e1e 100%)',
          borderRadius: 40,
        }}
      >
        <OgStar size={110} color="white" />
      </div>
    ),
    { ...size }
  );
}
