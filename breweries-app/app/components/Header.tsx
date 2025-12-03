"use client";

import { useEffect, useState } from "react";
import { useBreweryStore } from "../../store/breweriesStore";
import { motion, AnimatePresence } from "framer-motion";
import Input from "./Input";

export default function Header() {
  const selected = useBreweryStore((s) => s.selected);
  const deleteSelected = useBreweryStore((s) => s.deleteSelected);

  const description = "Explore unique craft breweries near you.";
  const [typed, setTyped] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTyped(description.slice(0, i));
      i++;
      if (i > description.length) clearInterval(interval);
    }, 45);

    return () => clearInterval(interval);
  }, []);

  return (
    <header
      className="
        flex flex-col sm:flex-row 
        sm:items-center sm:justify-between 
        gap-6 mb-10
      "
    >
      <div>
        <h1 className="text-5xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)]">
          Breweries
        </h1>
        <div className="h-px w-28 bg-white/30 mt-3 rounded-full"></div>
        <div className="mt-4">
          <p className="text-white/60 text-lg tracking-wide font-light">
            {typed}
            <span className="ml-1 text-white/40 animate-pulse">|</span>
          </p>
        </div>
      </div>
      <div className="grid">
        <Input />
        <AnimatePresence>
          {selected.length > 0 && (
            <motion.button
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={deleteSelected}
              className="
              px-5 py-3 rounded-2xl text-white text-lg font-medium
              bg-gradient-to-r from-red-500 to-rose-600 
              shadow-lg shadow-red-700/30
              hover:shadow-red-500/50 hover:scale-105
              active:scale-95 transition-all
            "
            >
              Delete selected ({selected.length})
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
