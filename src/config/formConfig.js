const COURSE_OPTIONS = [
  "Full Stack Java",
  "Full Stack Python",
  "Cybersecurity",
  "Gen AI",
  "AWS+ DevOps",
  "Data Science",
  "Data Analytics",
  "Digital Marketing",
  "BIM- Revit MEP, NAVIS",
  "AutoCAD",
  "Medical Coding",
  "SAP FICO",
  "SAP MM",
  "Testing-Automation",
  "Multimedia",
  "Advanced Excel",
  "Revit MEP Certification",
  "Business Analytics",
];

const WEBINAR_SOURCES = ["webinarsform"];
const WHATSAPP_SOURCES = ["whatsappform"];
const CAREER_GUIDANCE_SOURCES = ["Career Guidance"];
const BATCH_REQUEST_SOURCES = ["Batch Request"];
const REQUEST_CALLBACK_SOURCES = ["Request Callback—Website"];
const DOWNLOAD_SYLLABUS_SOURCES = ["Download Syllabus—Website"];
const BRANCH_REQUEST_SOURCES = ["Branch Request - Website"];
const CONTACT_US_SOURCES = ["Contact Us - Website"];
const REQUEST_DEMO_SOURCES = ["Request Demo - Website"];
const EBOOK_SOURCES = ["Ebook—Website"];
const JOB_MELA_SOURCES = ["Job Mela"];
// const WEBSITES = ["PythonWebinerAttendance"];
const RECOMMENDED_COURSE_SOURCES = ["Recommended-Course", "ChatBot"];
const CHATBOT_SOURCES = ["ChatBot"];
const ENROLLNOW_SOURCES = ["Enrollnow"];
const ENQUIRYNOW_SOURCES = ["Enquirynow"];


const BRANCH_OPTIONS = [
  "Ameerpet",
  "Kukatpally",
  "Mehdipatnam",
  "Hitec City",
  "Secunderabad",
  "Dilsukhnagar",
  "Bangalore",
  "Visakhapatnam",
];

export {
  WEBINAR_SOURCES,
  WHATSAPP_SOURCES,
  CAREER_GUIDANCE_SOURCES,
  BATCH_REQUEST_SOURCES,
  REQUEST_CALLBACK_SOURCES,
  DOWNLOAD_SYLLABUS_SOURCES,
  BRANCH_REQUEST_SOURCES,
  CONTACT_US_SOURCES,
  REQUEST_DEMO_SOURCES,
  EBOOK_SOURCES,
  JOB_MELA_SOURCES,
  WEBSITES,
  RECOMMENDED_COURSE_SOURCES,
  CHATBOT_SOURCES,
  ENROLLNOW_SOURCES,
  ENQUIRYNOW_SOURCES,
  COURSE_OPTIONS,
  BRANCH_OPTIONS,
};

const CAREER_OPTIONS = [
  "Full Stack Java",
  "Full Stack Python",
  "Cyber Security",
  "Generative AI",
  "AWS + DevOps",
  "Data Science",
  "Data Analytics",
  "Digital Marketing",
];

const QUALIFICATION_OPTIONS = [
  "Fresher / Student",
  "Working IT Professional",
  "Career Switcher",
];

const MODE_OPTIONS = [
  "Online (Live)",
  "Offline (Classroom)",
  "Hybrid",
];

const FIELD_DEFINITIONS = {
  name: {
    id: "name",
    label: "Name",
    type: "text",
    required: true,
    placeholder: "Enter your name",
    validation: {
      minLength: 2,
      message: "Name must be at least 2 characters",
    },
  },
  email: {
    id: "email",
    label: "Email",
    type: "email",
    required: true,
    placeholder: "Enter your email",
    validation: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Please enter a valid email address",
    },
  },
  phone: {
    id: "phone",
    label: "Mobile Number",
    type: "phone",
    required: true,
    placeholder: "10-digit mobile number",
    validation: {
      pattern: /^\d{10}$/,
      message: "Mobile number must be exactly 10 digits",
    },
  },
  course: {
    id: "course",
    label: "Course",
    type: "searchableSelect",
    required: true,
    placeholder: "Search or select a course",
    searchPlaceholder: "Search courses...",
    options: COURSE_OPTIONS,
    optionLabelKey: "label",
    optionValueKey: "value",
    validation: {
      message: "Please select a course",
    },
  },
  career: {
    id: "career",
    label: "I want a career in",
    type: "select",
    required: true,
    placeholder: "Select a career path",
    options: CAREER_OPTIONS,
  },
  qualification: {
    id: "qualification",
    label: "My qualification is",
    type: "select",
    required: true,
    placeholder: "Select qualification",
    options: QUALIFICATION_OPTIONS,
  },
  preferredMode: {
    id: "preferredMode",
    label: "Preferred mode",
    type: "select",
    required: true,
    placeholder: "Select mode",
    options: MODE_OPTIONS,
  },
  branch: {
    id: "branch",
    label: "Branch",
    type: "select",
    required: true,
    placeholder: "Select Branch",
    options: BRANCH_OPTIONS,
    disableWhenPrefilled: true,
  },
  city: {
    id: "city",
    label: "City",
    type: "text",
    required: false,
    placeholder: "Enter your city",
  },
  message: {
    id: "message",
    label: "Message",
    type: "textarea",
    required: false,
    placeholder: "Your message here...",
    rows: 4,
  },
  companyName: {
    id: "companyName",
    label: "Company Name",
    type: "text",
    required: true,
    placeholder: "Enter company name",
  },
  designation: {
    id: "designation",
    label: "Designation",
    type: "text",
    required: true,
    placeholder: "Your designation",
  },
  issue: {
    id: "issue",
    label: "Issue / Query",
    type: "textarea",
    required: true,
    placeholder: "Describe your issue...",
    rows: 4,
  },
};

const DEFAULT_PAYLOAD_MAP = {
  name: "name",
  email: "email",
  phone: "number",
  course: "course",
  branch: "branch",
  city: "city",
  message: "message",
  issue: "issue",
  companyName: "company",
  designation: "designation",
  career: "course",
  qualification: "qualification",
  preferredMode: "course_branch",
};

const FORM_CONFIGS = {
  // Form: default
  // Button: Submit
  // Pages / Components: fallback usage across components, e.g. src/components/coursePage/CoursesOffered.jsx, src/components/Popupform.jsx
  // Route examples: various (used when form type not provided)
  // Source: Website
  default: {
    fields: ["name", "email", "phone", "course", "branch"],
    buttonText: "Submit",
    successMessage: "Form submitted successfully!",
    payloadMap: DEFAULT_PAYLOAD_MAP,
    staticPayload: {
      source: "Website",
      crm_source: "Website",
      form_type: "default",
      referredby: "default",
      timestamp: () => new Date().toISOString(),
    },
  },
  // Form: contact
  // Button: Submit
  // Pages / Components: src/app/discover/contact-us/Contactusclient.jsx (Contact Us page)
  // Route examples: /discover/contact-us
  // Source: Contact Us - Website
  contact: {
    fields: ["name", "email", "phone", "course", "branch", "city"],
    buttonText: "Submit",
    successMessage: "Thank you! We'll contact you soon.",
    payloadMap: DEFAULT_PAYLOAD_MAP,
    staticPayload: {
      source: "Contact Us - Website",
      crm_source: "Contact Us - Website",
      form_type: "contact",
      referredby: "contact",
      timestamp: () => new Date().toISOString(),
    },
  },
  // Form: support
  // Button: Submit Request
  // Pages / Components: src/app/discover/support/Supportclient.jsx (Support page)
  // Route examples: /discover/support
  // Source: enquiryform
  support: {
    fields: ["name", "email", "phone", "course", "branch", "issue"],
    buttonText: "Submit Request",
    successMessage: "Thank you! We'll contact you soon.",
    payloadMap: DEFAULT_PAYLOAD_MAP,
    staticPayload: {
      source: "Website",
      crm_source: "Website",
      form_type: "support",
      referredby: "support",
      timestamp: () => new Date().toISOString(),
    },
  },
  // Form: recruiter
  // Button: Submit
  // Pages / Components: src/app/placements/recruiters/page.js (Recruiters page)
  // Route examples: /placements/recruiters
  // Source: formdata
  recruiter: {
    fields: ["name", "email", "phone", "companyName", "designation"],
    buttonText: "Submit",
    successMessage: "Thank you! We'll contact you soon.",
    payloadMap: DEFAULT_PAYLOAD_MAP,
    staticPayload: {
      source: "Website",
      crm_source: "Website",
      form_type: "recruiter",
      referredby: "recruiter",
      timestamp: () => new Date().toISOString(),
    },
  },
  // Form: ebook
  // Button: Download E-Book
  // Pages / Components: src/app/resources/ebook/page.jsx, src/app/ebook/EbooksClient.jsx
  // Route examples: /resources/ebook
  // Source: Ebook—Website
  ebook: {
    fields: ["name", "email", "phone", "course", "branch"],
    buttonText: "Download E-Book",
    successMessage: "Your e-book is opening in a new tab.",
    payloadMap: DEFAULT_PAYLOAD_MAP,
    staticPayload: {
      source: "Ebook—Website",
      crm_source: "Ebook—Website",
      form_type: "ebook",
      referredby: "ebook",
      timestamp: () => new Date().toISOString(),
    },
  },
  // Form: home
  // Button: Submit
  // Pages / Components: src/components/home-page/ui-components/HomepageBanner.jsx and other homepage widgets
  // Route examples: /
  // Source: Website
  home: {
    fields: ["name", "email", "phone", "career", "qualification"],
    buttonText: "Submit",
    successMessage: "Thank you! We'll contact you soon.",
    payloadMap: DEFAULT_PAYLOAD_MAP,
    staticPayload: {
      source: "Website",
      crm_source: "Website",
      form_type: "home",
      referredby: "home",
      timestamp: () => new Date().toISOString(),
    },
  },
  // Form: career
  // Button: Submit
  // Pages / Components: src/components/Navbar.jsx (career callback), other career widgets
  // Route examples: various header/footer callbacks
  // Source: Request Callback—Website
  career: {
    fields: ["name", "email", "phone", "career", "qualification"],
    buttonText: "Submit",
    successMessage: "Thank you! We'll contact you soon.",
    payloadMap: DEFAULT_PAYLOAD_MAP,
    staticPayload: {
      source: "Career Guidance",
      crm_source: "Career Guidance",
      form_type: "Career Guidance",
      referredby: "Career Guidance",
      timestamp: () => new Date().toISOString(),
    },
  },
  // Form: excel
  // Button: Request Call Back
  // Pages / Components: src/components/home-page/ui-components/Excel.jsx (Excel form on homepage)
  // Source: Request Callback—Website
  excel: {
    fields: ["name", "email", "phone", "message"],
    buttonText: "Request Call Back",
    successMessage: "Thank you! We'll contact you soon.",
    payloadMap: DEFAULT_PAYLOAD_MAP,
    staticPayload: {
      source: "Request Callback—Website",
      crm_source: "Request Callback—Website",
      form_type: "excel",
      referredby: "excel",
      timestamp: () => new Date().toISOString(),
    },
  },
  // Form: syllabus
  // Button: Download Brochure
  // Pages / Components: src/components/coursePage/DownloadCourseBrochure.jsx (Download brochure flows)
  // Source: Download Syllabus—Website
  syllabus: {
    fields: ["name", "email", "phone", "branch", "city", "course"],
    buttonText: "Download Brochure",
    successMessage: "Thank you! We'll send the brochure shortly.",
    payloadMap: DEFAULT_PAYLOAD_MAP,
    staticPayload: {
      source: "Download Syllabus—Website",
      crm_source: "Download Syllabus—Website",
      form_type: "syllabus",
      referredby: "syllabus",
      timestamp: () => new Date().toISOString(),
    },
  },
  // Form: banner
  // Button: Enroll Now
  // Pages / Components: src/components/home-page/ui-components/HomepageBanner.jsx, course page banners
  // Source: Enrollnow
  banner: {
    fields: ["name", "email", "phone", "course", "branch"],
    buttonText: "Enroll Now",
    successMessage: "Thank you! We'll contact you soon.",
    payloadMap: DEFAULT_PAYLOAD_MAP,
    staticPayload: {
      source: "Enrollnow",
      crm_source: "Enrollnow",
      form_type: "Enrollnow",
      referredby: "Enrollnow",
      timestamp: () => new Date().toISOString(),
    },
  },
  // Form: EnrollNow
  // Button: Enroll Now
  // Pages / Components: src/components/coursePage/CareerPath.jsx, src/components/coursePage/Banner.jsx, src/components/coursePage/OverViewOfOnline.jsx
  // Source: Enrollnow
  Enrollnow: {
    fields: ["name", "email", "phone", "course", "branch"],
    buttonText: "Enroll Now",
    successMessage: "Thank you! We'll contact you soon.",
    payloadMap: DEFAULT_PAYLOAD_MAP,
    staticPayload: {
      source: "Enrollnow",
      crm_source: "Enrollnow",
      form_type: "Enrollnow",
      referredby: "Enrollnow",
      timestamp: () => new Date().toISOString(),
    },
  },
  // Form: requestCallback
  // Button: Request Callback
  // Pages / Components: src/components/home-page/ui-components/NutShell.jsx and other callback widgets
  // Source: Request Callback—Website
  requestCallback: {
    fields: ["name", "email", "phone", "course", "branch"],
    buttonText: "Request Callback",
    successMessage: "Thank you! We'll contact you soon.",
    payloadMap: DEFAULT_PAYLOAD_MAP,
    staticPayload: {
      source: "Request Callback—Website",
      crm_source: "Request Callback—Website",
      form_type: "requestCallback",
      referredby: "requestCallback",
      timestamp: () => new Date().toISOString(),
    },
  },
  // Form: reserveSpot
  // Button: Reserve Spot
  // Pages / Components: src/components/coursePage/ReserveYourSpot.jsx
  // Source: Reserve Spot—Website
  reserveSpot: {
    fields: ["name", "email", "phone", "course", "branch"],
    buttonText: "Reserve Spot",
    successMessage: "Thank you! We'll contact you soon.",
    payloadMap: DEFAULT_PAYLOAD_MAP,
    staticPayload: {
      source: "Website",
      crm_source: "Website",
      form_type: "reserveSpot",
      referredby: "reserveSpot",
      timestamp: () => new Date().toISOString(),
    },
  },
  // Form: enquiry
  // Button: Submit
  // Pages / Components: src/app/course/CoursesClient.jsx, src/app/courses/CoursesClient.jsx, src/app/branch/BranchClient.jsx, src/components/coursePage/UniversitiesTable.jsx (course enquiry flows)
  // Route examples: /course/*, /courses/*, /branch/*
  // Source: Website
  enquiry: {
    fields: ["name", "email", "phone", "course", "branch"],
    buttonText: "Submit",
    successMessage: "Thank you! We'll contact you soon.",
    payloadMap: DEFAULT_PAYLOAD_MAP,
    staticPayload: {
      source: "Enquirynow",
      crm_source: "Enquirynow",
      form_type: "Enquirynow",
      referredby: "Enquirynow",
      timestamp: () => new Date().toISOString(),
    },
  },
};

const ROUTE_FORM_TYPE_MAP = [
  { pattern: /^\/$/, formType: "home" },
  { pattern: /^\/discover\/contact-us/, formType: "contact" },
  { pattern: /^\/discover\/support/, formType: "support" },
  { pattern: /^\/placements\/recruiters/, formType: "recruiter" },
  { pattern: /^\/resources\/ebook/, formType: "ebook" },
  { pattern: /^\/course\/.*/, formType: "enquiry" },
  { pattern: /^\/courses\/.*/, formType: "enquiry" },
  { pattern: /^\/branch\/.*/, formType: "enquiry" },
];

export const detectFormTypeByPathname = (pathname = "") => {
  const cleaned = pathname.split("?")[0].replace(/\/$/, "");
  const match = ROUTE_FORM_TYPE_MAP.find(({ pattern }) => pattern.test(cleaned));
  return match ? match.formType : "default";
};

export const getFieldConfig = (fieldId) => FIELD_DEFINITIONS[fieldId];

export const getFormConfig = (formType) => {
  if (!formType) return FORM_CONFIGS.default;
  const normalized = String(formType).trim();
  return FORM_CONFIGS[normalized] || FORM_CONFIGS[normalized.toLowerCase()] || FORM_CONFIGS.default;
};

const safeGet = (obj, path) => {
  if (!obj || !path) return undefined;
  return String(path)
    .split(".")
    .reduce((current, key) => (current && current[key] !== undefined ? current[key] : undefined), obj);
};

export const normalizeOption = (option, field) => {
  if (option == null) return { label: "", value: "" };
  if (typeof option === "string") return { label: option, value: option };

  const labelKey = field?.optionLabelKey || "label";
  const valueKey = field?.optionValueKey || "value";

  return {
    label:
      option[labelKey] || option.label || option.name || option.title || String(option.value || option.id || ""),
    value: option[valueKey] ?? option.value ?? option.id ?? option.name ?? option.title ?? "",
  };
};

export const buildPayload = (formValues, formConfig) => {
  const payload = {};
  const payloadMap = formConfig?.payloadMap || FORM_CONFIGS.default.payloadMap;

  Object.entries(payloadMap).forEach(([fieldKey, payloadKey]) => {
    if (formValues[fieldKey] !== undefined) {
      payload[payloadKey] = formValues[fieldKey];
    }
  });

  if (formConfig?.staticPayload) {
    Object.entries(formConfig.staticPayload).forEach(([key, value]) => {
      payload[key] = typeof value === "function" ? value(formValues) : value;
    });
  }

  return payload;
};
