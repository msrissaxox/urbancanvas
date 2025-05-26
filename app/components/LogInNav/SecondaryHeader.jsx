'use client';
import React from "react";

import WelcomeUser from './WelcomeUser';
import { useSession } from "next-auth/react";
import LoginButton from "./LoginBtn";
import HomeBtn from "./HomeBtn";
export default function Header() {
      const { data: session } = useSession(); //This gets the session data from next-auth

  return (
    <div className="flex items-center flex-shrink-0 text-gray-300 mr-6">
      <span className="font-semibold text-2xl md:text-3xl tracking-tight">
        <span className="alumniSansPinstripe">Urban Mural - Street Art, Socially Mapped</span>
            <div className="flex flex-col items-center lg:flex-row lg:space-x-4 w-full lg:w-auto">
    {session ? (  
      <>
    <WelcomeUser />
    <HomeBtn />
    </>
    ) : (
      <>
    <LoginButton />
        </>
    )}      
            </div>
        </span>
    </div>
  );
}