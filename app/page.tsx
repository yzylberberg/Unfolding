// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import MetroLineSelector from '@/components/MetroLineSelector';
import CharacteristicSelector from '@/components/CharacteristicSelector';
import MetroChart from '@/components/MetroChart';
import { MetroStation, Characteristic } from '@/types/metro';
import { loadMetroLineData, getCharacteristics, calculateAverage } from '@/lib/dataUtils';

export default function Home() {
  const [availableLines] = useState([
    'METRO 1', 'METRO 2', 'METRO 3', 'METRO 3BIS', 'METRO 4', 'METRO 5',
    'METRO 6', 'METRO 7', 'METRO 7BIS', 'METRO 8', 'METRO 9', 'METRO 10',
    'METRO 11', 'METRO 12', 'METRO 13', 'METRO 14',
    'RER A', 'RER B', 'RER C', 'RER D', 'RER E'
  ]);
  const [selectedLine, setSelectedLine] = useState('METRO 1');
  const [selectedCharacteristic, setSelectedCharacteristic] = useState('');
  const [lineData, setLineData] = useState<MetroStation[]>([]);
  const [characteristics, setCharacteristics] = useState<Characteristic[]>([]);
  const [loading, setLoading] = useState(true);
  const [showStationsOnly, setShowStationsOnly] = useState(false);
  const [parisAverage, setParisAverage] = useState<number | undefined>(undefined);

  // Load data when line changes
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // Map metro line names to file names
        const fileMapping: Record<string, string> = {
          'METRO 1': 'final_M1',
          'METRO 2': 'final_M2',
          'METRO 3': 'final_M3',
          'METRO 3BIS': 'final_M3b',
          'METRO 4': 'final_M4',
          'METRO 5': 'final_M5',
          'METRO 6': 'final_M6',
          'METRO 7': 'final_M7',
          'METRO 7BIS': 'final_M7b',
          'METRO 8': 'final_M8',
          'METRO 9': 'final_M9',
          'METRO 10': 'final_M10',
          'METRO 11': 'final_M11',
          'METRO 12': 'final_M12',
          'METRO 13': 'final_M13',
          'METRO 14': 'final_M14',
          'RER A': 'final_RA',
          'RER B': 'final_RB',
          'RER C': 'final_RC',
          'RER D': 'final_RD',
          'RER E': 'final_RE',
        };
        
        const fileName = fileMapping[selectedLine];
        const data = await loadMetroLineData(fileName);
        setLineData(data);
        
        // Get characteristics from first station
        if (data.length > 0) {
          const chars = getCharacteristics(data[0]);
          setCharacteristics(chars);
          
          // Set default characteristic
          if (!selectedCharacteristic && chars.length > 0) {
            setSelectedCharacteristic(chars[0].id);
          }
        }
      } catch (error) {
        console.error('Error loading metro data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [selectedLine]);

  // Calculate Paris average when characteristic changes
  useEffect(() => {
    if (lineData.length > 0 && selectedCharacteristic) {
      const avg = calculateAverage(lineData, selectedCharacteristic);
      setParisAverage(avg);
    }
  }, [lineData, selectedCharacteristic]);

  const selectedChar = characteristics.find(c => c.id === selectedCharacteristic);

  return (
    <main className="min-h-screen bg-gray-50 p-8 relative">
      {/* Background image with white overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(https://mir-s3-cdn-cf.behance.net/project_modules/fs/5281f224015487.61b772e9288b2.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      />
      <div className="absolute inset-0 bg-white opacity-50 z-0" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 drop-shadow-lg">
            Unfolding metro lines
          </h1>
          <p className="text-gray-800 drop-shadow-md">
            Explore how neighborhoods change along Paris metro lines
          </p>
        </header>

        <div className="bg-[#1e3a5f] rounded-lg shadow-lg p-4 mb-4 bg-opacity-95">
          <MetroLineSelector
            selectedLine={selectedLine}
            onSelectLine={setSelectedLine}
            availableLines={availableLines}
          />

          <CharacteristicSelector
            characteristics={characteristics}
            selectedCharacteristic={selectedCharacteristic}
            onSelectCharacteristic={setSelectedCharacteristic}
          />

          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer text-white">
              <input
                type="checkbox"
                checked={showStationsOnly}
                onChange={(e) => setShowStationsOnly(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">
                Show stations only (hide intermediate points)
              </span>
            </label>
          </div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <p className="mt-4 text-gray-600">Loading metro data...</p>
          </div>
        )}

        {!loading && lineData.length > 0 && selectedCharacteristic && (
          <MetroChart
            data={lineData}
            characteristic={selectedCharacteristic}
            characteristicName={selectedChar?.name || selectedCharacteristic}
            characteristicUnit={selectedChar?.unit}
            lineName={selectedLine}
            parisAverage={parisAverage}
            showStationsOnly={showStationsOnly}
          />
        )}

        {!loading && lineData.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-yellow-800">
              No data available for this line. Please check that the CSV file is in the public/data folder.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
