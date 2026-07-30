import { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';

type Props = {
  count?: number;
  color?: string;
  gold?: string;
};

export default function Starfield({ count = 22, color = '#C9A9E0', gold = '#D9A94E' }: Props) {
  const dots = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 2 + 1,
        isGold: Math.random() > 0.6,
      })),
    [count]
  );

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {dots.map((d, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            top: `${d.top}%`,
            left: `${d.left}%`,
            width: d.size,
            height: d.size,
            borderRadius: d.size / 2,
            backgroundColor: d.isGold ? gold : color,
            opacity: 0.7,
          }}
        />
      ))}
    </View>
  );
}