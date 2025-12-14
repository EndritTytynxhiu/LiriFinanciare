import React, { useState } from 'react';
import { X, Shield, Lock } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'security'>('privacy');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800">Politika e Privatësisë dhe Sigurisë</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
              activeTab === 'privacy'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <Shield className="inline mr-2" size={18} />
            Privatësia
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
              activeTab === 'security'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <Lock className="inline mr-2" size={18} />
            Siguria
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-96">
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Politika e Privatësisë</h3>
              <p className="text-slate-600 leading-relaxed">
                Ne nuk marrim asnjë të dhënë personale nga përdoruesit tanë. Aplikacioni ynë është projektuar për të punuar plotësisht në pajisjen tuaj lokale, pa dërguar informacione në serverët tanë.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Ne nuk përdorim cookies, gjurmues ose ndonjë formë tjetër të mbledhjes së të dhënave. Të gjitha bisedat dhe planet tuaja financiare ruhen vetëm në kujtesën lokale të shfletuesit tuaj dhe nuk transmetohen kurrë jashtë pajisjes suaj.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Për të siguruar privatësinë tuaj të plotë, rekomandojmë përdorimin e një shfletuesi privat ose modalitetit incognito kur përdorni këtë aplikacion.
              </p>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Siguria</h3>
              <p className="text-slate-600 leading-relaxed">
                Aplikacioni ynë është ndërtuar me fokus në sigurinë dhe privatësinë. Të gjitha komunikimet me shërbimet e jashtme (si OpenAI) bëhen në mënyrë të sigurt dhe të koduar.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Ne nuk ruajmë asnjë të dhënë të përdoruesit në serverët tanë. Çdo informacion që futni mbetet vetëm në pajisjen tuaj dhe nuk ndahet me palë të treta.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Për sigurinë maksimale, përdorni këtë aplikacion në një rrjet të sigurt dhe konsideroni përdorimin e mjeteve shtesë të sigurisë si VPN kur është e nevojshme.
              </p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="w-full bg-teal-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
          >
            E Kuptova
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;
