/**
 * F.O.S.T. Airsoft - Système de Génération des Récépissés & Factures Acquittées
 * Association Loi 1901 - Sans but lucratif
 * Régime fiscal : TVA non applicable, art. 261-7-1° a du CGI
 */

export type ItemType =
  | 'REPLICA_PURCHASE'
  | 'FREELANCE_OP_PASS'
  | 'MEMBER_OP_PASS'
  | 'MEMBERSHIP_DAY_PASS'
  | 'MEMBERSHIP_PASS_RENTAL'
  | 'MEMBERSHIP_ANNUAL'
  | 'GOPRO_RENTAL_BASIC'
  | 'GOPRO_RENTAL_FULL'
  | 'GOPRO_RENTAL';

export interface ReceiptDataContract {
  orderId: string;
  payerName: string;
  payerEmail: string;
  itemType: ItemType;
  amount: number; // Montant en EUR (ex: 200.00, 5.00, 0.00, 15.00, 20.00, 80.00, 10.00)
  date: string; // Date ISO ou formatée
  customItemLine?: string; // ex: "Location GoPro Pack Tactical - [Pack Basic / Fixation Casque]"
  mountType?: string; // ex: "Fixation Casque", "Fixation Torse", "Fixation Réplique"
  optionName?: string; // ex: "Pack Basic", "Pack Full"
  isGoProRental?: boolean;
  depositRefundMention?: boolean;
}

export interface ItemMetadata {
  type: ItemType;
  designation: string;
  description: string;
  unitPrice: number;
  requiresAirsoftDecree: boolean;
  requiresDepositRefundMention?: boolean;
}

export const ITEM_CATALOG: Record<ItemType, ItemMetadata> = {
  REPLICA_PURCHASE: {
    type: 'REPLICA_PURCHASE',
    designation: 'Réplique Officielle F.O.S.T. Cerakote (200,00 €)',
    description: 'Modèle officiel pré-équipé (Mosfet, Canon de précision, Finition Cerakote personnalisée)',
    unitPrice: 200.0,
    requiresAirsoftDecree: true,
    requiresDepositRefundMention: false
  },
  GOPRO_RENTAL_BASIC: {
    type: 'GOPRO_RENTAL_BASIC',
    designation: 'Location GoPro Pack Tactical - [Pack Basic / Fixation]',
    description: 'Caméra embarquée Full HD/4K + Fixation Casque/Torse/Réplique. Caution 100€ ou pièce d\'identité requise le jour J.',
    unitPrice: 10.0,
    requiresAirsoftDecree: false,
    requiresDepositRefundMention: true
  },
  GOPRO_RENTAL_FULL: {
    type: 'GOPRO_RENTAL_FULL',
    designation: 'Location GoPro Pack Tactical - [Pack Full / Fixation + SD 64GB]',
    description: 'Caméra embarquée Full HD/4K + Fixation Casque/Torse/Réplique + Carte MicroSD 64GB fournie. Caution 100€ ou pièce d\'identité requise le jour J.',
    unitPrice: 15.0,
    requiresAirsoftDecree: false,
    requiresDepositRefundMention: true
  },
  GOPRO_RENTAL: {
    type: 'GOPRO_RENTAL',
    designation: 'Location GoPro Pack Tactical',
    description: 'Caméra d\'action tactique POV pour opérations airsoft FOST. Caution 100€ ou pièce d\'identité requise le jour J.',
    unitPrice: 10.0,
    requiresAirsoftDecree: false,
    requiresDepositRefundMention: true
  },
  FREELANCE_OP_PASS: {
    type: 'FREELANCE_OP_PASS',
    designation: 'Pass Opération Airsoft - Joueur Freelance (5,00 €)',
    description: 'Accès terrain journée complète, assurance RC organisateur & plastronnage tactique',
    unitPrice: 5.0,
    requiresAirsoftDecree: false,
    requiresDepositRefundMention: false
  },
  MEMBER_OP_PASS: {
    type: 'MEMBER_OP_PASS',
    designation: 'Pass Opération Airsoft - Membre F.O.S.T. Actif (0,00 €)',
    description: 'Accès prioritaire OP inclus dans la cotisation annuelle de l\'association',
    unitPrice: 0.0,
    requiresAirsoftDecree: false,
    requiresDepositRefundMention: false
  },
  MEMBERSHIP_DAY_PASS: {
    type: 'MEMBERSHIP_DAY_PASS',
    designation: 'Adhésion Découverte / Journée Test (15,00 €)',
    description: 'Cotisation temporaire découverte 1 session + assurance fédérale temporaire',
    unitPrice: 15.0,
    requiresAirsoftDecree: false,
    requiresDepositRefundMention: false
  },
  MEMBERSHIP_PASS_RENTAL: {
    type: 'MEMBERSHIP_PASS_RENTAL',
    designation: 'Adhésion Pass + Pack Location Complet (20,00 €)',
    description: 'Accès journée avec prêt matériel tactique intégral (réplique, masque thermal, billes bio)',
    unitPrice: 20.0,
    requiresAirsoftDecree: false,
    requiresDepositRefundMention: false
  },
  MEMBERSHIP_ANNUAL: {
    type: 'MEMBERSHIP_ANNUAL',
    designation: 'Cotisation Membre Titulaire Annuelle (80,00 €)',
    description: 'Adhésion annuelle F.O.S.T. 2026 : parties gratuites illimitées, écusson officiel & voix consultative',
    unitPrice: 80.0,
    requiresAirsoftDecree: false,
    requiresDepositRefundMention: false
  }
};

/**
 * Mapper intelligent de montant HelloAsso (centimes ou euros) vers le type d'article contractuel
 */
export function mapAmountToItemType(rawAmount: number): ItemType {
  // Normalisation : si > 1000 et pas 0, considérer comme centimes (ex: 20000 -> 200, 8000 -> 80, 2000 -> 20, 1500 -> 15, 1000 -> 10, 500 -> 5)
  let normalized = rawAmount;
  if (rawAmount >= 100 && [500, 1000, 1500, 2000, 8000, 20000].includes(rawAmount)) {
    normalized = rawAmount / 100;
  }

  // Correspondances exactes
  if (Math.abs(normalized - 200) < 0.01) return 'REPLICA_PURCHASE';
  if (Math.abs(normalized - 10) < 0.01) return 'GOPRO_RENTAL_BASIC';
  if (Math.abs(normalized - 5) < 0.01) return 'FREELANCE_OP_PASS';
  if (Math.abs(normalized - 0) < 0.01) return 'MEMBER_OP_PASS';
  if (Math.abs(normalized - 15) < 0.01) return 'MEMBERSHIP_DAY_PASS';
  if (Math.abs(normalized - 20) < 0.01) return 'MEMBERSHIP_PASS_RENTAL';
  if (Math.abs(normalized - 80) < 0.01) return 'MEMBERSHIP_ANNUAL';

  // Fallback par défaut selon paliers les plus proches
  if (normalized >= 150) return 'REPLICA_PURCHASE';
  if (normalized >= 60) return 'MEMBERSHIP_ANNUAL';
  if (normalized >= 18) return 'MEMBERSHIP_PASS_RENTAL';
  if (normalized >= 12) return 'MEMBERSHIP_DAY_PASS';
  if (normalized >= 8) return 'GOPRO_RENTAL_BASIC';
  if (normalized > 0) return 'FREELANCE_OP_PASS';
  return 'MEMBER_OP_PASS';
}

/**
 * Générateur de modèle HTML/PDF imprimable respectant scrupuleusement la réglementation française
 */
export function generateReceiptHtml(receipt: ReceiptDataContract): string {
  const isGoPro = receipt.isGoProRental || receipt.itemType.startsWith('GOPRO');
  const item = ITEM_CATALOG[receipt.itemType] || {
    type: receipt.itemType,
    designation: `Prestation F.O.S.T. (${receipt.amount.toFixed(2)} €)`,
    description: 'Transaction officielle association F.O.S.T.',
    unitPrice: receipt.amount,
    requiresAirsoftDecree: receipt.amount >= 150,
    requiresDepositRefundMention: isGoPro
  };

  const itemDesignation = receipt.customItemLine || (
    isGoPro
      ? `Location GoPro Pack Tactical - [${receipt.optionName || (receipt.amount >= 15 ? 'Pack Full' : 'Pack Basic')} / ${receipt.mountType || 'Fixation Casque'}]`
      : item.designation
  );

  const hasDepositRefundMention = receipt.depositRefundMention || item.requiresDepositRefundMention || isGoPro;

  const formattedDate = new Date(receipt.date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const legalNoteDecree = item.requiresAirsoftDecree
    ? `<div class="airsoft-warning">
        <strong>AVERTISSEMENT LÉGAL AIRSOFT :</strong><br/>
        « Vente interdite aux mineurs - Décret n° 99-240 du 24 mars 1999. »<br/>
        La distribution ou cession à titre onéreux ou gratuit d'objets ayant l'apparence d'une arme à feu projetant des projectiles avec une énergie comprise entre 0,08 et 2 Joules est strictement réservée aux personnes majeures.
      </div>`
    : '';

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Reçu F.O.S.T. Airsoft - ${receipt.orderId}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 15mm 15mm 15mm 15mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      color: #1a1a1a;
    }
    body {
      background-color: #f7f7f7;
      padding: 20px;
      font-size: 13px;
      line-height: 1.5;
    }
    .receipt-container {
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #d1d5db;
      padding: 35px 40px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #111827;
      padding-bottom: 20px;
      margin-bottom: 25px;
    }
    .brand h1 {
      font-size: 20px;
      font-weight: 800;
      letter-spacing: 0.5px;
      color: #111827;
      text-transform: uppercase;
    }
    .brand p {
      font-size: 11px;
      color: #4b5563;
      margin-top: 3px;
    }
    .receipt-title {
      text-align: right;
    }
    .receipt-title h2 {
      font-size: 18px;
      color: #111827;
      text-transform: uppercase;
      font-weight: 700;
    }
    .receipt-title .ref {
      font-family: monospace;
      font-size: 12px;
      color: #2563eb;
      font-weight: bold;
    }
    .receipt-title .date {
      font-size: 11px;
      color: #6b7280;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 30px;
      padding: 15px;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 4px;
    }
    .meta-box h3 {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #6b7280;
      margin-bottom: 6px;
    }
    .meta-box p {
      font-size: 13px;
      color: #111827;
    }
    .meta-box .email {
      font-size: 12px;
      color: #4b5563;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    th {
      background-color: #111827;
      color: #ffffff;
      text-align: left;
      padding: 10px 14px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    th.text-right, td.text-right {
      text-align: right;
    }
    td {
      padding: 14px;
      border-bottom: 1px solid #e5e7eb;
      vertical-align: top;
    }
    td .item-desc {
      font-size: 11px;
      color: #6b7280;
      margin-top: 4px;
    }
    .totals-table {
      width: 50%;
      margin-left: auto;
      margin-bottom: 30px;
    }
    .totals-table td {
      padding: 8px 14px;
      border-bottom: none;
    }
    .totals-table tr.total-row {
      font-size: 15px;
      font-weight: bold;
      border-top: 2px solid #111827;
      border-bottom: 2px solid #111827;
      background: #f9fafb;
    }
    .legal-box {
      border-top: 1px solid #e5e7eb;
      padding-top: 20px;
      margin-top: 20px;
      font-size: 10.5px;
      color: #4b5563;
      line-height: 1.6;
    }
    .legal-disclaimer {
      font-weight: 700;
      color: #111827;
      margin-bottom: 8px;
    }
    .airsoft-warning {
      background: #fef2f2;
      border: 1px solid #f87171;
      color: #991b1b;
      padding: 12px 14px;
      border-radius: 4px;
      margin-top: 14px;
      font-size: 11px;
      line-height: 1.4;
    }
    .airsoft-warning strong {
      color: #7f1d1d;
    }
    .footer-stamp {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 35px;
      padding-top: 15px;
      border-top: 1px dashed #d1d5db;
      font-size: 10px;
      color: #9ca3af;
    }
    .print-bar {
      max-width: 800px;
      margin: 0 auto 15px auto;
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
    .btn-print {
      background: #111827;
      color: #ffffff;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      font-weight: bold;
      cursor: pointer;
      font-size: 12px;
    }
    @media print {
      body {
        background: #ffffff;
        padding: 0;
      }
      .receipt-container {
        border: none;
        box-shadow: none;
        padding: 0;
      }
      .print-bar {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="print-bar">
    <button class="btn-print" onclick="window.print()">Imprimer / Télécharger en PDF</button>
  </div>

  <div class="receipt-container">
    <div class="header">
      <div class="brand">
        <h1>F.O.S.T. Airsoft (Loi 1901)</h1>
        <p>Association Loi 1901 – Forces Opérationnelles Spéciales Tactiques</p>
        <p>Siège : Rombas (57120) – France | E-mail : fost.contact.off@gmail.com</p>
        <p>Agrément préfectoral & Réglementation F.F.A.</p>
      </div>
      <div class="receipt-title">
        <h2>Reçu de Paiement</h2>
        <div class="ref">Réf: ${receipt.orderId}</div>
        <div class="date">Date : ${formattedDate}</div>
      </div>
    </div>

    <div class="meta-grid">
      <div class="meta-box">
        <h3>Émetteur</h3>
        <p><strong>F.O.S.T. Airsoft (Loi 1901)</strong></p>
        <p>Association déclarée régie par la Loi du 1er Juillet 1901</p>
        <p class="email">fost.contact.off@gmail.com</p>
      </div>
      <div class="meta-box">
        <h3>Bénéficiaire / Payeur</h3>
        <p><strong>${receipt.payerName || 'Adhérent / Opérateur'}</strong></p>
        <p class="email">${receipt.payerEmail || 'Non spécifié'}</p>
        <p>Règlement validé via HelloAsso API v5</p>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Désignation de la prestation / article</th>
          <th class="text-right">Prix Unitaire</th>
          <th class="text-right">Quantité</th>
          <th class="text-right">Total Net</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>${itemDesignation}</strong>
            <div class="item-desc">${item.description}</div>
          </td>
          <td class="text-right">${item.unitPrice.toFixed(2)} €</td>
          <td class="text-right">1</td>
          <td class="text-right"><strong>${receipt.amount.toFixed(2)} €</strong></td>
        </tr>
      </tbody>
    </table>

    <table class="totals-table">
      <tr>
        <td>Total Brut :</td>
        <td class="text-right">${receipt.amount.toFixed(2)} €</td>
      </tr>
      <tr>
        <td>TVA (0%) :</td>
        <td class="text-right">0,00 €</td>
      </tr>
      <tr class="total-row">
        <td>Total Règlement Reçu :</td>
        <td class="text-right">${receipt.amount.toFixed(2)} €</td>
      </tr>
    </table>

    <div class="legal-box">
      <div class="legal-disclaimer">
        Régime fiscal : « TVA non applicable, art. 261-7-1° a du CGI. »
      </div>
      ${hasDepositRefundMention ? `
      <div style="margin: 10px 0; padding: 10px 14px; background: #ecfdf5; border: 1px solid #10b981; border-radius: 4px; color: #065f46; font-size: 11px; font-weight: bold;">
        🛡️ Mention Restitution de Caution : « Caution restituée après contrôle du matériel ».
      </div>
      ` : ''}
      <p>
        Organisme sans but lucratif agissant dans le cadre de ses statuts d'association sportive et de loisir régie par la Loi 1901. Les sommes versées constituent des cotisations d'adhésion, participations aux frais d'organisation d'opérations (OP) ou cessions d'équipements aux membres.
      </p>

      ${legalNoteDecree}
    </div>

    <div class="footer-stamp">
      <div>F.O.S.T. Airsoft (Loi 1901) – Système Automatisé de Trésorerie</div>
      <div>Transaction certifiée HelloAsso – Ordre #${receipt.orderId}</div>
    </div>
  </div>
</body>
</html>`;
}
