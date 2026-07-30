import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useDatabase } from '@nozbe/watermelondb/react';
import { THEMES, hexToRgba, DEFAULT_THEME_KEY } from '../themes/theme';
import { AVATARS } from '../constants/avatars';
import { apiClient } from '../services/apiClient';
import { saveSession } from '../services/sessionService';
import { saveSecurityMethod, savePin } from '../services/authService';
import { creerCyclesInitiaux } from '../db/services/cycleService';
import { useSignupDraftStore } from '../store/signupDraftStore';
import { useAuthStore } from '../store/authStore';
import ArrowButton from '../components/ArrowButton';

type Props = { onAlreadyExists: (email: string) => void };

export default function ConnexionScreen({ onAlreadyExists }: Props) {
  const t = THEMES[DEFAULT_THEME_KEY];
  const muted = hexToRgba(t.headerText, 0.65);
  const database = useDatabase();

  const draft = useSignupDraftStore();
  const { setProfile, setDeviceStatus, unlock } = useAuthStore();

  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [accountExists, setAccountExists] = useState(false);

  const finalize = async (accessToken: string, refreshToken: string, userId: string) => {
    try {
      await apiClient.put(
        '/profil',
        {
          prenom: draft.prenom,
          age: Number(draft.age),
          taille: draft.taille ? Number(draft.taille) : undefined,
          poids: draft.poids ? Number(draft.poids) : undefined,
          avatar: draft.avatarIndex,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
    } catch (profilErr) {
      console.warn('Échec de la mise à jour du profil après inscription :', profilErr);
    }

    await saveSession({
      access_token: accessToken,
      refresh_token: refreshToken,
      user: { id: userId, email: draft.email },
      prenom: draft.prenom,
      avatarIndex: draft.avatarIndex,
    });

    if (draft.securityMethod && draft.securityMethod !== 'none') {
      await saveSecurityMethod(draft.securityMethod);
      if (draft.securityMethod === 'pin') {
        await savePin(draft.pinDraft);
      }
    } else {
      await saveSecurityMethod('none');
    }

    if (draft.cycleData) {
      await creerCyclesInitiaux(database, {
        lastPeriodStart: new Date(draft.cycleData.lastPeriodStart),
        previousPeriodStart: new Date(draft.cycleData.previousPeriodStart),
        cycleLength: draft.cycleData.cycleLength,
        bleedLength: draft.cycleData.bleedLength,
        regular: draft.cycleData.regular,
      });
    }

    setProfile(draft.prenom, draft.avatarIndex, draft.email);
    setDeviceStatus('hasAccount');
    unlock();
    draft.reset();
  };

  const handleSubmit = async () => {
    if (password !== draft.password) {
      setError('Mot de passe incorrect.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await apiClient.post('/auth/register', {
        email: draft.email,
        password: draft.password,
      });

      const loginRes = await apiClient.post('/auth/login', {
        email: draft.email,
        password: draft.password,
      });

      await finalize(
        loginRes.data.session.access_token,
        loginRes.data.session.refresh_token,
        loginRes.data.user.id
      );
    } catch (err: any) {
      const message: string = err?.response?.data?.error || '';

      if (message.toLowerCase().includes('already')) {
        // Un compte existe déjà pour cet email — plutôt que de deviner en
        // coulisses, on l'oriente clairement vers l'écran Connexion classique.
        setAccountExists(true);
        setLoading(false);
        return;
      }

      setError(message || 'Une erreur est survenue. Réessaie.');
      setLoading(false);
    }
  };

  if (accountExists) {
    return (
      <View style={[styles.container, { backgroundColor: t.header }]}>
        <Text style={[styles.greeting, { color: t.headerText, textAlign: 'center' }]}>
          Un compte existe déjà avec cet email
        </Text>
        <Text style={[styles.subtitle, { color: muted, marginBottom: 24 }]}>
          Utilise "Se connecter" pour accéder à ce compte existant sur cet appareil.
        </Text>
        <ArrowButton
          label="Aller à Se connecter"
          onPress={() => onAlreadyExists(draft.email)}
          bgColor={t.accent}
          textColor={t.accentText}
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={[styles.container, { backgroundColor: t.header }]}>
        <View style={styles.avatarWrap}>
          <View style={[styles.avatarCircle, { backgroundColor: t.accent }]}>
            <Text style={{ fontSize: 32 }}>{AVATARS[draft.avatarIndex]}</Text>
          </View>
          <Text style={[styles.greeting, { color: t.headerText }]}>Bonjour, {draft.prenom}</Text>
          <Text style={[styles.subtitle, { color: muted }]}>
            Confirme ton mot de passe pour finaliser ton compte
          </Text>
        </View>

        <View style={styles.field}>
          <View style={styles.pwWrap}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPw}
              placeholder="Mot de passe"
              placeholderTextColor={muted}
              style={[
                styles.input,
                { backgroundColor: hexToRgba(t.headerText, 0.08), borderColor: hexToRgba(t.headerText, 0.16), color: t.headerText },
              ]}
            />
            <TouchableOpacity onPress={() => setShowPw((s) => !s)} style={styles.pwIconTouch} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              {showPw ? <EyeOff size={16} color={muted} /> : <Eye size={16} color={muted} />}
            </TouchableOpacity>
          </View>
        </View>

        {error ? <Text style={{ color: t.accent2, fontSize: 12 }}>{error}</Text> : null}

        <ArrowButton
          label={loading ? 'Vérification...' : 'Se connecter'}
          onPress={handleSubmit}
          disabled={!password}
          loading={loading}
          bgColor={t.accent}
          textColor={t.accentText}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 20 },
  avatarWrap: { alignItems: 'center', gap: 8, marginBottom: 8 },
  avatarCircle: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  greeting: { fontSize: 22, fontStyle: 'italic' },
  subtitle: { fontSize: 11, textAlign: 'center', paddingHorizontal: 20 },
  field: { width: '100%' },
  pwWrap: { flexDirection: 'row', alignItems: 'center', position: 'relative' },
  input: { flex: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, borderWidth: 1, fontSize: 14 },
  pwIconTouch: { position: 'absolute', right: 10, padding: 4 },
});