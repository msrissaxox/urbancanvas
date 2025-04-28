import LogInNav from "./components/LogInNav/LogInNav";
import MuralGrid from "../app/components/MuralGrid";
import Footer from "./components/Footer/Footer";
import CircularText from "./components/CircularText";

export default function Home() {
  return (
    <div className="bg-gradient-to-tl from-stone-900 to-stone-800">
      <LogInNav />
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
