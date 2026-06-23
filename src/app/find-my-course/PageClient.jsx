"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Compass, Sparkles, ArrowRight, RotateCcw } from "lucide-react";
import { recommend } from "@/data/CoursesNames";

const STEPS = [
  {
    key: "goal",
    label: "What's your primary goal?",
    options: [
      "Land my first IT job",
      "Switch to a tech career",
      "Get a salary hike",
      "Freelance / Build a startup",
      "Upskill while studying",
    ],
  },
  {
    key: "interest",
    label: "Which area excites you most?",
    options: [
      "Coding",
      "Data & Analytics",
      "Cloud",
      "Design / 3D",
      "Marketing",
      "Testing",
      "Cybersecurity",
      "AI / Gen AI",
      "Business / SAP",
    ],
  },
  {
    key: "experience",
    label: "What's your current experience level?",
    options: ["Beginner", "Intermediate", "Advanced"],
  },
  {
    key: "time",
    label: "How much time can you dedicate?",
    options: ["Light", "Moderate", "Intense"],
  },
  {
    key: "budget",
    label: "What's your budget range?",
    options: ["Low", "Mid", "High"],
  },
];

const TIME_HELP = {
  Light: "1-2 hrs / day or weekends only",
  Moderate: "3-5 hrs / day",
  Intense: "Full-time / immersive",
};
const BUDGET_HELP = {
  Low: "Under ₹20,000",
  Mid: "₹20,000 – ₹30,000",
  High: "₹30,000+",
};

// Course URL mapping based on actual course slugs
const getCourseUrl = (slug) => {
  const courseUrls = {
    "full-stack-python": "/courses/best-full-stack-python-development-course-training-institute",
    "full-stack-java": "/courses/best-full-stack-java-development-course-training-institute",
    "data-science": "/courses/best-data-science-course-training-institute",
    "data-analytics": "/courses/best-data-analytics-course-training-institute",
    "power-bi-analytics": "/courses/best-power-bi-analytics-course-training-institute",
    "business-analytics": "/courses/best-business-analytics-course-training-institute",
    "aws-devops": "/courses/best-awsplusdevops-course-training-institute",
    "cyber-security": "/courses/best-cyber-security-course-training-institute",
    "generative-ai": "/courses/best-generative-ai-course-training-institute",
    "digital-marketing": "/courses/best-digital-marketing-course-training-institute",
    "bim-revit": "/courses/best-bim-building-information-modeling-course-training-institute",
    "autocad": "/courses/best-autocad-course-training-institute",
    "revit-mep-certification": "/courses/best-revit-mep-certification-course-training-institute",
    "multimedia": "/courses/best-multimedia-course-training-institute",
    "manual-automation-testing": "/courses/best-testingtools-course-training-institute",
    "sap-fico": "/courses/best-sap-fico-finance-and-controlling-course-training-institute",
    "sap-mm": "/courses/best-sapmm-course-training-institute",
  };
  
  return courseUrls[slug] || `/courses/${slug}`;
};

export default function FindMyCourse() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const total = STEPS.length;
  const done = step >= total;
  const matches = useMemo(() => (done ? recommend(answers) : []), [done, answers]);

  const current = STEPS[step];

  const pick = (value) => {
    setAnswers((prev) => ({ ...prev, [current.key]: value }));
    setStep((s) => s + 1);
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Banner Section with Background Color */}
      <section className="bg-gradient-to-r from-[#2a619d] to-[#1a4a7a] text-white">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-12 md:py-16 lg:py-20">
          <div className="flex flex-col items-center justify-center text-center max-w-5xl mx-auto">
            <span className="inline-flex items-center rounded-full bg-white/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/90 mb-4">
              Course Finder
            </span>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight max-w-4xl mx-auto">
              Choose the right course in 60 seconds, 
              <span className="text-amber-300 block sm:inline"> zero guesswork, maximum clarity.</span>
            </h1>
            
            <p className="mt-4 md:mt-6 text-sm sm:text-base md:text-lg text-white/90 max-w-3xl mx-auto leading-relaxed">
              Hot picks right now: Full Stack Java, Full Stack Python, Cybersecurity, Gen AI, AWS + DevOps, 
              Data Science, Data Analytics, Digital Marketing, BIM-Revit MEP, AutoCAD, Medical Coding, 
              SAP FICO, SAP MM, and Testing Automation. Answer 5 quick questions, and we'll instantly 
              match you with the course that fits your goals best.
            </p>
          </div>
        </div>
      </section>

      {/* Quiz Section - Limited Width Container */}
      <section className="flex justify-center px-4 sm:px-6 py-12 md:py-16">
        <div className="w-full max-w-3xl">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 md:p-10 shadow-lg">
            {!done ? (
              <>
                <div className="mb-2 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2a619d]">
                  <Compass className="h-4 w-4" /> Step {step + 1} of {total}
                </div>
                <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-[#2a619d] transition-all duration-300"
                    style={{ width: `${((step + 1) / total) * 100}%` }}
                  />
                </div>
                
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">{current.label}</h2>
                </div>
                
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {current.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => pick(opt)}
                      className="rounded-xl border border-gray-200 bg-white p-4 text-left transition-all hover:border-[#2a619d] hover:bg-blue-50 hover:shadow-md"
                    >
                      <span className="font-semibold text-gray-900">{opt}</span>
                      {current.key === "time" && TIME_HELP[opt] && (
                        <span className="mt-1 block text-xs text-gray-500">
                          {TIME_HELP[opt]}
                        </span>
                      )}
                      {current.key === "budget" && BUDGET_HELP[opt] && (
                        <span className="mt-1 block text-xs text-gray-500">
                          {BUDGET_HELP[opt]}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                
                {step > 0 && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={() => setStep((s) => s - 1)}
                      className="text-sm text-gray-500 hover:text-[#2a619d] transition-colors"
                    >
                      ← Back
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div>
                <div className="flex items-center justify-center gap-2 text-amber-600 mb-4">
                  <Sparkles className="h-5 w-5" />
                  <span className="font-bold">Your matches</span>
                </div>
                
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                    Recommended for you
                  </h2>
                  <p className="mt-2 text-sm text-gray-500">
                    Based on your answers, these courses are the strongest fit.
                  </p>
                </div>

                <div className="mt-6 grid gap-4">
                  {matches.map((c) => (
                    <Link
                      key={c.slug}
                      href={getCourseUrl(c.slug)}
                      className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-[#2a619d] hover:shadow-md"
                    >
                      <div>
                        <p className="text-xs uppercase tracking-wider text-gray-500">
                          {c.category}
                        </p>
                        <p className="font-bold text-gray-900">{c.shortTitle}</p>
                        <p className="mt-0.5 text-xs text-gray-500">
                          {c.duration} • {c.price}
                        </p>
                        <p className="mt-1 text-sm text-gray-600">{c.blurb}</p>
                      </div>
                      <ArrowRight className="h-5 w-5 shrink-0 text-[#2a619d]" />
                    </Link>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-lg bg-[#2a619d] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1e4a7a]"
                  >
                    Talk to a counsellor
                  </Link>
                  <button
                    onClick={reset}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <RotateCcw className="h-4 w-4" /> Restart
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}