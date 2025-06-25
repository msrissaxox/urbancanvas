"use client";
import React, { useState, useEffect } from "react";

import Header from "./Header";
import LoginButton from "./LoginBtn";
import LogoutButton from "./LogoutBtn";
import WelcomeUser from "./WelcomeUser";
import { supabase } from "app/lib/supabaseClient";

export default function LogInNav() {

  const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);

//Function to create or update the user's profile in the public.users table
const createOrUpdateUserProfile = async (authUser) => {
  if (!authUser) {
    console.warn("creatreOrUpdateUserProfile called with no authenticated user ");
    return;
  }

  try {
    console.log('Attempting to create or update user profile for:', authUser.id);
  
    const {data, error } = await supabase
      .from("users")
      .upsert({
        id: authUser.id,
        email: authUser.email,
        name: authUser.user_metadata.full_name || authUser.email,
        image: authUser.user_metadata.avatar_url || null,
        "emailVerified": authUser.email_verified_at || null, // Corrected to use email_verified_at
},
{
   onConflict: 'id', // If a row with this 'id' already exists, update it instead of inserting
            ignoreDuplicates: false // Ensure existing records are updated
          }

        );
         if (error) {
        console.error('Error upserting user profile:', error.message);
        // setProfileError(error.message); // Optional: Set error state
      } else {
        console.log('User profile upserted successfully:', data);
      }
    } catch (err) {
      console.error('Unexpected error during profile upsert:', err);
      // setProfileError("An unexpected error occurred."); // Optional: Set error state
    } finally {
      // setProfileLoading(false); // Optional: Clear loading state
    }
  };
      // Fetch user on mount and on auth state change
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();

           const currentUser = data?.user || null;
      setUser(currentUser); // Update React state

      // ************* CALLING THE FUNCTION HERE *************
      if (currentUser) {
        await createOrUpdateUserProfile(currentUser);
      }
    };
  
    getUser();


    // const { data: listener } = supabase.auth.onAuthStateChange(() => {
    //   getUser();
    // });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user || null;
        setUser(currentUser); // Update React state

        // ************* CALLING THE FUNCTION HERE *************
        // If a user just signed in, create or update their profile in public.users
        if (event === 'SIGNED_IN' && currentUser) {
          await createOrUpdateUserProfile(currentUser);
        }
        // You might also handle 'SIGNED_OUT' here if needed,
        // though `setUser(null)` already handles clearing the user state.
      }
    );


   // Clean up the subscription when the component unmounts
    return () => {
      // Use the 'subscription' object that was returned from onAuthStateChange
      subscription?.unsubscribe();
    };
  }, []); // Empty dependency array means this effect runs once on mount


  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
        setUser(null);
    window.location.reload();
  };

  return (
    <nav className="flex items-center justify-between flex-wrap bg-gradient-to-tl from-stone-900 to-stone-600 p-6">
    
    <Header />

      {/* Mobile Menu Button */}
      <div className="block lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center px-3 py-2 border rounded text-white border-gray-400 hover:text-gray-300 hover:border-gray-300"
        >
          <svg
            className="fill-current h-5 w-5"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>

      {/* /* Menu Items */}
      <div
        className={`w-full lg:flex lg:items-center lg:w-auto ${isOpen ? "block" : "hidden"}`}
      >
        <div className="flex flex-col items-center lg:flex-row lg:space-x-4 w-full lg:w-auto">
{user ? (  
  <>
<WelcomeUser user={user} />
<LogoutButton onLogout={handleLogout}/>
</>
) : (
  <>
<LoginButton onLogin={handleLogin}/>
    </>
)}      
        </div>
      </div>
    </nav>
  );

}