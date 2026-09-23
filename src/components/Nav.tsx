"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "/", label: "HOME" },
  { href: "/members", label: "MEMBERS" },
  { href: "/owner", label: "OWNER" },
  { href: "/kafa", label: "KAFA" },
  { href: "/admins", label: "ADMINS" },
  { href: "/about", label: "ABOUT" },
  { href: "/contact", label: "CONTACT" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-blood/20 glass-panel">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-display text-sm font-bold tracking-[0.2em] text-glow sm:text-lg">
          THE AKUNU BOYS SCHOOL
        </Link>

        <nav className="hidden gap-6 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-xs font-semibold tracking-wider text-white/80 transition hover:text-blood hover:text-glow"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          className="text-blood md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
          open ? "max-h-96 border-t border-blood/20" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col gap-1 px-4 py-3">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded px-2 py-2 text-sm font-semibold tracking-wide text-white/85 transition hover:bg-blood/10 hover:text-blood"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
