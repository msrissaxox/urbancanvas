//about page for the Urban Mural app
import React from "react";
import AboutText from "./AboutText";
import AboutPicture from "./AboutPicture";
import AboutHeader from "./AboutHeader";

import Footer from "app/components/Footer/Footer";
export default function About() {
  return (
    <div className="bg-gradient-to-tl from-stone-900 to-stone-800 h-full">
      <AboutHeader />
      <AboutPicture />
      <AboutText />
      <Footer />
    </div>
  );
}
