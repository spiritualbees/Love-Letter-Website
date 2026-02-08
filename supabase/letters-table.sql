-- Run this in your Supabase project: SQL Editor

create table if not exists letters (
  id text primary key,
  recipient_name text not null,
  sender_name text not null,
  message text not null,
  theme_color text not null,
  created_at timestamptz not null default now()
);

-- Optional: enable Row Level Security (RLS) if you want to restrict access later
-- alter table letters enable row level security;
-- create policy "Allow public read" on letters for select using (true);
-- create policy "Allow public insert" on letters for insert with check (true);
