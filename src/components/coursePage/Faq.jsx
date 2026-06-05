'use client';

import { useState } from 'react';

function Faq({ data }) {
  if (!data?.faq?.length) return null;
  const [open, setOpen] = useState(null);
  
  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - LEFT ALIGNED */}
        <div className="w-full text-left mb-12">
          <div className="inline-block text-left">
            <h2 className="text-3xl sm:text-4xl font-bold text-left">
              <span className="text-[#003366]">{data.heading?.[0] || 'Frequently Asked '}</span>
              <span className="text-[#e84c1f]">{data.heading?.[1] || 'Questions'}</span>
            </h2>
            <div className="w-20 h-1 bg-[#e84c1f] mt-2 rounded-full"></div>
          </div>
          <p className="text-gray-500 text-base mt-4 max-w-2xl">
            Find answers to common questions about our courses, training methods, and career support
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="w-full space-y-3">
          {data.faq.map((item, i) => (
            <div 
              key={i} 
              className={`w-full rounded-xl border transition-all duration-200 ${
                open === i 
                  ? 'border-[#e84c1f] shadow-lg bg-white' 
                  : 'border-gray-200 shadow-sm bg-white hover:shadow-md'
              }`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
              >
                <span className={`text-base font-semibold pr-4 text-left flex-1 ${open === i ? 'text-[#e84c1f]' : 'text-gray-800'}`}>
                  {item.question}
                </span>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ml-4 ${
                  open === i ? 'bg-[#e84c1f] text-white rotate-180' : 'bg-gray-100 text-gray-500'
                }`}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              {open === i && (
                <div className="px-6 pb-5">
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-gray-600 leading-relaxed text-left">
                      {item.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Faq;