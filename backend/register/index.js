const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = async function (context, req) {
    try {
        const { modelName } = req.body;
        const { userData: data } = req.body;

        if (!modelName || !data) {
            context.res = {
                status: 400,
                body: "Please provide both modelName and data."
            };
            return;
        }

        if (!prisma[modelName]) {
            context.res = {
                status: 400,
                body: "Invalid model name."
            };
            return;
        }

        const newRecord = await prisma[modelName].create({
            data: data
        });

        context.res = {
            status: 200,
            body: newRecord
        };
    } catch (error) {
        context.res = {
            status: 500,
            body: "Error creating record: " + error.message
        };
    }
};
