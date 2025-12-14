import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Fillimi', savings: 0 },
  { month: 'M1', savings: 150 },
  { month: 'M2', savings: 320 },
  { month: 'M3', savings: 500 },
  { month: 'M4', savings: 750 },
  { month: 'M5', savings: 1100 },
  { month: 'M6', savings: 1500 },
];

const SavingsChart: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
      <div className="mb-6 flex justify-between items-center">
        <div>
           <h3 className="text-lg font-bold text-slate-800">Parashikimi i Fondit të Lirisë</h3>
           <p className="text-sm text-slate-500">Vizualizimi i rrugës suaj për të kursyer €1,500</p>
        </div>
        <div className="text-right">
            <p className="text-2xl font-bold text-teal-600">€1,500</p>
            <p className="text-xs text-slate-400">Objektivi</p>
        </div>
      </div>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#64748b', fontSize: 12}} 
              tickFormatter={(value) => `€${value}`}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Area type="monotone" dataKey="savings" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#colorSavings)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-center text-slate-400 mt-4">
        *Bazuar në kursimin e rreth €5-10 çdo ditë. Hapat e vegjël mblidhen.
      </p>
    </div>
  );
};

export default SavingsChart;