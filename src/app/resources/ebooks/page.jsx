"use client";
import React, { useEffect, useState } from "react";
const ebookbanner =
  "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/ebookbanner.webp";
import Image from "next/image";

const Ebook = () => {
  const [ebookData, setEbookData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Static data from your JSON
  const staticEbookData = {
    ebookSection: {
      heading: "E-Books",
      subHeading: ["Improve learning with Comprehensive E-Books"],
      description: "Teks Academy's E-Books provide structured, step-by-step guidance for learners. Each E-Book covers concepts with examples and exercises.",
      stats: [
        { label: "Pages", value: "160+" },
        { label: "Chapters", value: "36+" },
        { label: "Projects", value: "15+" },
        { label: "Case Studies", value: "10+" }
      ],
      items: [
        {
          productId: 392,
          title: "Full Stack Python",
          description: "Master Python, Django, and REST API development.",
          image: { src: "/Ebooks/ebooksicons/python.webp", alt: "Full Stack Python" },
          button: { text: "Download" },
          ebookurl: "/Ebooks/E-books/python_ebook.pdf"
        },
        {
          productId: 391,
          title: "Full Stack Java",
          description: "Become a Java expert with Spring Boot and Microservices.",
          image: { src: "/Ebooks/ebooksicons/fullstack.webp", alt: "Full Stack Java" },
          button: { text: "Download" },
          ebookurl: "/Ebooks/E-books/java_ebook.pdf"
        },
        {
          productId: 390,
          title: "Data Science",
          description: "Learn ML, Deep Learning, and Big Data Analytics.",
          image: { src: "/Ebooks/ebooksicons/data_science.webp", alt: "Data Science" },
          button: { text: "Download" },
          ebookurl: "/Ebooks/E-books/data_science_e_book.pdf"
        },
        {
          productId: 295,
          title: "Digital Marketing",
          description: "SEO, Google Ads, Social Media Marketing, and Analytics.",
          image: { src: "/Ebooks/ebooksicons/digital_Marketing.webp", alt: "Digital Marketing" },
          button: { text: "Download" },
          ebookurl: "/Ebooks/E-books/digital_marketing.pdf"
        },
        {
          productId: 389,
          title: "AWS & DevOps",
          description: "Master cloud computing with AWS, Docker, Kubernetes.",
          image: { src: "/Ebooks/ebooksicons/aws_dev.webp", alt: "AWS & DevOps" },
          button: { text: "Download" },
          ebookurl: "/Ebooks/E-books/aws_devops_e_book.pdf"
        },
        {
          productId: 286,
          title: "BIM",
          description: "Learn 3D modeling and construction management tools.",
          image: { src: "/Ebooks/ebooksicons/BIM.webp", alt: "BIM" },
          button: { text: "Download" },
          ebookurl: "/Ebooks/E-books/bim_ebook.pdf"
        },
        {
          productId: 271,
          title: "Software Testing",
          description: "Master Automation Testing, Selenium, JIRA & API Testing.",
          image: { src: "/Ebooks/ebooksicons/software_tools.webp", alt: "Software Testing" },
          button: { text: "Download" },
          ebookurl: "/Ebooks/E-books/Software_Testing_e_book.pdf"
        },
        {
          productId: 284,
          title: "SAP FICO",
          description: "Master SAP Finance & Controlling for business applications.",
          image: { src: "/Ebooks/ebooksicons/sap.webp", alt: "SAP FICO" },
          button: { text: "Download" },
          ebookurl: "/Ebooks/E-books/SAP_FICO_e_book.pdf"
        },
        {
          productId: 273,
          title: "Medical Coding",
          description: "ICD-10, CPT, HCPCS coding for healthcare industry.",
          image: { src: "/Ebooks/ebooksicons/medical_coding.webp", alt: "Medical Coding" },
          button: { text: "Download" },
          ebookurl: "/Ebooks/E-books/Medical_Coding_e-book.pdf"
        },
        {
          productId: 236,
          title: "Multimedia",
          description: "Learn graphic design, 2D animation, and video editing.",
          image: { src: "/Ebooks/ebooksicons/multimedia.webp", alt: "Multimedia" },
          button: { text: "Download" },
          ebookurl: "/Ebooks/E-books/Multimedia.pdf"
        },
        {
          productId: 239,
          title: "Advanced Excel",
          description: "Master Excel formulas, Pivot Tables, Macros, and dashboards.",
          image: { src: "/Ebooks/ebooksicons/excel_data.webp", alt: "Advanced Excel" },
          button: { text: "Download" },
          ebookurl: "/Ebooks/E-books/Advanced_excel_e_book.pdf"
        },
        {
          productId: 242,
          title: "AutoCAD",
          description: "Master 2D drafting and 3D modeling for architecture & engineering.",
          image: { src: "/Ebooks/ebooksicons/auto_cad.webp", alt: "AutoCAD" },
          button: { text: "Download" },
          ebookurl: "/Ebooks/E-books/Auto_Cad_e_book.pdf"
        },
        {
          productId: 245,
          title: "Revit MEP",
          description: "Master BIM architectural, structural, and MEP design documentation.",
          image: { src: "/Ebooks/ebooksicons/revit.webp", alt: "Revit MEP" },
          button: { text: "Download" },
          ebookurl: "/Ebooks/E-books/revit_mep_e_book.pdf"
        },
        {
          productId: 292,
          title: "Data Analytics",
          description: "Master data analysis techniques & visualization.",
          image: { src: "/Ebooks/ebooksicons/data_analytics.webp", alt: "Data Analytics" },
          button: { text: "Download" },
          ebookurl: "/Ebooks/E-books/Data_Analytics.pdf"
        },
        {
          productId: 257,
          title: "SAP MM",
          description: "Become an expert in Material Management and SAP MM processes.",
          image: { src: "/Ebooks/ebooksicons/sap.webp", alt: "SAP MM" },
          button: { text: "Download" },
          ebookurl: "/Ebooks/E-books/sapmm_ebook.pdf"
        },
        {
          productId: 263,
          title: "Cyber Security",
          description: "Prevent cyberattacks and enhance threat detection strategies.",
          image: { src: "/Ebooks/ebooksicons/shield.webp", alt: "Cyber Security" },
          button: { text: "Download" },
          ebookurl: "/Ebooks/E-books/cyber_security_e-book.pdf"
        },
        {
          productId: 254,
          title: "Generative AI",
          description: "Implement AI models for personalized learning systems.",
          image: { src: "/Ebooks/ebooksicons/ai.webp", alt: "Generative AI" },
          button: { text: "Download" },
          ebookurl: "/Ebooks/E-books/generative_AI_ebook.pdf"
        },
        {
          productId: 249,
          title: "Business Analytics",
          description: "Analyze business data to optimize operations.",
          image: { src: "/Ebooks/ebooksicons/chart.webp", alt: "Business Analytics" },
          button: { text: "Download" },
          ebookurl: "/Ebooks/E-books/businessanalyst.pdf"
        },
        {
          productId: 266,
          title: "BFSI Syllabus",
          description: "Learn Key Concepts of Banking, Securities, Mutual Funds, & Digital Banking",
          image: { src: "/Ebooks/ebooksicons/banking-service.webp", alt: "banking service" },
          button: { text: "Download" },
          ebookurl: "/Ebooks/E-books/BFSI_Syallbus_e-book.pdf"
        }
      ]
    },
    communitySection: {
      heading: ["Teks Community Makes You!", "Updated, Upskilled and Unbeatable"],
      description: "Learn the latest technologies, advanced skills, connect with experts and grow with a network that pushes you towards success.",
      button: {
        name: "Join WhatsApp Community",
        ebookurl: ""
      },
      image: {
        src: "/ebooks/community-card.webp",
        alt: "community-card"
      }
    }
  };

  useEffect(() => {
    // Try to fetch from API, but use static data immediately
    const fetchEbooks = async () => {
      try {
        // Try API endpoint
        const response = await fetch("https://0z05cks3-4040.inc1.devtunnels.ms/api/v1/ebooks");
        
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setEbookData(result.data);
            // Update metadata
            if (result.data.meta) {
              document.title = result.data.meta.title;
              const metaDescription = document.querySelector('meta[name="description"]');
              if (metaDescription) {
                metaDescription.content = result.data.meta.description;
              }
            }
            setLoading(false);
            return;
          }
        }
        // If API fails, use static data
        console.log("Using static ebook data");
        setEbookData(staticEbookData);
        document.title = "Free Software courses Training eBooks – Teks Academy";
      } catch (err) {
        console.error("Error fetching ebooks:", err);
        // Use static data on error
        setEbookData(staticEbookData);
      } finally {
        setLoading(false);
      }
    };

    fetchEbooks();
  }, []);

  const ebookSection = ebookData?.ebookSection;
  const communitySection = ebookData?.communitySection;
  const courses = ebookSection?.items || [];

  const handleDownload = (ebookurl) => {
    if (ebookurl) {
      window.open(`https://teksacademy.com${ebookurl}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="main_container">
        <div className="min-h-[400px] flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2A619D] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading E-Books...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main_container">
      {/* Header Section */}
      <div className="flex justify-center items-center w-full">
        <div className="relative w-fit flex flex-col mt-2 lg:mt-5">
          <div className="font-semibold text-[1rem] lg:text-[1.8rem] xl:text-[2rem] 2xl:text-[2rem] 3xl:text-[2.5rem] leading-[48px] tracking-[-0.014em] flex justify-center">
            <h1 className="text-[#2A619D]">E-Book</h1>
          </div>
          <svg className="absolute top-8 lg:top-10 w-full h-auto" viewBox="0 0 110 12">
            <path d="M0 10 Q80 -2 190 27" stroke="orangered" strokeWidth="1.3" fill="transparent" strokeLinecap="square" />
          </svg>
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col xl:flex-row justify-center gap-6 xl:gap-12 px-6 lg:px-16 py-8 xl:py-12">
        <div className="relative w-full max-w-lg">
          <Image src={ebookbanner} alt="Ebook Preview image" className="w-full h-auto" width={500} height={500} />
        </div>
        <div className="text-black max-w-lg">
          <h4 className="text-[16px] font-semibold text-[#2a619d]">
            Best {ebookSection?.heading || "E-Books"}
          </h4>
          <h2 className="sm:text-2xl text-2xl font-bold py-2">
            {ebookSection?.subHeading?.[0] || "Improve learning with Comprehensive E-Books"}
          </h2>
          <div className="text-gray-600 mt-2 text-justify text-sm sm:text-base">
            {ebookSection?.description || "Hey techies, are you tired of purchasing books from stores? No worries, Teks Academy's eBooks on advanced technologies and job ready skills will help you..."}
          </div>
          
          <div className="grid grid-cols-2 gap-6 mt-6">
            {ebookSection?.stats?.map((stat, idx) => (
              <div key={idx}>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="w-full pb-12">
        <div className="px-6 sm:px-10 md:px-4 lg:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 2xl:gap-8 3xl:gap-14 2xl:px-24 3xl:px-36">
          {courses.map((course, index) => (
            <div
              key={course.productId || index}
              className="bg-[#DFF6F4] h-56 md:h-60 2xl:h-64 3xl:h-72 rounded-lg shadow-lg p-2 text-center hover:scale-105 transition flex flex-col"
            >
              <div className="h-2/5 flex items-center justify-center">
                <div className="p-3 md:p-4 h-20 w-20 md:h-[72px] md:w-[72px] lg:h-20 lg:w-20 3xl:h-[86px] 3xl:w-[86px] mx-auto flex items-center justify-center bg-white rounded-full">
                  <Image
                    src={`https://teksacademy.com${course.image?.src}`}
                    alt={course.title}
                    width={60}
                    height={60}
                    onError={(e) => {
                      e.target.src = "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/interview_question/python.webp";
                    }}
                  />
                </div>
              </div>
              <div className="h-3/5 p-1.5 w-full flex justify-center items-center">
                <div className="bg-white h-full w-full text-left p-3 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm lg:text-base xl:text-lg font-bold text-blue-950">{course.title}</h3>
                    <div className="text-gray-500 text-[10px]">{course.description}</div>
                  </div>
                  <button 
                    onClick={() => handleDownload(course.ebookurl)}
                    className="p-1.5 px-4 border text-sm border-red-400 text-[#FE543D] rounded-lg hover:bg-red-100 self-start"
                  >
                    {course.button?.text || "Download"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Community Section */}
      {communitySection && (
        <div className="py-12 px-6 lg:px-16">
          <div className="bg-gradient-to-r from-[#2A619D] to-[#1e4a7a] rounded-2xl overflow-hidden shadow-xl">
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="lg:w-1/2 p-8 lg:p-12 text-white">
                <h2 className="text-2xl lg:text-3xl font-bold mb-2">{communitySection.heading?.[0]}</h2>
                <h3 className="text-xl lg:text-2xl font-bold mb-4 text-[#FE543D]">{communitySection.heading?.[1]}</h3>
                <p className="text-gray-200 mb-6">{communitySection.description}</p>
                {communitySection.button && (
                  <a href={communitySection.button.ebookurl || "#"} className="inline-flex items-center bg-[#FE543D] text-white px-6 py-3 rounded-lg hover:bg-[#e04a35] transition-colors">
                    {communitySection.button.name}
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                )}
              </div>
              <div className="lg:w-1/2 p-8 lg:p-12">
                <div className="relative h-64 lg:h-80">
                  <Image
                    src={`https://teksacademy.com${communitySection.image?.src}`}
                    alt="Community"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ebook;