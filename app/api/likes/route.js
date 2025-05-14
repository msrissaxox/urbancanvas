import pool from "@lib/databaseConnection/db";

export async function GET() {
  try {
    console.log("Fetching likes...");

    const result = await pool.query("SELECT * FROM likes");
    console.log("Likes result:", result.rows);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Likes fetched successfully",
        data: result.rows,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching likes:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to fetch likes",
        error: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}


// POST /api/likes
export async function POST(request) {
  try {
    const { user_id, post_id } = await request.json();

    // Check if the user has already liked the post
    const existingLike = await pool.query(
      `SELECT id FROM likes WHERE user_id = $1 AND post_id = $2`,
      [user_id, post_id]
    );

    if (existingLike.rows.length > 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User has already liked this post",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Add the like
    const result = await pool.query(
      `INSERT INTO likes (user_id, post_id)
       VALUES ($1, $2)
       RETURNING *`,
      [user_id, post_id]
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: "Post liked successfully",
        data: result.rows[0],
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error liking post:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to like post",
        error: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// DELETE /api/likes
export async function DELETE(request) {
  try {
    const { user_id, post_id } = await request.json();

    const result = await pool.query(
      `DELETE FROM likes
       WHERE user_id = $1 AND post_id = $2
       RETURNING *`,
      [user_id, post_id]
    );

    if (result.rows.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Like not found",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Like removed successfully",
        data: result.rows[0],
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error removing like:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to remove like",
        error: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
