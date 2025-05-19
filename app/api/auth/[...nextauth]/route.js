import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import pool from "@lib/databaseConnection/db";


async function findOrCreateUser({ user, account, profile, username, userImage }) {
        const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [user.email]
    );
        if (existingUser.rows.length > 0) {
          return existingUser.rows[0];
        }

  // If not, insert new user (with username and userImage if provided)
function isUUID(str) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
}

const id =
  (isUUID(user.id) && user.id) ||
  (isUUID(profile?.sub) && profile?.sub) ||
  crypto.randomUUID();

  const name = username || user.name || profile?.name || "New User";
  const image = userImage || user.image || profile?.picture || null;


          const insertResult = await pool.query(
            `INSERT INTO users (id, name, email, image, oauth_provider, oauth_id, emailverified, created_at) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
            RETURNING *`,
            [
              id, 
              name, 
              user.email, 
              image, 
              account.provider, 
              profile?.sub || profile?.id || null,
              profile?.email_verified ? new Date(profile.email_verified) : null
            ]
          );
      
        return insertResult.rows[0];
      }

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
   // Check user credentials
        }
      }),
    ],
    callbacks: {
  async signIn({ user, account, profile }) {
    const dbUser = await findOrCreateUser({ user, account, profile });
    user.id = dbUser.id; // dbUser.id is your UUID from the database
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
    return true;
  },
            
      async jwt({ token, user }) {
        if (user) 
          token.id = user.id;
          // Add any additional user data you want in JWT
        return token;
      },

      async session({ session, token }) {
        if (token?.id) 
          session.user.id = token.id;
          // Add any additional user data you want in session
        
        return session;
      }
    },


  

    pages: {
      signIn: '/auth/signin',
      signOut: '/auth/signout',
      error: '/auth/error',
      // newUser: '/auth/new-user',
    },
    session: {
      strategy: "jwt",
    },
  };
  
  const handler = NextAuth(authOptions);
  
  export { handler as GET, handler as POST };