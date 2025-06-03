import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server'; // Import NextResponse for consistent response handling


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; 
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Get all users
export async function GET() {
  try {
    console.log("Fetching users...");

    const { data: result, error } = await supabase
      .from('users') // selecting from users table
      .select('*') // selecting all columns

    // pool.query("SELECT * FROM users");
   
if(error) {
      console.error("Supabase error fetching users:", error.message);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }
    console.log("Users result (data):", result);

    return NextResponse.json(
      {
        success: true,
        message: "Users retrieved successfully",
        data: result,
      },
      { status: 200, 
        headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch users",
        error: error.message,
      },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}




//     return new Response(
//       JSON.stringify({
//         success: true,
//         message: "Users retrieved successfully",
//         data: result.rows,
//       }),
//       {
//         status: 200,
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );
//   } catch (error) {
//     console.error("Database connection error:", error);
//     return new Response(
//       JSON.stringify({
//         success: false,
//         message: "Database connection failed!",
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

// Create new user
//Do i have a double check for the user already exists?

export async function POST(request) {
  try {
    const body = await request.json();
        console.log("POST /api/users body received:", body);

    // const { username, email, oauth_provider, oauth_id, profile_picture } = body;
    const { id, name, email, oauth_provider, oauth_id, image } = body; // Adjusted to match your DB schema
    // Note: my DB schema has 'name', 'email', 'image', 'oauth_provider', 'oauth_id', 'emailverified', 'created_at'

    // Check to see if a user already exists with this oAuth ID
    if (!id || !name || !email) {
      return NextResponse.json(
        { success: false, message: "User ID, name, and email are required to create a profile." },
        { status: 400 }
      );
    }
//updated to use supabase client
    const { data: existingUser, error: error } = await supabase
      .from('users')
      .select('id')
      .eq('oauth_provider', oauth_provider)
      .eq('id', id)
      .maybeSingle();

    //   `SELECT id FROM users WHERE oauth_provider = $1 AND oauth_id = $2`,
    //   [oauth_provider, oauth_id]
    // );

if (error) {
      console.error("Supabase error checking existing user:", error.message);
      return new Response(
        JSON.stringify({
          success: false,
          message: "Error checking existing user",
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
    // If a user already exists, return an error
if (existingUser) {
      console.log("User already exists with this OAuth ID. Returning existing user data.");
      return NextResponse.json(
        {
          success: true, // It's a success that we found them
          message: "User already exists",
          data: existingUser // Return the existing user's ID
        },
        { status: 200 } // Use 200 OK since the user already exists, not an error
      );
    }

    // if (existingUser.rows.length > 0) {
    //   return new Response(
    //     JSON.stringify({
    //       success: false,
    //       message: "User already exists",
    //     }),
    //     {
    //       status: 400,
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   );
    // }
//updated to use supabase client


    // Create a new user
        console.log("Creating new user...");

    const { data: newUser, insertError } = await supabase
      .from('users')
      .insert([
        {
          id,
          name,
          email,
          oauth_provider,
          oauth_id,
          image,
        },
      ])
      .select('*') // To return the created row
      .single();

// Handle Supabase insert error
    if (insertError) {
      console.error("Supabase error creating new user:", insertError.message);
      return NextResponse.json( // Use NextResponse.json
        { success: false, message: createNewUserError.message || "Failed to create new user." },
        { status: 500 }
      );
    }

    // Check if user was actually created and returned
    if (!newUser) {
        console.error("User creation failed: No data returned after insert.");
        return NextResponse.json(
            { success: false, message: "User creation failed: No data returned." },
            { status: 500 }
        );
    }
console.log("New user created:", newUser);
    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        data: newUser // newUser will be the object representing the new row
      },
      { status: 201 } // 201 Created
    );

  } catch (err) { // General catch for any unexpected errors outside of Supabase calls
    console.error("General error in POST /api/users:", err);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred during user creation.",
        error: err.message,
      },
      { status: 500 }
    );
  }
}


    //   `INSERT INTO users (username, email, oauth_provider, oauth_id, profile_picture)
    //         VALUES ($1, $2, $3, $4, $5)
    //         RETURNING id, username, email, oauth_provider, oauth_id, profile_picture, created_at`,
    //   [username, email, oauth_provider, oauth_id, profile_picture]
    // );
//     return new Response(
//       JSON.stringify({
//         success: true,
//         message: "User created successfully",
//         data: result
//       }),
//       {
//         status: 201,
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );
//   } catch (error) {
//     console.error("Error creating user:", error);

//     // Handle unique constraint violation
//     if (error.code === "23505") {
//       const field = error.detail.includes("email") ? "email" : "username";
//       return new Response(
//         JSON.stringify({
//           success: false,
//           message: `User with this ${field} already exists`,
//         }),
//         {
//           status: 400,
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//     }

//     return new Response(
//       JSON.stringify({
//         success: false,
//         message: error.message,
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






// //Do i even need this here?? Not yet...
// // Update user profile picture
// export async function PATCH(request) {
//   try {
//     const body = await request.json();
//     const { user_id, profile_picture } = body;


// //updated to use supabase client
//     const result = await supabase
//       .from('users')
//       .update({ profile_picture })
//       .eq('id', user_id)
//       .select('*')
//       .single();

//     //   `UPDATE users 
//     //          SET profile_picture = $1
//     //          WHERE id = $2 
//     //          RETURNING *`,
//     //   [profile_picture, user_id]
//     // );

//     if (result.rows.length === 0) {
//       return new Response(
//         JSON.stringify({
//           success: false,
//           error: "User not found",
//         }),
//         {
//           status: 404,
//           headers: { "Content-Type": "application/json" },
//         }
//       );
//     }

//     return new Response(
//       JSON.stringify({
//         success: true,
//         data: result.rows[0],
//       }),
//       {
//         status: 200,
//         headers: { "Content-Type": "application/json" },
//       }
//     );
//   } catch (error) {
//     console.error("Error updating user:", error);
//     return new Response(
//       JSON.stringify({
//         success: false,
//         error: error.message,
//       }),
//       {
//         status: 500,
//         headers: { "Content-Type": "application/json" },
//       }
//     );
//   }
// }

//     return NextResponse.json( // Use NextResponse.json
//       {
//         success: true,
//         message: "User created successfully",
//         data: newUser // 'newUser' is the created object, not an array
//       },
//       { status: 201 }
//     );
//   } catch (error) { // General catch for unexpected runtime errors
//     console.error("General error creating user:", error);

//     // Handle unique constraint violation (this logic is still good for Supabase errors too)
//     if (error.code === "23505") { // This 'error' here would be the Supabase 'error' object from the catch, not the 'createNewUserError'
//       // You'd need to re-check if 'error.detail' exists or if it's the specific
//       // Supabase error object. A general catch might not always have 'code'/'detail'.
//       // Better to handle 23505 with the specific 'createNewUserError' check above.
//       // For a general catch, a simpler message might be better.
//       const field = error.detail && error.detail.includes("email") ? "email" : "username/oauth_id";
//       return NextResponse.json(
//         { success: false, message: `User with this ${field} already exists (Constraint Error)` },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json(
//       {
//         success: false,
//         message: error.message, // Include error.message for better debugging
//       },
//       { status: 500 }
//     );
//   }
// }

// Update user profile picture
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { user_id, profile_picture } = body;

    // Basic validation
    if (!user_id || !profile_picture === undefined) { // Check if profile_picture is explicitly provided (can be null/empty string)
        return NextResponse.json(
            { success: false, message: "User ID and profile picture are required." },
            { status: 400 }
        );
    }

    // Updated to use supabase client
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({ image: profile_picture }) // Assuming 'profile_picture' maps to 'image' in DB
      .eq('id', user_id)
      .select('*') // To return the updated row
      .single(); // Expecting a single updated record

    // Handle Supabase update error
    if (updateError) {
        console.error("Supabase error updating user:", updateError.message);
        return NextResponse.json(
            { success: false, message: updateError.message || "Failed to update user profile picture." },
            { status: 500 }
        );
    }

    // If .single() found no row to update, updatedUser will be null
    if (!updatedUser) { // Correctly check if a user was found and updated
      return NextResponse.json(
        { success: false, error: "User not found or no update occurred" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: updatedUser, // 'updatedUser' is the updated object, not an array
      },
      { status: 200 }
    );
  } catch (error) { // General catch for unexpected runtime errors
    console.error("General error updating user:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
