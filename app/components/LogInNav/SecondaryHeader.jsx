'use client';
import {React, useState, useEffect } from "react";
import { supabase } from "app/lib/supabaseClient";
import Header from "./Header";  

export default function SecondaryHeader() {
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
    </nav>
  );
}