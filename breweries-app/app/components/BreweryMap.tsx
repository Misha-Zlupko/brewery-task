"use client";

import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { motion } from "framer-motion";

interface Props {
  latitude?: string | number | null;
  longitude?: string | number | null;
}

export default function BreweryMap({ latitude, longitude }: Props) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

  const lat = latitude != null ? Number(latitude) : null;
  const lng = longitude != null ? Number(longitude) : null;

  if (!apiKey) {
    return (
      <div className="text-red-400 text-center p-4 font-semibold">
        Missing Google API key
      </div>
    );
  }

  if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
    return (
      <div
        className="
        w-full h-[320px] flex items-center justify-center 
        rounded-2xl bg-[#0f1624]/50 border border-white/10
        text-gray-400
      "
      >
        No valid coordinates
      </div>
    );
  }

  const coords = { lat, lng };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="
        relative overflow-hidden rounded-3xl 
        shadow-[0_0_40px_rgba(0,0,0,0.4)]
        border border-white/10 
        backdrop-blur-xl
      "
    >
      <div
        className="
        absolute inset-0 rounded-3xl 
        pointer-events-none 
        bg-gradient-to-br from-white/20 to-transparent 
        opacity-[0.25]
      "
      />
      <div
        className="
        absolute bottom-0 left-1/2 -translate-x-1/2
        w-[80%] h-[80px] 
        bg-pink-500/20 blur-3xl rounded-full
        pointer-events-none
      "
      />
      <APIProvider apiKey={apiKey} version="beta">
        <Map
          style={{ width: "100%", height: "320px" }}
          defaultCenter={coords}
          defaultZoom={14}
          gestureHandling="greedy"
          disableDefaultUI={true}
        >
          <Marker position={coords} />
        </Map>
      </APIProvider>
    </motion.div>
  );
}
