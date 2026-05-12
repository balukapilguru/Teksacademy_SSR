'use client';

import { useState } from 'react';

function Faq({ data }) {
  if (!data?.faq?.length) return null;
  const [open, setOpen] = useState(null);
  return (
    <section className="py-14 bg-[#f8fafd]">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-10">
          <span className="text-[#003366]">{data.heading?.[0] || 'Frequently Asked '}</span>
          <span className="text-[#e84c1f]"> {data.heading?.[1] || 'Questions'}</span>
        </h2>
        <div className="space-y-3">
          {data.faq.map((item, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left px-5 py-4 flex items-center justify-between text-[16px] font-normal text-gray-900"
              >
                <span className=''>{item.question}</span>
                <span className="text-[#e84c1f] text-lg font-bold shrink-0 ml-4">
                  {open === i ? "−" : "+"}
                </span>
              </button>
              {open === i && (
                <div className="px-5 pb-4">
                  <p className="text-sm text-gray-600 leading-relaxed">{item.answer}</p>
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