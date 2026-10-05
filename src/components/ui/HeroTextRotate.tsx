"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const words = ["Inovação", "Robustez", "Engenharia", "Excelência"];

export default function HeroTextRotate() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="inline-flex overflow-hidden py-2 h-20 sm:h-24 md:h-28 items-center">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="text-primary drop-shadow-[0_0_25px_rgba(2,132,199,0.5)] block"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}