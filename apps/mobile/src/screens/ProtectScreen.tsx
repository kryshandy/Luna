import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { KeyRound, Fingerprint, ShieldOff } from 'lucide-react-native';
import { THEMES, hexToRgba, DEFAULT_THEME_KEY } from '../themes/theme';
import { useSignupDraftStore, SecurityMethodDraft } from '../store/signupDraftStore';
import ArrowButton from '../components/ArrowButton';

type Props = { onContinue: (choice: Exclude<SecurityMethodDraft, null>) => void };

const OPTIONS: {
  key: Exclude<SecurityMethodDraft, null>;
  icon: typeof KeyRound;
  title: string;
  desc: string;
}[] = [
  { key: 'pin', icon: KeyRound, title: 'Code PIN', desc: 'Un code à 4 chiffres simple et rapide' },
  { key: 'fingerprint', icon: Fingerprint, title: 'Empreinte digitale', desc: "Déverrouille d'un geste, en toute sécurité" },
  { key: 'none', icon: ShieldOff, title: 'Aucune', desc: "Pas de verrou local — l'app s'ouvre directement" },
];

export default function ProtectScreen({ onContinue }: Props) {
  const t = THEMES[DEFAULT_THEME_KEY];
  const muted = hexToRgba(t.headerText, 0.65);
  const setSecurityMethodDraft = useSignupDraftStore((s) => s.setSecurityMethodDraft);

  const [choice, setChoice] = useState<Exclude<SecurityMethodDraft, null>>('pin');

  const handleContinue = () => {
    setSecurityMethodDraft(choice);
    onContinue(choice);
  };

  return (
    <View style={[styles.container, { backgroundColor: t.header }]}>
      <View style={styles.headerBlock}>
        <Text style={[styles.title, { color: t.accent }]}>Sécurise ton espace ✦</Text>
        <Text style={[styles.subtitle, { color: muted }]}>
          Choisis comment tu veux déverrouiller Luna au quotidien
        </Text>
      </View>

      <View style={styles.optionsList}>
        {OPTIONS.map(({ key, icon: Icon, title, desc }) => {
          const selected = choice === key;
          return (
            <TouchableOpacity
              key={key}
              onPress={() => setChoice(key)}
              style={[
                styles.option,
                {
                  backgroundColor: hexToRgba(t.headerText, 0.05),
                  borderColor: selected ? t.accent : hexToRgba(t.headerText, 0.1),
                  borderWidth: selected ? 1.5 : 1,
                },
              ]}
            >
              <Icon size={18} color={t.accent} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.optionTitle, { color: t.headerText }]}>{title}</Text>
                <Text style={[styles.optionDesc, { color: muted }]}>{desc}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={[styles.hint, { color: muted }]}>
        Ton mot de passe de compte reste toujours nécessaire — ce choix ajoute
        juste un accès rapide sur cet appareil.
      </Text>

      <View style={{ marginTop: 'auto' }}>
        <ArrowButton label="Continuer" onPress={handleContinue} bgColor={t.accent} textColor={t.accentText} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 56 },
  headerBlock: { alignItems: 'center', marginBottom: 28 },
  title: { fontSize: 20, fontStyle: 'italic' },
  subtitle: { fontSize: 11, marginTop: 6, textAlign: 'center', paddingHorizontal: 12 },
  optionsList: { gap: 12 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14, borderRadius: 14 },
  optionTitle: { fontSize: 14 },
  optionDesc: { fontSize: 11, marginTop: 2 },
  hint: { fontSize: 10, textAlign: 'center', marginTop: 20, paddingHorizontal: 8, lineHeight: 15 },
});