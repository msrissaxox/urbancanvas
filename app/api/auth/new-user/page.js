"use client";
import { useState } from "react";

export default function NewUserPage() {
  const [username, setUsername] = useState("");
  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/users/update-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, image }),
    });
    const data = await res.json();
    if (data.success) {
      setMessage("Profile updated! You can now use the app.");
      window.location.href = "/"; // Redirect to home or dashboard
    } else {
      setMessage(data.message || "Error updating profile.");
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-2xl mb-4">Set up your profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <input
          type="text"
          placeholder="Choose a username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          className="p-2 border rounded"
        />
        <input
          type="url"
          placeholder="Profile image URL"
          value={image}
          onChange={e => setImage(e.target.value)}
          className="p-2 border rounded"
        />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          Save
        </button>
      </form>
      {message && <p className="mt-4 text-red-500">{message}</p>}
    </div>
  );
}