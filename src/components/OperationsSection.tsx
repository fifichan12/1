import React, { useState } from 'react';
import { OPERATIONS, OperationEvent } from '../data/fostData';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

interface OperationsSectionProps {
  operations?: OperationEvent[];
  onOpenEnrollModal: (opId: string) => void;
  onOpenOpordModal: (op: OperationEvent) => void;
}

export const OperationsSection: React.FC<OperationsSectionProps> = ({
  operations = OPERATIONS,
  onOpenEnrollModal,
  onOpenOpordModal
}) => {
  const { addItem } = useCart();
  const { userProfile } = useAuth();
  const [filter, setFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const filteredOps = filter === 'all'
    ? operations
    : operations.filter((op) => op.category === filter);

  // Dynamic monthly grid (October 2026, 31 days, starts on Thursday -> 3 empty cells)
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const startPadding = Array.from({ length: 3 }, (_, i) => 28 + i);

  return (
    <div className="w-full py-16 md:py-24 px-4 sm:px-8 md:px-16 bg-[#121416] relative">
      {/* Strategic Briefing Header */}
      <div className="flex flex-col gap-4 max-w-5xl mb-8">
        <div className="inline-flex items-center gap-2 self-start px-3 py-1 bg-[#1e2022] rounded border border-[#333537]">
          <span className="w-2 h-2 rounded-full bg-[#E87A1E] animate-ping"></span>
          <span className="font-mono text-xs uppercase text-[#E87A1E] font-bold tracking-widest">
            TACTICAL COMMAND OPS // SECTEUR RHÔNE-ALPES & MOSELLE
          </span>
        </div>

        <h1 className="font-['Space_Grotesk'] text-3xl sm:text-4xl md:text-5xl uppercase text-[#E2E3DF] tracking-tight font-bold">
          CALENDRIER OPÉRATIONNEL <span className="text-[#E87A1E]">//</span> DÉPLOIEMENTS & OP
        </h1>

        <p className="font-['Inter'] text-sm md:text-base text-[#8E9297] max-w-3xl leading-relaxed">
          Planification rigoureuse des simulations militaires MilSim, raids CQB nocturnes sous infra-rouge et sessions de drill tactique FOST. Consultez les ordres de mission (OPORD), auditez les jauges d'escouade et engagez votre créneau d'intervention.
        </p>

        {/* Quick Telemetry Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
          <div className="bg-[#1A1D20] p-3 rounded border border-[#282a2c] flex flex-col">
            <span className="font-mono text-[11px] text-[#8E9297] uppercase">OPS CE MOIS</span>
            <span className="font-['Space_Grotesk'] text-xl font-bold text-[#2ECC71]">
              {operations.filter(o => !o.isCompleted).length.toString().padStart(2, '0')} ACTIVE(S)
            </span>
            <span className="font-mono text-[10px] text-[#AECFB2]">
              {operations.filter(o => o.isCompleted).length} Terminée(s)
            </span>
          </div>
          <div className="bg-[#1A1D20] p-3 rounded border border-[#282a2c] flex flex-col">
            <span className="font-mono text-[11px] text-[#8E9297] uppercase">NORME CHRONY 0.20G</span>
            <span className="font-['Space_Grotesk'] text-xl font-bold text-[#E2E3DF]">350 / 450 FPS</span>
            <span className="font-mono text-[10px] text-[#8E9297]">AEG 1.14J / Bolt 1.88J</span>
          </div>
          <div className="bg-[#1A1D20] p-3 rounded border border-[#282a2c] flex flex-col">
            <span className="font-mono text-[11px] text-[#8E9297] uppercase">TARIFS SESSION</span>
            <span className="font-['Space_Grotesk'] text-xl font-bold text-[#E87A1E]">5€ OU 0€ MEMBRE</span>
            <span className="font-mono text-[10px] text-[#8E9297]">Billes Bio 100% requises</span>
          </div>
          <div className="bg-[#1A1D20] p-3 rounded border border-[#282a2c] flex flex-col">
            <span className="font-mono text-[11px] text-[#8E9297] uppercase">CANAL TACTIQUE QG</span>
            <span className="font-['Space_Grotesk'] text-xl font-bold text-[#E2E3DF]">PMR CH.01</span>
            <span className="font-mono text-[10px] text-[#AECFB2]">446.00625 MHz CTCSS 0</span>
          </div>
        </div>
      </div>

      {/* FILTER & VIEW CONTROLLER STRIP */}
      <div className="w-full bg-[#1A1D20] p-3 rounded border border-[#333537] mb-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 shadow-md">
        {/* Mission Categories */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="font-mono text-xs uppercase text-[#8E9297] hidden sm:inline mr-1">
            [THÉÂTRES D'OPÉRATIONS] :
          </span>
          {[
            { id: 'all', label: 'Tous les Théâtres' },
            { id: 'cqb-usine', label: 'CQB Usine' },
            { id: 'chasse-foret', label: "Chasse à l'Homme Forêt" },
            { id: 'exfiltration-civile', label: 'Exfiltration Civile' }
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilter(btn.id)}
              className={`px-3 py-1 font-mono text-xs uppercase rounded transition-all cursor-pointer ${
                filter === btn.id
                  ? 'bg-[#E87A1E] text-[#111315] font-bold shadow'
                  : 'bg-[#111315] text-[#8E9297] hover:text-[#E2E3DF] hover:bg-[#282a2c] border border-[#282a2c]'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* View Switcher: List vs Calendar */}
        <div className="flex items-center gap-1 self-end lg:self-auto bg-[#111315] p-1 rounded border border-[#282a2c]">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 font-mono text-xs uppercase rounded flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'list'
                ? 'bg-[#3B4D3F] text-[#E2E3DF] font-bold shadow-sm'
                : 'text-[#8E9297] hover:text-[#E2E3DF]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">view_agenda</span>
            <span>Briefings OPORD ({filteredOps.length})</span>
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-3 py-1 font-mono text-xs uppercase rounded flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'calendar'
                ? 'bg-[#3B4D3F] text-[#E2E3DF] font-bold shadow-sm'
                : 'text-[#8E9297] hover:text-[#E2E3DF]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">calendar_month</span>
            <span>Grille Mensuelle</span>
          </button>
        </div>
      </div>

      {/* VIEW 1 : DYNAMIC CALENDAR GRID */}
      {viewMode === 'calendar' && (
        <div className="bg-[#1A1D20] p-4 sm:p-6 rounded border border-[#333537] shadow-xl mb-12 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 pb-3 border-b border-[#282a2c] gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#E87A1E]">calendar_today</span>
              <h2 className="font-['Space_Grotesk'] text-lg md:text-xl uppercase font-bold text-[#E2E3DF]">
                GRILLE MENSUELLE DES ENGAGEMENTS // OCTOBRE 2026
              </h2>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono flex-wrap">
              <span className="flex items-center gap-1 text-[#2ECC71]">
                <span className="w-2 h-2 bg-[#2ECC71] rounded-full"></span> OUVERT (5€ / 0€ MEMBRE)
              </span>
              <span className="flex items-center gap-1 text-[#E87A1E]">
                <span className="w-2 h-2 bg-[#E87A1E] rounded-full"></span> DERNIÈRES PLACES
              </span>
              <span className="flex items-center gap-1 text-[#8E9297]">
                <span className="w-2 h-2 bg-[#8E9297] rounded-full"></span> TERMINÉE
              </span>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1.5 text-center font-mono text-xs text-[#8E9297] mb-2 font-bold">
            <div className="py-1">LUN</div>
            <div className="py-1">MAR</div>
            <div className="py-1">MER</div>
            <div className="py-1">JEU</div>
            <div className="py-1">VEN</div>
            <div className="py-1">SAM</div>
            <div className="py-1">DIM</div>
          </div>

          {/* Dynamic Days Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5 font-mono text-xs">
            {/* Previous month padding (hidden on mobile, shown on md+) */}
            {startPadding.map((pad) => (
              <div key={`pad-${pad}`} className="hidden md:flex min-h-[96px] bg-[#111315]/40 p-2 rounded opacity-30 flex-col justify-between border border-[#282a2c]/30">
                <span className="text-[#8E9297]">{pad}</span>
                <span className="text-[10px] text-[#555]">-</span>
              </div>
            ))}

            {/* Current Month Days (1 to 31) */}
            {daysInMonth.map((dayNum) => {
              const dayStr = dayNum.toString().padStart(2, '0');
              const dayOps = filteredOps.filter((o) => o.dayOfMonth === dayNum);
              const hasOp = dayOps.length > 0;

              if (!hasOp) {
                return (
                  <div
                    key={`day-${dayNum}`}
                    className="min-h-[96px] bg-[#111315]/70 border border-[#282a2c]/60 p-2 rounded flex flex-col justify-between hover:border-[#333537] transition-colors"
                  >
                    <span className="text-[#8E9297] font-semibold">{dayStr}</span>
                    <span className="text-[10px] text-[#333537]">•</span>
                  </div>
                );
              }

              // Day has one or more operations
              return (
                <div key={`day-${dayNum}`} className="space-y-1">
                  {dayOps.map((op) => {
                    const isDone = op.isCompleted;
                    const remaining = op.maxSlots - op.bookedSlots;
                    const isLow = remaining <= 6 && !isDone;

                    return (
                      <div
                        key={op.id}
                        onClick={() => {
                          if (isDone) {
                            onOpenOpordModal(op);
                          } else {
                            onOpenEnrollModal(op.id);
                          }
                        }}
                        className={`min-h-[96px] p-2 rounded flex flex-col justify-between cursor-pointer transition-all border shadow-sm ${
                          isDone
                            ? 'bg-[#15181a] border-[#333537] opacity-85 hover:border-[#2ECC71]'
                            : isLow
                            ? 'bg-[#1e2022] hover:bg-[#282a2c] border-[#E87A1E] shadow-[0_0_12px_rgba(232,122,30,0.2)]'
                            : 'bg-[#18211b] hover:bg-[#1e2b22] border-[#2ECC71]/60 shadow-[0_0_12px_rgba(46,204,113,0.15)]'
                        }`}
                        title={isDone ? `Mission Terminée : ${op.title}` : `Réserver pour le ${dayStr} Octobre (${remaining} places)`}
                      >
                        <div className="flex justify-between items-center">
                          <span className={`font-bold ${isDone ? 'text-[#8E9297]' : isLow ? 'text-[#E87A1E]' : 'text-[#2ECC71]'}`}>
                            {dayStr}
                          </span>
                          <span
                            className={`px-1 text-[9px] rounded font-bold uppercase ${
                              isDone
                                ? 'bg-[#282a2c] text-[#AECFB2] border border-[#2ECC71]/30'
                                : isLow
                                ? 'bg-[#E87A1E]/20 text-[#E87A1E]'
                                : 'bg-[#2ECC71]/20 text-[#2ECC71]'
                            }`}
                          >
                            {isDone ? 'TERMINÉE' : `${remaining} SLOTS`}
                          </span>
                        </div>

                        <div className="bg-[#111315]/90 p-1.5 rounded mt-1">
                          <p className={`font-mono text-[10px] truncate font-bold ${isDone ? 'text-[#8E9297] line-through' : 'text-[#E2E3DF]'}`}>
                            {op.categoryLabel.split(' ')[0]} {op.title.replace('OP ', '')}
                          </p>
                          <p className="text-[9px] text-[#8E9297] truncate">
                            {op.timeStr.split('-')[0].trim()} • {op.sector.split('(')[0].trim()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2 : OPORD DETAILED LIST CARDS */}
      {viewMode === 'list' && (
        <div className="flex flex-col gap-8 mb-12 animate-fadeIn">
          {filteredOps.map((op) => {
            const pct = Math.round((op.bookedSlots / op.maxSlots) * 100);
            const remaining = op.maxSlots - op.bookedSlots;

            return (
              <article
                key={op.id}
                className="bg-[#1A1D20] border border-[#333537] hover:border-[#E87A1E]/60 rounded p-6 shadow-xl relative overflow-hidden transition-all duration-300 group"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Image & Jauge Column (4 cols) */}
                  <div className="lg:col-span-4 flex flex-col gap-3">
                    <div className="relative w-full h-56 bg-[#111315] rounded overflow-hidden border border-[#282a2c]">
                      <img
                        src={op.image}
                        alt={op.altText}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-[#111315]/90 backdrop-blur-md rounded flex items-center gap-1 font-mono text-[11px] text-[#E87A1E] font-bold">
                        <span className="material-symbols-outlined text-xs">emergency</span>
                        {op.code}
                      </div>

                      <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-[#111315]/95 backdrop-blur-md p-2 rounded flex items-center justify-between font-mono text-xs border border-[#282a2c]">
                        <span className="text-[#8E9297]">JAUGE SLOTS :</span>
                        <span className="text-[#E2E3DF] font-bold">
                          {op.bookedSlots} / {op.maxSlots} JOUEURS
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-[#111315] h-2 rounded-full overflow-hidden border border-[#282a2c]">
                      <div
                        className={`h-full transition-all duration-500 ${
                          pct >= 85 ? 'bg-[#E74C3C]' : pct >= 70 ? 'bg-[#E87A1E]' : 'bg-[#2ECC71]'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center font-mono text-xs text-[#8E9297]">
                      <span>Capacité Faction</span>
                      <span className={`font-bold ${pct >= 85 ? 'text-[#E74C3C]' : 'text-[#E87A1E]'}`}>
                        {remaining} PLACES RESTANTES
                      </span>
                    </div>
                  </div>

                  {/* Operation Details Column (8 cols) */}
                  <div className="lg:col-span-8 flex flex-col justify-between h-full">
                    <div>
                      {op.isCompleted && (
                        <div className="mb-3 px-3 py-1.5 bg-[#14181a] border border-[#2ECC71]/40 rounded flex items-center justify-between text-xs font-mono">
                          <span className="flex items-center gap-1.5 text-[#2ECC71] font-bold">
                            <span className="material-symbols-outlined text-sm">verified</span>
                            MISSION TERMINÉE // CLÔTURÉE PAR LE COMMANDEMENT STAFF
                          </span>
                          <span className="text-[#8E9297] text-[10px]">DÉBRIEFING EFFECTUÉ</span>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-[#3B4D3F] font-mono text-xs text-[#AECFB2] rounded uppercase">
                            {op.categoryLabel}
                          </span>
                          <span className="px-2 py-0.5 bg-[#282a2c] font-mono text-xs text-[#8E9297] rounded uppercase">
                            {op.sector}
                          </span>
                        </div>
                        <span className={`font-mono text-xs uppercase font-bold ${op.isCompleted ? 'text-[#2ECC71]' : 'text-[#E87A1E]'}`}>
                          {op.isCompleted ? 'TERMINÉE' : op.statusText}
                        </span>
                      </div>

                      <h2 className="font-['Space_Grotesk'] text-2xl md:text-3xl uppercase text-[#E2E3DF] font-bold mb-2 tracking-tight">
                        {op.title}
                      </h2>

                      <p className="font-['Inter'] text-sm text-[#8E9297] mb-4 leading-relaxed">
                        {op.description}
                      </p>

                      {/* Operational Matrix Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 p-3.5 bg-[#141719] rounded border border-[#282a2c] mb-4 font-mono text-xs">
                        <div>
                          <span className="text-[#8E9297] block">CALENDRIER</span>
                          <span className="text-[#E2E3DF] font-bold">{op.dateStr}</span>
                          <span className="text-[#AECFB2] text-[10px] block">{op.timeStr}</span>
                        </div>
                        <div>
                          <span className="text-[#8E9297] block">SECTEUR</span>
                          <span className="text-[#E2E3DF] font-bold truncate block">{op.sector.split('(')[0].trim()}</span>
                          <span className="text-[#8E9297] text-[10px] block">{op.sectorSub}</span>
                        </div>
                        <div>
                          <span className="text-[#8E9297] block">RÈGLES MÉDIC</span>
                          <span className="text-[#E2E3DF] font-bold truncate block">{op.specs.medic.split('+')[0].trim()}</span>
                          <span className="text-[#2ECC71] text-[10px] block truncate">{op.specs.medic.split('+')[1] || 'Standard'}</span>
                        </div>
                        <div>
                          <span className="text-[#8E9297] block">MUNITIONS</span>
                          <span className="text-[#E2E3DF] font-bold truncate block">{op.specs.ammo.split('(')[0].trim()}</span>
                          <span className="text-[#E87A1E] text-[10px] block">Bio obligatoire</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Action & PAF */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-[#282a2c]">
                      <div className="flex items-center gap-3 self-start sm:self-auto">
                        <div className="flex flex-col">
                          <span className="font-mono text-[10px] text-[#8E9297] uppercase">RÉSERVATION SESSION</span>
                          <div className="flex items-baseline gap-2">
                            <span className="font-['Space_Grotesk'] text-2xl font-bold text-[#E87A1E]">
                              5,00 € <span className="text-xs font-normal text-[#8E9297]">/ non-membre</span>
                            </span>
                            <span className="px-2 py-0.5 bg-[#2ECC71]/20 text-[#2ECC71] font-mono text-xs font-bold rounded border border-[#2ECC71]/40">
                              0,00 € MEMBRE
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 w-full sm:w-auto">
                        <button
                          onClick={() => onOpenOpordModal(op)}
                          className="px-4 py-2 bg-[#1A1D20] hover:bg-[#282a2c] text-[#E2E3DF] border border-[#333537] rounded font-mono text-xs uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">description</span>
                          {op.isCompleted ? 'OPORD ARCHIVÉ' : 'OPORD (PDF)'}
                        </button>
                        {op.isCompleted ? (
                          <button
                            disabled
                            className="w-full sm:w-auto px-5 py-2 bg-[#282a2c] text-[#8E9297] font-mono text-xs uppercase font-bold rounded flex items-center justify-center gap-1.5 cursor-not-allowed opacity-80"
                          >
                            <span className="material-symbols-outlined text-sm">task_alt</span>
                            MISSION TERMINÉE
                          </button>
                        ) : (
                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button
                              onClick={() => {
                                const isMember = userProfile?.memberTier === 'TITULAIRE' || userProfile?.memberTier === 'PREMIUM';
                                addItem({
                                  id: `pass-op-${op.id}-${isMember ? 'member' : 'freelance'}`,
                                  productId: op.id,
                                  title: `Pass OP // ${op.title}`,
                                  category: 'EVENT_PASS',
                                  variant: isMember ? 'Pass Opérateur Titulaire F.O.S.T. (0,00 €)' : 'Pass Opération Freelance (5,00 €)',
                                  price: isMember ? 0 : 5,
                                  requiresAgeCheck: false,
                                  metadata: {
                                    opId: op.id,
                                    date: op.dateStr,
                                    location: op.specs.location
                                  }
                                });
                              }}
                              className="px-3.5 py-2 bg-[#1E2226] hover:bg-[#282a2c] text-[#2ECC71] border border-[#2ECC71]/40 hover:border-[#2ECC71] font-mono text-xs uppercase font-bold rounded flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                              title="Ajouter ce pass à mon panier d'achat"
                            >
                              <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                              <span>Panier ({userProfile?.memberTier ? '0 €' : '5 €'})</span>
                            </button>

                            <button
                              onClick={() => onOpenEnrollModal(op.id)}
                              className="w-full sm:w-auto px-4 py-2 bg-[#E87A1E] text-[#111315] font-mono text-xs uppercase font-bold tracking-wider rounded hover:brightness-110 active:scale-95 transition-all shadow-[0_0_12px_rgba(232,122,30,0.35)] flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                            >
                              <span className="material-symbols-outlined text-sm">how_to_reg</span>
                              <span>RÉSERVER [{remaining}]</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* CHRONOGRAPH STANDARDS TABLE SECTION */}
      <div className="bg-[#1A1D20] border border-[#333537] p-6 md:p-8 rounded shadow-xl mb-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#282a2c]">
          <div>
            <div className="flex items-center gap-2 text-[#E87A1E] mb-1">
              <span className="material-symbols-outlined text-lg">speed</span>
              <span className="font-mono text-xs font-bold uppercase tracking-wider">
                CONTRÔLE PASSAGE CHRONOGRAPHE OBLIGATOIRE
              </span>
            </div>
            <h3 className="font-['Space_Grotesk'] text-2xl uppercase text-[#E2E3DF] font-bold">
              BARÈME DE PUISSANCE & ENGAGEMENT FOST
            </h3>
          </div>
          <div className="bg-[#111315] px-3 py-1.5 rounded border border-[#282a2c] font-mono text-xs text-[#AECFB2]">
            MESURE EN JOULES // BILLES 0.20G DE RÉFÉRENCE
          </div>
        </div>

        {/* 4 Category Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* AEG ASSAUT */}
          <div className="bg-[#141719] p-4 rounded border border-[#282a2c] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[11px] text-[#8E9297]">CATÉGORIE 01</span>
                <span className="px-1.5 py-0.5 bg-[#3B4D3F] text-[#AECFB2] text-[10px] rounded font-mono font-bold">
                  ASSAUT
                </span>
              </div>
              <h4 className="font-['Space_Grotesk'] text-lg text-[#E2E3DF] font-bold mb-1">AEG / HPA ASSAUT</h4>
              <p className="font-['Inter'] text-xs text-[#8E9297] mb-3">Tir coup par coup et courtes rafales contrôlées en extérieur.</p>
            </div>
            <div className="pt-2 border-t border-[#282a2c]">
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-mono text-lg text-[#E87A1E] font-bold">350 FPS MAX</span>
                <span className="font-mono text-xs text-[#8E9297]">1.13 Joules</span>
              </div>
              <div className="text-[11px] font-mono text-[#2ECC71]">Distance min. : 0m (courtoisie CQB)</div>
            </div>
          </div>

          {/* DMR SOUTIEN */}
          <div className="bg-[#141719] p-4 rounded border border-[#282a2c] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[11px] text-[#8E9297]">CATÉGORIE 02</span>
                <span className="px-1.5 py-0.5 bg-[#282a2c] text-[#AECFB2] text-[10px] rounded font-mono font-bold">
                  ANTI-SNIPE
                </span>
              </div>
              <h4 className="font-['Space_Grotesk'] text-lg text-[#E2E3DF] font-bold mb-1">DMR / SOUTIEN</h4>
              <p className="font-['Inter'] text-xs text-[#8E9297] mb-3">Blocage mécanique semi-auto strict obligatoire sur réplique DMR.</p>
            </div>
            <div className="pt-2 border-t border-[#282a2c]">
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-mono text-lg text-[#E87A1E] font-bold">400 FPS MAX</span>
                <span className="font-mono text-xs text-[#8E9297]">1.48 Joules</span>
              </div>
              <div className="text-[11px] font-mono text-[#E87A1E]">Distance min. d'engagement : 15 mètres</div>
            </div>
          </div>

          {/* BOLT ACTION */}
          <div className="bg-[#141719] p-4 rounded border border-[#282a2c] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[11px] text-[#8E9297]">CATÉGORIE 03</span>
                <span className="px-1.5 py-0.5 bg-[#93000A]/30 text-[#ffb4ab] text-[10px] rounded font-mono font-bold">
                  SNIPER
                </span>
              </div>
              <h4 className="font-['Space_Grotesk'] text-lg text-[#E2E3DF] font-bold mb-1">BOLT ACTION MANUEL</h4>
              <p className="font-['Inter'] text-xs text-[#8E9297] mb-3">Réarmement au verrou manuel uniquement. Emport lunette téléscopique.</p>
            </div>
            <div className="pt-2 border-t border-[#282a2c]">
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-mono text-lg text-[#E87A1E] font-bold">450 FPS MAX</span>
                <span className="font-mono text-xs text-[#8E9297]">1.88 Joules</span>
              </div>
              <div className="text-[11px] font-mono text-[#E74C3C]">Distance min. d'engagement : 20 mètres</div>
            </div>
          </div>

          {/* BACKUP PISTOLET */}
          <div className="bg-[#141719] p-4 rounded border border-[#282a2c] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[11px] text-[#8E9297]">CATÉGORIE 04</span>
                <span className="px-1.5 py-0.5 bg-[#3B4D3F] text-[#B7CCB9] text-[10px] rounded font-mono font-bold">
                  BACKUP
                </span>
              </div>
              <h4 className="font-['Space_Grotesk'] text-lg text-[#E2E3DF] font-bold mb-1">PISTOLET (GBB / AEP)</h4>
              <p className="font-['Inter'] text-xs text-[#8E9297] mb-3">Arme de poing secondaire, obligatoire pour transitions d'angles et bâtiments.</p>
            </div>
            <div className="pt-2 border-t border-[#282a2c]">
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-mono text-lg text-[#2ECC71] font-bold">330 FPS MAX</span>
                <span className="font-mono text-xs text-[#8E9297]">1.00 Joule</span>
              </div>
              <div className="text-[11px] font-mono text-[#2ECC71]">Zéro distance minimale // Idéal CQB</div>
            </div>
          </div>
        </div>

        {/* Bio BB Guarantee */}
        <div className="p-4 bg-[#111315] rounded border border-[#282a2c] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#E87A1E] text-2xl shrink-0">verified</span>
            <div>
              <p className="font-['Inter'] text-sm text-[#E2E3DF] font-semibold">
                Billes biodégradables 100% certifiées obligatoires
              </p>
              <p className="font-['Inter'] text-xs text-[#8E9297]">
                Des tests de dissolution par solvant sont effectués de façon aléatoire par le corps d'arbitrage. Tout joueur utilisant des billes plastiques standards sera exclu immédiatement sans remboursement de PAF.
              </p>
            </div>
          </div>
          <a
            href="#recrutement"
            className="px-4 py-2 bg-[#1A1D20] hover:bg-[#282a2c] text-[#E2E3DF] border border-[#333537] rounded font-mono text-xs uppercase whitespace-nowrap transition-all"
          >
            Lire la Charte Fair-Play FOST
          </a>
        </div>
      </div>

      {/* TACTICAL FAQ ACCORDIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[#E87A1E]">
            <span className="material-symbols-outlined text-lg">help</span>
            <span className="font-mono text-xs font-bold uppercase">SUPPORT OPÉRATEUR & BRIEFING ACCÈS</span>
          </div>
          <h3 className="font-['Space_Grotesk'] text-2xl uppercase text-[#E2E3DF] font-bold">
            QUESTIONS FRÉQUENTES DES JOUEURS
          </h3>
          <p className="font-['Inter'] text-sm text-[#8E9297] leading-relaxed">
            Vous préparez votre premier déploiement avec la FOST ou souhaitez coordonner votre escouade ? Retrouvez les réponses fondamentales validées par le commandement.
          </p>
          <div className="p-4 bg-[#1A1D20] rounded border border-[#282a2c] flex flex-col gap-2">
            <span className="font-mono text-xs uppercase text-[#8E9297]">BESOIN D'UNE CONFIRMATION RADIO IMMÉDIATE ?</span>
            <p className="font-['Inter'] text-xs text-[#E2E3DF]">
              Rejoignez le salon de transmission Discord pour échanger directement avec les Marshalls avant le match.
            </p>
            <div className="flex items-center gap-2 pt-1 font-mono text-xs">
              <span className="px-2 py-0.5 bg-[#111315] text-[#2ECC71] rounded border border-[#2ECC71]/30">PMR 446 CH.01</span>
              <span className="px-2 py-0.5 bg-[#111315] text-[#E2E3DF] rounded border border-[#282a2c]">DISCORD FOST ACTIF</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col gap-3">
          <details className="group bg-[#1A1D20] border border-[#282a2c] rounded overflow-hidden p-4 open:bg-[#141719] transition-all">
            <summary className="flex justify-between items-center cursor-pointer list-none font-['Space_Grotesk'] text-base font-semibold text-[#E2E3DF]">
              <span>Comment venir si je suis débutant ou sans équipement ?</span>
              <span className="material-symbols-outlined text-[#E87A1E] group-open:rotate-180 transition-transform">expand_more</span>
            </summary>
            <p className="font-['Inter'] text-xs md:text-sm text-[#8E9297] mt-3 pt-2 border-t border-[#282a2c] leading-relaxed">
              Tous les débutants sont les bienvenus sur les sessions "Drill & Initiation". Vous pouvez réserver l'option "Pack Matériel Complet" (15€) qui comprend une réplique M4 AEG révisée, un masque de protection intégrale homologué EN166B, 2000 billes bio et un gilet tactique. Vous serez pris en charge par un vétéran de l'escouade dès le parking.
            </p>
          </details>

          <details className="group bg-[#1A1D20] border border-[#282a2c] rounded overflow-hidden p-4 open:bg-[#141719] transition-all">
            <summary className="flex justify-between items-center cursor-pointer list-none font-['Space_Grotesk'] text-base font-semibold text-[#E2E3DF]">
              <span>Quel équipement de protection oculaire est requis ?</span>
              <span className="material-symbols-outlined text-[#E87A1E] group-open:rotate-180 transition-transform">expand_more</span>
            </summary>
            <p className="font-['Inter'] text-xs md:text-sm text-[#8E9297] mt-3 pt-2 border-t border-[#282a2c] leading-relaxed">
              Le port de lunettes balistiques respectant la norme européenne EN166 Grade B (résistance à un impact de 120 m/s) ou MIL-PRF-32432 est non-négociable et obligatoire en zone de jeu en permanence. Les lunettes de bricolage ou sans norme certifiée sont strictement interdites. Masque rigide fortement conseillé pour protéger la denture en CQB.
            </p>
          </details>

          <details className="group bg-[#1A1D20] border border-[#282a2c] rounded overflow-hidden p-4 open:bg-[#141719] transition-all">
            <summary className="flex justify-between items-center cursor-pointer list-none font-['Space_Grotesk'] text-base font-semibold text-[#E2E3DF]">
              <span>Où se trouve le point de ralliement exact et le parking ?</span>
              <span className="material-symbols-outlined text-[#E87A1E] group-open:rotate-180 transition-transform">expand_more</span>
            </summary>
            <p className="font-['Inter'] text-xs md:text-sm text-[#8E9297] mt-3 pt-2 border-t border-[#282a2c] leading-relaxed">
              Pour des raisons de sécurité et de discrétion vis-à-vis des riverains, les coordonnées GPS précises (point Waze / Google Maps) et les consignes d'accès sont expédiées par email automatique aux seuls inscrits confirmés 48 heures avant l'opération.
            </p>
          </details>

          <details className="group bg-[#1A1D20] border border-[#282a2c] rounded overflow-hidden p-4 open:bg-[#141719] transition-all">
            <summary className="flex justify-between items-center cursor-pointer list-none font-['Space_Grotesk'] text-base font-semibold text-[#E2E3DF]">
              <span>Modalités d'annulation ou remboursement en cas d'imprévu ?</span>
              <span className="material-symbols-outlined text-[#E87A1E] group-open:rotate-180 transition-transform">expand_more</span>
            </summary>
            <p className="font-['Inter'] text-xs md:text-sm text-[#8E9297] mt-3 pt-2 border-t border-[#282a2c] leading-relaxed">
              L'annulation avec remboursement intégral ou report sur la partie suivante est acceptée jusqu'à 72h avant le briefing de l'OP via le formulaire de contact ou sur le canal Discord officiel. Passé ce délai, la PAF est acquise à l'association pour couvrir les frais d'intendance déjà engagés.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
};
