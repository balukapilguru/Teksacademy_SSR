"use client";
import Link from "next/link";
import { useState } from "react";

export default function MobileMenu({ links }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Hamburger Button */}
      <button
        className="lg:hidden flex flex-col cursor-pointer space-y-1.5"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span className="block h-1 w-6 bg-black rounded"></span>
        <span className="block h-1 w-6 bg-black rounded"></span>
        <span className="block h-1 w-6 bg-black rounded"></span>
      </button>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <ul className="lg:hidden absolute top-20 left-0 w-full bg-white px-6 py-4 space-y-4 shadow-md">
          {links.map((link, index) => (
            <li key={index}>
              <Link
                href={link.href}
                className="block py-2 font-semibold hover:text-[#ea6329]"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

