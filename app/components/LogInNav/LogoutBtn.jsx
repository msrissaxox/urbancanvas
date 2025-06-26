
import { PiSignOut } from "react-icons/pi";

export default function LogoutButton( { onLogout }) {
  return (
<button className="text-xl font-bold alumniSansPinstripe md:text-2xl px-2 py-1 leading-none border rounded text-white border-white hover:border-transparent hover:text-gray-500 hover:bg-white transition duration-300 text-center"
 
    onClick={onLogout} >

      <PiSignOut />
    </button>
  );
}
