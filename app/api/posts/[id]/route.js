
//This file handles the API routes for posts, including liking, unliking, and fetching posts.
//is this a duplicate file that is not needed?
//6/6/25
//5:26
import { supabase } from 'app/lib/supabaseClient'; // Use your shared client
import { NextResponse } from 'next/server';
import { get } from 'react-hook-form';

// Helper to get the user from the JWT in the request
async function getUserFromRequest(req) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return null;
  const token = authHeader.replace('Bearer ', '');
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user;
}
// POST: Add a like to a post
export async function POST(req, { params }) {
  const { id: postId } = params;
  const user = await getUserFromRequest(req);

  if (!user) {
    return NextResponse.json({ success: false, message: "User not authenticated" }, { status: 400 });
  }
  const userId = user.id;
  
  try {
    // Check if the user has already liked this post
    const { data: existingLike } = await supabase
      .from('likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .maybeSingle();

    if (!existingLike) {
      const { error: insertError } = await supabase
      .from('likes')
      .insert({ user_id: userId, post_id: postId });
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
export async function PUT(req, context) {
  const { id: postId } = context.params;
  const user = await getUserFromRequest(req);

  if (!user) {
    return NextResponse.json({ success: false, message: "User not authenticated" }, { status: 400 });
  }
  const userId = user.id;
  const { isLiked } = await req.json();

  try {
    // Check if the like already exists
    const { data: existingLike } = await supabase
      .from('likes')
      .select('id')
      .eq('user_id', userId)
      .eq('post_id', postId)
      .maybeSingle();

    if (isLiked && !existingLike) {
      // Add like if not already liked
      const {error: insertError } = await supabase
      .from('likes')
      .insert({ user_id: userId, post_id: postId });
      if (insertError) {
        console.error("Error inserting like:", insertError);
        return NextResponse.json({ success: false, message: "Failed to like post", error: insertError.message }, { status: 500 });
      }

    } else if (!isLiked && existingLike) {
      // Remove like if it exists
      await supabase
        .from('likes')
        .delete()
        .eq('user_id', userId)
        .eq('post_id', postId);
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

// GET: Fetch a single post by ID
export async function GET(request, { params }) {
  const { id: postId } = await params;

  try {
    const { data: post, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', postId)
      .maybeSingle();

    if (error || !post) {
      return NextResponse.json({ success: false, message: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: post }, { status: 200 });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json({ success: false, message: "Internal server error", error: error.message }, { status: 500 });
  }
}

// DELETE: Remove a like from a post
export async function DELETE(req, { params }) {
  const { id: postId } = params;
  const user = await getUserFromRequest(req);
  
  if (!user) {
    return NextResponse.json({ success: false, message: "User ID is required" }, { status: 401 });
  }
  const userId = user.id;

  try {
    const { data: deletedLike } = await supabase
      .from('likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId)
      .select()
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