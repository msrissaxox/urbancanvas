import Link from "next/link";

export default function Header() {
  return (
    <div className="flex items-center flex-shrink-0 text-gray-300 mr-6">
      <span className="font-semibold text-xl md:text-3xl tracking-tight">
        <Link href="/">
        <span className="alumniSansPinstripe">Urban Canvas - Street Art, Socially Mapped</span>
      </Link>
      </span>
    </div>
  );
}
