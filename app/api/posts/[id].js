import pool from '../../../src/app/databaseConnection/db'; // Adjust the path if needed

export async function GET(request, { params }) {
  const { id } = params;

  try {
    const result = await pool.query(
      `SELECT p.*, u.name, u.profile_picture 
       FROM posts p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ message: 'Post not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: result.rows[0],
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error fetching post:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

// Handle PUT request to update the like count and isLiked state
export async function PUT(request, { params }) {
  const { id } = params;

  try {
    const { isLiked, like } = await request.json();

    const result = await pool.query(
      `UPDATE posts 
       SET is_liked = $1, like_count = $2 
       WHERE id = $3 
       RETURNING *`,
      [isLiked, like, id]
    );

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ message: 'Post not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: result.rows[0],
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error updating post:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
