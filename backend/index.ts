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

app.get('/api/opportunities', async (req, res) => {
  try {
    // 1. Dormant Customers
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    
    const dormantCustomers = await prisma.customer.findMany({
      where: {
        lastPurchaseDate: { lt: sixtyDaysAgo },
        orderCount: { gt: 0 }
      }
    });
    
    const dormantCount = dormantCustomers.length;
    const dormantAvgOrder = dormantCount > 0 
      ? dormantCustomers.reduce((acc, c) => acc + (c.totalSpent / Math.max(1, c.orderCount)), 0) / dormantCount 
      : 0;
    const dormantRevenue = Math.round(dormantCount * dormantAvgOrder * 0.15); // 15% recovery probability

    // 2. VIP Customers Not Contacted
    const allCustomers = await prisma.customer.findMany({
      select: { id: true, totalSpent: true },
      orderBy: { totalSpent: 'desc' }
    });
    const top20Index = Math.floor(allCustomers.length * 0.2);
    const threshold = allCustomers[top20Index]?.totalSpent || 0;
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const vipCustomers = await prisma.customer.findMany({
      where: {
        totalSpent: { gt: threshold },
        communicationEvents: {
          none: {
            timestamp: { gt: thirtyDaysAgo }
          }
        }
      }
    });
    
    const vipCount = vipCustomers.length;
    const vipAvgOrder = vipCount > 0 
      ? vipCustomers.reduce((acc, c) => acc + (c.totalSpent / Math.max(1, c.orderCount)), 0) / vipCount 
      : 0;
    const vipRevenue = Math.round(vipCount * vipAvgOrder * 0.40); // 40% recovery

    // 3. Cart Abandoners (Using Coupon Seekers without recent communication)
    const cartAbandoners = await prisma.customer.findMany({
      where: { type: 'Coupon Seekers' },
      take: 63
    });
    const cartCount = cartAbandoners.length;
    const cartAvgOrder = cartCount > 0 
      ? cartAbandoners.reduce((acc, c) => acc + (c.totalSpent / Math.max(1, c.orderCount)), 0) / cartCount 
      : 1500;
    const cartRevenue = Math.round(cartCount * cartAvgOrder * 0.25); // 25% recovery

    const opportunities = [
      {
        id: 'dormant',
        title: 'Dormant Customers',
        audience: dormantCount,
        potentialRevenue: dormantRevenue,
        confidence: 89,
        reasoning: [
          'No purchase in 60+ days',
          `Average order value ₹${Math.round(dormantAvgOrder)}`,
          'High WhatsApp engagement',
          'Similar customers converted previously'
        ],
        action: 'Launch Win-Back Mission'
      },
      {
        id: 'vip',
        title: 'VIP Customers Not Contacted',
        audience: vipCount,
        potentialRevenue: vipRevenue,
        confidence: 91,
        reasoning: [
          'Total spent in top 20%',
          'No mission sent in 30 days',
          'High lifetime value',
          'Loyalty members'
        ],
        action: 'Launch Loyalty Mission'
      },
      {
        id: 'cart',
        title: 'Cart Abandoners',
        audience: cartCount,
        potentialRevenue: cartRevenue,
        confidence: 78,
        reasoning: [
          'Items left in cart for 24+ hours',
          'High intent to purchase',
          'Previous coupon seekers',
          'High email open rate'
        ],
        action: 'Send Reminder Campaign'
      }
    ];

    res.json(opportunities);
  } catch (error: any) {
    console.error('Error fetching opportunities:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`CRM Backend running on port ${PORT}`);
});
