"use client";

import { useEffect } from "react";
import { useBreweryStore } from "@/store/breweriesStore";
import Header from "./components/Header";
import BreweryList from "./components/BreweryList";
import "./globals.css"

export default function HomePage() {
  const fetchInitial = useBreweryStore((s) => s.fetchInitial);

  useEffect(() => {
    fetchInitial();
  }, []);

  useEffect(() => {
    return () => {
      useBreweryStore.setState({ selected: [] });
    };
  }, []);

  return (
    <main className="min-h-screen text-white flex justify-center px-4 py-8">
      <div className="w-full max-w-4xl">
        <Header />
        <BreweryList />
      </div>
    </main>
  );
}
