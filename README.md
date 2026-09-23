# THE AKUNU BOYS SCHOOL — Full Setup Guide

Two real, separate Next.js + TypeScript + Tailwind projects sharing one Supabase backend:

- **`the-akunu-boys-school`** — Public Website (reads Supabase, public/anon)
- **`the-akunu-boys-school-admin`** — Admin Panel (Supabase Auth + full CRUD)

Nothing is hardcoded. Members, content, and rules all live in Supabase. Adding a
member in the Admin Panel makes it appear on the Public Website automatically
(the public pages revalidate every 30 seconds, and list pages that fetch
client-side always show live data).

---

## 1. Create the Supabase project

1. Go to https://supabase.com → New Project.
2. Pick a name, a strong database password, a region close to your users.
3. Wait for provisioning (~2 minutes).
4. In **Project Settings → API**, copy:
   - `Project URL` → this is `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → this is `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → **only** needed if you later add server-side admin
     creation scripts. Never put it in either app's client code.

## 2. Run the database SQL

1. In Supabase, open **SQL Editor → New query**.
2. Paste the entire contents of `shared-sql/schema.sql` (included in this
   package) and run it.
3. This creates: `members`, `content`, `rules`, `site_settings`,
   `activity_logs`, `admins`, all indexes, `updated_at` triggers, Row Level
   Security policies, and sample data (1 owner, 2 kafa, 2 admins, 3 members,
   4 rules).

RLS summary:
- **Public (anon key)** can only `SELECT` members with `status = 'active'`,
  content with `status = 'published'`, and rules with `status = 'published'`.
- **Admins** (a row in `public.admins` matching the logged-in `auth.uid()`)
  can insert/update/delete everything, via the `is_admin()` helper function.
- The public website never needs a login and never sees draft/inactive rows.

## 3. Create Storage buckets

In Supabase → **Storage**, create three buckets:

| Bucket name       | Public? |
|--------------------|---------|
| `profile-images`   | ✅ Public |
| `content-images`   | ✅ Public |
| `site-assets`      | ✅ Public |

For each bucket, click it → **Policies** → add a policy allowing
`INSERT`/`UPDATE`/`DELETE` for `authenticated` users only (so only logged-in
admins can upload), and `SELECT` for everyone (`public`), e.g.:

```sql
-- Run once per bucket, replacing 'profile-images' with the bucket name
create policy "Public read profile-images"
  on storage.objects for select
  using ( bucket_id = 'profile-images' );

create policy "Admins write profile-images"
  on storage.objects for all
  using ( bucket_id = 'profile-images' and auth.role() = 'authenticated' )
  with check ( bucket_id = 'profile-images' and auth.role() = 'authenticated' );
```

Repeat for `content-images` and `site-assets`.

## 4. Enable Supabase Auth (Email/Password)

1. **Authentication → Providers** → make sure **Email** is enabled.
2. **Authentication → URL Configuration** → set your Site URL to your
   deployed admin panel URL once you have it (e.g.
   `https://akunu-admin.vercel.app`) — needed for password-reset emails to
   link back correctly.

## 5. Create your first Admin account

1. **Authentication → Users → Add user** → enter your email + password →
   create. Copy the generated **User UID**.
2. Back in **SQL Editor**, run (replace values):

```sql
insert into public.admins (id, name, username, role, status)
values (
  'PASTE-THE-USER-UID-HERE',
  'Your Name',
  'your_username',
  'super_admin',
  'active'
);
```

3. That's it — you can now log in at `/login` on the Admin Panel with that
   email/password. Only rows in `public.admins` can pass the `is_admin()`
   check, so creating an auth user alone is **not** enough — the SQL insert
   above is required.

---

## 6. GitHub repository structure

Create **two** repositories:

```
the-akunu-boys-school            ← contents of /the-akunu-boys-school
the-akunu-boys-school-admin      ← contents of /the-akunu-boys-school-admin
```

For each:

```bash
cd the-akunu-boys-school
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/the-akunu-boys-school.git
git push -u origin main
```

Repeat for the admin folder with the `-admin` repo.

---

## 7. Environment variables

### Public Website (`the-akunu-boys-school`)

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your Supabase anon public key |

### Admin Panel (`the-akunu-boys-school-admin`)

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | same Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | same anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | service role key — **server-side only**, only needed if you extend the app with an API route that creates auth users programmatically. Not required for the CRUD features included here. |

Never prefix the service key with `NEXT_PUBLIC_` — anything with that prefix
is sent to the browser.

---

## 8. Vercel deployment

For **each** repo:

1. Go to https://vercel.com/new, import the GitHub repo.
2. Framework preset: **Next.js** (auto-detected).
3. Add the environment variables from the tables above under
   **Settings → Environment Variables** (for Production, Preview, and
   Development).
4. Deploy.
5. Once the Admin Panel has a URL, go back to Supabase → Authentication →
   URL Configuration and set the Site URL / Redirect URLs to that domain so
   password-reset links work.

Both projects can be redeployed independently — editing the Admin Panel
code never requires touching the Public Website repo, and vice versa.

---

## 9. How the two projects connect

They don't talk to each other directly — they both talk to the **same**
Supabase project:

- The Admin Panel writes rows into `members`, `content`, `rules`,
  `site_settings` (using the logged-in admin's session, checked against RLS).
- The Public Website reads those same tables with the anon key, filtered to
  `active` / `published` rows only by RLS.
- Because there's no shared code or shared deploy, you can host them on
  different Vercel projects/domains and they still stay in sync through the
  database.

---

## 10. How to add / edit / delete a member

1. Log into the Admin Panel → **Members**.
2. Click **ADD MEMBER**, fill in Name, Username, Role, upload a Profile
   Picture (goes to the `profile-images` Storage bucket), Bio, TikTok URL,
   etc. Click **SAVE MEMBER**.
3. It's now a row in `public.members`. The Public Website's `/members`,
   `/owner`, `/kafa`, `/admins` pages will show it (within ~30 seconds, or
   immediately on next page load).
4. To edit: click the pencil icon on a member row. To delete: click the
   trash icon and confirm.
5. **Owner / Kafa / Admins** in the sidebar are the same Members table
   filtered by role — no separate database or code path to maintain.

## 11. How to add TikTok links

TikTok URLs are stored per-member in `members.tiktok_url` and validated
against the pattern `https://www.tiktok.com/@username` both in the Admin
Panel form and again at the database level (a `check` constraint in the
SQL). Add/edit them from the member's **Edit** form — the Public Website's
"VISIT TIKTOK" buttons always use the live database value.

## 12. How to change the website logo

Admin Panel → **Settings** → **Upload New Logo** → click **Save Settings**.
This writes to the `site-assets` bucket and updates the `logo_url` row in
`site_settings`, which the Public Website's Hero section reads on every
build/request.

## 13. How to change colors / text

- **Text**: most site-wide copy (title, subtitle, tagline, status line,
  footer TikTok link) is editable from Admin Panel → **Settings** without
  touching code.
- **Colors**: edit `tailwind.config.ts` in the Public Website repo — the
  `blood` (#ff1a1a) and `crimson` (#8b0000) colors are used throughout.
  Change them once there and every component picks it up.

## 14. How to create additional Admin accounts

Admin Panel → **Admins** (filtered Members view with role `ADMIN`) manages
their **public profile card**. To grant someone actual login access to the
dashboard, repeat Step 5 above (Supabase Auth → Add user, then insert a row
into `public.admins` with that user's UID). Only a `super_admin` row should
be trusted to manage other admins in a production setup — extend the RLS
policy in `schema.sql` if you want finer-grained roles.

---

## 15. Error handling / empty states already built in

- Invalid login → toast: "Invalid email or password."
- Duplicate username → toast: "That username is already taken."
- Invalid TikTok URL → blocked client-side and by a database `check`
  constraint.
- Missing/failed image upload → toast with the Supabase Storage error.
- No members/content/rules yet → "NO MEMBERS YET" / "NO CONTENT YET" /
  "NO RULES YET" empty states instead of broken UI.
- Unauthenticated access to any admin route → redirected to `/login` by
  `src/middleware.ts`, which runs on every request server-side.

---

## 16. Local development

```bash
# Public website
cd the-akunu-boys-school
cp .env.example .env.local   # fill in your Supabase values
npm install
npm run dev                  # http://localhost:3000

# Admin panel (separate terminal)
cd the-akunu-boys-school-admin
cp .env.example .env.local   # fill in your Supabase values
npm install
npm run dev                  # http://localhost:3000 (run on a different port if both run at once: `npm run dev -- -p 3001`)
```

---

## 17. What's included vs. what you may want to extend

Included and fully working: Supabase-backed members/content/rules with real
CRUD, image upload to Storage, Supabase Auth login/logout/password reset,
protected admin routes via middleware, RLS-secured public reads, dashboard
stats, activity log, dynamic site settings (logo/text), TikTok URL
validation, responsive premium dark-red UI with entrance animations,
lightning/glow effects, mobile hamburger nav, and animated rule/member
cards.

Reasonable next steps if you want to go further: per-admin granular
permissions (currently any row in `admins` can manage all content),
Supabase Storage image resizing/optimization pipeline, a dedicated
`/admins` management UI for granting dashboard access (currently done via
SQL as shown in Step 5/14), and Supabase Realtime subscriptions for
instant (sub-second) live updates instead of the 30s revalidation window
already in place.
