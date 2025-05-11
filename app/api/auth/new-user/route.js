import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import pool from "@lib/databaseConnection/db";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return new Response(JSON.stringify({ success: false, message: "Not authenticated" }), { status: 401 });
  }
  const { username, image } = await req.json();
  try {
    await pool.query(
      "UPDATE users SET name = $1, image = $2 WHERE email = $3",
      [username, image, session.user.email]
    );
    return new Response(JSON.stringify({ success: true }));
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
}