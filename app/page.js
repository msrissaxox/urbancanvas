
'use client';

import LogInNav from "./components/LogInNav/LogInNav";
import MuralGrid from "../app/components/MuralGrid";
import Footer from "./components/Footer/Footer";
import CircularText from "./components/CircularText";
import { supabase } from "app/lib/supabaseClient";
import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/next"


export default function Home( ) {
const [user, setUser] = useState(undefined);
const [accessToken, setAccessToken] = useState(undefined);

useEffect(() => {
  const getUserAndToken = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: sessionData } = await supabase.auth.getSession();
    setUser(user);
    setAccessToken(sessionData?.session?.access_token || null);
  };
  getUserAndToken();

  const { data: listener } = supabase.auth.onAuthStateChange(() => {
    getUserAndToken();
  });

  return () => {
    listener?.subscription.unsubscribe();
  };
}, []);


  // Wait for user to be loaded (undefined means loading)
  if (user === undefined) {
    return <div className="text-stone-100 text-center text-2xl">Loading...</div>;
  }

  
  return (
    <div className="bg-gradient-to-tl from-stone-900 to-stone-800">
      <LogInNav user={user} />
      <CircularText
        style={{
          backgroundImage: `url('/urbanmural.png')`,
          backgroundSize: "cover",
          height: "50vh",
          paddingTop: "75px",
        }}
      />
      <MuralGrid accessToken={ accessToken } user={user}/>
      <Footer />
            <Analytics />
    </div>
  );
}

 