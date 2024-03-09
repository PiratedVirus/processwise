import prisma from "@/app/lib/prisma";
import { AuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import AzureADProvider from "next-auth/providers/azure-ad";
import { PrismaAdapter } from "@auth/prisma-adapter"; 

const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID,
      authorization: { params: { scope: "openid profile User.Read email" } },
      profile(profile) {
        console.log('Azure AD profile:', profile); 
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: profile.roles,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, profile }) {
      if (token && profile) {
        const updatedProfile = profile as { roles: string[] };
        token.role = updatedProfile.roles;
      }
      // console.log('JWT token and profile:', token, profile); 
      const userDetails = await prisma.userDetails.findUnique({
        where: {
          userEmail: token.email as string,
        },
      });
      // console.log('User details from Prisma:', userDetails); 
      if (userDetails) {
        token.userId = userDetails.userId;
        token.userCompany = userDetails.userCompany ?? undefined;
        token.userRole = userDetails.userRole ?? undefined;
        token.userMailboxesAccess = userDetails.userMailboxesAccess ?? undefined;
        token.userPosition = userDetails.userPosition ?? undefined;
      }
      return { ...token, ...user };
    },
      async session({ session, token }) {
        // Correcting the assignment to nested user object fields
        // console.log('Session and token:', session, token); // Log the session and token
        if (token.role) session.user.role = token.role as string[];
        if (token.userId) session.user.userId = token.userId;
        if (token.userCompany) session.user.userCompany = token.userCompany;
        if (token.userRole) session.user.userRole = token.userRole;
        if (token.userMailboxesAccess) session.user.userMailboxesAccess = token.userMailboxesAccess;
        if (token.userPosition) session.user.userPosition = token.userPosition;
        // console.log("### SESSION ###" , session)
        
        return session;
      },
  },
  
}
const handler = NextAuth(authOptions);
// console.log('NextAuth handler:', handler); 
export { handler as GET, handler as POST };

