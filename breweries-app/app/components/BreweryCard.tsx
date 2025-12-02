"use client";

import { Brewery } from "../../store/breweriesStore";
import { useRouter } from "next/navigation";

interface Props {
  b: Brewery;
  isSelected: boolean;
  toggleSelect: (id: string) => void;
}

export default function BreweryCard({ b, isSelected, toggleSelect }: Props) {
  const router = useRouter();

  return (
    <div
      onClick={() =>
        router.push(`/brewery/${b.id}?name=${encodeURIComponent(b.name)}`)
      }
      onContextMenu={(e) => {
        e.preventDefault();
        toggleSelect(b.id);
      }}
      className={`
        group relative p-8 rounded-3xl cursor-pointer overflow-hidden
        border transition-all duration-300 shadow-xl backdrop-blur-sm

        ${
          isSelected
            ? "border-amber-400 ring-2 ring-amber-500 shadow-amber-500/40 scale-[1.03]"
            : "border-amber-800/40 hover:border-amber-500/60 hover:scale-[1.02]"
        }

        bg-[rgba(43,28,18,0.65)]
    `}
    >
      {/* Amber Glow */}
      <div
        className={`
        absolute inset-0 pointer-events-none rounded-3xl opacity-0
        group-hover:opacity-40 blur-xl transition duration-500

        ${isSelected ? "bg-amber-500/30" : "bg-amber-400/10"}
        `}
      />

      {/* Title */}
      <h2 className="relative text-3xl font-bold mb-3 tracking-tight text-amber-200 drop-shadow">
        {b.name}
      </h2>

      {/* Type */}
      {b.brewery_type && (
        <p className="relative text-sm uppercase tracking-[0.2em] text-amber-400/70 mb-4">
          {b.brewery_type}
        </p>
      )}

      {/* Address */}
      <div className="relative text-lg text-amber-100/90 leading-relaxed space-y-1">
        {b.street && <div>{b.street}</div>}
        <div>
          {b.city}, {b.state}
        </div>
      </div>

      {/* Phone */}
      {b.phone && (
        <p className="relative mt-4 text-amber-200/80 text-lg mb-2">
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
            relative mt-5 text-amber-300
            hover:text-amber-100 underline decoration-amber-400/50
            transition-all duration-200 contents
        "
        >
          🌐 Visit website
        </a>
      )}
    </div>
  );
}
