import { getSiteSettings } from "@/lib/supabase";

export const revalidate = 60;

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <section className="mx-auto max-w-3xl px-4 py-20">
      <h1 className="text-center font-display text-3xl font-black tracking-widest text-glow">
        ABOUT
      </h1>
      <div className="mx-auto mt-2 h-px w-24 bg-blood animate-flicker" />

      <div className="mt-10 rounded-2xl border border-blood/30 bg-black/50 p-8 glass-panel">
        <p className="text-lg font-display font-bold text-glow">
          {settings.site_title || "THE AKUNU BOYS SCHOOL"}
        </p>
        <p className="mt-1 text-sm uppercase tracking-[0.3em] text-blood">
          {settings.site_subtitle || "THE STANDARD"}
        </p>
        <p className="mt-6 leading-relaxed text-white/70">
          A brotherhood built on discipline, respect, and greatness.{" "}
          {settings.tagline || "We were born for greatness."} We are{" "}
          {settings.status_line || "24 hours online"}, always connected, always
          standing on the standard.
        </p>
      </div>
    </section>
  );
}
