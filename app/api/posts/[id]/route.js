//id routes
import pool from '@lib/databaseConnection/db'; // Adjust the path if needed

// Handle PUT request to update the like count and isLiked state
export async function PUT(request, { params }) {
  const { id } = params;
  //these aren't showing in the console
  console.log("Received PUT request for post ID:", id);

  
    try {
      const { isLiked, user_id } = await request.json();
      console.log("Request body for PUT:", { isLiked, user_id });
  
    if (!id || !user_id) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing post_id or user_id" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
      if (isLiked) {
        // Add a like
        await pool.query(
          `INSERT INTO likes (user_id, post_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [user_id, id]
        );
      } else {
        // Remove a like
        await pool.query(
          `DELETE FROM likes WHERE user_id = $1 AND post_id = $2`,
          [user_id, id]
        );
      }
  
      // Fetch the updated like count
      const likeResult = await pool.query(
        `SELECT COUNT(*) AS like_count FROM likes WHERE post_id = $1`,
        [id]
      );
  
      const likeCount = parseInt(likeResult.rows[0].like_count, 10);
  
      return new Response(
        JSON.stringify({
          success: true,
          data: { post_id: id, like: likeCount },
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    } catch (error) {
      console.error('Error updating like count:', error);
      return new Response(
        JSON.stringify({ message: 'Internal server error' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  }
  