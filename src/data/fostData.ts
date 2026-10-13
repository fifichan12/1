export interface Operator {
  id: string;
  code: string;
  name: string;
  callsign: string;
  role: string;
  category: string;
  status: string;
  image: string;
  loadout: string;
  secondary: string;
  camo: string;
  protection: string;
  joules: string;
  experience: string;
  specsTag: string;
  favoriteColor: string;
  bio: string;
}

export interface OperationEvent {
  id: string;
  code: string;
  title: string;
  category: string;
  categoryLabel: string;
  sector: string;
  sectorSub: string;
  dateStr: string;
  timeStr: string;
  dayOfMonth: number;
  isCompleted: boolean;
  image: string;
  altText: string;
  description: string;
  paf: number;
  memberPaf: number;
  pafNote: string;
  bookedSlots: number;
  maxSlots: number;
  statusText: string;
  statusUrgency: 'normal' | 'warning' | 'urgent';
  specs: {
    calendar: string;
    location: string;
    medic: string;
    ammo: string;
    requirement: string;
    limitFps: string;
    engagement: string;
    logistics: string;
  };
}

export interface MembershipTier {
  id: 'test' | 'standard' | 'premium';
  name: string;
  subtitle: string;
  badge: string;
  price: number;
  period: string;
  highlight?: boolean;
  color: string;
  description: string;
  features: string[];
}

export interface ChronyRecord {
  id: string;
  time: string;
  callsign: string;
  operatorName: string;
  replica: string;
  gunClass: 'AEG' | 'DMR' | 'BOLT';
  fps: number;
  joules: number;
  compliant: boolean;
  passGranted: string;
}

export interface CerakoteColor {
  id: string;
  name: string;
  hex: string;
  image: string;
  status: 'EN STOCK' | 'RUPTURE' | 'COMMANDE';
  stock: number;
}

export interface WeaponModel {
  code: string;
  name: string;
  shortDesc: string;
  fullDesc: string;
  fps: string;
  rps: string;
  range: string;
  electronics: string;
  hopUp: string;
  price?: number;
  baseImage?: string;
}

export const FOST_LEGAL_INFO = {
  associationName: 'Force Opérationnelle de Simulation Tactique (F.O.S.T.)',
  siegeSocial: '17 Rue Maréchal Joffre, 57120 ROMBAS',
  tribunal: 'Registre des Associations du Tribunal Judiciaire de Metz (Loi 1908/1901)',
  saison: 'SAISON 2026',
  email: 'fost.contact.off@gmail.com'
};

export const MEMBERSHIP_TIERS: MembershipTier[] = [
  {
    id: 'test',
    name: 'Membre Test',
    subtitle: 'Période d\'essai probatoire 6 mois',
    badge: 'ESSAI 6 MOIS',
    price: 15,
    period: '6 mois',
    color: '#38BDF8',
    description: 'Idéal pour tester l\'ambiance FOST, participer aux initiations et découvrir les simulations MilSim.',
    features: [
      'Accès aux 3 types d\'opérations (CQB, Forêt, Exfiltration)',
      'Tarif session préférentiel à 0 € (inclus dans la période)',
      'Accompagnement par un parrain vétéran de l\'escouade',
      'Montant déductible de la cotisation annuelle 2026'
    ]
  },
  {
    id: 'standard',
    name: 'Membre Titulaire',
    subtitle: 'Adhésion officielle annuelle 2026',
    badge: 'TITULAIRE OFFICIEL',
    price: 20,
    period: 'an',
    highlight: true,
    color: '#2ECC71',
    description: 'Cotisation officielle homologuée au Tribunal Judiciaire de Metz. Statut d\'opérateur titulaire à part entière.',
    features: [
      'Accès illimité à TOUTES les OP 2026 à 0,00 €',
      'Assurance Responsabilité Civile Sportive FFBA/FOST incluse',
      'Droit de vote aux Assemblées Générales de l\'association',
      'Écusson d\'épaule velcro officiel FOST offert',
      'Accès prioritaire aux canaux radio sécurisés & Discord privé'
    ]
  },
  {
    id: 'premium',
    name: 'Membre Premium',
    subtitle: 'Formule Soutien Élite & Privilège',
    badge: 'ÉLITE SOUTIEN',
    price: 80,
    period: 'an',
    color: '#E87A1E',
    description: 'Pour les joueurs investis qui soutiennent le développement de nos infrastructures et profitent d\'avantages armurerie.',
    features: [
      'Tous les avantages Membre Titulaire (Accès 0€ toutes OP)',
      'Prêt gratuit d\'une réplique backup révisée en cas de panne',
      'Remise permanente de -20% sur les travaux de personnalisation Cerakote',
      'Patch collector brodé fil or + Insigne métal de matricule',
      'Priorité absolue de réservation sur les créneaux slots limités'
    ]
  }
];

export const OPERATORS: Operator[] = [
  {
    id: 'op-ilyane',
    code: '01',
    name: 'Ilyane B.',
    callsign: 'VIPER',
    role: 'Commandant d\'Escouade & Stratège MilSim',
    category: 'Commandement',
    status: 'OPÉRATIONNEL',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnEPiIs4tkFQO9SBDGHHEgoZCLqrcxpgaj_k81rLoVOsv2wjpIORwPph18B2c3IfcnJJDlaUd8dH8VGtAJ0pwfwm8EuezId5vjMsFtYVGjP2Ne18NPiRiAcsQzrdO_yn7IXkeSDEJGDQkwXpRy4m172tKY6FW-jlaOtBScDL67NyzwzyMEdgGO61ncMop_qqOZvpc-Ix2uUHXuto1bvPUjYD33MDDjxGOLFZjanpiNDRrzv2ymXt5lzK_gTUzYNQC9sQ',
    loadout: 'MK Mod-1 Carbine Cerakote Noir Stealth',
    secondary: 'Glock 19X GBB 6mm',
    camo: 'Multicam Black / Ranger Green',
    protection: 'Porte-plaques JPC 2.0 + Casque Ops-Core Fast',
    joules: '1.14 J (350 FPS @ 0.20g)',
    experience: '8 Années d\'Expérience (Fondateur)',
    specsTag: 'LEADERSHIP & CQC',
    favoriteColor: 'Noir Tactique // Stealth',
    bio: 'Fondateur et coordinateur tactique de l\'escouade FOST. Spécialiste des mouvements asymétriques et de la transmission radio sur le canal 01.'
  },
  {
    id: 'op-sofiane',
    code: '02',
    name: 'Sofiane K.',
    callsign: 'GHOST',
    role: 'Breacher CQB & Spécialiste Neutralisation Rapide',
    category: 'CQB',
    status: 'OPÉRATIONNEL',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCdDxzlc4wch80yRJhaadSEfawWF1tsVCKM-hNeVyROUyXi5wdN1bVZdxlEswnZXLuVvzEemUrvy4URGiMTgnQzZhQWzwkTxX1MgXxhmBV7_KND6POAFVIJsWOcoK67JHHUoUTYfHFmpLvVhOK21L6al5ze4KjKKuhWni_CQug_qUFNnKB-3fhFrVQARvkoPtdVq4m8pigTzVesj34kEAV6AokrU_6U77x3KPSJ98IZPyDXCx_5de_',
    loadout: 'MP5 CQB Spec Cerakote Cobalt Blue',
    secondary: 'SIG Sauer P320 M18 GBB',
    camo: 'Urban Night Camo / Tenue Noire Intégrale',
    protection: 'Gilet Chest Rig Léger + Visière Balistique EN166B',
    joules: '0.84 J (300 FPS @ 0.20g)',
    experience: '5 Années CQB Usine',
    specsTag: 'BREACH & INFILTRATION',
    favoriteColor: 'Cobalt Metallic // Deep Blue',
    bio: 'Premier homme dans la porte lors des assauts en usine désaffectée. Réflexes ultra-vifs et tir réflexe à double tap homologué.'
  },
  {
    id: 'op-ilian',
    code: '03',
    name: 'Ilian R.',
    callsign: 'SPECTER',
    role: 'Tireur d\'Élite DMR (Designated Marksman)',
    category: 'DMR',
    status: 'OPÉRATIONNEL',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATQexWToyS5tYgK1W2JYGk0GeItQ4JwtP4oUS8lWwXK_8PSaGQifIo0wlJ9f6X87f2-KUZKyM90oZZzMjNHR0sVjKCxiTVuOivBX5zTu44v_f5VY3csI3v0xpR4WaWPMKu2R6zoJLp1xyIc0ABtx6NWXrrr-Ko3r4uRTuVFpGPofMM3GS_TRU1M3-Sf2VF52ZfRjw3CI_XyzkccQVTKB81XbD-R88kX7rAXNinfTbsdLObxssziZiC',
    loadout: 'DMR SR-25 HPA Bloqué Semi-Auto',
    secondary: 'FNX-45 Tactical avec Micro Red-Dot',
    camo: 'Ghillie 3D Hybrid / Woodland Moss',
    protection: 'Harnais Sniper Bas Profil + Masque Grillagé',
    joules: '1.48 J (400 FPS @ 0.20g, MED 15m)',
    experience: '6 Années Reconnaissance & Forêt',
    specsTag: 'RECON & TIERS LONGS',
    favoriteColor: 'OD Green // Woodland Moss',
    bio: 'Maître du camouflage et de la surveillance en sous-bois sur les 25 hectares de Rombas. Fournit le renseignement tactique en temps réel à l\'équipe.'
  },
  {
    id: 'op-noah',
    code: '04',
    name: 'Noah D.',
    callsign: 'TITAN',
    role: 'Opérateur d\'Assaut Lourd & Appui-Feu',
    category: 'Assaut',
    status: 'OPÉRATIONNEL',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6j0HGTRPOYb_6G7ZP1QrBYNJL3fwI3usIW6C96otwSYi3EidRdabhCT9-6wzKbDAhQ4iwYB9iGYH-5dbzjTmYYckCg5zRyzaJYGbtt_lIQrbmonabGeFm_Jod9uVmeMBdrBLUxJ4wNUhMf46SELSOC03IOURCYY5uZFLm1oic2fk04f4l3ni2LPw35gyCwxMIQSc9RaLVLEqeuPibMOwmRpiLRdPAmBidN4bHZNnfEk1-5AYP4ton',
    loadout: 'AK Tactical Heavy Cerakote Burnt Bronze',
    secondary: 'AAP-01 Custom Full-Auto Lock',
    camo: 'Coyote Tan / multicam Arid',
    protection: 'Plate Carrier CIRAS + Protection Cervicale',
    joules: '1.14 J (350 FPS @ 0.20g)',
    experience: '4 Années Drill MilSim',
    specsTag: 'APPUI-FEU & COUVERTURE',
    favoriteColor: 'Burnt Bronze // Metallic',
    bio: 'Spécialiste de la fixation de l\'adversaire et de la couverture de repli lors des exfiltrations de VIP. Emport important de munitions bio.'
  },
  {
    id: 'op-luciano',
    code: '05',
    name: 'Luciano M.',
    callsign: 'PHANTOM',
    role: 'Éclaireur Recon & Transmetteur Radio',
    category: 'Assaut',
    status: 'OPÉRATIONNEL',
    image: 'https://lh3.googleusercontent.com/aida/AEtjO1XQ4NPkLyCWHlFwZY6vqbsOVRlZQJnE6fgc8YNbgs_-dlBFdlCcoQ7JaDzwhmuyA56e3etRIIzPnSesbEB8475B3iSe8z3rVXUu0eOz-GhoWZ7nDzwBFhtkmnxeSrFUCONzNkTorhFEoX_7nMRbnvBizPp_T7BLbrEW7j_Ip6aYUQfv7I9zTaho-5ja84qg7wSco0VPUxcaESzHdh8bt87zMS68ZvOHYoHIXgHoUglRxVhM3Nf3ZICOMz5kky7pMOGEb4qVQXJ7Gw',
    loadout: 'MK Mod-1 Carbine Cerakote Sniper Gray',
    secondary: 'Hi-Capa 5.1 Gold Match Custom',
    camo: 'Wolf Gray / Black Multicam',
    protection: 'Plate Carrier Slickster + Casque Tactique',
    joules: '1.10 J (344 FPS @ 0.20g)',
    experience: '5 Années Opérations Spéciales',
    specsTag: 'TRANSMISSION & ÉCLAIREUR',
    favoriteColor: 'Sniper Gray // Cerakote',
    bio: 'Opérateur de liaison radio PMR-446. Coordonne les flancs d\'attaque et sécurise les zones d\'atterrissage lors des missions d\'escorte.'
  }
];

export const OPERATIONS: OperationEvent[] = [
  {
    id: 'OP-CQB-USINE',
    code: 'OPORD #048',
    title: 'OP CQB USINE // PROTOCOLE NOCTURNE & TRACEURS',
    category: 'cqb-usine',
    categoryLabel: 'CQB USINE',
    sector: 'Complexe Industriel Rombas (2 500m²)',
    sectorSub: 'Hangar Principal & Coursives Métalliques',
    dateStr: 'Samedi 10 Octobre 2026',
    timeStr: '09h00 - 17h30',
    dayOfMonth: 10,
    isCompleted: false,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCdDxzlc4wch80yRJhaadSEfawWF1tsVCKM-hNeVyROUyXi5wdN1bVZdxlEswnZXLuVvzEemUrvy4URGiMTgnQzZhQWzwkTxX1MgXxhmBV7_KND6POAFVIJsWOcoK67JHHUoUTYfHFmpLvVhOK21L6al5ze4KjKKuhWni_CQug_qUFNnKB-3fhFrVQARvkoPtdVq4m8pigTzVesj34kEAV6AokrU_6U77x3KPSJ98IZPyDXCx_5de_',
    altText: 'Opération CQB Usine en milieu industriel confiné avec traceurs UV',
    description: 'Assaut rapproché nerveux au sein d\'une friche industrielle sécurisée de 2 500m². Progression en binôme, nettoyages de pièces à l\'aveugle, tirs reflex et utilisation de traceurs UV dans les zones sombres.',
    paf: 5,
    memberPaf: 0,
    pafNote: '5,00 € la réservation session • 0,00 € GRATUIT pour les Membres Adhérents FOST',
    bookedSlots: 24,
    maxSlots: 30,
    statusText: '6 PLACES RESTANTES // DERNIERS SLOTS',
    statusUrgency: 'warning',
    specs: {
      calendar: 'Samedi 10 Octobre 2026 (09h00 - 17h30)',
      location: 'Complexe Usine Désaffectée #3, Secteur Rombas 57120',
      medic: '1 Bandage Médic par joueur + Spawn toutes les 10 minutes',
      ammo: 'Semi-Automatique strict • Chargeurs Mid-Cap sans molette • Billes Bio 0.25g',
      requirement: 'Lunettes EN166B obligatoires + Masque bas de visage grillagé vivement exigé',
      limitFps: 'Max 300 FPS (0.84 Joule) • Règle du Pan-t\'es-out si < 2m',
      engagement: 'Combat rapproché, lampes tactiques autorisées (max 300 lumens)',
      logistics: 'Zone de rechargement batteries LiPo, safe-zone abritée et café offert'
    }
  },
  {
    id: 'OP-CHASSE-FORET',
    code: 'OPORD #049',
    title: 'OP CHASSE À L\'HOMME // FORÊT DES BRUMES',
    category: 'chasse-foret',
    categoryLabel: 'CHASSE FORÊT',
    sector: 'Domaine Forestier Rombas (25 Hectares)',
    sectorSub: 'Périmètre Lisières & Ravins Profonds',
    dateStr: 'Dimanche 18 Octobre 2026',
    timeStr: '08h30 - 16h45',
    dayOfMonth: 18,
    isCompleted: false,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATQexWToyS5tYgK1W2JYGk0GeItQ4JwtP4oUS8lWwXK_8PSaGQifIo0wlJ9f6X87f2-KUZKyM90oZZzMjNHR0sVjKCxiTVuOivBX5zTu44v_f5VY3csI3v0xpR4WaWPMKu2R6zoJLp1xyIc0ABtx6NWXrrr-Ko3r4uRTuVFpGPofMM3GS_TRU1M3-Sf2VF52ZfRjw3CI_XyzkccQVTKB81XbD-R88kX7rAXNinfTbsdLObxssziZiC',
    altText: 'Opération Chasse à l\'homme sur les 25 hectares de forêt dense de Rombas',
    description: 'Scénario asymétrique intense sur 25 hectares de forêt dense et vallonnée. Une escouade isolée de fuyards doit s\'infiltrer et atteindre des points de ralliement secrets tout en échappant à la traque de la meute FOST.',
    paf: 5,
    memberPaf: 0,
    pafNote: '5,00 € la réservation session • 0,00 € GRATUIT pour les Membres Adhérents FOST',
    bookedSlots: 18,
    maxSlots: 36,
    statusText: '18 PLACES DISPONIBLES // 5€ OU 0€ MEMBRE',
    statusUrgency: 'normal',
    specs: {
      calendar: 'Dimanche 18 Octobre 2026 (08h30 - 16h45)',
      location: 'Forêt des Brumes - Parking Lisière Nord Rombas',
      medic: 'Aucun respawn en vague pour les fuyards • 2 vies par joueur avec garrot CAT',
      ammo: 'Emport limité à 400 billes bio par opérateur • Rafales courtes 3 billes max',
      requirement: 'Chaussures de randonnée montantes obligatoires (terrain accidenté)',
      limitFps: 'AEG 350 FPS (1.14J) • DMR 400 FPS (MED 15m) • Bolt 450 FPS (MED 20m)',
      engagement: 'Reconnaissance discrète, balises GPS et boussole recommandées',
      logistics: 'Ravitaillement eau 1.5L minimum par joueur, barbecue collectif à midi'
    }
  },
  {
    id: 'OP-EXFILTRATION-CIVILE',
    code: 'OPORD #050',
    title: 'OP EXFILTRATION CIVILE // SAUVETAGE EN ZONE HOSTILE',
    category: 'exfiltration-civile',
    categoryLabel: 'EXFILTRATION CIVILE',
    sector: 'Secteur Mixte Hangar & Clairière (Zone Bravo)',
    sectorSub: 'Route de Convoi & Point d\'Extraction Alpha',
    dateStr: 'Samedi 24 Octobre 2026',
    timeStr: '09h30 - 17h00',
    dayOfMonth: 24,
    isCompleted: false,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6j0HGTRPOYb_6G7ZP1QrBYNJL3fwI3usIW6C96otwSYi3EidRdabhCT9-6wzKbDAhQ4iwYB9iGYH-5dbzjTmYYckCg5zRyzaJYGbtt_lIQrbmonabGeFm_Jod9uVmeMBdrBLUxJ4wNUhMf46SELSOC03IOURCYY5uZFLm1oic2fk04f4l3ni2LPw35gyCwxMIQSc9RaLVLEqeuPibMOwmRpiLRdPAmBidN4bHZNnfEk1-5AYP4ton',
    altText: 'Opération MilSim Exfiltration Civile escorte de convoi et VIP sous feu hostile',
    description: 'Simulation MilSim immersive d\'escorte de VIP civils et de scientifiques à travers un couloir d\'embuscades. Gestion du convoi, réaction aux IED fictifs, tirs de suppression et évacuation chronométrée.',
    paf: 5,
    memberPaf: 0,
    pafNote: '5,00 € la réservation session • 0,00 € GRATUIT pour les Membres Adhérents FOST',
    bookedSlots: 26,
    maxSlots: 32,
    statusText: '6 PLACES RESTANTES // INSCRIPTIONS CLÔTURÉES BIENTÔT',
    statusUrgency: 'warning',
    specs: {
      calendar: 'Samedi 24 Octobre 2026 (09h30 - 17h00)',
      location: 'Secteur Mixte Hangar & Clairière - Rombas 57120',
      medic: 'Protocole brancardage : VIP touché = transport obligatoire en civière Safe',
      ammo: 'Billes Bio 100% certifiées • Contrôle inopiné des chargeurs par les marshals',
      requirement: 'Chiffon rouge de mort (« Dead Rag ») obligatoire de jour et lampe rouge de nuit',
      limitFps: 'AEG 350 FPS (1.14J) • Pistolet Backup GBB 330 FPS max (1.00J)',
      engagement: 'Escorte rapprochée, communications strictes sur PMR-446 Canal 04',
      logistics: 'Véhicules logistiques fictifs, trousse de premiers secours SAMU 15'
    }
  }
];

export const CERAKOTE_COLORS: CerakoteColor[] = [
  {
    id: 'noir-stealth',
    name: 'Noir Tactique // Stealth',
    hex: '#141619',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBB9IrjWfO8MLS3WcLCFxkG-5u7eo7ixte06xCCTT7jmLgV1lowO8xSgvBy7m1stDZ5UNBOJ_6qIhTv-qgkDqYkSaXYpcNf0UyOObbwRyDtYadEkqEkrEbDJM-Pofg5oNT1wh8Vp4UviZv0BgnJ7j4mcQdNr4cOPEp2DmSYqbfZ-ebvxK0pdkPWhE6UuDc-Lb02GmtZ0r1_TvxoaFJ5I959dWQb7I42NUswL9QRw2ruE7nnqIE5PIga',
    status: 'EN STOCK',
    stock: 12
  },
  {
    id: 'sniper-gray',
    name: 'Sniper Gray // Mat',
    hex: '#53565A',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBB9IrjWfO8MLS3WcLCFxkG-5u7eo7ixte06xCCTT7jmLgV1lowO8xSgvBy7m1stDZ5UNBOJ_6qIhTv-qgkDqYkSaXYpcNf0UyOObbwRyDtYadEkqEkrEbDJM-Pofg5oNT1wh8Vp4UviZv0BgnJ7j4mcQdNr4cOPEp2DmSYqbfZ-ebvxK0pdkPWhE6UuDc-Lb02GmtZ0r1_TvxoaFJ5I959dWQb7I42NUswL9QRw2ruE7nnqIE5PIga',
    status: 'EN STOCK',
    stock: 8
  },
  {
    id: 'od-green',
    name: 'Olive Drab // Woodland Moss',
    hex: '#3B4D3F',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATQexWToyS5tYgK1W2JYGk0GeItQ4JwtP4oUS8lWwXK_8PSaGQifIo0wlJ9f6X87f2-KUZKyM90oZZzMjNHR0sVjKCxiTVuOivBX5zTu44v_f5VY3csI3v0xpR4WaWPMKu2R6zoJLp1xyIc0ABtx6NWXrrr-Ko3r4uRTuVFpGPofMM3GS_TRU1M3-Sf2VF52ZfRjw3CI_XyzkccQVTKB81XbD-R88kX7rAXNinfTbsdLObxssziZiC',
    status: 'EN STOCK',
    stock: 14
  },
  {
    id: 'magpul-fde',
    name: 'Magpul FDE // Flat Dark Earth',
    hex: '#B89758',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBB9IrjWfO8MLS3WcLCFxkG-5u7eo7ixte06xCCTT7jmLgV1lowO8xSgvBy7m1stDZ5UNBOJ_6qIhTv-qgkDqYkSaXYpcNf0UyOObbwRyDtYadEkqEkrEbDJM-Pofg5oNT1wh8Vp4UviZv0BgnJ7j4mcQdNr4cOPEp2DmSYqbfZ-ebvxK0pdkPWhE6UuDc-Lb02GmtZ0r1_TvxoaFJ5I959dWQb7I42NUswL9QRw2ruE7nnqIE5PIga',
    status: 'EN STOCK',
    stock: 10
  },
  {
    id: 'coyote-tan',
    name: 'Coyote Tan // Desert Spec',
    hex: '#967140',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBB9IrjWfO8MLS3WcLCFxkG-5u7eo7ixte06xCCTT7jmLgV1lowO8xSgvBy7m1stDZ5UNBOJ_6qIhTv-qgkDqYkSaXYpcNf0UyOObbwRyDtYadEkqEkrEbDJM-Pofg5oNT1wh8Vp4UviZv0BgnJ7j4mcQdNr4cOPEp2DmSYqbfZ-ebvxK0pdkPWhE6UuDc-Lb02GmtZ0r1_TvxoaFJ5I959dWQb7I42NUswL9QRw2ruE7nnqIE5PIga',
    status: 'EN STOCK',
    stock: 7
  },
  {
    id: 'cobalt-metallic',
    name: 'Cobalt Metallic // Deep Blue',
    hex: '#2B3D52',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCdDxzlc4wch80yRJhaadSEfawWF1tsVCKM-hNeVyROUyXi5wdN1bVZdxlEswnZXLuVvzEemUrvy4URGiMTgnQzZhQWzwkTxX1MgXxhmBV7_KND6POAFVIJsWOcoK67JHHUoUTYfHFmpLvVhOK21L6al5ze4KjKKuhWni_CQug_qUFNnKB-3fhFrVQARvkoPtdVq4m8pigTzVesj34kEAV6AokrU_6U77x3KPSJ98IZPyDXCx_5de_',
    status: 'EN STOCK',
    stock: 5
  },
  {
    id: 'burnt-bronze',
    name: 'Burnt Bronze // Metallic',
    hex: '#8C6239',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6j0HGTRPOYb_6G7ZP1QrBYNJL3fwI3usIW6C96otwSYi3EidRdabhCT9-6wzKbDAhQ4iwYB9iGYH-5dbzjTmYYckCg5zRyzaJYGbtt_lIQrbmonabGeFm_Jod9uVmeMBdrBLUxJ4wNUhMf46SELSOC03IOURCYY5uZFLm1oic2fk04f4l3ni2LPw35gyCwxMIQSc9RaLVLEqeuPibMOwmRpiLRdPAmBidN4bHZNnfEk1-5AYP4ton',
    status: 'EN STOCK',
    stock: 9
  },
  {
    id: 'tungsten',
    name: 'Tungsten // Gunmetal',
    hex: '#3E4144',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBB9IrjWfO8MLS3WcLCFxkG-5u7eo7ixte06xCCTT7jmLgV1lowO8xSgvBy7m1stDZ5UNBOJ_6qIhTv-qgkDqYkSaXYpcNf0UyOObbwRyDtYadEkqEkrEbDJM-Pofg5oNT1wh8Vp4UviZv0BgnJ7j4mcQdNr4cOPEp2DmSYqbfZ-ebvxK0pdkPWhE6UuDc-Lb02GmtZ0r1_TvxoaFJ5I959dWQb7I42NUswL9QRw2ruE7nnqIE5PIga',
    status: 'EN STOCK',
    stock: 6
  },
  {
    id: 'desert-sand',
    name: 'Desert Sand // Dune',
    hex: '#C2B280',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBB9IrjWfO8MLS3WcLCFxkG-5u7eo7ixte06xCCTT7jmLgV1lowO8xSgvBy7m1stDZ5UNBOJ_6qIhTv-qgkDqYkSaXYpcNf0UyOObbwRyDtYadEkqEkrEbDJM-Pofg5oNT1wh8Vp4UviZv0BgnJ7j4mcQdNr4cOPEp2DmSYqbfZ-ebvxK0pdkPWhE6UuDc-Lb02GmtZ0r1_TvxoaFJ5I959dWQb7I42NUswL9QRw2ruE7nnqIE5PIga',
    status: 'RUPTURE',
    stock: 0
  },
  {
    id: 'midnight-blue',
    name: 'Midnight Blue // Night Ops',
    hex: '#1B263B',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCdDxzlc4wch80yRJhaadSEfawWF1tsVCKM-hNeVyROUyXi5wdN1bVZdxlEswnZXLuVvzEemUrvy4URGiMTgnQzZhQWzwkTxX1MgXxhmBV7_KND6POAFVIJsWOcoK67JHHUoUTYfHFmpLvVhOK21L6al5ze4KjKKuhWni_CQug_qUFNnKB-3fhFrVQARvkoPtdVq4m8pigTzVesj34kEAV6AokrU_6U77x3KPSJ98IZPyDXCx_5de_',
    status: 'COMMANDE',
    stock: 2
  },
  {
    id: 'titanium',
    name: 'Titanium // Silver Frost',
    hex: '#8A8D8F',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBB9IrjWfO8MLS3WcLCFxkG-5u7eo7ixte06xCCTT7jmLgV1lowO8xSgvBy7m1stDZ5UNBOJ_6qIhTv-qgkDqYkSaXYpcNf0UyOObbwRyDtYadEkqEkrEbDJM-Pofg5oNT1wh8Vp4UviZv0BgnJ7j4mcQdNr4cOPEp2DmSYqbfZ-ebvxK0pdkPWhE6UuDc-Lb02GmtZ0r1_TvxoaFJ5I959dWQb7I42NUswL9QRw2ruE7nnqIE5PIga',
    status: 'EN STOCK',
    stock: 4
  },
  {
    id: 'snow-camo',
    name: 'Alpine White // Snow Camo',
    hex: '#E5E8EB',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBB9IrjWfO8MLS3WcLCFxkG-5u7eo7ixte06xCCTT7jmLgV1lowO8xSgvBy7m1stDZ5UNBOJ_6qIhTv-qgkDqYkSaXYpcNf0UyOObbwRyDtYadEkqEkrEbDJM-Pofg5oNT1wh8Vp4UviZv0BgnJ7j4mcQdNr4cOPEp2DmSYqbfZ-ebvxK0pdkPWhE6UuDc-Lb02GmtZ0r1_TvxoaFJ5I959dWQb7I42NUswL9QRw2ruE7nnqIE5PIga',
    status: 'COMMANDE',
    stock: 1
  },
  {
    id: 'crimson-tactical',
    name: 'Crimson Red // Strike Spec',
    hex: '#800020',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBB9IrjWfO8MLS3WcLCFxkG-5u7eo7ixte06xCCTT7jmLgV1lowO8xSgvBy7m1stDZ5UNBOJ_6qIhTv-qgkDqYkSaXYpcNf0UyOObbwRyDtYadEkqEkrEbDJM-Pofg5oNT1wh8Vp4UviZv0BgnJ7j4mcQdNr4cOPEp2DmSYqbfZ-ebvxK0pdkPWhE6UuDc-Lb02GmtZ0r1_TvxoaFJ5I959dWQb7I42NUswL9QRw2ruE7nnqIE5PIga',
    status: 'EN STOCK',
    stock: 3
  }
];

export const WEAPON_MODELS: Record<string, WeaponModel> = {
  mp5: {
    code: 'MOD-01 // MP5 CQB',
    name: 'MP5 CQB SPEC',
    shortDesc: 'Ultra-compacte, CQB, cadence élevée et maniabilité extrême en espace confiné.',
    fullDesc: 'Plateforme SMG réputée conçue pour les incursions en milieux étroits et le combat urbain CQC. Munie d\'une crosse rétractable 3 positions, d\'un bloc Hop-up rotatif haute précision et d\'un garde-main M-LOK avec grip vertical.',
    fps: '300 FPS (0.84 Joule)',
    rps: '24 Billes / Sec (LiPo 11.1V)',
    range: '42 Mètres Précision',
    electronics: 'MOSFET Gate Aster V2 Optique',
    hopUp: 'Bloc Rotatif PDI 6.03mm (229mm)'
  },
  mk: {
    code: 'MOD-02 // MK MOD-1',
    name: 'MK MOD-1 CARBINE',
    shortDesc: 'Polyvalence mid-range, rails M-LOK usinés CNC et contrôle de recul optimisé.',
    fullDesc: 'Carabine d\'assaut modulaire tactique tout-terrain. Idéale pour les engagements mixtes forêt et extérieur. Équipée d\'un canon externe flûté, d\'un système de changement rapide de ressort ESA et d\'un rail Picatinny intégral.',
    fps: '345 FPS (1.10 Joules)',
    rps: '21 Billes / Sec',
    range: '58 Mètres Précision',
    electronics: 'ETU Kestrel V2 Bluetooth Programmable',
    hopUp: 'Chambre CNC Maxx Model + Maple Leaf 60°'
  },
  ak: {
    code: 'MOD-03 // AK HEAVY',
    name: 'AK TACTICAL HEAVY',
    shortDesc: 'Ergonomie moderne Zenitco, pénétration, tir tendu et stabilité balistique maximale.',
    fullDesc: 'Plateforme robuste modernisée avec kit complet B-30/B-31 Zenitco, sélecteur élargi ambidextre et crosse PT-1 réglable. Moteur high-torque néodyme et engrenages usinés en acier trempé CNC 13:1.',
    fps: '350 FPS (1.14 Joules)',
    rps: '19 Billes / Sec',
    range: '62 Mètres Précision',
    electronics: 'MOSFET Perun V3 Optical',
    hopUp: 'Canon Inox Prometheus 6.03mm (363mm)'
  }
};

export const INITIAL_CHRONY_RECORDS: ChronyRecord[] = [
  {
    id: 'chr-01',
    time: '08:32',
    callsign: 'VIPER_01',
    operatorName: 'Ilyane B.',
    replica: 'MK Mod-1 Carbine',
    gunClass: 'AEG',
    fps: 345,
    joules: 1.10,
    compliant: true,
    passGranted: 'BRACELET VERT REMIS'
  },
  {
    id: 'chr-02',
    time: '08:35',
    callsign: 'GHOST_02',
    operatorName: 'Sofiane K.',
    replica: 'MP5 CQB Spec',
    gunClass: 'AEG',
    fps: 298,
    joules: 0.83,
    compliant: true,
    passGranted: 'BRACELET VERT REMIS'
  },
  {
    id: 'chr-03',
    time: '08:41',
    callsign: 'SPECTER_03',
    operatorName: 'Ilian R.',
    replica: 'SR-25 DMR Semi',
    gunClass: 'DMR',
    fps: 395,
    joules: 1.45,
    compliant: true,
    passGranted: 'BRACELET VERT REMIS'
  },
  {
    id: 'chr-04',
    time: '08:46',
    callsign: 'TITAN_04',
    operatorName: 'Noah D.',
    replica: 'AK Tactical Heavy',
    gunClass: 'AEG',
    fps: 348,
    joules: 1.12,
    compliant: true,
    passGranted: 'BRACELET VERT REMIS'
  },
  {
    id: 'chr-05',
    time: '08:52',
    callsign: 'RECRUE_X57',
    operatorName: 'Invité Extérieur',
    replica: 'M4 M-LOK Custom',
    gunClass: 'AEG',
    fps: 368,
    joules: 1.26,
    compliant: false,
    passGranted: 'REFUSÉ / EN RÉGLAGE'
  }
];
