"use client";

import { useEffect, useState } from "react";

// Lightweight, CSS-only ambient lightning flashes. No canvas/WebGL so it
// stays cheap on mobile. Respects prefers-reduced-motion via globals.css.
export default function LightningField() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
  }, []);

  if (reduced) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a0000]/40 via-transparent to-black/60" />
      <div
        className="absolute -top-1/4 left-1/4 h-[150%] w-[2px] bg-blood/60 blur-[1px] animate-lightning"
        style={{ animationDelay: "0.5s", transform: "rotate(12deg)" }}
      />
      <div
        className="absolute -top-1/4 right-1/3 h-[150%] w-[1px] bg-blood/40 blur-[1px] animate-lightning"
        style={{ animationDelay: "2.5s", transform: "rotate(-8deg)" }}
      />
      <div
        className="absolute inset-0 bg-blood/5 animate-lightning"
        style={{ animationDelay: "4s" }}
      />
    </div>
  );
}
