-- HowToPay.me Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (extends Supabase auth.users)
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  username text unique not null,
  display_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,

  constraint username_length check (char_length(username) >= 3 and char_length(username) <= 30),
  constraint username_format check (username ~ '^[a-z0-9_-]+$')
);

-- Payment methods table
create table public.payment_methods (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete cascade not null,
  type text not null,
  handle text not null,
  display_order integer default 0,
  is_pii boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,

  constraint valid_type check (type in (
    'venmo', 'cashapp', 'paypal', 'zelle',
    'buymeacoffee', 'kofi', 'github',
    'bitcoin', 'ethereum'
  ))
);

-- Ephemeral links table
create table public.ephemeral_links (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete cascade not null,
  slug text unique not null,
  amount decimal(10, 2),
  memo text,
  view_count integer default 0,
  max_views integer default 3,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,

  constraint slug_length check (char_length(slug) >= 6 and char_length(slug) <= 12)
);

-- Junction table for payment methods in ephemeral links
create table public.ephemeral_link_methods (
  ephemeral_link_id uuid references public.ephemeral_links on delete cascade,
  payment_method_id uuid references public.payment_methods on delete cascade,
  primary key (ephemeral_link_id, payment_method_id)
);

-- Indexes
create index payment_methods_user_id_idx on public.payment_methods(user_id);
create index ephemeral_links_user_id_idx on public.ephemeral_links(user_id);
create index ephemeral_links_slug_idx on public.ephemeral_links(slug);
create index users_username_idx on public.users(username);

-- Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.payment_methods enable row level security;
alter table public.ephemeral_links enable row level security;
alter table public.ephemeral_link_methods enable row level security;

-- Users policies
create policy "Users can view their own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.users for update
  using (auth.uid() = id);

create policy "Public profiles are viewable by username"
  on public.users for select
  using (true);

-- Payment methods policies
create policy "Users can view their own payment methods"
  on public.payment_methods for select
  using (auth.uid() = user_id);

create policy "Users can insert their own payment methods"
  on public.payment_methods for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own payment methods"
  on public.payment_methods for update
  using (auth.uid() = user_id);

create policy "Users can delete their own payment methods"
  on public.payment_methods for delete
  using (auth.uid() = user_id);

create policy "Public can view non-PII payment methods by user"
  on public.payment_methods for select
  using (is_pii = false);

-- Ephemeral links policies
create policy "Users can view their own ephemeral links"
  on public.ephemeral_links for select
  using (auth.uid() = user_id);

create policy "Users can insert their own ephemeral links"
  on public.ephemeral_links for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own ephemeral links"
  on public.ephemeral_links for update
  using (auth.uid() = user_id);

create policy "Users can delete their own ephemeral links"
  on public.ephemeral_links for delete
  using (auth.uid() = user_id);

create policy "Public can view valid ephemeral links"
  on public.ephemeral_links for select
  using (
    expires_at > now()
    and view_count < max_views
  );

-- Ephemeral link methods policies
create policy "Users can manage their ephemeral link methods"
  on public.ephemeral_link_methods for all
  using (
    exists (
      select 1 from public.ephemeral_links
      where id = ephemeral_link_id
      and user_id = auth.uid()
    )
  );

create policy "Public can view ephemeral link methods for valid links"
  on public.ephemeral_link_methods for select
  using (
    exists (
      select 1 from public.ephemeral_links
      where id = ephemeral_link_id
      and expires_at > now()
      and view_count < max_views
    )
  );

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.users (id, email, username, display_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'username',
    coalesce(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'username'),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

-- Trigger to create user profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to increment view count for ephemeral links
create or replace function public.increment_ephemeral_view(link_slug text)
returns public.ephemeral_links
language plpgsql
security definer
as $$
declare
  link_record public.ephemeral_links;
begin
  update public.ephemeral_links
  set view_count = view_count + 1
  where slug = link_slug
    and expires_at > now()
    and view_count < max_views
  returning * into link_record;

  return link_record;
end;
$$;
