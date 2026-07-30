import { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withDelay, Easing,
} from 'react-native-reanimated';
import { THEMES, hexToRgba, DEFAULT_THEME_KEY } from '../themes/theme';
import Starfield from '../components/Starfield';

type Props = {
  showButtons: boolean; // true si aucun compte sur l'appareil
  onSplashDone: () => void;
  onGoSignup: () => void;
  onGoLogin: () => void;
};

const WORD = 'Luna';

export default function SplashScreen({ showButtons, onSplashDone, onGoSignup, onGoLogin }: Props) {
  const t = THEMES[DEFAULT_THEME_KEY];
  const muted = hexToRgba(t.headerText, 0.65);

  const merge = useSharedValue(0);
  const wordmarkOpacity = useSharedValue(0);
  const sloganOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);

  useEffect(() => {
    merge.value = withTiming(1, { duration: 950, easing: Easing.out(Easing.cubic) });
    wordmarkOpacity.value = withDelay(1000, withTiming(1, { duration: 400 }));
    sloganOpacity.value = withDelay(1600, withTiming(1, { duration: 400 }));
    if (showButtons) {
      buttonOpacity.value = withDelay(2200, withTiming(1, { duration: 400 }));
    } else {
      const timer = setTimeout(onSplashDone, 2400);
      return () => clearTimeout(timer);
    }
  }, []);

  const sunStyle = useAnimatedStyle(() => ({ transform: [{ translateX: 130 - merge.value * 130 }] }));
  const moonStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -130 + merge.value * 150 }, { translateY: merge.value * 6 }],
  }));
  const wordmarkStyle = useAnimatedStyle(() => ({ opacity: wordmarkOpacity.value }));
  const sloganStyle = useAnimatedStyle(() => ({ opacity: sloganOpacity.value }));
  const buttonStyle = useAnimatedStyle(() => ({ opacity: buttonOpacity.value }));

  return (
    <View style={[styles.container, { backgroundColor: t.header }]}>
      <Starfield count={30} color={hexToRgba(t.accent2, 0.7)} gold={t.accent} />
      <View style={styles.eclipseWrap}>
        <Animated.View style={[styles.sun, sunStyle, { backgroundColor: t.accent, shadowColor: t.accent }]} />
        <Animated.View style={[styles.moon, moonStyle]} />
      </View>
      <Animated.View style={[styles.wordmarkRow, wordmarkStyle]}>
        {WORD.split('').map((letter, i) => (
          <Text key={i} style={[styles.wordmark, { color: t.headerText }]}>{letter}</Text>
        ))}
      </Animated.View>
      <Animated.Text style={[styles.slogan, sloganStyle, { color: muted }]}>
        UNE FEMME, UN CYCLE, UN UNIVERS QUI L'ÉCOUTE
      </Animated.Text>
      {showButtons && (
        <Animated.View style={[styles.buttonWrap, buttonStyle]}>
          <TouchableOpacity onPress={onGoSignup} style={[styles.primaryButton, { backgroundColor: t.accent }]}>
            <Text style={{ color: t.accentText, fontWeight: '600', fontSize: 14 }}>Inscription</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onGoLogin} style={styles.secondaryButton}>
            <Text style={{ color: t.headerText, fontWeight: '600', fontSize: 14 }}>Se connecter</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 24 },
  eclipseWrap: { width: 128, height: 128, alignItems: 'center', justifyContent: 'center' },
  sun: { position: 'absolute', width: 100, height: 100, borderRadius: 50, shadowOpacity: 0.5, shadowRadius: 30, elevation: 10 },
  moon: { position: 'absolute', width: 92, height: 92, borderRadius: 46, backgroundColor: '#0A0712' },
  wordmarkRow: { flexDirection: 'row' },
  wordmark: { fontSize: 44, fontStyle: 'italic', fontWeight: '600' },
  slogan: { fontSize: 11, letterSpacing: 3, textAlign: 'center' },
  buttonWrap: { width: '100%', marginTop: 12, gap: 10 },
  primaryButton: { width: '100%', paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  secondaryButton: { width: '100%', paddingVertical: 14, borderRadius: 14, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(247,233,215,0.3)' },
});