import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { THEMES, hexToRgba, DEFAULT_THEME_KEY } from '../themes/theme';
import { apiClient } from '../services/apiClient';
import { saveSession } from '../services/sessionService';
import { saveSecurityMethod } from '../services/authService';
import { useAuthStore } from '../store/authStore';
import ArrowButton from '../components/ArrowButton';

type Props = {
  prefillEmail?: string;
  onGoSignup: () => void;
  onGoForgotPassword: (email: string) => void;
};

export default function LoginScreen({ prefillEmail, onGoSignup, onGoForgotPassword }: Props) {
  const t = THEMES[DEFAULT_THEME_KEY];
  const muted = hexToRgba(t.headerText, 0.65);
  const { setProfile, setDeviceStatus, setSecurityMethod, unlock } = useAuthStore();

  const [email, setEmail] = useState(prefillEmail || '');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Email et mot de passe sont requis.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const loginRes = await apiClient.post('/auth/login', { email, password });
      const accessToken = loginRes.data.session.access_token;
      const refreshToken = loginRes.data.session.refresh_token;
      const userId = loginRes.data.user.id;

      // Récupère le profil existant (prénom, avatar...) — ce compte existe déjà,
      // contrairement au parcours d'inscription où on venait de le créer.
      let prenom = '';
      let avatarIndex = 9;
      try {
        const profilRes = await apiClient.get('/profil', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        prenom = profilRes.data.profil?.prenom || '';
        avatarIndex = profilRes.data.profil?.avatar ?? 9;
      } catch (profilErr) {
        console.warn('Impossible de récupérer le profil après connexion :', profilErr);
      }

      await saveSession({
        access_token: accessToken,
        refresh_token: refreshToken,
        user: { id: userId, email },
        prenom,
        avatarIndex,
      });

      // Nouvel appareil : aucune méthode de sécurité locale configurée pour
      // l'instant — l'utilisatrice pourra en choisir une plus tard dans Réglages.
      await saveSecurityMethod('none');
      setSecurityMethod('none');

      setProfile(prenom, avatarIndex, email);
      setDeviceStatus('hasAccount');
      unlock();
    } catch (err: any) {
      const message = err?.response?.data?.error || 'Email ou mot de passe incorrect.';
      setError(message);
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={[styles.container, { backgroundColor: t.header }]}>
        <View style={styles.headerBlock}>
          <Text style={[styles.title, { color: t.headerText }]}>Bon retour ✦</Text>
          <Text style={[styles.subtitle, { color: muted }]}>Connecte-toi à ton compte Luna</Text>
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: muted }]}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={[styles.input, { backgroundColor: hexToRgba(t.headerText, 0.08), borderColor: hexToRgba(t.headerText, 0.16), color: t.headerText }]}
          />
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: muted }]}>Mot de passe</Text>
          <View style={styles.pwWrap}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPw}
              style={[styles.input, { flex: 1, backgroundColor: hexToRgba(t.headerText, 0.08), borderColor: hexToRgba(t.headerText, 0.16), color: t.headerText }]}
            />
            <TouchableOpacity onPress={() => setShowPw((s) => !s)} style={styles.pwIconTouch} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              {showPw ? <EyeOff size={16} color={muted} /> : <Eye size={16} color={muted} />}
            </TouchableOpacity>
          </View>
        </View>

        {error ? <Text style={{ color: t.accent2, fontSize: 12 }}>{error}</Text> : null}

        <ArrowButton
          label={loading ? 'Connexion...' : 'Se connecter'}
          onPress={handleSubmit}
          disabled={!email || !password}
          loading={loading}
          bgColor={t.accent}
          textColor={t.accentText}
        />

        <TouchableOpacity onPress={() => onGoForgotPassword(email)}>
          <Text style={[styles.link, { color: muted }]}>Mot de passe oublié ?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onGoSignup}>
          <Text style={[styles.link, { color: muted }]}>Pas encore de compte ? S'inscrire</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 14 },
  headerBlock: { alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 22, fontStyle: 'italic' },
  subtitle: { fontSize: 12, marginTop: 4 },
  field: { width: '100%' },
  label: { fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 },
  input: { borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, borderWidth: 1, fontSize: 14 },
  pwWrap: { flexDirection: 'row', alignItems: 'center', position: 'relative' },
  pwIconTouch: { position: 'absolute', right: 10, padding: 4 },
  link: { fontSize: 12, textDecorationLine: 'underline', marginTop: 4 },
});