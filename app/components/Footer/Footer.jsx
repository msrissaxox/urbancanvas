import React from "react";
import Copyright from "./Copyright";
import Icons from "./Icons";
import Links
 from "./Links";
export default function Footer() {
  return (
    <footer className="footer footer-center bg-base-200 text-base-content rounded p-10">
     <Links />
      <Icons />
      <aside>
        <Copyright />
      </aside>
    </footer>
  );
}
