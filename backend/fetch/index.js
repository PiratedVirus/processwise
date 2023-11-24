const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = async function fetchData(context, req) {
    try {
        // Ensure the model name exists in Prisma schema
        const { modelName } = req.body;
        if (!modelName) {
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

        // Fetch data from the given model
        const data = await prisma[modelName].findMany();

        // Return the fetched data
        context.res = {
            status: 200,
            body: data
        };
    } catch (error) {
        // Handle any errors
        console.error("Error fetching data:", error);
        context.res = {
            status: 500,
            body: "Error fetching record: " + error.message
        };
    }
}

