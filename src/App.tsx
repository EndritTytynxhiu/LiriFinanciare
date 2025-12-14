import React, { useState } from 'react';
import { ShieldCheck, Map, LayoutDashboard, GraduationCap, PiggyBank, ShieldAlert, ArrowRight } from 'lucide-react';
import SafetyHeader from './components/SafetyHeader';
import AdvisorChat from './components/AdvisorChat';
import PlanGenerator from './components/PlanGenerator';
import ResourceFinder from './components/ResourceFinder';
import CourseLibrary from './components/CourseLibrary';
import SavingsChart from './components/SavingsChart';
import SavingsTools from './components/SavingsTools';
import DigitalSafety from './components/DigitalSafety';
import CalculatorDisguise from './components/CalculatorDisguise';
import PrivacyModal from './components/PrivacyModal';
import { ViewState } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  // Quick exit: Redirect to Google
  const handleQuickExit = () => {
    window.location.href = "https://www.google.com";
  };

  if (currentView === ViewState.CALCULATOR) {
    return <CalculatorDisguise onUnlock={() => setCurrentView(ViewState.HOME)} />;
  }

  const MenuCard = ({ 
    title, 
    desc, 
    icon: Icon, 
    colorClass, 
    bgClass, 
    onClick 
  }: { 
    title: string; 
    desc: string; 
    icon: any; 
    colorClass: string; 
    bgClass: string; 
    onClick: () => void 
  }) => (
    <button 
      onClick={onClick}
      className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-slate-200 transition-all duration-300 text-left relative overflow-hidden"
    >
      <div className={`absolute top-0 right-0 w-24 h-24 ${bgClass} rounded-bl-full opacity-10 group-hover:scale-110 transition-transform duration-500`}></div>
      
      <div className={`${bgClass} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300 shadow-sm`}>
        <Icon className={colorClass} size={28} />
      </div>
      
      <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-slate-900">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed mb-4">{desc}</p>
      
      <div className={`flex items-center gap-2 text-sm font-semibold ${colorClass} opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300`}>
        Hap Mjetin <ArrowRight size={16} />
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-teal-100">
      <SafetyHeader 
        onQuickExit={handleQuickExit} 
        onToggleDisguise={() => setCurrentView(ViewState.CALCULATOR)}
        onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
        currentView={currentView}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 pb-24 md:pb-8">
        {currentView === ViewState.HOME && (
          <div className="space-y-10 animate-fade-in">
             <header className="mb-8 pt-4">
               <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Liri Financiare</h1>
               <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                 Hapësira juaj e sigurt për fuqizimin financiar. Mjete diskrete dhe udhëzime eksperti për të ndërtuar rrugën tuaj drejt pavarësisë.
               </p>
             </header>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               <MenuCard 
                 title="Këshilltar AI"
                 desc="Bisedë private dhe e sigurt për të drejtat tuaja, bankat dhe sigurinë financiare."
                 icon={ShieldCheck}
                 colorClass="text-purple-600"
                 bgClass="bg-purple-100"
                 onClick={() => setCurrentView(ViewState.CHAT)}
               />

               <MenuCard 
                 title="Plan Veprimi"
                 desc="Gjeneroni një listë kontrolli të personalizuar hap pas hapi për situatën tuaj."
                 icon={LayoutDashboard}
                 colorClass="text-teal-600"
                 bgClass="bg-teal-100"
                 onClick={() => setCurrentView(ViewState.PLANNER)}
               />

               <MenuCard 
                 title="Mjetet e Kursimit"
                 desc="Llogaritës për buxhetin, kredinë dhe fondin e lirisë për të planifikuar ikjen."
                 icon={PiggyBank}
                 colorClass="text-orange-600"
                 bgClass="bg-orange-100"
                 onClick={() => setCurrentView(ViewState.TOOLS)}
               />

               <MenuCard 
                 title="Siguria Digjitale"
                 desc="Udhëzues kritik për të siguruar telefonin nga përgjimi dhe kontrolli."
                 icon={ShieldAlert}
                 colorClass="text-red-600"
                 bgClass="bg-red-100"
                 onClick={() => setCurrentView(ViewState.DIGITAL_SAFETY)}
               />

               <MenuCard 
                 title="Mësime Financiare"
                 desc="Bibliotekë me video dhe burime edukative për menaxhimin e parave."
                 icon={GraduationCap}
                 colorClass="text-indigo-600"
                 bgClass="bg-indigo-100"
                 onClick={() => setCurrentView(ViewState.COURSES)}
               />

               <MenuCard 
                 title="Ndihmë Lokale"
                 desc="Hartë e burimeve të verifikuara: strehimore, banka dhe ndihmë juridike."
                 icon={Map}
                 colorClass="text-blue-600"
                 bgClass="bg-blue-100"
                 onClick={() => setCurrentView(ViewState.RESOURCES)}
               />
             </div>
             
             <div className="mt-12">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-1 w-6 bg-slate-300 rounded-full"></div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pamje e Përgjithshme</span>
                </div>
                <SavingsChart />
             </div>
          </div>
        )}

        {currentView !== ViewState.HOME && (
          <div className="animate-fade-in h-full flex flex-col">
            <button 
              onClick={() => setCurrentView(ViewState.HOME)} 
              className="mb-6 text-slate-500 hover:text-slate-800 font-medium flex items-center gap-2 w-fit group px-4 py-2 rounded-lg hover:bg-white hover:shadow-sm transition-all"
            >
              <div className="bg-white border border-slate-200 p-1 rounded-md group-hover:border-slate-300">
                <ArrowRight size={14} className="rotate-180" />
              </div>
              Kthehu te Paneli
            </button>
            
            {currentView === ViewState.CHAT && <AdvisorChat />}
            {currentView === ViewState.PLANNER && <PlanGenerator />}
            {currentView === ViewState.TOOLS && <SavingsTools />}
            {currentView === ViewState.DIGITAL_SAFETY && <DigitalSafety />}
            {currentView === ViewState.COURSES && <CourseLibrary />}
            {currentView === ViewState.RESOURCES && <ResourceFinder />}
          </div>
        )}
      </main>

      {/* Mobile Navigation Bar */}
      <nav className="fixed bottom-0 w-full bg-white/90 backdrop-blur-md border-t border-slate-200 md:hidden flex justify-around py-4 px-2 z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => setCurrentView(ViewState.HOME)}
          className={`flex flex-col items-center gap-1 ${currentView === ViewState.HOME ? 'text-teal-600' : 'text-slate-400'}`}
        >
          <LayoutDashboard size={22} />
        </button>
        <button 
          onClick={() => setCurrentView(ViewState.CHAT)}
          className={`flex flex-col items-center gap-1 ${currentView === ViewState.CHAT ? 'text-purple-600' : 'text-slate-400'}`}
        >
          <ShieldCheck size={22} />
        </button>
        <button 
          onClick={() => setCurrentView(ViewState.TOOLS)}
          className={`flex flex-col items-center gap-1 ${currentView === ViewState.TOOLS ? 'text-orange-600' : 'text-slate-400'}`}
        >
          <PiggyBank size={22} />
        </button>
        <button 
          onClick={() => setCurrentView(ViewState.DIGITAL_SAFETY)}
          className={`flex flex-col items-center gap-1 ${currentView === ViewState.DIGITAL_SAFETY ? 'text-red-600' : 'text-slate-400'}`}
        >
          <ShieldAlert size={22} />
        </button>
        <button 
          onClick={() => setCurrentView(ViewState.RESOURCES)}
          className={`flex flex-col items-center gap-1 ${currentView === ViewState.RESOURCES ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <Map size={22} />
        </button>
      </nav>

      <PrivacyModal 
        isOpen={isPrivacyModalOpen} 
        onClose={() => setIsPrivacyModalOpen(false)} 
      />
    </div>
  );
};

export default App;