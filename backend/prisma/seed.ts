import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad'];
const CUSTOMER_TYPES = [
  'VIP',
  'Dormant',
  'Loyalty Members',
  'Coupon Seekers',
  'Regular Customers',
];
const CHANNELS = ['WhatsApp', 'SMS', 'Email'];
const ORDER_STATUSES = ['DELIVERED', 'SHIPPED', 'PROCESSING', 'CANCELLED'];

// Helper to generate a random number within a range
const randomRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper to get a random item from an array
const randomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Generate a random past date
const randomDate = (startDaysAgo: number, endDaysAgo: number) => {
  const date = new Date();
  const daysAgo = randomRange(endDaysAgo, startDaysAgo);
  date.setDate(date.getDate() - daysAgo);
  return date;
};

async function main() {
  console.log('Starting DB seed...');
  
  // Clear existing data (optional but good for clean runs)
  await prisma.communicationEvent.deleteMany();
  await prisma.mission.deleteMany();
  await prisma.order.deleteMany();
  await prisma.customer.deleteMany();

  const totalCustomers = 500;
  const totalOrdersTarget = 2000;
  
  const customers = [];

  for (let i = 0; i < totalCustomers; i++) {
    const type = randomItem(CUSTOMER_TYPES);
    
    // Adjust last purchase date based on type for realistic data
    let lastPurchaseStart = 0;
    let lastPurchaseEnd = 0;
    
    if (type === 'Dormant') {
      lastPurchaseStart = 120;
      lastPurchaseEnd = 61; // strictly > 60 days
    } else if (type === 'VIP') {
      lastPurchaseStart = 30;
      lastPurchaseEnd = 1;
    } else {
      lastPurchaseStart = 90;
      lastPurchaseEnd = 5;
    }
    
    const lastPurchaseDate = randomDate(lastPurchaseStart, lastPurchaseEnd);

    const FIRST_NAMES = ['Aarav', 'Vihaan', 'Aditya', 'Sai', 'Arjun', 'Siddharth', 'Rohan', 'Rishabh', 'Aanya', 'Diya', 'Kavya', 'Priya', 'Riya', 'Neha', 'Pooja', 'Anjali', 'Karan', 'Vikram', 'Raj', 'Rahul', 'Sneha', 'Shruti', 'Ananya', 'Kriti', 'Ishaan'];
    const LAST_NAMES = ['Sharma', 'Verma', 'Gupta', 'Patel', 'Singh', 'Kumar', 'Shah', 'Deshmukh', 'Joshi', 'Kapoor', 'Malhotra', 'Reddy', 'Rao', 'Iyer', 'Nair', 'Mehta', 'Chauhan', 'Agarwal'];

    const firstName = randomItem(FIRST_NAMES);
    const lastName = randomItem(LAST_NAMES);

    customers.push({
      id: `cust_${i}`,
      name: `${firstName} ${lastName}`,
      email: `customer${i}@example.com`,
      phone: `+9198${String(randomRange(10000000, 99999999))}`,
      city: randomItem(CITIES),
      type: type,
      lastPurchaseDate: lastPurchaseDate,
      preferredChannel: randomItem(CHANNELS),
      churnRisk: randomRange(1, 100) / 100, // 0.01 to 1.00
      engagementScore: randomRange(1, 100) / 100, // 0.01 to 1.00
      createdAt: randomDate(365, 120),
      updatedAt: new Date(),
    });
  }

  console.log(`Created ${customers.length} customer records in memory.`);

  // Create customers
  await prisma.customer.createMany({ data: customers });

  console.log('Inserted customers. Generating orders...');

  // Generate Orders
  const orders = [];
  
  // Distribute orders among customers
  for (let i = 0; i < totalOrdersTarget; i++) {
    const customer = randomItem(customers);
    
    // Create an order
    const amount = randomRange(800, 12000);
    const createdAt = randomDate(365, 1);
    
    orders.push({
      customerId: customer.id,
      amount: amount,
      status: randomRange(1, 10) > 1 ? 'DELIVERED' : randomItem(ORDER_STATUSES),
      createdAt: createdAt,
    });
  }

  // Insert Orders
  // SQLite limits the number of variables in a single query, so we do it in batches
  const BATCH_SIZE = 500;
  for (let i = 0; i < orders.length; i += BATCH_SIZE) {
    const batch = orders.slice(i, i + BATCH_SIZE);
    await prisma.order.createMany({ data: batch });
  }

  console.log(`Inserted ${orders.length} orders.`);

  // Now, update aggregated fields (totalSpent, orderCount) on Customers
  console.log('Aggregating customer totals...');
  
  const allCustomers = await prisma.customer.findMany({
    include: { orders: true }
  });
  
  for (const c of allCustomers) {
    if (c.orders.length > 0) {
      const totalSpent = c.orders.reduce((sum, order) => sum + order.amount, 0);
      
      // Update lastPurchaseDate to the most recent order date if it makes sense, 
      // or just keep what we had. We'll set it to the max order date for consistency.
      const maxDate = new Date(Math.max(...c.orders.map(o => o.createdAt.getTime())));
      
      await prisma.customer.update({
        where: { id: c.id },
        data: {
          totalSpent: totalSpent,
          orderCount: c.orders.length,
          lastPurchaseDate: maxDate
        }
      });
    }
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
