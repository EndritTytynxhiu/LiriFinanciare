import React, { useState } from 'react';
import { findLocalResources } from '../services/openaiService';
import { MapPin, Search, ExternalLink, Building2, Phone, Navigation } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const ResourceFinder: React.FC = () => {
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ text: string, sources: any[] } | null>(null);

  const handleSearch = async () => {
    if (!location.trim()) return;
    setLoading(true);
    try {
      const data = await findLocalResources(location);
      setResults(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 h-full flex flex-col overflow-hidden">
      {/* Hero / Search Section */}
      <div className="relative p-8 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Navigation size={120} />
        </div>
        
        <div className="relative z-10 max-w-2xl mx-auto text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Gjeni Ndihmë Lokale</h2>
          <p className="text-indigo-100 text-sm md:text-base">
            Lidhuni me strehimore, ndihmë juridike dhe qendra mbështetëse pranë jush.
          </p>
        </div>

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="bg-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2">
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <MapPin className="text-slate-400 group-focus-within:text-purple-600 transition-colors" size={20} />
              </div>
              <input 
                type="text" 
                placeholder="Shkruani qytetin (p.sh. Prishtinë, Prizren)" 
                className="w-full pl-12 pr-4 py-4 bg-white text-slate-900 placeholder:text-slate-500 border-none outline-none focus:ring-0 text-lg rounded-xl"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button 
              onClick={handleSearch}
              disabled={loading || !location}
              className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-70 disabled:scale-100 flex items-center justify-center gap-2 md:w-auto w-full"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Duke kërkuar...</span>
                </>
              ) : (
                <>
                  <Search size={20} />
                  <span>Kërko</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="flex-1 overflow-y-auto bg-slate-50">
        {!results && !loading && (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center text-slate-400">
            <div className="bg-white p-6 rounded-full shadow-sm mb-4">
              <Building2 className="text-slate-300" size={48} />
            </div>
            <h3 className="text-slate-600 font-semibold text-lg mb-1">Filloni Kërkimin</h3>
            <p className="max-w-xs mx-auto text-sm">Shkruani vendndodhjen tuaj më sipër për të gjetur burime të verifikuara nga Google.</p>
          </div>
        )}

        {results && (
          <div className="p-6 max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="prose prose-slate max-w-none">
                <ReactMarkdown
                  components={{
                    h3: ({node, ...props}) => (
                      <div className="flex items-center gap-3 mt-8 mb-4 pb-2 border-b border-slate-100">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                          <Building2 size={18} className="text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 m-0" {...props} />
                      </div>
                    ),
                    p: ({node, ...props}) => <p className="text-slate-600 leading-relaxed mb-4" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-none space-y-2 mb-4 pl-0" {...props} />,
                    li: ({node, ...props}) => <li className="pl-4 border-l-2 border-indigo-200 text-slate-600" {...props} />,
                    hr: ({node, ...props}) => <div className="hidden" {...props} />, // Hide HRs as we use styled headers
                    a: ({node, ...props}) => {
                      const href = props.href || '';
                      if (href.startsWith('tel:')) {
                        return (
                          <a 
                            className="inline-flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 px-4 py-2 rounded-lg font-semibold transition-colors no-underline my-2" 
                            {...props}
                          >
                            <Phone size={16} />
                            {props.children}
                          </a>
                        );
                      }
                      return <a className="text-indigo-600 hover:text-indigo-800 underline font-medium" target="_blank" rel="noopener noreferrer" {...props} />;
                    }
                  }}
                >
                  {results.text}
                </ReactMarkdown>
              </div>
            </div>

            {results.sources.length > 0 && (
              <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                  <Search size={14} />
                  Burime Web
                </h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  {results.sources.map((source, i) => (
                    <a 
                      key={i}
                      href={source.uri} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all group"
                    >
                      <div className="bg-slate-50 p-2 rounded-lg group-hover:bg-indigo-50 transition-colors">
                        <ExternalLink size={16} className="text-slate-400 group-hover:text-indigo-500" />
                      </div>
                      <span className="truncate font-medium text-slate-700 group-hover:text-indigo-700 text-sm">
                        {source.title}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceFinder;