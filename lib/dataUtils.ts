// lib/dataUtils.ts

import Papa from 'papaparse';
import { MetroStation, MetroLine, Characteristic, CharacteristicCategory } from '@/types/metro';

/**
 * Load and parse a metro line CSV file
 */
export async function loadMetroLineData(lineId: string): Promise<MetroStation[]> {
  const response = await fetch(`/data/${lineId}.csv`);
  const csvText = await response.text();
  
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        resolve(results.data as MetroStation[]);
      },
      error: (error: Error) => {
        reject(error);
      },
    });
  });
}

/**
 * Get all characteristics from the data with metadata
 */
export function getCharacteristics(sampleStation: MetroStation): Characteristic[] {
  const characteristics: Characteristic[] = [];
  
  // Define which fields belong to which categories
  const categoryMapping: Record<string, CharacteristicCategory> = {
    // Geography & environment
    elevation: 'environment',
    noise: 'environment',
    
    // Housing, economy & demographics
    housing_price: 'economy',
    census_share_0_18: 'economy',
    census_share_18_39: 'economy',
    census_share_40_64: 'economy',
    census_share_65_100: 'economy',
    census_built_a1990: 'economy',
    census_built_b1945: 'economy',
    census_density: 'economy',
    census_income: 'economy',
    census_share_poor: 'economy',
    census_share_social: 'economy',
    
    // City services
    city_fiber: 'infrastructure',
    city_heritage: 'infrastructure',
    city_toilets: 'infrastructure',
    city_trees: 'infrastructure',
    city_velib: 'infrastructure',
    
    // Points of interest
    poi_bakery: 'businesses',
    poi_bank: 'businesses',
    poi_bar: 'businesses',
    poi_cafe: 'businesses',
    poi_clothes: 'businesses',
    poi_fastfood: 'businesses',
    poi_hairdresser: 'businesses',
    poi_hotel: 'businesses',
    poi_jeweller: 'businesses',
    poi_kindergarten: 'businesses',
    poi_nightclub: 'businesses',
    poi_pharmacy: 'businesses',
    poi_playground: 'businesses',
    poi_police: 'businesses',
    poi_pub: 'businesses',
    poi_restaurant: 'businesses',
    poi_school: 'businesses',
    poi_supermarket: 'businesses',
    poi_crossing: 'businesses',
    poi_parking: 'businesses',
    poi_lamp: 'businesses',
    
    // Historical (trade directories)
    historical_rentiers_1829: 'culture',
    historical_rentiers_1840: 'culture',
    historical_rentiers_1854: 'culture',
    historical_rentiers_1885: 'culture',
    historical_clothing_1829: 'culture',
    historical_clothing_1840: 'culture',
    historical_clothing_1854: 'culture',
    historical_clothing_1885: 'culture',
    historical_food_1829: 'culture',
    historical_food_1840: 'culture',
    historical_food_1854: 'culture',
    historical_food_1885: 'culture',
    historical_furniture_1829: 'culture',
    historical_furniture_1840: 'culture',
    historical_furniture_1854: 'culture',
    historical_furniture_1885: 'culture',
    historical_luxury_1829: 'culture',
    historical_luxury_1840: 'culture',
    historical_luxury_1854: 'culture',
    historical_luxury_1885: 'culture',
  };
  
  // Get human-readable names
  const nameMapping: Record<string, string> = {
    // Geography & environment
    elevation: 'Elevation',
    noise: 'Average noise',
    
    // Housing & economy
    housing_price: 'Average price per square meter',
    census_income: 'Average income',
    census_share_social: 'Share of social housing',
    
    // Demographics
    census_share_0_18: 'Share of 0-18 individuals',
    census_share_18_39: 'Share of 18-39 individuals',
    census_share_40_64: 'Share of 40-64 individuals',
    census_share_65_100: 'Share of 65+ individuals',
    census_built_a1990: 'Share built after 1990',
    census_built_b1945: 'Share built before 1945',
    census_density: 'Population density',
    census_share_poor: 'Share of poor households',
    
    // City services
    city_fiber: 'Housing units with fiber',
    city_heritage: 'Heritage buildings',
    city_toilets: 'Public toilets',
    city_trees: 'Trees',
    city_velib: 'Velib stations',
    
    // Points of interest
    poi_bakery: 'Bakery',
    poi_bank: 'Bank',
    poi_bar: 'Bar',
    poi_cafe: 'Cafe',
    poi_clothes: 'Clothes shop',
    poi_fastfood: 'Fast food',
    poi_hairdresser: 'Hairdresser',
    poi_hotel: 'Hotel',
    poi_jeweller: 'Jeweller',
    poi_kindergarten: 'Kindergarten',
    poi_nightclub: 'Nightclub',
    poi_pharmacy: 'Pharmacy',
    poi_playground: 'Playground',
    poi_police: 'Police station',
    poi_pub: 'Pub',
    poi_restaurant: 'Restaurant',
    poi_school: 'School',
    poi_supermarket: 'Supermarket',
    poi_crossing: 'Crossing',
    poi_parking: 'Parking',
    poi_lamp: 'Street lamp',
    
    // Historical (trade directories)
    historical_rentiers_1829: 'Rentiers (1829)',
    historical_rentiers_1840: 'Rentiers (1840)',
    historical_rentiers_1854: 'Rentiers (1854)',
    historical_rentiers_1885: 'Rentiers (1885)',
    historical_clothing_1829: 'Clothing shops (1829)',
    historical_clothing_1840: 'Clothing shops (1840)',
    historical_clothing_1854: 'Clothing shops (1854)',
    historical_clothing_1885: 'Clothing shops (1885)',
    historical_food_1829: 'Food shops (1829)',
    historical_food_1840: 'Food shops (1840)',
    historical_food_1854: 'Food shops (1854)',
    historical_food_1885: 'Food shops (1885)',
    historical_furniture_1829: 'Furniture shops (1829)',
    historical_furniture_1840: 'Furniture shops (1840)',
    historical_furniture_1854: 'Furniture shops (1854)',
    historical_furniture_1885: 'Furniture shops (1885)',
    historical_luxury_1829: 'Luxury shops (1829)',
    historical_luxury_1840: 'Luxury shops (1840)',
    historical_luxury_1854: 'Luxury shops (1854)',
    historical_luxury_1885: 'Luxury shops (1885)',
  };
  
  for (const key in sampleStation) {
    if (categoryMapping[key]) {
      characteristics.push({
        id: key,
        name: nameMapping[key] || formatFieldName(key),
        category: categoryMapping[key],
        unit: getUnit(key),
      });
    }
  }
  
  return characteristics.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Format field name from snake_case to sentence case
 */
function formatFieldName(fieldName: string): string {
  const formatted = fieldName
    .replace('density_', '')
    .replace('hhshare_', 'HH: ')
    .replace('indshare_', 'Pop: ')
    .replace(/_/g, ' ');
  
  // Capitalize only the first letter
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

/**
 * Get unit for a characteristic
 */
function getUnit(fieldName: string): string | undefined {
  if (fieldName.startsWith('poi_')) return 'per km²';
  if (fieldName.startsWith('city_')) return 'per km²';
  if (fieldName.startsWith('historical_')) return 'per km²';
  if (fieldName.startsWith('census_share_')) return '%';
  if (fieldName === 'housing_price') return '€/m²';
  if (fieldName === 'noise') return 'dB';
  if (fieldName === 'elevation') return 'm';
  if (fieldName === 'census_density') return 'people/km²';
  if (fieldName === 'census_income') return '€/year';
  if (fieldName === 'census_built_a1990') return '%';
  if (fieldName === 'census_built_b1945') return '%';
  if (fieldName === 'census_share_poor') return '%';
  if (fieldName === 'census_share_social') return '%';
  return undefined;
}

/**
 * Filter stations only (exclude intermediate points)
 */
export function getStationsOnly(data: MetroStation[]): MetroStation[] {
  return data.filter(station => station.name_station && station.name_station.trim() !== '');
}

/**
 * Calculate Paris-wide average for a characteristic
 */
export function calculateAverage(data: MetroStation[], characteristic: string): number {
  const values = data
    .map(station => station[characteristic])
    .filter(val => typeof val === 'number' && !isNaN(val) && val !== -9999) as number[];
  
  if (values.length === 0) return 0;
  
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
}

/**
 * Normalize values to percentiles
 */
export function normalizeToPercentile(value: number, allValues: number[]): number {
  const sorted = [...allValues].sort((a, b) => a - b);
  const index = sorted.findIndex(v => v >= value);
  return (index / sorted.length) * 100;
}
