import React from 'react';
import { ReceiptDataContract, ITEM_CATALOG } from '../utils/receiptGenerator';

interface ReceiptTemplateProps {
  receipt: ReceiptDataContract;
  onClose?: () => void;
}

export const ReceiptTemplate: React.FC<ReceiptTemplateProps> = ({ receipt, onClose }) => {
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="receipt-view max-w-3xl mx-auto bg-white text-zinc-900 border border-zinc-300 shadow-2xl rounded-sm p-6 sm:p-10 font-sans print:shadow-none print:border-none print:p-0 print:m-0">
      {/* Top Action Bar (hidden in print) */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-zinc-200 print:hidden">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-600 font-semibold">
            Reçu Officiel Acquitté // HelloAsso v5
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Imprimer / PDF
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-2 border border-zinc-300 hover:bg-zinc-100 text-zinc-700 text-xs font-semibold rounded cursor-pointer transition-colors"
            >
              Fermer
            </button>
          )}
        </div>
      </div>

      {/* Official Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-6 border-b-2 border-zinc-900">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-zinc-950 font-['Space_Grotesk']">
            F.O.S.T. Airsoft (Loi 1901)
          </h1>
          <p className="text-xs font-bold text-zinc-600 uppercase tracking-wide mt-1">
            Association Loi 1901 – Forces Opérationnelles Spéciales Tactiques
          </p>
          <p className="text-xs text-zinc-500 mt-1">
            Siège : Rombas (57120) – France | E-mail : fost.contact.off@gmail.com
          </p>
          <p className="text-[11px] text-zinc-400">
            Agrément préfectoral & Encadrement F.F.A.
          </p>
        </div>

        <div className="sm:text-right">
          <span className="inline-block bg-zinc-100 text-zinc-800 border border-zinc-300 text-xs font-bold px-3 py-1 rounded uppercase tracking-wider mb-2">
            Facture Acquittée / Reçu
          </span>
          <div className="text-xs font-mono font-bold text-blue-600">
            Réf : {receipt.orderId}
          </div>
          <div className="text-xs text-zinc-500 mt-0.5">
            Émis le : {formattedDate}
          </div>
        </div>
      </div>

      {/* Meta Parties */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 p-4 bg-zinc-50 rounded border border-zinc-200 text-xs">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
            Association Émettrice
          </div>
          <div className="font-bold text-zinc-900">F.O.S.T. Airsoft (Loi 1901)</div>
          <div className="text-zinc-600">Association à but non lucratif (Loi 1901)</div>
          <div className="text-zinc-600 font-mono mt-1">fost.contact.off@gmail.com</div>
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
            Payeur / Adhérent
          </div>
          <div className="font-bold text-zinc-900">{receipt.payerName || 'Opérateur FOST'}</div>
          <div className="text-zinc-600 font-mono">{receipt.payerEmail || 'Non communiqué'}</div>
          <div className="text-emerald-700 font-medium mt-1">Statut : Règlement perçu (HelloAsso v5)</div>
        </div>
      </div>

      {/* Itemized Table */}
      <div className="overflow-x-auto my-6">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-zinc-950 text-white uppercase text-[11px] tracking-wider">
              <th className="py-2.5 px-3 font-semibold">Description</th>
              <th className="py-2.5 px-3 text-right font-semibold">Prix Unitaire</th>
              <th className="py-2.5 px-3 text-right font-semibold">Qté</th>
              <th className="py-2.5 px-3 text-right font-semibold">Total Net</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            <tr>
              <td className="py-4 px-3 align-top">
                <div className="font-bold text-zinc-950">{itemDesignation}</div>
                <div className="text-zinc-500 text-[11px] mt-1 leading-relaxed">
                  {item.description}
                </div>
              </td>
              <td className="py-4 px-3 text-right font-mono align-top">
                {item.unitPrice.toFixed(2)} €
              </td>
              <td className="py-4 px-3 text-right font-mono align-top">1</td>
              <td className="py-4 px-3 text-right font-mono font-bold text-zinc-950 align-top">
                {receipt.amount.toFixed(2)} €
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Totals Section */}
      <div className="flex justify-end my-6">
        <div className="w-full sm:w-72 text-xs space-y-1.5 border-t-2 border-zinc-900 pt-3">
          <div className="flex justify-between text-zinc-600">
            <span>Total Brut H.T. :</span>
            <span className="font-mono">{receipt.amount.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-zinc-600">
            <span>TVA (0%) :</span>
            <span className="font-mono">0,00 €</span>
          </div>
          <div className="flex justify-between text-base font-bold text-zinc-950 pt-2 border-t border-zinc-200">
            <span>Net Réglé :</span>
            <span className="font-mono text-emerald-700">{receipt.amount.toFixed(2)} €</span>
          </div>
        </div>
      </div>

      {/* Legal Disclaimers */}
      <div className="pt-6 border-t border-zinc-200 text-[11px] text-zinc-600 space-y-3 leading-relaxed">
        <div className="font-semibold text-zinc-900">
          Régime fiscal : « TVA non applicable, art. 261-7-1° a du CGI. »
        </div>

        {hasDepositRefundMention && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-3 rounded text-[11px] font-semibold flex items-center gap-2">
            <span className="text-base">🛡️</span>
            <div>
              <span className="uppercase text-[10px] text-emerald-800 font-bold block">Engagement Matériel F.O.S.T. :</span>
              <span>« Caution restituée après contrôle du matériel ».</span>
            </div>
          </div>
        )}

        <p className="text-[10px] text-zinc-500">
          Organisme à but non lucratif. Les règlements correspondent à des cotisations d'adhésion, participations aux frais d'organisation d'opérations d'airsoft, locations de matériel ou acquisition d'équipements sportifs par les membres dans le cadre associatif.
        </p>

        {/* Decree 99-240 condition if replica */}
        {item.requiresAirsoftDecree && (
          <div className="bg-red-50 border border-red-300 text-red-900 p-3 rounded text-[11px]">
            <div className="font-bold flex items-center gap-1 text-red-800 uppercase tracking-wide">
              <span>⚠️</span> Mention Légale Obligatoire Airsoft (Décret n° 99-240) :
            </div>
            <p className="mt-1 font-medium">
              « Vente interdite aux mineurs - Décret n° 99-240 du 24 mars 1999. »
            </p>
            <p className="text-[10px] text-red-700 mt-1">
              La commercialisation, mise à disposition ou cession de répliques d'armes développant une énergie en sortie de bouche comprise entre 0,08 Joule et 2 Joules est strictement interdite aux mineurs de moins de 18 ans révolus.
            </p>
          </div>
        )}
      </div>

      {/* Footer Stamp */}
      <div className="mt-8 pt-4 border-t border-dashed border-zinc-300 flex justify-between items-center text-[10px] text-zinc-400 font-mono">
        <div>F.O.S.T. Airsoft (Loi 1901) // TRÉSORERIE OFFICIELLE</div>
        <div>TRANSACTION PAYÉE • AUTHENTIFICATION HELLOASSO</div>
      </div>
    </div>
  );
};
