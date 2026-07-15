-- Table profils : liée à auth.users (Supabase Auth gère déjà l'authentification)
create table public.profils (
  id uuid primary key references auth.users(id) on delete cascade,
  prenom text not null,
  email text not null,
  age integer,
  taille integer, -- en cm
  poids numeric,  -- en kg
  avatar integer,  -- numéro d'avatar parmi les 12 proposés
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Activer la Row Level Security (obligatoire pour une app de santé, section 8.1)
alter table public.profils enable row level security;

-- Une utilisatrice ne peut lire QUE sa propre ligne
create policy "Les utilisatrices peuvent lire leur propre profil"
  on public.profils for select
  using (auth.uid() = id);

-- Une utilisatrice ne peut modifier QUE sa propre ligne
create policy "Les utilisatrices peuvent modifier leur propre profil"
  on public.profils for update
  using (auth.uid() = id);

-- Une utilisatrice ne peut créer QUE sa propre ligne (au moment de l'inscription)
create policy "Les utilisatrices peuvent créer leur propre profil"
  on public.profils for insert
  with check (auth.uid() = id);