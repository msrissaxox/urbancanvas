import Link from "next/link";
export default function Links() {
  return (
    <nav className="grid grid-flow-col gap-4">
      <a className="link link-hover alumniSansPinstripe text-xl text-stone-100">About us</a>
      <a
        href="mailto:marissa.bianca.lamothe@gmail.com?subject=Hello&body=Hi%20there"
        className="link link-hover text-xl alumniSansPinstripe text-stone-100">Contact
      </a>
      <Link href="https://www.github.com/msrissaxox" target="_blank" className="link link-hover alumniSansPinstripe text-xl text-stone-100">
        GitHub
      </Link>
      <Link href="https://www.marissalamothe.dev" target="_blank" className="link link-hover alumniSansPinstripe text-xl text-stone-100">
        Portfolio
      </Link>
    </nav>
  );
}
