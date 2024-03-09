// Adjusting or adding imports as necessary
import { User as PrismaUser } from "@prisma/client";
import "next-auth";
import { JWT } from "next-auth/jwt";

// Extending the Session and JWT interfaces to include custom fields
declare module "next-auth" {
    interface Session {
        user: {
            // Uncomment and correct the types if needed
            role?: string[] | string; 
            userDetails?: any; // Specify a more specific type if known
            userId: string;
            userCompany: string;
            userRole: string;
            userMailboxesAccess: string;
            userPosition: string;
        } & PrismaUser; // Extends Prisma's User model
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        // Uncomment and correct if needed
        // role?: string[];
        userDetails?: any; // Again, specify a more specific type if known
        // Correcting type definitions
        userId?: string;
        userCompany?: string;
        userRole?: string;
        userMailboxesAccess?: string;
        userPosition?: string;
    }
}
