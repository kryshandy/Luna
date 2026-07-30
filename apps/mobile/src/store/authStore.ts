import { create } from 'zustand';

export type DeviceStatus = 'loading' | 'noAccount' | 'hasAccount';
export type SecurityMethod = 'pin' | 'fingerprint' | 'none' | null;

interface AuthState {
  deviceStatus: DeviceStatus;
  unlocked: boolean;
  securityMethod: SecurityMethod;
  prenom: string;
  avatarIndex: number;
  email: string;

  setDeviceStatus: (status: DeviceStatus) => void;
  setSecurityMethod: (method: SecurityMethod) => void;
  setProfile: (prenom: string, avatarIndex: number, email: string) => void;
  unlock: () => void;
  lock: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  deviceStatus: 'loading',
  unlocked: false,
  securityMethod: null,
  prenom: '',
  avatarIndex: 9,
  email: '',

  setDeviceStatus: (deviceStatus) => set({ deviceStatus }),
  setSecurityMethod: (securityMethod) => set({ securityMethod }),
  setProfile: (prenom, avatarIndex, email) => set({ prenom, avatarIndex, email }),
  unlock: () => set({ unlocked: true }),
  lock: () => set({ unlocked: false }),
}));