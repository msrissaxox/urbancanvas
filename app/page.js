
'use client';

import LogInNav from "./components/LogInNav/LogInNav";
import MuralGrid from "../app/components/MuralGrid";
import Footer from "./components/Footer/Footer";
import CircularText from "./components/CircularText";
import { supabase } from "app/lib/supabaseClient";
import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/next"


export default function Home( ) {
const [user, setUser] = useState(null);
const [accessToken, setAccessToken] = useState(null);

// useEffect(() => {
//   const getUserAndToken = async () => {
//     const { data: { user } } = await supabase.auth.getUser();
//     const { data: sessionData } = await supabase.auth.getSession();
//     setUser(user || null);
//     setAccessToken(sessionData?.session?.access_token || null);
//   };
//   getUserAndToken();
//   const { data: listener } = supabase.auth.onAuthStateChange(() => {
//     getUserAndToken();
//   });
//   return () => {
//     listener?.subscription.unsubscribe();
//   };
// }, []);

//   useEffect(() => {
//  supabase.auth.getSession().then(({ data: sessionData, error: sessionError }) => {
//       if (sessionError) {
//         console.error("Supabase getSession error:", sessionError);
//         setUser(null);
//         return;
//       }
//       if (!sessionData.session) {
//         setUser(null);
//         return;
//       }
//       // If session exists, get the user
//       supabase.auth.getUser().then(({ data, error }) => {
//         if (error) {
//           console.error("Supabase getUser error:", error);
//           setUser(null);
//         } else {
//           setUser(data.user);
//           console.log("Supabase Auth user:", data.user);
//         }
//       });
//     });
//   }, []);
useEffect(() => {
  const getUserAndToken = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: sessionData } = await supabase.auth.getSession();
    setUser(user || null);
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

 