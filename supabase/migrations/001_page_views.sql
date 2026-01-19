-- Page Views Analytics
-- Run this migration in your Supabase SQL Editor

-- Page views table
create table public.page_views (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete cascade not null,
  page_type text not null default 'persistent',
  viewed_at timestamp with time zone default timezone('utc'::text, now()) not null,

  constraint valid_page_type check (page_type in ('persistent', 'ephemeral'))
);

-- Index for efficient querying by user and time
create index page_views_user_id_idx on public.page_views(user_id);
create index page_views_viewed_at_idx on public.page_views(viewed_at);
create index page_views_user_time_idx on public.page_views(user_id, viewed_at);

-- Enable RLS
alter table public.page_views enable row level security;

-- Users can view their own analytics
create policy "Users can view their own page views"
  on public.page_views for select
  using (auth.uid() = user_id);

-- Anyone can insert page views (for tracking)
create policy "Anyone can insert page views"
  on public.page_views for insert
  with check (true);

-- Function to record a page view
create or replace function public.record_page_view(
  p_user_id uuid,
  p_page_type text default 'persistent'
)
returns void
language plpgsql
security definer
as $$
begin
  insert into public.page_views (user_id, page_type)
  values (p_user_id, p_page_type);
end;
$$;
