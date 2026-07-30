import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Check } from 'lucide-react-native';
import Slider from '@react-native-community/slider';
import { THEMES, hexToRgba, DEFAULT_THEME_KEY } from '../themes/theme';
import { useSignupDraftStore } from '../store/signupDraftStore';
import ArrowButton from '../components/ArrowButton';

type Props = { onContinue: () => void };

export default function CycleSetupScreen({ onContinue }: Props) {
  const t = THEMES[DEFAULT_THEME_KEY];
  const muted = hexToRgba(t.headerText, 0.65);
  const setCycleDraft = useSignupDraftStore((s) => s.setCycleDraft);

  const [lastPeriodStart, setLastPeriodStart] = useState(new Date());
  const [previousPeriodStart, setPreviousPeriodStart] = useState(new Date());
  const [showPickerFor, setShowPickerFor] = useState<'last' | 'previous' | null>(null);
  const [cycleLength, setCycleLength] = useState(28);
  const [bleedLength, setBleedLength] = useState(5);
  const [regular, setRegular] = useState(true);

  const handleContinue = () => {
    setCycleDraft({
      lastPeriodStart: lastPeriodStart.toISOString(),
      previousPeriodStart: previousPeriodStart.toISOString(),
      cycleLength,
      bleedLength,
      regular,
    });
    onContinue();
  };

  const formatDate = (d: Date) =>
    d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <View style={[styles.container, { backgroundColor: t.header }]}>
      <View style={styles.headerBlock}>
        <Text style={[styles.title, { color: t.accent }]}>Ton cycle, ton pouvoir 🌸</Text>
        <Text style={[styles.subtitle, { color: muted }]}>
          Ces données permettent à Luna de te guider avec précision
        </Text>
      </View>

      {[
        { label: 'Premier jour des règles (mois dernier)', value: lastPeriodStart, key: 'last' as const },
        { label: 'Premier jour des règles (mois précédent)', value: previousPeriodStart, key: 'previous' as const },
      ].map((f) => (
        <View key={f.key} style={styles.field}>
          <Text style={[styles.label, { color: muted }]}>{f.label}</Text>
          <TouchableOpacity
            onPress={() => setShowPickerFor(f.key)}
            style={[styles.dateInput, { backgroundColor: hexToRgba(t.headerText, 0.08), borderColor: hexToRgba(t.headerText, 0.16) }]}
          >
            <Text style={{ color: t.headerText, fontSize: 14 }}>{formatDate(f.value)}</Text>
          </TouchableOpacity>
        </View>
      ))}

      {showPickerFor && (
        <DateTimePicker
          value={showPickerFor === 'last' ? lastPeriodStart : previousPeriodStart}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          maximumDate={new Date()}
          onChange={(_, selectedDate) => {
            setShowPickerFor(null);
            if (selectedDate) {
              if (showPickerFor === 'last') setLastPeriodStart(selectedDate);
              else setPreviousPeriodStart(selectedDate);
            }
          }}
        />
      )}

      <View style={styles.field}>
        <View style={styles.sliderLabelRow}>
          <Text style={[styles.label, { color: muted }]}>Durée du cycle</Text>
          <Text style={{ color: t.accent, fontSize: 14 }}>{cycleLength} jours</Text>
        </View>
        <Slider
          minimumValue={21}
          maximumValue={45}
          step={1}
          value={cycleLength}
          onValueChange={setCycleLength}
          minimumTrackTintColor={t.accent}
          maximumTrackTintColor={hexToRgba(t.headerText, 0.2)}
          thumbTintColor={t.accent}
        />
      </View>

      <View style={styles.field}>
        <View style={styles.sliderLabelRow}>
          <Text style={[styles.label, { color: muted }]}>Durée des saignements</Text>
          <Text style={{ color: t.accent, fontSize: 14 }}>{bleedLength} jours</Text>
        </View>
        <Slider
          minimumValue={1}
          maximumValue={10}
          step={1}
          value={bleedLength}
          onValueChange={setBleedLength}
          minimumTrackTintColor={t.accent}
          maximumTrackTintColor={hexToRgba(t.headerText, 0.2)}
          thumbTintColor={t.accent}
        />
      </View>

      <Text style={[styles.label, { color: muted, marginBottom: 8 }]}>Type de cycle</Text>
      <View style={styles.toggleRow}>
        <TouchableOpacity
          onPress={() => setRegular(true)}
          style={[styles.toggleBtn, { backgroundColor: regular ? t.accent : hexToRgba(t.headerText, 0.08) }]}
        >
          <Text style={{ color: regular ? t.accentText : t.headerText, fontSize: 12 }}>Régulier</Text>
          {regular && <Check size={12} color={t.accentText} style={{ marginLeft: 4 }} />}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setRegular(false)}
          style={[styles.toggleBtn, { backgroundColor: !regular ? t.accent : hexToRgba(t.headerText, 0.08) }]}
        >
          <Text style={{ color: !regular ? t.accentText : t.headerText, fontSize: 12 }}>Irrégulier ~</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 'auto' }}>
        <ArrowButton label="Continuer" onPress={handleContinue} bgColor={t.accent} textColor={t.accentText} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 48 },
  headerBlock: { alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 20, fontStyle: 'italic' },
  subtitle: { fontSize: 11, marginTop: 4, textAlign: 'center' },
  field: { marginBottom: 18 },
  label: { fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase' },
  dateInput: { marginTop: 6, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1 },
  sliderLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  toggleRow: { flexDirection: 'row', gap: 12 },
  toggleBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 10 },
});