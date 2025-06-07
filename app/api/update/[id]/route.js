import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server'; // 

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; 
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role key for server-side operations
const supabase = createClient(supabaseUrl, supabaseServiceRole);

//Update: Handle PUT request to update a post
export async function PUT(req, { params }) {
    const { id: postId } = await params;
    const { image_url, caption, city, state } = await req.json();
    
    if (!postId || !image_url || !caption || !city || !state) {
        return NextResponse.json({ success: false, message: "All fields required" }, { status: 400 });
    }
    
    try {
        // Update the post
        const { data, error } = await supabase
        .from('posts')
        .update({ image_url, caption, city, state})
        .eq('id', postId)
        .select();
    
await supabase
  .from('likes')
  .delete()
  .eq('post_id', postId);

        if (error) {
        console.error("Error updating post:", error);
        return NextResponse.json({ success: false, message: "Failed to update post", error: error.message }, { status: 500 });
        }
    
        return NextResponse.json({ success: true, message: "Post updated successfully", data }, { status: 200 });
    } catch (error) {
        console.error("Error updating post:", error);
        return NextResponse.json({ success: false, message: "Internal server error", error: error.message }, { status: 500 });
    }
    }