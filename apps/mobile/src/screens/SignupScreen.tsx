import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { THEMES, hexToRgba, DEFAULT_THEME_KEY } from '../themes/theme';
import { AVATARS, DEFAULT_AVATAR_INDEX } from '../constants/avatars';
import { useSignupDraftStore } from '../store/signupDraftStore';
import ArrowButton from '../components/ArrowButton';

type Props = { onContinue: () => void };

const AVATAR_COLUMNS = 6;

export default function SignupScreen({ onContinue }: Props) {
  const t = THEMES[DEFAULT_THEME_KEY];
  const muted = hexToRgba(t.headerText, 0.65);
  const setProfileDraft = useSignupDraftStore((s) => s.setProfileDraft);

  const [avatarIndex, setAvatarIndex] = useState(DEFAULT_AVATAR_INDEX);
  const [prenom, setPrenom] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [taille, setTaille] = useState('');
  const [poids, setPoids] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!prenom || !age || !email || !password) {
      setError('Prénom, âge, email et mot de passe sont requis.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Adresse email invalide.');
      return;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    setError('');
    setProfileDraft({ prenom, age, email, taille, poids, avatarIndex, password });
    onContinue();
  };

  return (
    <ScrollView
      style={{ backgroundColor: t.header }}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.headerBlock}>
        <Text style={[styles.title, { color: t.headerText }]}>Bienvenue sur Luna ✦</Text>
        <Text style={[styles.subtitle, { color: muted }]}>Crée ton espace personnel</Text>
      </View>

      <Text style={[styles.label, { color: muted }]}>Choisis ton avatar</Text>
      <View style={styles.avatarGrid}>
        {AVATARS.map((a, i) => (
          <View key={a} style={{ width: `${100 / AVATAR_COLUMNS}%`, padding: 4 }}>
            <TouchableOpacity
              onPress={() => setAvatarIndex(i)}
              style={[
                styles.avatarCell,
                {
                  backgroundColor: i === avatarIndex ? hexToRgba(t.accent, 0.35) : hexToRgba(t.accent, 0.14),
                  borderColor: i === avatarIndex ? t.accent : 'transparent',
                },
              ]}
            >
              <Text style={{ fontSize: 18 }}>{a}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {[
        { label: 'Prénom *', value: prenom, set: setPrenom, keyboard: 'default' as const },
        { label: 'Âge *', value: age, set: setAge, keyboard: 'numeric' as const },
        { label: 'Email *', value: email, set: setEmail, keyboard: 'email-address' as const },
        { label: 'Taille (cm)', value: taille, set: setTaille, keyboard: 'numeric' as const },
        { label: 'Poids (kg)', value: poids, set: setPoids, keyboard: 'numeric' as const },
      ].map((f) => (
        <View key={f.label} style={styles.field}>
          <Text style={[styles.label, { color: muted }]}>{f.label}</Text>
          <TextInput
            value={f.value}
            onChangeText={f.set}
            keyboardType={f.keyboard}
            autoCapitalize={f.label === 'Email *' ? 'none' : 'sentences'}
            style={[
              styles.input,
              { backgroundColor: hexToRgba(t.headerText, 0.08), borderColor: hexToRgba(t.headerText, 0.16), color: t.headerText },
            ]}
          />
        </View>
      ))}

      <View style={styles.field}>
        <Text style={[styles.label, { color: muted }]}>Mot de passe du compte *</Text>
        <View style={styles.pwWrap}>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPw}
            style={[
              styles.input,
              { flex: 1, backgroundColor: hexToRgba(t.headerText, 0.08), borderColor: hexToRgba(t.headerText, 0.16), color: t.headerText },
            ]}
          />
          <TouchableOpacity onPress={() => setShowPw((s) => !s)} style={styles.pwIconTouch} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            {showPw ? <EyeOff size={16} color={muted} /> : <Eye size={16} color={muted} />}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.field}>
        <Text style={[styles.label, { color: muted }]}>Confirme le mot de passe *</Text>
        <View style={styles.pwWrap}>
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showPw}
            style={[
              styles.input,
              { flex: 1, backgroundColor: hexToRgba(t.headerText, 0.08), borderColor: hexToRgba(t.headerText, 0.16), color: t.headerText },
            ]}
          />
        </View>
      </View>

      {error ? <Text style={{ color: t.accent2, fontSize: 12, marginBottom: 8 }}>{error}</Text> : null}

      <ArrowButton label="Continuer" onPress={handleContinue} bgColor={t.accent} textColor={t.accentText} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingBottom: 140, gap: 4 },
  headerBlock: { alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 22, fontStyle: 'italic', marginBottom: 4 },
  subtitle: { fontSize: 12 },
  label: { fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 },
  avatarGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20, marginHorizontal: -4 },
  avatarCell: { aspectRatio: 1, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5 },
  field: { marginBottom: 14 },
  input: { borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, fontSize: 14 },
  pwWrap: { flexDirection: 'row', alignItems: 'center', position: 'relative' },
  pwIconTouch: { position: 'absolute', right: 10, padding: 4 },
});