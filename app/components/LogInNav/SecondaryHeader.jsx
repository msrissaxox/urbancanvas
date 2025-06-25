'use client';
import {React, useState, useEffect } from "react";

import WelcomeUser from './WelcomeUser';
// import { useSession } from "next-auth/react";
import LoginButton from "./LoginBtn";
import HomeBtn from "./HomeBtn";
import { supabase } from "app/lib/supabaseClient";
import Header from "./Header";  

export default function SecondaryHeader() {
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
    <nav className="flex justify-between items-center bg-gradient-to-tl from-stone-900 to-stone-600 p-6">
   
<Header />

            <div className="flex flex-col items-center lg:flex-row lg:space-x-4 ">

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