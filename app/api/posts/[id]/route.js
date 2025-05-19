//id routes

//posts routes
//Common HTTP methods here are:


import pool from "@lib/databaseConnection/db"; // Adjust the path if needed

// POST /api/posts/[postId]/likes
export async function POST(req, { params }) {
  const { id: postId } = params;
  const { userId } = await req.json();

  if (!userId) {
    return new Response(JSON.stringify({ success: false, message: "User ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Check if the user has already liked this post
    const existingLike = await pool.query(
      "SELECT * FROM likes WHERE post_id = $1 AND user_id = $2",
      [postId, userId]
    );

    if (existingLike.rows.length > 0) {
      return new Response(JSON.stringify({ success: false, message: "You have already liked this post" }), {
        status: 409, // Conflict
        headers: { "Content-Type": "application/json" },
      });
    }

    // Add the like
    await pool.query(
      "INSERT INTO likes (post_id, user_id) VALUES ($1, $2)",
      [postId, userId]
    );

    // Fetch the updated like count
    const likeCountResult = await pool.query(
      "SELECT COUNT(*) AS like_count FROM likes WHERE post_id = $1",
      [postId]
    );
    const likeCount = parseInt(likeCountResult.rows[0].like_count, 10);

    return new Response(
      JSON.stringify({ success: true, message: "Post liked!", likeCount }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error liking post:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Internal server error", error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function GET(request, { params }) {
  const { id } = params;

  try {
    console.log("Fetching post with ID: ", id); 
    const result = await pool.query
    ("SELECT * FROM posts WHERE id = $1", [id]);
    console.log("Query result:", result.rows);

  if (result.rows.length === 0) {
      return new Response(JSON.stringify({ success: false, message: "Post not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
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
// DELETE /api/posts/[postId]/likes
export async function DELETE(req, { params }) {
  const { id: postId } = params;
  const { userId } = await req.json();

  if (!userId) {
    return new Response(JSON.stringify({ success: false, message: "User ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Remove the like
    const result = await pool.query(
      "DELETE FROM likes WHERE post_id = $1 AND user_id = $2 RETURNING *",
      [postId, userId]
    );

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ success: false, message: "Like not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Fetch the updated like count
    const likeCountResult = await pool.query(
      "SELECT COUNT(*) AS like_count FROM likes WHERE post_id = $1",
      [postId]
    );
    const likeCount = parseInt(likeCountResult.rows[0].like_count, 10);

    return new Response(
      JSON.stringify({ success: true, message: "Post unliked!", likeCount }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error unliking post:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Internal server error", error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}


export async function PUT (req, context) {
  
  const { id } = context.params;

  try {
 const { user_id, isLiked } = await req.json();

    if (!id || !user_id) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing post_id or user_id" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (isLiked) {
      await pool.query(
        `INSERT INTO likes (user_id, post_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [user_id, id]
      );
    } else {
      await pool.query(
        `DELETE FROM likes WHERE user_id = $1 AND post_id = $2`,
        [user_id, id]
      );
    }

    const likeResult = await pool.query(
      `SELECT COUNT(*) AS like FROM likes WHERE post_id = $1`,
      [id]
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: "Like count updated successfully",
        likeCount: parseInt(likeResult.rows[0].like, 10),
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error('Error updating like count:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

//     const body = await req.json();
//     console.log("PUT /api/posts body:", body); 

//     const { caption, city, state, image_url } = body;

//     // Validate required fields
//     if (!caption || !city || !state || !image_url) {
//       return new Response(
//         JSON.stringify({ message: "All fields are required" }),
//         {
//           status: 400,
//           headers: { "Content-Type": "application/json" },
//         }
//       );
//     }

//     const result = await pool.query(
//       `UPDATE posts SET caption = $1, city = $2, state = $3, image_url = $4 WHERE id = $5 RETURNING *`,
//       [caption, city, state, image_url, id]
//     );
//     console.log("Query result:", result.rows);
//     if (result.rows.length === 0) {
//       return new Response(JSON.stringify({ success: false, message: "Post not found" }), {
//         status: 404,
//         headers: { "Content-Type": "application/json" },
//       });
//     }
//     return new Response(
//       JSON.stringify({
//         success: true,
//         message: "Post updated successfully",
//         data: result.rows[0],
//       }),
//       {
//         status: 200,
//         headers: { "Content-Type": "application/json" },
//       }
//     );
//   }
//   catch (error) {
//     console.error("Error updating post:", error);
//     return new Response(
//       JSON.stringify({
//         success: false,
//         message: "Internal server error",
//         error: error.message,
//       }),
//       {
//         status: 500,
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );
//   }
// }
