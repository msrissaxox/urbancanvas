
import { createClient } from '@supabase/supabase-js';

// import { supabase } from 'app/lib/supabaseClient';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY // <-- This must be the anon key!
);


async function getUserFromRequest(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null;
  const token = authHeader.replace("Bearer ", "");
  // supabase.auth.setAuth(token);
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user;
}




// POST: Add a like to a post
export async function POST(req, { params }) {
    const { id: postId } = params;
  const user = await getUserFromRequest(req);

  // Extract token from headers
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", ""); 

  if (!user) {
    return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
  }
  const user_id = user.id;

  try {
    // Check if the user has already liked this post
 const { data: existingLike } = await supabase
  .from('likes')
  .select('id', { 
    head: false, 
    count: 'exact',
    global: { headers: { Authorization: `Bearer ${token}` } }
  })
  .eq('post_id', postId)
  .eq('user_id', user_id)
  .maybeSingle();

    if (!existingLike) {
      const { error: insertError } = await supabase
      .from('likes')
      .insert({ user_id, post_id: postId }, { 
    global: { headers: { Authorization: `Bearer ${token}` } } 
  });
      if (insertError) {
        console.error("Error inserting like:", insertError);
        return NextResponse.json({ success: false, message: "Failed to like post", error: insertError.message }, { status: 500 });
      }
    }

    // Get the updated like count
    const { count: likeCount } = await supabase
      .from('likes')
      .select('id', { count: 'exact', head: true })
      .eq('post_id', postId);

    return NextResponse.json({ success: true, message: "Post liked!", likeCount }, { status: 200 });
  } catch (error) {
    console.error("Error liking post:", error);
    return NextResponse.json({ success: false, message: "Internal server error", error: error.message }, { status: 500 });
  }
}

// PUT: Like or unlike a post based on isLiked
export async function PUT(req, { params }) {
  const { id: postId } = await params;
  const { isLiked } = await req.json();
  
  // Extract token from headers
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  
  const user = await getUserFromRequest(req);


console.log("user.id from access token:", user?.id);

  if (!user) {
    return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
  }
  const user_id = user.id;


  try {
    // Check if the like already exists
    const { data: existingLike } = await supabase
     .from('likes')
  .select('id', { 
    head: false, 
    count: 'exact',
    global: { headers: { Authorization: `Bearer ${token}` } }
  })
  .eq('user_id', user_id)
  .eq('post_id', postId)
  .maybeSingle();

    if (isLiked && !existingLike) {
      // Add like if not already liked
      const {error: insertError } = await supabase
      .from('likes')
      .insert({ user_id, post_id: postId }, { 
    global: { headers: { Authorization: `Bearer ${token}` } } 
  });
      if (insertError) {
        console.error("Error inserting like:", insertError);
        return NextResponse.json({ success: false, message: "Failed to like post", error: insertError.message }, { status: 500 });
      }

    } else if (!isLiked && existingLike) {
      // Remove like if it exists
      await supabase
        .from('likes')
        .delete()
.eq('user_id', user_id)
.eq('post_id', postId)
.select('*', { global: { headers: { Authorization: `Bearer ${token}` } } })
    }

    // Get the updated like count
    const { count: likeCount } = await supabase
      .from('likes')
      .select('id', { count: 'exact', head: true })
      .eq('post_id', postId);

    return NextResponse.json({
      success: true,
      message: "Like count updated successfully",
      likeCount,
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating like count:', error);
    return NextResponse.json({ success: false, message: 'Internal server error', error: error.message }, { status: 500 });
  }
}



// GET: Get all likes for a post (no auth needed)
export async function GET(req, { params }) {
  const { id: postId } = await params;
  const { data, error } = await supabase
    .from('likes')
    .select('*')
    .eq('post_id', postId);
  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, data });
}

// DELETE: Remove a like from a post
export async function DELETE(req, { params }) {
  const { id: postId } = await params;
  const user = await getUserFromRequest(req);

  // Extract token from headers
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");


  if (!user) {
    return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
  }
  const user_id = user.id;

  try {
    const { data: deletedLike } = await supabase
      .from('likes')
  .delete()
  .eq('post_id', postId)
  .eq('user_id', user_id)
  .select('*', { global: { headers: { Authorization: `Bearer ${token}` } } })
  .maybeSingle();

    if (!deletedLike) {
      return NextResponse.json({ success: false, message: "Like not found" }, { status: 404 });
    }

    // Get the updated like count
    const { count: likeCount } = await supabase
      .from('likes')
      .select('id', { count: 'exact', head: true })
      .eq('post_id', postId);

    return NextResponse.json({ success: true, message: "Post unliked!", likeCount }, { status: 200 });
  } catch (error) {
    console.error("Error unliking post:", error);
    return NextResponse.json({ success: false, message: "Internal server error", error: error.message }, { status: 500 });
  }
}
