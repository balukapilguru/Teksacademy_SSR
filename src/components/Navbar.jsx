"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Building2,
  ChevronDown,
  Cloud,
  Code2,
  Database,
  Facebook,
  FileQuestion,
  Headphones,
  Image as ImageIcon,
  Info,
  Instagram,
  Linkedin,
  Mail,
  Megaphone,
  Menu,
  Newspaper,
  Phone,
  PlayCircle,
  Ruler,
  Smartphone,
  Sparkles,
  Trophy,
  UserCircle2,
  Users,
  X,
  Youtube,
} from "lucide-react";
import { Button } from "@/components/ui/button";
// import { branchesData } from "./branchesData";   // make sure this file exists
import teksLogo from "../app/assets/teks-logo.png";

const courses = [
  { title: "Full-Stack Python", desc: "Python with Django, Flask & modern web frameworks.", href: "/courses/full-stack-python", icon: Code2 },
  { title: "Full-Stack Java", desc: "Core Java, Spring Boot, Hibernate & front-end tools.", href: "/courses/full-stack-java", icon: Code2 },
  { title: "Data Science", desc: "Python, ML, Power BI & live analytics projects.", href: "/courses/data-science", icon: Database },
  { title: "AWS & DevOps", desc: "Cloud, CI/CD, Docker, Jenkins & Kubernetes.", href: "/courses/aws-devops", icon: Cloud },
  { title: "Digital Marketing", desc: "SEO, Google Ads, Analytics & social strategy.", href: "/courses/digital-marketing", icon: Megaphone },
  { title: "BIM", desc: "Revit, AutoCAD, Navisworks & AEC coordination.", href: "/courses/bim", icon: Ruler },
];

const resources = [
  { title: "E-Books", desc: "Free PDFs across Python, Java, AWS and more.", href: "/resources/ebook", icon: BookOpen },
  { title: "Video Lectures", desc: "Hundreds of hours of free recorded sessions.", href: "/resources/video-lectures", icon: PlayCircle },
  { title: "Interview Questions", desc: "Curated question bank from real interviews.", href: "/resources/interview-questions", icon: FileQuestion },
];

const discover = [
  { title: "About Us", desc: "14 years of training expert software engineers.", href: "/discover/about-us", icon: Info },
  { title: "Gallery", desc: "Campuses, hackathons and student moments.", href: "/discover/gallery", icon: ImageIcon },
  { title: "Media", desc: "News, press and announcements.", href: "/discover/media", icon: Newspaper },
  { title: "Contact Us", desc: "Talk to a counsellor or visit a branch.", href: "/discover/contact-us", icon: Mail },
  { title: "Support", desc: "Help with classes, LMS and certificates.", href: "/discover/support", icon: Headphones },
];

const placements = [
  { title: "Alumni", desc: "Meet our graduates working at top companies.", href: "/placements/alumni", icon: Users },
  { title: "Recruiters", desc: "700+ hiring partners and counting.", href: "/placements/recruiters", icon: Trophy },
];

const navItems = [
  { label: "Home", href: "/" },
  { label: "Courses", mega: "courses", href: "/courses" },
  { label: "Branches", mega: "branches", href: "/branches" },
  { label: "Success Stories", href: "/success-stories" },
  { label: "Resources", mega: "resources" },
  { label: "Discover", mega: "discover" },
  { label: "Placements", mega: "placements" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileOpenMenu, setMobileOpenMenu] = useState(null);
  const pathname = usePathname();   // ✅ replace useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
    setMobileOpenMenu(null);
  }, [pathname]);

  // const renderMegaContent = (kind) => {
  //   if (kind === "courses") return <CardGrid items={courses} footerLink={{ href: "/courses", label: "All courses →" }} cols={2} />;
  //   if (kind === "resources") return <CardGrid items={resources} cols={1} narrow />;
  //   if (kind === "discover") return <CardGrid items={discover} cols={1} narrow />;
  //   if (kind === "placements") return <CardGrid items={placements} cols={1} narrow />;
  //   if (kind === "branches") return (
  //     <div className="bg-popover text-popover-foreground rounded-2xl shadow-elevated border border-border p-5 w-[min(720px,90vw)]">
  //       <div className="grid grid-cols-3 gap-2">
  //         {branchesData.map((b) => (
  //           <Link key={b.slug} href={`/branch/${b.slug}`} className="group flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-accent transition-colors">
  //             <span className="shrink-0 grid place-items-center w-9 h-9 rounded-lg bg-accent text-accent-foreground group-hover:bg-gradient-primary group-hover:text-primary-foreground transition-colors">
  //               <Building2 className="w-4 h-4" />
  //             </span>
  //             <div className="min-w-0">
  //               <div className="font-display font-bold text-sm text-primary truncate">{b.name}</div>
  //               <p className="text-[11px] text-muted-foreground">{b.phone}</p>
  //             </div>
  //           </Link>
  //         ))}
  //       </div>
  //       <div className="mt-3 pt-3 border-t border-border text-center">
  //         <Link href="/branches" className="text-sm font-semibold text-primary hover:text-primary-deep">View all branches →</Link>
  //       </div>
  //     </div>
  //   );
  //   return null;
  // };

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      {/* Top utility bar (unchanged except replacing a tags with Link where appropriate) */}
      <div className="hidden md:block bg-primary-deep text-primary-foreground text-xs">
        <div className="container flex h-10 items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <a href="tel:18001204748" className="flex items-center gap-1.5 hover:text-secondary-glow transition-colors">
              <Phone className="w-3.5 h-3.5" /> 1800-120-4748
            </a>
            <a href="#" className="hidden lg:flex items-center gap-1.5 hover:text-secondary-glow transition-colors">
              <Smartphone className="w-3.5 h-3.5" /> Download Mobile App
            </a>
            <Link href="/blogs" className="hidden lg:inline hover:text-secondary-glow transition-colors">Blogs</Link>
            <Link href="/refer-and-earn" className="hidden lg:inline hover:text-secondary-glow transition-colors">Refer &amp; Earn</Link>
            <Link href="/find-my-course" className="hidden lg:inline hover:text-secondary-glow transition-colors">Find My Course</Link>
          </div>
          <a href="/#final" className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-secondary-foreground font-semibold hover:scale-105 transition-transform">
            <Sparkles className="w-3.5 h-3.5" /> Mega Job Mela
          </a>
          <div className="flex items-center gap-4">
            <Link href="/discover/contact-us" className="hidden lg:inline-flex items-center px-3 py-1 rounded-full border border-primary-foreground/30 hover:bg-primary-foreground/10 transition-colors">
              1:1 Career Guidance
            </Link>
            <a href="#" className="hidden md:flex items-center gap-1.5 hover:text-secondary-glow transition-colors">
              <UserCircle2 className="w-3.5 h-3.5" /> Student Login
            </a>
            <div className="hidden lg:flex items-center gap-2 text-primary-foreground/80">
              <a href="https://www.facebook.com/teksacademy" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-primary-foreground"><Facebook className="w-3.5 h-3.5" /></a>
              <a href="https://www.instagram.com/teks_academy/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-primary-foreground"><Instagram className="w-3.5 h-3.5" /></a>
              <a href="https://www.youtube.com/@teksacademy/playlists" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-primary-foreground"><Youtube className="w-3.5 h-3.5" /></a>
              <a href="https://www.linkedin.com/company/teks-academy" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-primary-foreground"><Linkedin className="w-3.5 h-3.5" /></a>
            </div>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div className={`transition-all duration-300 ${scrolled ? "bg-background/90 backdrop-blur-xl border-b border-border shadow-sm" : "bg-background/80 backdrop-blur-md"}`}>
        <div className="container flex h-16 lg:h-20 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src={teksLogo.src} alt="Teks Academy — Transferring Experts Knowledge to Students" className="h-9 lg:h-11 w-auto" />
          </Link>

          {/* <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) =>
              item.mega ? (
                <div key={item.label} className="group relative">
                  <button className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-foreground/80 hover:text-primary transition-colors rounded-lg">
                    {item.label}
                    <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                  </button>
                  <div className="invisible opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 absolute left-1/2 -translate-x-1/2 top-full pt-3">
                    {renderMegaContent(item.mega)}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href || "/"}
                  className="px-3 py-2 text-sm font-semibold text-foreground/80 hover:text-primary transition-colors rounded-lg relative after:absolute after:left-3 after:right-3 after:bottom-1 after:h-0.5 after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav> */}

          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <Button variant="hero" size="sm" asChild>
              <Link href="/discover/contact-us">Apply for Jobs</Link>
            </Button>
          </div>

          <button
            className="lg:hidden p-2 rounded-lg hover:bg-muted"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile slide-in menu (same changes: Link to -> href) */}
      <div className={`lg:hidden fixed inset-0 top-16 z-40 transition-all duration-300 ${open ? "opacity-100 visible" : "opacity-0 invisible"}`}>
        <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
        <div className={`absolute top-0 right-0 h-[calc(100dvh-4rem)] w-[88%] max-w-sm bg-background shadow-elevated overflow-y-auto transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
          {/* <div className="p-5 flex flex-col gap-1">
            {navItems.map((item) => {
              if (!item.mega) {
                return (
                  <Link key={item.label} href={item.href || "/"} className="px-3 py-3.5 rounded-lg hover:bg-muted text-sm font-semibold border-b border-border">
                    {item.label}
                  </Link>
                );
              }
              const isOpen = mobileOpenMenu === item.label;
              const subItems =
                item.mega === "courses" ? courses :
                item.mega === "branches" ? branchesData.map(b => ({ title: b.name, desc: b.phone, href: `/branch/${b.slug}`, icon: Building2 })) :
                item.mega === "resources" ? resources :
                item.mega === "discover" ? discover :
                placements;
              return (
                <div key={item.label} className="border-b border-border">
                  <button
                    onClick={() => setMobileOpenMenu(isOpen ? null : item.label)}
                    className="w-full flex items-center justify-between px-3 py-3.5 text-sm font-semibold"
                    aria-expanded={isOpen}
                  >
                    {item.label}
                    <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="pb-3 pl-2 grid gap-2 animate-slide-down">
                      {subItems.map((s) => (
                        <Link key={s.title} href={s.href} className="flex gap-3 p-2.5 rounded-xl hover:bg-accent">
                          <span className="shrink-0 grid place-items-center w-9 h-9 rounded-lg bg-gradient-primary text-primary-foreground">
                            <s.icon className="w-4 h-4" />
                          </span>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-primary">{s.title}</div>
                            <p className="text-[11px] text-muted-foreground leading-snug truncate">{s.desc}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="mt-4 grid gap-2">
              <Button variant="hero" asChild>
                <Link href="/discover/contact-us">Apply for Jobs</Link>
              </Button>
              <a href="tel:18001204748" className="flex items-center justify-center gap-2 px-3 py-3 rounded-lg border border-border text-sm font-semibold hover:bg-muted">
                <Phone className="w-4 h-4" /> 1800-120-4748
              </a>
              <Link href="/discover/contact-us" className="flex items-center justify-center gap-2 px-3 py-3 rounded-lg bg-secondary text-secondary-foreground text-sm font-semibold">
                <Sparkles className="w-4 h-4" /> Mega Job Mela
              </Link>
            </div>

            <div className="mt-5 flex items-center justify-center gap-4 text-foreground/60">
              <a href="https://www.facebook.com/teksacademy" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-primary"><Facebook className="w-4 h-4" /></a>
              <a href="https://www.instagram.com/teks_academy/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-primary"><Instagram className="w-4 h-4" /></a>
              <a href="https://www.youtube.com/@teksacademy/playlists" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-primary"><Youtube className="w-4 h-4" /></a>
              <a href="https://www.linkedin.com/company/teks-academy" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-primary"><Linkedin className="w-4 h-4" /></a>
            </div>
          </div> */}
        </div>
      </div>
    </header>
  );
};

const CardGrid = ({ items, cols, narrow, footerLink }) => (
  <div className={`bg-popover text-popover-foreground rounded-2xl shadow-elevated border border-border p-5 ${narrow ? "w-[min(420px,90vw)]" : "w-[min(900px,90vw)]"}`}>
    <div className={`grid gap-3 ${cols === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
      {items.map((c) => (
        <Link key={c.title} href={c.href}>
          <div className="group/card flex gap-3 p-3 rounded-xl hover:bg-accent transition-colors">
            <span className="shrink-0 grid place-items-center w-11 h-11 rounded-xl bg-gradient-primary text-primary-foreground shadow-sm">
              <c.icon className="w-5 h-5" />
            </span>
            <div>
              <div className="font-display font-bold text-sm text-primary group-hover/card:text-primary-deep">{c.title}</div>
              <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{c.desc}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
    {footerLink && (
      <div className="mt-4 pt-3 border-t border-border text-center">
        <Link href={footerLink.href} className="text-sm font-semibold text-primary hover:text-primary-deep">{footerLink.label}</Link>
      </div>
    )}
  </div>
);

export default Navbar;