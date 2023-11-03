import { AuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import AzureADProvider from "next-auth/providers/azure-ad";
export const authOptions: AuthOptions = {
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID
    })
  ]
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST}