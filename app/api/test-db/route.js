//test-db route
import pool from "../../../src/app/databaseConnection/db";

export async function GET(req) {
  try {
    // Test query: Check if we can retrieve the current time
    const result = await pool.query("SELECT NOW() AS current_time");

    return new Response(
      JSON.stringify({
        success: true,
        message: "Database connection successful!",
        data: result.rows[0],
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("Database connection error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Database connection failed!",
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}
