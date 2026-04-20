interface Props {
  current: 1 | 2 | 3;
  color: string;
}

export default function StageHeader({ current, color }: Props) {
  return (
    <div
      style={{
        padding: '20px 28px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      {[1, 2, 3].map((n) => (
        <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: n <= current ? color : '#E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              fontWeight: 800,
              color: n <= current ? '#FFFFFF' : '#A0AEC0',
              transition: 'all 0.3s',
              flexShrink: 0,
            }}
          >
            {n < current ? '✓' : n}
          </div>
          {n < 3 && (
            <div
              style={{
                width: 32,
                height: 4,
                borderRadius: 2,
                background: n < current ? color : '#E2E8F0',
                transition: 'background 0.3s',
              }}
            />
          )}
        </div>
      ))}
      <span style={{ marginLeft: 'auto', fontSize: 16, color: '#718096', fontWeight: 600 }}>
        {current}/3 단계
      </span>
    </div>
  );
}
