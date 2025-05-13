import pool from '@lib/databaseConnection/db'; // Adjust the path if needed

export async function GET({ params }) {
  const { id } = params;
  console.log("Fetching post details for ID:", id);


  try {
    const postResult = await pool.query(
      `SELECT * FROM posts WHERE id = $1`,
      [id]
    );

if (postResult.rows.length === 0) {
      console.log("Post not found for ID:", id);
      return new Response(JSON.stringify({ message: 'Post not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const post = postResult.rows[0];
  }
}
// Fetch the total likes for the post
//I shouldnt be doing this here
//     const likeResult = await pool.query(
//       `SELECT COUNT(*) AS like_count FROM likes WHERE post_id = $1`,
//       [id]
//     );
// //review this part of the code
//     const likeCount = parseInt(likeResult.rows[0].like_count, 10);

//     return new Response(
//       JSON.stringify({
//         success: true,
//         data: { ...post, like: likeCount },
//       }),
//       {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' },
//       }
//     );
//   } catch (error) {
//     console.error('Error fetching post details:', error);
//     return new Response(
//       JSON.stringify({ message: 'Internal server error' }),
//       {
//         status: 500,
//         headers: { 'Content-Type': 'application/json' },
//       }
//     );
//   }
// }


// // Handle PUT request to update the like count and isLiked state
// export async function PUT(request, { params }) {
//   const { id } = params;
//   //these aren't showing in the console
//   console.log("Received PUT request for post ID:", id);

  
//     try {
//       const { isLiked, user_id } = await request.json();
//       console.log("Request body for PUT:", { isLiked, user_id });
  
//       if (isLiked) {
//         // Add a like
//         await pool.query(
//           `INSERT INTO likes (user_id, post_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
//           [user_id, post_id]
//         );
//       } else {
//         // Remove a like
//         await pool.query(
//           `DELETE FROM likes WHERE user_id = $1 AND post_id = $2`,
//           [user_id, post_id]
//         );
//       }
  
//       // Fetch the updated like count
//       const likeResult = await pool.query(
//         `SELECT COUNT(*) AS like_count FROM likes WHERE post_id = $1`,
//         [id]
//       );
  
//       const likeCount = parseInt(likeResult.rows[0].like_count, 10);
  
//       return new Response(
//         JSON.stringify({
//           success: true,
//           data: { post_id: id, like: likeCount },
//         }),
//         {
//           status: 200,
//           headers: { 'Content-Type': 'application/json' },
//         }
//       );
//     } catch (error) {
//       console.error('Error updating like count:', error);
//       return new Response(
//         JSON.stringify({ message: 'Internal server error' }),
//         {
//           status: 500,
//           headers: { 'Content-Type': 'application/json' },
//         }
//       );
//     }
//   }
  