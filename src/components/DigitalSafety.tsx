import React, { useState, useEffect } from 'react';
import { Smartphone, Lock, Eye, MapPin, ChevronDown, ChevronUp, CheckCircle2, ShieldAlert, KeyRound, Users, Map, MessageSquareOff } from 'lucide-react';

interface SafetyItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  risk: string;
  action: string;
  details: string;
  priority: 'High' | 'Medium' | 'Low';
}

const safetyItems: SafetyItem[] = [
  {
    id: 'safety-check',
    title: 'Kontrolli Emergjent (Safety Check)',
    icon: <ShieldAlert className="text-red-600" size={28} />,
    risk: 'Kjo është vegla kryesore e sistemit për të ndërprerë çdo lidhje.',
    action: 'Settings > Privacy & Security > Safety Check',
    details: 'Shkoni te "Settings" > "Privacy & Security" > "Safety Check". Përdorni "Emergency Reset" për të ndërprerë menjëherë çdo lidhje me njerëzit dhe aplikacionet, ose "Manage Sharing" për të parë specifikisht çfarë po ndani.',
    priority: 'High'
  },
  {
    id: 'text-forwarding',
    title: 'Ndalimi i SMS në iPad/Mac',
    icon: <MessageSquareOff className="text-pink-600" size={28} />,
    risk: 'Abuzuesi mund të lexojë SMS-të (dhe kodet bankare) në iPad ose Mac të tij pa e ditur ju.',
    action: 'Settings > Messages > Text Message Forwarding',
    details: 'Kjo është kritike për llogaritë bankare. Shkoni te Settings > Messages. Gjeni opsionin "Text Message Forwarding". Nëse shihni pajisje të tjera të lidhura (iPad, Mac), fikini (Turn Off) menjëherë. Kjo ndalon kopjimin e mesazheve tuaja në pajisjet e tyre.',
    priority: 'High'
  },
  {
    id: 'location-sharing',
    title: 'Ndalimi i Ndarjes së Vendndodhjes',
    icon: <MapPin className="text-red-500" size={28} />,
    risk: 'Dikush mund t\'ju ndjekë në kohë reale përmes "Find My" ose Mesazheve.',
    action: 'Settings > Privacy > Location Services > Share My Location',
    details: 'Sigurohuni që opsioni "Share My Location" është plotësisht i fikur (OFF). Kjo është mënyra më e sigurt për të ndaluar gjurmimin nga familjarët ose miqtë përmes pajisjeve Apple.',
    priority: 'High'
  },
  {
    id: 'significant-locations',
    title: 'Vendet e Rëndësishme (E Fshehur)',
    icon: <Map className="text-orange-600" size={28} />,
    risk: 'Telefoni ruan një hartë të saktë të vendeve ku shkoni shpesh (punë, strehimore).',
    action: 'Settings > Privacy > Location > System Services',
    details: 'Shkoni te Settings > Privacy & Security > Location Services > (në fund) System Services > Significant Locations. Kjo shpesh kërkon FaceID për t\'u hapur. Bëni "Clear History" dhe fikeni (Turn Off) që telefoni të mos mbajë shënime se ku shkoni çdo ditë.',
    priority: 'Medium'
  },
  {
    id: '2fa-security',
    title: 'Siguria e Kodit 2-Hapa (2FA)',
    icon: <KeyRound className="text-indigo-600" size={28} />,
    risk: 'Nëse abuzuesi merr kodet tuaja, mund të ndryshojë fjalëkalimet.',
    action: 'Settings > Emri Juaj > Sign-In & Security',
    details: 'Kontrolloni "Trusted Phone Numbers". Duhet të jetë VETËM numri juaj aktual. Nëse shihni numrin e dikujt tjetër, hiqeni menjëherë. Kjo siguron që kur provoni të ndryshoni fjalëkalim ose të hyni në iCloud, kodi vjen vetëm te ju.',
    priority: 'Medium'
  },
  {
    id: 'family-sharing',
    title: 'Largimi nga Grupi "Family"',
    icon: <Users className="text-blue-500" size={28} />,
    risk: 'Anëtarët e "Familjes" shpesh kanë qasje automatike në vendndodhje dhe blerje.',
    action: 'Settings > Emri Juaj > Family Sharing',
    details: 'Nëse jeni pjesë e një grupi Family Sharing me abuzuesin, ai mund të shohë ku jeni. Klikoni emrin tuaj dhe zgjidhni "Stop Using Family Sharing". Kjo ju shkëput plotësisht nga grupi i tyre.',
    priority: 'Medium'
  },
  {
    id: 'faceid',
    title: 'Kontrolli i Fytyrave (Face ID)',
    icon: <Smartphone className="text-slate-700" size={28} />,
    risk: 'Abuzuesi mund të ketë regjistruar fytyrën e tij për të hapur telefonin tuaj.',
    action: 'Settings > Face ID & Passcode',
    details: 'Shkoni te "Face ID & Passcode". Shikoni opsionin "Set up an Alternative Appearance". Nëse ky opsion nuk ekziston (dhe shkruan vetëm "Reset Face ID"), do të thotë se janë regjistruar tashmë dy fytyra. Bëni "Reset Face ID" dhe regjistroni vetëm fytyrën tuaj.',
    priority: 'Low'
  },
  {
    id: 'passwords-ios',
    title: 'Fjalëkalimet e Ruajtura',
    icon: <Lock className="text-amber-500" size={28} />,
    risk: 'Fjalëkalimet e vjetra ose të dobëta janë të lehta për t\'u gjetur.',
    action: 'Settings > Passwords > Security Recommendations',
    details: 'Hyni te "Settings" > "Passwords". Kontrolloni "Security Recommendations". Ndryshoni menjëherë çdo fjalëkalim që është shënuar si "Compromised" ose që abuzuesi mund ta dijë (si datëlindje, emra fëmijësh, etj).',
    priority: 'Low'
  }
];

const DigitalSafety: React.FC = () => {
  const [expanded, setExpanded] = useState<string | null>(null);
  
  // Persisted state for completed checks
  const [completed, setCompleted] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('haven_safety_completed');
    if (saved) {
      try {
        return new Set(JSON.parse(saved));
      } catch (e) {
        return new Set();
      }
    }
    return new Set();
  });

  useEffect(() => {
    localStorage.setItem('haven_safety_completed', JSON.stringify(Array.from(completed)));
  }, [completed]);

  const toggleExpand = (id: string) => {
    setExpanded(expanded === id ? null : id);
  };

  const toggleComplete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newCompleted = new Set(completed);
    if (newCompleted.has(id)) {
      newCompleted.delete(id);
    } else {
      newCompleted.add(id);
    }
    setCompleted(newCompleted);
  };

  const progress = Math.round((completed.size / safetyItems.length) * 100);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 h-full flex flex-col overflow-hidden">
      {/* Header Area */}
      <div className="relative bg-slate-900 text-white p-8 overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-10 -translate-y-10">
          <ShieldAlert size={150} />
        </div>
        
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Siguria Digjitale</h2>
          <p className="text-slate-300 max-w-lg mb-6 text-sm md:text-base">
            Mbroni pajisjen tuaj hap pas hapi. Këto veprime parandalojnë përgjimin e vendndodhjes, mesazheve dhe llogarive bankare.
          </p>
          
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Progresi i Sigurisë</span>
              <span className={`text-sm font-bold ${progress === 100 ? 'text-green-400' : 'text-white'}`}>{progress}%</span>
            </div>
            <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ease-out ${
                  progress === 100 ? 'bg-green-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                }`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* List Area */}
      <div className="p-4 md:p-6 overflow-y-auto bg-slate-50 flex-1 space-y-4">
        {safetyItems.map((item) => {
          const isCompleted = completed.has(item.id);
          const isHighPriority = item.priority === 'High';

          return (
            <div 
              key={item.id}
              onClick={() => toggleExpand(item.id)}
              className={`bg-white rounded-xl border-l-4 shadow-sm transition-all cursor-pointer group ${
                isCompleted 
                  ? 'border-l-green-500 border-y border-r border-slate-200 opacity-75' 
                  : expanded === item.id
                    ? 'border-l-indigo-600 border-y border-r border-indigo-200 ring-4 ring-indigo-50/50'
                    : isHighPriority 
                      ? 'border-l-red-500 border-y border-r border-slate-200 hover:border-r-red-200'
                      : 'border-l-slate-300 border-y border-r border-slate-200 hover:border-r-slate-300'
              }`}
            >
              <div className="p-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full transition-colors ${
                      isCompleted ? 'bg-green-100' : 'bg-slate-50 group-hover:bg-slate-100'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="text-green-600" size={24} /> : item.icon}
                    </div>
                    
                    <div>
                      <h3 className={`font-bold text-lg leading-tight mb-1 ${
                        isCompleted ? 'text-slate-500 line-through' : 'text-slate-800'
                      }`}>
                        {item.title}
                      </h3>
                      {isHighPriority && !isCompleted && (
                        <span className="inline-block px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wide rounded mr-2">
                          Kritike
                        </span>
                      )}
                      {!expanded && !isCompleted && (
                        <p className="text-xs text-slate-500 mt-1 truncate max-w-[200px] md:max-w-md">
                           {item.action}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-slate-400 group-hover:text-slate-600 transition-transform duration-300">
                    {expanded === item.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {/* Expanded Content */}
                <div className={`grid transition-all duration-300 ease-in-out ${
                  expanded === item.id ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'
                }`}>
                  <div className="overflow-hidden">
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mb-4 text-sm">
                      <div className="flex items-start gap-2 mb-2">
                         <Eye size={16} className="text-red-500 mt-0.5 shrink-0" />
                         <span className="font-bold text-slate-700">Pse është rrezik?</span>
                      </div>
                      <p className="text-slate-600 ml-6">{item.risk}</p>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-2 text-indigo-700 font-medium text-sm bg-indigo-50 px-3 py-1.5 rounded-md w-fit">
                         <MapPin size={14} /> Path: <span className="font-mono">{item.action}</span>
                      </div>
                      <p className="text-slate-700 text-sm md:text-base leading-relaxed pl-1">
                        {item.details}
                      </p>
                    </div>

                    <button
                      onClick={(e) => toggleComplete(item.id, e)}
                      className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                        isCompleted 
                          ? 'bg-slate-100 text-slate-500 hover:bg-slate-200' 
                          : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg hover:shadow-xl active:scale-95'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle2 size={18} />
                          Shëno si të pakryer
                        </>
                      ) : (
                        'Shëno si të Përfunduar'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div className="mt-8 text-center p-4">
           <p className="text-xs text-slate-400">
             Këto ndryshime nuk njoftojnë askënd, por abuzuesi mund të vërejë se nuk mund t'ju shohë më në Find My.
           </p>
        </div>
      </div>
    </div>
  );
};

export default DigitalSafety;
