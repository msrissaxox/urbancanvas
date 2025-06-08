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


      // Fetch user on mount and on auth state change
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    };
    getUser();
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      getUser();
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);


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