import React from "react";
import Copyright from "./Copyright";
import Links from "./Links";
export default function Footer() {
  return (
    <footer className="footer footer-center bg-base-200 text-base-content rounded p-10">
      <Links />
      <aside>
        <Copyright />
      </aside>
    </footer>
  );
}
