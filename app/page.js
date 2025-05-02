import LogInNav from "./components/LogInNav/LogInNav";
import MuralGrid from "../app/components/MuralGrid";
import Footer from "./components/Footer/Footer";
import CircularText from "./components/CircularText";
import {auth0 } from "@lib/auth0";


export default async function Home() {

  console.log("AUTH0_DOMAIN in page.js:", process.env.AUTH0_DOMAIN);
  console.log("AUTH0_CLIENT_ID in page.js:", process.env.AUTH0_CLIENT_ID);
  console.log("AUTH0_SECRET in page.js:", process.env.AUTH0_SECRET);
  console.log("APP_BASE_URL in page.js:", process.env.APP_BASE_URL);
  console.log("AUTH0_ISSUER_BASE_URL in page.js:", process.env.AUTH0_ISSUER_BASE_URL);
  console.log("AUTH0_CLIENT_SECRET in page.js:", process.env.AUTH0_CLIENT_SECRET);




const session = await auth0.getSession();

if (!session){
  return (
    <div className="bg-gradient-to-tl from-stone-900 to-stone-800">
      <LogInNav loginLink="api/auth/login" registerLink="/api/auth/login?screen_hint=signup"/>
      <CircularText
        style={{
          backgroundImage: `url('/urbanmural.png')`,
          backgroundSize: "cover",
          height: "50vh",
          paddingTop: "75px",
        }}
      />
      <MuralGrid />
      <Footer />
    </div>
  );
}

 // If session exists, show a welcome message and logout button
 return (
  <main>
    <h1>Welcome!</h1>
    <p>
      <a href="api/auth/logout">
        <button>Log out</button>
      </a>
    </p>
    <div className="bg-gradient-to-tl from-stone-900 to-stone-800">
      
      <CircularText
        style={{
          backgroundImage: `url('/urbanmural.png')`,
          backgroundSize: "cover",
          height: "50vh",
          paddingTop: "75px",
        }}
      />
      <MuralGrid />
      <Footer />
    </div>

  </main>
);
}