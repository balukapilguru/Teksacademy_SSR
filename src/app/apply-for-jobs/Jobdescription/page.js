"use client";
import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaShareSquare } from "react-icons/fa";
import { FaRegCopy } from "react-icons/fa";
import Image from "next/image";
import { IoCloseOutline } from "react-icons/io5";
import { BsWhatsapp } from "react-icons/bs";
import { RiFacebookBoxFill } from "react-icons/ri";
import { SiInstagram } from "react-icons/si";


const Jobdescription = () => {
  const demo = {
    key: 1,
    job: "Bim Model",
    company: "MNC",
    role: "Fresher",
    loc: "Hyderabad",
    date: "Posted On:Date",
    details: "View Details",
    imgsrc:
      "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/371034-overview-1-416x178?resMode=sharp2&op_usm=1.5,0.65,15,0&wid=1000&hei=429&qlt=100&fit=constrain",
  };
  const [open, setOpen] = useState(false);
  const [dis, setDis] = useState(false);
  const [link, setLink] = useState(
    "https://teksacademy.com/203/young-soft-india/qa-engineers"
  );
  useEffect(() => {
    setDis(false);
  }, [open]);
  const [showPopup, setShowPopup] = useState(false);
  const handleClick = () => {
    setShowPopup(true);
  };
  const closePopup = () => {
    setShowPopup(false);
  };

  const CoptToClipboard = (link, setDis) => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        setDis(true);
        setTimeout(() => setDis(false), 2000);
      })
      .catch((err) => console.error("failed to copy:", err));
  };

  return (
    <>
      <div className="main_container">
        <div className="shadow-2xl rounded-lg ">
          <div className="flex justify-center items-center bg-red-200">
            <img
              className="rounded-md p-1 border border-black mt-1 h-14 w-14"
              src={demo.imgsrc}
              alt="logo"
            />
          </div>
          <div className="">
            <div>
              <b>QA Engineer</b>
            </div>
            <div>
              <div>Young Soft India</div>
            </div>
            <div className="flex gap-2 mt-2">
              {" "}
              <FaMapMarkerAlt className="mt-1" />
              Hyderabad
            </div>
          </div>
          <div className=" my-4 w-full">
            <hr></hr>
          </div>
          <div className="flex gap-80  ">
            <div> Posted On</div>
            <div className="flex justify-end ml-16 gap-2">
              <button
                className="flex focus:outline-none  active:outline-1 active:outline-blue-400  bg-[#2a619d]  rounded-md gap-3 h-10 w-24 justify-center pt-1 text-white cursor-pointer"
                onClick={() => setOpen(!open)}
              >
                Share
                <FaShareSquare className=" mt-1" />
              </button>
              <button
                className="flex focus:outline-none  active:outline-1 active:outline-blue-400 bg-[#2a619d]  rounded-md w-20 justify-center pt-1 text-white cursor-pointer"
                onClick={handleClick}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
        {open && (
          <div className="h-auto py-2 w-96 border bg-white fixed left-1/2 top-20 -translate-x-1/2 shadow-lg rounded-lg mt-10">
            <h3 className="p-3 text-xl">Share This Job</h3>
            <div className=" my-4 w-full">
              <hr></hr>
            </div>
            <div className="flex justify-between mb-5">
              {/* <a href='https://api.whatsapp.com/send?text=undefined'><BsWhatsapp className="text-green-500 hover:text-green-600 ml-10 w-8 h-12"/></a>
                            <a href='https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fexample.com'><RiFacebookBoxFill className="text-[#2a619d] hover:text-[#2a619d] w-10 h-12 "/></a>
                            <a href='https://www.instagram.com/?url=undefined'><SiInstagram  className="text-white bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] w-8 text-3xl mt-2 mr-10"/></a> */}
            </div>
            <div className="flex flex-col text-center mt-5 gap-4">
              <div className="flex">
                <div className="ml-5">{link}</div>
                <span
                  className="pt-1 pl-1"
                  onClick={() => CoptToClipboard(link, setDis)}
                >
                  {" "}
                  <FaRegCopy className="mr-5" />
                </span>
              </div>
              {dis && <h3 className="text-orange-400">link Copied</h3>}
            </div>

            <div className=" my-4 w-full">
              <hr></hr>
            </div>

            <div className="flex  bg-[#2a619d]  text-white rounded-lg  pl-3 w-16 h-10  ml-72 ">
              <button type="button" onClick={() => setOpen(false)}>
                close
              </button>
            </div>
          </div>
        )}
      </div>
      {showPopup && (
        <div className="bg-white flex z-20 fixed left-1/2 -translate-x-1/2 top-48 p-6 rounded-md">
          {/* <Apply /> */}
          <button className="flex " onClick={closePopup}>
            <IoCloseOutline className="text-3xl" />
          </button>
        </div>
      )}
      <div className="flex">
        <div className="text-gray-500  text-justify shadow-2xl rounded-lg ">
          <div className="mb-3">
            <b>Company Name:</b> YoungSoft India Pvt Ltd,
          </div>
          <div className="mb-3">
            <b>Skill Set:</b> Automation & Manual Testing(Selenium),
          </div>
          <div className="mb-3">
            <b>Educational Qualification:</b> B.Tech/B.E
          </div>
          <div className="mb-3">
            <b>YOP:</b> 2023-2024.
          </div>
          <div className="mb-3">
            <b>Percentage Criteria:</b> above 65% throughout the academics
          </div>
          <div className="mb-3">
            <b> Service Agreement/Bond:</b> Not applicable.
          </div>
          <div className="mb-10 mt-10">
            <b>Location: </b> Gachibowli, Hyderabad (As of now, working in
            hybrid model)
          </div>
          <div className="mb-10 mt-10">
            <b>Role: </b> Intern-Software Testing(for first 3-4 months) followed
            by full-time regular employment as ‘QA Engineer’, subject to
            satisfactory performance during the internship period.{" "}
          </div>
          <div className="mb-3 mt-8">
            <b>Stipend during Internship:</b> 12K per month
          </div>
          <div className="mb-3 ">
            <b>CTC offered:</b> 3 to 3.6 LPA (After Internship).
          </div>
          <div className="mb-10 mt-10">
            <b className="flex flex-col"> Evaluation process:</b>{" "}
          </div>
          <div className="mb-2">
            1. Online written test (Screening level) Mandatory
          </div>
          <div className="mb-2"> 2. Technical discussion-1 Mandatory</div>
          <div className="mb-2">3. Technical discussion-2 Mandatory</div>
          <div className="mb-2">
            {" "}
            4. Managerial discussion-Optional followed by HR round
          </div>
          <div className="mb-10 mt-10">
            <b>Note:</b> Trainees who have completed full training on
            **Automation and Manual testing(Selenium)** and who meet the
            criteria only apply for the requirement
          </div>

          <div className="flex justify-end ml-16 gap-2">
            <button
              className="flex focus:outline-none  active:outline-1 active:outline-blue-400  bg-[#2a619d]  rounded-md gap-3 h-10 w-24 justify-center pt-1 text-white cursor-pointer"
              onClick={() => setOpen(!open)}
            >
              Share
              <FaShareSquare className=" mt-1" />
            </button>
            <button
              className="flex focus:outline-none  active:outline-1 active:outline-blue-400 bg-[#2a619d]  rounded-md w-20 justify-center pt-1 text-white"
              onClick={handleClick}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Jobdescription;
