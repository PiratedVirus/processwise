const axios = require('axios');

module.exports = async function (context, req) {
    context.log('HTTP trigger function processed a request.');

    const msalConfig = {
        auth: {
            clientId: process.env.AZURE_AD_CLIENT_ID,
            authority: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}`,
            clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
        }
    };

    try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts/1');
        const data = response.data;

        context.res = {
            // status: 200, /* Defaults to 200 */
            body: { data, msalConfig },
            headers: {
                'Content-Type': 'application/json'
            }
        };
    } catch (error) {
        context.log.error('Error fetching data:', error);
        context.res = {
            status: 500,
            body: 'Error fetching data'
        };
    }
}