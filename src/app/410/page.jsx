import Link from "next/link";
import { FaHome, FaArrowRight, FaExclamationCircle } from "react-icons/fa";

export default function GonePage() {
  return (
    <main className="bg-slate-950 text-white min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Premium Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-950/30 via-slate-950 to-amber-950/20" />
      
      {/* Blurred Decorative Glows */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-2xl w-full text-center">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full mb-6">
          <FaExclamationCircle className="w-4 h-4 text-red-500 animate-pulse" />
          <span className="text-sm text-red-400 font-medium tracking-wide">
            HTTP Status: 410 Gone
          </span>
        </div>

        {/* Large 410 Header */}
        <div className="text-[100px] md:text-[130px] font-black leading-none tracking-tighter mb-4 selection:bg-red-500">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-amber-500">
            410
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4 text-slate-100 tracking-tight">
          Resource Permanently Removed
        </h1>

        {/* Description */}
        <p className="text-lg text-slate-400 max-w-lg mx-auto mb-10 leading-relaxed">
          The link or page you are trying to access has been intentionally deleted and is no longer available in our system.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl font-semibold shadow-lg shadow-red-950/50 hover:shadow-red-600/30 hover:-translate-y-0.5 hover:scale-[1.02] transition-all duration-300 w-full sm:w-auto justify-center"
          >
            <FaHome className="w-5 h-5" />
            Go to Homepage
          </Link>

          <Link
            href="/course"
            className="group flex items-center gap-2 px-8 py-4 bg-slate-900 border border-slate-800 text-slate-300 rounded-xl font-semibold hover:text-white hover:bg-slate-800 hover:border-slate-700 hover:-translate-y-0.5 hover:scale-[1.02] transition-all duration-300 w-full sm:w-auto justify-center"
          >
            Explore Courses
            <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </main>
  );
}
