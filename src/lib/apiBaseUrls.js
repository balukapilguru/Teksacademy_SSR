export const teksSsrBaseUrl =
  process.env.NEXT_PUBLIC_TEKS_SSR_API_URL || process.env.NEXT_TEKS_SSR_API_URL || "";

export const blogsApplyBaseUrl =
  process.env.NEXT_PUBLIC_BLOGS_APPLY_API_URL || process.env.NEXT_BLOGS_APPLY_API_URL || "";

export const buildApiUrl = (baseUrl, path) => {
  const cleanBase = (baseUrl || "").replace(/\/$/, "");
  const cleanPath = (path || "").replace(/^\//, "");

  return cleanBase ? `${cleanBase}/${cleanPath}` : `/${cleanPath}`;
};
