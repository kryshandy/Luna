import { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Delete, Fingerprint } from 'lucide-react-native';
import { THEMES, hexToRgba, DEFAULT_THEME_KEY } from '../themes/theme';
import { AVATARS } from '../constants/avatars';
import { verifyPin, authenticateWithBiometrics } from '../services/authService';
import { useAuthStore } from '../store/authStore';

export default function SecurityUnlockScreen() {
  const t = THEMES[DEFAULT_THEME_KEY];
  const muted = hexToRgba(t.headerText, 0.65);
  const { prenom, avatarIndex, securityMethod, unlock } = useAuthStore();

  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const tryBiometric = useCallback(async () => {
    const success = await authenticateWithBiometrics();
    if (success) unlock();
  }, [unlock]);

  useEffect(() => {
    if (securityMethod === 'fingerprint') tryBiometric();
  }, [securityMethod, tryBiometric]);

  const pressDigit = async (d: string) => {
    if (pin.length >= 4) return;
    const next = pin + d;
    setPin(next);
    if (next.length === 4) {
      const valid = await verifyPin(next);
      if (valid) {
        unlock();
      } else {
        setError('Code incorrect, réessaie.');
        setTimeout(() => { setPin(''); setError(''); }, 600);
      }
    }
  };

  const deleteDigit = () => setPin((p) => p.slice(0, -1));
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

  return (
    <View style={[styles.container, { backgroundColor: t.header }]}>
      <View style={styles.avatarWrap}>
        <View style={[styles.avatarCircle, { backgroundColor: t.accent }]}>
          <Text style={{ fontSize: 32 }}>{AVATARS[avatarIndex]}</Text>
        </View>
        <Text style={[styles.greeting, { color: t.headerText }]}>Bonjour, {prenom}</Text>
        <Text style={[styles.subtitle, { color: muted }]}>Contente de te revoir</Text>
      </View>

      {securityMethod === 'fingerprint' ? (
        <View style={styles.centerBlock}>
          <TouchableOpacity onPress={tryBiometric} style={[styles.fpButton, { backgroundColor: t.accent }]}>
            <Fingerprint size={38} color={t.accentText} />
          </TouchableOpacity>
          <Text style={[styles.hint, { color: muted }]}>Pose ton doigt pour déverrouiller</Text>
        </View>
      ) : (
        <View style={styles.centerBlock}>
          <View style={styles.dotsRow}>
            {[0, 1, 2, 3].map((i) => (
              <View key={i} style={[styles.dot, { borderColor: t.accent, backgroundColor: i < pin.length ? t.accent : 'transparent' }]} />
            ))}
          </View>
          {error ? <Text style={{ color: t.accent2, fontSize: 12 }}>{error}</Text> : null}
          <View style={styles.keypad}>
            {keys.map((k, i) =>
              k === '' ? (
                <View key={i} style={styles.key} />
              ) : (
                <TouchableOpacity
                  key={i}
                  onPress={() => (k === 'del' ? deleteDigit() : pressDigit(k))}
                  style={[styles.key, { backgroundColor: hexToRgba(t.headerText, 0.08), borderColor: hexToRgba(t.headerText, 0.16) }]}
                >
                  {k === 'del' ? <Delete size={18} color={t.headerText} /> : <Text style={{ color: t.headerText, fontSize: 18 }}>{k}</Text>}
                </TouchableOpacity>
              )
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 28 },
  avatarWrap: { alignItems: 'center', gap: 8 },
  avatarCircle: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  greeting: { fontSize: 22, fontStyle: 'italic' },
  subtitle: { fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' },
  centerBlock: { alignItems: 'center', gap: 16 },
  fpButton: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center' },
  hint: { fontSize: 11 },
  dotsRow: { flexDirection: 'row', gap: 12 },
  dot: { width: 12, height: 12, borderRadius: 6, borderWidth: 1 },
  keypad: { flexDirection: 'row', flexWrap: 'wrap', width: 224, gap: 16, justifyContent: 'center' },
  key: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
});