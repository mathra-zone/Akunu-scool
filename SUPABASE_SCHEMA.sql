-- ============================================================
-- THE AKUNU BOYS SCHOOL — SUPABASE DATABASE SCHEMA
-- Run this entire file once in Supabase SQL Editor.
-- ============================================================

create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------
-- ADMINS  (linked to auth.users via id = auth.uid())
-- ------------------------------------------------------------
create table if not exists public.admins (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  username text unique not null,
  dp_url text,
  bio text,
  tiktok_url text,
  role text not null default 'admin' check (role in ('super_admin','admin')),
  status text not null default 'active' check (status in ('active','suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- MEMBERS  (Owner / Kafa / Admin-display / Member)
-- ------------------------------------------------------------
create table if not exists public.members (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  username text unique not null,
  role text not null check (role in ('OWNER','KAFA','ADMIN','MEMBER')),
  dp_url text,
  bio text,
  tiktok_username text,
  tiktok_url text,
  instagram_url text,
  whatsapp_url text,
  status text not null default 'active' check (status in ('active','inactive')),
  join_date date default current_date,
  display_order integer default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tiktok_url_format check (
    tiktok_url is null or tiktok_url ~* '^https?://(www\.)?tiktok\.com/@[a-zA-Z0-9._]+/?$'
  )
);

create index if not exists idx_members_role on public.members(role);
create index if not exists idx_members_order on public.members(display_order);

-- ------------------------------------------------------------
-- CONTENT  (Announcements / News / Quotes / Events / Updates)
-- ------------------------------------------------------------
create table if not exists public.content (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  image_url text,
  category text not null check (category in ('announcement','rule_note','quote','news','update','event','information')),
  status text not null default 'draft' check (status in ('published','draft')),
  display_order integer default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_content_status on public.content(status);
create index if not exists idx_content_category on public.content(category);

-- ------------------------------------------------------------
-- RULES  (THE STANDARD)
-- ------------------------------------------------------------
create table if not exists public.rules (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  display_order integer default 0,
  status text not null default 'published' check (status in ('published','draft')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_rules_order on public.rules(display_order);

-- ------------------------------------------------------------
-- SITE SETTINGS  (single-row config: logo, hero text, socials)
-- ------------------------------------------------------------
create table if not exists public.site_settings (
  id uuid primary key default uuid_generate_v4(),
  key text unique not null,
  value text,
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- ACTIVITY LOGS
-- ------------------------------------------------------------
create table if not exists public.activity_logs (
  id uuid primary key default uuid_generate_v4(),
  admin_id uuid references public.admins(id) on delete set null,
  action text not null,
  entity_type text,
  entity_id uuid,
  details jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_activity_created on public.activity_logs(created_at desc);

-- ------------------------------------------------------------
-- updated_at auto-trigger
-- ------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_members_updated on public.members;
create trigger trg_members_updated before update on public.members
  for each row execute function public.set_updated_at();

drop trigger if exists trg_content_updated on public.content;
create trigger trg_content_updated before update on public.content
  for each row execute function public.set_updated_at();

drop trigger if exists trg_rules_updated on public.rules;
create trigger trg_rules_updated before update on public.rules
  for each row execute function public.set_updated_at();

drop trigger if exists trg_admins_updated on public.admins;
create trigger trg_admins_updated before update on public.admins
  for each row execute function public.set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.members enable row level security;
alter table public.content enable row level security;
alter table public.rules enable row level security;
alter table public.site_settings enable row level security;
alter table public.admins enable row level security;
alter table public.activity_logs enable row level security;

-- Public read policies (anon + authenticated)
create policy "Public can read active members"
  on public.members for select
  using (status = 'active');

create policy "Public can read published content"
  on public.content for select
  using (status = 'published');

create policy "Public can read published rules"
  on public.rules for select
  using (status = 'published');

create policy "Public can read site settings"
  on public.site_settings for select
  using (true);

-- Authenticated admins (must exist in admins table) can manage everything.
-- Helper: is the current auth user a row in admins?
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.admins
    where id = auth.uid() and status = 'active'
  );
$$ language sql stable security definer;

create policy "Admins can do everything on members"
  on public.members for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can do everything on content"
  on public.content for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can do everything on rules"
  on public.rules for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can manage site settings"
  on public.site_settings for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can view own admin row"
  on public.admins for select
  using (id = auth.uid() or public.is_admin());

create policy "Super admins can manage admins"
  on public.admins for all
  using (
    exists (select 1 from public.admins a where a.id = auth.uid() and a.role = 'super_admin' and a.status='active')
  )
  with check (
    exists (select 1 from public.admins a where a.id = auth.uid() and a.role = 'super_admin' and a.status='active')
  );

create policy "Admins can read activity logs"
  on public.activity_logs for select
  using (public.is_admin());

create policy "Admins can insert activity logs"
  on public.activity_logs for insert
  with check (public.is_admin());

-- ============================================================
-- SAMPLE DATA (replace from Admin Panel)
-- ============================================================
insert into public.site_settings (key, value) values
  ('site_title', 'THE AKUNU BOYS SCHOOL'),
  ('site_subtitle', 'THE STANDARD'),
  ('tagline', 'WE WERE BORN FOR GREATNESS'),
  ('status_line', '24 HOURS ONLINE'),
  ('logo_url', 'https://your-storage-url/site-assets/logo.png'),
  ('footer_tiktok_url', 'https://www.tiktok.com/@akunuboysschool')
on conflict (key) do nothing;

insert into public.members (name, username, role, dp_url, bio, tiktok_username, tiktok_url, instagram_url, whatsapp_url, status, display_order) values
  ('Akunu Founder', 'akunu_owner', 'OWNER', 'https://placehold.co/400x400/1a0000/ff1a1a?text=OWNER', 'Founder of The Akunu Boys School. Born for greatness.', '@akunu_owner', 'https://www.tiktok.com/@akunu_owner', null, null, 'active', 1),
  ('Kafa One', 'kafa_one', 'KAFA', 'https://placehold.co/400x400/1a0000/ff1a1a?text=KAFA', 'First Kafa of the brotherhood.', '@kafa_one', 'https://www.tiktok.com/@kafa_one', null, null, 'active', 2),
  ('Kafa Two', 'kafa_two', 'KAFA', 'https://placehold.co/400x400/1a0000/ff1a1a?text=KAFA', 'Second Kafa, standard bearer.', '@kafa_two', 'https://www.tiktok.com/@kafa_two', null, null, 'active', 3),
  ('Admin One', 'admin_one', 'ADMIN', 'https://placehold.co/400x400/1a0000/ff1a1a?text=ADMIN', 'Keeps the standard running.', '@admin_one', 'https://www.tiktok.com/@admin_one', null, null, 'active', 4),
  ('Admin Two', 'admin_two', 'ADMIN', 'https://placehold.co/400x400/1a0000/ff1a1a?text=ADMIN', 'Community manager.', '@admin_two', 'https://www.tiktok.com/@admin_two', null, null, 'active', 5),
  ('Member Alpha', 'member_alpha', 'MEMBER', 'https://placehold.co/400x400/1a0000/ff1a1a?text=M', 'Proud member.', '@member_alpha', 'https://www.tiktok.com/@member_alpha', null, null, 'active', 6),
  ('Member Beta', 'member_beta', 'MEMBER', 'https://placehold.co/400x400/1a0000/ff1a1a?text=M', 'Proud member.', '@member_beta', 'https://www.tiktok.com/@member_beta', null, null, 'active', 7),
  ('Member Gamma', 'member_gamma', 'MEMBER', 'https://placehold.co/400x400/1a0000/ff1a1a?text=M', 'Proud member.', '@member_gamma', 'https://www.tiktok.com/@member_gamma', null, null, 'active', 8)
on conflict (username) do nothing;

insert into public.rules (title, description, display_order, status) values
  ('Respect The Brotherhood', 'Every member represents the standard. Respect is non-negotiable.', 1, 'published'),
  ('No Fake Greatness', 'Put in real work. Greatness is earned, not claimed.', 2, 'published'),
  ('24 Hours Online', 'The community never sleeps. Stay active, stay connected.', 3, 'published'),
  ('TikTok Only Fighting', 'All battles and challenges happen on TikTok. Keep it there.', 4, 'published')
on conflict do nothing;

insert into public.content (title, description, category, status, display_order) values
  ('Welcome to The Akunu Boys School', 'The official home of the brotherhood. Born for greatness.', 'announcement', 'published', 1)
on conflict do nothing;

-- NOTE: To create your first real admin login, see README section
-- "How to create the first Admin account" — you create the user in
-- Supabase Auth, then insert a matching row into public.admins with
-- the SAME id (uuid) as that auth user.
