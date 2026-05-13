// components/MobileBottomNav.jsx
'use client';

import { BookOpen, Download, MessageCircle, Phone, Star } from "lucide-react";
import Link from "next/link";

const items = [
  { label: "Courses", icon: BookOpen, href: "/courses" },
  { label: "Chat", icon: MessageCircle, href: "https://wa.me/919000012345", isExternal: true },
  { label: "Review", icon: Star, href: "/reviews", highlight: true },
  { label: "Contact", icon: Phone, href: "tel:18001204748", isExternal: true },
  { label: "Brochure", icon: Download, href: "/brochure" },
];

export const MobileBottomNav = () => {
  return (
    <>
      {/* Mobile only - fixed bottom navigation */}
      <div className="block lg:hidden">
        <nav
          aria-label="Mobile navigation"
          className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] pb-[env(safe-area-inset-bottom)]"
        >
          <ul className="grid grid-cols-5">
            {items.map(({ label, icon: Icon, href, highlight, isExternal }) => (
              <li key={label} className="relative">
                {isExternal ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium text-gray-600 hover:text-[#FE543D] transition-colors"
                  >
                    {highlight ? (
                      <span className="-mt-7 mb-0.5 grid place-items-center w-12 h-12 rounded-full bg-gradient-to-r from-[#FE543D] to-[#FF7854] text-white shadow-[0_0_15px_rgba(254,84,61,0.4)] ring-4 ring-white">
                        <Icon className="w-5 h-5" />
                      </span>
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                    <span className={highlight ? "text-[#FE543D] font-semibold" : ""}>{label}</span>
                  </a>
                ) : (
                  <Link
                    href={href}
                    className="flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium text-gray-600 hover:text-[#FE543D] transition-colors"
                  >
                    {highlight ? (
                      <span className="-mt-7 mb-0.5 grid place-items-center w-12 h-12 rounded-full bg-gradient-to-r from-[#FE543D] to-[#FF7854] text-white shadow-[0_0_15px_rgba(254,84,61,0.4)] ring-4 ring-white">
                        <Icon className="w-5 h-5" />
                      </span>
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                    <span className={highlight ? "text-[#FE543D] font-semibold" : ""}>{label}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      {/* Add padding only on mobile devices */}
      <style jsx global>{`
        @media (max-width: 768px) {
          body {
            padding-bottom: 70px !important;
          }
        }
      `}</style>
    </>
  );
};