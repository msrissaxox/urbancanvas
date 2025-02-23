import NextAuth from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";

export const authOptions = {
    providers: [
        Auth0Provider({
        clientId: process.env.AUTH0_CLIENT_ID,
        clientSecret: process.env.AUTH0_CLIENT_SECRET,
        issuer: `https://${process.env.AUTH0_DOMAIN}`,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    callbacks: {
    async session({ session, token }) {
        session.user.id = token.sub; // Save Auth0 user ID in session
        return session;
    },
},
};

export default NextAuth(authOptions);