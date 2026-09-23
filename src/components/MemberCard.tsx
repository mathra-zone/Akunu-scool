"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Music2, Instagram, MessageCircle } from "lucide-react";
import type { Member } from "@/lib/supabase";
import MemberModal from "./MemberModal";

const ROLE_STYLES: Record<Member["role"], string> = {
  OWNER: "from-yellow-500/30 via-blood/20 to-black border-yellow-500/60",
  KAFA: "from-blood/30 to-black border-blood/60",
  ADMIN: "from-crimson/30 to-black border-crimson/60",
  MEMBER: "from-white/10 to-black border-blood/30",
};

export default function MemberCard({ member }: { member: Member }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.div
        whileHover={{ y: -6, rotateX: 3, rotateY: -3 }}
        transition={{ type: "spring", stiffness: 250, damping: 18 }}
        className={`group relative cursor-pointer rounded-2xl border bg-gradient-to-b p-5 glass-panel border-glow ${ROLE_STYLES[member.role]}`}
        onClick={() => setOpen(true)}
        style={{ perspective: 800 }}
      >
        <span className="absolute right-3 top-3 rounded-full border border-blood/50 bg-black/60 px-2 py-0.5 text-[10px] font-bold tracking-widest text-blood">
          {member.role}
        </span>

        <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border-2 border-blood shadow-[0_0_20px_rgba(255,26,26,0.5)]">
          <Image
            src={member.dp_url || "https://placehold.co/200x200/1a0000/ff1a1a?text=?"}
            alt={member.name}
            width={200}
            height={200}
            className="h-full w-full object-cover"
          />
        </div>

        <h3 className="mt-4 text-center font-display text-base font-bold tracking-wide text-glow">
          {member.name}
        </h3>
        <p className="text-center text-xs text-white/50">@{member.username}</p>
        {member.bio && (
          <p className="mt-2 line-clamp-2 text-center text-xs text-white/60">{member.bio}</p>
        )}

        <div className="mt-4 flex justify-center gap-3">
          {member.tiktok_url && (
            <a
              href={member.tiktok_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 rounded-full border border-blood/50 bg-blood/10 px-3 py-1 text-[10px] font-bold tracking-wider text-blood transition hover:bg-blood hover:text-black"
            >
              <Music2 size={12} /> TIKTOK
            </a>
          )}
          {member.instagram_url && (
            <a
              href={member.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="rounded-full border border-white/30 p-1.5 text-white/60 hover:text-white"
            >
              <Instagram size={12} />
            </a>
          )}
          {member.whatsapp_url && (
            <a
              href={member.whatsapp_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="rounded-full border border-white/30 p-1.5 text-white/60 hover:text-white"
            >
              <MessageCircle size={12} />
            </a>
          )}
        </div>
      </motion.div>

      {open && <MemberModal member={member} onClose={() => setOpen(false)} />}
    </>
  );
}
