import React, { useState, useEffect } from 'react';
import { getFinancialEducationResources } from '../services/openaiService';
import { BookOpen, GraduationCap, ExternalLink, PlayCircle, Youtube, Search } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const CourseLibrary: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ text: string, sources: any[] } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const result = await getFinancialEducationResources();
      setData(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Filter sources based on search term
  const uniqueSources = data?.sources?.filter((source, index, self) =>
    index === self.findIndex((t) => t.uri === source.uri)
  ) || [];

  const filteredSources = uniqueSources.filter(source => 
    source.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 h-full flex flex-col">
      <div className="p-6 border-b border-slate-100 bg-teal-50/50 rounded-t-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-teal-100 p-2 rounded-lg">
            <GraduationCap className="text-teal-600" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Edukimi Financiar</h2>
        </div>
        
        {/* White Search Bar Feature */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Kërko video (p.sh. buxheti, kursime)..." 
            className="w-full pl-10 pr-4 py-3 bg-white text-slate-900 placeholder:text-slate-500 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
        {loading && !data && (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-4">
            <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
            <p>Duke kërkuar videot...</p>
          </div>
        )}

        {data && (
          <div className="space-y-6">
            {/* The Intro Text from AI - Only show if not searching or if search yields results to keep context */}
            {!searchTerm && (
              <div className="text-slate-700 bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                <ReactMarkdown
                  components={{
                    h3: ({node, ...props}) => <h3 className="text-xl font-bold text-slate-900 mt-4 mb-2" {...props} />,
                    p: ({node, ...props}) => <p className="text-slate-600 mb-2 leading-relaxed" {...props} />,
                    a: ({node, ...props}) => (
                      <a 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:underline font-medium inline-flex items-center gap-1"
                        {...props}
                      >
                        {props.children}
                        <ExternalLink size={12} />
                      </a>
                    )
                  }}
                >
                  {data.text}
                </ReactMarkdown>
              </div>
            )}

            {/* The Real Links from Search Grounding */}
            <div className="space-y-4">
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                   <Youtube className="text-red-600" size={24} />
                   {searchTerm ? 'Rezultatet e Kërkimit' : 'Videot e Sugjeruara'}
                </h3>
                
                {filteredSources.length > 0 ? filteredSources.map((source, i) => {
                  const isYoutube = source.uri.includes('youtube.com') || source.uri.includes('youtu.be');
                  return (
                    <a 
                      key={i}
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className={`block w-full p-4 rounded-xl border-2 transition-all group no-underline
                        ${isYoutube 
                          ? 'bg-white border-red-100 hover:border-red-500 hover:shadow-md' 
                          : 'bg-white border-slate-200 hover:border-teal-500 hover:shadow-md'
                        }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className={`mt-1 p-2 rounded-full flex-shrink-0 ${isYoutube ? 'bg-red-50 text-red-600' : 'bg-teal-50 text-teal-600'}`}>
                             {isYoutube ? <PlayCircle size={24} /> : <BookOpen size={24} />}
                          </div>
                          <div>
                            <h4 className={`font-bold text-lg leading-tight mb-1 ${isYoutube ? 'text-slate-900 group-hover:text-red-700' : 'text-slate-900 group-hover:text-teal-700'}`}>
                              {source.title}
                            </h4>
                            <p className="text-xs text-slate-500 font-mono truncate max-w-[200px] md:max-w-md">
                              {source.uri}
                            </p>
                            <span className={`inline-block mt-2 text-xs font-semibold px-2 py-1 rounded-md ${isYoutube ? 'bg-red-100 text-red-700' : 'bg-teal-100 text-teal-700'}`}>
                              {isYoutube ? 'Shiko Videon' : 'Lexo Burimin'}
                            </span>
                          </div>
                        </div>
                        <ExternalLink size={20} className="text-slate-300 group-hover:text-slate-500 flex-shrink-0" />
                      </div>
                    </a>
                  );
                }) : (
                  <div className="text-center p-8 bg-slate-100 rounded-xl border border-slate-200 border-dashed">
                    <p className="text-slate-500">
                      Nuk u gjetën video me termin "{searchTerm}".
                    </p>
                  </div>
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseLibrary;
