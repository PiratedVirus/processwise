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

async function createUser(userData) {
    try {
        const accessToken = await getAccessToken();
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        const url = 'https://graph.microsoft.com/v1.0/users';
        const response = await axios.post(url, userData, config);
        return response.data;
    } catch (error) {
        console.error('Error creating user', error);
        throw new Error('Error creating user');
    }
}

module.exports = async function (context, req) {
    try {
        const userData = req.body; 
        if (!userData || !userData.userPrincipalName || !userData.displayName) {
          context.res = {
            status: 400,
            body: "Required user data is missing in the request body."
          };
          return;
        }
        
        const newUser = await createUser(userData);
        context.res = {
            body: newUser
        };
        context.log("User created successfully!");
    } catch (error) {
        context.res = {
            status: 500,
            body: "An error occurred while creating the user."
        };
        context.log.error(error);
    }
};