import { getSiteSettings } from "@/lib/supabase";
import { Music2 } from "lucide-react";

export const revalidate = 60;

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const tiktok = settings.footer_tiktok_url || "https://www.tiktok.com";

  return (
    <section className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="font-display text-3xl font-black tracking-widest text-glow">
        CONTACT
      </h1>
      <div className="mx-auto mt-2 h-px w-24 bg-blood animate-flicker" />

      <div className="mt-10 rounded-2xl border border-blood/30 bg-black/50 p-8 glass-panel">
        <p className="text-white/70">
          Reach the brotherhood through our official TikTok. All challenges,
          fights, and community activity happen there — TikTok only.
        </p>
        <a
          href={tiktok}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blood to-crimson px-8 py-3 text-sm font-bold tracking-widest shadow-[0_0_30px_rgba(255,26,26,0.5)] transition hover:scale-105"
        >
          <Music2 size={16} /> VISIT OUR TIKTOK
        </a>
      </div>
    </section>
  );
}
