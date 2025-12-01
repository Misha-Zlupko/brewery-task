"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useBreweryStore } from "../store/breweriesStore";

export default function HomePage() {
  const router = useRouter();

  const renderList = useBreweryStore((s) => s.renderList);
  const selected = useBreweryStore((s) => s.selected);

  const visibleCount = useBreweryStore((s) => s.visibleCount);
  const visible = renderList.slice(0, visibleCount);

  const fetchInitial = useBreweryStore((s) => s.fetchInitial);
  const deleteSelected = useBreweryStore((s) => s.deleteSelected);
  const toggleSelect = useBreweryStore((s) => s.toggleSelect);
  const expandVisible = useBreweryStore((s) => s.expandVisible);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchInitial();
  }, []);

  // Сбрасываем выбранные элементы при выходе со страницы
useEffect(() => {
  return () => {
    useBreweryStore.setState({ selected: [] });
  };
}, []);


  // 🔥 Lazy scroll 5 → 10 → 15
  useEffect(() => {
    if (!sentinelRef.current) {
      return;
    }
    if (visibleCount >= 15) {
      return;
    }

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
  }, [visibleCount]);

  return (
    <main className="min-h-screen text-white flex justify-center px-4 py-8">
      <div className="w-full max-w-4xl">

        {/* HEADER */}
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-5xl font-extrabold">Пивоварни</h1>
            <div className="h-px w-24 bg-zinc-600 mt-3"></div>
          </div>

          {selected.length > 0 && (
            <button
              onClick={deleteSelected}
              className="px-5 py-3 rounded-xl bg-red-600 text-white text-lg hover:bg-red-700"
            >
              Удалить выбранное ({selected.length})
            </button>
          )}
        </header>

        {/* CARDS */}
        <div className="flex flex-col gap-10">
          {visible.map((b, index) => {
            const isSelected = selected.includes(b.id);

            return (
              <div
  key={b.id}
  onClick={() =>
    router.push(`/brewery/${b.id}?name=${encodeURIComponent(b.name)}`)
  }
  onContextMenu={(e) => {
    e.preventDefault();
    toggleSelect(b.id);
  }}
  className={`
    group relative p-8 rounded-3xl border backdrop-blur-xl
    bg-zinc-900/40 shadow-2xl cursor-pointer overflow-hidden

    transition-all duration-300 

    ${
      isSelected
        ? "border-blue-400/60 ring-2 ring-blue-500/60 shadow-blue-500/20 scale-[1.03]"
        : "border-zinc-700/60 hover:border-zinc-500 hover:scale-[1.02]"
    }
  `}
>
  {/* Background Glow */}
  <div
    className={`
      absolute inset-0 pointer-events-none rounded-3xl opacity-0
      group-hover:opacity-100 blur-2xl transition duration-500
      ${isSelected ? "bg-blue-500/20" : "bg-white/5"}
    `}
  />

  {/* Title */}
  <h2 className="relative text-3xl font-bold mb-4 tracking-tight text-white">
    {b.name}
  </h2>

  {/* Type */}
  {b.brewery_type && (
    <p className="relative text-sm uppercase tracking-[0.2em] text-blue-300/70 mb-4">
      {b.brewery_type}
    </p>
  )}

  {/* Address */}
  <div className="relative text-lg text-gray-200/90 leading-relaxed space-y-1">
    {b.street && <div>{b.street}</div>}
    <div>
      {b.city}, {b.state}
    </div>
  </div>

  {/* Phone */}
  {b.phone && (
    <p className="relative mt-5 text-gray-300/80 text-lg">
      📞 {b.phone}
    </p>
  )}

  {/* Website */}
  {b.website_url && (
    <a
      href={b.website_url}
      target="_blank"
      onClick={(e) => e.stopPropagation()}
      className="
        relative inline-block mt-5 text-blue-300
        hover:text-white underline decoration-blue-400/50
        transition-all duration-200
      "
    >
      🌐 Открыть сайт
    </a>
  )}
              </div>

            );
          })}
        </div>

        {/* SENTINEL */}
        {visibleCount < 15 && <div ref={sentinelRef} className="h-20"></div>}
      </div>
    </main>
  );
}
