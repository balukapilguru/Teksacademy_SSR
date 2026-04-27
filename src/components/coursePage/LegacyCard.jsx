"use client";
import React, { useState, useEffect } from "react";

const LegacyCard = ({ data }) => {
  const [animateStats, setAnimateStats] = useState(false);

  useEffect(() => {
    setAnimateStats(true);
  }, []);

 
  const defaultStats = [
    {
      color: "#295f9c",
      value: "4.72",
      max: "5",
      percent: 94.4,
      line1: "Overall Program ",
      line2: "Rating",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
      ),
    },
    {
      color: "#6b2492",
      value: "99",
      max: "100",
      percent: 99,
      line1: "Sessions Rated",
      line2: "",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="7" r="4" />
          <path d="M5.5 21a7.5 7.5 0 0 1 13 0" />
          <polygon points="5 3 6 6 9 6 6.5 8 7.5 11 5 9.5 2.5 11 3.5 8 1 6 4 6" />
          <polygon points="19 3 20 6 23 6 20.5 8 21.5 11 19 9.5 16.5 11 17.5 8 15 6 18 6" />
        </svg>
      ),
    },
    {
      color: "#1a737b",
      value: "4.8",
      max: "5",
      percent: 96,
      line1: "Average Session",
      line2: "Rating",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M7 21h10" />
          <path d="M12 17v4" />
          <line x1="6" y1="7" x2="6.01" y2="7" />
          <line x1="10" y1="7" x2="10.01" y2="7" />
          <line x1="14" y1="7" x2="14.01" y2="7" />
        </svg>
      ),
    },
  ];

  
  const stats = data && data.length > 0 ? data.map((card, index) => {    
    const defaultStat = defaultStats[index] || defaultStats[0];
    const [value, max] = card.value.split('/');
   
    return {
      color: defaultStat.color,
      value: value,
      max: max,
      percent: defaultStat.percent,
      line1: card.label.split(' ')[0] + ' ' + (card.label.split(' ')[1] || ''),
      line2: card.label.split(' ').slice(2).join(' ') || card.label.split(' ')[1],
      icon: defaultStat.icon
    };
  }) : defaultStats;
  return (
    <div className="bg-white">
      <div className="max-w-8xl mx-auto">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-5 mb-8 main_container">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
              style={{
                animation: animateStats 
                  ? `slideUp 0.6s ease-out ${i * 0.2}s both`
                  : 'none'
              }}
            >
              <div className="flex justify-between">
                <div
                  className="absolute inset-0 opacity-10 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(135deg, ${stat.color}, ${stat.color}40)`,
                  }}
                ></div>

                <div
                  className="flex w-16 h-16 rounded-2xl items-center justify-center mb-5 text-white shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500"
                  style={{ backgroundColor: stat.color }}
                >
                  {stat.icon}
                </div>

                <div className="mb-3">
                  {/* Flex container aligned properly */}
                  <div className="flex justify-end items-baseline gap-1 mb-1">
                    <span
                      className="text-3xl font-bold"
                      style={{ color: stat.color }}
                    >
                      {stat.value}
                    </span>
                    <span className="text-2xl font-semibold text-gray-400">
                      /{stat.max}
                    </span>
                  </div>

                  {/* Description */}
                  <div className="text-gray-600 font-medium text-lg text-right">
                    <div>{stat.line1}</div>
                    <div>{stat.line2}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default LegacyCard;
