import * as SecureStore from 'expo-secure-store';

const SESSION_KEY = 'luna_supabase_session';

export interface StoredSession {
  access_token: string;
  refresh_token: string;
  user: { id: string; email: string };
  prenom: string;
  avatarIndex: number;
}

export async function saveSession(session: StoredSession): Promise<void> {
  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
}

export async function getSession(): Promise<StoredSession | null> {
  const raw = await SecureStore.getItemAsync(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function clearSession(): Promise<void> {
  await SecureStore.deleteItemAsync(SESSION_KEY);
}

export async function hasActiveSession(): Promise<boolean> {
  return (await getSession()) !== null;
}