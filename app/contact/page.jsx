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
    },
  });
  const onSubmit = (data) => console.log(data);

  return (
    <div>
    <SecondaryHeader />
    <h1 className="text-6xl alumniSansPinstripe font-bold text-stone-100 text-center">Contact Urban Mural</h1>

    <div className="bg-gradient-to-tl from-stone-900 to-stone-800 h-full py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-stone-100 shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Let's Connect
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700"
            >
              First Name:
              <input
                type="text"
                {...register("firstName", {
                  required: "First name is required",
                })}
                id="firstName"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-stone-500 focus:ring-stone-500 sm:text-sm h-7"
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
                {...register("lastName")}
                id="lastName"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-stone-500 focus:ring-stone-500 sm:text-sm h-7"
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
                {...register("email", { required: "Email is required" })}
                id="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-stone-500 focus:ring-stone-500 sm:text-sm h-7"
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
                {...register("text", {
                  required: "Please enter your message",
                  minLength: {
                    value: 20,
                    message: "Message must be at least 20 characters long",
                  },
                })}
                id="message"
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-stone-500 focus:ring-stone-500 sm:text-sm"
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
                {...register("linkedIn")}
                id="linkedin"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-stone-500 focus:ring-stone-500 sm:text-sm h-7"
              />
            </label>
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
