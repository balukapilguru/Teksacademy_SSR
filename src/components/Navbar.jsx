"use client";

import {
  useEffect,
  useState,
  useRef,
  useContext,
  useCallback,
  useMemo,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { TbLogin2 } from "react-icons/tb";
import {
  MdCall,
  MdClose,
  MdMenu,
  MdOutlineBusiness,
  MdOutlineLocationOn,
  MdOutlineStore,
  MdArrowForwardIos,
  MdPhone,
} from "react-icons/md";
import {
  FaAngleUp,
  FaAngleDown,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
  FaCertificate,
  FaAward,
  FaUserGraduate,
  FaBolt,
  FaBriefcase,
  FaPenAlt,
  FaCode,
  FaCalculator,
  FaChartLine,
  FaDesktop,
  FaBookOpen,
  FaMoneyBillWave,
  FaFlask,
  FaGraduationCap,
  FaUserClock,
  FaVideo,
  FaBookReader,
  FaBook,
  FaQuestionCircle,
  FaInfoCircle,
  FaNewspaper,
  FaStar,
  FaCalendarAlt,
  FaUniversity,
  FaGlobe,
  FaRocket,
  FaImages,
  FaHeadset,
  FaUserFriends,
  FaBuilding,
} from "react-icons/fa";
import GetData from "@/utility/GetData";
import { SelectedCourseContext } from "@/context/SelectedCourseContext";
import { FaRegNewspaper, FaSearch } from "react-icons/fa";
import { FaBuildingColumns, FaMobileScreen } from "react-icons/fa6";
import { useNavbar } from "@/components/coursePage/NavbarContext";
import { FaChevronDown } from "react-icons/fa";
import { TbCertificate } from "react-icons/tb";
import { LuCircleDotDashed } from "react-icons/lu";
import { AiFillSafetyCertificate, AiOutlineArrowUp } from "react-icons/ai";
import { GiGraduateCap } from "react-icons/gi";
import { BsLightningCharge } from "react-icons/bs";
import { IoBookOutline } from "react-icons/io5";
import { HiOutlineAcademicCap } from "react-icons/hi";
import { RiUserStarLine } from "react-icons/ri";
import { TbBrandNextjs } from "react-icons/tb";
import { FiAward, FiMapPin } from "react-icons/fi";
import { BsBriefcase, BsJournalText } from "react-icons/bs";
import { MdPhotoLibrary, MdContactPhone, MdSupportAgent, MdCampaign } from "react-icons/md";
import { useRouter } from "next/navigation";

import CareerGuidanceForm from "../components/clientcomponents/forms/CareerGuidanceForm";

// ─────────────────────────────────────────────
// Icon map: keyed by dropdown item title/name
// ─────────────────────────────────────────────
const DROPDOWN_ICON_MAP = {
  // ── Resources ──
  "Ebook": <FaBook className="text-sm text-[#002b80]" />,
  "Video Lectures": <FaVideo className="text-sm text-[#002b80]" />,
  "Interview Questions": <FaQuestionCircle className="text-sm text-[#002b80]" />,

  // ── Discover ──
  "About Us": <FaInfoCircle className="text-sm text-[#002b80]" />,
  "Gallery": <FaImages className="text-sm text-[#002b80]" />,
  "Media": <MdCampaign className="text-sm text-[#002b80]" />,
  "Contact Us": <MdContactPhone className="text-sm text-[#002b80]" />,
  "Support": <MdSupportAgent className="text-sm text-[#002b80]" />,

  // ── Placements ──
  "Alumni": <FaUserGraduate className="text-sm text-[#002b80]" />,
  "Recruiters": <FaBuilding className="text-sm text-[#002b80]" />,
};

// Helper: get icon for a dropdown item by its title or name
function getDropdownIcon(drop) {
  const key = drop.title || drop.name || "";
  return DROPDOWN_ICON_MAP[key] || <LuCircleDotDashed className="text-sm text-[#002b80]" />;
}

export default function Navbar() {
  const [navData, setNavData] = useState(null);
  const [showMenu, setShowMenu] = useState(null);
  const [hoveredCategoryIndex, setHoveredCategoryIndex] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubMenu, setMobileSubMenu] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const menuRef = useRef(null);
  const headerRef = useRef(null);
  const [backtoTop, setbacktoTop] = useState(false);
  const [showCareer, setshowCareer] = useState(false);
  const router = useRouter();

  const { mainNavbarVisible } = useNavbar();

  const isValidLink = useCallback((link) => {
    return link && typeof link === "string" && link.trim() !== "";
  }, []);

  useEffect(() => {
    const fetchNav = async () => {
      try {
        setIsLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_TEKSSKILL_API_URL;
        const response = await fetch(`${baseUrl}/api/v1/home/navbar`, {
          method: "GET",
          next: { revalidate: 60 },
        });
        const data = await response.json();
        console.log(data, "navbar data");
        setNavData(data?.data?.navbar || null);
      } catch (err) {
        console.error("Navbar fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNav();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
      setbacktoTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(null);
        setHoveredCategoryIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
    setMobileSubMenu(null);
  }, []);

  const toggleMobileSubMenu = useCallback((menuName) => {
    setMobileSubMenu((prev) => (prev === menuName ? null : menuName));
  }, []);

  const { topbar, mainbar, elements, topbarItems, coursesMenu } =
    useMemo(() => {
      if (!navData)
        return {
          topbar: {},
          mainbar: {},
          elements: [],
          topbarItems: [],
          coursesMenu: null,
        };

      const topbar = navData.topbar || {};
      const mainbar = navData.mainbar || {};
      const elements = mainbar.elements || [];

      const topbarItemsObj = topbar.items || {};
      const topbarItemsArray = Object.entries(topbarItemsObj).map(([key, value]) => {
        if (!value.type && value.link) {
          return { ...value, type: "link", key };
        }
        return { ...value, key };
      });

      const coursesMenu = elements.find((el) => el.name === "Courses");

      return { topbar, mainbar, elements, topbarItems: topbarItemsArray, coursesMenu };
    }, [navData]);

  const socialIcons = useMemo(
    () => ({
      facebook: FaFacebookF,
      instagram: FaInstagram,
      youtube: FaYoutube,
      linkedin: FaLinkedinIn,
    }),
    []
  );

  const handleFormButtonClick = useCallback(() => {
    setshowCareer(true);
  }, []);

  const handleCloseCareerForm = useCallback(() => {
    setshowCareer(false);
  }, []);

  if (isLoading) {
    return (
      <div className="h-20 bg-white shadow-md">
        <div className="max-w-6xl main_container flex items-center justify-between h-16 md:h-20 ">
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!mainNavbarVisible || !navData) {
    return <div className="pt-20 xl:pt-30"></div>;
  }

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 w-full z-40 bg-white transition-all duration-300 ${scrolled ? "shadow-md" : "shadow-md"
          }`}
      >
        <div className="hidden md:block bg-[#002b80] text-white text-xs py-2">
          <div className="main_container flex items-center justify-between">
            {/* LEFT SIDE */}
            <div className="flex items-center w-full gap-6">
              {topbarItems
                .filter(
                  (item) =>
                    item.type === "text" ||
                    (item.type === "link" &&
                      item.key !== "login" &&
                      item.key !== "button")
                )
                .map((item, index) => {
                  if (item.type === "text") {
                    return (
                      <div
                        key={`top-text-${index}`}
                        className="flex items-center gap-2"
                      >
                        <MdCall className="text-sm" />
                        <span>{item.name}</span>
                      </div>
                    );
                  }
                  if (item.type === "link") {
                    if (!isValidLink(item.link)) return null;
                    return (
                      <Link
                        key={`top-link-${index}`}
                        href={item.link}
                        className="hover:text-[#fff] transition-colors text-md flex items-center gap-1"
                      >
                        {item.name === "Download Mobile App" && (
                          <FaMobileScreen size={14} />
                        )}
                        {item.name === "Blogs" && <FaRegNewspaper size={14} />}
                        {item.name === "Find My Course" && (
                          <FaSearch size={14} />
                        )}
                        {item.name}
                      </Link>
                    );
                  }
                  return null;
                })}
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center w-full justify-end gap-6">
              {topbarItems
                .filter(
                  (item) =>
                    item.type === "button" ||
                    item.key === "login" ||
                    item.type === "socialMedia"
                )
                .map((item, index) => {
                  if (item.type === "button") {
                    if (item.form) {
                      return (
                        <button
                          key={`top-button-${index}`}
                          onClick={handleFormButtonClick}
                          className="bg-white text-[#002b80] px-3 py-1 rounded font-semibold hover:bg-gray-100 transition-colors text-md cursor-pointer"
                        >
                          {item.name}
                        </button>
                      );
                    }
                    if (!isValidLink(item.link)) return null;
                    return (
                      <Link
                        key={`top-button-${index}`}
                        href={item.link}
                        className="bg-white text-[#fff] px-3 py-1 rounded font-semibold hover:bg-gray-100 transition-colors text-md"
                      >
                        {item.name}
                      </Link>
                    );
                  }
                  if (item.key === "login") {
                    if (!isValidLink(item.link)) return null;
                    return (
                      <a
                        key={`top-login-${index}`}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-[#fff] transition-colors text-md flex items-center gap-1"
                      >
                        {item.key === "login" && <TbLogin2 size={14} />}
                        {item.name}
                      </a>
                    );
                  }
                  if (item.type === "socialMedia" && item.icons) {
                    return (
                      <div
                        key={`social-${index}`}
                        className="flex items-center gap-4"
                      >
                        {item.icons.map((social, idx) => {
                          const IconComponent = socialIcons[social.platform];
                          if (!IconComponent || !isValidLink(social.link))
                            return null;
                          return (
                            <a
                              key={`social-icon-${idx}`}
                              href={social.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Visit our ${social.platform} page`}
                              className="hover:text-[#002b80] transition-colors inline-flex"
                            >
                              <IconComponent
                                className="text-[18px]"
                                aria-hidden="true"
                              />
                              <span className="sr-only">
                                Visit our {social.platform} page
                              </span>
                            </a>
                          );
                        })}
                      </div>
                    );
                  }
                  return null;
                })}
            </div>
          </div>
        </div>

        <nav
          className="main_container flex items-center justify-between h-12 md:h-18"
          ref={menuRef}
        >
          <div className="">
            <Link href="/">
              <Image
                src={
                  GetData({ url: mainbar.logo?.src }) || "/placeholder-logo.png"
                }
                alt={mainbar.logo?.alt || "Logo"}
                width={151}
                height={48}
                unoptimized
                className="h-10 w-full md:h-12"
                priority
              />
            </Link>
          </div>

          <button
            className="lg:hidden p-1.5"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <MdClose size={20} /> : <MdMenu size={20} />}
          </button>

          <ul className="hidden lg:flex items-center lg:gap-3 xl:gap-10">
            {elements.map((item, index) => (
              <li
                key={`desktop-nav-${index}`}
                className="relative group"
                onMouseEnter={() => {
                  if (item.dropdown) {
                    setShowMenu(item.name);
                    if (item.name === "Courses") {
                      setHoveredCategoryIndex(0);
                    }
                  }
                }}
                onMouseLeave={() => {
                  setShowMenu(null);
                  if (item.name === "Courses") {
                    setHoveredCategoryIndex(null);
                  }
                }}
              >
                <div className="font-semibold flex items-center gap-1 cursor-pointer hover:text-[#002b80] transition-colors">
                  {item.link && isValidLink(item.link) ? (
                    <Link
                      href={item.link}
                      className="flex items-center gap-1 transition-colors"
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <span className="transition-colors">{item.name}</span>
                  )}

                  {item.dropdown && item.dropdown.length > 0 && (
                    <FaChevronDown
                      className={`transition-transform duration-150 ease-in-out text-sm mt-1 ${showMenu === item.name ? "rotate-180" : "rotate-0"
                        }`}
                    />
                  )}
                </div>

                {/* ========== COURSES DROPDOWN ========== */}
                {item.name === "Courses" &&
                  item.dropdown &&
                  item.dropdown.length > 0 && (
                    <div
                      className={`absolute left-0 top-full mt-4 w-[720px] bg-white shadow-xl rounded-lg p-3 border border-gray-100 transition-all duration-200 ${showMenu === item.name
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible -translate-y-1"
                        }`}
                      onMouseEnter={() => setShowMenu(item.name)}
                      onMouseLeave={() => {
                        setShowMenu(null);
                        setHoveredCategoryIndex(null);
                      }}
                    >
                      <div className="grid grid-cols-2 gap-2">
                        {item.dropdown.map((course, courseIndex) => (
                          <Link
                            key={`course-${courseIndex}`}
                            href={isValidLink(course.link) ? course.link : "#"}
                            className="flex items-center gap-2 p-2 rounded-lg border border-gray-100 hover:border-[#002b80] hover:shadow-md transition-all group"
                            onClick={() => setShowMenu(null)}
                          >
                            {course.image?.url && (
                              <div className="flex-shrink-0 w-10 h-10 rounded-md overflow-hidden bg-gray-100">
                                <Image
                                  src={
                                    GetData({ url: course.image.url }) ||
                                    course.image.url
                                  }
                                  alt={course.image.alt || course.title}
                                  width={48}
                                  height={48}
                                  unoptimized
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-[#002b80] group-hover:text-[#002b80] transition-colors text-xs leading-tight">
                                {course.title}
                              </h3>
                              <p className="text-[10px] text-gray-500 mt-0.5 leading-snug line-clamp-2">
                                {course.description}
                              </p>
                            </div>
                            <MdArrowForwardIos className="text-[#002b80] group-hover:text-[#002b80] transition-colors flex-shrink-0 text-xs" />
                          </Link>
                        ))}
                      </div>

                      <div className="mt-2 pt-1 flex justify-center">
                        <Link
                          href="/courses"
                          onClick={() => setShowMenu(null)}
                          className="flex items-center gap-2 text-[#002b80] hover:text-[#002b80] font-semibold text-sm transition-colors group"
                        >
                          <span>Know More</span>
                          <MdArrowForwardIos className="text-xs mt-1" />
                        </Link>
                      </div>
                    </div>
                  )}

                {/* ========== BRANCHES DROPDOWN ========== */}
                {item.name === "Branches" &&
                  item.dropdown &&
                  item.dropdown.length > 0 && (
                    <div
                      className={`absolute left-0 top-full mt-4 w-[780px] bg-white shadow-xl rounded-lg p-3 border border-gray-100 transition-all duration-200 ${showMenu === item.name
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible -translate-y-1"
                        }`}
                      onMouseEnter={() => setShowMenu(item.name)}
                      onMouseLeave={() => setShowMenu(null)}
                    >
                      <div className="grid grid-cols-3 gap-2">
                        {item.dropdown.map((branch, branchIndex) => (
                          <Link
                            key={`branch-${branchIndex}`}
                            href={isValidLink(branch.link) ? branch.link : "#"}
                            className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 hover:border-[#002b80] hover:shadow-md transition-all group"
                          >
                            {branch.image?.url && (
                              <div className="flex-shrink-0 w-10 h-10 rounded-md overflow-hidden bg-gray-100">
                                <Image
                                  src={
                                    GetData({ url: branch.image.url }) ||
                                    branch.image.url
                                  }
                                  alt={branch.image.alt || branch.title}
                                  width={40}
                                  height={40}
                                  unoptimized
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-[#002b80] group-hover:text-[#002b80] transition-colors text-xs leading-tight truncate">
                                {branch.title}
                              </h3>
                              {branch.phone && (
                                <div className="flex items-center gap-1 mt-0.5">
                                  <MdPhone
                                    className="text-gray-400 flex-shrink-0"
                                    size={9}
                                  />
                                  <span className="text-[12px] text-gray-500 truncate">
                                    {branch.phone}
                                  </span>
                                </div>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                {/* ========== OTHER DROPDOWNS (Resources, Discover, Placements) ========== */}
                {item.name !== "Courses" &&
                  item.name !== "Branches" &&
                  item.dropdown &&
                  item.dropdown.length > 0 && (
                    <div
                      className={`absolute left-0 top-full mt-1 bg-white shadow-2xl rounded-lg min-w-[200px] p-2 z-50 border border-gray-100 transition-all duration-200 ${showMenu === item.name
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible -translate-y-1"
                        }`}
                      onMouseEnter={() => setShowMenu(item.name)}
                      onMouseLeave={() => setShowMenu(null)}
                    >
                      {item.dropdown.map((drop, dIndex) => (
                        <Link
                          key={`dropdown-${drop.link}-${dIndex}`}
                          href={isValidLink(drop.link) ? drop.link : "#"}
                          className="flex items-center gap-2 p-3 hover:bg-gray-100 rounded whitespace-nowrap font-medium hover:text-[#002b80] transition-colors text-sm group"
                        >
                          {/* ✅ Per-item icon from DROPDOWN_ICON_MAP */}
                          <span className="group-hover:[&>*]:text-[#002b80] transition-colors">
                            {getDropdownIcon(drop)}
                          </span>
                          <span>{drop.title || drop.name}</span>
                          {drop.phone && (
                            <span className="text-xs text-gray-500 ml-auto">
                              {drop.phone}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
              </li>
            ))}

            {mainbar.button && (
              <div className="hidden md:flex items-center gap-1 bg-[#002b80] text-white px-3 py-2 rounded font-semibold hover:bg-[#a0182e] transition-colors cursor-pointer text-sm">
                <Link
                  href={
                    isValidLink(mainbar.button.link)
                      ? mainbar.button.link
                      : "#"
                  }
                >
                  {mainbar.button.title}
                </Link>
              </div>
            )}
          </ul>
        </nav>
      </header>

      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 bg-opacity-50 z-40"
          onClick={toggleMobileMenu}
        />
      )}

      <div
        className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex items-center justify-end p-2.5 border-b border-gray-100">
          <button onClick={toggleMobileMenu} className="p-1">
            <MdClose size={20} />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-52px)] p-1.5">
          <ul className="space-y-0.5">
            {elements.map((item, index) => (
              <li
                key={`mobile-nav-${index}`}
                className="border-b border-gray-100 last:border-0"
              >
                {item.dropdown && item.dropdown.length > 0 ? (
                  <>
                    <button
                      className="w-full flex items-center justify-between p-2 font-semibold text-left hover:bg-gray-50 rounded text-sm"
                      onClick={() => toggleMobileSubMenu(item.name)}
                    >
                      <span>{item.name}</span>
                      <span>
                        {mobileSubMenu === item.name ? (
                          <FaAngleUp className="text-xs" />
                        ) : (
                          <FaAngleDown className="text-xs" />
                        )}
                      </span>
                    </button>

                    {mobileSubMenu === item.name && (
                      <div className="pl-0 pb-1.5">
                        {/* ========== MOBILE COURSES ========== */}
                        {item.name === "Courses" ? (
                          <div className="space-y-2">
                            {item.dropdown.map((course, courseIndex) => (
                              <Link
                                key={`mobile-course-${courseIndex}`}
                                href={
                                  isValidLink(course.link) ? course.link : "#"
                                }
                                className="flex items-center gap-1 p-1 hover:bg-gray-50 rounded border-l-4 border-transparent hover:border-[#002b80] transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {course.image?.url && (
                                  <div className="flex-shrink-0 w-10 h-10 rounded-md overflow-hidden bg-gray-100">
                                    <Image
                                      src={
                                        GetData({ url: course.image.url }) ||
                                        course.image.url
                                      }
                                      alt={course.image.alt || course.title}
                                      width={40}
                                      height={40}
                                      unoptimized
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-xs text-[#002b80] leading-tight">
                                    {course.title}
                                  </h3>
                                  <p className="text-[10px] text-gray-500 mt-0.5 leading-snug line-clamp-2">
                                    {course.description}
                                  </p>
                                </div>
                                <MdArrowForwardIos className="text-[#002b80] text-xs flex-shrink-0" />
                              </Link>
                            ))}

                            <Link
                              href="/courses"
                              onClick={() => setMobileMenuOpen(false)}
                              className="flex items-center justify-center gap-2 p-3 mt-1 border border-[#002b80] rounded-lg text-[#002b80] hover:bg-[#002b80] hover:text-white transition-colors font-semibold text-sm"
                            >
                              <span>Know More</span>
                              <MdArrowForwardIos className="text-xs" />
                            </Link>
                          </div>
                        ) : item.name === "Branches" ? (
                          /* ========== MOBILE BRANCHES ========== */
                          <div className="space-y-1">
                            {item.dropdown.map((branch, branchIndex) => (
                              <Link
                                key={`mobile-branch-${branchIndex}`}
                                href={
                                  isValidLink(branch.link) ? branch.link : "#"
                                }
                                className="flex items-center gap-1 p-2 hover:bg-gray-50 rounded border-l-4 border-transparent hover:border-[#002b80] transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {branch.image?.url && (
                                  <div className="flex-shrink-0 w-9 h-9 rounded-md overflow-hidden bg-gray-100">
                                    <Image
                                      src={
                                        GetData({ url: branch.image.url }) ||
                                        branch.image.url
                                      }
                                      alt={branch.image.alt || branch.title}
                                      width={36}
                                      height={36}
                                      unoptimized
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-xs text-[#002b80] leading-tight">
                                    {branch.title}
                                  </h3>
                                  {branch.phone && (
                                    <div className="flex items-center gap-1 mt-0.5">
                                      <MdPhone
                                        className="text-gray-400 flex-shrink-0"
                                        size={9}
                                      />
                                      <span className="text-[9px] text-gray-500">
                                        {branch.phone}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          /* ========== MOBILE Resources / Discover / Placements ========== */
                          <div className="space-y-1">
                            {item.dropdown.map((drop, dIndex) => (
                              <Link
                                key={`mobile-dropdown-${dIndex}`}
                                href={isValidLink(drop.link) ? drop.link : "#"}
                                className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded text-sm group"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {/* ✅ Per-item icon from DROPDOWN_ICON_MAP */}
                                <span className="group-hover:[&>*]:text-[#002b80] transition-colors">
                                  {getDropdownIcon(drop)}
                                </span>
                                <span className="group-hover:text-[#002b80] transition-colors font-medium">
                                  {drop.title || drop.name}
                                </span>
                                {drop.phone && (
                                  <span className="text-xs text-gray-500 ml-auto">
                                    {drop.phone}
                                  </span>
                                )}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={
                      item.link && isValidLink(item.link) ? item.link : "#"
                    }
                    className="block p-2 font-semibold hover:bg-gray-50 rounded text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>{item.name}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* Top Items in Mobile Menu */}
          <div className="mb-3 border-b border-gray-100 pb-3">
            <div className="space-y-2">
              {topbarItems.map((item, index) => {
                if (item.type === "socialMedia") return null;

                if (item.type === "link" || (item.link && !item.type)) {
                  if (!isValidLink(item.link)) return null;
                  return (
                    <Link
                      key={`mobile-top-link-${index}`}
                      href={item.link}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 p-2 font-semibold hover:bg-gray-50 rounded text-sm text-gray-700"
                    >
                      {item.name === "Download Mobile App" && (
                        <FaMobileScreen size={15} />
                      )}
                      {item.name === "Blogs" && <FaRegNewspaper size={15} />}
                      {item.name === "Find My Course" && <FaSearch size={15} />}
                      <span>{item.name}</span>
                    </Link>
                  );
                }

                if (item.type === "button") {
                  if (item.form) {
                    return (
                      <button
                        key={`mobile-top-button-${index}`}
                        onClick={() => {
                          handleFormButtonClick();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 p-2 hover:bg-gray-50 rounded text-sm text-gray-700 text-left bg-blue-50 border border-blue-100"
                      >
                        <span className="font-semibold text-[#002b80]">
                          {item.name}
                        </span>
                      </button>
                    );
                  }
                  if (!isValidLink(item.link)) return null;
                  return (
                    <Link
                      key={`mobile-top-button-${index}`}
                      href={item.link}
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center gap-2 p-2 hover:bg-gray-50 rounded text-sm text-gray-700 text-left"
                    >
                      <span>{item.name}</span>
                    </Link>
                  );
                }
                return null;
              })}
            </div>
          </div>

          {/* Apply For Job Button in Mobile Menu */}
          {mainbar.button && (
            <div className="flex justify-center items-center gap-1 bg-[#002b80] text-white px-3 py-2 rounded font-semibold mb-2 text-sm">
              <Link
                href={
                  isValidLink(mainbar.button.link) ? mainbar.button.link : "#"
                }
              >
                {mainbar.button.title}
              </Link>
            </div>
          )}

          {/* Social Media Icons in Mobile Menu */}
          <div className="">
            {topbarItems.map((item, index) => {
              if (item.type === "socialMedia" && item.icons) {
                return (
                  <div
                    key={`mobile-social-${index}`}
                    className="flex items-center justify-center mt-4 gap-4"
                  >
                    {item.icons.map((social, idx) => {
                      const IconComponent = socialIcons[social.platform];
                      if (!IconComponent || !isValidLink(social.link))
                        return null;
                      return (
                        <a
                          key={`mobile-social-icon-${idx}`}
                          href={social.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Visit our ${social.platform} page`}
                          className="hover:text-[#002b80] transition-colors inline-flex"
                        >
                          <IconComponent
                            className="text-[20px]"
                            aria-hidden="true"
                          />
                          <span className="sr-only">
                            Visit our {social.platform} page
                          </span>
                        </a>
                      );
                    })}
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>

      <div className="pt-14 md:pt-28"></div>

      {scrolled && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 cursor-pointer bg-[#002b80] text-white h-10 w-10 rounded-full shadow-2xl hover:bg-[#e04a38] transition-all duration-300 z-50 flex items-center justify-center"
          aria-label="Back to top"
        >
          <AiOutlineArrowUp size={18} />
        </button>
      )}

      <CareerGuidanceForm isOpen={showCareer} onClose={handleCloseCareerForm} />
    </>
  );
}