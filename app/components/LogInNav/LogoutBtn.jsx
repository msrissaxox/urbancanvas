import { signOut } from 'next-auth/react';
import { PiSignOut } from "react-icons/pi";

export default function LogoutButton() {
  return (
    <button className="text-sm px-3 py-2 leading-none border-l-2 alumniSansPinstripe rounded text-stone-100 border-stone-100 hover:border-transparent hover:text-gray-500 hover:bg-stone-100 transition duration-300 w-10 text-center"
 
    onClick={() => signOut({ redirect: false })}>

      <PiSignOut />
    </button>
  );
}
