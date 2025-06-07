import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const subapaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, subapaseServiceRole);

//handle delete request to delete a post
export async function DELETE(req, { params }) {

    const { id: postId } = await params;
        console.log("Deleting post with id on route side:", postId);
    
    if (!postId) {
        return NextResponse.json({ success: false, message: "Post ID is required" }, { status: 400 });
    }
    
    try {
        // Delete the post
        const { data, error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
       .select()
            .maybeSingle();
                    console.log("Delete result:", data, error);

        if (error) {
        console.error("Error deleting post:", error);
        return NextResponse.json({ success: false, message: "Failed to delete post", error: error.message }, { status: 500 });
        }
    
        return NextResponse.json({ success: true, message: "Post deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting post:", error);
        return NextResponse.json({ success: false, message: "Internal server error", error: error.message }, { status: 500 });
    }
    }