//Form
"use client";
import React from "react";
import { useForm } from "react-hook-form";
import ContactHeader from "./ContactHeader";
import ContactPicture from "./ContactPicture";
import ContactFormTitle from "./ContactFormTitle";
import ContactForm from "./ContactForm"; // Import the ContactForm component

import Footer from "app/components/Footer/Footer";

export default function Contact() {
  return (
    <div className="bg-gradient-to-tl from-stone-900 to-stone-800 h-full">
      <ContactHeader />
      <ContactPicture />

      <div className="bg-gradient-to-tl from-stone-900 to-stone-800 h-full py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-gradient-to-tl from-stone-700 to-stone-200 shadow-md rounded-lg p-6">
          <ContactFormTitle />

          <ContactForm />
        </div>
      </div>

      <Footer />
    </div>
  );
}
