"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BreweryMap from "@/app/components/BreweryMap";
import Image from "next/image";

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
      <div className="w-full flex flex-col items-center justify-center py-20">
        <Image
          src="/cheers.png"
          alt="Loading..."
          width={120}
          height={120}
          className="w-28 h-28 opacity-90 animate-rotate"
        />
        <p className="mt-4 text-white/70 text-lg animate-pulse">
          Loading breweries...
        </p>
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

  // === PAGE RENDER ===
  return (
    <main className="min-h-screen flex justify-center items-center px-6 py-12 text-white">
      {/* === BACK BUTTON === */}
      <button
        onClick={() => router.back()}
        className="
            fixed top-6 left-6 z-50
            px-4 py-2 rounded-xl
            bg-zinc-800/80 border border-white/20
            backdrop-blur-md
            text-white text-lg
            shadow-lg
            hover:bg-zinc-700 hover:scale-105
            transition-all duration-200
          "
      >
        ← Back
      </button>
      {/* === CARD === */}
      <div
        className="
            w-full max-w-3xl p-10 rounded-3xl 
            bg-white/10 backdrop-blur-xl shadow-2xl border border-white/20
            animate-fadeIn mt-12
          "
      >
        <h1 className="text-4xl font-bold mb-6">{brewery.name}</h1>

        <div className="space-y-4 text-lg">
          {brewery.brewery_type && (
            <p className="text-blue-300">
              <span className="font-semibold">Type: </span>
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
              className="items-center contents gap-2 text-blue-300 hover:text-white underline"
            >
              🌐 Open website
            </a>
          )}
        </div>
        <div className="mt-10 mb-2">
          <BreweryMap
            latitude={brewery.latitude}
            longitude={brewery.longitude}
          />
        </div>
        {/* <BreweryMap lat={40.7128} lng={-74.006} />   */}
      </div>
    </main>
  );
}
