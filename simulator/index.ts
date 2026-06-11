import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { randomUUID } from 'crypto';
import type { CommunicationEvent, EventStatus, ReceiptPayload } from 'shared';

const app = express();
app.use(cors());
app.use(express.json());

const CRM_WEBHOOK_URL = process.env.CRM_WEBHOOK_URL || 'http://localhost:3000/api/receipt';
const SIMULATOR_PORT = process.env.PORT || 4000;

// Helper to simulate delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function sendWebhook(payload: ReceiptPayload, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      await axios.post(CRM_WEBHOOK_URL, payload);
      console.log(`[Webhook Success] Sent status ${payload.status} for Mission ${payload.missionId}, Customer ${payload.customerId}`);
      return;
    } catch (err: any) {
      console.error(`[Webhook Failed] Attempt ${i + 1}/${retries} failed for status ${payload.status}:`, err.message);
      await delay(1000 * (i + 1)); // Exponential backoff
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

  // Small delay for processing
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
    return; // Pipeline ends if failed
  }

  await sendWebhook({
    idempotencyKey: randomUUID(),
    missionId,
    customerId,
    channel,
    status: 'DELIVERED',
    timestamp: new Date().toISOString()
  });

  // Delay for user to notice
  await delay(2000 + Math.random() * 5000);

  // 3. OPENED / READ (60% open rate)
  const isOpened = Math.random() < 0.60;
  if (!isOpened) return;

  await sendWebhook({
    idempotencyKey: randomUUID(),
    missionId,
    customerId,
    channel,
    status: channel === 'Email' ? 'OPENED' : 'READ',
    timestamp: new Date().toISOString()
  });

  // Delay for reading
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

  // Delay for browsing website
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

app.listen(SIMULATOR_PORT, () => {
  console.log(`Messaging Simulator running on port ${SIMULATOR_PORT}`);
  console.log(`Targeting CRM Webhook: ${CRM_WEBHOOK_URL}`);
});
