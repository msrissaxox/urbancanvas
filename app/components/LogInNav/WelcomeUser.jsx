import { useSession } from "next-auth/react";

export default function WelcomeUser() {
  const { data: session } = useSession(); //This gets the session data from next-auth
  // const userName = session.user.name || "User";
  //API call to get the user info
  if (session) {
    console.log("User is logged in:", session.user.name);
  }
  const userName = session?.user.name || "User";

  console.log("User Name:", userName);
  console.log("User Name Type:", typeof userName);
  const firstName = userName.split(" ")[0]; // Get the first name
  console.log("First Name:", firstName);

  return (
    <div>
      {session ? (
        <>
          <h2 className="alumniSansPinstripe text-stone-100 text-2xl">
            Welcome, {firstName ? `${firstName}` : 'Guest! Please log in.'}
          </h2>
        </>
      ) : (
        <>
        </>
      )}
    </div>
  );
}
// This component conditionally renders a welcome message based on the user's session status.
