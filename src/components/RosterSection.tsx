import React, { useState } from 'react';
import { OPERATORS, Operator } from '../data/fostData';

interface RosterSectionProps {
  operators?: Operator[];
  onSelectOperator: (op: Operator) => void;
}

export const RosterSection: React.FC<RosterSectionProps> = ({
  operators = OPERATORS,
  onSelectOperator
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredOperators = categoryFilter === 'all'
    ? operators
    : operators.filter(op => op.category.toLowerCase() === categoryFilter.toLowerCase());

  return (
    <div className="w-full py-16 md:py-24 px-4 sm:px-8 md:px-16 bg-[#121416] relative">
      {/* Header with tactical category filters */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 bg-[#3B4D3F] font-mono text-xs text-[#AECFB2] rounded uppercase">
              Roster Officiel
            </span>
            <span className="font-mono text-xs text-[#8E9297]">
              // SECTION COMBAT ACTIF
            </span>
          </div>
          <h2 className="font-['Space_Grotesk'] text-3xl md:text-4xl uppercase tracking-tight text-[#E2E3DF] font-bold">
            L'Escouade des Opérateurs FOST
          </h2>
        </div>
        
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {['all', 'Commandement', 'CQB', 'Assaut', 'DMR'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 font-mono text-xs uppercase rounded transition-all cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-[#E87A1E] text-[#111315] font-bold shadow-md'
                  : 'bg-[#1A1D20] text-[#8E9297] hover:text-[#E2E3DF] hover:bg-[#282a2c] border border-[#333537]'
              }`}
            >
              {cat === 'all' ? 'Toute l\'Escouade (5)' : cat}
            </button>
          ))}
        </div>
      </div>

      <p className="font-['Inter'] text-sm text-[#8E9297] max-w-2xl mb-8 leading-relaxed">
        Profils individuels qualifiés. Discipline d'engagement, communication radio stricte et cohésion tactique sur tous les théâtres d'opérations. Cliquez sur un opérateur pour auditer son dossier complet.
      </p>

      {/* Grid of the 5 Operators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {filteredOperators.map((operator) => (
          <div
            key={operator.id}
            onClick={() => onSelectOperator(operator)}
            className="group relative flex flex-col bg-[#1A1D20] border border-[#333537]/70 hover:border-[#E87A1E] rounded overflow-hidden shadow-lg hover:shadow-[0_8px_24px_rgba(232,122,30,0.25)] transition-all duration-300 cursor-pointer"
          >
            {/* Operator Image Frame */}
            <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#111315]">
              <img
                src={operator.image}
                alt={`${operator.name} - ${operator.callsign}`}
                className="w-full h-full object-cover object-top filter contrast-105 group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1D20] via-transparent to-transparent opacity-80" />
              
              {/* Badges Top */}
              <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                <span className="px-2 py-0.5 bg-[#E87A1E] text-[#111315] font-mono text-[11px] font-bold uppercase rounded shadow">
                  {operator.callsign}
                </span>
                <span className="px-2 py-0.5 bg-[#111315]/85 text-[#2ECC71] font-mono text-[10px] rounded backdrop-blur-sm flex items-center gap-1 border border-[#2ECC71]/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2ECC71]"></span> {operator.status}
                </span>
              </div>

              {/* ID Bottom Right */}
              <div className="absolute bottom-2 right-2 font-mono text-[10px] text-[#8E9297] bg-[#111315]/80 px-1.5 py-0.5 rounded border border-[#282a2c]">
                ID: {operator.code}
              </div>
            </div>

            {/* Content Details */}
            <div className="p-4 flex flex-col flex-grow justify-between bg-[#1A1D20]">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#E2E3DF] group-hover:text-[#E87A1E] transition-colors">
                    {operator.name}
                  </h3>
                  <span className="font-mono text-xs text-[#AECFB2]">FOST-{operator.code}</span>
                </div>
                <div className="font-mono text-[11px] text-[#E87A1E] uppercase font-semibold mb-3 line-clamp-1">
                  {operator.role}
                </div>

                {/* Specs Box */}
                <div className="space-y-1.5 font-['Inter'] text-xs text-[#8E9297] bg-[#1a1c1e] p-2.5 rounded border border-[#282a2c]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#8E9297]">Loadout :</span>
                    <span className="text-[#E2E3DF] font-medium text-right truncate ml-2">{operator.loadout}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#8E9297]">Camo :</span>
                    <span className="text-[#E2E3DF] text-right truncate ml-2">{operator.camo}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#8E9297]">Expérience :</span>
                    <span className="text-[#2ECC71] font-medium">{operator.experience}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Bar */}
              <div className="mt-3 pt-2.5 border-t border-[#282a2c] flex items-center justify-between text-[#8E9297] font-mono text-[11px]">
                <span className="text-[#E2E3DF]">{operator.joules}</span>
                <span className="text-[#AECFB2] group-hover:underline flex items-center gap-1">
                  {operator.specsTag}
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
