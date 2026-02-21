// components/MetroLineSelector.tsx
'use client';

import { METRO_COLORS } from '@/types/metro';

interface MetroLineSelectorProps {
  selectedLine: string;
  onSelectLine: (line: string) => void;
  availableLines: string[];
}

export default function MetroLineSelector({ 
  selectedLine, 
  onSelectLine,
  availableLines 
}: MetroLineSelectorProps) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold mb-3 text-white">Metro line</h2>
      <div className="flex flex-wrap gap-2">
        {availableLines.map((line) => {
          const lineColor = METRO_COLORS[line] || '#999999';
          const isSelected = selectedLine === line;
          
          return (
            <button
              key={line}
              onClick={() => onSelectLine(line)}
              className={`
                px-4 py-2 rounded-lg font-semibold transition-all
                ${isSelected ? 'ring-2 ring-offset-2 ring-gray-400 scale-105' : 'hover:scale-105'}
              `}
              style={{
                backgroundColor: lineColor,
                color: getContrastColor(lineColor),
              }}
            >
              {line.startsWith('RER') ? line : line.replace('METRO ', 'M')}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Get contrasting text color (black or white) based on background color
 */
function getContrastColor(hexColor: string): string {
  // Convert hex to RGB
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}
