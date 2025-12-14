import React, { useState } from 'react';
import { generateFinancialPlan } from '../services/openaiService';
import { FinancialPlan } from '../types';
import { Target, DollarSign, BrainCircuit, ArrowRight } from 'lucide-react';

const difficultyMap: Record<string, string> = {
  "Low": "E Ulët",
  "Medium": "E Mesme",
  "High": "E Lartë"
};

const PlanGenerator: React.FC = () => {
  const [situation, setSituation] = useState('');
  const [plan, setPlan] = useState<FinancialPlan | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!situation.trim()) return;
    setLoading(true);
    try {
      const result = await generateFinancialPlan(situation);
      setPlan(result);
    } catch (e) {
      alert("Nuk mund të gjenerohej plani. Ju lutemi provoni përsëri.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {!plan && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Planifikuesi i Pavarësisë</h2>
            <p className="text-slate-600">
              Përshkruani situatën tuaj aktuale (p.sh., "Kam një llogari të përbashkët dhe nuk kam histori krediti", ose "Më duhet të kursej para fshehurazi"). 
              AI do të gjenerojë një listë kontrolli diskrete, hap pas hapi.
            </p>
          </div>

          <textarea
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            className="w-full h-32 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none bg-slate-50"
            placeholder="Shkruani këtu..."
          />

          <button
            onClick={handleGenerate}
            disabled={loading || !situation}
            className="mt-4 w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-pulse">Duke analizuar...</span>
            ) : (
              <>
                <BrainCircuit size={20} />
                Gjenero Planin
              </>
            )}
          </button>
        </div>
      )}

      {plan && (
        <div className="animate-fade-in space-y-6">
          <div className="bg-teal-50 border border-teal-100 p-4 rounded-xl flex items-start gap-3">
            <Target className="text-teal-600 flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="font-semibold text-teal-800">Shënim nga Këshilltari</h3>
              <p className="text-teal-700 text-sm mt-1">{plan.advice}</p>
            </div>
          </div>

          <div className="grid gap-4">
            {plan.steps.map((step, idx) => (
              <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className={`absolute top-0 left-0 w-1 h-full ${
                  step.difficulty === 'High' ? 'bg-orange-500' : 
                  step.difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`} />
                
                <div className="flex justify-between items-start mb-2 pl-3">
                  <h4 className="font-bold text-slate-800 text-lg">{step.title}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                     step.difficulty === 'High' ? 'bg-orange-100 text-orange-700' : 
                     step.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {difficultyMap[step.difficulty] || step.difficulty}
                  </span>
                </div>
                
                <p className="text-slate-600 text-sm mb-4 pl-3 leading-relaxed">
                  {step.description}
                </p>

                <div className="flex items-center gap-2 text-slate-500 text-xs pl-3 border-t border-slate-50 pt-3">
                  <DollarSign size={14} />
                  <span>Kosto e Vlerësuar: <span className="font-medium text-slate-700">{step.estimatedCost}</span></span>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => setPlan(null)}
            className="w-full py-3 text-slate-500 hover:text-slate-700 font-medium flex items-center justify-center gap-2"
          >
            Krijo Plan të Ri <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default PlanGenerator;