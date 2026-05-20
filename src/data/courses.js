// data/courses.js

export const courses = [
  // Full Stack & Coding
  {
    slug: "best-full-stack-java-development-course-training-institute",
    category: "Coding",
    shortTitle: "Full Stack Java",
    duration: "6 months",
    price: "₹28,000",
    blurb: "Master Java, Spring Boot, React, and microservices",
    interest: "Coding",
    budget: "Mid",
    experience: "Beginner",
    time: "Moderate"
  },
  {
    slug: "best-full-stack-python-development-course-training-institute",
    category: "Coding",
    shortTitle: "Full Stack Python",
    duration: "6 months",
    price: "₹27,500",
    blurb: "Django, FastAPI, React, and REST APIs",
    interest: "Coding",
    budget: "Mid",
    experience: "Beginner",
    time: "Moderate"
  },
  {
    slug: "best-cyber-security-course-training-institute",
    category: "Cybersecurity",
    shortTitle: "Cybersecurity",
    duration: "5 months",
    price: "₹32,000",
    blurb: "Ethical hacking, network security, and risk management",
    interest: "Coding",
    budget: "High",
    experience: "Intermediate",
    time: "Moderate"
  },
  {
    slug: "best-business-analytics-course-training-institute",
    category: "AI/ML",
    shortTitle: "Generative AI",
    duration: "4 months",
    price: "₹35,000",
    blurb: "LLMs, prompt engineering, GPT, and LangChain",
    interest: "Coding",
    budget: "High",
    experience: "Intermediate",
    time: "Intense"
  },
  {
    slug: "best-awsplusdevops-course-training-institute",
    category: "Cloud",
    shortTitle: "AWS + DevOps",
    duration: "5 months",
    price: "₹34,000",
    blurb: "AWS, CI/CD, Docker, Kubernetes, and Terraform",
    interest: "Cloud",
    budget: "High",
    experience: "Intermediate",
    time: "Moderate"
  },
  {
    slug: "best-data-science-course-training-institute",
    category: "Data & Analytics",
    shortTitle: "Data Science",
    duration: "8 months",
    price: "₹38,000",
    blurb: "Python, ML, Tableau, and AI fundamentals",
    interest: "Data & Analytics",
    budget: "High",
    experience: "Beginner",
    time: "Intense"
  },
  {
    slug: "best-data-analytics-course-training-institute",
    category: "Data & Analytics",
    shortTitle: "Data Analytics",
    duration: "4 months",
    price: "₹22,000",
    blurb: "Excel, SQL, Power BI, and statistics",
    interest: "Data & Analytics",
    budget: "Mid",
    experience: "Beginner",
    time: "Moderate"
  },
  {
    slug: "best-digital-marketing-course-training-institute",
    category: "Marketing",
    shortTitle: "Digital Marketing",
    duration: "3 months",
    price: "₹15,000",
    blurb: "SEO, Google Ads, Social Media, and Analytics",
    interest: "Marketing",
    budget: "Low",
    experience: "Beginner",
    time: "Light"
  },
  {
    slug: "best-bim-building-information-modeling-course-training-institute",
    category: "Design / 3D",
    shortTitle: "BIM-Revit MEP & Navisworks",
    duration: "5 months",
    price: "₹30,000",
    blurb: "MEP coordination, clash detection, and 3D modeling",
    interest: "Design / 3D",
    budget: "Mid",
    experience: "Beginner",
    time: "Moderate"
  },
  {
    slug: "best-autocad-course-training-institute",
    category: "Design / 3D",
    shortTitle: "AutoCAD",
    duration: "3 months",
    price: "₹18,000",
    blurb: "2D/3D drafting, architectural plans, and design",
    interest: "Design / 3D",
    budget: "Low",
    experience: "Beginner",
    time: "Light"
  },
  {
    slug: "best-medical-coding-course-training-institute",
    category: "Healthcare",
    shortTitle: "Medical Coding",
    duration: "4 months",
    price: "₹26,000",
    blurb: "CPT, ICD-10, and CPC certification prep",
    interest: "Data & Analytics",
    budget: "Mid",
    experience: "Beginner",
    time: "Moderate"
  },
  {
    slug: "best-sap-fico-finance-and-controlling-course-training-institute",
    category: "ERP",
    shortTitle: "SAP FICO",
    duration: "5 months",
    price: "₹42,000",
    blurb: "Finance & Controlling, GL, AP, AR, and asset accounting",
    interest: "Coding",
    budget: "High",
    experience: "Intermediate",
    time: "Moderate"
  },
  {
    slug: "best-sapmm-course-training-institute",
    category: "ERP",
    shortTitle: "SAP MM",
    duration: "4.5 months",
    price: "₹40,000",
    blurb: "Materials Management, procurement, and inventory",
    interest: "Coding",
    budget: "High",
    experience: "Intermediate",
    time: "Moderate"
  },
  {
    slug: "best-testingtools-course-training-institute",
    category: "Testing",
    shortTitle: "Testing Automation",
    duration: "4 months",
    price: "₹23,000",
    blurb: "Selenium, Java, CI/CD, and automation frameworks",
    interest: "Testing",
    budget: "Mid",
    experience: "Beginner",
    time: "Moderate"
  }
];

export function recommend(answers) {
  // If no answers, return first 6 courses
  if (!answers || Object.keys(answers).length === 0) {
    return courses.slice(0, 6);
  }

  let filtered = [...courses];

  // Filter by interest
  if (answers.interest) {
    filtered = filtered.filter(course => course.interest === answers.interest);
  }

  // Filter by budget
  if (answers.budget) {
    if (answers.budget === "Low") {
      filtered = filtered.filter(course => {
        const price = parseInt(course.price.replace(/[^0-9]/g, ''));
        return price < 20000;
      });
    } else if (answers.budget === "Mid") {
      filtered = filtered.filter(course => {
        const price = parseInt(course.price.replace(/[^0-9]/g, ''));
        return price >= 20000 && price <= 30000;
      });
    } else if (answers.budget === "High") {
      filtered = filtered.filter(course => {
        const price = parseInt(course.price.replace(/[^0-9]/g, ''));
        return price > 30000;
      });
    }
  }

  // Filter by experience
  if (answers.experience) {
    filtered = filtered.filter(course => course.experience === answers.experience);
  }

  // Filter by time commitment
  if (answers.time) {
    filtered = filtered.filter(course => course.time === answers.time);
  }

  // If no matches found, return top 6 courses
  if (filtered.length === 0) {
    return courses.slice(0, 6);
  }

  // Return top 6 matches
  return filtered.slice(0, 6);
}