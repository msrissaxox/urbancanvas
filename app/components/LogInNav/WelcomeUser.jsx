// import { useSession } from "next-auth/react";

export default function WelcomeUser( { user}) {
 if (!user) return null;  // const userName = session.user.name || "User";
  //API call to get the user info

const userName = user.user_metadata?.full_name || user.email || "User";
  const firstName = userName.split(" ")[0];

  return (
    <div>
     
          <h2 className="alumniSansPinstripe text-stone-100 text-sm md:text-3xl">
            Welcome, {firstName ? `${firstName}` : 'Guest! Please log in.'}
          </h2>
    </div>
  );
}
// This component conditionally renders a welcome message based on the user's session status.
