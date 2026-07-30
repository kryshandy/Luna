import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { THEMES, hexToRgba, DEFAULT_THEME_KEY } from '../themes/theme';
import { apiClient } from '../services/apiClient';
import ArrowButton from '../components/ArrowButton';

type Props = { onDone: () => void };
type Stage = 'email' | 'otp';

export default function ForgotPasswordScreen({ onDone }: Props) {
  const t = THEMES[DEFAULT_THEME_KEY];
  const muted = hexToRgba(t.headerText, 0.65);

  const [stage, setStage] = useState<Stage>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const sendCode = async () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Adresse email invalide.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await apiClient.post('/auth/forgot-password', { email });
      setStage('otp');
    } catch {
      setStage('otp');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (otp.length !== 6 || newPassword.length < 6) {
      setError('Code à 6 chiffres et mot de passe (6 caractères min.) requis.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await apiClient.post('/auth/reset-password', { email, otp, newPassword });
      onDone();
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Code invalide ou expiré.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={[styles.container, { backgroundColor: t.header }]}>
        <Text style={[styles.title, { color: t.headerText }]}>Mot de passe oublié</Text>

        {stage === 'email' ? (
          <>
            <Text style={[styles.subtitle, { color: muted }]}>
              Entre l'email de ton compte, on t'envoie un code à 6 chiffres.
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="Email du compte"
              placeholderTextColor={muted}
              style={[styles.input, { backgroundColor: hexToRgba(t.headerText, 0.08), borderColor: hexToRgba(t.headerText, 0.16), color: t.headerText }]}
            />
            {error ? <Text style={{ color: t.accent2, fontSize: 12 }}>{error}</Text> : null}
            <ArrowButton label={loading ? 'Envoi...' : 'Envoyer le code'} onPress={sendCode} loading={loading} bgColor={t.accent} textColor={t.accentText} />
          </>
        ) : (
          <>
            <Text style={[styles.subtitle, { color: muted }]}>
              Vérifie ta boîte mail et entre le code reçu, avec ton nouveau mot de passe.
            </Text>
            <TextInput
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={6}
              placeholder="Code à 6 chiffres"
              placeholderTextColor={muted}
              style={[styles.input, { backgroundColor: hexToRgba(t.headerText, 0.08), borderColor: hexToRgba(t.headerText, 0.16), color: t.headerText }]}
            />
            <TextInput
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              placeholder="Nouveau mot de passe"
              placeholderTextColor={muted}
              style={[styles.input, { backgroundColor: hexToRgba(t.headerText, 0.08), borderColor: hexToRgba(t.headerText, 0.16), color: t.headerText }]}
            />
            {error ? <Text style={{ color: t.accent2, fontSize: 12 }}>{error}</Text> : null}
            <ArrowButton label={loading ? 'Validation...' : 'Réinitialiser'} onPress={resetPassword} loading={loading} bgColor={t.accent} textColor={t.accentText} />
          </>
        )}

        <TouchableOpacity onPress={onDone}>
          <Text style={[styles.backLink, { color: muted }]}>← Retour à la connexion</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 14 },
  title: { fontSize: 20, fontStyle: 'italic', marginBottom: 4 },
  subtitle: { fontSize: 11, textAlign: 'center', marginBottom: 6 },
  input: { width: '100%', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, borderWidth: 1, fontSize: 14 },
  backLink: { fontSize: 12, textDecorationLine: 'underline', marginTop: 10 },
});