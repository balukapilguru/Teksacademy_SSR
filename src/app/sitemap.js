import { courses as localCourses } from "@/data/courses";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://teksacademy.com").replace(/\/$/, "");
const BLOGS_API_URL = (
  process.env.NEXT_PUBLIC_BLOGS_APPLY_API_URL ||
  process.env.NEXT_BLOGS_APPLY_API_URL ||
  ""
).replace(/\/$/, "");

export const revalidate = 86400;

/**
 * 🔴 HARD SOURCE OF TRUTH (DO NOT TOUCH RANDOMLY)
 * If SEO matters, this is where control lives.
 */
const FIXED_SITEMAP_ROUTES = [
  "/",
  "/course",

  "/courses/best-full-stack-python-development-course-training-institute",
  "/courses/best-full-stack-java-development-course-training-institute",
  "/courses/best-data-science-course-training-institute",
  "/courses/best-awsplusdevops-course-training-institute",
  "/courses/best-digital-marketing-course-training-institute",
  "/courses/best-data-analytics-course-training-institute",
  "/courses/best-multimedia-course-training-institute",
  "/courses/best-bim-building-information-modeling-course-training-institute",
  "/courses/best-sap-fico-finance-and-controlling-course-training-institute",
  "/courses/best-medical-coding-course-training-institute",
  "/courses/best-testingtools-course-training-institute",
  "/courses/best-advance-excel-course-training-institute",
  "/courses/best-autocad-course-training-institute",
  "/courses/best-revit-mep-course-training-institute",
  "/courses/best-business-analytics-course-training-institute",
  "/courses/best-generative-ai-course-training-institute",
  "/courses/best-sapmm-course-training-institute",
  "/courses/best-cyber-security-course-training-institute",

  "/branch/best-software-training-institute-ameerpet",
  "/branch/best-software-training-institute-hiteccity",
  "/branch/best-software-training-institute-secunderabad",
  "/branch/best-software-training-institute-dilsukhnagar",
  "/branch/best-software-training-institute-mehdipatnam",
  "/branch/best-software-training-institute-kukatpally",
  "/branch/best-software-training-institute-bangalore",
  "/branch/best-software-training-institute-visakhapatnam",
  "/branch/best-software-training-institute-kompally",

  "/success-stories",
  "/resources/ebook",
  "/resources/interview-questions",

  "/interview-questions/python-interview-questions",
  "/interview-questions/java-interview-questions",
  "/interview-questions/data-science-interview-questions",
  "/interview-questions/digital-marketing-interview-questions",
  "/interview-questions/aws-dev-interview-questions",
  "/interview-questions/bim-interview-questions",
  "/interview-questions/software-testing-interview-questions",
  "/interview-questions/sap-interview-questions",
  "/interview-questions/multimedia-interview-questions",
  "/interview-questions/medical-coding-interview-questions",
  "/interview-questions/advanced-excel-interview-questions",
  "/interview-questions/auto-cad-interview-questions",
  "/interview-questions/revit-interview-questions",
  "/interview-questions/data-analytics-interview-questions",
  "/interview-questions/sap-mm-interview-questions",
  "/interview-questions/cyber-security-interview-questions",
  "/interview-questions/generative-ai-interview-questions",
  "/interview-questions/business-analytics-interview-questions",

  "/discover/about-us",
  "/discover/gallery",
  "/discover/media",
  "/discover/contact-us",
  "/discover/support",

  "/placements/alumni",
  "/placements/recruiters",

  "/apply-for-jobs",
  "/blogs",
];

const BRANCH_COURSE_ROUTES = [
  // Ameerpet
  "/courses/ameerpet/best-full-stack-python-development-course-training",
  "/courses/ameerpet/best-java-full-stack-developer-course",
  "/courses/ameerpet/best-data-science-training",
  "/courses/ameerpet/best-data-analytics-course-training",
  "/courses/ameerpet/best-cyber-security-course",
  "/courses/ameerpet/best-autocad-course",
  "/courses/ameerpet/best-revit-course",

  // Hitech City
  "/courses/hiteccity/best-data-science-course",
  "/courses/hiteccity/best-java-full-stack-course",
  "/courses/hiteccity/best-python-full-stack-course",
  "/courses/hiteccity/best-cyber-security-course",
  "/courses/hiteccity/best-aws-devops-course",
  "/courses/hiteccity/best-data-analytics-course",
  "/courses/hiteccity/best-business-analytics-course",

  // Secunderabad
  "/courses/secunderabad/best-data-science-course",
  "/courses/secunderabad/best-java-full-stack-course",
  "/courses/secunderabad/best-python-full-stack-course",
  "/courses/secunderabad/sap-fico-training",
  "/courses/secunderabad/best-data-analytics-course-training",
  "/courses/secunderabad/sap-mm-training",
  "/courses/secunderabad/sap-sd-training",

  // Dilsukhnagar
  "/courses/dilsukhnagar/best-data-science-course",
  "/courses/dilsukhnagar/best-java-full-stack-course",
  "/courses/dilsukhnagar/best-python-full-stack-course",
  "/courses/dilsukhnagar/best-digital-marketing-course",
  "/courses/dilsukhnagar/best-aws-devops-course",
  "/courses/dilsukhnagar/best-data-analytics-course",
  "/courses/dilsukhnagar/best-business-analytics-course",

  // Mehdipatnam
  "/courses/mehdipatnam/best-data-science-course",
  "/courses/mehdipatnam/best-bim-course",
  "/courses/mehdipatnam/best-java-full-stack-course",
  "/courses/mehdipatnam/best-python-full-stack-course",

  // Kukatpally
  "/courses/kukatpally/best-data-science-course",
  "/courses/kukatpally/best-java-full-stack-course",
  "/courses/kukatpally/best-python-full-stack-course",
  "/courses/kukatpally/best-aws-devops-course",
  "/courses/kukatpally/best-data-analytics-course",

  // Bangalore
  "/courses/bangalore/best-data-science-course",
  "/courses/bangalore/best-data-analytics-course",
  "/courses/bangalore/best-java-full-stack-course",
  "/courses/bangalore/best-python-full-stack-course",

  // Kompally
  "/courses/kompally/best-data-science-course",
  "/courses/kompally/best-java-full-stack-course",
  "/courses/kompally/best-python-full-stack-course",
  "/courses/kompally/data-analytics-course-training",

  // Visakhapatnam
  "/courses/visakhapatnam/best-data-science-course",
  "/courses/visakhapatnam/best-java-full-stack-course",
  "/courses/visakhapatnam/best-python-full-stack-course",
  "/courses/visakhapatnam/best-digital-marketing-course",
  "/courses/visakhapatnam/best-bim-course",
  "/courses/visakhapatnam/best-data-analytics-course",
  "/courses/visakhapatnam/best-autocad-course",
  "/courses/visakhapatnam/best-medical-coding-course",
];



/**
 * Optional: dynamic blog routes
 */
const getBlogRoutes = async () => {
  if (!BLOGS_API_URL) return [];

  try {
    const res = await fetch(`${BLOGS_API_URL}/blogs/getAll?pageSize=100`, {
      next: { revalidate },
    });

    if (!res.ok) return [];

    const data = await res.json();
    const posts = Array.isArray(data?.blogPosts) ? data.blogPosts : [];

    return posts
      .map((p) => p?.meta_url)
      .filter(Boolean)
      .map((slug) => `/blogs/${slug}`);
  } catch {
    return [];
  }
};

/**
 * Exact metadata control
 */
const EXACT_META = {
  "/": { changeFrequency: "daily", priority: 1 },
  "/course": { changeFrequency: "daily", priority: 0.9 },
  "/blogs": { changeFrequency: "daily", priority: 0.8 },
};

const getRouteMeta = (route) => {
  if (EXACT_META[route]) return EXACT_META[route];

  if (route.startsWith("/courses") || route.startsWith("/branch")) {
    return { changeFrequency: "daily", priority: 0.9 };
  }

  return { changeFrequency: "weekly", priority: 0.8 };
};

/**
 * Safety normalization (prevents duplicates like // or trailing /)
 */
const normalizeRoute = (route) => {
  if (!route || route === "/") return "/";
  return `/${route}`.replace(/\/+/g, "/").replace(/\/$/, "");
};

/**
 * MAIN EXPORT
 */
export default async function sitemap() {
  const blogRoutes = await getBlogRoutes();

 const routes = [
  ...FIXED_SITEMAP_ROUTES,
  ...BRANCH_COURSE_ROUTES,
  ...blogRoutes,
];

  const uniqueRoutes = [...new Set(routes.map(normalizeRoute))];

  return uniqueRoutes.map((route) => ({
    url: `${SITE_URL}${route === "/" ? "" : route}`,
    lastModified: new Date(),
    ...getRouteMeta(route),
  }));
}
