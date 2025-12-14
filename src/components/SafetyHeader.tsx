import React from 'react';
import { LogOut, EyeOff, Shield } from 'lucide-react';
import { ViewState } from '../types';

interface SafetyHeaderProps {
  onQuickExit: () => void;
  onToggleDisguise: () => void;
  onOpenPrivacy: () => void;
  currentView: ViewState;
}

const SafetyHeader: React.FC<SafetyHeaderProps> = ({ onQuickExit, onToggleDisguise, onOpenPrivacy, currentView }) => {
  if (currentView === ViewState.CALCULATOR) return null;

  return (
    <div className="sticky top-0 z-50 w-full bg-red-600 text-white shadow-md flex justify-between items-center px-4 py-3">
      <button 
        onClick={onOpenPrivacy}
        className="flex items-center gap-2 bg-red-700 hover:bg-red-800 px-3 py-1.5 rounded text-xs md:text-sm transition-colors border border-red-500"
        title="Politika e Privatësisë"
      >
        <Shield size={16} />
        <span className="hidden sm:inline">Privatësia</span>
      </button>
      
      <div className="flex gap-3">
        <button 
          onClick={onToggleDisguise}
          className="flex items-center gap-2 bg-red-700 hover:bg-red-800 px-3 py-1.5 rounded text-xs md:text-sm transition-colors border border-red-500"
          title="Kalo në pamjen e llogaritësit"
        >
          <EyeOff size={16} />
          <span className="hidden sm:inline">Fshih Ekranin</span>
        </button>
        
        <button 
          onClick={onQuickExit}
          className="flex items-center gap-2 bg-white text-red-600 hover:bg-gray-100 px-4 py-1.5 rounded font-bold text-xs md:text-sm transition-colors shadow-sm"
        >
          <LogOut size={16} />
          DALJE E SHPEJTË
        </button>
      </div>
    </div>
  );
};

export default SafetyHeader;