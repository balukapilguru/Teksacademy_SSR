"use client";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";


const AdmissionForm = () => {
  return (
    <div className="w-full max-w-md mx-auto mt-3 lg:mt-0">
      <div className="relative">
        <div className="absolute -inset-6 rounded-[2.5rem]" />
        <div className="absolute -inset-1 bg-gradient-to-br from-primary-foreground/30 via-transparent to-secondary/20 rounded-[2rem] blur-xl" />
        <div
          className="relative glass text-foreground rounded-3xl p-6 lg:p-8 ring-1 bg-white"
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-primary mb-1">
            <Sparkles className="w-4 h-4 text-secondary" /> Course Finder
          </div>
          <h3 className="font-display font-bold text-2xl">Not sure where to start?</h3>
          <p className="text-muted-foreground mt-1">Answer 3 quick questions, get a personalized roadmap.</p>

          <div className="mt-5 space-y-3">
            <select className="w-full h-12 px-4 rounded-xl border border-input bg-background/70 backdrop-blur text-sm font-medium">
              <option>I want a career in...</option>
              <option>Web Development</option>
              <option>Data Science / AI</option>
              <option>Cloud / DevOps</option>
              <option>Cybersecurity</option>
            </select>
            <select className="w-full h-12 px-4 rounded-xl border border-input bg-background/70 backdrop-blur text-sm font-medium">
              <option>My background is...</option>
              <option>Fresher / Student</option>
              <option>Working IT professional</option>
              <option>Career switcher</option>
            </select>
            <select className="w-full h-12 px-4 rounded-xl border border-input bg-background/70 backdrop-blur text-sm font-medium">
              <option>Preferred mode</option>
              <option>Online (live)</option>
              <option>Offline (classroom)</option>
              <option>Hybrid</option>
            </select>
            <button className="w-full h-12 bg-blue-900 text-white rounded-xl font-medium flex items-center justify-center hover:bg-blue-800 transition">
              Show My Recommended Course <ArrowRight className="ml-1 w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-center  text-xs text-muted-foreground">
            <div className="rounded-xl glass-tint py-2 bg-gray-100">
              <b className="block text-foreground text-base">95%</b>Placement
            </div>
            <div className="rounded-xl glass-tint py-2 bg-gray-100">
              <b className="block text-foreground text-base">10K+</b>Alumni
            </div>
            <div className="rounded-xl glass-tint py-2 bg-gray-100">
              <b className="block text-foreground text-base">4.9★</b>Rated
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmissionForm;