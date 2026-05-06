
const vector = "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/vector.webp";
const tekslogo = "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/excel/teks_logo.webp";
const orange1 = "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/excel/orange-1.webp";
const orange2 = "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/excel/orange-2.webp";
const orange3 = "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/excel/orange-3.webp";
const orange4 = "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/excel/orange-4.webp";
const orange5 = "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/excel/orange-5.webp";
const blue1 = "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/excel/blue-1.webp";
const blue2 = "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/excel/blue-2.webp";
const blue3 = "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/excel/blue-3.webp";
const blue4 = "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/excel/blue-4.webp";
const blue5 = "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/excel/blue-5.webp";
import Image from "next/image";
import ExcelForm from "./ExcelForm";
// import Excelform from "../forms/Excelform"

const orangeItems = [
    {
        imgSrc: orange1,
        alt:'Career Guidance',
        title: "Free",
        description: "Career Guidance",
    },
    {
        imgSrc: orange2,
        alt:'Approved Curriculum',
        title: "IIT",
        description: "Approved Curriculum",
    },
    {
        imgSrc: orange3,
        title: "Dedicated",
        alt:'Student Dashboard',
        description: "Student Dashboard",
    },
    {
        imgSrc: orange4,
        title: "Classroom",
        alt:'& Online Trainings',
        description: "& Online Trainings",
    },
    {
        imgSrc: orange5,
        title: "Class",
        alt:'Recordings',
        description: "Recordings",
    },
];
const blueItems = [
    {
        imgSrc: blue1,
        title: "Course",
        alt:'Materials',
        description: "Materials",
    },
    {
        imgSrc: blue2,
        title: "Module",
        alt:'Based Assessments',
        description: "Based Assessments",
    },
    {
        imgSrc: blue3,
        title: "Hands",
        alt:'On Projects',
        description: "On Projects",
    },
    {
        imgSrc: blue4,
        title: "Internship",
        alt:'Opportunity',
        description: "Opportunity",
    },
    {
        imgSrc: blue5,
        title: "100%",
        alt:'Job Assistance',
        description: "Job Assistance",
    },
];

export default function Excel(data) {
    console.log(data,"excdlll")
    return (
        <div className="xs:bg-[url('https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/excel_bg.webp')] bg-cover bg-center">
            <div className="main_container py-2 lg:py-4 xl:py-6 2xl:py-8 3xl:py-10">
                <div className="flex flex-col items-center gap-y-2 sm:gap-y-4 lg:gap-y-8 2xl:gap-y-14 3xl:gap-y-20">
                    <div className="relative flex flex-col items-center">
                        <div className="font-semibold text-[1rem] lg:text-[1.8rem] xl:text-[2rem] 2xl:text-[2rem] 3xl:text-[2.5rem] leading-[48px] tracking-[-0.014em] flex justify-center">
                            <span className="">Excel with&nbsp;</span><span className="text-[#2A619D]">Teks&nbsp;Academy</span>
                        </div>
                        <svg className="absolute top-8 w-full h-auto" // Increased width and height
                            viewBox="0 0 110 12">
                            <path
                                d="M0 10 Q80 -4 190 27"
                                stroke="orangered"
                                strokeWidth="0.4"
                                fill="transparent"
                                strokeLinecap="square" />
                        </svg>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-6 w-full pb-4">
                        <div className="lg:col-span-2">
                            <div className="flex items-center h-full justify-center">
                                <Image
                                width={250}
                                height={200}
                                src={tekslogo} className="w-auto h-36 sm:h-40 lg:h-44 xl:h-52 2xl:h-72 3xl:h-80" alt="teks-academy logo" />
                            </div>
                        </div>
                        <div className="lg:col-span-6 ">
                            <div className="flex justify-center h-full px-6 lg:px-4 xl:px-0 gap-x-2 xl:gap-x-6 2xl:gap-x-24 3xl:gap-x-28 items-center relative">
                                {/* 1st col */}
                                <div className="flex items-center">
                                    <div className="flex flex-col gap-y-4 2xl:gap-y-8 3xl:gap-y-10">
                                        {orangeItems.map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center"
                                            >
                                                <div className="h-16 3xl:h-20 border-r-4 border-teal-400 rounded-sm flex items-center justify-center pr-3 3xl:pr-4 flex-shrink-0">
                                                    <Image
                                                    width={230}
                                                    height={280}
                                                        src={item.imgSrc}
                                                        className="scale-75 sm:scale-75 md:scale-100 lg:scale-100 w-14 h-12 3xl:w-16 3xl:h-14"
                                                        alt={item.alt}
                                                    />
                                                </div>
                                                <div className="ml-3 3xl:ml-4 flex flex-col 3xl:gap-y-2">
                                                    <div className="text-[#FE543D] font-semibold xs:text-[11px] sm:text-sm xl:text-xl 2xl:text-2xl 3xl:text-3xl">
                                                        {item.title}
                                                    </div>
                                                    <div className="text-[#52525B] font-normal xs:text-[10px] sm:text-xs 2xl:text-[14px] 3xl:text-[1rem]">
                                                        {item.description}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {/* 2nd col */}
                                <div className="flex items-center">
                                    <div className="flex flex-col gap-y-4 2xl:gap-y-8 3xl:gap-y-10">
                                        {blueItems.map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center"
                                            >
                                                <div className="h-16 3xl:h-20 border-r-4 border-teal-400 rounded-sm flex items-center justify-center pr-3 3xl:pr-4 flex-shrink-0">
                                                    <Image
                                                    width={220}
                                                    height={260}
                                                        src={item.imgSrc}
                                                        className="scale-75 sm:scale-75 md:scale-100 lg:scale-100 w-14 h-12 3xl:w-16 3xl:h-14"
                                                        alt={item.alt}
                                                    />
                                                </div>
                                                <div className="ml-3 3xl:ml-4 flex flex-col 3xl:gap-y-2">
                                                    <div className="text-[#2A619D] font-semibold xs:text-[11px] sm:text-sm xl:text-xl 2xl:text-2xl 3xl:text-3xl">
                                                        {item.title}
                                                    </div>
                                                    <div className="text-[#52525B] font-normal xs:text-[10px] sm:text-xs 2xl:text-[14px] 3xl:text-[1rem]">
                                                        {item.description}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Form Section */}
                        <div className="lg:col-span-4 w-full">
                            <div className="flex relative items-center h-full w-full justify-center xl:justify-end">
                                {/* Form */}
                                <div className="absolute hidden xl:block top-1/2 -translate-y-1/2 left-3 lg:left-32 xl:left-2 2xl:left-6 h-[320px] 2xl:h-[380px] 3xl:h-[420px] border-r-[3px] border-[#FE543D]
                                        before:content-[''] before:absolute before:left-[-7px] before:top-[-8px] before:w-4 before:h-4 before:bg-[#FE543D] before:rounded-full
                                        after:content-[''] after:absolute after:left-[-7px] after:bottom-[-6px] after:w-4  after:h-4 after:bg-[#FE543D] after:rounded-full">
                                </div>
                                <div className="w-full">
                                    <div className="bg-[#2A619D] p-5 px-6  2xl:p-10 mx-7 sm:mx-14  lg:mx-2 xl:ml-10 2xl:ml-24 3xl:ml-28 xl:mr-0  rounded-lg">
                                        <ExcelForm/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>

    );
}