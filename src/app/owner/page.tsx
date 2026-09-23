import { getMembersByRole } from "@/lib/supabase";
import MemberCard from "@/components/MemberCard";

export const revalidate = 30;

export default async function OwnerPage() {
  const members = await getMembersByRole("OWNER");

  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-center font-display text-3xl font-black tracking-widest text-glow">
        OWNER
      </h1>
      <div className="mx-auto mt-2 h-px w-24 bg-blood animate-flicker" />

      {members.length === 0 ? (
        <p className="mt-16 text-center text-white/40">NO MEMBERS YET</p>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {members.map((m) => (
            <MemberCard key={m.id} member={m} />
          ))}
        </div>
      )}
    </section>
  );
}
