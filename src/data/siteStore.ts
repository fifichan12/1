export interface TerrainContactConfig {
  gpsRaw?: string;
  gpsDisplay?: string;
  hqName?: string;
  address?: string;
  postalRegion?: string;
  email?: string;
  phone?: string;
  commLink?: string;
  tribunal?: string;
  socialLinks?: {
    discord?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
    facebook?: string;
  };
}

export interface HeroConfig {
  bgImage?: string;
  statusBadge?: string;
  nextOpBadge?: string;
  fpsBadge?: string;
  tagText?: string;
  mainTitle?: string;
  subtitle?: string;
  btnJoinText?: string;
  btnArmoryText?: string;
  btnOpsText?: string;
}

export interface SiteConfig {
  siteName?: string;
  unitName?: string;
  heroConfig?: HeroConfig;
  terrainContact?: TerrainContactConfig;
  legalInfo?: {
    associationName?: string;
    siegeSocial?: string;
    tribunal?: string;
    saison?: string;
    email?: string;
  };
}

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  siteName: 'FOST',
  unitName: 'Ops Airsoft // Unit-04',
  heroConfig: {
    bgImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnEPiIs4tkFQO9SBDGHHEgoZCLqrcxpgaj_k81rLoVOsv2wjpIORwPph18B2c3IfcnJJDlaUd8dH8VGtAJ0pwfwm8EuezId5vjMsFtYVGjP2Ne18NPiRiAcsQzrdO_yn7IXkeSDEJGDQkwXpRy4m172tKY6FW-jlaOtBScDL67NyzwzyMEdgGO61ncMop_qqOZvpc-Ix2uUHXuto1bvPUjYD33MDDjxGOLFZjanpiNDRrzv2ymXt5lzK_gTUzYNQC9sQ',
    statusBadge: 'Statut : Recrutement Ouvert',
    nextOpBadge: 'Prochaine OP : Samedi 08:30',
    fpsBadge: 'Puissance : 350 FPS Max',
    tagText: "Forces d'Opérations Spéciales Tactiques // Écusson FOST",
    mainTitle: 'Bienvenue chez la F.O.S.T.',
    subtitle: "Association d'airsoft d'élite axée sur le fair-play absolu, la simulation tactique militaire (MilSim) et une camaraderie indéfectible. Déploiement en terrain boisé dense et environnements CQB immersifs.",
    btnJoinText: "Rejoindre l'Escouade",
    btnArmoryText: '[ Découvrir nos Répliques ]',
    btnOpsText: 'Calendrier des OP'
  },
  terrainContact: {
    gpsRaw: '47.4568, 0.6892',
    gpsDisplay: '47.4568° N, 0.6892° E',
    hqName: 'FOST // HQ TRANS-09',
    address: '17 Rue Maréchal Joffre, 57120 ROMBAS',
    postalRegion: 'MOSELLE (57) • GRAND EST',
    email: 'fost.contact.off@gmail.com',
    phone: '06 00 00 00 00',
    commLink: 'PMR-446 CH-01 ACTIVE (446.00625 MHz)',
    tribunal: 'Registre des Associations du Tribunal Judiciaire de Metz',
    socialLinks: {
      discord: 'https://discord.gg/fost-airsoft',
      instagram: 'https://instagram.com/fost_officiel',
      youtube: 'https://youtube.com/@FOST_OFF',
      tiktok: 'https://tiktok.com/@fost_off',
      facebook: 'https://facebook.com/fost.airsoft'
    }
  },
  legalInfo: {
    associationName: 'Force Opérationnelle de Simulation Tactique (F.O.S.T.)',
    siegeSocial: '17 Rue Maréchal Joffre, 57120 ROMBAS',
    tribunal: 'Registre des Associations du Tribunal Judiciaire de Metz (Loi 1908/1901)',
    saison: 'SAISON 2026',
    email: 'fost.contact.off@gmail.com'
  }
};
