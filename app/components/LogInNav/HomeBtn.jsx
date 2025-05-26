import { IoHomeOutline } from "react-icons/io5";

export default function HomeBtn() {
  function handleHomeClick() {
    // Navigate to the home page
    window.location.href = "/";
  }

  return (
    <div>
      <button className="text-sm px-3 py-2 leading-none border-l-2 alumniSansPinstripe rounded text-stone-100 border-stone-100 hover:border-transparent hover:text-gray-500 hover:bg-stone-100 transition duration-300 w-10 text-center">
        <IoHomeOutline onClick={handleHomeClick} />
      </button>
    </div>
  );
}
