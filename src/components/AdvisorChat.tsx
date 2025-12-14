import React, { useState, useRef, useEffect } from 'react';
import { Send, Shield, User, Bot, AlertTriangle } from 'lucide-react';
import { ChatMessage } from '../types';
import { chatWithAdvisor } from '../services/openaiService';
import ReactMarkdown from 'react-markdown';

const AdvisorChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Përshëndetje. Jam këtu për t'ju ndihmuar të lundroni në vështirësi financiare në mënyrë të sigurt. Mund të më pyesni për hapjen e një llogarie bankare private, kontrollin e raportit të kredisë ose për të kuptuar të drejtat tuaja financiare. Çdo gjë që diskutojmë është private brenda kësaj seance."
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Capture the current input
    const userText = input;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: userText
    };

    // Update UI immediately
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Create history from ALL previous messages
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await chatWithAdvisor(history, userText);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText || "Më vjen keq, nuk munda të gjeneroj një përgjigje. Ju lutemi provoni përsëri."
      };
      
      setMessages(prev => [...prev, botMsg]);
    } catch (error: any) {
      console.error("Chat UI Error:", error);
      
      // DEBUG MODE: Show the EXACT error message from the system
      const rawError = error?.message || JSON.stringify(error) || "Unknown Error";
      
      // Construct a very visible error message
      const errorMessage = `**TECHNICAL ERROR:**
      
${rawError}

---
*Ju lutemi dërgoni një screenshot të këtij gabimi.*
`;

      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: errorMessage,
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] md:h-[600px] bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
      <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center gap-3">
        <div className="bg-purple-100 p-2 rounded-full">
          <Shield className="text-purple-600" size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800">Këshilltar i Sigurt</h3>
          <p className="text-xs text-slate-500">Mundësuar nga AI • Seancë Private</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'model' && (
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot size={16} className="text-white" />
              </div>
            )}
            
            <div 
              className={`max-w-[85%] md:max-w-[70%] p-3 md:p-4 rounded-2xl text-sm md:text-base leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-purple-600 text-white rounded-tr-none' 
                  : msg.isError 
                    ? 'bg-red-50 border border-red-200 text-red-700 rounded-tl-none font-mono text-xs'
                    : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'
              }`}
            >
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center flex-shrink-0 mt-1">
                <User size={16} className="text-slate-600" />
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
              <Bot size={16} className="text-white" />
            </div>
            <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-200">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Bëni një pyetje..."
            className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            disabled={isLoading}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-2 text-center flex items-center justify-center gap-1">
          <AlertTriangle size={10} />
           AI mund të bëjë gabime. Verifikoni informacionet e rëndësishme.
        </p>
      </div>
    </div>
  );
};

export default AdvisorChat;