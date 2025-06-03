import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { SupabaseAdapter } from "@auth/supabase-adapter"; // Import the adapter

// import pool from "@lib/databaseConnection/db";
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server'; // Import NextResponse for consistent response handling

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; 
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // You'll need this for the adapter

const supabase = createClient(supabaseUrl, supabaseKey);

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
        const { data, error } = await supabase.auth.signInWithPassword({
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
    async session({ session, user }) {
      // The `user` object here comes from the adapter's `next_auth.users` table.
      // Its `id` is the UUID that NextAuth's adapter uses internally.
      // We want to ensure the session also contains the Supabase Auth UUID for RLS.

      if (user) {
        // This 'user.id' is the ID from next_auth.users, which is tied to Supabase Auth's UID
        session.user.id = user.id;
        session.user.name = user.name;
        session.user.email = user.email;
        session.user.image = user.image;

        // Optionally, fetch the current Supabase Auth user to get their actual UUID
        // from Supabase's auth.users table for direct RLS usage.
        // This is important if you use `auth.uid()` in your RLS policies.
        const { data: { user: supabaseAuthUser } } = await supabase.auth.getUser();
        if (supabaseAuthUser) {
          session.user.supabaseAuthId = supabaseAuthUser.id; // Store the actual Supabase Auth UUID
        }
      }
      return session;
    },

    async jwt({ token, user }) {
      // The `user` object here is passed when a new session is created (e.g., after sign-in).
      // Its `id` will be the UUID from the adapter's `next_auth.users` table.
      if (user) {
        token.id = user.id; // Adapter's user ID (UUID)
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
      }

      // If you added `supabaseAuthId` to the session, you might want to add it to the JWT too.
      // However, fetching `supabase.auth.getUser()` in `jwt` can be less efficient than in `session`.
      // The `session` callback is usually sufficient for attaching this.

      return token;
    },

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
  },

  // 4. Define Pages
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    // newUser: '/auth/new-user', // If you have a dedicated new user setup flow
  },

  // 5. Session Strategy
  session: {
    strategy: "jwt",
  },

  // 6. NextAuth Secret
  secret: process.env.NEXTAUTH_SECRET, // Make sure this is set!
};

// 7. Export the NextAuth handler
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
// async function findOrCreateUser({ user, account, profile }) {
//   // 1. Find the Supabase Auth user by email
//   // const authUserResult = await pool.query(
//   //   'SELECT id FROM auth.users WHERE email = $1',
//   //   [user.email]
//   // );
//   // const supabaseAuthId = user.id; // This is the UUID from Supabase Auth

//   // if (authUserResult.rows.length === 0) {
//   //   throw new Error("Supabase Auth user not found for this email.");
//   // }
//   // const supabaseUserId = authUserResult.rows[0].id; 
//   const supabaseAuthId = user.id; // Use the Supabase Auth user ID directly


//   // const existingUser = await pool.query(
//   //   'SELECT * FROM users WHERE id = $1',
//   //   [supabaseUserId]
//   // );
// const { data: existingUser, error: existingUserError } = await supabase
//     .from('users')
//     .select('*')
//     .eq('id', supabaseAuthId)
//     .single(); // Use single() to get a single user or null if not found

//   if (existingUserError) {
//     console.error("Error fetching user from Supabase:", existingUserError.message);
//     throw new Error("Error fetching user from Supabase: " + existingUserError.message);
//   }

//   if (existingUser) {
//     // If user already exists, return the existing user
//     console.log("Existing user found:", existingUser.email);
//     return existingUser;
//   }
// console.log('Creating new user in public.users for:', user.email);
//   const name = user.name || profile?.name || "New User";
//   const image = user.image || profile?.picture || null;
//   const emailVerified = profile?.email_verified ? new Date(profile.email_verified).toISOString() : null;

// const { data: newUser, error: insertError } = await supabase
//     .from('users')
//     .insert([
//       {
//         id: supabaseAuthId, // Use the UUID from Supabase Auth
//         name: name,
//         email: user.email,
//         image: image,
//         oauth_provider: account.provider,
//         oauth_id: profile?.sub || profile?.id || null,
//         emailverified: emailVerified,
//         created_at: new Date().toISOString(), // Supabase handles timestamps if column is 'timestamp with time zone' and default is now()
//       }
//     ])
//     .select() // Use .select() to return the inserted row
//     .single();


//     if (insertError) {
//     console.error('Error inserting new user:', insertError);
//     throw new Error("Database error while creating new user.");
//   }

//   return newUser;
// }

// export const authOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         username: { label: "Username", type: "text" },
//         password: { label: "Password", type: "password" }
//       },
//       async authorize(credentials) {
//         // Implement your credentials logic here.
//         // This example assumes you'd check against your 'users' table or Supabase Auth.
//         // For Supabase Auth:
//         const { data, error } = await supabase.auth.signInWithPassword({
//           email: credentials.username, // Assuming username is email
//           password: credentials.password,
//         });

//         if (error) {
//           console.error("Supabase sign-in error:", error.message);
//           return null; // Return null if authentication fails
//         }

//         if (data.user) {
//           // If successful, retrieve or create the user in your public.users table
//           const { data: profileData, error: profileError } = await supabase
//             .from('users')
//             .select('*')
//             .eq('id', data.user.id)
//             .single();

//           if (profileError && profileError.code !== 'PGRST116') {
//             console.error('Error fetching user profile for credentials:', profileError);
//             return null;
//           }

//           if (profileData) {
//             // Return the user object expected by NextAuth
//             return {
//               id: profileData.id,
//               name: profileData.name,
//               email: profileData.email,
//               image: profileData.image,
//               // Add other fields you need
//             };
//           } else {
//             // This case means a user exists in auth.users but not in public.users.
//             // You might want to create them here or handle this as an error.
//             console.warn("User found in Supabase Auth but not in public.users table for credentials login.");
//             // Optionally create the user in public.users if it's not there
//             const { data: newCredentialsUser, error: newCredentialsUserError } = await supabase
//               .from('users')
//               .insert([
//                 {
//                   id: data.user.id,
//                   email: data.user.email,
//                   // Add default name, image, etc. if needed
//                   name: data.user.email, // Or prompt for name
//                   created_at: new Date().toISOString(),
//                 }
//               ])
//               .select()
//               .single();

//             if (newCredentialsUserError) {
//               console.error("Error creating new user for credentials:", newCredentialsUserError);
//               return null;
//             }
//             return {
//               id: newCredentialsUser.id,
//               name: newCredentialsUser.name,
//               email: newCredentialsUser.email,
//               image: newCredentialsUser.image,
//             };
//           }
//         }
//         return null; // Return null if authentication fails
//       }
//     }),
//   ],
//   callbacks: {
//     async signIn({ user, account, profile }) {
//       if (account.provider === 'google') {
//         const dbUser = await findOrCreateUser({ user, account, profile });
//         user.id = dbUser.id; // Crucial: ensure user.id in NextAuth is your DB UUID
//         user.name = dbUser.name;
//         user.email = dbUser.email;
//         user.image = dbUser.image;
//         // If you had a concept of a "new user" redirect, you'd handle it here
//         // if (dbUser && dbUser.name === "New User" && !profile.email_verified) { // Example condition
//         //   return "/auth/new-user";
//         // }
//       } else if (account.provider === 'credentials') {
//         // For credentials, 'user' object is already returned by authorize.
//         // You might want to do a similar findOrCreateUser here if you want to ensure the 'users' table is populated.
//         // For simplicity, assuming authorize handles it.
//         if (user) { // user is the object returned by authorize
//           return true;
//         }
//         return false;
//       }
//       return true; // Allow sign in
//     },

//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.name = user.name;
//         token.email = user.email;
//         token.image = user.image;
//         // Add any additional user data you want in JWT from your DB user object
//       }
//       return token;
//     },

//     async session({ session, token }) {
//       if (token?.id) {
//         session.user.id = token.id;
//         session.user.name = token.name;
//         session.user.email = token.email;
//         session.user.image = token.image;
//         // Add any additional user data you want in session
//       }
//       return session;
//     }
//   },

//   pages: {
//     signIn: '/auth/signin',
//     signOut: '/auth/signout',
//     error: '/auth/error',
//     // newUser: '/auth/new-user', // Uncomment if you implement this
//   },
//   session: {
//     strategy: "jwt",
//   },
//   secret: process.env.NEXTAUTH_SECRET, // Make sure to set this
// };

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };
  // if (existingUser.rows.length > 0) {
  //   return existingUser.rows[0];
  // }

  // // 3. Insert new user with the Supabase Auth user ID
  // const name = username || user.name || profile?.name || "New User";
  // const image = userImage || user.image || profile?.picture || null;





  // const insertResult = await pool.query(
  //   `INSERT INTO users (id, name, email, image, oauth_provider, oauth_id, emailverified, created_at) 
  //    VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
  //    RETURNING *`,
  //   [
  //     supabaseUserId,
  //     name,
  //     user.email,
  //     image,
  //     account.provider,
  //     profile?.sub || profile?.id || null,
  //     profile?.email_verified ? new Date(profile.email_verified) : null
  //   ]
  // );

//   return insertResult.rows[0];
// }
// async function findOrCreateUser({ user, account, profile, username, userImage }) {
//         const existingUser = await pool.query(
//       'SELECT * FROM users WHERE email = $1',
//       [user.email]
//     );
//         if (existingUser.rows.length > 0) {
//           return existingUser.rows[0];
//         }

//   // If not, insert new user (with username and userImage if provided)
// function isUUID(str) {
//   return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
// }

// const id =
//   (isUUID(user.id) && user.id) ||
//   (isUUID(profile?.sub) && profile?.sub) ||
//   crypto.randomUUID();

//   const name = username || user.name || profile?.name || "New User";
//   const image = userImage || user.image || profile?.picture || null;


//           const insertResult = await pool.query(
//             `INSERT INTO users (id, name, email, image, oauth_provider, oauth_id, emailverified, created_at) 
//             VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
//             RETURNING *`,
//             [
//               id, 
//               name, 
//               user.email, 
//               image, 
//               account.provider, 
//               profile?.sub || profile?.id || null,
//               profile?.email_verified ? new Date(profile.email_verified) : null
//             ]
//           );
      
//         return insertResult.rows[0];
//       }

// export const authOptions = {
//     providers: [
//       GoogleProvider({
//         clientId: process.env.GOOGLE_CLIENT_ID,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       }),
//       CredentialsProvider({
//         name: "Credentials",
//         credentials: {
//           username: { label: "Username", type: "text" },
//           password: { label: "Password", type: "password" }
//         },
//         async authorize(credentials) {
//    // Check user credentials
//         }
//       }),
//     ],
//     callbacks: {
//   async signIn({ user, account, profile }) {
//     const dbUser = await findOrCreateUser({ user, account, profile });
   //user.id = dbUser.id; // dbUser.id is your UUID from the database
    // If this is a new user, redirect to new user page
    // if (dbUser && dbUser.name === "New User") {
    //   return "/auth/new-user";
    // }
  //     const dbUser = await findOrCreateUser({ user, account, profile });
  // user.id = dbUser.id; // <-- ensure user.id is your DB UUID
  // user.name = dbUser.name;
  // user.email = dbUser.email;
  // user.image = dbUser.image;
  // if (dbUser && dbUser.name === "New User") {
  //   return "/auth/new-user";
  // }
  //   return true;
  // },
            
  //     async jwt({ token, user }) {
  //       if (user) 
  //         token.id = user.id;
  //         // Add any additional user data you want in JWT
  //       return token;
  //     },

  //     async session({ session, token }) {
  //       if (token?.id) 
  //         session.user.id = token.id;
  //         // Add any additional user data you want in session
        
  //       return session;
  //     }
  //   },


  

  //   pages: {
  //     signIn: '/auth/signin',
  //     signOut: '/auth/signout',
  //     error: '/auth/error',
  //     // newUser: '/auth/new-user',
  //   },
  //   session: {
  //     strategy: "jwt",
  //   },
  // };
  
  // const handler = NextAuth(authOptions);
  
  // export { handler as GET, handler as POST };