-- ============================================
-- LeadFlux - Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- TABLE: agents
-- ============================================
create table if not exists agents (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  email      text not null unique,
  role       text not null default 'agent' check (role in ('admin', 'agent')),
  status     text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz default now()
);

-- ============================================
-- TABLE: leads
-- ============================================
create table if not exists leads (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  email       text not null,
  phone       text,
  assigned_to uuid references agents(id) on delete set null,
  status      text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at  timestamptz default now(),
  assigned_at timestamptz default now()
);

-- ============================================
-- TABLE: settings
-- ============================================
create table if not exists settings (
  id                    uuid primary key default uuid_generate_v4(),
  assignment_type       text not null default 'round_robin',
  last_assigned_index   integer not null default -1
);

-- Insert default settings row
insert into settings (assignment_type, last_assigned_index)
values ('round_robin', -1)
on conflict do nothing;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Disable RLS for service role (backend uses service role key)
-- Enable if you want extra protection

alter table agents enable row level security;
alter table leads enable row level security;
alter table settings enable row level security;

-- Allow service role full access (backend)
create policy "Service role full access agents" on agents
  for all using (true);

create policy "Service role full access leads" on leads
  for all using (true);

create policy "Service role full access settings" on settings
  for all using (true);

-- ============================================
-- INDEXES
-- ============================================
create index if not exists leads_assigned_to_idx on leads(assigned_to);
create index if not exists leads_status_idx on leads(status);
create index if not exists leads_created_at_idx on leads(created_at desc);
create index if not exists agents_status_idx on agents(status);

-- ============================================
-- SEED: Create first admin agent
-- ============================================
-- After running this SQL, go to Supabase Auth > Users and create a user
-- with the same email as the admin agent below.
--
-- Then insert the agent record:
--
-- insert into agents (name, email, role, status)
-- values ('Admin User', 'admin@yourcompany.com', 'admin', 'active');
