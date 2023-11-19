const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const uuidv4 = require('uuid').v4;

module.exports = async function (context, req) {
    try {
        const { clientName, clientEmail } = req.body;

        if (!clientName || !clientEmail) {
            context.res = {
                status: 400,
                body: "Please provide both client name and email."
            };
            return;
        }
        const newClientId = uuidv4(); 
        const newClient = await prisma.ClientDetail.create({
            data: {
                clientId: newClientId,
                clientName,
                clientEmail
            }
        });
        context.res = {
            status: 200,
            body: newClient
        };
    } catch (error) {
        context.res = {
            status: 500,
            body: "Error registering client: " + error.message
        };
    }
};
