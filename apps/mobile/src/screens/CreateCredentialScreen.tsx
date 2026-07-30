import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { KeyRound, Delete, Fingerprint, Check } from 'lucide-react-native';
import { THEMES, hexToRgba, DEFAULT_THEME_KEY } from '../themes/theme';
import { useSignupDraftStore } from '../store/signupDraftStore';
import { isBiometricAvailable, authenticateWithBiometrics } from '../services/authService';

type Props = { onContinue: () => void };

export default function CreateCredentialScreen({ onContinue }: Props) {
  const t = THEMES[DEFAULT_THEME_KEY];
  const muted = hexToRgba(t.headerText, 0.65);
  const securityMethod = useSignupDraftStore((s) => s.securityMethod);
  const setPinDraft = useSignupDraftStore((s) => s.setPinDraft);

  if (securityMethod === 'pin') {
    return <PinCreationStep t={t} muted={muted} onDone={(pin) => { setPinDraft(pin); onContinue(); }} />;
  }
  if (securityMethod === 'fingerprint') {
    return <FingerprintEnrollStep t={t} muted={muted} onDone={onContinue} />;
  }
  return null;
}

function PinCreationStep({ t, muted, onDone }: { t: any; muted: string; onDone: (pin: string) => void }) {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [stage, setStage] = useState<'first' | 'confirm'>('first');
  const [error, setError] = useState('');

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

  const press = (d: string) => {
    const target = stage === 'first' ? pin : confirmPin;
    if (target.length >= 4) return;
    const next = target + d;

    if (stage === 'first') {
      setPin(next);
      if (next.length === 4) setTimeout(() => setStage('confirm'), 250);
    } else {
      setConfirmPin(next);
      if (next.length === 4) {
        setTimeout(() => {
          if (next === pin) {
            onDone(pin);
          } else {
            setError('Les codes ne correspondent pas, réessaie.');
            setConfirmPin('');
          }
        }, 250);
      }
    }
  };

  const del = () =>
    stage === 'first' ? setPin((p) => p.slice(0, -1)) : setConfirmPin((p) => p.slice(0, -1));

  const activeLength = (stage === 'first' ? pin : confirmPin).length;

  return (
    <View style={[styles.container, { backgroundColor: t.header }]}>
      <KeyRound size={26} color={t.accent} />
      <Text style={[styles.title, { color: t.headerText }]}>
        {stage === 'first' ? 'Choisis ton code' : 'Confirme ton code'}
      </Text>
      <Text style={[styles.subtitle, { color: muted }]}>4 chiffres, faciles à retenir pour toi seule</Text>

      <View style={styles.dotsRow}>
        {[0, 1, 2, 3].map((i) => (
          <View
            key={i}
            style={[styles.dot, { borderColor: t.accent, backgroundColor: i < activeLength ? t.accent : 'transparent' }]}
          />
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
              onPress={() => (k === 'del' ? del() : press(k))}
              style={[styles.key, { backgroundColor: hexToRgba(t.headerText, 0.08), borderColor: hexToRgba(t.headerText, 0.16) }]}
            >
              {k === 'del' ? <Delete size={18} color={t.headerText} /> : <Text style={{ color: t.headerText, fontSize: 18 }}>{k}</Text>}
            </TouchableOpacity>
          )
        )}
      </View>
    </View>
  );
}

function FingerprintEnrollStep({ t, muted, onDone }: { t: any; muted: string; onDone: () => void }) {
  const [scanning, setScanning] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    isBiometricAvailable().then((ok) => {
      if (!ok) setUnavailable(true);
    });
  }, []);

  const scan = async () => {
    if (scanning || enrolled) return;
    setScanning(true);
    const success = await authenticateWithBiometrics();
    setScanning(false);
    if (success) {
      setEnrolled(true);
      setTimeout(onDone, 500);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: t.header }]}>
      <Text style={[styles.title, { color: t.headerText }]}>
        {unavailable
          ? "Empreinte non disponible sur cet appareil"
          : enrolled
          ? 'Empreinte confirmée ✦'
          : 'Confirme ton empreinte'}
      </Text>
      {!unavailable && (
        <Text style={[styles.subtitle, { color: muted }]}>
          Pose ton doigt sur le capteur pour valider ce mode de déverrouillage
        </Text>
      )}

      {unavailable ? (
        <Text style={[styles.subtitle, { color: muted, marginTop: 12 }]}>
          Aucun capteur biométrique configuré. Reviens à l'étape précédente pour choisir le code PIN à la place.
        </Text>
      ) : (
        <TouchableOpacity
          onPress={scan}
          style={[
            styles.fpButton,
            { backgroundColor: enrolled ? t.accent : hexToRgba(t.headerText, 0.08), borderColor: hexToRgba(t.headerText, 0.2) },
          ]}
        >
          <Fingerprint size={44} color={enrolled ? t.accentText : t.accent} />
        </TouchableOpacity>
      )}

      {enrolled && <Check size={18} color={t.accent} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, paddingHorizontal: 32 },
  title: { fontSize: 20, fontStyle: 'italic', textAlign: 'center' },
  subtitle: { fontSize: 11, textAlign: 'center' },
  dotsRow: { flexDirection: 'row', gap: 12 },
  dot: { width: 12, height: 12, borderRadius: 6, borderWidth: 1 },
  keypad: { flexDirection: 'row', flexWrap: 'wrap', width: 224, gap: 16, justifyContent: 'center' },
  key: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  fpButton: { width: 112, height: 112, borderRadius: 56, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
});