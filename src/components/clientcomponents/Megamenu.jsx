"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MdCall } from "react-icons/md";

export default function NavbarClient({ data }) {
  const elements = data?.elements || [];

  const [showMenu, setShowMenu] = useState(null);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white pt-3 shadow">
      <nav className="mx-auto px-4 max-w-7xl flex items-center justify-between h-20">

        {/* LOGO */}
        <Link href="/">
          <Image
            src={data.logo.src}
            alt={data.logo.alt}
            width={150}
            height={40}
            unoptimized
          />
        </Link>

        {/* DESKTOP NAV */}
        <ul className="hidden lg:flex gap-8 items-center">

          {elements.map((item, index) => (
            <li
              key={index}
              className="relative group cursor-pointer"
              onMouseEnter={() => setShowMenu(item.name)}
              onMouseLeave={() => setShowMenu(null)}
            >
              {/* MENU LINK */}
              <Link href={item.link || "#"} className="font-semibold">
                {item.name}
              </Link>

              {/* ---------------------------------------- */}
              {/* MEGA MENU ONLY FOR COURSES */}
              {/* ---------------------------------------- */}
              {item.name === "Courses" && item.dropdown && showMenu === "Courses" && (
                <div className="absolute left-0 top-full mt-3 w-[650px] bg-white shadow-xl rounded-lg p-5 flex gap-6 z-50">

                  {/* LEFT CATEGORY LIST */}
                  <div className="w-1/3 border-r pr-3">
                    {item.dropdown.map((cat, catIndex) => (
                      <div
                        key={catIndex}
                        className={`p-2 rounded mb-2 cursor-pointer font-medium ${
                          activeCategoryIndex === catIndex
                            ? "bg-[#ea6329] text-white"
                            : "hover:bg-gray-100"
                        }`}
                        onMouseEnter={() => setActiveCategoryIndex(catIndex)}
                      >
                        {cat.category}
                      </div>
                    ))}
                  </div>

                  {/* RIGHT SUB-ITEMS */}
                  <div className="w-2/3 pl-3">
                    {item.dropdown[activeCategoryIndex].subItems ? (
                      item.dropdown[activeCategoryIndex].subItems.map((sub, sIndex) => (
                        <Link
                          key={sIndex}
                          href={sub.link}
                          className="block p-2 hover:bg-gray-100 rounded"
                        >
                          {sub.name}
                        </Link>
                      ))
                    ) : (
                      <Link
                        href={item.dropdown[activeCategoryIndex].link}
                        className="block p-2 hover:bg-gray-100 rounded"
                      >
                        {item.dropdown[activeCategoryIndex].category}
                      </Link>
                    )}
                  </div>

                </div>
              )}

              {/* ---------------------------------------- */}
              {/* NORMAL DROPDOWN (Franchise, Discover, etc) */}
              {/* ---------------------------------------- */}
              {item.name !== "Courses" && item.dropdown && showMenu === item.name && (
                <div className="absolute left-0 top-full mt-3 bg-white shadow-lg rounded-lg w-56 p-3 z-50">
                  {item.dropdown.map((drop, dIndex) => (
                    <Link
                      key={dIndex}
                      href={drop.link}
                      className="block p-2 hover:bg-gray-100 rounded"
                    >
                      {drop.name}
                    </Link>
                  ))}
                </div>
              )}

            </li>
          ))}

        </ul>

        {/* CALL BUTTON */}
        <div className="hidden sm:flex items-center gap-2 bg-[#ea6329] text-white px-4 py-2 rounded font-semibold">
          <MdCall />
          {elements.find((x) => x.name === "IVR Number")?.value}
        </div>

      </nav>
    </header>
  );
}

