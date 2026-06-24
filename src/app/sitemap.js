import { courses as localCourses } from "@/data/courses";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://teksacademy.com").replace(/\/$/, "");
const BLOGS_API_URL = (
  process.env.NEXT_PUBLIC_BLOGS_APPLY_API_URL ||
  process.env.NEXT_BLOGS_APPLY_API_URL ||
  ""
).replace(/\/$/, "");

export const revalidate = 86400;

const staticRoutes = [
  "/",
  "/course",
  "/courses",
  "/branch",
  "/success-stories",
  "/resources/ebook",
  "/resources/interview-questions",
  "/discover/about-us",
  "/discover/gallery",
  "/discover/media",
  "/discover/contact-us",
  "/discover/support",
  "/placements/alumni",
  "/placements/recruiters",
  "/apply-for-jobs",
  "/blogs",
  "/ebook",
  "/find-my-course",
];

const courseSlugs = [
  ...localCourses.map((course) => course.slug),
  "best-multimedia-course-training-institute",
  "best-advance-excel-course-training-institute",
  "best-revit-mep-course-training-institute",
  "best-generative-ai-course-training-institute",
];

const branchSlugs = [
  "best-software-training-institute-ameerpet",
  "best-software-training-institute-hiteccity",
  "best-software-training-institute-secunderabad",
  "best-software-training-institute-dilsukhnagar",
  "best-software-training-institute-mehdipatnam",
  "best-software-training-institute-kukatpally",
  "best-software-training-institute-bangalore",
  "best-software-training-institute-visakhapatnam",
  "best-software-training-institute-kompally",
];

const interviewQuestionSlugs = [
  "python-interview-questions",
  "java-interview-questions",
  "data-science-interview-questions",
  "digital-marketing-interview-questions",
  "aws-dev-interview-questions",
  "bim-interview-questions",
  "software-testing-interview-questions",
  "sap-interview-questions",
  "multimedia-interview-questions",
  "medical-coding-interview-questions",
  "advanced-excel-interview-questions",
  "auto-cad-interview-questions",
  "revit-interview-questions",
  "data-analytics-interview-questions",
  "sap-mm-interview-questions",
  "cyber-security-interview-questions",
  "generative-ai-interview-questions",
  "business-analytics-interview-questions",
];

const getBlogRoutes = async () => {
  if (!BLOGS_API_URL) return [];

  try {
    const response = await fetch(`${BLOGS_API_URL}/blogs/getAll?pageSize=100`, {
      next: { revalidate },
    });

    if (!response.ok) return [];

    const data = await response.json();
    const posts = Array.isArray(data?.blogPosts) ? data.blogPosts : [];

    return posts
      .map((post) => post?.meta_url)
      .filter(Boolean)
      .map((slug) => `/blogs/${slug}`);
  } catch {
    return [];
  }
};

const getRouteMeta = (route) => {
  if (route === "/") {
    return { changeFrequency: "daily", priority: 1 };
  }

  if (route === "/course" || route === "/courses" || route.startsWith("/courses/")) {
    return { changeFrequency: "daily", priority: 0.9 };
  }

  if (route === "/branch" || route.startsWith("/branch/")) {
    return { changeFrequency: "daily", priority: 0.85 };
  }

  if (route.startsWith("/blogs/")) {
    return { changeFrequency: "weekly", priority: 0.7 };
  }

  return { changeFrequency: "weekly", priority: 0.8 };
};

const normalizeRoute = (route) => {
  if (!route || route === "/") return "/";
  return `/${route}`.replace(/\/+/g, "/").replace(/\/$/, "");
};

export default async function sitemap() {
  const blogRoutes = await getBlogRoutes();
  const routes = [
    ...staticRoutes,
    ...courseSlugs.map((slug) => `/courses/${slug}`),
    ...branchSlugs.map((slug) => `/branch/${slug}`),
    ...interviewQuestionSlugs.map((slug) => `/interview-questions/${slug}`),
    ...blogRoutes,
  ];

  const uniqueRoutes = [...new Set(routes.map(normalizeRoute))];
  const lastModified = new Date();

  return uniqueRoutes.map((route) => ({
    url: `${SITE_URL}${route === "/" ? "" : route}`,
    lastModified,
    ...getRouteMeta(route),
  }));
}
