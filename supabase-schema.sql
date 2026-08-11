create table if not exists public.incomemate_snapshots (
  user_email text primary key,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.incomemate_snapshots enable row level security;

-- The app writes through a server API route with SUPABASE_SERVICE_ROLE_KEY.
-- Do not expose the service role key in browser code.
