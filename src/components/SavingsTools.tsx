import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { Calculator, ShieldCheck, PieChart as PieChartIcon, CheckCircle2, AlertCircle, Wallet, Banknote, Trash2, EyeOff, Plus, History } from 'lucide-react';

const COLORS = ['#0d9488', '#f59e0b', '#6366f1']; // Teal, Amber, Indigo

const SavingsTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'budget' | 'freedom' | 'stash' | 'loan'>('budget');

  // --- Budget State (Persisted) ---
  const [income, setIncome] = useState<string>(() => localStorage.getItem('haven_budget_income') || '');
  const [budgetData, setBudgetData] = useState<any[]>([]);

  // --- Freedom Fund State (Persisted) ---
  const [freedomWage, setFreedomWage] = useState<string>(() => localStorage.getItem('haven_freedom_wage') || '');
  const [childrenCount, setChildrenCount] = useState<string>(() => localStorage.getItem('haven_freedom_children') || '0');
  const [isCapital, setIsCapital] = useState<boolean>(() => {
    const saved = localStorage.getItem('haven_freedom_is_capital');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [freedomResult, setFreedomResult] = useState<any>(null);

  // --- Secret Stash State (Persisted) ---
  const [stashBalance, setStashBalance] = useState<number>(() => {
    const saved = localStorage.getItem('haven_stash_balance');
    return saved ? parseFloat(saved) : 0;
  });
  const [stashInput, setStashInput] = useState<string>('');
  const [stashHistory, setStashHistory] = useState<{ id: number, amount: number, date: string, note: string }[]>(() => {
    const saved = localStorage.getItem('haven_stash_history');
    return saved ? JSON.parse(saved) : [];
  });

  // --- Loan Calculator State (Persisted) ---
  const [loanAmount, setLoanAmount] = useState<string>(() => localStorage.getItem('haven_loan_amount') || '');
  const [interestRate, setInterestRate] = useState<string>(() => localStorage.getItem('haven_loan_interest') || '6.5');
  const [loanTerm, setLoanTerm] = useState<string>(() => localStorage.getItem('haven_loan_term') || '36');
  const [loanResult, setLoanResult] = useState<{ monthly: number, total: number, interest: number } | null>(null);

  // --- Persistence Effects ---
  useEffect(() => { localStorage.setItem('haven_budget_income', income); }, [income]);
  
  useEffect(() => { localStorage.setItem('haven_freedom_wage', freedomWage); }, [freedomWage]);
  useEffect(() => { localStorage.setItem('haven_freedom_children', childrenCount); }, [childrenCount]);
  useEffect(() => { localStorage.setItem('haven_freedom_is_capital', JSON.stringify(isCapital)); }, [isCapital]);

  useEffect(() => { localStorage.setItem('haven_stash_balance', stashBalance.toString()); }, [stashBalance]);
  useEffect(() => { localStorage.setItem('haven_stash_history', JSON.stringify(stashHistory)); }, [stashHistory]);

  useEffect(() => { localStorage.setItem('haven_loan_amount', loanAmount); }, [loanAmount]);
  useEffect(() => { localStorage.setItem('haven_loan_interest', interestRate); }, [interestRate]);
  useEffect(() => { localStorage.setItem('haven_loan_term', loanTerm); }, [loanTerm]);


  // --- 50/30/20 Calculator Logic ---
  const calculateBudget = () => {
    const inc = parseFloat(income);
    if (isNaN(inc) || inc <= 0) return;

    const needs = inc * 0.5;
    const wants = inc * 0.3;
    const savings = inc * 0.2;

    setBudgetData([
      { name: 'Nevoja (50%)', value: needs, desc: 'Qira, Ushqim, Fatura' },
      { name: 'Dëshira (30%)', value: wants, desc: 'Argëtim, Kafe, Rroba' },
      { name: 'Kursime (20%)', value: savings, desc: 'Fondi i Emergjencës' },
    ]);
  };

  // --- Freedom Fund Logic ---
  const calculateFreedomFund = () => {
    const wage = parseFloat(freedomWage);
    const children = parseInt(childrenCount) || 0;

    if (isNaN(wage) || wage <= 0) return;

    const rentCost = isCapital ? 280 : 160; 
    const adultLivingCost = 220; 
    const childCost = 100; 

    const monthlySurvivalBudget = rentCost + adultLivingCost + (children * childCost);
    const movingCosts = (rentCost * 2) + 100; 
    const safetyMonths = 6;
    const emergencyFund = monthlySurvivalBudget * safetyMonths;
    const totalGoal = movingCosts + emergencyFund;
    const canAffordMonthly = wage >= monthlySurvivalBudget;
    const monthlyGap = monthlySurvivalBudget - wage;

    setFreedomResult({
      monthlySurvivalBudget,
      movingCosts,
      emergencyFund,
      totalGoal,
      canAffordMonthly,
      monthlyGap,
      rentCost
    });
  };

  // --- Secret Stash Logic ---
  const addToStash = () => {
    const amount = parseFloat(stashInput);
    if (isNaN(amount) || amount <= 0) return;

    const newItem = {
      id: Date.now(),
      amount: amount,
      date: new Date().toLocaleDateString('sq-AL'),
      note: 'Shtim Manual'
    };

    setStashBalance(prev => prev + amount);
    setStashHistory(prev => [newItem, ...prev]);
    setStashInput('');
  };

  const wipeStashData = () => {
    // Clear state
    setStashBalance(0);
    setStashHistory([]);
    setStashInput('');
    
    // Force clear localStorage immediately
    localStorage.removeItem('haven_stash_balance');
    localStorage.removeItem('haven_stash_history');
  };

  // --- Loan Calculator Logic ---
  const calculateLoan = () => {
    const P = parseFloat(loanAmount);
    const r = parseFloat(interestRate) / 100 / 12; // Monthly interest rate
    const n = parseFloat(loanTerm); // Number of months

    if (isNaN(P) || isNaN(r) || isNaN(n) || P <= 0) return;

    // EMI Formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    setLoanResult({
      monthly: emi,
      total: totalPayment,
      interest: totalInterest
    });
  };

  // Auto-calculate on mount if data exists
  useEffect(() => {
    if (income) calculateBudget();
    if (freedomWage) calculateFreedomFund();
    if (loanAmount) calculateLoan();
  }, []); // Run once on mount to restore views

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 bg-indigo-50/50 rounded-t-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-indigo-100 p-2 rounded-lg">
            <Calculator className="text-indigo-600" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Mjetet e Kursimit</h2>
        </div>
        <p className="text-slate-600">
          Mjete inteligjente për të planifikuar pavarësinë tuaj financiare.
        </p>
      </div>

      {/* Scrollable Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('budget')}
          className={`flex-1 min-w-[120px] py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors relative whitespace-nowrap px-4 ${
            activeTab === 'budget' ? 'text-indigo-600 bg-indigo-50/30' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <PieChartIcon size={18} />
          Buxheti
          {activeTab === 'budget' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600" />}
        </button>
        <button
          onClick={() => setActiveTab('freedom')}
          className={`flex-1 min-w-[120px] py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors relative whitespace-nowrap px-4 ${
            activeTab === 'freedom' ? 'text-teal-600 bg-teal-50/30' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <ShieldCheck size={18} />
          Fondi i Lirisë
          {activeTab === 'freedom' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-600" />}
        </button>
        <button
          onClick={() => setActiveTab('stash')}
          className={`flex-1 min-w-[120px] py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors relative whitespace-nowrap px-4 ${
            activeTab === 'stash' ? 'text-pink-600 bg-pink-50/30' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <Wallet size={18} />
          Arka Sekrete
          {activeTab === 'stash' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-pink-600" />}
        </button>
        <button
          onClick={() => setActiveTab('loan')}
          className={`flex-1 min-w-[120px] py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors relative whitespace-nowrap px-4 ${
            activeTab === 'loan' ? 'text-blue-600 bg-blue-50/30' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <Banknote size={18} />
          Kredia
          {activeTab === 'loan' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />}
        </button>
      </div>

      <div className="p-6 overflow-y-auto bg-slate-50 flex-1">
        {/* TAB 1: BUDGET */}
        {activeTab === 'budget' && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Të Ardhurat Mujore (€)
              </label>
              <div className="flex gap-4">
                <input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  placeholder="Shkruani pagën tuaj (p.sh. 450)"
                  className="flex-1 p-3 bg-white text-slate-900 placeholder:text-slate-500 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <button
                  onClick={calculateBudget}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 rounded-xl font-medium transition-colors"
                >
                  Llogarit
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                *Ky mjet ndan të ardhurat tuaja sipas rregullit standard financiar.
              </p>
            </div>

            {budgetData.length > 0 && (
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={budgetData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {budgetData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip formatter={(value: number) => '€' + value.toLocaleString()} />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-4">
                  {budgetData.map((item, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[idx] }} 
                        />
                        <div>
                          <p className="font-bold text-slate-800">{item.name}</p>
                          <p className="text-xs text-slate-500">{item.desc}</p>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-lg text-slate-700">
                        €{item.value.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: FREEDOM FUND */}
        {activeTab === 'freedom' && (
          <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
            {!freedomResult && (
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
                <div className="bg-teal-50 p-4 rounded-lg border border-teal-100 mb-4">
                  <h3 className="font-bold text-teal-800 flex items-center gap-2 mb-1">
                    <ShieldCheck size={20} />
                    Çfarë është Fondi i Lirisë?
                  </h3>
                  <p className="text-sm text-teal-700">
                    Ne nuk do t'ju pyesim sa "doni" të kurseni. Ne do të llogarisim sa <strong>ju nevojiten</strong> realisht për të jetuar vetëm dhe të sigurt në Kosovë, bazuar në pagën tuaj.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Të Ardhurat Tuaja Mujore (€)
                  </label>
                  <input
                    type="number"
                    value={freedomWage}
                    onChange={(e) => setFreedomWage(e.target.value)}
                    placeholder="p.sh. 500"
                    className="w-full p-3 bg-white text-slate-900 placeholder:text-slate-500 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Numri i Fëmijëve
                    </label>
                    <select
                      value={childrenCount}
                      onChange={(e) => setChildrenCount(e.target.value)}
                      className="w-full p-3 bg-white text-slate-900 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    >
                      {[0, 1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Zona e Banimit
                    </label>
                    <select
                      value={isCapital ? 'tirana' : 'other'}
                      onChange={(e) => setIsCapital(e.target.value === 'tirana')}
                      className="w-full p-3 bg-white text-slate-900 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    >
                      <option value="tirana">Prishtinë (Kryeqytet)</option>
                      <option value="other">Qytet Tjetër</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={calculateFreedomFund}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg mt-4"
                >
                  <Calculator size={20} />
                  Llogarit Fondin e Sigurisë
                </button>
              </div>
            )}

            {freedomResult && (
              <div className="space-y-6">
                {/* Result Cards */}
                <div className="grid md:grid-cols-2 gap-4">
                   <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                      <div className="relative z-10">
                        <p className="text-slate-300 text-sm font-medium mb-1 uppercase tracking-wider">Objektivi Kryesor (6 Muaj)</p>
                        <h3 className="text-3xl font-bold mb-2 text-teal-400">
                          €{freedomResult.totalGoal.toLocaleString()}
                        </h3>
                        <p className="text-xs text-slate-400">
                           Kjo shumë mbulon qiranë, lëvizjen dhe shpenzimet për 6 muaj pa punë. Kjo është siguria absolute.
                        </p>
                      </div>
                      <ShieldCheck className="absolute -bottom-4 -right-4 text-slate-700 opacity-50" size={100} />
                   </div>

                   <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-600 font-medium">Kosto për të Lëvizur</span>
                        <span className="font-bold text-slate-900">€{freedomResult.movingCosts.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full mb-4">
                        <div className="bg-orange-400 h-2 rounded-full w-full opacity-70"></div>
                      </div>
                      
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-600 font-medium">Shpenzime Mujore (Min)</span>
                        <span className="font-bold text-slate-900">€{freedomResult.monthlySurvivalBudget.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full">
                        <div className="bg-teal-500 h-2 rounded-full w-full opacity-70"></div>
                      </div>
                      <p className="text-xs text-slate-400 mt-3 text-right">
                        *Përfshin qiranë (€{freedomResult.rentCost.toLocaleString()}) + ushqim/fatura
                      </p>
                   </div>
                </div>

                {/* Reality Check Analysis */}
                <div className={`p-6 rounded-xl border ${freedomResult.canAffordMonthly ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full shrink-0 ${freedomResult.canAffordMonthly ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                      {freedomResult.canAffordMonthly ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                    </div>
                    <div>
                      <h4 className={`text-lg font-bold mb-1 ${freedomResult.canAffordMonthly ? 'text-green-800' : 'text-orange-800'}`}>
                        {freedomResult.canAffordMonthly ? "Paga juaj e mbulon jetesën!" : "Kujdes: Paga nuk mjafton për shpenzimet minimale"}
                      </h4>
                      <p className={`text-sm leading-relaxed ${freedomResult.canAffordMonthly ? 'text-green-700' : 'text-orange-800'}`}>
                        {freedomResult.canAffordMonthly 
                          ? `Me pagën tuaj prej €${parseFloat(freedomWage).toLocaleString()}, ju mund t'i përballoni shpenzimet mujore prej €${freedomResult.monthlySurvivalBudget.toLocaleString()} dhe ju mbeten €${Math.abs(freedomResult.monthlyGap).toLocaleString()} për të kursyer.`
                          : `Aktualisht, shpenzimet e vlerësuara (€${freedomResult.monthlySurvivalBudget.toLocaleString()}) janë më të larta se paga juaj. Ju mungojnë rreth €${Math.abs(freedomResult.monthlyGap).toLocaleString()} në muaj. Do t'ju duhet ndihmë shtesë nga organizatat ose një burim tjetër të ardhurash para se të largoheni.`
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setFreedomResult(null)}
                  className="w-full py-3 text-slate-500 hover:text-slate-700 font-medium"
                >
                  Rillogarit
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SECRET STASH (ARKA SEKRETE) */}
        {activeTab === 'stash' && (
          <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
            <div className="bg-pink-50 border border-pink-100 p-4 rounded-xl flex gap-3">
               <div className="bg-pink-100 p-2 rounded-full h-fit">
                 <EyeOff className="text-pink-600" size={20} />
               </div>
               <div>
                 <h3 className="font-bold text-pink-800 text-sm">Mbajeni Sekret</h3>
                 <p className="text-xs text-pink-700 mt-1">
                   Ky mjet ju ndihmon të gjurmoni paratë që keni fshehur fizikisht në shtëpi. 
                   Të dhënat ruhen vetëm në këtë shfletues. Përdorni butonin e kuq për të fshirë gjithçka menjëherë.
                 </p>
               </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
               <p className="text-slate-500 font-medium mb-2 uppercase tracking-widest text-xs">Total i Grumbulluar</p>
               <div className="text-5xl font-bold text-slate-900 mb-6 font-mono">
                 €{stashBalance.toLocaleString()}
               </div>
               
               <div className="flex gap-2 max-w-sm mx-auto">
                 <input
                   type="number"
                   value={stashInput}
                   onChange={(e) => setStashInput(e.target.value)}
                   placeholder="Shuma (p.sh. 5)"
                   className="flex-1 p-3 bg-white text-slate-900 placeholder:text-slate-500 border border-slate-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none"
                 />
                 <button
                   onClick={addToStash}
                   className="bg-pink-600 hover:bg-pink-700 text-white px-4 rounded-xl transition-colors flex items-center justify-center"
                 >
                   <Plus size={24} />
                 </button>
               </div>
            </div>

            {stashHistory.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center gap-2">
                   <History size={14} className="text-slate-500" />
                   <span className="text-xs font-bold text-slate-500 uppercase">Historia e Shtimeve</span>
                </div>
                <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto">
                  {stashHistory.map((item) => (
                    <div key={item.id} className="px-4 py-3 flex justify-between items-center text-sm">
                      <span className="text-slate-600">{item.date}</span>
                      <span className="font-bold text-green-600">+ €{item.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={wipeStashData}
              className="w-full border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-300 p-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all mt-8"
            >
              <Trash2 size={20} />
              Fshih dhe Zero Të Dhënat (Emergjencë)
            </button>
          </div>
        )}

        {/* TAB 4: LOAN CALCULATOR (KREDIA) */}
        {activeTab === 'loan' && (
          <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3">
               <div className="bg-blue-100 p-2 rounded-full h-fit">
                 <Banknote className="text-blue-600" size={20} />
               </div>
               <div>
                 <h3 className="font-bold text-blue-800 text-sm">Planifikimi i Kredisë së Vogël</h3>
                 <p className="text-xs text-blue-700 mt-1">
                   Llogaritni këstet për një kredi konsumatore në Kosovë (për qira, mobilim, apo biznes të vogël).
                 </p>
               </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Shuma e Kredisë (€)</label>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  placeholder="p.sh. 2000"
                  className="w-full p-3 bg-white text-slate-900 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Interesi Vjetor (%)</label>
                  <input
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className="w-full p-3 bg-white text-slate-900 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Kohëzgjatja (Muaj)</label>
                  <select
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(e.target.value)}
                    className="w-full p-3 bg-white text-slate-900 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="12">12 Muaj (1 vit)</option>
                    <option value="24">24 Muaj (2 vite)</option>
                    <option value="36">36 Muaj (3 vite)</option>
                    <option value="48">48 Muaj (4 vite)</option>
                    <option value="60">60 Muaj (5 vite)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={calculateLoan}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-colors shadow-md"
              >
                Llogarit Këstin
              </button>
            </div>

            {loanResult && (
              <div className="bg-slate-800 text-white rounded-2xl p-6 shadow-lg">
                <div className="text-center mb-6">
                  <p className="text-slate-400 text-sm uppercase tracking-wide font-medium">Pagesa Mujore</p>
                  <h3 className="text-4xl font-bold text-blue-400 font-mono mt-2">
                    €{loanResult.monthly.toFixed(2)}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
                  <div>
                    <p className="text-slate-400 text-xs">Total për t'u paguar</p>
                    <p className="text-lg font-bold">€{loanResult.total.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 text-xs">Totali i Interesit</p>
                    <p className="text-lg font-bold text-orange-400">€{loanResult.interest.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavingsTools;
