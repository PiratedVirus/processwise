const axios = require('axios');
const msal = require('@azure/msal-node');
const msalConfig = require('../configs/msalConfig');

const cca = new msal.ConfidentialClientApplication(msalConfig);

async function getAccessToken() {
    const tokenRequest = {
        scopes: ["https://graph.microsoft.com/.default"],
    };

    try {
        const response = await cca.acquireTokenByClientCredential(tokenRequest);
        return response.accessToken;
    } catch (error) {
        console.error('Error acquiring access token', error);
        throw new Error('Error acquiring access token');
    }
}

async function fetchOutlookEmails() {
    try {
        const accessToken = await getAccessToken();

        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        };

        const response = await axios.get('https://graph.microsoft.com/v1.0/users/shreeya.shevade@processwisede.onmicrosoft.com/messages', config);
        return response.data;
    } catch (error) {
        console.error('Error fetching emails', error);
        throw new Error('Error fetching emails');
    }
}

module.exports = async function (context, req) {
    try {
        const emails = await fetchOutlookEmails();
        context.res = {
            body: emails
        };
        context.log("Mails fetched successfully!");
    } catch (error) {
        context.res = {
            status: 500,
            body: "An error occurred while fetching emails."
        };
        context.log.error(error);
    }
};
