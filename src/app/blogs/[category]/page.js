"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IoLogoLinkedin } from "react-icons/io5";
import { SiFacebook } from "react-icons/si";
import { FaXTwitter } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import axios from "axios";
import Head from "next/head";
import { SlCalender } from "react-icons/sl";
// import "react-quill/dist/quill.snow.css";
const mailicon =
  "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/success_Stories/emailicon.webp";

const twitter =
  "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/twitter_icon.webp";

const BlogDetails = () => {
  const { category } = useParams();

  const api = process.env.NEXT_PUBLIC_BLOGS_APPLY_API_URL || process.env.NEXT_BLOGS_APPLY_API_URL;

  console.log("dsgfsdhfj", category);

  const [blogData, setBlogData] = useState(null);
  const [blogDetailes, setBlogDetailes] = useState(null);
  const [loading, setLoading] = useState(true); // Initialize loading as true
  const [currentShareUrl, setCurrentShareUrl] = useState("");
  const [comments, setComments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  //comments//

  const [formData, setFormData] = useState({
    comments: "",
    name: "",
    email: "",
    phoneNumber: "",
    occupation: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!formData.comments.trim()) newErrors.comments = "Comment is required";
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.phoneNumber.trim())
      newErrors.phoneNumber = "Phone number is required";
    else if (!phoneRegex.test(formData.phoneNumber))
      newErrors.phoneNumber = "Must be 10 digits";

    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);

    try {
      const payload = { ...formData, blogId: blogDetailes?.id };
      const response = await axios.post(
        `${api}/comments/createcomment`,
        payload
      );
      setSuccess("✅ Comment posted successfully!");
      setFormData({
        comments: "",
        name: "",
        email: "",
        phoneNumber: "",
        occupation: "",
      });
      // Refresh comments after successful submission
      fetchComments();
    } catch (error) {
      console.error(error);
      setSuccess("❌ Failed to post comment. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Separate function to fetch comments
  const fetchComments = async () => {
    try {
      const commentsUrl = `${api}/comments/comments/blog/${blogDetailes?.id}`;
      const commentsRes = await fetch(commentsUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!commentsRes.ok) {
        const errorText = await commentsRes.text();
        throw new Error(
          `Comments fetch failed: ${commentsRes.status} - ${errorText}`
        );
      }

      const commentsData = await commentsRes.json();
      setComments(commentsData?.comments || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  //comments//

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // 1. Fetch blog by ID
        const idUrl = `${api}/blogs/getblogbyId/${category}`;
        const idRes = await fetch(idUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!idRes.ok) {
          const errorText = await idRes.text();
          throw new Error(`ID fetch failed: ${idRes.status} - ${errorText}`);
        }

        const idData = await idRes.json();
        const blogDetails = idData?.data;
        setBlogDetailes(blogDetails);

        // 2. Extract course (category) from blog details
        const courseCategory = blogDetails?.category;

        // 3. Fetch category blogs using extracted category
        const categoryUrl = `${api}/blogs/blogcategory?category=${courseCategory}&search=&pageSize=`;
        const categoryRes = await fetch(categoryUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!categoryRes.ok) {
          const errorText = await categoryRes.text();
          throw new Error(
            `Category fetch failed: ${categoryRes.status} - ${errorText}`
          );
        }

        const categoryData = await categoryRes.json();
        setBlogData(categoryData);

        // 4. Fetch comments for this blog
        const commentsUrl = `${api}/comments/comments/blog/${blogDetails?.id}`;
        const commentsRes = await fetch(commentsUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!commentsRes.ok) {
          const errorText = await commentsRes.text();
          throw new Error(
            `Comments fetch failed: ${commentsRes.status} - ${errorText}`
          );
        }

        const commentsData = await commentsRes.json();
        setComments(commentsData?.comments || []);
      } catch (error) {
        console.error("Error fetching blog data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [api, category]);

  console.log("djfhsjk", comments);

  const setBlogItem = (blog) => {
    localStorage.setItem("blog", JSON.stringify(blog));
  };

  const sortTheOrder = (first, second, third) => {
    const merged = [...first, ...second, ...third];

    const sorted = merged.sort(
      (a, b) => Number(a.position) - Number(b.position)
    );

    return sorted;
  };

  const validateSize = (
    width,
    height,
    defaultW = 400,
    defaultH = 300,
    min = 100,
    max = 1000
  ) => {
    const parseValue = (val) => {
      if (typeof val === "string") {
        // Remove 'px' and parse the number
        return parseInt(val.replace("px", "").trim(), 10);
      }
      return parseInt(val, 10); // for direct numbers
    };

    const w = parseValue(width);
    const h = parseValue(height);

    return {
      width: isNaN(w) || w < min || w > max ? defaultW : w,
      height: isNaN(h) || h < min || h > max ? defaultH : h,
    };
  };

  const convertQuillToTailwind = (html) => {
    // Replace alignment classes
    html = html
      .replace(/ql-align-right/g, "text-right")
      .replace(/ql-align-center/g, "text-center")
      .replace(/ql-align-left/g, "text-left");

    // Map Quill size classes to Tailwind classes
    const classMap = {
      "ql-size-small": "text-sm",
      "ql-size-normal": "text-base",
      "ql-size-large": "text-2xl",
      "ql-size-huge": "text-3xl",
    };

    Object.entries(classMap).forEach(([quillClass, tailwindClass]) => {
      html = html.replace(new RegExp(quillClass, "g"), tailwindClass);
    });

    console.log("sdjhfsjdf", html);

    return html;
  };

  const formattedTitle = blogDetailes?.meta_url
    ?.replace(/[^a-zA-Z0-9 ]/g, "")
    ?.replace(/\s+/g, "-")
    ?.toLowerCase();

  const shareUrl = `${
    typeof window !== "undefined" ? window.location.origin : ""
  }/Blogs/${formattedTitle}/${blogDetailes?.id}`;

  const awsBaseUrl =
    "https://teksacademy.s3.ap-south-1.amazonaws.com/website/blogs/";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <div className="main_container">
        <title>{blogDetailes.meta_title}</title>
        <meta name="description" content={blogDetailes.meta_description} />
        {blogData ? (
          <div className="w-full py-6">
            {/* Main flex container with the three columns */}
            <div className="flex flex-col md:flex-col lg:flex-row justify-between">
              {/* Share buttons column - 20% width on desktop, full width on mobile */}
              <div className="w-full lg:w-[10%] flex justify-center mb-4 lg:mb-0">
                {/* Mobile horizontal share buttons */}
                <div className="flex lg:hidden space-x-4 p-2 border border-black rounded">
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                      shareUrl
                    )}`}
                    className="text-[#0077b5] hover:text-[#0077b5] p-1"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on LinkedIn"
                  >
                    <IoLogoLinkedin size={36} />
                  </a>

                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      shareUrl
                    )}`}
                    className="text-[#0866ff] hover:text-[#0866ff] p-1"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on Facebook"
                  >
                    <SiFacebook size={36} />
                  </a>

                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                      shareUrl
                    )}&text=${encodeURIComponent(
                      blogDetailes?.title || "Check out this blog!"
                    )}`}
                    className="text-[#c0c0c0] flex justify-center items-center bg-black hover:text-[#c0c0c0] hover:bg-black rounded-full p-2"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on Twitter"
                  >
                    <img src={twitter} alt="gmail" className="w-6 h-6 " />
                  </a>

                  <a
                    href={`mailto:?subject=${encodeURIComponent(
                      "Check out this blog!"
                    )}&body=${encodeURIComponent(
                      `Hey,\n\nI found this interesting blog and thought you might like it:\n\n${shareUrl}`
                    )}`}
                    className="text-[#a7a7a7] hover:text-[#f10000]"
                    rel="noopener noreferrer"
                    aria-label="Share via Email"
                  >
                    <img src={mailicon} alt="gmail" className="w-10 h-10" />
                  </a>
                </div>

                {/* Desktop vertical share buttons */}
                <div className="hidden lg:flex items-center h-full">
                  <div className="border border-black p-3 rounded">
                    <div className="flex flex-col gap-4">
                      <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                          shareUrl
                        )}`}
                        className="text-[#0077b5] hover:text-[#0077b5] "
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <IoLogoLinkedin size={36} />
                      </a>

                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                          shareUrl
                        )}`}
                        target="_blank"
                        className="text-[#0866ff] hover:text-[#0866ff] "
                        rel="noopener noreferrer"
                      >
                        <SiFacebook size={36} />
                      </a>

                      <a
                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                          shareUrl
                        )}&text=${encodeURIComponent(blogDetailes?.title)}`}
                        target="_blank"
                        className="text-[#c0c0c0] flex justify-center items-center bg-black hover:text-[#c0c0c0] hover:bg-black rounded-full p-2 mr-1"
                        rel="noopener noreferrer"
                      >
                        <img src={twitter} alt="gmail" className="w-5 h-5" />
                      </a>

                      <a
                        href={`mailto:?subject=${encodeURIComponent(
                          "Check out this blog!"
                        )}&body=${encodeURIComponent(
                          `Hey,\n\nI found this interesting blog and thought you might like it:\n\n${shareUrl}`
                        )}`}
                        target="_blank"
                        className="text-[#a7a7a7] hover:text-[#f10000] "
                        rel="noopener noreferrer"
                      >
                        <img src={mailicon} alt="gmail" className="w-10 h-10" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main content column - 50% width on desktop, full width on mobile */}
              <div className=" w-full lg:w-[60%] p-3 max-h-screen overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden border">
                <h3
                  className="font-semibold text-[#2A619D] text-[20px] pl-1 mb-3 "
                  style={{ fontFamily: "Roboto, Roboto Fallback" }}
                >
                  {blogDetailes?.category}
                </h3>

                <img
                  src={awsBaseUrl + blogDetailes.image_url}
                  alt={blogDetailes.image_url || "Image"}
                  className="w-full   mx-auto rounded  
             lg:h-[445px] "
                />

                <p
                  className="text-xs text-[#aaa] font-normal flex items-center gap-x-2 pl-1 mt-1"
                  style={{ fontFamily: "Roboto, Roboto Fallback" }}
                >
                  <SlCalender />
                  {blogDetailes?.postdate.split("T")[0]}
                </p>

                <h1
                  className="font-semibold  text-[32px]  pl-2 mb-1 "
                  style={{ fontFamily: "Roboto, Roboto Fallback " }}
                >
                  {blogDetailes?.title}
                </h1>

                {sortTheOrder(
                  blogDetailes.blogsimages,
                  blogDetailes.blogsimg,
                  blogDetailes.blogsvideos
                ).map((item) => {
                  const { width, height } = validateSize(
                    item.width,
                    item.height
                  );

                  return (
                    <div
                      key={item.id}
                      className="pt-2 bg-white font-light pl-2"
                    >
                      {/* Text block */}
                      {item.type === "text" && item.data && (
                        <div
                          // className="ql-editor"
                          // dangerouslySetInnerHTML={{ __html: item.data }}
                          style={{ fontFamily: "Roboto, Roboto Fallback" }}
                          dangerouslySetInnerHTML={{
                            __html: convertQuillToTailwind(item.data),
                          }}
                        />
                      )}

                      {/* Image block */}
                      {item.type === "image" &&
                        item.image &&
                        (() => {
                          const imageUrl = awsBaseUrl + item.image;
                          const imgElement = (
                            <img
                              src={awsBaseUrl + item.image}
                              alt={item.imagealt || "Image"}
                              className="rounded mx-auto d-block"
                              style={{
                                width: "100%",
                                maxWidth: `${width}px`,
                                height: "auto",
                              }}
                            />
                          );

                          return (
                            <div className="text-center">
                              {item.link ? (
                                <a
                                  href={item.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {imgElement}
                                </a>
                              ) : (
                                imgElement
                              )}
                            </div>
                          );
                        })()}

                      {/* Video block */}
                      {item.type === "video" && (
                        <div className="text-center">
                          {item.videolink ? (
                            <div className="d-block mx-auto rounded overflow-hidden">
                              <iframe
                                src={item.videolink.replace(
                                  "youtu.be/",
                                  "www.youtube.com/embed/"
                                )}
                                title="YouTube video"
                                className="rounded w-full mx-auto block lg:w-auto"
                                style={{
                                  height: "auto",
                                  aspectRatio: "16/9",
                                  ...(window.innerWidth >= 1024 && {
                                    width: `${width}px`,
                                    height: `${height}px`,
                                    aspectRatio: "unset",
                                  }),
                                }}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          ) : item.video ? (
                            <div className="block mx-auto rounded overflow-hidden">
                              <video
                                controls
                                className="rounded w-full h-auto sm:h-[200px] md:h-[280px] mx-auto block"
                                style={{
                                  width: `${width}px`,
                                  height: `${height}px`,
                                }}
                              >
                                <source
                                  src={awsBaseUrl + item.video}
                                  type="video/mp4"
                                />
                                Your browser does not support the video tag.
                              </video>
                            </div>
                          ) : null}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Comments section - preserved from previous fixes */}
                <div className="mt-8">
                  <h2
                    className="text-xl font-semibold text-gray-800 mb-4 pl-2"
                    style={{ fontFamily: "Roboto, Roboto Fallback" }}
                  >
                    Comments ({comments.length})
                  </h2>

                  <div className="space-y-4">
                    {comments.length > 0 ? (
                      comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition duration-300"
                        >
                          {/* Comment header */}
                          <div className="flex items-center justify-between">
                            <span className="text-md font-semibold text-blue-800">
                              {comment.name}
                            </span>
                            <span className="text-sm text-gray-500">
                              {new Date(comment.createdAt).toLocaleString(
                                "en-IN",
                                {
                                  dateStyle: "medium",
                                  timeStyle: "short",
                                }
                              )}
                            </span>
                          </div>

                          {/* Comment text */}
                          <p className="mt-2 text-gray-700">
                            {comment.comments}
                          </p>

                          {/* Replies section */}
                          {comment.commentreplays.length > 0 && (
                            <div className="mt-4 space-y-3 border-l-4 border-blue-300 pl-4">
                              <h6 className="text-sm font-medium text-blue-600">
                                Replies
                              </h6>
                              {comment.commentreplays.map((reply) => (
                                <div
                                  key={reply.id}
                                  className="bg-blue-50 rounded-xl p-3 shadow-sm hover:shadow-md transition duration-200"
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-semibold text-blue-700">
                                      Teks Academy
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {new Date(reply.createdAt).toLocaleString(
                                        "en-IN",
                                        {
                                          dateStyle: "medium",
                                          timeStyle: "short",
                                        }
                                      )}
                                    </span>
                                  </div>
                                  <p className="text-gray-800 text-sm">
                                    {reply.replaytext}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 italic pl-2">
                        No comments yet. Be the first to comment!
                      </p>
                    )}
                  </div>
                </div>

                {/* Comment form - preserved from previous fixes */}
                <div
                  className="
              border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition duration-300 mt-5"
                >
                  <h2
                    className="text-2xl font-semibold text-blue-600 mb-4"
                    style={{
                      fontFamily: "Roboto, Roboto Fallback",
                      color: "#2A619D",
                    }}
                  >
                    Leave a Comment
                  </h2>
                  <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="space-y-4"
                  >
                    <div>
                      <label
                        htmlFor="comments"
                        className="block font-medium text-gray-700"
                        style={{ fontFamily: "Roboto, Roboto Fallback" }}
                      >
                        Comment
                      </label>
                      <textarea
                        id="comments"
                        name="comments"
                        rows="4"
                        value={formData.comments}
                        onChange={handleChange}
                        className={`mt-1 w-full p-2 border rounded-md ${
                          errors.comments ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Write your thoughts..."
                      />
                      {errors.comments && (
                        <p
                          className="text-red-500 text-sm"
                          style={{ fontFamily: "Roboto, Roboto Fallback" }}
                        >
                          {errors.comments}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block font-medium text-gray-700"
                          style={{ fontFamily: "Roboto, Roboto Fallback" }}
                        >
                          Name
                        </label>
                        <input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`mt-1 w-full p-2 border rounded-md ${
                            errors.name ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter Your name"
                        />
                        {errors.name && (
                          <p
                            className="text-red-500 text-sm"
                            style={{ fontFamily: "Roboto, Roboto Fallback" }}
                          >
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block font-medium text-gray-700"
                          style={{ fontFamily: "Roboto, Roboto Fallback" }}
                        >
                          Email
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`mt-1 w-full p-2 border rounded-md ${
                            errors.email ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter your Email"
                        />
                        {errors.email && (
                          <p
                            className="text-red-500 text-sm"
                            style={{ fontFamily: "Roboto, Roboto Fallback" }}
                          >
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="phoneNumber"
                          className="block font-medium text-gray-700"
                          style={{ fontFamily: "Roboto, Roboto Fallback" }}
                        >
                          Phone Number
                        </label>
                        <input
                          id="phoneNumber"
                          name="phoneNumber"
                          type="tel"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          className={`mt-1 w-full p-2 border rounded-md ${
                            errors.phoneNumber
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Enter your phone number"
                        />
                        {errors.phoneNumber && (
                          <p
                            className="text-red-500 text-sm"
                            style={{ fontFamily: "Roboto, Roboto Fallback" }}
                          >
                            {errors.phoneNumber}
                          </p>
                        )}
                      </div>

                      <div className="flex justify-end ">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="
      bg-[#FE543D] text-white rounded-md 
      px-6 py-2 
      w-full sm:w-auto 
      text-base sm:text-sm 
      font-medium 
      disabled:opacity-50 transition duration-200
      lg:h-[45px] 
    "
                          style={{
                            fontFamily: "Roboto, Roboto Fallback",
                            alignSelf: "end",
                          }}
                        >
                          {isSubmitting ? "Posting..." : "Post Comment"}
                        </button>
                      </div>
                    </div>

                    {success && (
                      <div
                        className={`p-3 rounded ${
                          success.startsWith("✅")
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                        style={{ fontFamily: "Roboto, Roboto Fallback" }}
                      >
                        {success}
                      </div>
                    )}
                  </form>
                </div>
              </div>

              {/* Related blogs column - 30% width on desktop, full width on mobile */}
              <div className="w-full lg:w-[25%] max-h-screen overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden mt-4">
                <h3
                  className="font-semibold text-[#2A619D] text-[20px] pl-1 mb-3"
                  style={{ fontFamily: "Roboto, Roboto Fallback" }}
                >
                  Related Blogs
                </h3>
                <div className="flex flex-col gap-y-4">
                  {blogData?.categoryBlogs?.map((article, index) => (
                    <div key={index} className=" bg-[#2A619D] relative">
                      {/* <p
                        className="text-white sm:text-lg xl:text-xl font-semibold  xs:mt-4 lg:mt-0 absolute top-2 left-2 opacity-100 bg-opacity-0"
                        style={{ fontFamily: "Roboto, Roboto Fallback" }}
                      >
                        {article?.category}
                      </p> */}
                      <img
                        src={`https://teksacademy.s3.ap-south-1.amazonaws.com/website/blogs/${article?.image_url}`}
                        alt={article?.title}
                        className="w-full h-48 object-cover mb-4 "
                      />
                      <Link
                        href={`${article?.meta_url}`}
                        className="flex text-xl cursor-pointer font-bold hover:underline line-clamp-2 leading-snug justify-start items-start pl-3 pb-3 text-white"
                        onClick={() => setBlogItem(article)}
                        style={{ fontFamily: "Roboto, Roboto Fallback" }}
                      >
                        {article?.title}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p style={{ fontFamily: "Roboto, Roboto Fallback" }}>
            No blog data available.
          </p>
        )}
      </div>
    </>
  );
};

export default BlogDetails;
