import pool from "../../../src/app/databaseConnection/db";

// Get all users
export async function GET(req) {
  try {
    console.log("Fetching users...");

    const result = await pool.query("SELECT * FROM users");
    console.log("Users result:", result.rows);
   
    return new Response(
      JSON.stringify({
        success: true,
        message: "Users retrieved successfully",
        data: result.rows,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Database connection error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Database connection failed!",
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

// Create new user
export async function POST(request) {
  try {
    const body = await request.json();
    const { username, email, oauth_provider, oauth_id, profile_picture } = body;

    // Check to see if a user already exists with this oAuth ID
    const existingUser = await pool.query(
      `SELECT id FROM users WHERE oauth_provider = $1 AND oauth_id = $2`,
      [oauth_provider, oauth_id]
    );
    if (existingUser.rows.length > 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User already exists",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Create a new user
    const result = await pool.query(
      `INSERT INTO users (username, email, oauth_provider, oauth_id, profile_picture)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, username, email, oauth_provider, oauth_id, profile_picture, created_at`,
      [username, email, oauth_provider, oauth_id, profile_picture]
    );
    return new Response(
      JSON.stringify({
        success: true,
        message: "User created successfully",
        data: result.rows[0],
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error creating user:", error);

    // Handle unique constraint violation
    if (error.code === "23505") {
      const field = error.detail.includes("email") ? "email" : "username";
      return new Response(
        JSON.stringify({
          success: false,
          message: `User with this ${field} already exists`,
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        message: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

// Update user profile picture
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { user_id, profile_picture } = body;

    const result = await pool.query(
      `UPDATE users 
             SET profile_picture = $1
             WHERE id = $2 
             RETURNING *`,
      [profile_picture, user_id]
    );

    if (result.rows.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "User not found",
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: result.rows[0],
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
