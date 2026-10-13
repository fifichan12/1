import React, { useState } from 'react';
import { tacticalAudio } from '../utils/audio';

interface TacticalRadioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChannelInfo {
  num: number;
  freq: string;
  label: string;
  role: string;
  color: string;
}

const PMR_CHANNELS: ChannelInfo[] = [
  { num: 1, freq: '446.00625 MHz', label: 'FOST CMD', role: 'Commandement & Stratégie', color: '#E87A1E' },
  { num: 2, freq: '446.01875 MHz', label: 'CQB ASSAULT', role: 'Breachers & Combat Rapproché', color: '#2ECC71' },
  { num: 3, freq: '446.03125 MHz', label: 'RECON / SCOUT', role: 'Éclaireurs & Snipers DMR', color: '#4AE183' },
  { num: 4, freq: '446.04375 MHz', label: 'MEDIC & LOG', role: 'Secours, Brancardage & Ravitaillement', color: '#38BDF8' },
  { num: 5, freq: '446.05625 MHz', label: 'ORGA STAFF', role: 'Liaison Arbitres & Sécurité Terrain', color: '#F59E0B' },
  { num: 6, freq: '446.06875 MHz', label: 'CONVOI // QG', role: 'Transports & Véhicules Fictifs', color: '#A855F7' },
  { num: 7, freq: '446.08125 MHz', label: 'RELAIS ALPHA', role: 'Écoute & Surveillance Périmètre', color: '#94A3B8' },
  { num: 8, freq: '446.09375 MHz', label: 'URGENCE ROE', role: 'Canal de Détresse / Arrêt de Jeu', color: '#E74C3C' },
];

export const TacticalRadioModal: React.FC<TacticalRadioModalProps> = ({ isOpen, onClose }) => {
  const [currentChannel, setCurrentChannel] = useState<ChannelInfo>(PMR_CHANNELS[0]);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [radioLog, setRadioLog] = useState<Array<{ sender: string; text: string; time: string; channel: number }>>([
    { sender: 'VIPER_01 (SL)', text: 'Tous éléments : point de ralliement Alpha sécurisé. Préparez passage chrony.', time: '08:15', channel: 1 },
    { sender: 'SPECTER_02', text: 'Bien reçu SL, brèche ouest sous surveillance.', time: '08:18', channel: 1 },
  ]);
  const [customMsg, setCustomMsg] = useState('');

  if (!isOpen) return null;

  const handleSelectChannel = (ch: ChannelInfo) => {
    tacticalAudio.playClick();
    setCurrentChannel(ch);
  };

  const handlePttDown = () => {
    tacticalAudio.playSquelch();
    setIsTransmitting(true);
  };

  const handlePttUp = () => {
    setIsTransmitting(false);
    tacticalAudio.playRogerBeep();
  };

  const handleSendQuickMessage = (text: string) => {
    tacticalAudio.playSquelch();
    setTimeout(() => {
      tacticalAudio.playRogerBeep();
    }, 250);

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setRadioLog((prev) => [
      {
        sender: 'OPÉRATEUR (VOUS)',
        text,
        time: timeStr,
        channel: currentChannel.num,
      },
      ...prev,
    ]);
  };

  const handleSendCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMsg.trim()) return;
    handleSendQuickMessage(customMsg.trim());
    setCustomMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-[#111315] border border-[#333537] rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header HUD */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#1A1D20] border-b border-[#333537]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#22262B] border border-[#E87A1E]/40 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#E87A1E] text-lg">
                radio
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-['Space_Grotesk'] text-sm font-bold uppercase tracking-wider text-[#E2E3DF]">
                  Émetteur-Récepteur PMR-446
                </span>
                <span className="px-1.5 py-0.2 bg-[#2ECC71]/20 text-[#2ECC71] text-[10px] font-mono rounded font-bold">
                  EN LIGNE
                </span>
              </div>
              <p className="font-mono text-[10px] text-[#8E9297]">
                PROTOCOLE RADIO MILITAIRE FOST // FRÉQUENCES HOMOLOGUÉES
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              tacticalAudio.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded bg-[#22262B] hover:bg-[#333537] text-[#8E9297] hover:text-[#E2E3DF] flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Radio Screen / Display */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          <div className="bg-[#0C0E10] border-2 border-[#282a2c] rounded p-4 relative font-mono shadow-inner">
            <div className="flex items-center justify-between text-[11px] text-[#8E9297] border-b border-[#282a2c] pb-2 mb-3">
              <span className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isTransmitting ? 'bg-[#E74C3C] animate-ping' : 'bg-[#2ECC71]'}`}></span>
                {isTransmitting ? 'TX >> TRANSMISSION EN COURS' : 'RX >> VEILLE RADIO ACTIVE'}
              </span>
              <span className="text-[#E87A1E] font-bold">PUISSANCE : 0.5W ERP (LÉGAL)</span>
              <span>BATTERIE : 96%</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-[10px] text-[#8E9297] uppercase tracking-widest">CANAL ACTIF SÉLECTIONNÉ</div>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl sm:text-4xl font-bold tracking-tight text-[#E2E3DF]">
                    CH-0{currentChannel.num}
                  </span>
                  <span className="text-lg font-bold" style={{ color: currentChannel.color }}>
                    {currentChannel.label}
                  </span>
                </div>
                <div className="text-xs text-[#AECFB2] mt-0.5">
                  {currentChannel.role}
                </div>
              </div>

              <div className="text-left sm:text-right bg-[#1A1D20] p-2.5 rounded border border-[#282a2c]">
                <div className="text-[10px] text-[#8E9297] uppercase">Fréquence Télémétrique</div>
                <div className="text-base font-bold text-[#E87A1E] tracking-wider">
                  {currentChannel.freq}
                </div>
                <div className="text-[10px] text-[#8E9297]">
                  Sous-porteuse CTCSS : 67.0 Hz
                </div>
              </div>
            </div>
          </div>

          {/* Channel selector buttons */}
          <div>
            <div className="text-xs font-mono uppercase text-[#8E9297] mb-2 flex items-center justify-between">
              <span>Sélecteur de Fréquence FOST (8 Canaux PMR)</span>
              <span className="text-[10px] text-[#AECFB2]">Cliquez pour syntoniser</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PMR_CHANNELS.map((ch) => {
                const isActive = ch.num === currentChannel.num;
                return (
                  <button
                    key={ch.num}
                    onClick={() => handleSelectChannel(ch)}
                    className={`p-2.5 rounded border text-left font-mono transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#1E2022] border-[#E87A1E] shadow-[0_0_10px_rgba(232,122,30,0.25)]'
                        : 'bg-[#16181A] border-[#282a2c] hover:border-[#4A5D4E] text-[#8E9297] hover:text-[#E2E3DF]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className={isActive ? 'text-[#E87A1E]' : ''}>CH-0{ch.num}</span>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ch.color }}></span>
                    </div>
                    <div className="text-[11px] font-semibold text-[#E2E3DF] truncate mt-0.5">
                      {ch.label}
                    </div>
                    <div className="text-[9px] text-[#8E9297] truncate">
                      {ch.freq}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Tactical Transmission buttons */}
          <div className="bg-[#1A1D20] p-3.5 rounded border border-[#282a2c]">
            <div className="text-xs font-mono uppercase text-[#8E9297] mb-2">
              Transmissions Rapides (Micro Squelch & Roger Beep)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                'Roger, bien reçu !',
                'Contact visuel hostile',
                'Besoin renfort / Medic',
                'Zone sécurisée, RAS'
              ].map((msg, i) => (
                <button
                  key={i}
                  onClick={() => handleSendQuickMessage(msg)}
                  className="px-2.5 py-1.5 bg-[#22262B] hover:bg-[#282a2c] border border-[#333537] hover:border-[#E87A1E] text-xs font-mono text-[#E2E3DF] rounded transition-all active:scale-95 text-center cursor-pointer truncate"
                  title={msg}
                >
                  {msg}
                </button>
              ))}
            </div>

            {/* Custom input */}
            <form onSubmit={handleSendCustom} className="mt-3 flex gap-2">
              <input
                type="text"
                placeholder="Rédiger une transmission tactique..."
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                className="flex-1 bg-[#111315] border border-[#333537] rounded px-3 py-1.5 text-xs font-mono text-[#E2E3DF] focus:border-[#E87A1E] focus:outline-none"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-[#E87A1E] text-[#111315] font-mono text-xs uppercase font-bold rounded hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">send</span>
                <span>Transmettre</span>
              </button>
            </form>
          </div>

          {/* Push To Talk Button (PTT) */}
          <div className="flex flex-col items-center justify-center p-3 bg-[#16181A] rounded border border-[#282a2c]">
            <button
              onMouseDown={handlePttDown}
              onMouseUp={handlePttUp}
              onTouchStart={handlePttDown}
              onTouchEnd={handlePttUp}
              className={`w-full max-w-xs py-3 px-6 rounded font-mono text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer select-none ${
                isTransmitting
                  ? 'bg-[#E74C3C] text-white shadow-[0_0_20px_rgba(231,76,60,0.6)] scale-98'
                  : 'bg-[#22262B] text-[#E87A1E] border border-[#E87A1E]/50 hover:bg-[#E87A1E] hover:text-[#111315]'
              }`}
            >
              <span className="material-symbols-outlined text-lg">
                {isTransmitting ? 'mic' : 'mic_none'}
              </span>
              <span>
                {isTransmitting ? 'TRANSMISSION EN COURS (PTT MAINTENU)' : 'MAINTENIR PUSH-TO-TALK (PTT)'}
              </span>
            </button>
            <span className="font-mono text-[10px] text-[#8E9297] mt-1.5">
              Simule le souffle radio & déclenche le Roger Beep militaire
            </span>
          </div>

          {/* Intercepted Log */}
          <div>
            <div className="text-xs font-mono uppercase text-[#8E9297] mb-2 flex items-center justify-between">
              <span>Flux d'Écoute Radio // Journal Réseau</span>
              <span className="text-[10px] text-[#8E9297]">Direct</span>
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {radioLog.map((log, idx) => (
                <div
                  key={idx}
                  className="bg-[#16181A] border-l-2 border-[#E87A1E] px-3 py-1.5 rounded-r text-xs font-mono flex items-start justify-between gap-2"
                >
                  <div>
                    <span className="text-[#E87A1E] font-bold mr-2">[{log.sender}]</span>
                    <span className="text-[#E2E3DF]">{log.text}</span>
                  </div>
                  <div className="text-[10px] text-[#8E9297] shrink-0">
                    CH-0{log.channel} • {log.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#16181A] border-t border-[#282a2c] flex items-center justify-between text-[11px] font-mono text-[#8E9297]">
          <span>Conforme réglementation ARCEP (PMR 446.0 - 446.2 MHz libre d'usage)</span>
          <button
            onClick={() => {
              tacticalAudio.playRogerBeep();
              onClose();
            }}
            className="text-[#E87A1E] hover:underline font-bold"
          >
            Fermer le Transmetteur
          </button>
        </div>
      </div>
    </div>
  );
};
