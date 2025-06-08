
'use client';

import LogInNav from "./components/LogInNav/LogInNav";
import MuralGrid from "../app/components/MuralGrid";
import Footer from "./components/Footer/Footer";
import CircularText from "./components/CircularText";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);


export default function Home() {
  const { data: session } = useSession();
useEffect(() => {
  if (session?.user && session?.id_token) {
        console.log("Google ID token from session:", session.id_token); // Add this

    supabase.auth.signInWithIdToken({
      provider: "google",
      token: session.id_token,
    }).then(async () => {
      // Check the Supabase Auth session
      const { data, error } = await supabase.auth.getSession();
      console.log("Supabase Auth session:", data.session);
      if (error) {
        console.error("Supabase Auth error:", error);
      }

      //Get the Supabse Auth user
      const { data: user, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error("Supabase getUser Error:", userError);
      } else {
      console.log("Supabase Auth user id:", user.user?.id);
      }
    });
  }
}, [session]);

  return (
    <div className="bg-gradient-to-tl from-stone-900 to-stone-800">
      <LogInNav />
      <CircularText
        style={{
          backgroundImage: `url('/urbanmural.png')`,
          backgroundSize: "cover",
          height: "50vh",
          paddingTop: "75px",
        }}
      />
      <MuralGrid />
      <Footer />
    </div>
  );
}

 