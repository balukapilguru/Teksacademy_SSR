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
import {
  MdCall,
  MdClose,
  MdMenu,
  MdOutlineBusiness,
  MdOutlineLocationOn,
  MdOutlineStore,
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
} from "react-icons/fa";
import GetData from "@/utility/GetData";
import { SelectedCourseContext } from "@/context/SelectedCourseContext";
import { FaRegNewspaper } from "react-icons/fa";
import { FaBuildingColumns, FaMobileScreen } from "react-icons/fa6";
import { useNavbar } from "@/components/coursePage/NavbarContext";
import { FaChevronDown } from "react-icons/fa";
import { TbCertificate } from "react-icons/tb";
import { MdArrowForwardIos } from "react-icons/md";
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
import { useRouter } from "next/navigation";

// import HomeClientLoader from "./HomeClientLoader";
import CareerGuidanceForm from "../components/clientcomponents/forms/CareerGuidanceForm";

export default function Navbar() {
  const [navData, setNavData] = useState(null);
  const [showMenu, setShowMenu] = useState(null);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubMenu, setMobileSubMenu] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredCategoryIndex, setHoveredCategoryIndex] = useState(null);
  const menuRef = useRef(null);
  const headerRef = useRef(null);
  const [backtoTop, setbacktoTop] = useState(false);
  const [showCareer, setshowCareer] = useState(false);
  const router = useRouter();

  const {
    selectedCategory,
    setSelectedCategory,
    selectedSubCategory,
    setSelectedSubCategory,
  } = useContext(SelectedCourseContext);

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
    if (!navData) return;

    const mainbar = navData.mainbar || {};
    const elements = mainbar.elements || [];
    const coursesMenu = elements.find((el) => el.name === "Courses");

    if (coursesMenu) {
      const categoryIndex = coursesMenu.dropdown.findIndex(
        (d) => d.value === selectedCategory,
      );

      if (categoryIndex >= 0) {
        setActiveCategoryIndex(categoryIndex);
      } else if (selectedCategory) {
        setActiveCategoryIndex(null);
      }
    }
  }, [navData, selectedCategory]);

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

  const handleSubCategoryClick = useCallback(
    (catValue, subValue, subLink, catIndex) => {
      const cleanCatValue = catValue?.trim() || "";
      const cleanSubValue = subValue?.trim() || "";

      setSelectedCategory(cleanCatValue);
      setSelectedSubCategory(cleanSubValue);
      setActiveCategoryIndex(catIndex);
      setShowMenu(null);
      setHoveredCategoryIndex(null);
      setMobileMenuOpen(false);

      localStorage.setItem("selectedCategory", cleanCatValue);
      localStorage.setItem("selectedSubCategory", cleanSubValue);
    },
    [setSelectedCategory, setSelectedSubCategory],
  );

  const handleCategoryClick = useCallback(
    (catValue, catIndex) => {
      setSelectedCategory(catValue);
      setSelectedSubCategory(null);
      setActiveCategoryIndex(catIndex);
      setShowMenu(null);
      setHoveredCategoryIndex(null);
      setMobileMenuOpen(false);

      localStorage.setItem("selectedCategory", catValue);
      localStorage.removeItem("selectedSubCategory");
    },
    [setSelectedCategory, setSelectedSubCategory],
  );

  const handleCategoryHover = useCallback((catIndex) => {
    setHoveredCategoryIndex(catIndex);
  }, []);

  const handleCategoryMouseLeave = useCallback(() => {
    if (!showMenu) {
      setHoveredCategoryIndex(null);
    }
  }, [showMenu]);

  const getDisplayCategoryIndex = useCallback(() => {
    if (hoveredCategoryIndex !== null) {
      return hoveredCategoryIndex;
    }
    if (activeCategoryIndex !== null) {
      return activeCategoryIndex;
    }
    return 0;
  }, [hoveredCategoryIndex, activeCategoryIndex]);

  const hasDirectLink = useCallback((subItem) => {
    return subItem && subItem.link && subItem.link.trim() !== "";
  }, []);

  // Icon mapping functions
  const getCategoryIcon = (categoryName) => {
    switch (categoryName) {
      case "Certifications":
        return <TbCertificate className="text-lg" />;
      case "Academics":
        return <HiOutlineAcademicCap className="text-lg" />;
      case "Self Learning":
        return <IoBookOutline className="text-lg" />;
      case "Dual Certification":
        return <GiGraduateCap className="text-lg" />;
      case "Post Graduation":
        return <GiGraduateCap className="text-lg" />;
      case "Fast Track Course":
        return <BsLightningCharge className="text-lg" />;
      default:
        return <LuCircleDotDashed className="text-lg" />;
    }
  };

  // Unified icon function for both desktop and mobile
  const getSubCategoryIcon = (categoryValue, subName) => {
    const lowerCategoryValue = (categoryValue || "").toLowerCase();
    const lowerSubName = (subName || "").toLowerCase();
    const subValue = subName ? subName.replace(/\s+/g, "").toLowerCase() : "";

    if (lowerCategoryValue === "certifications") {
      if (lowerSubName.includes("dual")) return <FaAward className="text-xs" />;
      if (lowerSubName.includes("post"))
        return <FaUserGraduate className="text-xs" />;
      if (lowerSubName.includes("fast")) return <FaBolt className="text-xs" />;
      if (lowerSubName.includes("certification"))
        return <AiFillSafetyCertificate className="text-xs" />;
      return <FaCertificate className="text-xs" />;
    }

    if (lowerCategoryValue === "academics") {
      if (subValue === "bba") return <FaBriefcase className="text-xs" />;
      if (subValue === "ba") return <FaPenAlt className="text-xs" />;
      if (subValue === "bca") return <FaCode className="text-xs" />;
      if (subValue.includes("bcom"))
        return <FaCalculator className="text-xs" />;
      if (subValue === "mba") return <FaChartLine className="text-xs" />;
      if (subValue === "mca") return <FaDesktop className="text-xs" />;
      return <FaGraduationCap className="text-xs" />;
    }

    if (lowerCategoryValue === "selflearning") {
      if (lowerSubName.includes("self"))
        return <FaUserClock className="text-xs" />;
      if (lowerSubName.includes("live")) return <FaVideo className="text-xs" />;
      return <FaBookReader className="text-xs" />;
    }

    return <LuCircleDotDashed className="text-xs" />;
  };

  // Get icon for franchise dropdown items
  const getFranchiseIcon = (itemName) => {
    const lowerName = itemName.toLowerCase();

    if (lowerName.includes("franchise") || lowerName.includes("business"))
      return <MdOutlineBusiness className="text-sm" />;

    return <FaBuildingColumns className="text-sm" />;
  };

  // Get icon for discover dropdown items
  const getDiscoverIcon = (itemName) => {
    const lowerName = itemName.toLowerCase();
    if (lowerName.includes("about") || lowerName.includes("about us"))
      return <FiMapPin className="text-sm" />;

    if (lowerName.includes("contact") || lowerName.includes("enquiry"))
      return <MdCall className="text-sm" />;

    if (lowerName.includes("gallery") || lowerName.includes("photo"))
      return <BsJournalText className="text-sm" />;

    return <FaGlobe className="text-sm" />;
  };

  const { topbar, mainbar, elements, ivrNumber, topbarItems, coursesMenu } =
    useMemo(() => {
      if (!navData)
        return {
          topbar: {},
          mainbar: {},
          elements: [],
          ivrNumber: "",
          topbarItems: [],
          coursesMenu: null,
        };

      const topbar = navData.topbar || {};
      const mainbar = navData.mainbar || {};
      const elements = mainbar.elements || [];
      const ivrNumber = mainbar.ivrNumber?.value || mainbar.ivrNumber || "";
      const topbarItems = topbar.items ? Object.values(topbar.items) : [];
      const coursesMenu = elements.find((el) => el.name === "Courses");

      return { topbar, mainbar, elements, ivrNumber, topbarItems, coursesMenu };
    }, [navData]);

  const socialIcons = useMemo(
    () => ({
      facebook: FaFacebookF,
      instagram: FaInstagram,
      youtube: FaYoutube,
      linkedin: FaLinkedinIn,
    }),
    [],
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
        className={`fixed top-0 left-0 w-full z-40 bg-white transition-all duration-300 ${
          scrolled ? "shadow-md" : "shadow-md"
        }`}
      >
        <div className="hidden md:block bg-[#002b80] text-white text-xs py-2">
          <div className="max-w-6xl main_container flex items-center justify-between">
            <div className="flex items-center w-full gap-3">
              {topbarItems.map((item, index) => {
                if (item.type === "link") {
                  if (!isValidLink(item.link)) {
                    return null;
                  }
                  return (
                    <Link
                      key={`top-link-${index}`}
                      href={item.link}
                      className="hover:text-[#c41e3a] transition-colors text-md flex items-center gap-1"
                    >
                      {item.name === "Download Mobile App" && (
                        <FaMobileScreen size={14} />
                      )}
                      {item.name === "Blogs" && <FaRegNewspaper size={14} />}
                      {item.name}
                    </Link>
                  );
                }
                return null;
              })}
            </div>
            <div className="flex items-center w-full justify-between">
              {topbarItems.map((item, index) => {
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
                  if (!isValidLink(item.link)) {
                    return null;
                  }
                  return (
                    <Link
                      key={`top-button-${index}`}
                      href={item.link}
                      className="bg-white text-[#002b80] px-3 py-1 rounded font-semibold hover:bg-gray-100 transition-colors text-md"
                    >
                      {item.name}
                    </Link>
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
                        if (!isValidLink(social.link)) {
                          return null;
                        }
                        return (
                          <a
                            key={`social-icon-${idx}`}
                            href={social.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Visit our ${social.platform} page`}
                            className="hover:text-[#c41e3a] transition-colors inline-flex"
                          >
                            <IconComponent
                              className="text-[18px]"
                              aria-hidden="true"
                            />
                            <span className="sr-only">
                              {`Visit our ${social.platform} page`}
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
          className="max-w-6xl main_container flex items-center justify-between h-12 md:h-18 "
          ref={menuRef}
        >
          <button
            className="lg:hidden p-1.5"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <MdClose size={20} /> : <MdMenu size={20} />}
          </button>

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

          {/* Social Media Icons in Main Navbar - Mobile Only */}
          <div className="lg:hidden md:hidden flex items-center gap-3">
            {topbarItems.map((item, index) => {
              if (item.type === "socialMedia" && item.icons) {
                return (
                  <div
                    key={`mobile-main-social-${index}`}
                    className="flex items-center gap-2"
                  >
                    {item.icons.map((social, idx) => {
                      const IconComponent = socialIcons[social.platform];
                      if (!isValidLink(social.link)) {
                        return null;
                      }
                      return (
                        <a
                          key={`mobile-main-social-icon-${idx}`}
                          href={social.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Visit our ${social.platform} page`}
                          className="hover:text-[#c41e3a] transition-colors inline-flex"
                        >
                          <IconComponent
                            className="text-[16px]"
                            aria-hidden="true"
                          />
                          <span className="sr-only">
                            {`Visit our ${social.platform} page`}
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

          <ul className="hidden lg:flex items-center lg:gap-3 xl:gap-10">
            {elements.map((item, index) => (
              <li
                key={`desktop-nav-${index}`}
                className="relative group"
                onMouseEnter={() => {
                  if (item.dropdown) {
                    setShowMenu(item.name);
                    if (item.name === "Courses") {
                      setHoveredCategoryIndex(getDisplayCategoryIndex());
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
                <div className="font-semibold flex items-center gap-1 cursor-pointer hover:text-[#c41e3a] transition-colors">
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
                      className={`transition-transform duration-150 ease-in-out text-sm mt-1 ${
                        showMenu === item.name ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  )}
                </div>

                {item.name === "Courses" &&
                  item.dropdown &&
                  item.dropdown.length > 0 && (
                    <div
                      className={`absolute left-0 top-full mt-4 w-[750px] bg-white shadow-xl rounded-lg p-3 flex z-50 border border-gray-100 transition-all duration-200 ${
                        showMenu === item.name
                          ? "opacity-100 visible translate-y-0"
                          : "opacity-0 invisible -translate-y-1"
                      }`}
                      onMouseEnter={() => {
                        setShowMenu(item.name);
                        if (
                          hoveredCategoryIndex === null &&
                          activeCategoryIndex === null
                        ) {
                          setHoveredCategoryIndex(0);
                        }
                      }}
                      onMouseLeave={() => {
                        setShowMenu(null);
                        setHoveredCategoryIndex(null);
                      }}
                      style={{ height: "auto", minHeight: "240px" }}
                    >
                      <div className="w-1/4 pr-2 border-r border-gray-100">
                        <div className="space-y-3">
                          {item.dropdown.map((cat, catIndex) => {
                            const isHovered =
                              getDisplayCategoryIndex() === catIndex;
                            const isSelected = activeCategoryIndex === catIndex;
                            const isClickable = [
                              "certifications",
                              "academics",
                              "selfLearning",
                            ].includes(cat.value);

                            return (
                              <div key={`category-${cat.value}`}>
                                {isClickable ? (
                                  <Link
                                    href="/courses"
                                    onClick={() =>
                                      handleCategoryClick(cat.value, catIndex)
                                    }
                                    className={`block p-4 rounded cursor-pointer transition-all ${
                                      isHovered
                                        ? "bg-[#002b80] text-white"
                                        : isSelected
                                          ? "bg-blue-50 text-[#002b80] border-l-4 border-[#002b80]"
                                          : "hover:bg-gray-50"
                                    }`}
                                    onMouseEnter={() =>
                                      handleCategoryHover(catIndex)
                                    }
                                  >
                                    <div className="flex items-center gap-1.5">
                                      {getCategoryIcon(cat.category)}
                                      <span className="font-semibold text-sm">
                                        {cat.category}
                                      </span>
                                      <MdArrowForwardIos className="text-[10px] ml-auto" />
                                    </div>
                                  </Link>
                                ) : (
                                  <div
                                    className={`p-4 rounded cursor-pointer transition-all ${
                                      isHovered
                                        ? "bg-[#002b80] text-white"
                                        : isSelected
                                          ? "bg-blue-50 text-[#002b80] border-l-4 border-[#002b80]"
                                          : "hover:bg-gray-50"
                                    }`}
                                    onMouseEnter={() =>
                                      handleCategoryHover(catIndex)
                                    }
                                    onClick={() =>
                                      handleCategoryClick(cat.value, catIndex)
                                    }
                                  >
                                    <div className="flex items-center gap-1.5">
                                      {getCategoryIcon(cat.category)}
                                      <span className="font-semibold text-sm">
                                        {cat.category}
                                      </span>
                                      <MdArrowForwardIos className="text-[10px] ml-auto" />
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="w-3/4 pl-3">
                        {item.dropdown[getDisplayCategoryIndex()] && (
                          <div className="h-full flex flex-col">
                            <div className="flex-1">
                              <div
                                className={`grid gap-2 ${
                                  item.dropdown[getDisplayCategoryIndex()]
                                    ?.value === "certifications"
                                    ? "grid-cols-2"
                                    : item.dropdown[getDisplayCategoryIndex()]
                                          ?.value === "academics"
                                      ? "grid-cols-3"
                                      : item.dropdown[getDisplayCategoryIndex()]
                                            ?.value === "selfLearning"
                                        ? "grid-cols-2"
                                        : "grid-cols-2"
                                }`}
                              >
                                {item.dropdown[
                                  getDisplayCategoryIndex()
                                ]?.subCategory?.map((sub) => {
                                  const href = hasDirectLink(sub)
                                    ? sub.link
                                    : "/courses";
                                  const isSelected =
                                    selectedCategory ===
                                      item.dropdown[getDisplayCategoryIndex()]
                                        .value &&
                                    selectedSubCategory === sub.value;

                                  const icon = getSubCategoryIcon(
                                    item.dropdown[getDisplayCategoryIndex()]
                                      ?.value,
                                    sub.name,
                                  );

                                  return (
                                    <Link
                                      key={sub.value}
                                      href={href}
                                      onClick={() => {
                                        handleSubCategoryClick(
                                          item.dropdown[
                                            getDisplayCategoryIndex()
                                          ].value,
                                          sub.value,
                                          href,
                                          getDisplayCategoryIndex(),
                                        );
                                      }}
                                      className={`p-2 rounded border transition-all h-10 flex items-center gap-2 ${
                                        isSelected
                                          ? "bg-white text-[#c41e3a] border-[#c41e3a]"
                                          : "border-gray-200 hover:border-[#002b80] hover:text-[#002b80]"
                                      }`}
                                    >
                                      <div
                                        className={`p-1.5 rounded ${
                                          isSelected
                                            ? "bg-white/20"
                                            : "bg-blue-50"
                                        }`}
                                      >
                                        {icon}
                                      </div>
                                      <div className="flex-1">
                                        <div className="font-medium text-xs">
                                          {sub.name}
                                        </div>
                                        {sub.description && (
                                          <div className="text-[10px] text-gray-500 mt-0.5">
                                            {sub.description}
                                          </div>
                                        )}
                                      </div>
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>

                            <div className="mt-3 pt-2 border-t border-gray-100">
                              <div className="flex items-center justify-start">
                                <Link href="/courses">
                                  <button
                                    className="cursor-pointer text-[#002b80] font-semibold hover:text-[#c41e3a] transition-colors flex items-center gap-1 text-xs"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setShowMenu(null);
                                      setHoveredCategoryIndex(null);
                                      router.push("/courses"); // ✅ FIX
                                    }}
                                  >
                                    know more{" "}
                                    <MdArrowForwardIos className="text-xs" />
                                  </button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                {item.name !== "Courses" &&
                  item.dropdown &&
                  item.dropdown.length > 0 && (
                    <div
                      className={`absolute left-0 top-full mt-1 bg-white shadow-2xl rounded-lg min-w-[180px] p-2 z-50 border border-gray-100 transition-all duration-200 ${
                        showMenu === item.name
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
                          className="flex items-center gap-2 p-3 hover:bg-gray-100 rounded whitespace-nowrap font-medium hover:text-[#c41e3a] transition-colors text-sm"
                        >
                          {item.name === "Franchise" &&
                            getFranchiseIcon(drop.name)}
                          {item.name === "Discover" &&
                            getDiscoverIcon(drop.name)}
                          <span>{drop.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
              </li>
            ))}

            <div className="hidden md:flex items-center gap-1 bg-[#c41e3a] text-white px-2.5 py-1 rounded font-semibold hover:bg-[#a0182e] transition-colors cursor-pointer text-md">
              <MdCall className="text-[14px]" />
              <span>{ivrNumber}</span>
            </div>
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
        className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center  justify-between p-2.5 border-b border-gray-100">
          <Link href="/" onClick={() => setMobileMenuOpen(false)}>
            <Image
              src={
                GetData({ url: mainbar.logo?.src }) || "/placeholder-logo.png"
              }
              alt={mainbar.logo?.alt || "Logo"}
              width={90}
              height={24}
              unoptimized
              priority
            />
          </Link>
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
                    {/* MAIN CATEGORY BUTTON */}
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
                        {item.name === "Courses" ? (
                          item.dropdown.map((cat, catIndex) => {
                            const isClickable = [
                              "certifications",
                              "academics",
                              "selfLearning",
                            ].includes(cat.value);

                            return (
                              <div
                                key={`mobile-cat-${catIndex}`}
                                className="mb-3"
                              >
                                {/* CATEGORY HEADER */}
                                {isClickable ? (
                                  <Link
                                    href="/courses"
                                    onClick={() => {
                                      handleCategoryClick(cat.value, catIndex);
                                      setMobileMenuOpen(false);
                                    }}
                                    className="flex items-center gap-1.5 mb-2 p-1.5 hover:bg-gray-50 rounded"
                                  >
                                    <h3 className="font-semibold text-sm">
                                      {cat.category}
                                    </h3>
                                    <MdArrowForwardIos className="text-xs ml-auto" />
                                  </Link>
                                ) : (
                                  <div className="flex items-center gap-1.5 mb-2 p-1.5">
                                    <h3 className="font-semibold text-sm">
                                      {cat.category}
                                    </h3>
                                    <MdArrowForwardIos className="text-xs ml-auto" />
                                  </div>
                                )}

                                {/* SUB-CATEGORIES WITH ICONS */}
                                {cat.subCategory && (
                                  <div
                                    className={`grid gap-1.5 ${
                                      cat.value === "certifications"
                                        ? "grid-cols-1"
                                        : cat.value === "academics"
                                          ? "grid-cols-2"
                                          : cat.value === "selfLearning"
                                            ? "grid-cols-1"
                                            : "grid-cols-1"
                                    }`}
                                  >
                                    {cat.subCategory.map((sub, sIndex) => {
                                      const href = hasDirectLink(sub)
                                        ? sub.link
                                        : "/courses";
                                      const isSelected =
                                        selectedCategory === cat.value &&
                                        selectedSubCategory === sub.value;

                                      const icon = getSubCategoryIcon(
                                        cat.value,
                                        sub.name,
                                      );

                                      return (
                                        <Link
                                          key={`mobile-sub-${sIndex}`}
                                          href={href}
                                          onClick={() => {
                                            handleSubCategoryClick(
                                              cat.value,
                                              sub.value,
                                              href,
                                              catIndex,
                                            );
                                            setMobileMenuOpen(false);
                                          }}
                                          className={`block p-2 rounded border flex items-center gap-2 text-xs ${
                                            isSelected
                                              ? "bg-[#c41e3a] text-white border-[#c41e3a]"
                                              : "border-gray-200 hover:bg-gray-50"
                                          }`}
                                        >
                                          <div
                                            className={`p-1.5 rounded ${
                                              isSelected
                                                ? "bg-white/20"
                                                : "bg-blue-50"
                                            }`}
                                          >
                                            {icon}
                                          </div>
                                          <div className="flex-1">
                                            <div className="font-medium">
                                              {sub.name}
                                            </div>
                                            {sub.description && (
                                              <div className="text-[10px] text-gray-500 mt-0.5">
                                                {sub.description}
                                              </div>
                                            )}
                                          </div>
                                        </Link>
                                      );
                                    })}
                                  </div>
                                )}

                                {!isClickable && (
                                  <div className="flex justify-start mt-2">
                                    <Link href="/courses">
                                      <button
                                        className="cursor-pointer text-[#002b80] font-semibold hover:text-[#c41e3a] transition-colors flex items-center gap-1 text-xs"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          setMobileMenuOpen(false);
                                          setMobileSubMenu(null);
                                          router.push("/courses"); // ✅ FIX
                                        }}
                                      >
                                        know more{" "}
                                        <MdArrowForwardIos className="text-xs" />
                                      </button>
                                    </Link>
                                  </div>
                                )}
                              </div>
                            );
                          })
                        ) : (
                          // For non-course dropdowns (Franchise, Discover)
                          <div className="space-y-1">
                            {item.dropdown.map((drop, dIndex) => (
                              <Link
                                key={`mobile-dropdown-${dIndex}`}
                                href={isValidLink(drop.link) ? drop.link : "#"}
                                className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded text-sm"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {item.name === "Franchise" &&
                                  getFranchiseIcon(drop.name)}
                                {item.name === "Discover" &&
                                  getDiscoverIcon(drop.name)}
                                <span>{drop.name}</span>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  // Main menu items without dropdown
                  <Link
                    href={item.link && isValidLink(item.link) ? item.link : "#"}
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
                if (item.type === "link") {
                  if (!isValidLink(item.link)) {
                    return null;
                  }
                  return (
                    <Link
                      key={`mobile-top-link-${index}`}
                      href={item.link}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded text-lg text-gray-700"
                    >
                      {item.name === "Download Mobile App" && (
                        <FaMobileScreen size={15} />
                      )}
                      {item.name === "Blogs" && <FaRegNewspaper size={15} />}
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
                  if (!isValidLink(item.link)) {
                    return null;
                  }
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

          {/* Social Media Icons in Mobile Menu */}
          <div className="">
            {/* <div className="flex justify-center mb-3">
                <div className="flex items-center gap-4">
                  {topbarItems.map((item, index) => {
                    if (item.type === "socialMedia" && item.icons) {
                      return (
                        <div
                          key={`mobile-social-${index}`}
                          className="flex items-center gap-4"
                        >
                          {item.icons.map((social, idx) => {
                            const IconComponent = socialIcons[social.platform];
                            if (!isValidLink(social.link)) {
                              return null;
                            }
                            return (
                              <a
                                key={`mobile-social-icon-${idx}`}
                                href={social.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-[#c41e3a] transition-colors"
                              >
                                <IconComponent className="text-[20px]" />
                              </a>
                            );
                          })}
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div> */}

            {/* Call Button in Mobile Menu Footer */}
            <div className="flex justify-center items-center gap-1 bg-[#c41e3a] text-white px-2.5 py-1.5 rounded font-semibold mb-2 text-md">
              <MdCall className="text-[10px]" />
              <span>{ivrNumber}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-14 md:pt-28"></div>

      {scrolled && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 cursor-pointer bg-[#c41e3a] text-white h-10 w-10 rounded-full shadow-2xl hover:bg-[#e04a38] transition-all duration-300 z-50 flex items-center justify-center"
          aria-label="Back to top"
        >
          <AiOutlineArrowUp size={18} />
        </button>
      )}

      <CareerGuidanceForm isOpen={showCareer} onClose={handleCloseCareerForm} />
    </>
  );
}
