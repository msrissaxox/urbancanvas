//Form
"use client";
import React from "react";
import { useForm } from "react-hook-form";
import SecondaryHeader from "app/components/LogInNav/SecondaryHeader";
import Footer from "app/components/Footer/Footer";

export default function Contact() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      text: "",
      linkedIn: "",
      honeypot: "", // Honeypot field for spam prevention
    },
  });
//   const onSubmit = (data) => console.log(data);

  return (
            <div className="bg-gradient-to-tl from-stone-900 to-stone-800 h-full">
    <SecondaryHeader />
    <h1 className="text-6xl alumniSansPinstripe font-bold text-stone-100 text-center p-10">Contact Urban Mural</h1>
    <img src="/orlandoMural.jpg" alt="Mural contact page"
  className="mx-auto mt-4 mb-8 w-11/12 sm:w-4/5 md:w-2/3 lg:w-1/2 h-auto rounded-lg ring-2 ring-white/30 shadow-[0_0_20px_rgba(255,255,255,0.1)]"></img>


    <div className="bg-gradient-to-tl from-stone-900 to-stone-800 h-full py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-gradient-to-tl from-stone-700 to-stone-200 shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Let's Connect
        </h2>
        <form 
        // onSubmit={handleSubmit(onSubmit)} 
        className="space-y-6"
        action="https://formsubmit.co/72bda65f88d7101393a2c07130d85fd4" 
        method="POST">
        
          <div className="form-group">
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 form-control"
            
            >
                
              First Name:
              <input
                type="text"
                placeholder="First Name"
                name="firstName"
                {...register("firstName", {
                  required: "First name is required",
                })}
                id="firstName"
        className="mt-1 p-2 block w-full rounded-md border-gray-300 bg-stone-100 text-stone-900 shadow-sm focus:border-stone-500 focus:ring-stone-500 sm:text-sm h-7"
              />
              {errors.firstName && (
                <span className="text-red-500 text-sm">
                  {errors.firstName.message}
                </span>
              )}
            </label>
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700"
            >
              Last Name:
              <input
                type="text"
                placeholder="Last Name"
                name="lastName"
                {...register("lastName")}
                id="lastName"
        className="mt-1 p-2 block w-full rounded-md border-gray-300 bg-stone-100 text-stone-900 shadow-sm focus:border-stone-500 focus:ring-stone-500 sm:text-sm h-7"
              />
            </label>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email:
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                {...register("email", { required: "Email is required" })}
                id="email"
        className="mt-1 p-2 block w-full rounded-md border-gray-300 bg-stone-100 text-stone-900 shadow-sm focus:border-stone-500 focus:ring-stone-500 sm:text-sm h-7"
              />
              {errors.email && (
                <span className="text-red-500 text-sm">
                  {errors.email.message}
                </span>
              )}
            </label>
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700"
            >
              Message:
              <textarea
                      className="mt-1 p-2 block w-full rounded-md border-gray-300 bg-stone-100 text-stone-900 shadow-sm focus:border-stone-500 focus:ring-stone-500 sm:text-sm"

                {...register("text", {
                  required: "Please enter your message",
                  minLength: {
                    value: 20,
                    message: "Message must be at least 20 characters long",
                  },
                })}
                id="message"
                placeholder="Your message here"
                name="message"
                rows={4}
            

              />
              {errors.text && (
                <span className="text-red-500 text-sm">
                  {errors.text.message}
                </span>
              )}
            </label>
          </div>

          <div>
            <label
              htmlFor="linkedin"
              className="block text-sm font-medium text-gray-700"
            >
              LinkedIn:
              <input
                type="url"
                placeholder="https://www.linkedin.com/in/yourprofile"
                name="linkedIn"
                {...register("linkedIn")}
                id="linkedin"
        className="mt-1 block w-full p-2 rounded-md border-gray-300 bg-stone-100 text-stone-900 shadow-sm focus:border-stone-500 focus:ring-stone-500 sm:text-sm h-7"
              />
            </label>
          </div>

              <div>
                <input 
                type="text" 
                placeholder=""
                autoComplete="off"
                {...register("honeypot")}
                name="honeypot" className="hidden" />


              </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-stone-600 hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
    <Footer />
    </div>
  );
}
