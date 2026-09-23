import Hero from "@/components/Hero";
import { getSiteSettings, getPublishedRules, getMembersByRole } from "@/lib/supabase";
import MemberCard from "@/components/MemberCard";
import Link from "next/link";

export const revalidate = 30; // refresh from Supabase every 30s

export default async function HomePage() {
  const [settings, rules, owners] = await Promise.all([
    getSiteSettings(),
    getPublishedRules(),
    getMembersByRole("OWNER"),
  ]);

  return (
    <>
      <Hero logoUrl={settings.logo_url} />

      <section className="mx-auto max-w-5xl px-4 py-20">
        <h2 className="text-center font-display text-2xl font-bold tracking-widest text-glow sm:text-3xl">
          SCHOOL RULES
        </h2>
        <p className="mt-1 text-center text-xs uppercase tracking-[0.3em] text-blood">
          The Standard
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {rules.length === 0 && (
            <p className="col-span-2 text-center text-white/40">No rules published yet.</p>
          )}
          {rules.map((rule, i) => (
            <div
              key={rule.id}
              className="rounded-xl border border-blood/30 bg-black/50 p-5 glass-panel transition hover:border-blood/70"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-start gap-3">
                <span className="font-display text-2xl font-black text-blood/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-base font-bold">{rule.title}</h3>
                  {rule.description && (
                    <p className="mt-1 text-sm text-white/60">{rule.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {owners.length > 0 && (
        <section className="mx-auto max-w-4xl px-4 pb-20">
          <h2 className="text-center font-display text-2xl font-bold tracking-widest text-glow">
            OWNER
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 justify-center">
            {owners.map((m) => (
              <MemberCard key={m.id} member={m} />
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-3xl px-4 pb-24 text-center">
        <Link
          href="/members"
          className="inline-block rounded-full bg-gradient-to-r from-blood to-crimson px-8 py-3 text-sm font-bold tracking-widest shadow-[0_0_30px_rgba(255,26,26,0.5)] transition hover:scale-105"
        >
          MEET THE FULL BROTHERHOOD
        </Link>
      </section>
    </>
  );
}
