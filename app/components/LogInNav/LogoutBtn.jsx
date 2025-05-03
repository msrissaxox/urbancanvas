import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  return (
    <button className="text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-gray-500 hover:bg-white transition duration-300 w-32 text-center"
 
    onClick={() => signOut({ redirect: false })}>
      Sign Out
    </button>
  );
}
