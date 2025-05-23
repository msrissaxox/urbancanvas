"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Header from "./Header";
import LoginButton from "./LoginBtn";
import LogoutButton from "./LogoutBtn";

export default function LogInNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession(); //This gets the session data from next-auth

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
{session ? (  
  <>
<LogoutButton />
</>
) : (
  <>
<LoginButton />
    </>
)}      
        </div>
      </div>
    </nav>
  );

}