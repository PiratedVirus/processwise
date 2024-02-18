const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = async function fetchData(context, req) {
    try {
        const { modelName, columnName, columnValue } = req.body;
        console.log('modelName:', modelName , 'columnName:', columnName, 'columnValue:', columnValue);
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
        // If both columnName and columnValue are provided, fetch a single row
        if (columnName && columnValue !== undefined) {
            data = await prisma[modelName].findMany({
                where: {
                    [columnName]: columnValue
                }
            });
        } else {
            // If columnName and columnValue are not provided, fetch all rows
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
