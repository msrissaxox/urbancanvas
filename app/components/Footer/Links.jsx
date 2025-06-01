import Link from "next/link";
export default function Links() {
  return (
    <nav className="grid grid-flow-col gap-4">
      <Link href="/about">
      <span className="link link-hover alumniSansPinstripe text-xl text-stone-100">About us</span>
      </Link>
      <Link href="/contact">
      <span className="link link-hover alumniSansPinstripe text-xl text-stone-100">Contact</span>
      </Link>
      <Link href="https://www.github.com/msrissaxox" target="_blank" className="link link-hover alumniSansPinstripe text-xl text-stone-100">
        GitHub
      </Link>
      <Link href="https://www.marissalamothe.dev" target="_blank" className="link link-hover alumniSansPinstripe text-xl text-stone-100">
        Portfolio
      </Link>
    </nav>
  );
}
