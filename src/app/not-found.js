// "use client";

// import { useRouter } from "next/navigation";
// import { FaRocket, FaHome, FaRedo } from "react-icons/fa";

// export default function NotFound2() {
//   const router = useRouter();

//   return (
//     <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 overflow-hidden relative">
//       <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900 to-slate-900" />

//       <div className="absolute inset-0">
//         {[...Array(50)].map((_, i) => (
//           <div
//             key={i}
//             className="absolute bg-white rounded-full animate-pulse"
//             style={{
//               width: Math.random() * 3 + 1 + "px",
//               height: Math.random() * 3 + 1 + "px",
//               top: Math.random() * 100 + "%",
//               left: Math.random() * 100 + "%",
//               animationDelay: Math.random() * 3 + "s",
//               animationDuration: Math.random() * 3 + 2 + "s",
//             }}
//           />
//         ))}
//       </div>

//       <div className="relative z-10 max-w-3xl w-full text-center">
//         <div className="mb-8 flex justify-center">
//           <div className="relative">
//             <FaRocket className="w-32 h-32 text-blue-400 animate-bounce" />
//             <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 bg-orange-500/30 rounded-full blur-xl" />
//           </div>
//         </div>

//         <h1 className="text-8xl md:text-9xl font-black mb-6">
//           <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 animate-pulse">
//             404
//           </span>
//         </h1>

//         <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
//           Lost in Space
//         </h2>
//         <p className="text-xl text-slate-400 mb-10 max-w-xl mx-auto">
//           Houston, we have a problem. The page you're looking for has drifted into the cosmos.
//         </p>

//         <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
//           <button
//             onClick={() => router.push("/")}
//             className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 hover:-translate-y-1 transition-all duration-300"
//           >
//             <FaHome className="w-5 h-5" />
//             Return to Earth
//           </button>

//           <button
//             onClick={() => router.back()}
//             className="flex items-center gap-3 px-8 py-4 bg-slate-800 text-white border-2 border-slate-700 rounded-lg font-semibold hover:bg-slate-700 hover:-translate-y-1 transition-all duration-300"
//           >
//             <FaRedo className="w-5 h-5" />
//             Try Again
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
import Link from "next/link";
import { FaExclamationCircle, FaHome, FaArrowRight, FaCompass } from "react-icons/fa";

export default function NotFound4() {
  return (
    <div className="bg-slate-950 text-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/50 via-slate-950 to-teal-950/50" />

      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="relative z-10 max-w-5xl w-full">
        <div className="text-center mb-12 mt-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-[#ea6329] rounded-full mb-4">
            <FaExclamationCircle className="w-4 h-4 text-[#ea6329]" />
            <span className="text-sm text-[#ea6329] font-medium">
              System Status: Page Not Found
            </span>
          </div>

          <div className="text-[100px] md:text-[120px] font-black leading-none mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#002B80] via-[#4FA9FF] to-[#002B80]">
              404
            </span>
          </div>

          <h2 className="text-2xl font-bold mb-4 text-slate-200">
            Route Not Accessible
          </h2>

          <div className="text-lg text-slate-400 max-w-2xl mx-auto mb-4">
            The requested endpoint does not exist in our system. Please verify the URL or navigate back to a known location.
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="group bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105">
            <FaHome className="w-8 h-8 text-emerald-400 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Home</h3>
            <div className="text-sm text-slate-400 mb-4">Return to homepage</div>

            <Link
              href="/"
              className="text-emerald-400 text-sm font-medium flex items-center gap-2 group-hover:gap-3 transition-all"
            >
              Go Home <FaArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="group bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-6 hover:border-teal-500/50 transition-all duration-300 hover:scale-105">
            <FaCompass className="w-8 h-8 text-teal-400 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Courses</h3>
            <div className="text-sm text-slate-400 mb-4">Explore Our Courses</div>

            <Link
              href="/courses"
              className="text-teal-400 text-sm font-medium flex items-center gap-2 group-hover:gap-3 transition-all"
            >
              Explore <FaArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="group bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105">
            <FaExclamationCircle className="w-8 h-8 text-cyan-400 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Contact us</h3>
            <div className="text-sm text-slate-400 mb-4">Get help from our team</div>

            <Link
              href="/support"
              className="text-cyan-400 text-sm font-medium flex items-center gap-2 group-hover:gap-3 transition-all"
            >
              Contact us <FaArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* <div className="text-center">
          <p className="text-sm text-slate-500">
            Error Code: <span className="font-mono text-emerald-400">HTTP_404_NOT_FOUND</span>
          </p>
        </div> */}
      </div>
    </div>
  );
}

