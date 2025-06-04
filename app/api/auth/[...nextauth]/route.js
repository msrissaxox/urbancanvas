import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { SupabaseAdapter } from "@auth/supabase-adapter"; // Import the adapter
import jwt from "jsonwebtoken"; // Import jwt for token handling

// import pool from "@lib/databaseConnection/db";
import { createClient } from '@supabase/supabase-js';
// import { NextResponse } from 'next/server'; // Import NextResponse for consistent response handling

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; 
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // You'll need this for the adapter
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET; // Ensure this is set in your environment variables
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey); // <-- Use SERVICE_ROLE_KEY here for admin tasks


console.log("DEBUG: NEXT_PUBLIC_SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("DEBUG: NEXT_PUBLIC_SUPABASE_ANON_KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Loaded" : "UNDEFINED / NOT MATCHED");
console.log("DEBUG: SUPABASE_SERVICE_ROLE_KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "Loaded" : "UNDEFINED / NOT MATCHED");
console.log("DEBUG: NEXTAUTH_SECRET:", process.env.NEXTAUTH_SECRET ? "Loaded" : "UNDEFINED / NOT MATCHED");

// //from supabase adapter documentation
// export const { handlers, auth, signIn, signOut } = NextAuth({
//   providers: [],
//   adapter: SupabaseAdapter({
//     url: process.env.SUPABASE_URL,
//     secret: process.env.SUPABASE_SERVICE_ROLE_KEY,
//   }),
// })

export const authOptions = {
  // 1. Add the Supabase Adapter
  // This tells NextAuth to use your Supabase database for storing users, accounts, and sessions.
  adapter: SupabaseAdapter({
    url: supabaseUrl,
    secret: supabaseServiceRoleKey, // Crucial: use your Service Role Key here
  }),

  // 2. Define Providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "text", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Authenticate with Supabase Auth using email and password
        const { data, error } = await supabaseAdmin.auth.signInWithPassword({
          email: credentials.username,
          password: credentials.password,
        });

        if (error) {
          console.error("Supabase sign-in error for credentials:", error.message);
          return null; // Authentication failed
        }

        if (data.user) {
          // If successful, data.user.id is the Supabase Auth UUID.
          // The adapter will handle creating/updating the user in its own `next_auth.users` table
          // based on this ID and the user's data.
          return {
            id: data.user.id, // This is the Supabase Auth UUID
            email: data.user.email,
            name: data.user.user_metadata?.full_name || data.user.email.split('@')[0], // Use metadata or derive name
            image: data.user.user_metadata?.avatar_url || null, // Use metadata for image
          };
        }
        return null; // Should not be reached if data.user is null and no error
      }
    }),
  ],

  // 3. Configure Callbacks
  // These callbacks are essential for attaching Supabase Auth's UUID to your session
  // and JWT, which is useful for Row Level Security (RLS) in Supabase.
  callbacks: {
    async session({ session, user, token }) {

const signingSecret = process.env.SUPABASE_JWT_SECRET
      if (signingSecret) {
        const payload = {
          aud: "authenticated",
          exp: Math.floor(new Date(session.expires).getTime() / 1000),
          sub: user.id,
          email: user.email,
          role: "authenticated",
        }
        session.supabaseAccessToken = jwt.sign(payload, signingSecret)
      }
      if (user) {
        // This 'user.id' is the ID from next_auth.users, which is tied to Supabase Auth's UID
        session.user.id = user.id;
        session.user.name = user.name;
        session.user.email = user.email;
        session.user.image = user.image;

      } else if (token) {
         session.user.id = token.id;
    session.user.name = token.name;
    session.user.email = token.email;
    session.user.image = token.image;
      }
      return session;
    },
    async jwt({ token, user }) {

      if (user) {
        token.id = user.id; // Adapter's user ID (UUID)
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
      }
      return token; // Return the token with user data
    },
  async redirect({ baseUrl }) {
    return baseUrl; // always redirect to homepage
  },

    },
    session: {
      strategy: "jwt", // Use JWT for session management
    },
    secret: NEXTAUTH_SECRET, // Ensure this is set for security
    }
    // The `signIn` callback is generally NOT needed when using an adapter,
    // as the adapter handles all the user creation/linking logic.
    // Uncomment and add custom logic ONLY if you need to prevent certain users from signing in
    // based on specific conditions *before* the adapter saves them.
    // async signIn({ user, account, profile }) {
    //   // For example, only allow users with a specific email domain:
    //   // if (user.email?.endsWith('@example.com')) {
    //   //   return true;
    //   // } else {
    //   //   return '/auth/error?error=AccessDenied';
    //   // }
    //   return true; // By default, allow sign-in if adapter is configured
    // },


  //4. Define Pages
  // pages: {
  //   signIn: '/auth/signin',
  //   signOut: '/auth/signout',
  //   error: '/auth/error',
    // newUser: '/auth/new-user', // If you have a dedicated new user setup flow


// 7. Export the NextAuth handler
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
