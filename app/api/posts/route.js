//posts routes
//Common HTTP methods here are:

//GET: To fetch details of a single post. DONE
//PUT: To update an existing post. DONE
//DELETE: To delete a specific post.


// import pool from '@lib/databaseConnection/db'; // Adjust the path if needed
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server'; // 

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; 
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
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
//     return new Response(
//       JSON.stringify({
//         success: true,
//         data: posts,
//       }),
//       {
//         status: 200,
//         headers: { "Content-Type": "application/json" },
//       }
//     );
//   } catch (error) {
//     console.error("Supabase error fetching posts:", error);
//     return new Response(
//       JSON.stringify({
//         success: false,
//         message: error.message
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
//updated to use supabase client
const { data: userResult, error: userError } = await supabase
    .from('users') //selecting from users table
    .select('id') //selecting id column
    .eq('id', user_id) //where oauth_id matches the provided oauth_id
    .maybeSingle(); // Expecting a single user


    //   `SELECT id FROM users WHERE oauth_id = $1`,
    //   [oauth_id]
    // );

if(userError){
    console.error("Supabase error fetching user by oauth_id:", userError.message);
    return NextResponse.json(
      { success: false, message: userError.message || "Failed to find user for post creation due to database error." },
            { status: 500 }
    );
  }
// Check if user was actually found (userResult will be null if not found by .single())
    if (!userResult) {
      return NextResponse.json( // Using NextResponse.json
        { message: "User not found for the provided OAuth ID." },
        { status: 404 }
      );
    }


    //  if (!userResult) {
    //   return new Response(
    //     JSON.stringify({ message: "User not found" }),
    //     {
    //       status: 404,
    //       headers: { "Content-Type": "application/json" },
    //     }
    //   );
    // }

// const user_uuid = userResult.id;    
    //updated to use supabase client

    const {data: result, error: error } = await supabase
    .from('posts') //selecting from posts table
    .insert({
      user_id: userProfile.id, // Using the user ID from the users table
      caption,
      city,
      state,
      image_url,
      created_at: new Date().toISOString(), // Setting created_at to current time
    })
    .select() // Selecting all columns of the newly created post
    .single(); // Expecting a single post to be returned


  //     `INSERT INTO posts (user_id, caption, city, state, image_url, created_at)
  //  VALUES ($1, $2, $3, $4, $5, NOW())
  //  RETURNING *`,
  //     [user_uuid, caption, city, state, image_url]
  //   );

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


//     return new Response(
//       JSON.stringify({
//         success: true,
//         message: "Post created successfully",
//         data: newPost,
//       }),
//       {
//         status: 201,
//         headers: { "Content-Type": "application/json" },
//       }
//     );
//   } catch (error) {
//     console.error("Error creating post:", error);
//     return new Response(JSON.stringify({ message: "Internal server error" }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// }