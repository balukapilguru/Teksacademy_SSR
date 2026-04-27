"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Particles() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 z-0">
      {Array.from({ length: 60 }).map((_, i) => {
        const x = Math.random() * 1200;
        const y = Math.random() * 600;
        const size = Math.random() * 6 + 2; 
        const duration = 4 + Math.random() * 6; 
        const delay = Math.random() * 5; 

        return (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            style={{ width: size, height: size }}
            initial={{ x, y, opacity: 0.2, scale: 0.5 }}
            animate={{
              y: [y, y - 100], 
              opacity: [0.2, 0.6, 0.2],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
}

