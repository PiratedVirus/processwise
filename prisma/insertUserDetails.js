const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid'); // npm install uuid

const prisma = new PrismaClient();

const members = [
    {
      "id": "1",
      "name": "Amit",
      "email": "amit@processwise.ai",
      "status": "In active",
      "role": "IT Admin"
    },
    {
      "id": "2",
      "name": "Neha",
      "email": "neha@processwise.ai",
      "status": "active",
      "role": "IT Admin"
    },
    {
      "id": "3",
      "name": "Priya",
      "email": "priya@processwise.ai",
      "status": "active",
      "role": "IT Admin"
    },
    {
      "id": "4",
      "name": "Rajesh",
      "email": "rajesh@processwise.ai",
      "status": "active",
      "role": "Approver"
    },
    {
      "id": "5",
      "name": "Sita",
      "email": "sita@processwise.ai",
      "status": "active",
      "role": "Approver"
    },
    {
      "id": "6",
      "name": "Arjun",
      "email": "arjun@processwise.ai",
      "status": "active",
      "role": "Approver"
    },
    {
      "id": "7",
      "name": "Kavita",
      "email": "kavita@processwise.ai",
      "status": "In active",
      "role": "End User"
    },
    {
      "id": "8",
      "name": "Amit",
      "email": "manish_amit@processwise.ai",
      "status": "active",
      "role": "End User"
    },
    {
      "id": "9",
      "name": "Pooja",
      "email": "pooja@processwise.ai",
      "status": "active",
      "role": "End User"
    },
    {
      "id": "10",
      "name": "Sunil",
      "email": "sunil@processwise.ai",
      "status": "active",
      "role": "End User"
    },
    {
      "id": "11",
      "name": "Hans",
      "email": "hans@processwise.ai",
      "status": "active",
      "role": "End User"
    },
    {
      "id": "12",
      "name": "Greta",
      "email": "greta@processwise.ai",
      "status": "active",
      "role": "End User"
    },
    {
      "id": "13",
      "name": "Klaus",
      "email": "klaus@processwise.ai",
      "status": "active",
      "role": "End User"
    },
    {
      "id": "14",
      "name": "Lena",
      "email": "lena@processwise.ai",
      "status": "active",
      "role": "End User"
    },
    {
      "id": "15",
      "name": "Friedrich",
      "email": "friedrich@processwise.ai",
      "status": "active",
      "role": "End User"
    },
    {
      "id": "16",
      "name": "Marta",
      "email": "marta@processwise.ai",
      "status": "active",
      "role": "End User"
    },
    {
      "id": "17",
      "name": "Heinrich",
      "email": "heinrich@processwise.ai",
      "status": "active",
      "role": "End User"
    },
    {
      "id": "18",
      "name": "Ingrid",
      "email": "ingrid@processwise.ai",
      "status": "active",
      "role": "End User"
    },
    {
      "id": "19",
      "name": "Wolfgang",
      "email": "wolfgang@processwise.ai",
      "status": "active",
      "role": "End User"
    },
    {
      "id": "20",
      "name": "Helga",
      "email": "helga@processwise.ai",
      "status": "active",
      "role": "End User"
    },
  ];

async function main() {
  const userDetailsData = members.map(member => ({
    userId: uuidv4(), // Generate a new UUID for each member
    clientId: "2308d03b-83cf-4be7-8fec-eba78492aa81",
    userName: member.name,
    userEmail: member.email,
    userStatus: member.status,
    userRole: member.role,
    userVerified: false
    // Add other fields as necessary
  }));

  await prisma.UserDetails.createMany({
    data: userDetailsData,
  });
}

main()
  .catch(e => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
