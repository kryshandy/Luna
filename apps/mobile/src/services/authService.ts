import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';

const PIN_KEY = 'luna_local_pin';
const SECURITY_METHOD_KEY = 'luna_security_method';

export type SecurityMethod = 'pin' | 'fingerprint' | 'none';

// --- Méthode de sécurité choisie à l'inscription ---
export async function saveSecurityMethod(method: SecurityMethod): Promise<void> {
  await SecureStore.setItemAsync(SECURITY_METHOD_KEY, method);
}

export async function getSecurityMethod(): Promise<SecurityMethod | null> {
  const value = await SecureStore.getItemAsync(SECURITY_METHOD_KEY);
  return (value as SecurityMethod) ?? null;
}

// --- PIN local (utilisé seulement si securityMethod === 'pin') ---
export async function savePin(pin: string): Promise<void> {
  await SecureStore.setItemAsync(PIN_KEY, pin);
}

export async function verifyPin(pin: string): Promise<boolean> {
  const saved = await SecureStore.getItemAsync(PIN_KEY);
  return saved === pin;
}

// --- Biométrie ---
export async function isBiometricAvailable(): Promise<boolean> {
  const compatible = await LocalAuthentication.hasHardwareAsync();
  const enrolled = await LocalAuthentication.isEnrolledAsync();
  return compatible && enrolled;
}

export async function authenticateWithBiometrics(): Promise<boolean> {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Déverrouille Luna',
    cancelLabel: 'Annuler',
  });
  return result.success;
}

// --- Nettoyage (déconnexion complète / debug) ---
export async function clearLocalSecurity(): Promise<void> {
  await SecureStore.deleteItemAsync(PIN_KEY);
  await SecureStore.deleteItemAsync(SECURITY_METHOD_KEY);
}