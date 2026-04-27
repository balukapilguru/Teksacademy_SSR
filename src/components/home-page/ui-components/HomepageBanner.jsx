import Image from "next/image";
import heroImg from "../../../app/assets/hero-students.jpg";

const HomepageBanner = () => {
  return (
    <section id="home" className="relative min-h-[100svh] flex items-center pb-8 pt-32 overflow-hidden bg-blue-600 text-white">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={heroImg}
          alt="Teks Academy students"
          fill
          className="object-cover opacity-25"
          priority
        />
        <div className="absolute inset-0 bg-blue-900/70" />
      </div>

      <div className="container relative z-10 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium mb-6">
            <span className="text-yellow-400">★</span>
            India&apos;s Trusted Software Training Institute • 14 Years
          </div>

          <h1 className="font-bold text-4xl sm:text-5xl lg:text-7xl leading-tight">
            Transferring <span className="text-yellow-400">Expert Knowledge</span><br />
            to Students
          </h1>

          <p className="mt-6 text-lg lg:text-xl text-white/80 max-w-xl">
            Learn industry-relevant skills through expert-led training, live projects, and placement-oriented guidance designed to help you grow with confidence.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button className="bg-yellow-400 text-blue-900 font-semibold px-6 py-3 rounded-lg hover:bg-yellow-300 transition-colors">
              Find My Course
            </button>
            <button className="bg-white/10 border border-white/30 text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/20 transition-colors">
              Watch Demo
            </button>
          </div>

          <div className="mt-10 flex items-center gap-6">
            <div className="flex -space-x-3">
              {[
                "bg-pink-400",
                "bg-amber-400",
                "bg-emerald-400",
                "bg-sky-400",
              ].map((c, i) => (
                <div key={i} className={`w-10 h-10 rounded-full ${c} ring-2 ring-blue-900`} />
              ))}
            </div>
            <div>
              <div className="font-bold text-2xl">2,400+ Placed</div>
              <div className="text-sm text-white/70">in the last 12 months • avg ₹7.4 LPA</div>
            </div>
          </div>
        </div>

        {/* Course Finder Card */}
        <div className="lg:col-span-5">
          <div className="bg-white/95 rounded-3xl p-6 lg:p-8 text-gray-800 shadow-xl">
            <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 mb-1">
              <span>✨</span> Course Finder
            </div>
            <h3 className="font-bold text-2xl">Not sure where to start?</h3>
            <p className="text-gray-500 mt-1">Answer 3 quick questions, get a personalized roadmap.</p>

            <div className="mt-5 space-y-3">
              <select className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-white text-sm font-medium">
                <option>I want a career in...</option>
                <option>Web Development</option>
                <option>Data Science / AI</option>
                <option>Cloud / DevOps</option>
                <option>Cybersecurity</option>
              </select>
              <select className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-white text-sm font-medium">
                <option>My background is...</option>
                <option>Fresher / Student</option>
                <option>Working IT professional</option>
                <option>Career switcher</option>
              </select>
              <select className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-white text-sm font-medium">
                <option>Preferred mode</option>
                <option>Online (live)</option>
                <option>Offline (classroom)</option>
                <option>Hybrid</option>
              </select>
              <button className="w-full bg-yellow-400 text-blue-900 font-bold py-3 rounded-lg hover:bg-yellow-300 transition-colors">
                Show My Recommended Course
              </button>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-gray-500">
              <div className="rounded-xl bg-gray-100 py-2"><b className="block text-gray-800 text-base">95%</b>Placement</div>
              <div className="rounded-xl bg-gray-100 py-2"><b className="block text-gray-800 text-base">10K+</b>Alumni</div>
              <div className="rounded-xl bg-gray-100 py-2"><b className="block text-gray-800 text-base">4.9★</b>Rated</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomepageBanner;
