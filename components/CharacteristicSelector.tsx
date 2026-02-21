// components/CharacteristicSelector.tsx
'use client';

import { Characteristic, CHARACTERISTIC_CATEGORIES, CharacteristicCategory } from '@/types/metro';

interface CharacteristicSelectorProps {
  characteristics: Characteristic[];
  selectedCharacteristic: string;
  onSelectCharacteristic: (charId: string) => void;
}

export default function CharacteristicSelector({
  characteristics,
  selectedCharacteristic,
  onSelectCharacteristic,
}: CharacteristicSelectorProps) {
  // Group characteristics by category
  const groupedCharacteristics = characteristics.reduce((acc, char) => {
    if (!acc[char.category]) {
      acc[char.category] = [];
    }
    acc[char.category].push(char);
    return acc;
  }, {} as Record<CharacteristicCategory, Characteristic[]>);

  return (
    <div className="mb-4">
      <label htmlFor="characteristic-select" className="block text-lg font-semibold mb-3 text-white">
        Characteristic
      </label>
      <select
        id="characteristic-select"
        value={selectedCharacteristic}
        onChange={(e) => onSelectCharacteristic(e.target.value)}
        className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-900"
      >
        <option value="">-- Choose a characteristic --</option>
        {Object.entries(groupedCharacteristics).map(([category, chars]) => (
          <optgroup 
            key={category} 
            label={CHARACTERISTIC_CATEGORIES[category as CharacteristicCategory]}
          >
            {chars.map((char) => (
              <option key={char.id} value={char.id}>
                {char.name} {char.unit ? `(${char.unit})` : ''}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}
