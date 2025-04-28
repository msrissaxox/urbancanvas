import Link from "next/link";
export default function Links() {
  return (
    <nav className="grid grid-flow-col gap-4">
      <a className="link link-hover">About us</a>
      <a
        href="mailto:marissa.bianca.lamothe@gmail.com?subject=Hello&body=Hi%20there"
        className="link link-hover"
      >
        Contact
      </a>
      <Link href="https://www.github.com/msrissaxox" target="_blank">
        GitHub
      </Link>
      <Link href="https://www.marissalamothe.dev" target="_blank">
        Portfolio
      </Link>
    </nav>
  );
}
