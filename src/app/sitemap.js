// app/sitemap.js

export default function sitemap() {
  const baseUrl = "https://teksacademy.com";

  const routes = [
    "/",
    "/course",

    // Courses
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

    // Branches
    "/branch/best-software-training-institute-ameerpet",
    "/branch/best-software-training-institute-hiteccity",
    "/branch/best-software-training-institute-secunderabad",
    "/branch/best-software-training-institute-dilsukhnagar",
    "/branch/best-software-training-institute-mehdipatnam",
    "/branch/best-software-training-institute-kukatpally",
    "/branch/best-software-training-institute-bangalore",
    "/branch/best-software-training-institute-visakhapatnam",
    "/branch/best-software-training-institute-kompally",

    // Success Stories
    "/success-stories",

    // Resources
    "/resources/ebook",
    "/resources/interview-questions",

    // Interview Questions
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

    // Discover
    "/discover/about-us",
    "/discover/gallery",
    "/discover/media",
    "/discover/contact-us",
    "/discover/support",

    // Placements
    "/placements/alumni",
    "/placements/recruiters",

    // Others
    "/apply-for-jobs",
    "/blogs",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),

    changeFrequency:
      route === "/" ||
      route === "/course" ||
      route.startsWith("/courses") ||
      route.startsWith("/branch")
        ? "daily"
        : "weekly",

    priority:
      route === "/"
        ? 1
        : route === "/course"
        ? 0.9
        : route.startsWith("/courses")
        ? 0.9
        : route.startsWith("/branch")
        ? 0.9
        : 0.8,
  }));
}