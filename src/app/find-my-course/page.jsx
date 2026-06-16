"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Compass, Sparkles, ArrowRight, RotateCcw, Phone } from "lucide-react";
import { recommend } from "@/data/courses";

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
    options: ["Coding", "Data & Analytics", "Cloud", "Design / 3D", "Marketing", "Testing"],
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
    <main className="main_container py-4 ">
      {/* NEW BANNER SECTION - Full Stack Python Developer Certification Course */}
     <div className="rounded-xl text-white overflow-hidden 
  bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.25),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.25),transparent_40%),linear-gradient(to_right,#0a0028,#011338,#1a0033)]">

  <div className=" max-w-8xl px-6 sm:px-10 lg:px-16 py-12 sm:py-14 lg:py-16">
    <div className="flex flex-col items-center text-center">

      {/* Badge */}
      <span className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold uppercase tracking-wider border border-white/20 mb-6">
        <Sparkles className="h-3.5 w-3.5 mr-1.5" />
        Course Finder
      </span>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight tracking-tight max-w-4xl">
       Choose the right course in 60 seconds, zero guesswork, maximum clarity.
      </h1>

      {/* Description */}
      <p className="md:mt-5 mt-3 text-sm sm:text-base text-white/80 max-w-2xl">
        Hot picks right now: Full Stack Java, Full Stack Python, Cybersecurity, Gen AI,
        AWS + DevOps, Data Science, Data Analytics, Digital Marketing, BIM-Revit MEP,
        AutoCAD, Medical Coding, SAP FICO, SAP MM, and Testing Automation.
        Answer 5 quick questions, and we&apos;ll instantly match you with the course that
        fits your goals best.
      </p>

    </div>
  </div>
</div>

   

      <section className="mx-auto max-w-2xl px-6 py-14">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm md:p-10">
          {!done ? (
            <>
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                <Compass className="h-4 w-4" /> Step {step + 1} of {total}
              </div>
              <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${((step + 1) / total) * 100}%` }}
                />
              </div>
              <h2 className="text-2xl font-bold text-foreground md:text-3xl">{current.label}</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {current.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => pick(opt)}
                    className="rounded-xl border border-border bg-background p-4 text-left transition-colors hover:border-primary hover:bg-accent"
                  >
                    <span className="font-semibold text-foreground">{opt}</span>
                    {current.key === "time" && TIME_HELP[opt] && (
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {TIME_HELP[opt]}
                      </span>
                    )}
                    {current.key === "budget" && BUDGET_HELP[opt] && (
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {BUDGET_HELP[opt]}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              {step > 0 && (
                <button
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  className="mt-6 text-sm cursor-pointer bg-[#2a619d] border-2 border-[#2a619d] text-white px-4 py-2 rounded-md hover:bg-white hover:text-[#2a619d] hover:border-[#2a619d] hover:border-2"
                >
                  ← Back
                </button>
              )}
            </>
          ) : (
            <div>
              <div className="flex items-center gap-2 text-amber-600">
                <Sparkles className="h-5 w-5" />
                <span className="font-bold">Your matches</span>
              </div>
              <h2 className="mt-1 text-2xl font-bold text-foreground md:text-3xl">
                Recommended for you
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Based on your answers, these courses are the strongest fit.
              </p>

              <div className="mt-6 grid gap-3">
                {matches.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/courses/${c.slug}`}
                    className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background p-4 transition-all hover:border-primary hover:shadow-sm"
                  >
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">
                        {c.category}
                      </p>
                      <p className="font-bold text-foreground">{c.shortTitle}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {c.duration} • {c.price}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">{c.blurb}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
                  </Link>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/discover/contact-us"
                  className="inline-flex items-center justify-center text-white py-3 rounded-md bg-[#2a619d] border-2 border-[#2a619d] px-4 text-sm font-semibold hover:bg-white hover:text-[#2a619d] hover:border-[#2a619d] hover:border-2"
                >
                  Talk to a counsellor
                </Link>
                <button
                  onClick={reset}
                  className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
                >
                  <RotateCcw className="h-4 w-4" /> Restart
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}