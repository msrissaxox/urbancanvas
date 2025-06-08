import { supabase } from 'app/lib/supabaseClient';
import { NextResponse } from 'next/server';

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// function getSupabaseWithAuthToken(req) {
//   const authHeader = req.headers.get("authorization");
//   const accessToken = authHeader?.split(" ")[1];
//   return createClient(supabaseUrl, supabaseAnonKey, {
//     global: { headers: { Authorization: `Bearer ${accessToken}` } }
//   });
// }
// Helper to get the user from the JWT in the request
async function getUserFromRequest(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null;
  const token = authHeader.replace("Bearer ", "");
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user;
}

//handle delete request to delete a post
export async function DELETE(req, { params }) {

    const { id: postId } = await params;
      // const supabase = getSupabaseWithAuthToken(req);
  if (!postId) {
    return NextResponse.json({ success: false, message: "Post ID is required" }, { status: 400 });
  }
        // console.log("Deleting post with id on route side:", postId);
    
    // if (!postId) {
    //     return NextResponse.json({ success: false, message: "Post ID is required" }, { status: 400 });
    // }
    
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
  }

    try {
        // Delete the post

        const { data: post, error: postError } = await supabase

        .from('posts')
       .select('user_id')
        .eq('id', postId)       
            .maybeSingle();

     if (postError) {
      console.error("Error fetching post:", fetchError);
      return NextResponse.json({ success: false, message: "Failed to fetch post", error: postError.message }, { status: 500 });
    }

    if (!post) {
      return NextResponse.json({ success: false, message: "Post not found" }, { status: 404 });
    }

    if (post.user_id !== user.id) {
      return NextResponse.json({ success: false, message: "Not authorized to delete this post" }, { status: 403 });
    }
 // Now delete the post
    const { error: deleteError } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    if (deleteError) {
      console.error("Error deleting post:", deleteError);
      return NextResponse.json({ success: false, message: "Failed to delete post", error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Post deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json({ success: false, message: "Internal server error", error: error.message }, { status: 500 });
  }
}