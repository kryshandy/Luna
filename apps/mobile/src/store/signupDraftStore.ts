import { create } from 'zustand';

export type SecurityMethodDraft = 'pin' | 'fingerprint' | 'none' | null;

export interface CycleDraft {
  lastPeriodStart: string;
  previousPeriodStart: string;
  cycleLength: number;
  bleedLength: number;
  regular: boolean;
}

interface SignupDraftState {
  prenom: string;
  age: string;
  email: string;
  taille: string;
  poids: string;
  avatarIndex: number;
  password: string;
  cycleData: CycleDraft | null;
  securityMethod: SecurityMethodDraft;
  pinDraft: string;

  setProfileDraft: (data: {
    prenom: string;
    age: string;
    email: string;
    taille: string;
    poids: string;
    avatarIndex: number;
    password: string;
  }) => void;
  setCycleDraft: (data: CycleDraft) => void;
  setSecurityMethodDraft: (method: SecurityMethodDraft) => void;
  setPinDraft: (pin: string) => void;
  reset: () => void;
}

const initialState = {
  prenom: '',
  age: '',
  email: '',
  taille: '',
  poids: '',
  avatarIndex: 9,
  password: '',
  cycleData: null,
  securityMethod: null as SecurityMethodDraft,
  pinDraft: '',
};

export const useSignupDraftStore = create<SignupDraftState>((set) => ({
  ...initialState,
  setProfileDraft: (data) => set(data),
  setCycleDraft: (cycleData) => set({ cycleData }),
  setSecurityMethodDraft: (securityMethod) => set({ securityMethod }),
  setPinDraft: (pinDraft) => set({ pinDraft }),
  reset: () => set(initialState),
}));