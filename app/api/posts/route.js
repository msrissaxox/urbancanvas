//posts routes
//Common HTTP methods here are:
//6/6/25: 5:22
//GET: To fetch details of a single post. DONE
//POST: To create a new post. DONE


// import pool from '@lib/databaseConnection/db'; // Adjust the path if needed
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server'; // 

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; 
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role key for server-side operations
const supabase = createClient(supabaseUrl, supabaseServiceRole);
// Handle PUT request to update the like count and isLiked state

//updated to use supabase client
export async function GET() {
  try {
    console.log("Fetching posts...");
    const { data: posts, error } = await supabase
    .from ('posts') //selecting from posts table
    .select('*') //selecting all columns
    .order('created_at', { ascending: false }); // Ordering by created_at in descending order

    //Error handling
    if (error) {
      console.error("Supabase error fetching posts:", error.message);
      return NextResponse.json( // Using NextResponse.json for consistency
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    // "SELECT * FROM posts ORDER BY created_at DESC"
    console.log("Query result (posts data):", posts)

    return NextResponse.json(
      {
         success: true, 
        data: posts 
      },
      { 
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Internal server error" 
      },
      { 
        status: 500, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  }
}


//this is the POST method to create a new post
// It expects a JSON body with user_id, caption, city, state, and image_url.
// It validates the input, checks if the user exists, and then inserts a new post into the database.
// If successful, it returns the created post data; otherwise, it returns an error message.
export async function POST(req) {
  try {
    const body = await req.json();
    console.log("POST /api/posts body:", body); 

    const { user_id, caption, city, state, image_url } = body;

    // Validate required fields
    if (!user_id || !caption || !city || !state || !image_url) {
     return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

        console.log("user_id from frontend:", user_id);


//updated to use supabase client
const { data: userResult, error: userError } = await supabase

// console.log("user_id from frontend:", user_id); 
  .schema('next_auth')
    .from('users') //selecting from users table
    .select('id') //selecting id column
    .eq('id', user_id) //where oauth_id matches the provided oauth_id
    .maybeSingle(); // Expecting a single user


if(userError){
    console.error("Supabase error fetching user by id:", userError.message);
    return NextResponse.json(
      { success: false, message: userError.message || "Failed to find user for post creation due to database error." },
            { status: 500 }
    );
  }
// Check if user was actually found (userResult will be null if not found by .single())
    if (!userResult) {
      return NextResponse.json( // Using NextResponse.json
        { message: "User not found for the provided user_id." },
        { status: 404 }
      );
    }


    const {data: insertedPost, error: postError } = await supabase
    .from('posts') //selecting from posts table
    .insert({
      user_id: userResult.id, // Using the user ID from the users table
      caption,
      city,
      state,
      image_url,
      created_at: new Date().toISOString(), // Setting created_at to current time
    })
    .select() // Selecting all columns of the newly created post
    .single(); // Expecting a single post to be returned


if (postError) {
        console.error("Supabase error creating post:", postError.message);
        return NextResponse.json( // Using NextResponse.json
            { success: false, message: postError.message || "Failed to create post due to database error." },
            { status: 500 }
        );
    }

    // Check if post was actually created and returned (insertedPost will be null if not)
    if (!insertedPost) {
        console.error("Post creation failed: No data returned after insert.");
        return NextResponse.json( // Using NextResponse.json
            { success: false, message: "Post creation failed: No data returned after insert." },
            { status: 500 }
        );
    }

    return NextResponse.json( // Using NextResponse.json
      {
        success: true,
        message: "Post created successfully",
        data: insertedPost, // Correct: Use the variable holding the inserted data
      },
      {
        status: 201
      }
    );
  } catch (error) { // General catch for unexpected runtime errors
    console.error("General error creating post:", error);
    return NextResponse.json({ message: "Internal server error: " + error.message }, {
      status: 500
    });
  }
}
