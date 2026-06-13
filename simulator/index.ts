import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { randomUUID } from 'crypto';

// Inlined types from 'shared' to avoid workspace dependency issues on Render
type EventStatus = 'SENT' | 'DELIVERED' | 'FAILED' | 'OPENED' | 'READ' | 'CLICKED' | 'PURCHASED';

interface CommunicationEvent {
  recipient: string;
  message: string;
  channel: string;
  missionId: string;
  customerId: string;
}

interface ReceiptPayload {
  idempotencyKey: string;
  missionId: string;
  customerId: string;
  channel: string;
  status: EventStatus;
  timestamp: string;
}

const app = express();
app.use(cors());
app.use(express.json());

const CRM_WEBHOOK_URL = process.env.CRM_WEBHOOK_URL || 'http://localhost:3000/api/receipt';
const SIMULATOR_PORT = process.env.PORT || process.env.SIMULATOR_PORT || 4000;

// Health check so Render knows the service is alive
app.get('/', (_req, res) => res.json({ status: 'ok', service: 'Catalyst Simulator' }));
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Helper to simulate delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function sendWebhook(payload: ReceiptPayload, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      await axios.post(CRM_WEBHOOK_URL, payload, { timeout: 10000 });
      console.log(`[Webhook OK] ${payload.status} → Mission ${payload.missionId}, Customer ${payload.customerId}`);
      return;
    } catch (err: any) {
      console.error(`[Webhook Fail] Attempt ${i + 1}/${retries} for ${payload.status}:`, err.message);
      await delay(1000 * (i + 1));
    }
  }
}

app.post('/send', async (req, res) => {
  const { recipient, message, channel, missionId, customerId } = req.body as CommunicationEvent;
  
  if (!recipient || !message || !channel || !missionId || !customerId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Acknowledge receipt immediately
  res.status(202).json({ success: true, message: 'Message queued for simulation' });

  // Start simulation pipeline asynchronously
  simulateLifecycle(missionId, customerId, channel);
});

async function simulateLifecycle(missionId: string, customerId: string, channel: string) {
  // 1. SENT (Immediate)
  await sendWebhook({
    idempotencyKey: randomUUID(),
    missionId,
    customerId,
    channel,
    status: 'SENT',
    timestamp: new Date().toISOString()
  });

  await delay(1000 + Math.random() * 2000);

  // 2. DELIVERED / FAILED (95% success rate)
  const isFailure = Math.random() < 0.05;
  if (isFailure) {
    await sendWebhook({
      idempotencyKey: randomUUID(),
      missionId,
      customerId,
      channel,
      status: 'FAILED',
      timestamp: new Date().toISOString()
    });
    return;
  }

  await sendWebhook({
    idempotencyKey: randomUUID(),
    missionId,
    customerId,
    channel,
    status: 'DELIVERED',
    timestamp: new Date().toISOString()
  });

  await delay(2000 + Math.random() * 5000);

  // 3. OPENED / READ (60% open rate)
  const isOpened = Math.random() < 0.60;
  if (!isOpened) return;

  await sendWebhook({
    idempotencyKey: randomUUID(),
    missionId,
    customerId,
    channel,
    status: channel === 'email' ? 'OPENED' : 'READ',
    timestamp: new Date().toISOString()
  });

  await delay(1000 + Math.random() * 3000);

  // 4. CLICKED (30% click rate of opened)
  const isClicked = Math.random() < 0.30;
  if (!isClicked) return;

  await sendWebhook({
    idempotencyKey: randomUUID(),
    missionId,
    customerId,
    channel,
    status: 'CLICKED',
    timestamp: new Date().toISOString()
  });

  await delay(3000 + Math.random() * 7000);

  // 5. PURCHASED (20% conversion rate of clicked)
  const isPurchased = Math.random() < 0.20;
  if (!isPurchased) return;

  await sendWebhook({
    idempotencyKey: randomUUID(),
    missionId,
    customerId,
    channel,
    status: 'PURCHASED',
    timestamp: new Date().toISOString()
  });
}

app.listen(SIMULATOR_PORT as number, '0.0.0.0', () => {
  console.log(`Messaging Simulator running on port ${SIMULATOR_PORT}`);
  console.log(`Targeting CRM Webhook: ${CRM_WEBHOOK_URL}`);
});
