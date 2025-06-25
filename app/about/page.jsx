//about page for the Urban Mural app
import React from "react";
import SecondaryHeader from "app/components/LogInNav/SecondaryHeader";
import Footer from "app/components/Footer/Footer";
export default function About() {
    return (
            <div className="bg-gradient-to-tl from-stone-900 to-stone-800 h-full">

    <SecondaryHeader />
<h1 className="text-6xl alumniSansPinstripe font-bold text-stone-100 text-center p-10">About Urban Mural</h1>
<img src="/muralAboutPage.jpg" alt="Rio de Janeiro mural" 
  className="mx-auto mt-4 mb-8 w-11/12 sm:w-4/5 md:w-2/3 lg:w-1/2 h-auto rounded-lg ring-2 ring-white/30 shadow-[0_0_20px_rgba(255,255,255,0.1)]"></img>
     <div className="flex justify-center items-center mx-10 p-10">
      <p className=" text-stone-100 text-2xl alumniSansPinstripe">Thank you so much for visiting. This app is a product of my love for the city of Orlando, and the art that I've encountered here at home, and on my travels. i wanted to create a space where
people could share their love for the street art that they come across. I hope you enjoy using this app as much as I enjoyed creating it.
    <br/>
    In the future, I  plan to add more features to this app, such as a map view of the murals, a search function, and a way to filter murals by location. 
    I want to make this app a comprehensive resource for street art lovers everywhere.
    <br />
    If you have any suggestions for features that you would like to see added, please let me know through my contact form. I am always looking for ways to improve this app and make it more useful for everyone.
        <br />
   <b> Technical specs, in case you were interested: </b>
    This app is built with Next.js, React, and Tailwind CSS. It uses the NextAuth library for authentication. The app is hosted on Vercel.
<br />
Feel free to check out my other work: <b><a href="https://www.marissalamothe.dev" target="_blank" className="text-stone-100 hover:underline">www.marissalamothe.dev</a></b>
    </p>
          </div>
          <Footer />
            </div>
    )
};