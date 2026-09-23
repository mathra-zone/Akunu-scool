import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!url || !anonKey) {
  console.warn(
    "[Supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY env vars."
  );
}

// Public, anon-key-only client. Safe to expose in the browser because
// Row Level Security policies restrict it to published/active rows only.
// Never put the service_role key in this project.
export const supabase = createClient(url, anonKey, {
  auth: { persistSession: false },
});

export type Member = {
  id: string;
  name: string;
  username: string;
  role: "OWNER" | "KAFA" | "ADMIN" | "MEMBER";
  dp_url: string | null;
  bio: string | null;
  tiktok_username: string | null;
  tiktok_url: string | null;
  instagram_url: string | null;
  whatsapp_url: string | null;
  status: string;
  join_date: string | null;
  display_order: number;
};

export type ContentItem = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  category: string;
  status: string;
  display_order: number;
  created_at: string;
};

export type Rule = {
  id: string;
  title: string;
  description: string | null;
  display_order: number;
  status: string;
};

export async function getMembersByRole(role: Member["role"]) {
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("role", role)
    .eq("status", "active")
    .order("display_order", { ascending: true });
  if (error) {
    console.error("getMembersByRole error:", error.message);
    return [];
  }
  return (data ?? []) as Member[];
}

export async function getAllActiveMembers() {
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("status", "active")
    .order("display_order", { ascending: true });
  if (error) {
    console.error("getAllActiveMembers error:", error.message);
    return [];
  }
  return (data ?? []) as Member[];
}

export async function getPublishedRules() {
  const { data, error } = await supabase
    .from("rules")
    .select("*")
    .eq("status", "published")
    .order("display_order", { ascending: true });
  if (error) {
    console.error("getPublishedRules error:", error.message);
    return [];
  }
  return (data ?? []) as Rule[];
}

export async function getPublishedContent(category?: string) {
  let query = supabase
    .from("content")
    .select("*")
    .eq("status", "published")
    .order("display_order", { ascending: true });
  if (category) query = query.eq("category", category);
  const { data, error } = await query;
  if (error) {
    console.error("getPublishedContent error:", error.message);
    return [];
  }
  return (data ?? []) as ContentItem[];
}

export async function getSiteSettings() {
  const { data, error } = await supabase.from("site_settings").select("key,value");
  if (error) {
    console.error("getSiteSettings error:", error.message);
    return {} as Record<string, string>;
  }
  const map: Record<string, string> = {};
  (data ?? []).forEach((row) => {
    if (row.key) map[row.key] = row.value ?? "";
  });
  return map;
}
