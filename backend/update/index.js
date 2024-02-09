const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = async function (context, req) {
    try {
        const { modelName, idKey, idValue, userData, columnToUpdate } = req.body;
        if (!modelName || !idKey || !idValue || !userData) {
            context.res = {
                status: 400,
                body: "Please provide modelName, id and data."
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

        const updateData = columnToUpdate ? { [columnToUpdate]: userData[columnToUpdate] } : userData;
        console.log("updateData ", updateData)
        const updatedRecord = await prisma[modelName].update({
            where: { [idKey]: idValue },
            data: updateData
        });

        context.res = {
            status: 200,
            body: updatedRecord
        };
    } catch (error) {
        context.res = {
            status: 500,
            body: "Error updating record: " + error.message
        };
    }
};
