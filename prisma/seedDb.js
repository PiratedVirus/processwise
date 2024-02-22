const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

const companies = [
  { companyName: "Flipkart", industryType: "E-commerce", employeeCount: 10000, contactPerson: "Rajesh Kumar", city: "Bangalore", streetAddress: "1 Flipkart Ave" },
  { companyName: "Ola", industryType: "Ride-sharing", employeeCount: 10000, contactPerson: "Sunita Patil", city: "Mumbai", streetAddress: "2 Ola Road" },
  { companyName: "Paytm", industryType: "Fintech", employeeCount: 5000, contactPerson: "Ankit Sharma", city: "Noida", streetAddress: "3 Paytm Blvd" },
  { companyName: "Reliance Industries", industryType: "Conglomerate", employeeCount: 195000, contactPerson: "Amit Singh", city: "Mumbai", streetAddress: "4 Reliance St" },
  { companyName: "Tata Consultancy Services", industryType: "IT Services", employeeCount: 469261, contactPerson: "Priya Desai", city: "Chennai", streetAddress: "5 TCS Lane" },
  { companyName: "Infosys", industryType: "IT Services", employeeCount: 249000, contactPerson: "Vikram Reddy", city: "Hyderabad", streetAddress: "6 Infosys Path" }
];

const userNames = [
  "Aarav", "Vivaan", "Aditi", "Diya", "Ishaan", "Kabir", "Saanvi", "Meera", "Rohan", "Arjun",
  "Anjali", "Ritika", "Sohail", "Amit", "Sarika", "Gautam", "Neha", "Suresh", "Pooja", "Raj"
];

async function main() {
  for (const [companyIndex, { companyName, industryType, employeeCount, contactPerson, city, streetAddress }] of companies.entries()) {
    const clientId = uuidv4();
    const emailDomain = `${companyName.toLowerCase().replace(/\s+/g, '')}.com`;
    const mailboxes = ["sales", "orders", "support", "finance", "hr"].map(dept => `${dept}@${emailDomain}`);
    const configuredMailboxes = JSON.stringify(mailboxes);

    await prisma.clientDetail.create({
      data: {
        clientId,
        companyName,
        contactPerson,
        contactPersonEmail: `contact@${emailDomain}`,
        industryType,
        employeeCount,
        streetAddress,
        city,
        pinCode: 560001,
        currentDMSName: "DefaultDMS",
        typeOfDocument: "General",
        currentDocumentFlow: "Standard",
        inputSourceOfDocument: "Email",
        numberOfUsersRequired: 10,
        endStorageSystem: "Cloud",
        totalDocumentsPerDay: 100,
        configuredMailboxes,
      },
    });

    const userPositions = ["Admin", "Approver", "Approver", "End User", "End User", "End User", "End User", "End User"];
    userPositions.forEach(async (position, index) => {
      const nameIndex = (companyIndex * userPositions.length + index) % userNames.length;
      const userName = userNames[nameIndex];
      const userEmail = `${userName.toLowerCase()}@${emailDomain}`;
      const userRole = Math.floor(Math.random() * 16).toString(2).padStart(4, '0');
      const mailboxAccessIndex = Math.floor(Math.random() * mailboxes.length);
      const userMailboxesAccess = JSON.stringify([mailboxes[mailboxAccessIndex]]);

      await prisma.userDetails.create({
        data: {
          userId: uuidv4(),
          clientId,
          userName,
          userEmail,
          userCompany: companyName,
          userStatus: "verified",
          userPosition: position,
          userVerified: true,
          userMailboxesAccess,
          userRole,
        },
      });
    });
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
