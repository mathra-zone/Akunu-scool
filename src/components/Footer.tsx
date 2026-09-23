import { getSiteSettings } from "@/lib/supabase";

export default async function Footer() {
  const settings = await getSiteSettings();
  const tiktok = settings.footer_tiktok_url || "https://www.tiktok.com";

  return (
    <footer className="relative z-10 mt-24 border-t border-blood/20 bg-black/70 py-10">
      <div className="mx-auto h-px w-11/12 max-w-4xl bg-gradient-to-r from-transparent via-blood to-transparent animate-flicker" />
      <div className="mx-auto max-w-6xl px-4 pt-8 text-center">
        <h3 className="font-display text-lg font-bold tracking-widest text-glow">
          THE AKUNU BOYS SCHOOL
        </h3>
        <p className="mt-2 text-sm italic text-white/60">
          &quot;WE WERE BORN FOR GREATNESS&quot;
        </p>
        <div className="mt-4 flex justify-center gap-4 text-xs font-semibold tracking-wider">
          <a href={tiktok} target="_blank" rel="noopener noreferrer" className="text-blood hover:text-glow">
            TIKTOK
          </a>
        </div>
        <p className="mt-6 text-[11px] text-white/30">
          © {new Date().getFullYear()} The Akunu Boys School. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
