'use client';
import {React, useState, useEffect } from "react";

import WelcomeUser from './WelcomeUser';
// import { useSession } from "next-auth/react";
import LoginButton from "./LoginBtn";
import HomeBtn from "./HomeBtn";
import Link from "next/link";
import { supabase } from "app/lib/supabaseClient";

export default function Header() {
      // const { data: session } = useSession(); //This gets the session data from next-auth
  const [user, setUser] = useState(null);


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
  return (
    <nav className="flex items-center justify-between bg-gradient-to-tl from-stone-900 to-stone-600 p-6">
        <div className="flex items-center flex-shrink-0 text-gray-300 mr-6">
            <span className="font-semibold text-2xl md:text-3xl tracking-tight">
                <Link href="/" className="text-white hover:text-gray-300 transition-colors duration-300">
                <span className="alumniSansPinstripe">
                    Urban Mural - Street Art, Socially Mapped
                    </span>
                    </Link>
            </span>
        </div>
            <div className="flex flex-col items-center lg:flex-row lg:space-x-4 w-full lg:w-auto">

    {user ? (  
      <>

    <WelcomeUser user={user}/>
    <HomeBtn />
    </>
    ) : (

    <LoginButton />
    )}
    </div>
    </nav>
  );
}