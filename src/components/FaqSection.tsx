import React, { useState } from 'react';
import { FOST_LEGAL_INFO } from '../data/fostData';

interface FaqItem {
  id: string;
  category: 'gear' | 'association' | 'operations';
  categoryLabel: string;
  question: string;
  answer: string;
  tags?: string[];
}

const FAQ_DATA: FaqItem[] = [
  // CATÉGORIE 1 : MATÉRIEL & SÉCURITÉ
  {
    id: 'gear-1',
    category: 'gear',
    categoryLabel: 'Matériel & Sécurité',
    question: 'Quelles sont les protections obligatoires pour accéder au terrain ?',
    answer: 'La sécurité est non négociable chez FOST. Sont obligatoires : des lunettes de protection oculaire balistique certifiées EN 166 B ou ANSI Z87+ (les lunettes de soleil ou de bricolage légères sont interdites), des chaussures montantes à maintien rigide de cheville (rangers ou chaussures de randonnée, les baskets de running sont refusées), et un chiffon rouge de mort (« Dead Rag »). Un masque bas de visage grillagé (Stalker) protégeant les dents est également fortement exigé, particulièrement sur l\'OP CQB Usine.',
    tags: ['Lunettes', 'EN166B', 'Masque', 'Sécurité']
  },
  {
    id: 'gear-2',
    category: 'gear',
    categoryLabel: 'Matériel & Sécurité',
    question: 'Quelles sont les puissances maximales autorisées au passage Chronographe ?',
    answer: 'Chaque réplique est testée systématiquement en zone neutre avec billes de 0.20g hop-up réglé. Les barèmes officiels FOST sont : CQB Usine : 300 FPS max (0.84 Joule, semi-auto strict) • AEG / Fusil d\'assaut / GBB : 350 FPS max (1.14 Joules, MED de sécurité 5m) • Anti-Sniper DMR : 400 FPS max (1.48 Joules, semi-auto bloqué mécaniquement, MED 15m) • Sniper à Verrou Bolt : 450 FPS max (1.88 Joules, réarmement manuel, MED 20m). Toute réplique dépassant 2.0 Joules est strictement interdite selon la loi française (Décret n° 99-240).',
    tags: ['Chrony', 'FPS', 'Joules', 'Puissance', 'MED']
  },
  {
    id: 'gear-3',
    category: 'gear',
    categoryLabel: 'Matériel & Sécurité',
    question: 'Quel type de billes doit-on utiliser sur les terrains de la FOST ?',
    answer: 'Seules les billes 100% biodégradables certifiées (PLA bio, sans métaux lourds) sont acceptées, aussi bien sur le terrain boisé de 25 hectares de Rombas que dans les zones extérieures de l\'usine. Les billes plastiques ordinaires sont formellement prohibées afin de préserver l\'environnement et notre homologation préfectorale. Des contrôles inopinés de chargeurs sont effectués par les marshals.',
    tags: ['Billes', 'Bio', 'Écologie', 'Biodégradables']
  },
  {
    id: 'gear-4',
    category: 'gear',
    categoryLabel: 'Matériel & Sécurité',
    question: 'Je n\'ai pas encore de réplique, proposez-vous du matériel en prêt ou location ?',
    answer: 'Oui ! Pour les joueurs débutants ou ceux qui souhaitent tester avant d\'investir, nous proposons des packs de prêt complets lors de nos sessions. Le pack (+15 €) comprend une réplique d\'assaut AEG électrique révisée (G&G / Specna Arms), 2 batteries chargées, un masque de protection intégrale balistique et 1 000 billes bio. Pour les Membres Premium (80€/an), une réplique de backup est mise à disposition gratuitement en cas de panne.',
    tags: ['Location', 'Prêt', 'Débutant', 'Pack']
  },
  {
    id: 'gear-5',
    category: 'gear',
    categoryLabel: 'Matériel & Sécurité',
    question: 'Quels chargeurs sont autorisés (Mid-Cap vs Hi-Cap à molette) ?',
    answer: 'Pour privilégier l\'immersion tactique MilSim et la gestion rationnelle des tirs, les chargeurs sans molette (Mid-Cap ou Low-Cap, capacité standard 120 à 140 billes) sont la norme exigée sur nos opérations. Les chargeurs Hi-Cap à molette qui font le bruit de maracas sont interdits lors des OP Chasse à l\'homme et Exfiltration, et tolérés uniquement sur les journées initiation pour les nouvelles recrues.',
    tags: ['Chargeurs', 'Mid-Cap', 'Hi-Cap', 'MilSim']
  },

  // CATÉGORIE 2 : L'ASSOCIATION & ADHÉSION
  {
    id: 'assoc-1',
    category: 'association',
    categoryLabel: 'Association & Adhésion',
    question: 'Quels sont les tarifs d\'adhésion pour la saison 2026 ?',
    answer: 'L\'association propose 3 formules officielles : 1) Membre Titulaire Annuel à 20 € / an (cotisation officielle enregistrée au Tribunal Judiciaire de Metz, assurance responsabilité civile sportive incluse, accès à toutes les OP à 0€) • 2) Membre Premium à 80 € / an (formule soutien & privilège : priorité sur les créneaux, patchs officiels brodés et métal, prêt gratuit de réplique backup, -20% sur les peintures Cerakote) • 3) Membre Test à 15 € pour 6 mois (période d\'essai probatoire, montant déductible de l\'adhésion annuelle).',
    tags: ['Tarifs', 'Cotisation', '20€', '80€', '15€']
  },
  {
    id: 'assoc-2',
    category: 'association',
    categoryLabel: 'Association & Adhésion',
    question: 'Pourquoi le parrainage est-il obligatoire pour les nouveaux membres ?',
    answer: 'L\'esprit d\'équipe, la sécurité et le fair-play absolu sont les piliers de notre association. Pour préserver cette cohésion saine, tout nouveau membre doit être recommandé par un membre actif ou un cadre du bureau (ex: Ilyane, Sofiane, Ilian, Noah, Luciano). Si vous ne connaissez personne au départ, vous participez simplement à une première session découverte d\'initiation : l\'encadrement vous évaluera et validera volontiers votre parrainage !',
    tags: ['Parrainage', 'Nouveaux', 'Recrutement']
  },
  {
    id: 'assoc-3',
    category: 'association',
    categoryLabel: 'Association & Adhésion',
    question: 'Les mineurs peuvent-ils adhérer et participer aux parties ?',
    answer: 'Oui, sous strict encadrement légal. En application stricte du Décret n° 99-240 du 24 mars 1999, l\'utilisation de répliques développant plus de 0,08 Joule est formellement interdite aux mineurs de moins de 18 ans. Un mineur peut adhérer (cotisation 20€ avec autorisation parentale obligatoire et décharge) pour jouer avec du matériel adapté « Mini » (≤ 0.08J) ou participer dans un rôle tactique de soutien sécurisé sans réplique (opérateur radio, logisticien de camp, VIP civil à exfiltrer).',
    tags: ['Mineurs', 'Décret 99-240', 'Autorisation', '0.08J']
  },
  {
    id: 'assoc-4',
    category: 'association',
    categoryLabel: 'Association & Adhésion',
    question: 'Quel est le statut officiel et où se trouve le siège de la FOST ?',
    answer: 'La F.O.S.T. (Force Opérationnelle de Simulation Tactique) est une association légalement inscrite au Registre des Associations du Tribunal Judiciaire de Metz. Notre siège social est situé au 17 Rue Maréchal Joffre, 57120 ROMBAS (Moselle, région Grand Est). Le terrain boisé principal de 25 hectares et nos infrastructures d\'entraînement sont déclarés auprès de la préfecture.',
    tags: ['Statut', 'Rombas', 'Tribunal Metz', 'Siège']
  },

  // CATÉGORIE 3 : FONCTIONNEMENT DES OPÉRATIONS
  {
    id: 'ops-1',
    category: 'operations',
    categoryLabel: 'Fonctionnement des OP',
    question: 'Combien coûte la réservation d\'une session de jeu ?',
    answer: 'Le tarif est très simple : 5,00 € pour la réservation d\'une session pour les joueurs non-membres / invités extérieurs. Pour tous les membres adhérents de la FOST (ayant réglé leur cotisation annuelle de 20€ ou 80€), la réservation de session est à 0,00 € (totalement gratuite, comprise dans l\'adhésion).',
    tags: ['Prix session', '5 euros', 'Gratuit membre', '0 euro']
  },
  {
    id: 'ops-2',
    category: 'operations',
    categoryLabel: 'Fonctionnement des OP',
    question: 'Quels sont les 3 types d\'opérations organisées par la FOST ?',
    answer: 'Nos scénarios tournent autour de 3 formats phares : 1) OP CQB Usine (combat rapproché nerveux dans une usine désaffectée de 2 500m², coursives industrielles, traceurs UV de nuit) • 2) OP Chasse à l\'homme Forêt (scénario asymétrique sur 25 hectares de bois denses : des fuyards isolés doivent s\'infiltrer et atteindre une zone de repli face à une meute de traqueurs d\'élite FOST) • 3) OP Exfiltration Civile (mission MilSim d\'escorte de VIP et scientifiques en territoire hostile, gestion de convoi sous le feu et extraction chronométrée).',
    tags: ['CQB Usine', 'Chasse à l\'homme', 'Exfiltration Civile', 'Scénarios']
  },
  {
    id: 'ops-3',
    category: 'operations',
    categoryLabel: 'Fonctionnement des OP',
    question: 'Quel est le déroulement d\'une journée type d\'opération ?',
    answer: 'Horaires standards (parties de jour) : 08h30 : Accueil des joueurs en zone neutre, émargement et café offert • 08h45 - 09h30 : Passage chronographe obligatoire à la 0.20g et remise du bracelet vert • 09h30 : Briefing général de sécurité, rappel de la charte et explication de l\'OPORD • 10h00 : Déploiement en faction et premier assaut • 12h30 - 13h30 : Pause déjeuner conviviale (barbecue/repas tiré du sac) • 13h30 - 17h00 : Deuxième phase de jeu et scénarios avancés • 17h30 : Fin des tirs, débriefing tactique et rangement.',
    tags: ['Horaires', 'Déroulement', 'Chrony', 'Briefing']
  },
  {
    id: 'ops-4',
    category: 'operations',
    categoryLabel: 'Fonctionnement des OP',
    question: 'Comment s\'applique la règle de touche (« OUT ») et le fair-play ?',
    answer: 'L\'airsoft repose entièrement sur l\'honnêteté et l\'honneur individuel. Dès qu\'une bille vous touche (sur le corps, le gilet, le casque ou même votre réplique), vous devez crier « OUT ! » à voix haute et intelligible, lever la main, sortir immédiatement votre chiffon rouge de mort (Dead Rag) ou allumer un feu rouge clignotant de nuit. En cas de litige, aucun débat sur le terrain : on prend le Out avec le sourire ou on fait appel à un marshal.',
    tags: ['Fair-play', 'Out', 'Touche', 'Dead rag']
  },
  {
    id: 'ops-5',
    category: 'operations',
    categoryLabel: 'Fonctionnement des OP',
    question: 'Que se passe-t-il en cas de mauvaise météo ou de pluie ?',
    answer: 'La météo fait partie intégrante du MilSim ! Nos parties en forêt ont lieu par tous les temps (pluie, brume, froid), sous réserve que la sécurité globale ne soit pas menacée (ex: alerte tempête ou orages violents déclarés par Météo France). En cas de conditions extrêmes en extérieur, les opérations peuvent être basculées sur le complexe abrité du CQB Usine.',
    tags: ['Météo', 'Pluie', 'Annulation', 'Hangar']
  }
];

interface FaqSectionProps {
  onNavigateToContact: () => void;
  onOpenEnrollModal: (opId: string) => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({
  onNavigateToContact,
  onOpenEnrollModal
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openId, setOpenId] = useState<string | null>('ops-1');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const filteredFaq = FAQ_DATA.filter((item) => {
    const matchCat = activeCategory === 'all' || item.category === activeCategory;
    const matchQuery =
      searchQuery === '' ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchQuery;
  });

  return (
    <div className="w-full py-16 md:py-24 px-4 sm:px-8 md:px-16 bg-[#111315] border-t border-[#282a2c] relative">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2 font-mono text-xs">
              <span className="px-2 py-0.5 bg-[#1A1D20] text-[#E87A1E] rounded font-bold uppercase">
                INTELLIGENCE & FOIRE AUX QUESTIONS
              </span>
              <span className="text-[#8E9297]">•</span>
              <span className="text-[#AECFB2]">GUIDE DE L'OPÉRATEUR FOST</span>
            </div>
            <h2 className="font-['Space_Grotesk'] text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-[#E2E3DF] font-bold">
              Questions Fréquentes <span className="text-[#E87A1E]">// FAQ</span>
            </h2>
            <p className="font-['Inter'] text-sm md:text-base text-[#8E9297] max-w-2xl mt-2 leading-relaxed">
              Tout ce que vous devez savoir sur le matériel requis, le barème chrony, l'adhésion à l'association et le déroulement de nos 3 types d'opérations.
            </p>
          </div>

          <button
            onClick={onNavigateToContact}
            className="self-start md:self-auto px-4 py-2.5 bg-[#1A1D20] hover:bg-[#282a2c] text-[#E2E3DF] hover:text-[#E87A1E] border border-[#333537] hover:border-[#E87A1E] font-mono text-xs uppercase font-bold rounded flex items-center gap-2 transition-all cursor-pointer shadow"
          >
            <span className="material-symbols-outlined text-base">contact_support</span>
            <span>Poser une question spécifique</span>
          </button>
        </div>

        {/* Search Bar & Category Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {/* Search Input */}
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#8E9297] text-lg">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par mot-clé (ex: puissance, 5 euros, mineurs, cqb...)"
              className="w-full bg-[#16181A] text-[#E2E3DF] font-['Inter'] text-xs pl-10 pr-4 py-2.5 rounded border border-[#282a2c] focus:border-[#E87A1E] focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-[#8E9297] hover:text-[#E2E3DF]"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>

          {/* Categories Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'Toutes les questions' },
              { id: 'gear', label: 'Matériel & Sécurité' },
              { id: 'association', label: 'Association & Adhésion' },
              { id: 'operations', label: 'Fonctionnement des OP' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-2 font-mono text-xs uppercase rounded transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#E87A1E] text-[#111315] font-bold shadow'
                    : 'bg-[#16181A] text-[#8E9297] hover:text-[#E2E3DF] border border-[#282a2c]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Highlights Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          <div className="bg-[#16181A] p-3 rounded border border-[#282a2c] flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#2ECC71]/20 text-[#2ECC71] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-lg">payments</span>
            </div>
            <div>
              <span className="font-mono text-[10px] text-[#8E9297] uppercase block">Réservation Session</span>
              <span className="font-['Space_Grotesk'] text-sm font-bold text-[#E2E3DF]">
                5 € Non-Membre • <span className="text-[#2ECC71]">0 € Membre</span>
              </span>
            </div>
          </div>

          <div className="bg-[#16181A] p-3 rounded border border-[#282a2c] flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#E87A1E]/20 text-[#E87A1E] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-lg">shield</span>
            </div>
            <div>
              <span className="font-mono text-[10px] text-[#8E9297] uppercase block">Cotisations 2026</span>
              <span className="font-['Space_Grotesk'] text-sm font-bold text-[#E2E3DF]">
                20€ / an • 80€ Premium • 15€ Test
              </span>
            </div>
          </div>

          <div className="bg-[#16181A] p-3 rounded border border-[#282a2c] flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#38BDF8]/20 text-[#38BDF8] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-lg">sports_esports</span>
            </div>
            <div>
              <span className="font-mono text-[10px] text-[#8E9297] uppercase block">3 Types d'OP</span>
              <span className="font-['Space_Grotesk'] text-sm font-bold text-[#E2E3DF]">
                CQB Usine • Chasse Forêt • Exfil Civile
              </span>
            </div>
          </div>
        </div>

        {/* Accordions List */}
        <div className="space-y-3">
          {filteredFaq.length === 0 ? (
            <div className="p-8 text-center bg-[#16181A] rounded border border-[#282a2c]">
              <span className="material-symbols-outlined text-3xl text-[#8E9297] mb-2 block">
                search_off
              </span>
              <p className="font-mono text-xs text-[#8E9297]">
                Aucune question trouvée pour "{searchQuery}".
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="mt-3 px-3 py-1 bg-[#22262B] text-[#E87A1E] font-mono text-xs rounded hover:underline cursor-pointer"
              >
                Réinitialiser la recherche
              </button>
            </div>
          ) : (
            filteredFaq.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div
                  key={item.id}
                  className={`bg-[#16181A] rounded border transition-all overflow-hidden ${
                    isOpen ? 'border-[#E87A1E]/80 shadow-[0_4px_20px_rgba(0,0,0,0.6)]' : 'border-[#282a2c] hover:border-[#3B4D3F]'
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(item.id)}
                    className="w-full p-4 md:p-5 text-left flex items-start justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="flex items-start gap-3">
                      <span className={`material-symbols-outlined text-lg mt-0.5 shrink-0 transition-transform ${
                        isOpen ? 'text-[#E87A1E] rotate-90' : 'text-[#8E9297]'
                      }`}>
                        chevron_right
                      </span>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-[10px] uppercase font-bold px-1.5 py-0.2 bg-[#22262B] text-[#AECFB2] rounded">
                            {item.categoryLabel}
                          </span>
                        </div>
                        <h3 className="font-['Space_Grotesk'] text-base md:text-lg font-bold text-[#E2E3DF]">
                          {item.question}
                        </h3>
                      </div>
                    </div>

                    <span className="material-symbols-outlined text-xl text-[#8E9297] shrink-0">
                      {isOpen ? 'remove' : 'add'}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 border-t border-[#282a2c]/60 bg-[#121416]/50 animate-fadeIn">
                      <p className="font-['Inter'] text-xs md:text-sm text-[#8E9297] leading-relaxed pl-8">
                        {item.answer}
                      </p>

                      {/* Tag badges */}
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 mt-3 pl-8">
                          {item.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="font-mono text-[9px] px-2 py-0.5 rounded bg-[#1A1D20] text-[#AECFB2] border border-[#282a2c]"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom CTA Card */}
        <div className="mt-12 p-6 bg-[#16181A] border border-[#333537] rounded-lg flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded bg-[#E87A1E]/20 text-[#E87A1E] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">help_center</span>
            </div>
            <div>
              <h4 className="font-['Space_Grotesk'] text-lg font-bold uppercase text-[#E2E3DF]">
                Vous avez encore une question ?
              </h4>
              <p className="font-['Inter'] text-xs text-[#8E9297] mt-0.5">
                L'état-major FOST répond aux transmissions sous 24h par email ({FOST_LEGAL_INFO.email}) ou via notre serveur Discord.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={onNavigateToContact}
              className="w-full md:w-auto px-5 py-2.5 bg-[#E87A1E] hover:brightness-110 text-[#111315] font-mono text-xs uppercase font-bold rounded transition-all cursor-pointer shadow flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">mail</span>
              <span>Contacter le QG</span>
            </button>
            <button
              onClick={() => onOpenEnrollModal('OP-CQB-USINE')}
              className="w-full md:w-auto px-4 py-2.5 bg-[#22262B] hover:bg-[#282a2c] text-[#2ECC71] border border-[#2ECC71]/40 font-mono text-xs uppercase font-bold rounded transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">how_to_reg</span>
              <span>Réserver une session (5€ / 0€)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
