// Import Prisma Client
const { PrismaClient } = require('@prisma/client');

// Create an instance of Prisma Client
const prisma = new PrismaClient();

async function deleteAllEntries() {
  await prisma.clientDetail.deleteMany({});
  console.log('All rows deleted.');
}

// Call the function and handle any errors
deleteAllEntries()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Disconnect Prisma Client after finishing
    await prisma.$disconnect();
  });
