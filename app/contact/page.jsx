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
        reset, // Destructure reset to clear the form after submission

  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      text: "",
      linkedIn: "",
      _honey: "", // Honeypot field for spam prevention
    },
  });
//   const onSubmit = (data) => console.log(data);

  // This function will be called ONLY if React Hook Form's validation passes
  const onSubmit = async (data) => {
    console.log("Form data before sending:", data);


        // FormSubmit.co expects data in a FormData object when submitting via fetch/XHR
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }

    try {


      const response = await fetch("https://formsubmit.co/ajax/72bda65f88d7101393a2c07130d85fd4", {
  method: "POST",
  headers: {
    'Accept': 'application/json',
  },
  body: formData,
});


      if (response.ok) {
        console.log("Form submitted successfully!");
        // FormSubmit.co typically handles redirects for success
    
        alert("Thank you for your message! We will get back to you shortly.");
        reset(); // Clear the form fields after successful submission
        // If FormSubmit.co's redirect is not working, you might try a manual redirect:
      } else {
        console.error("Form submission failed:", response.statusText);
        alert("There was an error submitting your form. Please try again.");
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

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
        onSubmit={handleSubmit(onSubmit)} 
        className="space-y-6"
        // action="https://formsubmit.co/72bda65f88d7101393a2c07130d85fd4" 
        // method="POST
        >
        
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
                    maxLength: {
                      value: 50,
                      message: "First name cannot exceed 50 characters",
                    },
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
                {...register("lastName", {
                    maxLength: {
                      value: 50,
                      message: "Last name cannot exceed 50 characters",
                    },
                })}
                id="lastName"
        className="mt-1 p-2 block w-full rounded-md border-gray-300 bg-stone-100 text-stone-900 shadow-sm focus:border-stone-500 focus:ring-stone-500 sm:text-sm h-7"
              />
    {errors.lastName && (
                  <span className="text-red-500 text-sm">
                    {errors.lastName.message}
                  </span>
    )}
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
                {...register("email", 
                  { required: "Email is required",
                    pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: "Invalid email address",
                    },
                   })}
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
                name="text"
                {...register("text", {
                  required: "Please enter your message",
                  minLength: {
                    value: 20,
                    message: "Message must be at least 20 characters long",
                  },
                  maxLength: {
                      value: 1000,
                      message: "Message cannot exceed 1000 characters",
                    },
                })}
                id="message"
                placeholder="Your message here"
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
                {...register("linkedIn", {
                      pattern: {
                      value: /^(ftp|http|https):\/\/[^ "]+$/,
                      message: "Invalid URL format",
                    },

                })}
                id="linkedin"
                className="mt-1 block w-full p-2 rounded-md border-gray-300 bg-stone-100 text-stone-900 shadow-sm focus:border-stone-500 focus:ring-stone-500 sm:text-sm h-7"
              />
               {errors.linkedIn && (
                  <span className="text-red-500 text-sm">
                    {errors.linkedIn.message}
                  </span>
                )}

            </label>
          </div>

              <div>
               {/* Honeypot field for spam prevention - DO NOT REMOVE */}

               <input
                type="text"
                name="_honey" // Correct name for FormSubmit.co
                {...register("_honey")} // Register the honeypot field
                className="hidden" // Keep it hidden from users
                tabIndex="-1" // Prevent focus
                autoComplete="off" // Prevent browser autofill
              /> 


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
