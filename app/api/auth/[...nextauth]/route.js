import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";


export const authOptions = {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          username: { label: "Username", type: "text" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
          // Add your logic here to validate username/password
          // Return user object if authentication successful, null otherwise
          
          // Example simple validation:
          // if (credentials?.username === "user" && credentials?.password === "pass") {
          //   return { id: "1", name: "User", email: "user@example.com" };
          // }
          // return null;
          
        }
      }),
    ],
    callbacks: {
      async session({ session, token }) {
        if (token) {
          session.user.id = token.sub;
          // Add any additional user data you want in session
        }
        return session;
      },
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
          // Add any additional user data you want in JWT
        }
        return token;
      }
    },
    pages: {
      signIn: '/auth/signin',
      signOut: '/auth/signout',
      error: '/auth/error',
      newUser: '/auth/new-user',
    },
    session: {
      strategy: "jwt",
    },
  };
  
  const handler = NextAuth(authOptions);
  
  export { handler as GET, handler as POST };