import { supabase } from 'app/lib/supabaseClient';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server'; // Import NextResponse for consistent response handling

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Must be set in your .env
);

export async function GET() {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers();
  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
  const users = data.users.map(user => ({
    id: user.id,
    name: user.user_metadata?.name || user.email,
    email: user.email,
    image: user.user_metadata?.avatar_url || null,
  }));
  return NextResponse.json({ success: true, data: users });
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
