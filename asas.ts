import { withAuth } from "next-auth/middleware";

export default withAuth ({
    
    callbacks: {
        authorized: async({req, token}) => {
            console.log('Middleware is running on path:', req.nextUrl.pathname);
            if(req.nextUrl.pathname.startsWith("/dashboard")){
                console.log("inside admin middleware")
                return token?.role === 'admin'; 
            } else {
                console.log("free entry area")
            }
            return !!token;

        }
    }
})

export const config = { matcer: ["/dashboard:path*", "/profile"]}