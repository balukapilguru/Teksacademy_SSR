"use client"
import {  useEffect,  useState } from "react";
import Image from "next/image";

export default function Loading({ message = "Loading..." }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 400,
      y: Math.random() * 400,
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);
  }, []);
  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Floating Particles */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              animation: `pulse 3s ease-in-out infinite ${particle.delay}s, float 6s ease-in-out infinite ${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Center Content */}
      <div className="text-center space-y-2 z-10">
        {/* Orbiting Animation */}
        <div className="relative w-40 h-30 mx-auto">
          <div className="absolute inset-0 animate-spin-slow">
            <div className="absolute top-0 left-1/2 w-3 h-3 bg-primary rounded-full -translate-x-1/2"></div>
            <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-primary/70 rounded-full -translate-x-1/2"></div>
            <div className="absolute left-0 top-1/2 w-2 h-2 bg-primary/50 rounded-full -translate-y-1/2"></div>
            <div className="absolute right-0 top-1/2 w-3 h-3 bg-primary/80 rounded-full -translate-y-1/2"></div>
          </div>

          {/* Logo */}
          <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center ">
            <Image
              src="https://teksversity.s3.us-east-1.amazonaws.com/website/assets/home/loaderteks.gif"
              alt="Institute of Advanced Learning"
              className="animate-bounce-gentle"
              height={120} // increased
              width={120} // increased
              unoptimized
            />
          </div>
        </div>


       
        <div className="space-y-0">
        

          {/* Connecting Dots */}
          <div className="flex justify-center items-center space-x-4 mt-6">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <div className="w-8 h-0.5 bg-gradient-to-r from-primary to-transparent animate-pulse"></div>
            <div
              className="w-2 h-2 bg-primary/70 rounded-full animate-pulse"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div
              className="w-5 h-0.5 bg-gradient-to-r from-primary/70 to-transparent animate-pulse"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div
              className="w-2 h-2 bg-primary/50 rounded-full animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

