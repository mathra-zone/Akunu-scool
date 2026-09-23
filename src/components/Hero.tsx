"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const TITLE = "THE AKUNU BOYS SCHOOL";

export default function Hero({ logoUrl }: { logoUrl?: string }) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-4 text-center">
      <div className="absolute inset-0 bg-gradient-radial from-crimson/25 via-black to-black" />

      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={revealed ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.1, ease: "easeOut" }}
        className="relative z-10 h-40 w-40 sm:h-52 sm:w-52"
      >
        <div className="absolute inset-0 -z-10 rounded-full bg-blood/40 blur-3xl animate-glowPulse" />
        <Image
          src={logoUrl || "https://placehold.co/400x400/000000/ff1a1a?text=AKUNU"}
          alt="The Akunu Boys School logo"
          width={400}
          height={400}
          priority
          className="h-full w-full rounded-full border-2 border-blood object-cover shadow-[0_0_60px_rgba(255,26,26,0.6)]"
        />
      </motion.div>

      <h1 className="relative z-10 mt-8 flex flex-wrap justify-center gap-x-3 font-display text-3xl font-black tracking-widest text-glow sm:text-5xl md:text-6xl">
        {TITLE.split(" ").map((word, wi) => (
          <span key={wi} className="inline-flex">
            {word.split("").map((ch, ci) => (
              <motion.span
                key={ci}
                initial={{ opacity: 0, y: 20 }}
                animate={revealed ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 + (wi * 6 + ci) * 0.035, duration: 0.4 }}
              >
                {ch}
              </motion.span>
            ))}
          </span>
        ))}
      </h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={revealed ? { opacity: 1 } : {}}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="relative z-10 mt-4 font-display text-lg tracking-[0.3em] text-blood text-glow sm:text-2xl"
      >
        THE STANDARD
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={revealed ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 2, duration: 0.8 }}
        className="relative z-10 mt-6 flex flex-col items-center gap-2 sm:flex-row sm:gap-6"
      >
        <span className="rounded-full border border-blood/50 bg-blood/10 px-4 py-1.5 text-xs font-bold tracking-widest">
          24 HOURS ONLINE
        </span>
        <span className="text-sm italic text-white/70">
          &quot;WE WERE BORN FOR GREATNESS&quot;
        </span>
      </motion.div>
    </section>
  );
}
