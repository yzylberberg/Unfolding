// types/metro.ts

export interface MetroStation {
  ID_int: number;
  line: string;
  branch: number;
  name_station: string;
  longitude_int: number;
  latitude_int: number;
  rank_station: number;
  rank_intermediate: number;
  cumul_distance: number;
  index: number;
  network: string;
  mode: string;
  // All the density/characteristic fields
  [key: string]: number | string;
}

export interface MetroLine {
  id: string;
  name: string;
  color: string;
  stations: MetroStation[];
  totalStations: number;
  totalDistance: number;
}

export interface Characteristic {
  id: string;
  name: string;
  category: CharacteristicCategory;
  unit?: string;
  description?: string;
}

export type CharacteristicCategory = 
  | 'environment'
  | 'economy'
  | 'infrastructure'
  | 'businesses'
  | 'culture';

export interface ChartDataPoint {
  x: number; // cumul_distance
  y: number; // characteristic value
  stationName?: string;
  isStation: boolean;
}

export const METRO_COLORS: Record<string, string> = {
  'METRO 1': '#FFCD00',   // Yellow
  'METRO 2': '#5A9FD4',   // Lighter Blue
  'METRO 3': '#A89D3D',   // Lighter Olive
  'METRO 3BIS': '#6EC4E8', // Light Blue
  'METRO 4': '#C04191',   // Pink/Purple
  'METRO 5': '#F28E42',   // Orange
  'METRO 6': '#6ECA97',   // Light Green
  'METRO 7': '#F3A4BA',   // Light Pink
  'METRO 7BIS': '#6ECA97', // Light Green
  'METRO 8': '#CEADD2',   // Lavender
  'METRO 9': '#CECE00',   // Yellow-Green
  'METRO 10': '#E3B32A',  // Gold
  'METRO 11': '#B8936D',  // Lighter Brown
  'METRO 12': '#2CA67A',  // Lighter Green
  'METRO 13': '#6EC4E8',  // Light Blue
  'METRO 14': '#9060B0',  // Lighter Purple
  'RER A': '#E4002B',     // Red
  'RER B': '#5291CE',     // Blue
  'RER C': '#F99D1D',     // Orange
  'RER D': '#00A88F',     // Green
  'RER E': '#C760AA',     // Purple
};

export const CHARACTERISTIC_CATEGORIES: Record<CharacteristicCategory, string> = {
  environment: 'Geography & environment',
  economy: 'Housing, economy & demographics',
  infrastructure: 'City services',
  businesses: 'Points of interest',
  culture: 'Historical (trade directories)',
};
