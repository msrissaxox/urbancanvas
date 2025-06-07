// // import pool from "@lib/databaseConnection/db";
// //This file handles the API routes for likes in a Next.js application using Supabase as the backend.
// //It gets ALL likes from the database. No specific post ID is required for this endpoint.
// //6/6 duplicate?

// import { createClient } from '@supabase/supabase-js';
// import { NextResponse } from 'next/server'; // Import NextResponse for consistent response handling

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; 
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// const supabase = createClient(supabaseUrl, supabaseKey);

// export async function GET() {
//   try {
//     console.log("Fetching likes...");
// //updated to supabase client

//     const {data: result, error} = await supabase
//       .from('likes') // selecting from likes table
//       .select('*') // selecting all columns
//       // .order('created_at', { ascending: false }); // Ordering by created_at in descending order
//     // pool.query("SELECT * FROM likes");

//     if (error) {
//       console.error("Supabase error fetching likes:", error.message);
//       return NextResponse.json(
//         { success: false, message: error.message },
//         { status: 500 }
//       );
//     }
//     console.log("Likes result:", result);

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Likes fetched successfully",
//         data: result,
//       },
//       { status: 200, headers: { "Content-Type": "application/json" } }
//     );
//   } catch (error) {
//     console.error("Error fetching likes:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Failed to fetch likes",
//         error: error.message,
//       },
//       { status: 500, headers: { "Content-Type": "application/json" } }
//     );
//   }
// }

// //     return new Response(
// //       JSON.stringify({
// //         success: true,
// //         message: "Likes fetched successfully",
// //         data: result.rows,
// //       }),
// //       { status: 200, headers: { "Content-Type": "application/json" } }
// //     );
// //   } catch (error) {
// //     console.error("Error fetching likes:", error);
// //     return new Response(
// //       JSON.stringify({
// //         success: false,
// //         message: "Failed to fetch likes",
// //         error: error.message,
// //       }),
// //       { status: 500, headers: { "Content-Type": "application/json" } }
// //     );
// //   }
// // }


// // POST /api/likes
// export async function POST(request) {
//   try {
//     const { user_id, post_id } = await request.json();

//         if (!user_id || !post_id) {
//         return NextResponse.json(
//             { success: false, message: "User ID and Post ID are required." },
//             { status: 400 }
//         );
//     }
//     // Check if the user has already liked the post


//     const { data: existingLike, error: error } = await supabase
//       .from('likes')
//       .select('id')
//       .eq('user_id', user_id)
//       .eq('post_id', post_id)
//       .single();
//     //   `SELECT id FROM likes WHERE user_id = $1 AND post_id = $2`,
//     //   [user_id, post_id]
//     // );

// // Handle Supabase error during check
//     if (error && error.code !== 'PGRST116') { // PGRST116 means "no rows found" - not an error here
//         console.error("Supabase error checking existing like:", error.message);
//         return NextResponse.json(
//             { success: false, message: error.message || "Failed to check existing like." },
//             { status: 500 }
//         );
//     }

//  if (existingLike) { // Correctly check if a like was found
//       return NextResponse.json( // Use NextResponse.json
//         {
//           success: false,
//           message: "User has already liked this post",
//         },
//         { status: 400 }
//       );
//     }
//     // if (existingLike.rows.length > 0) {
//     //   return new Response(
//     //     JSON.stringify({
//     //       success: false,
//     //       message: "User has already liked this post",
//     //     }),
//     //     {
//     //       status: 400,
//     //       headers: { "Content-Type": "application/json" },
//     //     }
//     //   );
//     // }

//     // Add the like
// //updated to supabase client
//     const { data: result, error: insertError } = await supabase
//       .from('likes')
//       .insert([{ user_id, post_id }])
//       .select('*')
//       .single();


//     if (insertError) {
//       console.error("Supabase error inserting like:", insertError.message);
//       return NextResponse.json(
//         { success: false, message: insertError.message || "Failed to like post." },
//         { status: 500 }
//       );
//     }

// // Check if insertion actually returned data
//     if (!result) {
//         console.error("Like insertion failed: No data returned.");
//         return NextResponse.json(
//             { success: false, message: "Like insertion failed: No data returned." },
//             { status: 500 }
//         );
//     }

//     return NextResponse.json( // Use NextResponse.json
//       {
//         success: true,
//         message: "Post liked successfully",
//         data: result, // 'newLike' is the inserted object, not an array
//       },
//       { status: 201 }
//     );
//   } catch (error) { // Catch for general runtime errors
//     console.error("General error liking post:", error);
//     return NextResponse.json( // Use NextResponse.json
//       {
//         success: false,
//         message: "Failed to like post",
//         error: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }



// // DELETE /api/likes
// export async function DELETE(request) {
//   try {
//     const { user_id, post_id } = await request.json();

//     if (!user_id || !post_id) {
//         return NextResponse.json(
//             { success: false, message: "User ID and Post ID are required for deletion." },
//             { status: 400 }
//         );
//     }

//     const {data: result, error: deleteError } = await supabase
//       .from('likes')
//       .delete()
//       .eq('user_id', user_id)
//       .eq('post_id', post_id)
//       .select('*')
//       .single();


// // Handle Supabase error during deletion
//     if (deleteError) {
//       console.error("Supabase error deleting like:", deleteError.message);
//       return NextResponse.json(
//         { success: false, message: deleteError.message || "Failed to remove like." },
//         { status: 500 }
//       );
//     }

//     if(!result) {
//         console.error("Like deletion failed: No data returned.");
//         return NextResponse.json(
//             { success: false, message: "Like deletion failed: No data returned." },
//             { status: 404 }
//         );
//     }
// return NextResponse.json( // Use NextResponse.json
//       {
//         success: true,
//         message: "Like removed successfully",
//         data: result, //
//       },
//       { status: 200 }
//     );
//   } catch (error) { // Catch for general runtime errors
//     console.error("General error removing like:", error);
//     return NextResponse.json( // Use NextResponse.json
//       {
//         success: false,
//         message: "Failed to remove like",
//         error: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }
