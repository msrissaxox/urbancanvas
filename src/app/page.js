import MuralGrid from "./components/MuralGrid";
import LogInNav from "./components/LogInNav";
import Footer from "./components/Footer";

export default function Home() {
  return (
<div className="bg-gradient-to-tl from-stone-50 to-stone-100">
<LogInNav />
<MuralGrid />
<Footer />
</div>
  );
}
