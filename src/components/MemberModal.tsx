"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Music2 } from "lucide-react";
import type { Member } from "@/lib/supabase";

export default function MemberModal({
  member,
  onClose,
}: {
  member: Member;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-sm rounded-2xl border border-blood/50 bg-[#0a0000] p-6 border-glow animate-glowPulse"
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white/50 hover:text-blood"
            aria-label="Close"
          >
            <X />
          </button>

          <div className="mx-auto h-28 w-28 overflow-hidden rounded-full border-2 border-blood shadow-[0_0_30px_rgba(255,26,26,0.6)]">
            <Image
              src={member.dp_url || "https://placehold.co/200x200/1a0000/ff1a1a?text=?"}
              alt={member.name}
              width={220}
              height={220}
              className="h-full w-full object-cover"
            />
          </div>

          <h2 className="mt-4 text-center font-display text-xl font-bold text-glow">
            {member.name}
          </h2>
          <p className="text-center text-sm text-white/50">
            @{member.username} · {member.role}
          </p>
          {member.bio && (
            <p className="mt-4 text-center text-sm leading-relaxed text-white/70">{member.bio}</p>
          )}

          {member.tiktok_url && (
            <a
              href={member.tiktok_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blood to-crimson py-3 text-sm font-bold tracking-widest text-white shadow-[0_0_25px_rgba(255,26,26,0.5)] transition hover:scale-[1.02]"
            >
              <Music2 size={16} /> VISIT TIKTOK
            </a>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
