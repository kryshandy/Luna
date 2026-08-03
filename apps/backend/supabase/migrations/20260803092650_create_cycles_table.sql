create table public.cycles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date_debut date not null,
  date_fin date,
  duree integer, -- duree en jours, calculee quand le cycle suivant commence
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_cycles_user_id on public.cycles(user_id);

alter table public.cycles enable row level security;

create policy "Les utilisatrices peuvent lire leurs propres cycles"
  on public.cycles for select
  using (auth.uid() = user_id);

create policy "Les utilisatrices peuvent creer leurs propres cycles"
  on public.cycles for insert
  with check (auth.uid() = user_id);

create policy "Les utilisatrices peuvent modifier leurs propres cycles"
  on public.cycles for update
  using (auth.uid() = user_id);