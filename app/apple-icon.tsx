import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

// iOS disallows transparency in touch icons, so the violet circle sits on
// the site background color instead of transparent corners.
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
          background: '#05030C',
        }}
      >
        <div
          style={{
            width: 156,
            height: 156,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            background: '#6B3FA0',
            color: '#000000',
            fontSize: 124,
            fontWeight: 900,
            // default font tops out at 700; a same-color halo fakes a heavier cut
            textShadow:
              '4px 0 0 #000, -4px 0 0 #000, 0 4px 0 #000, 0 -4px 0 #000, 3px 3px 0 #000, -3px 3px 0 #000, 3px -3px 0 #000, -3px -3px 0 #000',
          }}
        >
          S
        </div>
      </div>
    ),
    size,
  );
}
