export interface Theme {
  name: string;
  bg: string;
  surface: string;
  border: string;
  header: string;
  headerSoft: string;
  headerText: string;
  text: string;
  textMuted: string;
  accent: string;
  accentText: string;
  accent2: string;
  pillBg: string;
}

export const THEMES: Record<string, Theme> = {
  roseGold: {
    name: 'Rose & Gold',
    bg: '#FBF3EC',
    surface: '#FFFFFF',
    border: '#EFE1D3',
    header: '#3B1626',
    headerSoft: '#4E1E33',
    headerText: '#F7E9D7',
    text: '#3B1626',
    textMuted: '#93726A',
    accent: '#C69A4A',
    accentText: '#3B1626',
    accent2: '#B85C7C',
    pillBg: '#F7E9D7',
  },
  violet: {
    name: 'Violet Mystique',
    bg: '#F4EFFB',
    surface: '#FFFFFF',
    border: '#E4D6F5',
    header: '#241132',
    headerSoft: '#3D2359',
    headerText: '#EADFFB',
    text: '#3D2166',
    textMuted: '#7A5FA0',
    accent: '#B79CF0',
    accentText: '#241132',
    accent2: '#6E4FBF',
    pillBg: '#EADFFB',
  },
  sakura: {
    name: 'Sakura',
    bg: '#FFF2F6',
    surface: '#FFFFFF',
    border: '#FBDCE7',
    header: '#4A2233',
    headerSoft: '#5C2C40',
    headerText: '#FBDCE7',
    text: '#4A2233',
    textMuted: '#A3737F',
    accent: '#E88BAA',
    accentText: '#FFFFFF',
    accent2: '#F2B9CC',
    pillBg: '#FBDCE7',
  },
  darkGoddess: {
    name: 'Dark Goddess',
    bg: '#120C1B',
    surface: '#1D1728',
    border: '#332A46',
    header: '#0A0712',
    headerSoft: '#171022',
    headerText: '#E9DFFB',
    text: '#EDE7F7',
    textMuted: '#9C8FBE',
    accent: '#C9A24C',
    accentText: '#120C1B',
    accent2: '#8B6FCB',
    pillBg: '#241C36',
  },
};

export function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const bigint = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  const r = (bigint >> 16) & 255, g = (bigint >> 8) & 255, b = bigint & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

export const DEFAULT_THEME_KEY = 'roseGold';