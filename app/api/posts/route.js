import pool from "@lib/databaseConnection/db"; // Adjust the path if needed

export async function GET(req) {
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

export async function POST(request) {
  try {
    const { user_id, caption, city, state, image_url } = await request.json();

    // Validate required fields
    if (!user_id || !caption || !city || !state || !image_url) {
      return new Response(
        JSON.stringify({ message: "All fields are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const result = await pool.query(
      `INSERT INTO posts (user_id, caption, city, state, image_url, created_at)
   VALUES ($1, $2, $3, $4, $5, NOW())
   RETURNING *`,
      [user_id, caption, city, state, image_url]
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
