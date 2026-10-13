import React, { useState, useRef, useEffect } from 'react';
import { ShieldLogo } from './ShieldLogo';
import { tacticalAudio } from '../utils/audio';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const TacticalChatbotModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: "Bienvenue chez la F.O.S.T. ! Je suis votre opérateur de liaison tactique du QG. Posez-moi vos questions sur nos adhésions, nos 3 répliques Cerakote à 200€, les règles FPS/Chrony ou nos prochaines opérations MilSim à Rombas.",
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    tacticalAudio.playClick();
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query.trim(), history: historyPayload })
      });

      if (!res.ok) {
        throw new Error('Erreur réseau');
      }

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || "Transmission radio terminée. Pour toute précision, écrivez à fost.contact.off@gmail.com",
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
      tacticalAudio.playRogerBeep();
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: 'assistant',
        text: "Liaison radio temporairement perturbée. Notre bureau est directement joignable à fost.contact.off@gmail.com pour vous répondre sous 24h !",
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const QUICK_QUESTIONS = [
    "Comment adhérer à l'association ?",
    "Quels sont les tarifs 2026 ?",
    "Les 3 répliques à 200 € ?",
    "Quelles sont les limites FPS ?",
    "Où se situe le terrain ?"
  ];

  return (
    <>
      {/* FLOATING TRIGGER BUTTON (BOTTOM RIGHT) */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        {!isOpen && (
          <div className="hidden sm:flex items-center gap-2 bg-[#16181A]/95 text-[#E2E3DF] text-xs font-mono px-3 py-1.5 rounded-full border border-[#E87A1E]/50 shadow-[0_0_15px_rgba(232,122,30,0.25)] animate-bounce pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-[#2ECC71] animate-ping" />
            <span>Assistance QG en direct</span>
          </div>
        )}

        <button
          onClick={() => {
            tacticalAudio.playClick();
            setIsOpen(!isOpen);
          }}
          className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-[0_0_24px_rgba(232,122,30,0.4)] border-2 ${
            isOpen
              ? 'bg-[#E87A1E] text-[#111315] border-[#FFA640] scale-95'
              : 'bg-[#16181A] hover:bg-[#22262B] text-[#E87A1E] border-[#E87A1E] hover:scale-105'
          }`}
          title="Ouvrir le chatbot tactique QG FOST"
        >
          <span className="material-symbols-outlined text-2xl">
            {isOpen ? 'close' : 'support_agent'}
          </span>
          {!isOpen && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#2ECC71] border-2 border-[#111315] rounded-full animate-pulse" />
          )}
        </button>
      </div>

      {/* CHAT WINDOW */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] max-h-[620px] h-[82vh] bg-[#141618] border-2 border-[#E87A1E]/70 rounded-xl shadow-[0_12px_48px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden animate-fadeIn backdrop-blur-xl">
          {/* Top Tactical Header */}
          <div className="px-4 py-3 bg-[#1A1D20] border-b border-[#282a2c] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldLogo size={32} showGlow={true} />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-['Space_Grotesk'] text-sm font-bold uppercase tracking-wider text-[#E2E3DF]">
                    RADIO QG // ASSISTANT FOST
                  </span>
                  <span className="px-1.5 py-0.2 bg-[#2ECC71]/20 text-[#2ECC71] font-mono text-[9px] rounded font-bold border border-[#2ECC71]/40">
                    IA 3.8
                  </span>
                </div>
                <p className="font-mono text-[10px] text-[#8E9297] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2ECC71] animate-ping" />
                  <span>CANAL SÉCURISÉ :: ROMBAS-57120</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                tacticalAudio.playClick();
                setIsOpen(false);
              }}
              className="w-7 h-7 rounded bg-[#22262B] hover:bg-[#282a2c] text-[#8E9297] hover:text-[#E2E3DF] flex items-center justify-center cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>

          {/* Quick Questions Strip */}
          <div className="px-3 py-2 bg-[#111315] border-b border-[#282a2c] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {QUICK_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="shrink-0 px-2.5 py-1 bg-[#1A1D20] hover:bg-[#282a2c] hover:border-[#E87A1E] text-[#8E9297] hover:text-[#E2E3DF] border border-[#333537] rounded font-mono text-[10px] transition-all cursor-pointer truncate max-w-[170px]"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages Flow */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 font-mono text-xs scrollbar-thin">
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 text-[9px] text-[#8E9297] mb-1 px-1">
                    <span>{isUser ? 'OPÉRATEUR' : 'QG FOST'}</span>
                    <span>•</span>
                    <span>{m.timestamp}</span>
                  </div>

                  <div
                    className={`p-3 rounded-lg max-w-[88%] leading-relaxed ${
                      isUser
                        ? 'bg-[#E87A1E] text-[#111315] font-semibold rounded-tr-none shadow-md'
                        : 'bg-[#1E2226] text-[#E2E3DF] border border-[#282a2c] rounded-tl-none font-["Inter"] text-xs'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-1.5 text-[9px] text-[#8E9297] mb-1 px-1">
                  <span>QG FOST</span>
                  <span>•</span>
                  <span>TRANSMISSION EN COURS</span>
                </div>
                <div className="p-3 bg-[#1E2226] border border-[#E87A1E]/40 rounded-lg rounded-tl-none flex items-center gap-2 text-[#E87A1E] text-xs font-mono animate-pulse">
                  <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                  <span>Décryptage de la fréquence tactique...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input & Dispatcher */}
          <div className="p-3 bg-[#1A1D20] border-t border-[#282a2c]">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Posez votre question au QG FOST..."
                className="flex-1 bg-[#111315] text-[#E2E3DF] font-['Inter'] text-xs px-3.5 py-2.5 rounded-lg border border-[#333537] focus:border-[#E87A1E] focus:outline-none placeholder:text-[#6E7277]"
              />
              <button
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim()}
                className="px-4 py-2.5 bg-[#E87A1E] disabled:bg-[#333537] text-[#111315] disabled:text-[#8E9297] font-mono text-xs font-bold rounded-lg cursor-pointer disabled:cursor-not-allowed hover:brightness-110 transition-all flex items-center justify-center gap-1 shadow"
              >
                <span className="material-symbols-outlined text-base">send</span>
              </button>
            </div>
            <div className="mt-2 flex items-center justify-between text-[9px] font-mono text-[#8E9297]">
              <span>Association FOST Airsoft Squad // Rombas 57120</span>
              <a
                href="mailto:fost.contact.off@gmail.com"
                className="text-[#E87A1E] hover:underline"
              >
                fost.contact.off@gmail.com
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
