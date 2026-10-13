import React, { useState } from 'react';
import {
  INITIAL_CHRONY_RECORDS,
  ChronyRecord,
  CERAKOTE_COLORS,
  CerakoteColor,
  OperationEvent,
  OPERATIONS
} from '../data/fostData';
import { ShieldLogo } from './ShieldLogo';

interface QgAdminViewProps {
  onCloseAdmin: () => void;
  operations: OperationEvent[];
  onAddOperation: (op: OperationEvent) => void;
  onDeleteOperation: (opId: string) => void;
  onToggleCompleteOperation: (opId: string) => void;
  onUpdateOperations: (ops: OperationEvent[]) => void;
  onResetOperations: () => void;
}

export const QgAdminView: React.FC<QgAdminViewProps> = ({
  onCloseAdmin,
  operations,
  onAddOperation,
  onDeleteOperation,
  onToggleCompleteOperation,
  onUpdateOperations,
  onResetOperations
}) => {
  // Quick config editing
  const [selectedOpForConfig, setSelectedOpForConfig] = useState<OperationEvent>(operations[0] || OPERATIONS[0]);
  const [cfgPaf, setCfgPaf] = useState<number>(selectedOpForConfig?.paf || 5);
  const [cfgMaxSlots, setCfgMaxSlots] = useState<number>(selectedOpForConfig?.maxSlots || 30);
  const [cfgLimitFps, setCfgLimitFps] = useState<string>(selectedOpForConfig?.specs?.limitFps || 'AEG 350 FPS');
  const [syncStatus, setSyncStatus] = useState<string>('SYNC ACTIF');
  const [adminFilter, setAdminFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ALL');

  // Cerakote stock matrix
  const [cerakoteList, setCerakoteList] = useState<CerakoteColor[]>(CERAKOTE_COLORS);

  // Chrony records
  const [chronyLogs, setChronyLogs] = useState<ChronyRecord[]>(INITIAL_CHRONY_RECORDS);
  const [newCallsign, setNewCallsign] = useState('');
  const [newGunClass, setNewGunClass] = useState<'AEG' | 'DMR' | 'BOLT'>('AEG');
  const [newFps, setNewFps] = useState('340');

  // Modal: Add New Operation to Grid
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newOpTitle, setNewOpTitle] = useState('');
  const [newOpCategory, setNewOpCategory] = useState<'cqb-usine' | 'chasse-foret' | 'exfiltration-civile' | string>('cqb-usine');
  const [newOpDay, setNewOpDay] = useState<number>(14);
  const [newOpDateStr, setNewOpDateStr] = useState('Samedi 14 Octobre 2026');
  const [newOpTimeStr, setNewOpTimeStr] = useState('09h00 - 17h30');
  const [newOpSector, setNewOpSector] = useState('Complexe Usine Désaffectée #3 (2 500m²)');
  const [newOpSectorSub, setNewOpSectorSub] = useState('Secteur Alpha Bâtiment B');
  const [newOpMaxSlots, setNewOpMaxSlots] = useState<number>(30);
  const [newOpPaf, setNewOpPaf] = useState<number>(5);
  const [newOpDesc, setNewOpDesc] = useState('');
  const [newOpLimitFps, setNewOpLimitFps] = useState('AEG 350 FPS / DMR 400 FPS');
  const [newOpImage, setNewOpImage] = useState<string>('');

  // Default images for fast selection
  const OP_IMAGES: Record<string, string> = {
    'cqb-usine': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCdDxzlc4wch80yRJhaadSEfawWF1tsVCKM-hNeVyROUyXi5wdN1bVZdxlEswnZXLuVvzEemUrvy4URGiMTgnQzZhQWzwkTxX1MgXxhmBV7_KND6POAFVIJsWOcoK67JHHUoUTYfHFmpLvVhOK21L6al5ze4KjKKuhWni_CQug_qUFNnKB-3fhFrVQARvkoPtdVq4m8pigTzVesj34kEAV6AokrU_6U77x3KPSJ98IZPyDXCx_5de_',
    'chasse-foret': 'https://lh3.googleusercontent.com/aida-public/AB6AXuATQexWToyS5tYgK1W2JYGk0GeItQ4JwtP4oUS8lWwXK_8PSaGQifIo0wlJ9f6X87f2-KUZKyM90oZZzMjNHR0sVjKCxiTVuOivBX5zTu44v_f5VY3csI3v0xpR4WaWPMKu2R6zoJLp1xyIc0ABtx6NWXrrr-Ko3r4uRTuVFpGPofMM3GS_TRU1M3-Sf2VF52ZfRjw3CI_XyzkccQVTKB81XbD-R88kX7rAXNinfTbsdLObxssziZiC',
    'exfiltration-civile': 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6j0HGTRPOYb_6G7ZP1QrBYNJL3fwI3usIW6C96otwSYi3EidRdabhCT9-6wzKbDAhQ4iwYB9iGYH-5dbzjTmYYckCg5zRyzaJYGbtt_lIQrbmonabGeFm_Jod9uVmeMBdrBLUxJ4wNUhMf46SELSOC03IOURCYY5uZFLm1oic2fk04f4l3ni2LPw35gyCwxMIQSc9RaLVLEqeuPibMOwmRpiLRdPAmBidN4bHZNnfEk1-5AYP4ton'
  };

  // KPIs
  const totalSlotsBooked = operations.reduce((acc, curr) => acc + curr.bookedSlots, 0);
  const totalSlotsMax = operations.reduce((acc, curr) => acc + curr.maxSlots, 0);
  const activeOpsCount = operations.filter((o) => !o.isCompleted).length;
  const completedOpsCount = operations.filter((o) => o.isCompleted).length;
  const sessionRevenue = operations.reduce((acc, curr) => acc + curr.bookedSlots * curr.paf, 0);

  // Handlers for Live Adjustments
  const handleSlotDelta = (opId: string, delta: number) => {
    const updated = operations.map((op) => {
      if (op.id === opId) {
        const next = Math.max(0, Math.min(op.maxSlots, op.bookedSlots + delta));
        const rem = op.maxSlots - next;
        return {
          ...op,
          bookedSlots: next,
          statusText: op.isCompleted
            ? 'TERMINÉE // MISSION CLÔTURÉE'
            : rem <= 6
            ? `${rem} PLACES RESTANTES // DERNIERS SLOTS`
            : `${rem} PLACES RESTANTES // 5€ OU 0€ MEMBRE`
        };
      }
      return op;
    });
    onUpdateOperations(updated);
  };

  const handleEditSelect = (op: OperationEvent) => {
    setSelectedOpForConfig(op);
    setCfgPaf(op.paf);
    setCfgMaxSlots(op.maxSlots);
    setCfgLimitFps(op.specs?.limitFps || 'AEG 350 FPS');
    setSyncStatus('CHARGÉ');
    setTimeout(() => setSyncStatus('SYNC ACTIF'), 1200);
  };

  const handleSaveConfig = () => {
    setSyncStatus('ENREGISTREMENT...');
    setTimeout(() => {
      const updated = operations.map((op) => {
        if (op.id === selectedOpForConfig.id) {
          return {
            ...op,
            paf: cfgPaf,
            maxSlots: cfgMaxSlots,
            specs: {
              ...op.specs,
              limitFps: cfgLimitFps
            }
          };
        }
        return op;
      });
      onUpdateOperations(updated);
      setSyncStatus('SYNCHRONISÉ ✓');
      setTimeout(() => setSyncStatus('SYNC ACTIF'), 2000);
    }, 400);
  };

  const handleToggleCerakoteStatus = (id: string) => {
    setCerakoteList((prev) =>
      prev.map((col) => {
        if (col.id === id) {
          if (col.status === 'EN STOCK') return { ...col, status: 'RUPTURE' };
          if (col.status === 'RUPTURE') return { ...col, status: 'COMMANDE' };
          return { ...col, status: 'EN STOCK' };
        }
        return col;
      })
    );
  };

  const handleAddChronyCheckin = (e: React.FormEvent) => {
    e.preventDefault();
    const callsignText = newCallsign.trim() || 'RECRUE_EXTERIEURE';
    const fpsVal = parseInt(newFps, 10) || 340;

    let threshold = 350;
    if (newGunClass === 'DMR') threshold = 400;
    if (newGunClass === 'BOLT') threshold = 450;

    const compliant = fpsVal <= threshold;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const joules = +(0.5 * 0.0002 * Math.pow(fpsVal * 0.3048, 2)).toFixed(2);

    const record: ChronyRecord = {
      id: `chr-${Date.now()}`,
      time: timeStr,
      callsign: callsignText.toUpperCase(),
      operatorName: 'Enregistré sur pas de tir',
      replica: `${newGunClass} M4/Custom`,
      gunClass: newGunClass,
      fps: fpsVal,
      joules: joules > 0 ? joules : 1.12,
      compliant,
      passGranted: compliant ? 'BRACELET VERT REMIS' : 'REFUSÉ / EN RÉGLAGE'
    };

    setChronyLogs([record, ...chronyLogs]);
    setNewCallsign('');
    setNewFps('340');
  };

  const handleOpenAddForDay = (dayNum: number) => {
    setNewOpDay(dayNum);
    setNewOpDateStr(`Jour ${dayNum} Octobre 2026`);
    setNewOpTitle(`OP PROTOCOLE // JOUR ${dayNum}`);
    setNewOpDesc(`Scénario tactique d'intervention en milieu hostile programmé le ${dayNum} Octobre.`);
    setIsAddModalOpen(true);
  };

  const handleCreateOperationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOpTitle.trim()) return;

    let catLabel = 'CQB USINE';
    if (newOpCategory === 'chasse-foret') catLabel = "CHASSE À L'HOMME FORÊT";
    if (newOpCategory === 'exfiltration-civile') catLabel = 'EXFILTRATION CIVILE';

    const chosenImage =
      newOpImage.trim() ||
      OP_IMAGES[newOpCategory] ||
      OP_IMAGES['cqb-usine'];

    const newOp: OperationEvent = {
      id: `OP-${Date.now()}`,
      code: `OPORD #${String(operations.length + 51).padStart(3, '0')}`,
      title: newOpTitle.toUpperCase(),
      category: newOpCategory,
      categoryLabel: catLabel,
      sector: newOpSector,
      sectorSub: newOpSectorSub,
      dateStr: newOpDateStr,
      timeStr: newOpTimeStr,
      dayOfMonth: Number(newOpDay) || 15,
      isCompleted: false,
      image: chosenImage,
      altText: `Opération ${newOpTitle} par l'escouade FOST`,
      description:
        newOpDesc ||
        "Mission tactique FOST sous haute intensité avec respect rigoureux du fair-play et des distances d'engagement.",
      paf: Number(newOpPaf) || 5,
      memberPaf: 0,
      pafNote: `${newOpPaf} € la réservation session • 0 € GRATUIT pour les Membres Adhérents FOST`,
      bookedSlots: 0,
      maxSlots: Number(newOpMaxSlots) || 30,
      statusText: `${newOpMaxSlots} PLACES DISPONIBLES // ${newOpPaf}€ OU 0€ MEMBRE`,
      statusUrgency: 'normal',
      specs: {
        calendar: `${newOpDateStr} (${newOpTimeStr})`,
        location: newOpSector,
        medic: 'Spawn instantané ou 1 Bandage Medic',
        ammo: 'Billes 100% bio obligatoires (Contrôle Marshall)',
        requirement: 'Protection oculaire EN166B certifiée',
        limitFps: newOpLimitFps,
        engagement: 'Semi-auto strict + Respect strict des règles de tir',
        logistics: 'Parking sécurisé, zone safe chauffée et café offert'
      }
    };

    onAddOperation(newOp);
    setIsAddModalOpen(false);
    // Reset form
    setNewOpTitle('');
    setNewOpDesc('');
  };

  const filteredOpsList = operations.filter((op) => {
    if (adminFilter === 'ACTIVE') return !op.isCompleted;
    if (adminFilter === 'COMPLETED') return op.isCompleted;
    return true;
  });

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="w-full bg-[#121416] min-h-screen text-[#E2E2E5] pb-24">
      {/* Top Fixed QG Staff Banner */}
      <div className="bg-[#111315] border-b border-[#282a2c] px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-20 z-40 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2ECC71] animate-pulse"></span>
            <span className="font-mono text-xs text-[#8E9297]">GRILLE MENSUELLE :</span>
            <span className="font-mono text-xs text-[#2ECC71] font-bold">SYNCHRONISÉE [REALTIME]</span>
          </div>
          <span className="hidden md:inline text-[#333537]">|</span>
          <div className="hidden md:flex items-center gap-2 font-mono text-xs text-[#8E9297]">
            <span>CANAL RADIO ACTIF:</span>
            <span className="text-[#E87A1E] font-bold">CH-01 COMMAND STAFF</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onResetOperations}
            className="px-3 py-1.5 bg-[#1A1D20] hover:bg-[#282a2c] text-[#8E9297] hover:text-[#E2E3DF] border border-[#333537] rounded font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Rétablir la grille d'origine (3 opérations officielles)"
          >
            <span className="material-symbols-outlined text-sm">restart_alt</span>
            <span>Grille par Défaut</span>
          </button>
          <button
            onClick={onCloseAdmin}
            className="px-4 py-1.5 bg-[#E87A1E] text-[#111315] font-mono text-xs uppercase font-bold rounded hover:brightness-110 flex items-center gap-1.5 transition-all shadow cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">visibility</span>
            <span>Retour Vue Publique</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
        {/* COMMAND HEADER STRIP */}
        <section className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-[#1A1D20] border border-[#333537] p-6 rounded shadow-xl">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 flex-wrap font-mono text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#282a2c] text-[#2ECC71] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#2ECC71] animate-ping"></span>
                SYS-QG :: ONLINE
              </span>
              <span className="text-[#8E9297]">ESCOUADE FOST 2026</span>
              <span className="text-[#8E9297]">///</span>
              <span className="text-[#E87A1E] font-semibold">GESTIONNAIRE CALENDRIER & SLOTS ACTIF</span>
            </div>
            <div className="flex items-center gap-3.5">
              <ShieldLogo size={44} showGlow={true} />
              <h1 className="font-['Space_Grotesk'] text-2xl md:text-3xl lg:text-4xl text-[#E2E3DF] font-bold uppercase tracking-tight">
                FOST COMMAND STAFF // GESTION DES PARTIES
              </h1>
            </div>
            <p className="font-['Inter'] text-xs md:text-sm text-[#8E9297]">
              Ajoutez des parties dans la grille mensuelle à tout moment, supprimez les sessions obsolètes ou marquez-les comme terminées pour clôturer les engagements.
            </p>
          </div>

          {/* Quick Actions Header */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => {
                setNewOpDay(15);
                setNewOpTitle('');
                setIsAddModalOpen(true);
              }}
              className="px-4 py-2.5 bg-[#E87A1E] text-[#111315] font-mono text-xs font-bold uppercase rounded shadow-lg hover:brightness-110 active:scale-95 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">add_circle</span>
              <span>+ Programmer une Nouvelle Partie</span>
            </button>
            <a
              href="#chrony-section"
              className="px-4 py-2 bg-[#282a2c] hover:bg-[#333537] text-[#2ECC71] font-mono text-xs uppercase rounded border border-[#2ECC71]/30 flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">qr_code_scanner</span>
              TEST CHRONY
            </a>
          </div>
        </section>

        {/* LIVE TACTICAL KPI CARDS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#1A1D20] border border-[#333537] p-5 rounded flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#8E9297] font-mono text-xs">
              <span>ENGAGEMENTS PROGRAMMÉS</span>
              <span className="material-symbols-outlined text-[#E87A1E]">calendar_month</span>
            </div>
            <div className="mt-3">
              <span className="font-['Space_Grotesk'] text-3xl font-bold text-[#E2E3DF]">
                {operations.length}
              </span>
              <span className="font-mono text-xs text-[#2ECC71] ml-2">
                ({activeOpsCount} Actives • {completedOpsCount} Terminées)
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#8E9297] mt-1">
              Affichées sur le calendrier public
            </span>
          </div>

          <div className="bg-[#1A1D20] border border-[#333537] p-5 rounded flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#8E9297] font-mono text-xs">
              <span>SLOTS JOUEURS LIVE</span>
              <span className="material-symbols-outlined text-[#2ECC71]">group</span>
            </div>
            <div className="mt-3">
              <span className="font-['Space_Grotesk'] text-3xl font-bold text-[#E2E3DF]">
                {totalSlotsBooked}
              </span>
              <span className="font-mono text-xs text-[#8E9297] ml-2">
                / {totalSlotsMax} places max
              </span>
            </div>
            <div className="w-full bg-[#111315] rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-[#2ECC71] h-full"
                style={{ width: `${totalSlotsMax > 0 ? Math.round((totalSlotsBooked / totalSlotsMax) * 100) : 0}%` }}
              />
            </div>
          </div>

          <div className="bg-[#1A1D20] border border-[#333537] p-5 rounded flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#8E9297] font-mono text-xs">
              <span>REVENUS ESTIMÉS (PAF 5€)</span>
              <span className="material-symbols-outlined text-[#E87A1E]">payments</span>
            </div>
            <div className="mt-3">
              <span className="font-['Space_Grotesk'] text-3xl font-bold text-[#E87A1E]">
                {sessionRevenue},00 €
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#AECFB2] mt-1">
              {totalSlotsBooked} réservations sessions à 5€
            </span>
          </div>

          <div className="bg-[#1A1D20] border border-[#333537] p-5 rounded flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#8E9297] font-mono text-xs">
              <span>COTISATIONS MEMBRES</span>
              <span className="material-symbols-outlined text-[#2ECC71]">verified_user</span>
            </div>
            <div className="mt-3">
              <span className="font-['Space_Grotesk'] text-3xl font-bold text-[#2ECC71]">
                380,00 €
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#8E9297] mt-1">
              Premium (80€) • Titulaire (20€) • Test (15€)
            </span>
          </div>
        </section>

        {/* VISUAL MONTHLY SCHEDULE GRID INSPECTOR (OCTOBRE 2026) */}
        <section className="bg-[#1A1D20] border border-[#333537] p-6 rounded shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#282a2c]">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#E87A1E]">calendar_month</span>
                <span className="font-mono text-xs text-[#E87A1E] uppercase font-bold">
                  // VUE GRILLE MENSUELLE LIVE DE L'ADMIN
                </span>
              </div>
              <h2 className="font-['Space_Grotesk'] text-xl font-bold text-[#E2E3DF]">
                Pilotage Visuel du Mois (Octobre 2026)
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-[#8E9297]">Cliquez sur un jour vide pour programmer instantanément une OP.</span>
            </div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 font-mono text-xs">
            {daysInMonth.map((dayNum) => {
              const dayStr = dayNum.toString().padStart(2, '0');
              const dayOps = operations.filter((o) => o.dayOfMonth === dayNum);
              const hasOp = dayOps.length > 0;

              if (!hasOp) {
                return (
                  <div
                    key={`adm-day-${dayNum}`}
                    onClick={() => handleOpenAddForDay(dayNum)}
                    className="min-h-[105px] bg-[#111315]/80 border border-[#282a2c] p-2 rounded flex flex-col justify-between hover:border-[#E87A1E]/60 transition-all cursor-pointer group"
                    title={`Ajouter une partie le ${dayStr} Octobre`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[#8E9297] font-semibold">{dayStr}</span>
                      <span className="text-[10px] text-[#333537] group-hover:text-[#E87A1E] transition-colors">
                        + Ajouter
                      </span>
                    </div>
                    <span className="text-[10px] text-[#555] italic text-center py-2">
                      Disponible
                    </span>
                  </div>
                );
              }

              return (
                <div key={`adm-day-${dayNum}`} className="space-y-1.5">
                  {dayOps.map((op) => {
                    const isDone = op.isCompleted;
                    return (
                      <div
                        key={op.id}
                        className={`min-h-[105px] p-2 rounded flex flex-col justify-between border shadow-md transition-all ${
                          isDone
                            ? 'bg-[#15181a] border-[#333537] opacity-80'
                            : 'bg-[#1b241e] border-[#2ECC71]/70'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className={`font-bold ${isDone ? 'text-[#8E9297]' : 'text-[#2ECC71]'}`}>
                            {dayStr}
                          </span>
                          <span
                            className={`px-1 text-[9px] rounded font-bold uppercase ${
                              isDone
                                ? 'bg-[#282a2c] text-[#AECFB2]'
                                : 'bg-[#2ECC71]/20 text-[#2ECC71]'
                            }`}
                          >
                            {isDone ? 'TERMINÉE' : `${op.maxSlots - op.bookedSlots} SLOTS`}
                          </span>
                        </div>

                        <div className="bg-[#111315] p-1 rounded my-1">
                          <p className={`text-[10px] truncate font-bold ${isDone ? 'text-[#8E9297] line-through' : 'text-[#E2E3DF]'}`}>
                            {op.title.replace('OP ', '')}
                          </p>
                          <p className="text-[9px] text-[#8E9297] truncate">{op.timeStr}</p>
                        </div>

                        <div className="flex items-center gap-1 pt-1 border-t border-[#282a2c]">
                          <button
                            onClick={() => onToggleCompleteOperation(op.id)}
                            className={`flex-1 py-0.5 rounded text-[9px] font-bold uppercase transition-all cursor-pointer ${
                              isDone
                                ? 'bg-[#282a2c] hover:bg-[#2ECC71] text-[#E2E3DF] hover:text-black'
                                : 'bg-[#2ECC71]/20 hover:bg-[#2ECC71] text-[#2ECC71] hover:text-black'
                            }`}
                            title={isDone ? "Réactiver l'opération" : "Marquer comme terminée"}
                          >
                            {isDone ? 'RÉACTIVER' : 'TERMINER'}
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Supprimer définitivement "${op.title}" du calendrier ?`)) {
                                onDeleteOperation(op.id);
                              }
                            }}
                            className="w-5 h-5 bg-[#282a2c] hover:bg-[#E74C3C] text-[#8E9297] hover:text-white rounded flex items-center justify-center text-[10px] cursor-pointer"
                            title="Supprimer la partie"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </section>

        {/* OPERATIONS CONTROLLER & QUICK CONFIG */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Operations Slots Controller (8 cols) */}
          <div className="lg:col-span-8 bg-[#1A1D20] border border-[#333537] p-6 rounded shadow-xl flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#282a2c]">
              <div>
                <span className="font-mono text-xs text-[#E87A1E] font-bold uppercase">
                  // COMMANDEMENT DES MISSIONS
                </span>
                <h2 className="font-['Space_Grotesk'] text-xl font-bold text-[#E2E3DF]">
                  Liste & Actions des Parties du Mois
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[#8E9297]">FILTRE:</span>
                <select
                  value={adminFilter}
                  onChange={(e) => setAdminFilter(e.target.value as any)}
                  className="bg-[#111315] text-[#E2E3DF] font-mono text-xs px-2.5 py-1 rounded border border-[#333537] cursor-pointer"
                >
                  <option value="ALL">TOUTES ({operations.length})</option>
                  <option value="ACTIVE">ACTIVES ({activeOpsCount})</option>
                  <option value="COMPLETED">TERMINÉES ({completedOpsCount})</option>
                </select>
              </div>
            </div>

            {/* Ops Table */}
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left font-['Inter'] text-xs">
                <thead>
                  <tr className="bg-[#141719] text-[#8E9297] font-mono uppercase text-[11px]">
                    <th className="p-3 rounded-l">Mission & Date</th>
                    <th className="p-3">Terrain / Format</th>
                    <th className="p-3">Slots (Réservés/Max)</th>
                    <th className="p-3">Statut</th>
                    <th className="p-3 rounded-r text-right">Actions Directes</th>
                  </tr>
                </thead>
                <tbody className="space-y-1">
                  {filteredOpsList.map((op) => {
                    const pct = Math.round((op.bookedSlots / op.maxSlots) * 100);
                    const isDone = op.isCompleted;

                    return (
                      <tr
                        key={op.id}
                        className={`border-b border-[#282a2c] transition-colors ${
                          isDone
                            ? 'bg-[#141618]/60 hover:bg-[#1c1f21]'
                            : 'bg-[#111315]/80 hover:bg-[#22262B]'
                        }`}
                      >
                        <td className="p-3 font-mono">
                          <div className={`font-bold ${isDone ? 'text-[#8E9297] line-through' : 'text-[#E87A1E]'}`}>
                            {op.title}
                          </div>
                          <div className="text-[#8E9297] text-[11px]">
                            {op.dateStr} (Jour {op.dayOfMonth || 1}) • {op.timeStr}
                          </div>
                        </td>
                        <td className="p-3 text-[#E2E3DF]">
                          <div className="font-semibold truncate max-w-[150px]">{op.sector}</div>
                          <div className="text-[#8E9297] font-mono text-[10px]">{op.categoryLabel}</div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1.5 font-mono text-xs">
                            <span className="font-bold text-[#E2E3DF]">{op.bookedSlots}</span>
                            <span className="text-[#8E9297]">/ {op.maxSlots}</span>
                            <div className="flex items-center gap-0.5 ml-2">
                              <button
                                onClick={() => handleSlotDelta(op.id, -1)}
                                className="w-5 h-5 bg-[#282a2c] hover:bg-[#E74C3C] text-[#E2E3DF] rounded flex items-center justify-center font-bold text-[11px] cursor-pointer"
                                title="Réduire les réservations (-1)"
                              >
                                -
                              </button>
                              <button
                                onClick={() => handleSlotDelta(op.id, 1)}
                                className="w-5 h-5 bg-[#282a2c] hover:bg-[#2ECC71] hover:text-black text-[#E2E3DF] rounded flex items-center justify-center font-bold text-[11px] cursor-pointer"
                                title="Augmenter les réservations (+1)"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <div className="w-20 bg-[#282a2c] rounded-full h-1 mt-1 overflow-hidden">
                            <div
                              className={`h-full ${pct >= 85 ? 'bg-[#E74C3C]' : 'bg-[#2ECC71]'}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase inline-flex items-center gap-1 ${
                              isDone
                                ? 'bg-[#282a2c] text-[#AECFB2] border border-[#2ECC71]/30'
                                : 'bg-[#2ECC71]/20 text-[#2ECC71]'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[12px]">
                              {isDone ? 'task_alt' : 'bolt'}
                            </span>
                            {isDone ? 'TERMINÉE' : 'ACTIVE'}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Toggle Terminer */}
                            <button
                              onClick={() => onToggleCompleteOperation(op.id)}
                              className={`px-2.5 py-1 rounded font-mono text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                                isDone
                                  ? 'bg-[#282a2c] hover:bg-[#2ECC71] text-[#E2E3DF] hover:text-black'
                                  : 'bg-[#3B4D3F] hover:bg-[#2ECC71] text-[#AECFB2] hover:text-black'
                              }`}
                              title={isDone ? "Réactiver la mission" : "Clôturer la mission comme terminée"}
                            >
                              <span className="material-symbols-outlined text-xs">
                                {isDone ? 'replay' : 'check'}
                              </span>
                              <span>{isDone ? 'RÉACTIVER' : 'TERMINER'}</span>
                            </button>

                            {/* Edit Params */}
                            <button
                              onClick={() => handleEditSelect(op)}
                              className="px-2 py-1 rounded bg-[#282a2c] hover:bg-[#E87A1E] hover:text-[#111315] font-mono text-xs font-semibold transition-all cursor-pointer"
                              title="Charger dans l'éditeur de paramètres"
                            >
                              ÉDITER
                            </button>

                            {/* Delete Op */}
                            <button
                              onClick={() => {
                                if (confirm(`Supprimer définitivement l'opération "${op.title}" ?`)) {
                                  onDeleteOperation(op.id);
                                }
                              }}
                              className="w-7 h-7 rounded bg-[#282a2c] hover:bg-[#E74C3C] text-[#8E9297] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                              title="Supprimer la partie de la grille"
                            >
                              <span className="material-symbols-outlined text-xs">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Quick Parameters Config Panel (4 cols) */}
          <div className="lg:col-span-4 bg-[#1A1D20] border border-[#333537] p-6 rounded shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#282a2c]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#E87A1E]">tune</span>
                  <span className="font-mono text-xs font-bold text-[#E2E3DF]">ÉDITEUR PARAMÈTRES OP</span>
                </div>
                <span className="font-mono text-xs text-[#2ECC71] font-semibold">{syncStatus}</span>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-mono text-xs text-[#8E9297]">OPÉRATION CIBLE</label>
                <input
                  type="text"
                  readOnly
                  value={selectedOpForConfig.title}
                  className="px-3 py-2 bg-[#111315] text-[#E2E3DF] font-mono text-xs rounded border border-[#333537] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-mono text-xs text-[#8E9297]">TARIF PAF (€)</label>
                  <input
                    type="number"
                    min="0"
                    value={cfgPaf}
                    onChange={(e) => setCfgPaf(parseInt(e.target.value, 10) || 0)}
                    className="px-3 py-2 bg-[#111315] text-[#E2E3DF] font-mono text-xs rounded border border-[#333537] focus:outline-none focus:border-[#E87A1E]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-mono text-xs text-[#8E9297]">PLACES MAX</label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={cfgMaxSlots}
                    onChange={(e) => setCfgMaxSlots(parseInt(e.target.value, 10) || 30)}
                    className="px-3 py-2 bg-[#111315] text-[#E2E3DF] font-mono text-xs rounded border border-[#333537] focus:outline-none focus:border-[#E87A1E]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-mono text-xs text-[#8E9297]">LIMITE CHRONY FPS</label>
                <input
                  type="text"
                  value={cfgLimitFps}
                  onChange={(e) => setCfgLimitFps(e.target.value)}
                  className="px-3 py-2 bg-[#111315] text-[#E2E3DF] font-mono text-xs rounded border border-[#333537] focus:outline-none focus:border-[#E87A1E]"
                />
              </div>

              <div className="p-3 bg-[#141719] border border-[#282a2c] rounded space-y-1.5 font-mono text-xs text-[#8E9297]">
                <div className="flex justify-between">
                  <span>STATUT ACTUEL :</span>
                  <span className={selectedOpForConfig.isCompleted ? 'text-[#AECFB2]' : 'text-[#2ECC71]'}>
                    {selectedOpForConfig.isCompleted ? 'CLÔTURÉE (TERMINÉE)' : 'ACTIVE EN LIGNE'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>SECTEUR :</span>
                  <span className="text-[#E2E3DF] truncate max-w-[150px]">{selectedOpForConfig.sector}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#282a2c] flex flex-col gap-1.5">
              <button
                onClick={handleSaveConfig}
                className="w-full py-2.5 bg-[#E87A1E] hover:brightness-110 text-[#111315] font-mono text-xs uppercase font-bold rounded shadow transition-all cursor-pointer"
              >
                ENREGISTRER MODIFICATIONS
              </button>
              <span className="text-center font-mono text-[10px] text-[#8E9297]">
                Mise à jour immédiate sur la vue publique et le calendrier
              </span>
            </div>
          </div>
        </section>

        {/* CERAKOTE 13 MATRIX LIVE TOGGLE */}
        <section className="bg-[#1A1D20] border border-[#333537] p-6 rounded shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#282a2c]">
            <div>
              <span className="font-mono text-xs text-[#E87A1E] uppercase font-bold">
                // LOGISTIQUE MATÉRIEL & RÉPLIQUES DE LOCATION
              </span>
              <h2 className="font-['Space_Grotesk'] text-xl font-bold text-[#E2E3DF]">
                Stocks Armurerie FOST & Nuancier Cerakote (13 Teintes)
              </h2>
            </div>
            <div className="font-mono text-xs text-[#8E9297]">
              CLIQUEZ SUR L'ÉTAT D'UN COLORIS POUR COMMUTER EN DIRECT
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {cerakoteList.map((col) => {
              let badgeColor = 'bg-[#3B4D3F] text-[#4AE183]';
              if (col.status === 'RUPTURE') badgeColor = 'bg-[#93000A]/40 text-[#ffb4ab]';
              if (col.status === 'COMMANDE') badgeColor = 'bg-[#282a2c] text-[#8E9297]';

              return (
                <div
                  key={col.id}
                  className="p-2.5 rounded bg-[#111315] border border-[#282a2c] flex flex-col justify-between gap-2 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/40"
                      style={{ backgroundColor: col.hex }}
                    />
                    <span className="font-mono text-xs font-bold text-[#E2E3DF]">{col.stock} u.</span>
                  </div>
                  <span className="font-mono text-xs text-[#E2E3DF] truncate">{col.name.split('//')[0]}</span>
                  <button
                    onClick={() => handleToggleCerakoteStatus(col.id)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase transition-all cursor-pointer ${badgeColor}`}
                    title="Commuter le statut"
                  >
                    {col.status}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* CHECK-IN CHRONO LIVE REGISTRATION */}
        <section id="chrony-section" className="bg-[#1A1D20] border border-[#333537] p-6 rounded shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-[#282a2c]">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2ECC71] animate-pulse"></span>
                <span className="font-mono text-xs text-[#2ECC71] uppercase font-bold">
                  STAND DE TIR EN DIRECT // PAS DE TIR #1
                </span>
              </div>
              <h2 className="font-['Space_Grotesk'] text-xl font-bold text-[#E2E3DF]">
                Check-in Joueurs & Chronographe Terrain
              </h2>
            </div>

            {/* Quick Add Form */}
            <form onSubmit={handleAddChronyCheckin} className="flex items-center gap-2 flex-wrap">
              <input
                type="text"
                required
                value={newCallsign}
                onChange={(e) => setNewCallsign(e.target.value)}
                placeholder="CALLSIGN (EX: GHOST)"
                className="px-3 py-1.5 bg-[#111315] text-[#E2E3DF] font-mono text-xs rounded border border-[#333537] focus:outline-none focus:border-[#2ECC71] uppercase"
              />
              <select
                value={newGunClass}
                onChange={(e) => setNewGunClass(e.target.value as any)}
                className="px-2.5 py-1.5 bg-[#111315] text-[#E2E3DF] font-mono text-xs rounded border border-[#333537] cursor-pointer"
              >
                <option value="AEG">AEG (max 350 FPS)</option>
                <option value="DMR">DMR (max 400 FPS)</option>
                <option value="BOLT">BOLT (max 450 FPS)</option>
              </select>
              <input
                type="number"
                required
                value={newFps}
                onChange={(e) => setNewFps(e.target.value)}
                placeholder="FPS"
                className="w-20 px-2.5 py-1.5 bg-[#111315] text-[#E2E3DF] font-mono text-xs rounded border border-[#333537] focus:outline-none focus:border-[#2ECC71]"
              />
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#2ECC71] text-[#111315] font-mono text-xs font-bold rounded hover:brightness-110 transition-all flex items-center gap-1 cursor-pointer shadow"
              >
                <span className="material-symbols-outlined text-sm">check</span>
                VALIDER TEST
              </button>
            </form>
          </div>

          {/* Chrony records Table */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left font-['Inter'] text-xs">
              <thead>
                <tr className="bg-[#141719] text-[#8E9297] font-mono uppercase text-[11px]">
                  <th className="p-3 rounded-l">Heure</th>
                  <th className="p-3">Opérateur (Callsign)</th>
                  <th className="p-3">Réplique Déclarée</th>
                  <th className="p-3">Classe d'Arme</th>
                  <th className="p-3">Mesure Chrony</th>
                  <th className="p-3">Statut Passage</th>
                  <th className="p-3 rounded-r text-right">Pass Entrée</th>
                </tr>
              </thead>
              <tbody className="space-y-1">
                {chronyLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="bg-[#111315]/80 hover:bg-[#22262B] border-b border-[#282a2c] transition-colors"
                  >
                    <td className="p-3 font-mono text-[#8E9297]">{log.time}</td>
                    <td className="p-3 font-mono font-bold text-[#E2E3DF] flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          log.compliant ? 'bg-[#2ECC71]' : 'bg-[#E74C3C]'
                        }`}
                      />
                      {log.callsign}
                    </td>
                    <td className="p-3 text-[#E2E3DF]">{log.replica}</td>
                    <td className="p-3 font-mono text-xs text-[#8E9297]">{log.gunClass}</td>
                    <td
                      className={`p-3 font-mono font-bold text-sm ${
                        log.compliant ? 'text-[#2ECC71]' : 'text-[#E74C3C]'
                      }`}
                    >
                      {log.fps} FPS ({log.joules} J)
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold inline-flex items-center gap-1 ${
                          log.compliant
                            ? 'bg-[#3B4D3F] text-[#4AE183]'
                            : 'bg-[#93000A]/40 text-[#ffb4ab]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-xs">
                          {log.compliant ? 'verified' : 'warning'}
                        </span>
                        {log.compliant ? 'CONFORME' : 'NON CONFORME'}
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono font-semibold">
                      <span className={log.compliant ? 'text-[#2ECC71]' : 'text-[#E74C3C]'}>
                        {log.passGranted}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Persistence Banner */}
        <footer className="bg-[#1A1D20] border border-[#333537] p-4 rounded shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-3 font-mono text-xs">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-[#2ECC71]">
              <span className="w-2 h-2 rounded-full bg-[#2ECC71]"></span>
              <span className="font-bold">FOST HQ COMMAND STAFF :: ONLINE</span>
            </div>
            <div className="flex items-center gap-2 text-[#8E9297] text-[11px]">
              <span className="px-2 py-0.5 rounded bg-[#111315]">Missions dans la grille : <b className="text-[#E87A1E]">{operations.length}</b></span>
              <span className="px-2 py-0.5 rounded bg-[#111315]">Membres : <b className="text-[#2ECC71]">ACTIF</b></span>
            </div>
          </div>
          <div className="text-[#8E9297] text-[11px]">
            QG FOST • SERVEUR EU-CENTRAL (PARIS) • PMR CH-01 (446.00625 MHz)
          </div>
        </footer>
      </div>

      {/* MODAL: PROGRAMMER UNE NOUVELLE PARTIE DANS LA GRILLE */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-[#1A1D20] border border-[#333537] rounded-lg shadow-2xl p-6 md:p-8 my-8 text-left">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#282a2c]">
              <div>
                <span className="font-mono text-xs text-[#E87A1E] uppercase font-bold tracking-wider">
                  // NOUVEL ENGAGEMENT TACTIQUE
                </span>
                <h3 className="font-['Space_Grotesk'] text-2xl font-bold uppercase text-[#E2E3DF] mt-0.5">
                  Programmer une Partie dans la Grille
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded bg-[#282a2c] hover:bg-[#333537] text-[#8E9297] hover:text-[#E2E3DF] flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOperationSubmit} className="space-y-4">
              <div>
                <label className="font-mono text-xs uppercase text-[#8E9297] block mb-1">
                  Titre de l'Opération *
                </label>
                <input
                  type="text"
                  required
                  placeholder="EX: OP CQB USINE // PROTOCOLE NOCTURNE"
                  value={newOpTitle}
                  onChange={(e) => setNewOpTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#111315] text-[#E2E3DF] font-mono text-xs rounded border border-[#333537] focus:outline-none focus:border-[#E87A1E] uppercase"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-xs uppercase text-[#8E9297] block mb-1">
                    Théâtre / Type d'Opération *
                  </label>
                  <select
                    value={newOpCategory}
                    onChange={(e) => setNewOpCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#111315] text-[#E2E3DF] font-mono text-xs rounded border border-[#333537] cursor-pointer"
                  >
                    <option value="cqb-usine">CQB Usine (CQC & Traceurs UV)</option>
                    <option value="chasse-foret">Chasse à l'Homme Forêt (Traque MilSim)</option>
                    <option value="exfiltration-civile">Exfiltration Civile (Sauvetage & Convoi)</option>
                    <option value="milsim-specops">MilSim Spec-Ops & Drill Tactique</option>
                  </select>
                </div>

                <div>
                  <label className="font-mono text-xs uppercase text-[#8E9297] block mb-1">
                    Jour dans la Grille (1 à 31) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    required
                    value={newOpDay}
                    onChange={(e) => {
                      const d = parseInt(e.target.value, 10) || 1;
                      setNewOpDay(d);
                      setNewOpDateStr(`Jour ${d} Octobre 2026`);
                    }}
                    className="w-full px-3 py-2 bg-[#111315] text-[#E2E3DF] font-mono text-xs rounded border border-[#333537] focus:outline-none focus:border-[#E87A1E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-xs uppercase text-[#8E9297] block mb-1">
                    Date Formatée *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="EX: Samedi 24 Octobre 2026"
                    value={newOpDateStr}
                    onChange={(e) => setNewOpDateStr(e.target.value)}
                    className="w-full px-3 py-2 bg-[#111315] text-[#E2E3DF] font-mono text-xs rounded border border-[#333537] focus:outline-none focus:border-[#E87A1E]"
                  />
                </div>

                <div>
                  <label className="font-mono text-xs uppercase text-[#8E9297] block mb-1">
                    Horaires d'Engagement *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="EX: 08h30 - 17h30 ou 20h00 - 01h00"
                    value={newOpTimeStr}
                    onChange={(e) => setNewOpTimeStr(e.target.value)}
                    className="w-full px-3 py-2 bg-[#111315] text-[#E2E3DF] font-mono text-xs rounded border border-[#333537] focus:outline-none focus:border-[#E87A1E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-xs uppercase text-[#8E9297] block mb-1">
                    Secteur / Terrain *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="EX: Usine Désaffectée Alpha (2 500m²)"
                    value={newOpSector}
                    onChange={(e) => setNewOpSector(e.target.value)}
                    className="w-full px-3 py-2 bg-[#111315] text-[#E2E3DF] font-mono text-xs rounded border border-[#333537] focus:outline-none focus:border-[#E87A1E]"
                  />
                </div>

                <div>
                  <label className="font-mono text-xs uppercase text-[#8E9297] block mb-1">
                    Sous-Secteur / Bâtiment
                  </label>
                  <input
                    type="text"
                    placeholder="EX: Hangar 3 & Sentiers forestiers"
                    value={newOpSectorSub}
                    onChange={(e) => setNewOpSectorSub(e.target.value)}
                    className="w-full px-3 py-2 bg-[#111315] text-[#E2E3DF] font-mono text-xs rounded border border-[#333537] focus:outline-none focus:border-[#E87A1E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-mono text-xs uppercase text-[#8E9297] block mb-1">
                    Capacité Max Slots *
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    required
                    value={newOpMaxSlots}
                    onChange={(e) => setNewOpMaxSlots(parseInt(e.target.value, 10) || 30)}
                    className="w-full px-3 py-2 bg-[#111315] text-[#E2E3DF] font-mono text-xs rounded border border-[#333537] focus:outline-none focus:border-[#E87A1E]"
                  />
                </div>

                <div>
                  <label className="font-mono text-xs uppercase text-[#8E9297] block mb-1">
                    PAF Session Non-Membre (€)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newOpPaf}
                    onChange={(e) => setNewOpPaf(parseInt(e.target.value, 10) || 5)}
                    className="w-full px-3 py-2 bg-[#111315] text-[#E2E3DF] font-mono text-xs rounded border border-[#333537] focus:outline-none focus:border-[#E87A1E]"
                  />
                </div>

                <div>
                  <label className="font-mono text-xs uppercase text-[#8E9297] block mb-1">
                    Limite Chrony FPS
                  </label>
                  <input
                    type="text"
                    value={newOpLimitFps}
                    onChange={(e) => setNewOpLimitFps(e.target.value)}
                    className="w-full px-3 py-2 bg-[#111315] text-[#E2E3DF] font-mono text-xs rounded border border-[#333537] focus:outline-none focus:border-[#E87A1E]"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono text-xs uppercase text-[#8E9297] block mb-1">
                  Briefing & Situation Tactique
                </label>
                <textarea
                  rows={3}
                  placeholder="Détails du scénario, objectifs de mission, consignes d'emport et règles spécifiques..."
                  value={newOpDesc}
                  onChange={(e) => setNewOpDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-[#111315] text-[#E2E3DF] font-mono text-xs rounded border border-[#333537] focus:outline-none focus:border-[#E87A1E]"
                />
              </div>

              <div className="pt-4 border-t border-[#282a2c] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-[#282a2c] hover:bg-[#333537] text-[#8E9297] hover:text-[#E2E3DF] font-mono text-xs uppercase rounded cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#E87A1E] text-[#111315] font-mono text-xs uppercase font-bold rounded hover:brightness-110 shadow-lg cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">publish</span>
                  Publier dans la Grille
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
