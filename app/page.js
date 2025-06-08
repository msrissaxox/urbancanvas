
'use client';

import LogInNav from "./components/LogInNav/LogInNav";
import MuralGrid from "../app/components/MuralGrid";
import Footer from "./components/Footer/Footer";
import CircularText from "./components/CircularText";
import { supabase } from "app/lib/supabaseClient";
import { useEffect, useState } from "react";


export default function Home() {
const [user, setUser] = useState(null);

  useEffect(() => {
 supabase.auth.getSession().then(({ data: sessionData, error: sessionError }) => {
      if (sessionError) {
        console.error("Supabase getSession error:", sessionError);
        setUser(null);
        return;
      }
      if (!sessionData.session) {
        setUser(null);
        return;
      }
      // If session exists, get the user
      supabase.auth.getUser().then(({ data, error }) => {
        if (error) {
          console.error("Supabase getUser error:", error);
          setUser(null);
        } else {
          setUser(data.user);
          console.log("Supabase Auth user:", data.user);
        }
      });
    });
  }, []);

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
      <MuralGrid />
      <Footer />
    </div>
  );
}

 