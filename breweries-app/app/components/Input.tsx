"use client";

import { useBreweryStore } from "@/store/breweriesStore";

export default function Input() {
  const searchName = useBreweryStore((s) => s.searchName);
  const searchCity = useBreweryStore((s) => s.searchCity);

  const setSearchName = useBreweryStore((s) => s.setSearchName);
  const setSearchCity = useBreweryStore((s) => s.setSearchCity);

  return (
    <div className="flex gap-4 my-6">
      <input
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
        placeholder="Search by name..."
        className="
          w-1/2 px-4 py-2
          bg-[#1c120b]/70
          border border-[#5c3d26]
          text-[#fce1b4]
          placeholder-[#c8a67788]
          rounded-xl
          backdrop-blur-sm
          focus:outline-none
          focus:border-[#d7a259]
          focus:shadow-[0_0_10px_#d7a25955]
          transition-all
        "
      />
      <input
        value={searchCity}
        onChange={(e) => setSearchCity(e.target.value)}
        placeholder="Search by city..."
        className="
          w-1/2 px-4 py-2
          bg-[#1c120b]/70
          border border-[#5c3d26]
          text-[#fce1b4]
          placeholder-[#c8a67788]
          rounded-xl
          backdrop-blur-sm
          focus:outline-none
          focus:border-[#d7a259]
          focus:shadow-[0_0_10px_#d7a25955]
          transition-all
        "
      />
    </div>
  );
}
