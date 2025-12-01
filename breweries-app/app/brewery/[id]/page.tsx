"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BreweryPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [brewery, setBrewery] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          `https://api.openbrewerydb.org/v1/breweries/${id}`
        );
        const data = await res.json();
        setBrewery(data);
      } catch (e) {
        console.error("Error loading brewery:", e);
      }
      setLoading(false);
    };

    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen text-white flex justify-center items-center text-2xl">
        Loading...
      </div>
    );
  }

  if (!brewery) {
    return (
      <div className="min-h-screen text-white flex justify-center items-center text-2xl">
        Brewery not found
      </div>
    );
  }

  return (
    <main className="min-h-screen flex justify-center items-center px-6 py-12 text-white">

      {/* === КНОПКА НАЗАД === */}
      <button
        onClick={() => router.back()}
        className="
          absolute top-8 left-8
          px-4 py-2 rounded-xl
          bg-zinc-800/70 border border-zinc-600
          text-white text-lg
          hover:bg-zinc-700 hover:scale-105
          transition-all duration-200
        "
      >
        ← Назад
      </button>

      {/* === КАРТОЧКА БРОВАРНИ === */}
      <div
        className="
          w-full max-w-3xl p-10 rounded-3xl 
          bg-white/10 backdrop-blur-xl shadow-2xl border border-white/20
          animate-fadeIn
        "
      >
        <h1 className="text-4xl font-bold mb-6">{brewery.name}</h1>

        <div className="space-y-4 text-lg">

          {brewery.brewery_type && (
            <p className="text-blue-300">
              <span className="font-semibold">Тип: </span>
              {brewery.brewery_type}
            </p>
          )}

          {(brewery.street || brewery.city) && (
            <p className="flex items-center gap-3">
              <span className="text-red-400 text-xl">📍</span>
              {brewery.street ? `${brewery.street}, ` : ""}
              {brewery.city}, {brewery.state}
            </p>
          )}

          {brewery.phone && (
            <p className="flex items-center gap-3">
              <span className="text-pink-400 text-xl">📞</span>
              {brewery.phone}
            </p>
          )}

          {brewery.website_url && (
            <a
              href={brewery.website_url}
              target="_blank"
              className="flex items-center gap-2 text-blue-300 hover:text-white underline"
            >
              🌐 Перейти на сайт
            </a>
          )}

        </div>
      </div>
    </main>
  );
}
