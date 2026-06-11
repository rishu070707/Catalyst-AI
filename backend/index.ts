import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import type { ReceiptPayload } from 'shared';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Basic sanity check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/receipt', async (req, res) => {
  const payload = req.body as ReceiptPayload;
  
  if (!payload || !payload.idempotencyKey || !payload.missionId || !payload.customerId || !payload.status) {
    return res.status(400).json({ success: false, message: 'Missing required payload fields' });
  }

  try {
    // 1. Idempotency Check
    const existingEvent = await prisma.communicationEvent.findUnique({
      where: { idempotencyKey: payload.idempotencyKey }
    });

    if (existingEvent) {
      console.log(`[Webhook] Duplicate event ignored (Idempotency Key: ${payload.idempotencyKey})`);
      return res.status(200).json({ success: true, message: 'Event already processed' });
    }

    // 2. Store Communication Event (Audit Trail)
    await prisma.communicationEvent.create({
      data: {
        idempotencyKey: payload.idempotencyKey,
        missionId: payload.missionId,
        customerId: payload.customerId,
        channel: payload.channel || 'Unknown',
        status: payload.status,
        message: 'Webhook status update',
        timestamp: new Date(payload.timestamp || new Date()),
      }
    });

    console.log(`[Webhook] Recorded ${payload.status} for Mission ${payload.missionId}, Customer ${payload.customerId}`);

    // 3. Update Mission Metrics (Only if it's PURCHASED for Revenue, or simply increment counters)
    // For simplicity, we just look up if purchased and add actualRevenue from the customer's average order value or a constant
    if (payload.status === 'PURCHASED') {
      const customer = await prisma.customer.findUnique({ where: { id: payload.customerId } });
      const avgValue = customer && customer.orderCount > 0 ? customer.totalSpent / customer.orderCount : 1000;

      await prisma.mission.update({
        where: { id: payload.missionId },
        data: {
          actualRevenue: { increment: avgValue }
        }
      });
      console.log(`[Webhook] Mission ${payload.missionId} revenue incremented by ${avgValue.toFixed(2)}`);
    }

    // 4. Update Customer Engagement History
    if (['OPENED', 'READ', 'CLICKED', 'PURCHASED'].includes(payload.status)) {
      await prisma.customer.update({
        where: { id: payload.customerId },
        data: {
          engagementScore: { increment: 0.1 } // simple engagement bump
        }
      });
    }

    return res.status(200).json({ success: true, message: 'Event processed' });

  } catch (error: any) {
    console.error('[Webhook Error]', error.message);
    // Return 500 so Simulator will trigger its Retry Logic
    return res.status(500).json({ success: false, message: 'Internal server error processing event' });
  }
});

app.listen(PORT, () => {
  console.log(`CRM Backend running on port ${PORT}`);
});
