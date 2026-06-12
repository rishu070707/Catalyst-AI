import { spawn } from 'child_process';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import path from 'path';

// Need to use the PrismaClient from the backend
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./dev.db'
    }
  }
});

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  console.log('Starting backend server...');
  const backend = spawn('npx', ['ts-node', 'index.ts'], { 
    cwd: path.join(__dirname, 'backend'),
    shell: true
  });
  
  console.log('Starting simulator server...');
  const simulator = spawn('npx', ['ts-node', 'index.ts'], {
    cwd: path.join(__dirname, 'simulator'),
    shell: true
  });

  backend.stdout.on('data', data => console.log(`[Backend] ${data.toString().trim()}`));
  simulator.stdout.on('data', data => console.log(`[Simulator] ${data.toString().trim()}`));
  
  // Wait for servers to start
  await delay(5000);

  try {
    console.log('\n--- Setting up Test Data ---');
    // Get a random customer
    const customer = await prisma.customer.findFirst({
      where: { orderCount: { gt: 0 } }
    });
    
    if (!customer) throw new Error("No customer found in DB.");

    // Create a dummy mission
    const mission = await prisma.mission.create({
      data: {
        name: 'Test Mission',
        status: 'RUNNING',
        expectedRevenue: 5000,
        channel: 'WhatsApp'
      }
    });

    console.log(`Created Mission: ${mission.id}`);
    console.log(`Using Customer: ${customer.id}`);

    console.log('\n--- Triggering Simulator ---');
    const response = await axios.post('http://localhost:4000/send', {
      recipient: customer.phone,
      message: 'Hello, this is a test message!',
      channel: 'WhatsApp',
      missionId: mission.id,
      customerId: customer.id
    });
    
    console.log('Simulator Response:', response.data);

    console.log('\n--- Waiting 20 seconds for lifecycle simulation to finish ---');
    await delay(20000);

    console.log('\n--- Verification ---');
    const events = await prisma.communicationEvent.findMany({
      where: { missionId: mission.id }
    });
    
    console.log(`Found ${events.length} CommunicationEvents in DB for this mission:`);
    events.forEach((e: any) => console.log(` - [${e.status}] at ${e.timestamp}`));

    const updatedMission = await prisma.mission.findUnique({ where: { id: mission.id } });
    console.log(`Mission Actual Revenue: ${updatedMission?.actualRevenue}`);

    const updatedCustomer = await prisma.customer.findUnique({ where: { id: customer.id } });
    console.log(`Customer Engagement Score: ${updatedCustomer?.engagementScore}`);

    if (events.length > 0) {
      console.log('\n✅ Integration test PASSED! Simulator and Webhook are communicating correctly.');
    } else {
      console.log('\n❌ Integration test FAILED! No events recorded.');
    }

  } catch (error: any) {
    console.error('Test Error:', error.message);
  } finally {
    console.log('\nCleaning up servers...');
    backend.kill();
    simulator.kill();
    await prisma.$disconnect();
    process.exit(0);
  }
}

main();
