'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  X,
  Briefcase,
  Code,
  Database,
  Cpu,
  Monitor,
  Wrench,
  Layers,
  Cloud,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Heading from '@/utility/Heading';
import Popupform from '../clientcomponents/forms/Popupform';
import { blogsApplyBaseUrl, buildApiUrl } from '@/lib/apiBaseUrls';
import { FaArrowRightLong } from 'react-icons/fa6';

const CareerPath = ({ data, formDetails, courseName = '' }) => {
  const { heading } = data || {};
  const router = useRouter();

  const [flippedCardId, setFlippedCardId] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  const [visibleCount, setVisibleCount] = useState(2);
  const [expanded, setExpanded] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const courseDisplayName =
    courseName || formDetails?.courseName || formDetails?.course || formDetails || '';
  const [selectedCourse, setSelectedCourse] = useState(courseDisplayName);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ detect screen
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const toggleFlip = (id) => {
    setFlippedCardId((prev) => (prev === id ? null : id));
  };

  const IconRenderer = ({ role }) => {
    const roleMap = {
      'java developer': Code,
      'backend developer': Database,
      'java architect': Layers,
      'java lead': Cpu,
      'java tester': Monitor,
      'software engineer': Code,
      'support engineer': Wrench,
      'devops engineer': Cloud,
      'technical consultant': Briefcase,
    };
    const Icon = roleMap[role?.toLowerCase()] || Briefcase;
    return <Icon className="w-7 h-7 text-white" />;
  };

  const getRoleColors = (index) => {
    const colors = [
      { bg: 'bg-blue-500' },
      { bg: 'bg-green-500' },
      { bg: 'bg-purple-500' },
      { bg: 'bg-orange-500' },
      { bg: 'bg-red-500' },
      { bg: 'bg-teal-500' },
      { bg: 'bg-indigo-500' },
      { bg: 'bg-pink-500' },
    ];
    return colors[index % colors.length];
  };

  const selectedJob = data?.jobCards?.find((job) => job.role === selectedRole);

  const handleOpenModal = (details) => {
    setSelectedCourse(courseDisplayName || details);
    setShowModal(true);
  };

  const handleFormSubmit = async (_formValues, mappedPayload) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(buildApiUrl(blogsApplyBaseUrl, '/lead/create'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mappedPayload),
      });

      if (!res.ok) throw new Error('Submission failed');

      setShowModal(false);
      router.push('/thankyou');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ FIX: slice only on mobile
  const jobsToShow = isMobile
    ? (data?.jobCards || []).slice(0, visibleCount)
    : (data?.jobCards || []);

  return (
    <div className="mx-auto py-6 md:p-4 p-2 rounded-xl">
      {showModal && (
        <Popupform
          show={showModal}
          onClose={() => !isSubmitting && setShowModal(false)}
          course={selectedCourse}
          courseName={selectedCourse}
          source={30}
          title="Enroll Now"
          onSubmit={handleFormSubmit}
        />
      )}

      <Heading data={heading} />

      <div className="text-gray-700 text-lg md:text-xl pb-6">
        {data?.description}
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {jobsToShow.map((job, index) => {
          const isFlipped = flippedCardId === job.role;
          const colors = getRoleColors(index);

          return (
            <div key={job.role} className="group perspective cursor-pointer">
              <div
                className={`card-3d relative h-56 w-full rounded-lg transition-transform duration-700 ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
                onClick={() => toggleFlip(job.role)}
              >
                {/* FRONT */}
                <div className="backface-hidden bg-white rounded-lg p-6 border shadow-sm flex flex-col justify-between">
                  <div className={`${colors.bg} p-4 rounded-lg w-fit`}>
                    <IconRenderer role={job.role} />
                  </div>
                  <h3 className="text-xl font-bold">{job.role}</h3>
                  <div className="text-sm text-gray-600 flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {job.jobMeter}
                  </div>
                </div>

                {/* BACK */}
  <div
  className={`backface-hidden rotate-y-180 rounded-lg p-4 ${colors.bg} shadow-md flex flex-col`}
>
  {/* Title */}
  <h4 className="text-white text-center font-semibold mb-3">
    Salary Package (LPA)
  </h4>

  {/* Table Wrapper */}
 <div className=" rounded-md overflow-hidden">
  
  {/* Header */}
  <div className="grid grid-cols-2 text-sm font-semibold text-gray-700 border border-white borderwhite">
    <div className="px-4 py-2 border-r border-white text-white">
      Experience
    </div>
    <div className="px-4 py-2 text-white">
      Package
    </div>
  </div>

  {/* Body */}
  <div className="max-h-[140px] overflow-y-auto">
    {job.onHover?.table?.map((row, i) => (
      <div
        key={i}
        className="grid grid-cols-2 text-sm text-gray-700 border-b border-white last:border-none"
      >
        <div className="px-6 py-2  lg:w-[8.9rem]  border-r border-white text-white border-l">
          {row.label}
        </div>
        <div className="px-4 py-2 text-white">
          {row.value}
        </div>
      </div>
    ))}
  </div>
</div>
</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ✅ BUTTON ONLY MOBILE */}
      {isMobile && (
        <div className="flex justify-center mt-2">
          {!expanded && visibleCount < data?.jobCards?.length && (
            <button
              onClick={() => {
                const next = visibleCount + 4;
                setVisibleCount(next);
                if (next >= data.jobCards.length) setExpanded(true);
              }}
              className="bg-[#2a619d] text-white font-semibold px-3 py-2 rounded-full"
            >
              <div className="flex gap-2">
                Load More
                <span className="mt-1.5">
                  <FaArrowRightLong />
                </span>
              </div>
            </button>
          )}

          {expanded && (
            <button
              onClick={() => {
                setVisibleCount(2);
                setExpanded(false);
              }}
              className="bg-[#2a619d] text-white font-semibold px-3 py-2 rounded-full"
            >
              <div className="flex gap-2">
                Show Less
                <span className="mt-1.5">
                  <FaArrowRightLong />
                </span>
              </div>
            </button>
          )}
        </div>
      )}

      <style jsx>{`
        .perspective {
          perspective: 1000px;
        }
        .card-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          position: absolute;
          inset: 0;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default CareerPath;