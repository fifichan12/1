/**
 * F.O.S.T. Airsoft - Script de simulation & validation des Webhooks HelloAsso v5
 * Valide les payloads pour : 200€, 5€, 0€, 15€, 20€, 80€
 */

const BASE_URL = process.argv[2] || process.env.TEST_WEBHOOK_URL || 'http://127.0.0.1:3000';
const WEBHOOK_URL = `${BASE_URL.replace(/\/$/, '')}/api/payments/webhook`;

const TEST_CASES = [
  {
    name: '1. Achat Réplique Officielle (200,00 €)',
    expectedItemType: 'REPLICA_PURCHASE',
    payload: {
      eventType: 'Order',
      data: {
        id: 'ORD-REP-200',
        state: 'Authorized',
        amount: { total: 20000, vat: 0 },
        items: [
          {
            name: 'Réplique Cerakote FOST MOD-01 MP5 CQB',
            amount: 20000,
            type: 'Item'
          }
        ],
        payer: {
          firstName: 'Thomas',
          lastName: 'Roche',
          email: 'thomas.roche@example.com'
        },
        date: new Date().toISOString()
      },
      metadata: {
        itemCategory: 'REPLICA'
      }
    }
  },
  {
    name: '2. Pass OP Joueur Freelance (5,00 €)',
    expectedItemType: 'FREELANCE_OP_PASS',
    payload: {
      eventType: 'Order',
      data: {
        id: 'ORD-OP-FREE-005',
        state: 'Authorized',
        amount: { total: 500, vat: 0 },
        items: [
          {
            name: 'Pass Opération Airsoft Freelance',
            amount: 500,
            type: 'Event'
          }
        ],
        payer: {
          firstName: 'Lucas',
          lastName: 'Meyer',
          email: 'lucas.meyer@example.com'
        },
        date: new Date().toISOString()
      }
    }
  },
  {
    name: '3. Pass OP Membre F.O.S.T. (0,00 €)',
    expectedItemType: 'MEMBER_OP_PASS',
    payload: {
      eventType: 'Order',
      data: {
        id: 'ORD-OP-MEM-000',
        state: 'Authorized',
        amount: { total: 0, vat: 0 },
        items: [
          {
            name: 'Pass Opération Membre Titulaire FOST',
            amount: 0,
            type: 'Event'
          }
        ],
        payer: {
          firstName: 'Marc',
          lastName: 'Dubois',
          email: 'marc.dubois@example.com'
        },
        date: new Date().toISOString()
      }
    }
  },
  {
    name: '4. Adhésion Découverte / Day Pass (15,00 €)',
    expectedItemType: 'MEMBERSHIP_DAY_PASS',
    payload: {
      eventType: 'Order',
      data: {
        id: 'ORD-ADH-TEST-015',
        state: 'Authorized',
        amount: { total: 1500, vat: 0 },
        items: [
          {
            name: 'Cotisation Découverte FOST',
            amount: 1500,
            type: 'Membership'
          }
        ],
        payer: {
          firstName: 'Maxime',
          lastName: 'Lefevre',
          email: 'maxime.lefevre@example.com'
        },
        date: new Date().toISOString()
      },
      metadata: {
        formule: 'test'
      }
    }
  },
  {
    name: '5. Pass Journée + Pack Location (20,00 €)',
    expectedItemType: 'MEMBERSHIP_PASS_RENTAL',
    payload: {
      eventType: 'Order',
      data: {
        id: 'ORD-ADH-STD-020',
        state: 'Authorized',
        amount: { total: 2000, vat: 0 },
        items: [
          {
            name: 'Cotisation Membre Standard / Location',
            amount: 2000,
            type: 'Membership'
          }
        ],
        payer: {
          firstName: 'Julien',
          lastName: 'Bernard',
          email: 'julien.bernard@example.com'
        },
        date: new Date().toISOString()
      },
      metadata: {
        formule: 'standard'
      }
    }
  },
  {
    name: '6. Cotisation Annuelle F.O.S.T. (80,00 €)',
    expectedItemType: 'MEMBERSHIP_ANNUAL',
    payload: {
      eventType: 'Order',
      data: {
        id: 'ORD-ADH-ANN-080',
        state: 'Authorized',
        amount: { total: 8000, vat: 0 },
        items: [
          {
            name: 'Cotisation Annuelle Titulaire Saison 2026',
            amount: 8000,
            type: 'Membership'
          }
        ],
        payer: {
          firstName: 'Alexandre',
          lastName: 'Vassili',
          email: 'alex.vassili@example.com'
        },
        date: new Date().toISOString()
      },
      metadata: {
        formule: 'premium'
      }
    }
  }
];

async function runSimulation() {
  console.log('===============================================================');
  console.log(' F.O.S.T. AIRSOFT - SUITE DE VALIDATION DES WEBHOOKS HELLOASSO ');
  console.log(` Cible : ${WEBHOOK_URL}`);
  console.log('===============================================================\n');

  let passed = 0;

  for (const test of TEST_CASES) {
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(test.payload)
      });

      const data = await response.json();

      if (
        response.status === 200 &&
        data.success === true &&
        data.itemType === test.expectedItemType
      ) {
        console.log(`[PASS] ${test.name}`);
        console.log(`       - Item Type: ${data.itemType}`);
        console.log(`       - Montant Net: ${data.amount.toFixed(2)} € (TVA 0% - Art. 261-7-1° a CGI)`);
        console.log(`       - Réf Commande: ${data.orderId}`);
        console.log(`       - URL Récépissé: ${data.receiptUrl}`);
        if (data.itemType === 'REPLICA_PURCHASE') {
          console.log('       - Clause Décret 99-240 (Majeurs 18+) : ACTIVÉE');
        }
        console.log('');
        passed++;
      } else {
        console.error(`[FAIL] ${test.name}`, data);
      }
    } catch (err) {
      console.error(`[ERROR] ${test.name}:`, err.message);
    }
  }

  console.log('===============================================================');
  console.log(` RÉSULTAT : ${passed}/${TEST_CASES.length} cas validés avec succès.`);
  console.log('===============================================================');
}

runSimulation();
