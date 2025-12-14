import React, { useState } from 'react';
import { Unlock } from 'lucide-react';

interface CalculatorDisguiseProps {
  onUnlock: () => void;
}

const CalculatorDisguise: React.FC<CalculatorDisguiseProps> = ({ onUnlock }) => {
  const [display, setDisplay] = useState('0');

  const handlePress = (val: string) => {
    if (val === 'C') setDisplay('0');
    else if (val === '=') setDisplay(display); // Dummy logic
    else setDisplay(display === '0' ? val : display + val);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-xs border border-gray-700">
        {/* Secret Unlock Button hidden in the UI */}
        <div className="flex justify-between mb-4">
            <span className="text-gray-400 text-xs">Llogaritës Standard</span>
            <button onClick={onUnlock} className="text-gray-700 hover:text-gray-600 transition-colors">
                <Unlock size={12} />
            </button>
        </div>
        
        <div className="bg-gray-200 rounded-lg p-4 mb-6 text-right text-3xl font-mono text-gray-800 h-16 flex items-center justify-end overflow-hidden">
          {display}
        </div>

        <div className="grid grid-cols-4 gap-3">
          {['C', '+/-', '%', '/'].map(btn => (
            <button key={btn} onClick={() => handlePress(btn)} className="bg-gray-300 hover:bg-gray-400 p-4 rounded-full font-bold text-lg transition-colors">{btn}</button>
          ))}
          {['7', '8', '9', 'x'].map(btn => (
            <button key={btn} onClick={() => handlePress(btn)} className={`p-4 rounded-full font-bold text-lg transition-colors ${['x'].includes(btn) ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-gray-600 text-white hover:bg-gray-500'}`}>{btn}</button>
          ))}
          {['4', '5', '6', '-'].map(btn => (
            <button key={btn} onClick={() => handlePress(btn)} className={`p-4 rounded-full font-bold text-lg transition-colors ${['-'].includes(btn) ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-gray-600 text-white hover:bg-gray-500'}`}>{btn}</button>
          ))}
          {['1', '2', '3', '+'].map(btn => (
            <button key={btn} onClick={() => handlePress(btn)} className={`p-4 rounded-full font-bold text-lg transition-colors ${['+'].includes(btn) ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-gray-600 text-white hover:bg-gray-500'}`}>{btn}</button>
          ))}
          {['0', '.', '='].map(btn => (
            <button key={btn} onClick={() => handlePress(btn)} className={`p-4 rounded-full font-bold text-lg transition-colors ${btn === '0' ? 'col-span-2 w-full text-left pl-8 bg-gray-600 text-white hover:bg-gray-500' : btn === '=' ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-gray-600 text-white hover:bg-gray-500'}`}>{btn}</button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalculatorDisguise;