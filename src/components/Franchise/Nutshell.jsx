// "use client";
import React from "react";
import {
  GraduationCap,
  Cpu,
  BriefcaseBusiness,
  FileBadge,
  Users,
  BookOpenCheck,
  Building2,
  Handshake,
  BadgeCheck,
} from "lucide-react";
import Heading from "@/utility/Heading";

export default function Nutshell({ data }) {
  const career = data?.careerServices || data;

  // Map each service by ID to a Lucide icon
  const serviceIcons = {
    1: <GraduationCap className="w-7 h-7 text-red-700 group-hover:text-white" />,
    2: <Cpu className="w-7 h-7 text-red-700 group-hover:text-white" />,
    3: <BriefcaseBusiness className="w-7 h-7 text-red-700 group-hover:text-white" />,
    4: <FileBadge className="w-7 h-7 text-red-700 group-hover:text-white" />,
    5: <Users className="w-7 h-7 text-red-700 group-hover:text-white" />,
    6: <BookOpenCheck className="w-7 h-7 text-red-700 group-hover:text-white" />,
    7: <Building2 className="w-7 h-7 text-red-700 group-hover:text-white" />,
    8: <Handshake className="w-7 h-7 text-red-700 group-hover:text-white" />,
    9: <BadgeCheck className="w-7 h-7 text-red-700 group-hover:text-white" />,
  };

  return (
    <section className="py-7 bg-[#f7f8f9] border border-[#f7f8f9] rounded-lg mt-7">
      <div className="max-w-8xl mx-auto lg:px-8">

        {/* Heading */}
        <div className="pl-2 ">
          
<Heading data={career?.heading} text={career?.heading}/>
          <div className="text-lg text-gray-600 max-w-2xl mb-5">
            {career?.subHeading}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-x-10 gap-y-5 pl-4 pr-4">
          {career?.services?.map((feature) => (
            <div
              key={feature.id}
              className="group bg-white p-3 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-red-200"
            >
              {/* Icon Box */}
              <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#c41e3a] transition-all duration-300">
                {serviceIcons[feature.id] || (
                  <span className="w-6 h-6 bg-[#c41e3a] rounded-full block"></span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-blue-900 mb-3">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

