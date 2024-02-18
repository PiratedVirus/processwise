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

async function fetchUserProfile(userEmail) {
    try {
        const accessToken = await getAccessToken();
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        };

        const url = `https://graph.microsoft.com/v1.0/users/${userEmail}`;
        const response = await axios.get(url, config);
        return response.data;
    } catch (error) {
        console.error('Error fetching user profile', error);
        throw new Error('Error fetching user profile');
    }
}

module.exports = async function (context, req) {
    try {
        const userEmail = req.body.userEmail;
        if (!userEmail) {
          context.res = {
            status: 400,
            body: "User email is required in the request body."
          };
          return;
        }
        const profile = await fetchUserProfile(userEmail);
        context.res = {
            body: profile
        };
        context.log("User profile fetched successfully!");
    } catch (error) {
        context.res = {
            status: 500,
            body: "An error occurred while fetching the user profile."
        };
        context.log.error(error);
    }
};
