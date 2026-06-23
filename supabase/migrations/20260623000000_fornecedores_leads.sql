create table if not exists public.fornecedores_leads (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.fornecedores_leads enable row level security;

-- Apenas service_role (servidor) acessa a tabela
create policy "service role only"
  on public.fornecedores_leads
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
