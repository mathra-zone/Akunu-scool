import { getAllActiveMembers } from "@/lib/supabase";
import MemberCard from "@/components/MemberCard";

export const revalidate = 30;

const SECTIONS: { role: "OWNER" | "KAFA" | "ADMIN" | "MEMBER"; title: string }[] = [
  { role: "OWNER", title: "OWNER" },
  { role: "KAFA", title: "KAFA" },
  { role: "ADMIN", title: "ADMINS" },
  { role: "MEMBER", title: "MEMBERS" },
];

export default async function MembersPage() {
  const all = await getAllActiveMembers();

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-center font-display text-3xl font-black tracking-widest text-glow">
        THE BROTHERHOOD
      </h1>
      <div className="mx-auto mt-2 h-px w-24 bg-blood animate-flicker" />

      {all.length === 0 && (
        <p className="mt-16 text-center text-white/40">NO MEMBERS YET</p>
      )}

      {SECTIONS.map(({ role, title }) => {
        const group = all.filter((m) => m.role === role);
        if (group.length === 0) return null;
        return (
          <div key={role} className="mt-16">
            <h2 className="mb-6 text-center font-display text-xl font-bold tracking-widest text-blood text-glow">
              {title}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {group.map((m) => (
                <MemberCard key={m.id} member={m} />
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
