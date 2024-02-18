const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = async function (context, req) {
    console.log('req.body @@@', req.body);
    try {
        const { modelName, idKey, idValue } = req.body;
        console.log(' @@ DELETE @@ modelName, idKey, idValue', modelName, idKey, idValue);
        if (!modelName || !idKey || !idValue) {
            context.res = {
                status: 400,
                body: "Please provide both modelName, idKey and idValue."
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

        const deletedRecord = await prisma[modelName].delete({
            where: {
                [idKey]: idValue, 
            },
        });

        context.res = {
            status: 200,
            body: `Record deleted successfully: ${JSON.stringify(deletedRecord)}`
        };
    } catch (error) {
        if (error.code === "P2025") {
            // Handle specific case where the record to delete does not exist
            context.res = {
                status: 404,
                body: "Record not found."
            };
        } else {
            context.res = {
                status: 500,
                body: "Error deleting record: " + error.message
            };
        }
    }
};
