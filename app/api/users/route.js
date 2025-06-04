import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server'; // Import NextResponse for consistent response handling


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; 
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Get all users
export async function GET() {
  try {
    console.log("Fetching users from NextAuth.js 'users' table...");

    const { data: users, error } = await supabase
     .schema('next_auth')//added
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
    console.log("Users result (data):", users);

    return NextResponse.json(
      {
        success: true,
        message: "Users retrieved successfully",
        data: users,
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
         .schema('next_auth')//added

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
