import LogInNav from "../app/components/LogInNav";
import MuralGrid from "../app/components/MuralGrid";
import Footer from "../app/components/Footer";
import CircularText from "./components/CircularText";

export default function Home() {
  return (
    <div className="bg-gradient-to-tl from-stone-900 to-stone-800">
      <LogInNav />
      <CircularText />
      <MuralGrid />
      <Footer />
    </div>
  );
}
