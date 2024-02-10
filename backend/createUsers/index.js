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

async function sendUserInvitation(invitationData) {
    try {
        const accessToken = await getAccessToken();
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        const url = 'https://graph.microsoft.com/v1.0/invitations';
        const response = await axios.post(url, invitationData, config);
        return response.data;
    } catch (error) {
        console.error('Error sending user invitation', error);
        throw new Error('Error sending user invitation');
    }
}

module.exports = async function (context, req) {
    try {
        const invitationData = req.body; 
        console.log("invivte data " + JSON.stringify(invitationData));
        if (!invitationData  ) {
          context.res = {
            status: 400,
            body: "Required invitation data is missing in the request body."
          };
          return;
        }
        const invitationResponse = await sendUserInvitation(invitationData);
        context.res = {
            body: invitationResponse
        };
        context.log("User invitation sent successfully!");
    } catch (error) {
        context.res = {
            status: 500,
            body: "An error occurred while sending the user invitation."
        };
        context.log.error(error);
    }
};
