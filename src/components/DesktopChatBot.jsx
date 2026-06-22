"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  ChevronRight,
  Download,
  GraduationCap,
  MessageCircle,
  Minus,
  Phone,
  Send,
  Sparkles,
  User,
  X,
  FileText,
} from "lucide-react";
import { MobileOtpField } from "@/components/MobileOtpField";
import { coursesList } from "@/data/courses";
import { blogsApplyBaseUrl, buildApiUrl } from "@/lib/apiBaseUrls";
import { toast } from "react-hot-toast";

const PHONE_DISPLAY = "1800-120-4748";
const PHONE_HREF = "tel:18001204748";
const WHATSAPP =
  "https://api.whatsapp.com/send/?phone=916305475057&text&type=phone_number&app_absent=0";
const CHATBOT_SOURCE_ID = "63";
const CHAT_STORAGE_KEY = "teks_desktop_chat_v1";
const CHAT_PROFILE_KEY = "teks_desktop_chat_profile_v1";
const EBOOK_URL = "/resources/ebook";

const branches = [
  "Ameerpet",
  "Kukatpally",
  "Mehdipatnam",
  "Hitec City",
  "Secunderabad",
  "Dilsukhnagar",
  "Bangalore",
  "Visakhapatnam",
  // "Salem",
  "Kompally",
];

const mainActions = [
  { label: "Find My Course", next: "find" },
  { label: "View Courses", next: "courses" },
  { label: "Placement Info", next: "placements" },
  { label: "Download Curriculum", next: "brochure" },
];

const makeId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`;

const botMessage = (text, extras = {}) => ({
  id: makeId(),
  role: "bot",
  text,
  ...extras,
});

const userMessage = (text) => ({
  id: makeId(),
  role: "user",
  text,
});

const greet = (name = "") =>
  botMessage(
    `Hi ${name ? name.split(" ")[0] : "there"}, welcome to Teks Academy. How can I help you today?`,
    { actions: mainActions },
  );

const flow = {
  find: () => [
    botMessage("Great. What is your background?", {
      actions: [
        { label: "Student / Fresher", next: "find_interest" },
        { label: "Working Professional", next: "find_interest" },
        { label: "Career Switcher", next: "find_interest" },
      ],
    }),
  ],
  find_interest: () => [
    botMessage("Which area interests you most?", {
      actions: [
        { label: "Coding and Web Dev", next: "rec_python" },
        { label: "Data and AI", next: "rec_ds" },
        { label: "Cloud and DevOps", next: "rec_aws" },
        { label: "Digital Marketing", next: "rec_dm" },
        { label: "BIM / Design", next: "rec_bim" },
      ],
    }),
  ],
  rec_python: () => [
    botMessage(
      "Full Stack Python or Java is a good fit. You will learn backend, frontend, APIs, and real-time projects.",
      {
        link: {
          label: "View Full Stack Python",
          href: "/courses/best-full-stack-python-development-course-training-institute",
        },
        actions: [
          { label: "Back to menu", next: "menu" },
          { label: "View all courses", href: "/course" },
        ],
      },
    ),
  ],
  rec_ds: () => [
    botMessage(
      "Data Science is a strong choice. It covers Python, ML, Power BI, AI basics, and capstone projects.",
      {
        link: {
          label: "View Data Science",
          href: "/courses/best-data-science-course-training-institute",
        },
        actions: [
          { label: "Back to menu", next: "menu" },
          { label: "View all courses", href: "/course" },
        ],
      },
    ),
  ],
  rec_aws: () => [
    botMessage(
      "AWS and DevOps is great for cloud roles. You will learn AWS, Docker, Kubernetes, Jenkins, and Terraform.",
      {
        link: {
          label: "View AWS and DevOps",
          href: "/courses/best-awsplusdevops-course-training-institute",
        },
        actions: [
          { label: "Back to menu", next: "menu" },
          { label: "View all courses", href: "/course" },
        ],
      },
    ),
  ],
  rec_dm: () => [
    botMessage(
      "Digital Marketing is a practical path with SEO, Google Ads, Meta Ads, Analytics, and AI tools.",
      {
        link: {
          label: "View Digital Marketing",
          href: "/courses/best-digital-marketing-course-training-institute",
        },
        actions: [
          { label: "Back to menu", next: "menu" },
          { label: "View all courses", href: "/course" },
        ],
      },
    ),
  ],
  rec_bim: () => [
    botMessage(
      "BIM is a good fit for AEC careers. You can learn Revit, Navisworks, and BIM coordination.",
      {
        link: {
          label: "View BIM Course",
          href: "/courses/best-bim-building-information-modeling-course-training-institute",
        },
        actions: [
          { label: "Back to menu", next: "menu" },
          { label: "View all courses", href: "/course" },
        ],
      },
    ),
  ],
  courses: () => [
    botMessage(
      "You can browse all available courses with curriculum, fees, and duration.",
      {
        link: { label: "Open Courses", href: "/course" },
        actions: [
          { label: "Find My Course quiz", next: "find" },
          { label: "Back to menu", next: "menu" },
        ],
      },
    ),
  ],
  placements: () => [
    botMessage(
      "Teks Academy offers placement support, hiring partner access, interview preparation, and career guidance.",
      {
        link: { label: "See Success Stories", href: "/success-stories" },
        actions: [{ label: "Back to menu", next: "menu" }],
      },
    ),
  ],
  menu: () => [greet()],
};

const findCourse = (courseName) => {
  const normalized = courseName.trim().toLowerCase();
  return coursesList.find((course) =>
    [course.shortTitle, course.category, course.slug]
      .filter(Boolean)
      .some((value) => value.toLowerCase() === normalized),
  );
};

const validateText = (values) => {
  const nextErrors = {};

  if (!values.name.trim()) nextErrors.name = "Name is required";
  else if (/\d/.test(values.name))
    nextErrors.name = "Name should not contain numbers";
  else if (values.name.trim().length < 3)
    nextErrors.name = "Name must be at least 3 characters";

  if (!values.email.trim()) nextErrors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    nextErrors.email = "Enter a valid email";
  }

  if (!/^\d{10}$/.test(values.phone))
    nextErrors.phone = "Enter a valid 10-digit mobile number";

  return nextErrors;
};

const submitLead = async (payload) => {
  const response = await fetch(buildApiUrl(blogsApplyBaseUrl, "/lead/create"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const responseData = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(responseData.message || "Submission failed");
  }

  return responseData;
};

function ModalShell({ title, subtitle, onClose, children }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/55 p-3">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="border-b border-gray-100 px-5 py-4 pr-12">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          {subtitle && (
            <p className="mt-1 text-xs leading-5 text-gray-500">{subtitle}</p>
          )}
        </div>
        <div className="max-h-[75dvh] overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}

function FieldError({ children }) {
  return (
    <div className="min-h-4 text-xs font-medium text-red-600">{children}</div>
  );
}

function FieldLabel({ children }) {
  return (
    <label className="mb-1 block text-xs font-semibold text-gray-700">
      {children} <span className="text-red-500">*</span>
    </label>
  );
}

function BrochureModal({ onClose }) {
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    branch: "",
    city: "",
    course: "",
  });
  const [courseSearch, setCourseSearch] = useState("");
  const [showCourses, setShowCourses] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const courseBoxRef = useRef(null);

  const filteredCourses = useMemo(() => {
    const query = courseSearch.trim().toLowerCase();
    if (!query) return coursesList;

    return coursesList.filter((course) =>
      [course.shortTitle, course.category, course.slug, course.blurb]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [courseSearch]);

  useEffect(() => {
    const handler = (event) => {
      if (
        courseBoxRef.current &&
        !courseBoxRef.current.contains(event.target)
      ) {
        setShowCourses(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const updateValue = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateText(values);
    if (!values.branch) nextErrors.branch = "Branch is required";
    if (!values.city.trim()) nextErrors.city = "City is required";
    if (!values.course.trim()) nextErrors.course = "Course is required";
    if (!findCourse(values.course))
      nextErrors.course = "Please select a course from dropdown";
    if (!otpVerified) nextErrors.phone = "Please verify OTP";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const selectedCourse = findCourse(values.course);
    setSubmitting(true);

    try {
      await submitLead({
        name: values.name.trim(),
        email: values.email.trim(),
        number: values.phone.trim(),
        branch: values.branch,
        course_branch: values.branch,
        city: values.city.trim(),
        course: selectedCourse.shortTitle,
        source: "Download Syllabus—Website",
        crm_source: "Download Syllabus—Website",
        form_type: "Download Syllabus—Website",
        referredby: "website",
      });

      if (selectedCourse.brochureLink) {
        window.open(
          selectedCourse.brochureLink,
          "_blank",
          "noopener,noreferrer",
        );
      }

      toast.success("Form submitted successfully! Thank you. 🎉");
      onClose();
    } catch (error) {
      console.error("Curriculum form submission error:", error);
      toast.error(error.message || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalShell
      title="Download Curriculum"
      subtitle={`Fill the form and select a course to download the related curriculum. Phone: ${PHONE_DISPLAY}`}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <FieldLabel>Name</FieldLabel>
          <input
            type="text"
            value={values.name}
            onChange={(event) => updateValue("name", event.target.value)}
            placeholder="Enter your name"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#2a619d] focus:ring-2 focus:ring-[#2a619d]/20"
          />
          <FieldError>{errors.name}</FieldError>
        </div>

        <div>
          <FieldLabel>Email</FieldLabel>
          <input
            type="email"
            value={values.email}
            onChange={(event) => updateValue("email", event.target.value)}
            placeholder="Enter your email"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#2a619d] focus:ring-2 focus:ring-[#2a619d]/20"
          />
          <FieldError>{errors.email}</FieldError>
        </div>

        <div>
          <MobileOtpField
            value={values.phone}
            onChange={(event) => {
              const phone =
                typeof event === "string" ? event : event?.target?.value || "";
              updateValue("phone", phone.slice(0, 10));
              setOtpVerified(false);
            }}
            onVerified={setOtpVerified}
            error={errors.phone}
          />
        </div>

        <div>
          <FieldLabel>Branch</FieldLabel>
          <select
            value={values.branch}
            onChange={(event) => updateValue("branch", event.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#2a619d] focus:ring-2 focus:ring-[#2a619d]/20"
          >
            <option value="">Select Branch</option>
            {branches.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
          <FieldError>{errors.branch}</FieldError>
        </div>

        <div>
          <FieldLabel>City</FieldLabel>
          <input
            type="text"
            value={values.city}
            onChange={(event) => updateValue("city", event.target.value)}
            placeholder="Enter your city"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#2a619d] focus:ring-2 focus:ring-[#2a619d]/20"
          />
          <FieldError>{errors.city}</FieldError>
        </div>

        <div className="relative" ref={courseBoxRef}>
          <FieldLabel>Course</FieldLabel>
          <button
            type="button"
            onClick={() => {
              setCourseSearch(values.course);
              setShowCourses((prev) => !prev);
            }}
            className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm outline-none ${
              errors.course
                ? "border-red-500 bg-red-50"
                : "border-gray-300 bg-white"
            }`}
          >
            <span className={values.course ? "text-gray-900" : "text-gray-400"}>
              {values.course || "Search or select a course"}
            </span>
            <ChevronRight
              className={`h-4 w-4 text-gray-400 transition ${showCourses ? "rotate-90" : ""}`}
            />
          </button>

          {showCourses && (
            <div className="absolute left-0 right-0 top-full z-[90] mt-1 rounded-xl border border-gray-200 bg-white shadow-xl">
              <div className="border-b border-gray-100 p-2">
                <input
                  type="search"
                  value={courseSearch}
                  onChange={(event) => {
                    setCourseSearch(event.target.value);
                    setErrors((prev) => ({ ...prev, course: "" }));
                  }}
                  placeholder="Search courses..."
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#2a619d]"
                  autoFocus
                />
              </div>
              <div className="max-h-52 overflow-y-auto py-1">
                {filteredCourses.length ? (
                  filteredCourses.map((course) => (
                    <button
                      key={course.slug}
                      type="button"
                      onClick={() => {
                        updateValue("course", course.shortTitle);
                        setCourseSearch(course.shortTitle);
                        setShowCourses(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-blue-50"
                    >
                      <span className="block font-semibold text-gray-900">
                        {course.shortTitle}
                      </span>
                      <span className="block text-xs text-gray-500">
                        {course.blurb}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-3 text-sm text-red-600">
                    No matching course found.
                  </div>
                )}
              </div>
            </div>
          )}
          <FieldError>{errors.course}</FieldError>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#2a619d] px-4 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#214d7d] disabled:bg-gray-400"
        >
          {submitting ? "Submitting..." : "Download Curriculum"}
        </button>
      </form>
    </ModalShell>
  );
}

function ChatPanel({ onClose, onOpenBrochure }) {
  const [messages, setMessages] = useState([]);
  const [profile, setProfile] = useState({ name: "", phone: "", email: "" });
  const [profileErrors, setProfileErrors] = useState({});
  const [otpVerified, setOtpVerified] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [typing, setTyping] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showFormAlert, setShowFormAlert] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem(CHAT_PROFILE_KEY);
      const rawMessages = localStorage.getItem(CHAT_STORAGE_KEY);

      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        setProfile(parsedProfile);
        setProfileSaved(true);
        setMessages(
          rawMessages ? JSON.parse(rawMessages) : [greet(parsedProfile.name)],
        );
      } else {
        setMessages([
          botMessage(
            "Welcome to Teks Academy. Please share your details to start chat.",
          ),
        ]);
      }
    } catch {
      setMessages([
        botMessage(
          "Welcome to Teks Academy. Please share your details to start chat.",
        ),
      ]);
    }
  }, []);

  useEffect(() => {
    if (messages.length) {
      localStorage.setItem(
        CHAT_STORAGE_KEY,
        JSON.stringify(messages.slice(-30)),
      );
    }
  }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typing, profileSaved]);

  const updateProfile = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setProfileErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const submitProfile = async (event) => {
    event.preventDefault();
    const cleanProfile = {
      name: profile.name.trim(),
      email: profile.email.trim(),
      phone: profile.phone.trim().slice(0, 10),
    };
    const nextErrors = validateText(cleanProfile);
    if (!otpVerified) nextErrors.phone = "Please verify OTP";

    setProfileErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    try {
      await submitLead({
        name: cleanProfile.name,
        email: cleanProfile.email,
        number: cleanProfile.phone,
        course: "Chatbot",
        source: CHATBOT_SOURCE_ID,
        crm_source: "Chatbot",
        form_type: "chatbot",
        referredby: "website",
      });

      localStorage.setItem(CHAT_PROFILE_KEY, JSON.stringify(cleanProfile));
      setProfile(cleanProfile);
      setProfileSaved(true);
      setMessages((prev) => [
        ...prev,
        userMessage(cleanProfile.name),
        greet(cleanProfile.name),
      ]);
      
      toast.success("Thank you for submitting the form! 🎉");
    } catch (error) {
      console.error("Chat lead submission error:", error);
      toast.error(error.message || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAction = (action) => {
    // Check if profile is not saved and action is not a link
    if (!profileSaved && !action.href) {
      setShowFormAlert(true);
      setTimeout(() => setShowFormAlert(false), 3000);
      return;
    }

    // If action has href, navigate and close chat
    if (action.href) {
      window.location.href = action.href;
      onClose();
      return;
    }

    setMessages((prev) => [...prev, userMessage(action.label)]);

    if (action.next === "brochure") {
      onOpenBrochure();
      setMessages((prev) => [
        ...prev,
        botMessage("I opened the brochure form for you.", {
          actions: mainActions,
        }),
      ]);
      return;
    }

    setTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        ...(flow[action.next]?.() || [greet(profile.name)]),
      ]);
      setTyping(false);
    }, 500);
  };

  const handleMenuClick = () => {
    if (!profileSaved) {
      setShowFormAlert(true);
      setTimeout(() => setShowFormAlert(false), 3000);
      return;
    }
    handleAction({ label: "Menu", next: "menu" });
  };

  return (
    <div className="fixed bottom-6 right-6 z-[75] flex h-[600px] w-[400px] flex-col overflow-hidden rounded-2xl bg-white text-gray-900 shadow-2xl">
      <div className="flex items-center justify-between bg-[#2a619d] p-4 text-white">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-white/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-bold">Teks Academy Assistant</div>
            <div className="flex items-center gap-1.5 text-xs text-white/80">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              Online
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/15"
        >
          <Minus className="h-4 w-4" />
        </button>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-4"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {message.role === "bot" && (
              <div className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full bg-blue-100">
                <Sparkles className="h-4 w-4 text-blue-600" />
              </div>
            )}
            <div className="max-w-[80%] space-y-2">
              <div
                className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  message.role === "user"
                    ? "rounded-tr-sm bg-blue-600 text-white"
                    : "rounded-tl-sm border border-gray-200 bg-white text-gray-900"
                }`}
              >
                {message.text}
              </div>
              {message.link && (
                <Link
                  href={message.link.href}
                  className="inline-flex text-xs font-semibold text-blue-600"
                >
                  {message.link.label}
                </Link>
              )}
              {message.actions && message.role === "bot" && (
                <div className="flex flex-wrap gap-1.5">
                  {message.actions.map((action) => (
                    <button
                      key={`${action.label}-${action.next || action.href}`}
                      type="button"
                      onClick={() => {
                        if (action.href) {
                          window.location.href = action.href;
                          onClose();
                        } else {
                          handleAction(action);
                        }
                      }}
                      className="rounded-full border border-gray-200 bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-blue-600 hover:text-white"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {message.role === "user" && (
              <div className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full bg-gray-200">
                <User className="h-4 w-4 text-gray-600" />
              </div>
            )}
          </div>
        ))}

        {/* Form Alert Message */}
        {showFormAlert && (
          <div className="flex justify-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg text-sm max-w-[80%] animate-pulse">
              ⚠️ Please fill the form first to access the menu and chat features.
            </div>
          </div>
        )}

        {typing && (
          <div className="flex gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-blue-100">
              <Sparkles className="h-4 w-4 text-blue-600" />
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white px-3.5 py-3 text-xs text-gray-500">
              Typing...
            </div>
          </div>
        )}

        {!profileSaved && (
          <form
            onSubmit={submitProfile}
            className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm"
          >
            <div className="space-y-3">
              <div>
                <FieldLabel>Name</FieldLabel>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(event) =>
                    updateProfile("name", event.target.value)
                  }
                  placeholder="Enter your full name"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#2a619d]"
                />
                <FieldError>{profileErrors.name}</FieldError>
              </div>
              <div>
                <FieldLabel>Email</FieldLabel>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(event) =>
                    updateProfile("email", event.target.value)
                  }
                  placeholder="Enter your email"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#2a619d]"
                />
                <FieldError>{profileErrors.email}</FieldError>
              </div>
              <div>
                <MobileOtpField
                  value={profile.phone}
                  onChange={(event) => {
                    const phone =
                      typeof event === "string"
                        ? event
                        : event?.target?.value || "";
                    updateProfile("phone", phone.slice(0, 10));
                    setOtpVerified(false);
                  }}
                  onVerified={setOtpVerified}
                  error={profileErrors.phone}
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#FE543D] px-4 py-3 text-sm font-bold text-white disabled:bg-gray-400"
              >
                <Send className="h-4 w-4" />
                {submitting ? "Starting..." : "Start Chat"}
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="flex gap-2 border-t border-gray-200 bg-white p-2.5">
        <a
          href={WHATSAPP}
          target="_blank"
          rel="noreferrer"
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-green-50 py-2 text-xs font-semibold text-green-600 hover:bg-green-100"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          WhatsApp
        </a>
        <a
          href={PHONE_HREF}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-50 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-100"
        >
          <Phone className="h-3.5 w-3.5" />
          {PHONE_DISPLAY}
        </a>
        <button
          type="button"
          onClick={handleMenuClick}
          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
        >
          Menu
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

export const DesktopChatBot = () => {
  const [showBrochure, setShowBrochure] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (showBrochure || showChat) {
      document.body.classList.add("desktop-popup-open");
    } else {
      document.body.classList.remove("desktop-popup-open");
    }
    return () => {
      if (!showBrochure && !showChat) {
        document.body.classList.remove("desktop-popup-open");
      }
    };
  }, [showBrochure, showChat]);

  return (
    <>
      {/* Desktop Chat Button - Only visible on desktop */}
      <div className="hidden lg:block">
        <button
          onClick={() => setShowChat(true)}
          className="fixed bottom-20 right-6 z-50 flex items-center justify-center gap-2 rounded-full bg-[#2a619d] p-4 text-white shadow-lg transition-all duration-300 hover:bg-[#214d7d] hover:scale-105"
          aria-label="Open chat"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      </div>

      {/* Chat Panel */}
      {showChat && (
        <ChatPanel
          onClose={() => setShowChat(false)}
          onOpenBrochure={() => setShowBrochure(true)}
        />
      )}

      {/* Brochure Modal */}
      {showBrochure && <BrochureModal onClose={() => setShowBrochure(false)} />}

      <style jsx global>{`
        body.desktop-popup-open {
          overflow: hidden;
        }
      `}</style>
    </>
  );
};