//posts routes
//Common HTTP methods here are:

//GET: To fetch details of a single post. DONE
//PUT: To update an existing post. DONE
//DELETE: To delete a specific post.


import pool from '@lib/databaseConnection/db'; // Adjust the path if needed

// Handle PUT request to update the like count and isLiked state

export async function GET() {
  try {
    console.log("Fetching posts...");
    const result = await pool.query(
      "SELECT * FROM posts ORDER BY created_at DESC"
    );
    console.log("Query result:", result.rows);

    return new Response(
      JSON.stringify({
        success: true,
        data: result.rows,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error",
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



export async function POST(req) {
  try {
    const body = await req.json();
    console.log("POST /api/posts body:", body); 

    const { user_id: oauth_id, caption, city, state, image_url } = body;

    // Validate required fields
    if (!oauth_id || !caption || !city || !state || !image_url) {
      return new Response(
        JSON.stringify({ message: "All fields are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const userResult = await pool.query(
      `SELECT id FROM users WHERE oauth_id = $1`,
      [oauth_id]
    );
     if (userResult.rows.length === 0) {
      return new Response(
        JSON.stringify({ message: "User not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

        const user_uuid = userResult.rows[0].id;
    const result = await pool.query(
      `INSERT INTO posts (user_id, caption, city, state, image_url, created_at)
   VALUES ($1, $2, $3, $4, $5, NOW())
   RETURNING *`,
      [user_uuid, caption, city, state, image_url]
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: "Post created successfully",
        data: result.rows[0],
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error creating post:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}