const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = async function fetchData(context, req) {
    try {
        const { modelName, conditions } = req.body;
        console.log('modelName:', modelName , '@#@ conditions:', conditions);
        // Check if modelName is provided
        if (!modelName) {
            context.res = {
                status: 400,
                body: "Please provide a modelName."
            };
            return;
        }

        // Check if model exists in Prisma
        if (!prisma[modelName]) {
            context.res = {
                status: 400,
                body: "Invalid model name."
            };
            return;
        }

        let data;
        // If conditions are provided, fetch rows that match all conditions
        if (conditions && conditions.length > 0) {
            const whereConditions = conditions.reduce((acc, condition) => {
                acc[condition.columnName] = condition.contains ? { contains: condition.columnValue } : condition.columnValue;
                return acc;
            }, {});
            data = await prisma[modelName].findMany({
                where: whereConditions
            });
        } else {
            // If conditions are not provided, fetch all rows
            data = await prisma[modelName].findMany();
        }

        // Return the fetched data
        context.res = {
            status: 200,
            body: data || "No data found."
        };
        console.log('^^^^^Data:', JSON.stringify(data));
    } catch (error) {
        // Handle any errors
        console.error("Error fetching data:", error);
        context.res = {
            status: 500,
            body: "Error fetching data: " + error.message
        };
    }
}