"use client";

import { useEffect, useRef } from "react";
import { useBreweryStore } from "@/store/breweriesStore";
import BreweryCard from "./BreweryCard";
import "../globals.css";

export default function BreweryList() {
  const getFilteredList = useBreweryStore((s) => s.filteredList);
  const filteredList = getFilteredList();

  const selected = useBreweryStore((s) => s.selected);
  const visibleCount = useBreweryStore((s) => s.visibleCount);
  const searchName = useBreweryStore((s) => s.searchName);
  const searchCity = useBreweryStore((s) => s.searchCity);

  const fetchInitial = useBreweryStore((s) => s.fetchInitial);
  const expandVisible = useBreweryStore((s) => s.expandVisible);
  const toggleSelect = useBreweryStore((s) => s.toggleSelect);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const isFiltering = searchName.trim() !== "" || searchCity.trim() !== "";

  // показываем только первые visibleCount
  const visible = filteredList.slice(
    0,
    isFiltering ? filteredList.length : visibleCount
  );

  useEffect(() => {
    fetchInitial();
  }, []);

  // 🟡 Infinite scroll должен работать только когда фильтра нет
  useEffect(() => {
    if (isFiltering) return; // ← отключаем скролл при фильтре

    if (!sentinelRef.current) return;
    if (visibleCount >= 15) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          expandVisible();
        }
      },
      { threshold: 1 }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [visibleCount, isFiltering]);

  return (
    <div className="flex flex-col gap-10">
      {filteredList.length === 0 && isFiltering && (
        <div className="text-center text-neutral-400 text-xl py-10">
          Ничего не найдено
        </div>
      )}

      {visible.map((b, i) => (
        <div
          key={b.id}
          style={{ animationDelay: `${i * 60}ms` }}
          className="animate-brew-card"
        >
          <BreweryCard
            b={b}
            isSelected={selected.includes(b.id)}
            toggleSelect={toggleSelect}
          />
        </div>
      ))}

      {!isFiltering && visibleCount < 15 && (
        <div ref={sentinelRef} className="h-20"></div>
      )}
    </div>
  );
}
