import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  bgColor: string;
  textColor: string;
};

export default function ArrowButton({ label, onPress, disabled, loading, bgColor, textColor }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={{
        width: '100%',
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: bgColor,
        opacity: disabled || loading ? 0.6 : 1,
        flexDirection: 'row',
        gap: 6,
      }}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          <Text style={{ color: textColor, fontWeight: '600', fontSize: 14 }}>{label}</Text>
          <ChevronRight size={16} color={textColor} />
        </>
      )}
    </TouchableOpacity>
  );
}