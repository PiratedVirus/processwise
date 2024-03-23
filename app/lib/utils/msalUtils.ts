import { ConfidentialClientApplication, Configuration } from '@azure/msal-node';

export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.AZURE_AD_CLIENT_ID ?? '',
    authority: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID ?? ''}`,
    clientSecret: process.env.AZURE_AD_CLIENT_SECRET ?? '',
  },
};

export const cca = new ConfidentialClientApplication(msalConfig);

export async function getAccessToken(): Promise<string> {
  const tokenRequest = {
    scopes: ['https://graph.microsoft.com/.default'],
  };

  const response = await cca.acquireTokenByClientCredential(tokenRequest);
  if (!response || !response.accessToken) {
    throw new Error('Failed to acquire access token');
  }
  return response.accessToken;
}
