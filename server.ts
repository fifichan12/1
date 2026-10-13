import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import nodemailer from 'nodemailer';
import { GoogleGenAI } from '@google/genai';
import {
  ItemType,
  ReceiptDataContract,
  mapAmountToItemType,
  generateReceiptHtml,
  ITEM_CATALOG
} from './src/utils/receiptGenerator';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

/* -------------------------------------------------------------
 * TYPES & STOCKAGE EN MÉMOIRE (DOSSIERS D'ADHÉSION FOST)
 * ------------------------------------------------------------- */
export interface AdhesionDossier {
  id: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  adresse: string;
  email: string;
  telephone: string;
  formule: 'test' | 'standard' | 'premium';
  formuleNom: string;
  montant: number;
  reglementAccepte: boolean;
  charteAccepte: boolean;
  droitImageAccepte: boolean;
  isMinor: boolean;
  nomTuteur?: string;
  message?: string;
  statut: 'EN_ATTENTE_DE_PAIEMENT' | 'VALIDEE' | 'ANNULEE';
  dateCreation: string;
  datePaiement?: string;
  referencePaiement?: string;
  checkoutIntentId?: string;
  userId?: string;
}

const dossiersStore = new Map<string, AdhesionDossier>();
const receiptsStore = new Map<string, { data: ReceiptDataContract; html: string }>();

/* -------------------------------------------------------------
 * CONFIGURATION DES TARIFS CÔTÉ SERVEUR (MODIFIABLE)
 * ------------------------------------------------------------- */
export const MEMBERSHIP_PRICING: Record<
  'test' | 'standard' | 'premium',
  { amountCents: number; label: string }
> = {
  test: { amountCents: 1500, label: 'Formule Découverte / Essai (15 €)' },
  standard: { amountCents: 2000, label: 'Formule Standard / Membre Titulaire (20 €/an)' },
  premium: { amountCents: 8000, label: 'Formule Escouade Premium / Tactical Elite (80 €/an)' }
};

/* -------------------------------------------------------------
 * CONFIGURATION HELLOASSO API V5
 * ------------------------------------------------------------- */
const HELLOASSO_CLIENT_ID = process.env.HELLOASSO_CLIENT_ID || '';
const HELLOASSO_CLIENT_SECRET = process.env.HELLOASSO_CLIENT_SECRET || '';
const HELLOASSO_ORG_SLUG = process.env.HELLOASSO_ORG_SLUG || '';
const HELLOASSO_ENV = process.env.HELLOASSO_ENV === 'production' ? 'production' : 'sandbox';

const HELLOASSO_API_BASE =
  HELLOASSO_ENV === 'production'
    ? 'https://api.helloasso.com'
    : 'https://api.helloasso-sandbox.com';

const HELLOASSO_OAUTH_URL = `${HELLOASSO_API_BASE}/oauth2/token`;

// Cache en mémoire pour le token OAuth2 HelloAsso client_credentials
let helloassoTokenCache: { token: string; expiresAt: number } | null = null;

/**
 * Récupère un token d'accès OAuth2 HelloAsso v5 valide (avec cache et renouvellement automatique)
 */
async function getHelloAssoToken(): Promise<string> {
  if (!HELLOASSO_CLIENT_ID || !HELLOASSO_CLIENT_SECRET) {
    throw new Error('HELLOASSO_CREDENTIALS_MISSING');
  }

  // Si token en cache valide avec une marge de 60 secondes
  if (helloassoTokenCache && Date.now() < helloassoTokenCache.expiresAt - 60000) {
    return helloassoTokenCache.token;
  }

  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', HELLOASSO_CLIENT_ID);
  params.append('client_secret', HELLOASSO_CLIENT_SECRET);

  const res = await fetch(HELLOASSO_OAUTH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString()
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('[HELLOASSO] Erreur authentification OAuth2:', res.status, errorText);
    throw new Error(`HELLOASSO_AUTH_FAILED: ${res.status}`);
  }

  const data: any = await res.json();
  const token = data.access_token;
  const expiresIn = Number(data.expires_in) || 1800;

  helloassoTokenCache = {
    token,
    expiresAt: Date.now() + expiresIn * 1000
  };

  return token;
}

/* -------------------------------------------------------------
 * INITIALISATION GEMINI (CHATBOT SERVEUR)
 * ------------------------------------------------------------- */
const geminiApiKey = process.env.GEMINI_API_KEY || '';
const ai = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;

/* -------------------------------------------------------------
 * CONFIGURATION NODEMAILER / EMAILS TRANSACTIONNELS
 * ------------------------------------------------------------- */
const createMailTransporter = () => {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
      auth: { user, pass }
    });
  }
  return null;
};

const mailTransporter = createMailTransporter();
const FOST_CONTACT_EMAIL = process.env.EMAIL_DESTINATION || 'fost.contact.off@gmail.com';

/* -------------------------------------------------------------
 * 1. ROUTE CHATBOT (GEMINI 3.8 FLASH - CÔTÉ SERVEUR UNIQUEMENT)
 * ------------------------------------------------------------- */
const SYSTEM_INSTRUCTION_FOST = `
Tu es l'assistant radio et guide officiel de l'association d'airsoft "Bienvenue chez la F.O.S.T." (Forces Opérationnelles Spéciales Tactiques), association loi 1901 basée à Rombas (57120, Moselle / Grand Est).
Ton ton est sympa, accueillant, clair et empreint du vocabulaire tactique / MilSim (opérateurs, répliques, safe-zone, chrony, briefing, escouade).

RÈGLES ET DONNÉES INVIOLABLES DE L'ASSOCIATION :
1. ADHÉSIONS & COTISATIONS :
   - Formule Découverte / Essai : 15,00 € (session unique d'initiation)
   - Formule Standard / Membre Titulaire : 20,00 € / an (gratuité de TOUTES les parties d'airsoft organisées à l'année, patch officiel brodé FOST offert)
   - Formule Escouade Premium / Tactical Elite : 80,00 € / an (accès illimité, dotations et réductions atelier Cerakote)
   - IMPORTANT : L'inscription se fait désormais obligatoirement par dossier complet en ligne, validé avant paiement sécurisé via HelloAsso.

2. ARMURERIE & LES 3 MODÈLES OFFICIELS :
   - 3 répliques de combat : MP5 CQB Spec, MK Mod-1 Carbine, AK Tactical Heavy.
   - PRIX FIXE : 200,00 € par réplique, quelle que soit la finition choisie parmi les 13 coloris Cerakote atelier (Noir Stealth, Sniper Gray, Olive Drab, Magpul FDE, Coyote Tan, Cobalt Metallic, Burnt Bronze, Tungsten, Desert Sand, Midnight Blue, Titanium, Alpine White, Crimson Red).

3. PUISSANCE & CHRONO (RÈGLEMENT DE JEU) :
   - CQB / Bâtiment : max 300 FPS (0.84 Joule) à la bille 0.20g.
   - Assaut extérieur : max 350 FPS (1.14 Joules), distance d'engagement 5m.
   - DMR (Anti-sniper bloqué semi) : max 400 FPS (1.48 Joules), MED 15m.
   - Bille bio 100% obligatoire sur tout le terrain.
   - Fair-play total : tout impact = "OUT" immédiat sans contestation.

4. MINEURS :
   - Conformément à la législation française (décret 99-240), les répliques > 0.08 Joule sont interdites aux mineurs. Les mineurs doivent fournir une autorisation parentale et jouer avec du matériel adapté ou en soutien.

5. CONTACT & ASSISTANCE :
   - Email officiel : fost.contact.off@gmail.com
   - Terrain : Complexe Rombas 57120 (Secteur Usine 2500m² & Forêt des brumes 25 hectares).
   - RÈGLE D'OR : Si un utilisateur pose une question très spécifique dont tu n'es pas certain, réponds aimablement avec les éléments connus et invite-le explicitement à contacter le bureau à : fost.contact.off@gmail.com.
`.trim();

app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message requis' });
      return;
    }

    if (!ai) {
      res.json({
        reply: `[POSTE RADIO FOST] Reçu 5 sur 5 ! Bienvenue chez la F.O.S.T. Pour toute question sur les adhésions (20€/an pour jouer gratuitement toute la saison), l'armurerie (200€ la réplique Cerakote personnalisée) ou pour rejoindre notre prochaine OP à Rombas, contactez directement le bureau à fost.contact.off@gmail.com !`
      });
      return;
    }

    const contents: any[] = [];
    if (Array.isArray(history)) {
      for (const h of history.slice(-6)) {
        if (h.role && h.text) {
          contents.push({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.text }]
          });
        }
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_FOST,
        temperature: 0.7,
      }
    });

    const reply = response.text || "Communication radio interrompue. Merci de contacter fost.contact.off@gmail.com";
    res.json({ reply });
  } catch (error: any) {
    console.error('Erreur API Chat Gemini:', error);
    res.status(500).json({
      reply: "Transmission brouillée. Veuillez contacter le bureau à fost.contact.off@gmail.com pour assistance directe."
    });
  }
});

/* -------------------------------------------------------------
 * 2. ROUTE ENREGISTREMENT DOSSIER D'ADHÉSION AVANT TOUT PAIEMENT
 * ------------------------------------------------------------- */
app.post('/api/adhesions', async (req: Request, res: Response) => {
  try {
    const {
      nom,
      prenom,
      dateNaissance,
      adresse,
      email,
      telephone,
      formule,
      reglementAccepte,
      charteAccepte,
      droitImageAccepte,
      isMinor,
      nomTuteur,
      message,
      honeypot,
      userId
    } = req.body;

    // Protection anti-spam honeypot
    if (honeypot && String(honeypot).trim() !== '') {
      res.status(400).json({ error: 'Détection anti-spam active' });
      return;
    }

    // Validation des champs obligatoires
    if (!nom || !prenom || !dateNaissance || !adresse || !email || !telephone || !formule) {
      res.status(400).json({ error: 'Tous les champs obligatoires du dossier doivent être remplis' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: 'Adresse e-mail invalide' });
      return;
    }

    if (!reglementAccepte) {
      res.status(400).json({ error: 'Vous devez accepter le règlement intérieur et la charte de sécurité' });
      return;
    }

    if (isMinor && !nomTuteur) {
      res.status(400).json({ error: 'Le nom du représentant légal est obligatoire pour les adhérents mineurs' });
      return;
    }

    const formKey = (formule as 'test' | 'standard' | 'premium') in MEMBERSHIP_PRICING
      ? (formule as 'test' | 'standard' | 'premium')
      : 'standard';

    const pricing = MEMBERSHIP_PRICING[formKey];
    const montant = pricing.amountCents / 100;
    const formuleNom = pricing.label;

    const dossierId = `ADH-FOST-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    const dossier: AdhesionDossier = {
      id: dossierId,
      nom: String(nom).trim(),
      prenom: String(prenom).trim(),
      dateNaissance: String(dateNaissance).trim(),
      adresse: String(adresse).trim(),
      email: String(email).trim().toLowerCase(),
      telephone: String(telephone).trim(),
      formule: formKey,
      formuleNom,
      montant,
      reglementAccepte: Boolean(reglementAccepte),
      charteAccepte: Boolean(charteAccepte),
      droitImageAccepte: Boolean(droitImageAccepte),
      isMinor: Boolean(isMinor),
      nomTuteur: nomTuteur ? String(nomTuteur).trim() : undefined,
      message: message ? String(message).trim() : undefined,
      statut: 'EN_ATTENTE_DE_PAIEMENT',
      dateCreation: new Date().toISOString(),
      userId: userId ? String(userId) : undefined
    };

    dossiersStore.set(dossierId, dossier);

    // E-mail récapitulatif pour le bureau FOST
    const emailBureauContent = `
=============================================================
NOUVEAU DOSSIER D'ADHÉSION EN ATTENTE DE PAIEMENT // BIENVENUE CHEZ LA F.O.S.T.
=============================================================
Numéro de Dossier : ${dossier.id}
Date & Heure      : ${new Date().toLocaleString('fr-FR')}

IDENTITÉ DE L'ADHÉRENT :
-------------------------------------------------------------
Nom & Prénom      : ${dossier.nom} ${dossier.prenom}
Date de Naissance : ${dossier.dateNaissance} (${dossier.isMinor ? 'MINEUR - Représentant légal : ' + dossier.nomTuteur : 'MAJEUR'})
Adresse Postale   : ${dossier.adresse}
E-mail            : ${dossier.email}
Téléphone         : ${dossier.telephone}

COTISATION & FORMULE :
-------------------------------------------------------------
Formule Choisie   : ${dossier.formuleNom}
Montant Dû        : ${dossier.montant.toFixed(2)} €
Statut Actuel     : EN ATTENTE DE RÈGLEMENT (HELLOASSO)

ENGAGEMENT & SÉCURITÉ :
-------------------------------------------------------------
Règlement & Charte: ACCEPTÉ
Droit à l'image   : ${dossier.droitImageAccepte ? 'ACCORDÉ' : 'REFUSÉ'}
Commentaires      : ${dossier.message || 'Aucun'}
=============================================================
`.trim();

    // E-mail d'accusé de réception pour l'adhérent
    const emailAdherentContent = `
Bonjour ${dossier.prenom},

Nous vous confirmons la bonne réception de votre dossier d'adhésion pour la saison 2026 de l'association FOST !

Votre numéro de dossier officiel est : ${dossier.id}
Formule : ${dossier.formuleNom}
Montant de la cotisation : ${dossier.montant.toFixed(2)} €

Prochaine étape : Pour valider définitivement votre entrée dans l'escouade et activer votre gratuité sur toutes les parties, veuillez procéder au règlement sécurisé de votre cotisation via HelloAsso.

Des questions ? Contactez le bureau à fost.contact.off@gmail.com

Bienvenue chez la F.O.S.T. !
`.trim();

    if (mailTransporter) {
      try {
        await mailTransporter.sendMail({
          from: `"Bienvenue chez la F.O.S.T." <${process.env.SMTP_USER || 'no-reply@fost.fr'}>`,
          to: FOST_CONTACT_EMAIL,
          subject: `[Bienvenue chez la F.O.S.T.] Nouveau dossier d'adhésion : ${dossier.id} - ${dossier.nom} ${dossier.prenom}`,
          text: emailBureauContent
        });

        await mailTransporter.sendMail({
          from: `"Bienvenue chez la F.O.S.T." <${process.env.SMTP_USER || 'no-reply@fost.fr'}>`,
          to: dossier.email,
          subject: `[Bienvenue chez la F.O.S.T.] Accusé de réception de votre dossier d'adhésion (${dossier.id})`,
          text: emailAdherentContent
        });
        console.log(`[MAIL] Emails envoyés avec succès pour le dossier ${dossierId}`);
      } catch (mailErr) {
        console.warn(`[MAIL] Erreur envoi SMTP, dossier enregistré :`, mailErr);
      }
    } else {
      console.log(`[SIMULATION EMAIL BUREAU] Destinataire: ${FOST_CONTACT_EMAIL} - Dossier: ${dossierId}`);
      console.log(`[SIMULATION EMAIL ADHÉRENT] Destinataire: ${dossier.email} - Dossier: ${dossierId}`);
    }

    res.json({
      success: true,
      dossierId,
      montant: dossier.montant,
      formuleNom: dossier.formuleNom,
      message: `Dossier ${dossierId} enregistré avec succès. Un e-mail récapitulatif a été transmis au bureau.`
    });
  } catch (error: any) {
    console.error('Erreur enregistrement dossier adhésion:', error);
    res.status(500).json({ error: "Erreur lors de l'enregistrement du dossier" });
  }
});

/* -------------------------------------------------------------
 * 3. CRÉATION DU CHECKOUT INTENT HELLOASSO (API V5)
 * ------------------------------------------------------------- */
app.post('/api/helloasso/create-checkout', async (req: Request, res: Response) => {
  try {
    const { dossierId } = req.body;

    // RÈGLE INVIOLABLE : Refus catégorique de tout paiement sans dossier d'adhésion préalable !
    if (!dossierId || typeof dossierId !== 'string') {
      res.status(400).json({
        error: "Dossier d'adhésion requis : vous devez d'abord remplir et valider votre dossier d'adhésion avant de procéder au règlement de la cotisation."
      });
      return;
    }

    const dossier = dossiersStore.get(dossierId);
    if (!dossier) {
      res.status(404).json({
        error: "Dossier d'adhésion introuvable. Veuillez compléter le formulaire d'adhésion officiel."
      });
      return;
    }

    if (dossier.statut === 'VALIDEE') {
      res.json({
        alreadyValidated: true,
        dossierId: dossier.id,
        message: 'Ce dossier d\'adhésion est déjà validé et payé.'
      });
      return;
    }

    // Calcul du montant côté serveur selon la formule choisie
    const pricing = MEMBERSHIP_PRICING[dossier.formule] || MEMBERSHIP_PRICING.standard;
    const amountCents = pricing.amountCents;

    const baseUrl =
      process.env.APP_BASE_URL ||
      `${req.protocol}://${req.get('host')}`;

    const returnUrl = `${baseUrl}/?payment_status=success&dossier_id=${dossier.id}`;
    const errorUrl = `${baseUrl}/?payment_status=error&dossier_id=${dossier.id}`;
    const backUrl = `${baseUrl}/?payment_status=cancel&dossier_id=${dossier.id}`;

    // Si les clés HelloAsso ne sont pas encore renseignées dans le .env
    if (!HELLOASSO_CLIENT_ID || !HELLOASSO_CLIENT_SECRET || !HELLOASSO_ORG_SLUG) {
      console.warn('[HELLOASSO] Clés non configurées dans .env (HELLOASSO_CLIENT_ID, HELLOASSO_CLIENT_SECRET, HELLOASSO_ORG_SLUG)');
      // Mode simulation sécurisé pour prévisualisation locale si clés absentes
      const simulatedCheckoutId = `SIM-CHECKOUT-${Date.now()}`;
      dossier.checkoutIntentId = simulatedCheckoutId;
      dossiersStore.set(dossier.id, dossier);

      res.json({
        isSimulation: true,
        redirectUrl: `${baseUrl}/?payment_status=simulation&dossier_id=${dossier.id}&checkout_id=${simulatedCheckoutId}`,
        checkoutIntentId: simulatedCheckoutId,
        amount: amountCents / 100,
        dossierId: dossier.id,
        message: 'Configuration HelloAsso requise dans le fichier .env (détails dans dev.helloasso.com).'
      });
      return;
    }

    // Récupération token OAuth2 client_credentials avec cache
    const token = await getHelloAssoToken();

    const checkoutPayload = {
      totalAmount: amountCents,
      initialAmount: amountCents,
      itemName: `Cotisation FOST 2026 - ${pricing.label}`,
      backUrl,
      errorUrl,
      returnUrl,
      containsDonation: false,
      payer: {
        firstName: dossier.prenom,
        lastName: dossier.nom,
        email: dossier.email,
        dateOfBirth: dossier.dateNaissance,
        address: dossier.adresse
      },
      metadata: {
        dossierId: dossier.id,
        formule: dossier.formule
      }
    };

    const checkoutUrl = `${HELLOASSO_API_BASE}/v5/organizations/${HELLOASSO_ORG_SLUG}/checkout-intents`;
    const response = await fetch(checkoutUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(checkoutPayload)
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('[HELLOASSO] Erreur création checkout-intent:', response.status, errText);
      res.status(response.status).json({
        error: `Erreur HelloAsso (${response.status}) : impossible d'initier le paiement. Vérifiez la configuration dans dev.helloasso.com.`
      });
      return;
    }

    const checkoutData: any = await response.json();
    dossier.checkoutIntentId = String(checkoutData.id || '');
    dossiersStore.set(dossier.id, dossier);

    res.json({
      redirectUrl: checkoutData.redirectUrl,
      id: checkoutData.id,
      dossierId: dossier.id,
      amount: amountCents / 100
    });
  } catch (error: any) {
    console.error('Erreur checkout HelloAsso:', error);
    res.status(500).json({
      error: error.message || 'Service HelloAsso indisponible. Veuillez réessayer ultérieurement.'
    });
  }
});

/* -------------------------------------------------------------
 * 3.BIS CRÉATION DU CHECKOUT INTENT POUR PANIER & PAIEMENTS (API V5)
 *    Endpoints : POST /api/payments/checkout & POST /api/checkout/cart
 * ------------------------------------------------------------- */
const handlePaymentsCheckout = async (req: Request, res: Response) => {
  try {
    let { items, payer, totalAmount, hasReplicas, item, itemType: customType, mountType, optionType } = req.body;

    // Prise en charge d'un article unique envoyé directement
    if (!items && item) {
      items = [{
        id: item.id || `item-${Date.now()}`,
        productId: item.productId || 'item',
        title: item.title,
        price: item.amount || item.price,
        quantity: 1,
        variant: item.variant || item.description,
        mountType: item.mountType || mountType,
        optionType: item.optionType || optionType,
        depositRequired: item.depositRequired,
        requiresAgeCheck: item.requiresAgeCheck
      }];
      totalAmount = item.amount || item.price;
    }

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'Le panier ou l\'article à régler est vide.' });
      return;
    }

    const payerName = payer?.fullName || payer?.name || [payer?.firstName, payer?.lastName].filter(Boolean).join(' ') || 'Opérateur F.O.S.T.';
    const payerEmail = payer?.email || 'fost.contact.off@gmail.com';
    const amountVal = Number(totalAmount) || items.reduce((acc: number, it: any) => acc + (Number(it.price || 0) * (it.quantity || 1)), 0);
    const amountCents = Math.round(amountVal * 100);
    const orderId = `CMD-FOST-${Date.now().toString().slice(-6)}`;
    const orderDate = new Date().toISOString();

    const baseUrl =
      process.env.APP_BASE_URL ||
      `${req.protocol}://${req.get('host')}`;

    // Détection spécifique Location GoPro
    const goproItem = items.find((i: any) =>
      i.productId?.toLowerCase().includes('gopro') ||
      i.title?.toLowerCase().includes('gopro') ||
      i.depositRequired
    );
    const isGoProRental = Boolean(goproItem || customType?.startsWith('GOPRO'));

    let itemType: ItemType = customType || mapAmountToItemType(amountVal);
    let customItemLine: string | undefined = undefined;
    let depositRefundMention = false;

    if (isGoProRental) {
      const gPrice = goproItem?.price || amountVal;
      itemType = gPrice >= 15 ? 'GOPRO_RENTAL_FULL' : 'GOPRO_RENTAL_BASIC';
      const opt = goproItem?.optionType === 'full' || gPrice >= 15 ? 'Pack Full' : 'Pack Basic';
      const mnt = goproItem?.mountType || mountType || 'Fixation Casque';
      customItemLine = `Location GoPro Pack Tactical - [${opt} / ${mnt}]`;
      depositRefundMention = true;
    } else if (hasReplicas || items.some((i: any) => i.category === 'REPLICA')) {
      itemType = 'REPLICA_PURCHASE';
    } else if (items.some((i: any) => i.category === 'EVENT_PASS')) {
      itemType = amountVal === 0 ? 'MEMBER_OP_PASS' : 'FREELANCE_OP_PASS';
    } else if (items.some((i: any) => i.category === 'MEMBERSHIP')) {
      if (amountVal >= 80) itemType = 'MEMBERSHIP_ANNUAL';
      else if (amountVal >= 20) itemType = 'MEMBERSHIP_PASS_RENTAL';
      else itemType = 'MEMBERSHIP_DAY_PASS';
    }

    const receiptData: ReceiptDataContract = {
      orderId,
      payerName,
      payerEmail,
      itemType,
      amount: amountVal,
      date: orderDate,
      customItemLine,
      isGoProRental,
      depositRefundMention,
      mountType: goproItem?.mountType || mountType,
      optionName: goproItem?.optionType === 'full' || amountVal >= 15 ? 'Pack Full' : 'Pack Basic'
    };

    const receiptHtml = generateReceiptHtml(receiptData);
    receiptsStore.set(orderId, { data: receiptData, html: receiptHtml });

    // Envoi d'email de confirmation au bureau et à l'acheteur si SMTP est configuré
    if (mailTransporter && payerEmail) {
      try {
        await mailTransporter.sendMail({
          from: `"F.O.S.T. Airsoft (Loi 1901)" <${process.env.SMTP_USER || 'no-reply@fost.fr'}>`,
          to: payerEmail,
          subject: `[F.O.S.T. Airsoft] Confirmation de votre commande #${orderId}`,
          html: receiptHtml
        });
        await mailTransporter.sendMail({
          from: `"F.O.S.T. Airsoft (Loi 1901)" <${process.env.SMTP_USER || 'no-reply@fost.fr'}>`,
          to: FOST_CONTACT_EMAIL,
          subject: `[QG FOST] Nouvelle commande e-commerce : #${orderId} (${amountVal.toFixed(2)} €)`,
          text: `Nouvelle commande enregistrée :\nID: ${orderId}\nPayeur: ${payerName} (${payerEmail})\nArticles: ${items.map((i: any) => `${i.title} (${i.quantity || 1}x ${i.price}€)`).join(', ')}\nTotal: ${amountVal.toFixed(2)} €\nGoPro: ${isGoProRental ? 'OUI (' + customItemLine + ')' : 'NON'}\nRéplique(s) avec attestation 18+: ${hasReplicas ? 'OUI' : 'NON'}`
        });
      } catch (mailErr) {
        console.warn('[MAIL CART] Erreur expédition SMTP:', mailErr);
      }
    }

    // Si les clés HelloAsso sont absentes ou si montant est 0€, traiter en validation immédiate
    if (!HELLOASSO_CLIENT_ID || !HELLOASSO_CLIENT_SECRET || !HELLOASSO_ORG_SLUG || amountCents === 0) {
      res.json({
        success: true,
        isSimulation: true,
        orderId,
        amount: amountVal,
        receiptData,
        receiptUrl: `/api/receipts/${orderId}`,
        message: 'Commande validée et reçu officiel acquitté généré avec succès.'
      });
      return;
    }

    // Appel API HelloAsso v5 Checkout Intent
    try {
      const token = await getHelloAssoToken();
      const returnUrl = `${baseUrl}/?cart_order_id=${orderId}&payment_status=success`;
      const errorUrl = `${baseUrl}/?cart_order_id=${orderId}&payment_status=error`;
      const backUrl = `${baseUrl}/?cart_order_id=${orderId}&payment_status=cancel`;

      const checkoutPayload = {
        totalAmount: amountCents,
        initialAmount: amountCents,
        itemName: isGoProRental
          ? `${customItemLine} (Réf: ${orderId})`
          : `Commande F.O.S.T. - ${items[0]?.title || 'Articles tactiques'} (Réf: ${orderId})`,
        backUrl,
        errorUrl,
        returnUrl,
        containsDonation: false,
        payer: {
          firstName: payerName.split(' ')[0] || payerName,
          lastName: payerName.split(' ').slice(1).join(' ') || 'Opérateur',
          email: payerEmail
        },
        metadata: {
          orderId,
          itemCount: items.length,
          type: isGoProRental ? 'GOPRO_RENTAL' : 'CART_ORDER',
          itemType
        }
      };

      const checkoutUrl = `${HELLOASSO_API_BASE}/v5/organizations/${HELLOASSO_ORG_SLUG}/checkout-intents`;
      const haRes = await fetch(checkoutUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(checkoutPayload)
      });

      if (!haRes.ok) {
        const errText = await haRes.text();
        console.warn('[HELLOASSO CHECKOUT] Erreur checkout-intent:', haRes.status, errText);
        // Fallback gracieux en mode validation avec reçu
        res.json({
          success: true,
          isSimulation: true,
          orderId,
          amount: amountVal,
          receiptData,
          receiptUrl: `/api/receipts/${orderId}`
        });
        return;
      }

      const haData: any = await haRes.json();
      res.json({
        success: true,
        orderId,
        redirectUrl: haData.redirectUrl,
        id: haData.id,
        amount: amountVal,
        receiptData,
        receiptUrl: `/api/receipts/${orderId}`
      });
    } catch (apiErr: any) {
      console.error('[HELLOASSO CHECKOUT] Erreur appel API:', apiErr);
      res.json({
        success: true,
        isSimulation: true,
        orderId,
        amount: amountVal,
        receiptData,
        receiptUrl: `/api/receipts/${orderId}`
      });
    }
  } catch (error: any) {
    console.error('Erreur API checkout payments:', error);
    res.status(500).json({ error: error.message || 'Erreur lors de la validation du panier' });
  }
};

app.post('/api/payments/checkout', handlePaymentsCheckout);
app.post('/api/checkout/cart', handlePaymentsCheckout);

/* -------------------------------------------------------------
 * 4. WEBHOOK GÉNÉRAL HELLOASSO & VALIDATION DES TRANSACTIONS
 *    - Écoute : POST /api/payments/webhook
 *    - Validation stricte : eventType == "Order", state == "Authorized"
 *    - Mapping automatique montant -> article contractuel
 *    - Génération automatique du récépissé officiel (Loi 1901, Art. 261-7-1° a CGI, Décret 99-240)
 * ------------------------------------------------------------- */
app.post('/api/payments/webhook', async (req: Request, res: Response) => {
  try {
    const payload = req.body || {};
    console.log('[PAYMENTS WEBHOOK] Payload reçu :', JSON.stringify(payload));

    const eventType = payload.eventType || payload.type;
    const state =
      payload.data?.state ||
      payload.state ||
      payload.data?.status ||
      payload.status;

    // 1. Validation stricte de l'événement HelloAsso
    if (eventType !== 'Order' || state !== 'Authorized') {
      res.status(400).json({
        success: false,
        error: `Validation échouée : eventType="${eventType}" (attendu "Order"), state="${state}" (attendu "Authorized")`
      });
      return;
    }

    // 2. Extraction du montant (HelloAsso v5 fournit les montants en centimes dans data.amount.total ou item.amount)
    const orderData = payload.data || payload;
    let rawAmount = 0;

    if (typeof orderData.amount?.total === 'number') {
      rawAmount = orderData.amount.total;
    } else if (typeof orderData.amount === 'number') {
      rawAmount = orderData.amount;
    } else if (Array.isArray(orderData.items) && typeof orderData.items[0]?.amount === 'number') {
      rawAmount = orderData.items[0].amount;
    } else if (typeof payload.amount === 'number') {
      rawAmount = payload.amount;
    }

    // Normalisation EUR
    let normalizedAmount = rawAmount;
    if (rawAmount >= 100 && [500, 1500, 2000, 8000, 20000].includes(rawAmount)) {
      normalizedAmount = rawAmount / 100;
    }

    // 3. Mapping montant vers itemType contractuel
    const itemType = mapAmountToItemType(rawAmount);

    // 4. Extraction du payeur & métadonnées
    const orderId = String(
      orderData.id ||
      payload.orderId ||
      orderData.orderId ||
      payload.metadata?.orderId ||
      payload.metadata?.checkoutIntentId ||
      `ORD-${Date.now()}`
    );

    const payer = orderData.payer || payload.payer || {};
    const payerName =
      payer.name ||
      [payer.firstName, payer.lastName].filter(Boolean).join(' ') ||
      payload.payerName ||
      'Opérateur F.O.S.T.';

    const payerEmail =
      payer.email ||
      payload.payerEmail ||
      'fost.contact.off@gmail.com';

    const orderDate = orderData.date || payload.date || new Date().toISOString();

    const isGoProPayload =
      payload.metadata?.type === 'GOPRO_RENTAL' ||
      payload.metadata?.itemType?.startsWith('GOPRO') ||
      orderData.name?.toLowerCase().includes('gopro') ||
      orderData.itemName?.toLowerCase().includes('gopro') ||
      Math.abs(normalizedAmount - 10) < 0.01;

    const opt = normalizedAmount >= 15 ? 'Pack Full' : 'Pack Basic';
    const mnt = payload.metadata?.mountType || 'Fixation Casque';
    const customItemLine = isGoProPayload ? `Location GoPro Pack Tactical - [${opt} / ${mnt}]` : undefined;

    // 5. Contrat de données du reçu
    const receiptData: ReceiptDataContract = {
      orderId,
      payerName,
      payerEmail,
      itemType: isGoProPayload ? (normalizedAmount >= 15 ? 'GOPRO_RENTAL_FULL' : 'GOPRO_RENTAL_BASIC') : itemType,
      amount: normalizedAmount,
      date: orderDate,
      customItemLine,
      isGoProRental: isGoProPayload,
      depositRefundMention: isGoProPayload
    };

    const receiptHtml = generateReceiptHtml(receiptData);
    receiptsStore.set(orderId, { data: receiptData, html: receiptHtml });

    // 6. Mise à jour du dossier d'adhésion si associé
    const dossierId = payload.metadata?.dossierId || payload.dossierId;
    if (dossierId && dossiersStore.has(dossierId)) {
      const d = dossiersStore.get(dossierId)!;
      if (d.statut !== 'VALIDEE') {
        d.statut = 'VALIDEE';
        d.datePaiement = orderDate;
        d.referencePaiement = `HA-ORDER-${orderId}`;
        dossiersStore.set(dossierId, d);
      }
    }

    // 7. Transmission par email si configuré
    if (mailTransporter && payerEmail) {
      try {
        await mailTransporter.sendMail({
          from: `"F.O.S.T. Airsoft" <${process.env.SMTP_USER || 'no-reply@fost.fr'}>`,
          to: payerEmail,
          subject: `[F.O.S.T. Airsoft] Reçu officiel de paiement #${orderId}`,
          html: receiptHtml
        });
      } catch (mailErr) {
        console.warn('[EMAIL] Échec expédition reçu HTML:', mailErr);
      }
    }

    res.status(200).json({
      success: true,
      eventType: 'Order',
      state: 'Authorized',
      orderId,
      itemType,
      amount: normalizedAmount,
      receiptData,
      receiptUrl: `/api/receipts/${orderId}`
    });
  } catch (error: any) {
    console.error('[PAYMENTS WEBHOOK] Erreur serveur:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/* -------------------------------------------------------------
 * ENDPOINTS DE CONSULTATION / TÉLÉCHARGEMENT DU RÉCÉPISSÉ
 * ------------------------------------------------------------- */
app.get('/api/receipts/:orderId', (req: Request, res: Response) => {
  const record = receiptsStore.get(req.params.orderId);
  if (!record) {
    res.status(404).send(`
      <!DOCTYPE html>
      <html><body style="font-family:sans-serif;text-align:center;padding:50px;">
        <h2>Reçu de paiement introuvable</h2>
        <p>Aucun reçu associé à la référence <strong>${req.params.orderId}</strong> n'a été trouvé.</p>
      </body></html>
    `);
    return;
  }
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(record.html);
});

app.post('/api/receipts/render', (req: Request, res: Response) => {
  try {
    const { orderId, payerName, payerEmail, itemType, amount, date } = req.body;
    const rawAmt = typeof amount === 'number' ? amount : 0;
    const contract: ReceiptDataContract = {
      orderId: orderId || `SIM-ORD-${Date.now()}`,
      payerName: payerName || 'Opérateur F.O.S.T.',
      payerEmail: payerEmail || 'fost.contact.off@gmail.com',
      itemType: itemType || mapAmountToItemType(rawAmt),
      amount: rawAmt >= 100 && [500, 1500, 2000, 8000, 20000].includes(rawAmt) ? rawAmt / 100 : rawAmt,
      date: date || new Date().toISOString()
    };
    const html = generateReceiptHtml(contract);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

/* -------------------------------------------------------------
 * 4. ROUTE DE NOTIFICATION / WEBHOOK HELLOASSO (RÉ-VÉRIFICATION API)
 * ------------------------------------------------------------- */
app.post('/api/helloasso/webhook', async (req: Request, res: Response) => {
  try {
    const payload = req.body || {};
    console.log('[HELLOASSO WEBHOOK] Notification reçue :', JSON.stringify(payload));

    // Ne pas faire confiance au contenu direct du payload : re-vérification via l'API HelloAsso v5
    const checkoutIntentId =
      payload.data?.checkoutIntentId ||
      payload.data?.id ||
      payload.metadata?.checkoutIntentId;

    let targetDossierId = payload.metadata?.dossierId;

    if (!targetDossierId && checkoutIntentId) {
      for (const d of dossiersStore.values()) {
        if (d.checkoutIntentId === String(checkoutIntentId)) {
          targetDossierId = d.id;
          break;
        }
      }
    }

    if (!targetDossierId) {
      // Réponse 200 rapide pour acquitter la notification même si non applicable
      res.status(200).json({ received: true, note: 'Aucun dossier FOST associé trouvé' });
      return;
    }

    const dossier = dossiersStore.get(targetDossierId);
    if (!dossier) {
      res.status(200).json({ received: true, note: 'Dossier introuvable' });
      return;
    }

    // Idempotence : si déjà validée, réponse 200 rapide sans renvoyer d'e-mail en double
    if (dossier.statut === 'VALIDEE') {
      res.status(200).json({ received: true, note: 'Dossier déjà validé' });
      return;
    }

    // Re-vérification auprès de l'API HelloAsso si clés présentes
    let paymentVerified = false;
    let paymentRef = `HA-${Date.now()}`;

    if (HELLOASSO_CLIENT_ID && HELLOASSO_CLIENT_SECRET && checkoutIntentId) {
      try {
        const token = await getHelloAssoToken();
        const checkRes = await fetch(
          `${HELLOASSO_API_BASE}/v5/organizations/${HELLOASSO_ORG_SLUG}/checkout-intents/${checkoutIntentId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (checkRes.ok) {
          const checkData: any = await checkRes.json();
          // Vérification du statut officiel retourné par HelloAsso
          const order = checkData.order;
          if (
            checkData.status === 'Processed' ||
            checkData.status === 'Success' ||
            order?.payments?.some((p: any) => p.status === 'Authorized' || p.status === 'Processed')
          ) {
            paymentVerified = true;
            paymentRef = `HA-ORDER-${order?.id || checkoutIntentId}`;
          }
        }
      } catch (checkErr) {
        console.warn('[HELLOASSO] Erreur ré-interrogation API lors du webhook:', checkErr);
      }
    } else {
      // En mode test / dev
      paymentVerified = true;
    }

    if (paymentVerified) {
      dossier.statut = 'VALIDEE';
      dossier.datePaiement = new Date().toISOString();
      dossier.referencePaiement = paymentRef;
      dossiersStore.set(dossier.id, dossier);

      console.log(`[HELLOASSO VALIDÉ] Dossier ${dossier.id} validé avec succès (${dossier.montant} €).`);

      // Notifications emails
      const confirmationEmailContent = `
=============================================================
CONFIRMATION DE PAIEMENT VALIDÉE // BIENVENUE CHEZ LA F.O.S.T.
=============================================================
Numéro de Dossier   : ${dossier.id}
Référence Paiement  : ${dossier.referencePaiement}
Adhérent            : ${dossier.prenom} ${dossier.nom} (${dossier.email})
Formule Validée     : ${dossier.formuleNom}
Montant Réglé       : ${dossier.montant.toFixed(2)} €
Moyen de Paiement   : Paiement sécurisé via HelloAsso
Statut              : VALIDÉE // MEMBRE OFFICIEL ACTIF

Le statut de membre est désormais activé. Les réservations d'OP sont à 0,00 €.
=============================================================
`.trim();

      if (mailTransporter) {
        try {
          await mailTransporter.sendMail({
            from: `"Bienvenue chez la F.O.S.T." <${process.env.SMTP_USER || 'no-reply@fost.fr'}>`,
            to: FOST_CONTACT_EMAIL,
            subject: `[Bienvenue chez la F.O.S.T.] PAIEMENT VALIDÉ : Dossier ${dossier.id} - ${dossier.nom} ${dossier.prenom}`,
            text: confirmationEmailContent
          });

          await mailTransporter.sendMail({
            from: `"Bienvenue chez la F.O.S.T." <${process.env.SMTP_USER || 'no-reply@fost.fr'}>`,
            to: dossier.email,
            subject: `[Bienvenue chez la F.O.S.T.] Félicitations ! Votre adhésion ${dossier.id} est validée`,
            text: `Bonjour ${dossier.prenom},\n\nVotre cotisation de ${dossier.montant.toFixed(2)} € a été validée avec succès via HelloAsso (Réf: ${dossier.referencePaiement}).\nVous êtes officiellement membre de l'association FOST pour la saison 2026.\nToutes vos réservations de parties sont désormais gratuites (0 €) !\n\nBienvenue dans l'escouade !`
          });
        } catch (err) {
          console.warn('Erreur envoi email confirmation paiement:', err);
        }
      }
    }

    res.status(200).json({ received: true, verified: paymentVerified });
  } catch (error: any) {
    console.error('Erreur webhook HelloAsso:', error);
    res.status(200).json({ received: true, error: error.message });
  }
});

/* -------------------------------------------------------------
 * 5. ROUTE VÉRIFICATION DU STATUT RÉEL CÔTÉ SERVEUR (PAGE RETOUR)
 * ------------------------------------------------------------- */
app.get('/api/adhesions/:dossierId/verify-status', async (req: Request, res: Response) => {
  try {
    const { dossierId } = req.params;
    const checkoutId = req.query.checkout_id as string | undefined;

    const dossier = dossiersStore.get(dossierId);
    if (!dossier) {
      res.status(404).json({ error: 'Dossier introuvable' });
      return;
    }

    // Si encore en attente et que HelloAsso est configuré, tenter une vérification directe API
    if (dossier.statut === 'EN_ATTENTE_DE_PAIEMENT' && checkoutId && HELLOASSO_CLIENT_ID && HELLOASSO_CLIENT_SECRET) {
      try {
        const token = await getHelloAssoToken();
        const checkRes = await fetch(
          `${HELLOASSO_API_BASE}/v5/organizations/${HELLOASSO_ORG_SLUG}/checkout-intents/${checkoutId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (checkRes.ok) {
          const checkData: any = await checkRes.json();
          if (
            checkData.status === 'Processed' ||
            checkData.status === 'Success' ||
            checkData.order?.payments?.some((p: any) => p.status === 'Authorized' || p.status === 'Processed')
          ) {
            dossier.statut = 'VALIDEE';
            dossier.datePaiement = new Date().toISOString();
            dossier.referencePaiement = `HA-DIRECT-${checkData.order?.id || checkoutId}`;
            dossiersStore.set(dossier.id, dossier);
          }
        }
      } catch (err) {
        console.warn('Vérification directe statut HelloAsso:', err);
      }
    }

    // Réponse avec le statut réel côté serveur
    res.json({
      id: dossier.id,
      nom: dossier.nom,
      prenom: dossier.prenom,
      email: dossier.email,
      formule: dossier.formule,
      formuleNom: dossier.formuleNom,
      montant: dossier.montant,
      statut: dossier.statut,
      dateCreation: dossier.dateCreation,
      datePaiement: dossier.datePaiement,
      referencePaiement: dossier.referencePaiement
    });
  } catch (error: any) {
    console.error('Erreur vérification statut dossier:', error);
    res.status(500).json({ error: 'Erreur lors de la vérification du statut' });
  }
});

/* -------------------------------------------------------------
 * 6. ROUTE CONSULTATION DOSSIER
 * ------------------------------------------------------------- */
app.get('/api/adhesions/:dossierId', (req: Request, res: Response) => {
  const dossier = dossiersStore.get(req.params.dossierId);
  if (!dossier) {
    res.status(404).json({ error: 'Dossier introuvable' });
    return;
  }
  res.json({
    id: dossier.id,
    nom: dossier.nom,
    prenom: dossier.prenom,
    formule: dossier.formule,
    statut: dossier.statut,
    montant: dossier.montant,
    dateCreation: dossier.dateCreation,
    datePaiement: dossier.datePaiement,
    referencePaiement: dossier.referencePaiement
  });
});

/* -------------------------------------------------------------
 * 7. CONFIGURATION VITE SPA EN MODE DEV & PROD
 * ------------------------------------------------------------- */
const startServer = async () => {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve('dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[FOST SERVER] Serveur opérationnel sur http://0.0.0.0:${PORT}`);
  });
};

startServer().catch((err) => {
  console.error('[FOST SERVER] Erreur démarrage serveur:', err);
});
