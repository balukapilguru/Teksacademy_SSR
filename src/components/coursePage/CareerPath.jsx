'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  X,
  Briefcase,
  Code,
  Database,
  Cpu,
  Network,
  Monitor,
  Wrench,
  Layers,
  Cloud,
} from 'lucide-react';
import Heading from '@/utility/Heading';
import Freecoursesform from '../clientcomponents/forms/Freecoursesform';

const CareerPath = ({ data, formDetails  }) => {

    const {heading}= data || {};
  const [flippedCardId, setFlippedCardId] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

   const [showModal, setShowModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(formDetails);
 
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
    const key = role?.toLowerCase() || '';
    const Icon = roleMap[key] || Briefcase;
    return <Icon className="w-7 h-7 text-white" />;
  };

  

  const getRoleColors = (index) => {
    const colors = [
      { bg: 'bg-blue-500', color: 'from-blue-500 to-blue-700' },
      { bg: 'bg-green-500', color: 'from-green-500 to-green-700' },
      { bg: 'bg-purple-500', color: 'from-purple-500 to-purple-700' },
      { bg: 'bg-orange-500', color: 'from-orange-500 to-orange-700' },
      { bg: 'bg-red-500', color: 'from-red-500 to-red-700' },
      { bg: 'bg-teal-500', color: 'from-teal-500 to-teal-700' },
      { bg: 'bg-indigo-500', color: 'from-indigo-500 to-indigo-700' },
      { bg: 'bg-pink-500', color: 'from-pink-500 to-pink-700' },
      { bg: 'bg-amber-500', color: 'from-amber-500 to-amber-700' },
      { bg: 'bg-cyan-500', color: 'from-cyan-500 to-cyan-700' },
    ];
    return colors[index % colors.length];
  };

  const selectedJob = data?.jobCards?.find((job) => job.role === selectedRole);

   const handleOpenModal = (details) => {
    setSelectedCourse(details);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
       <Freecoursesform
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    course={selectedCourse}
                    source={28}
                    
                  />
                   <Heading data={heading} />
                    <div className="text-gray-700 text-lg md:text-xl pb-6">
          {data?.description || 'Explore roles, opportunities'}
        </div>
      
      <div className="max-w-8xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data?.jobCards?.map((job, index) => {
            const isFlipped = flippedCardId === job.role;
            const colors = getRoleColors(index);

            return (
              <div key={job.role} className="group perspective cursor-pointer">
                <div
                  className={`card-3d relative h-56 w-full group-hover:rotate-y-180 rounded-lg transition-transform duration-700 ${
                    isFlipped ? 'rotate-y-180' : ''
                  }`}
                  onClick={() => toggleFlip(job.role)}
                >
                  <div className="backface-hidden bg-white rounded-lg p-6 border border-gray-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-start mb-2">
                      <div className={`${colors.bg} p-4 rounded-lg`}>
                        <IconRenderer role={job.role} />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 text-left">
                      {job.role}
                    </h3>
                    <div className="flex items-start justify-start text-sm text-gray-700">
                      <Users className="w-4 h-4 text-gray-500 mr-1" />
                      {job.jobMeter}
                    </div>
                  </div>

                  <div
                    className={`backface-hidden rotate-y-180 rounded-lg p-3 border border-gray-200 shadow-sm flex flex-col justify-center ${colors.bg}`}
                  >
                    <h4 className="text-md font-semibold mb-2 text-white text-center">
                      {job.onHover?.title || 'Salary Packages'}
                    </h4>
                    <table className="w-full text-white border border-white border-collapse text-sm">
                      <thead className="bg-white/10">
                        <tr>
                          <th className="px-2 py-1 text-left border border-white font-normal">
                            Experience
                          </th>
                          <th className="px-2 py-1 text-left border border-white font-normal">
                            Package
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {job.onHover?.table?.map((row, rowIndex) => (
                          <tr
                            key={row.label}
                            className={rowIndex % 2 === 0 ? 'bg-white/10' : ''}
                          >
                            <td className="px-2 py-1 border border-white">
                              {row.label}
                            </td>
                            <td className="px-2 py-1 border border-white">
                              {row.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 text-center">
        <button
          className="px-8 h-9 cursor-pointer bg-[#ea6329] text-white font-semibold rounded-lg shadow-md hover:bg-[#a01830] transition duration-300"
          onClick={() => handleOpenModal(formDetails)}
        >
          {data?.button?.text || 'Enroll Now'} →
        </button>
      </div>

      <AnimatePresence>
        {selectedRole && selectedJob && (
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedRole(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg max-w-md w-full shadow-2xl transform transition-all relative"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <button
                onClick={() => setSelectedRole(null)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>

              <div className="p-8">
                <div className="flex items-start gap-4 mb-8">
                  <div
                    className={`${getRoleColors(
                      data.jobCards.findIndex((j) => j.role === selectedRole)
                    ).bg} p-4 rounded-2xl flex-shrink-0`}
                  >
                    <div className="p-2 text-white">
                      <IconRenderer role={selectedJob?.role} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedJob.role}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600 text-sm">
                        {selectedJob.jobMeter}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {selectedJob.onHover?.table?.map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <div
                          className={`w-5 h-5 ${
                            getRoleColors(
                              data.jobCards.findIndex(
                                (j) => j.role === selectedRole
                              )
                            ).bg
                          } rounded-md flex items-center justify-center flex-shrink-0`}
                        >
                          <Briefcase className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-gray-700 capitalize text-sm">
                          {row.label}
                        </span>
                      </div>
                      <span
                        className={`text-base font-bold bg-gradient-to-r ${
                          getRoleColors(
                            data.jobCards.findIndex(
                              (j) => j.role === selectedRole
                            )
                          ).color
                        } bg-clip-text text-transparent`}
                      >
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default CareerPath;

