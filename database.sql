-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table (Extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  role text not null check (role in ('business', 'creator')),
  full_name text,
  name text,
  avatar_url text,
  bio text,
  -- Business specific
  company_name text,
  industry text,
  website text,
  -- Creator specific
  niche text,
  platforms text[],
  follower_count integer,
  rate_per_post numeric,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Campaigns Table
create table public.campaigns (
  id uuid default uuid_generate_v4() primary key,
  business_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text not null,
  budget numeric not null,
  platform text not null,
  niche text not null,
  deadline timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Deals/Requests Table
create table public.deals (
  id uuid default uuid_generate_v4() primary key,
  business_id uuid references public.profiles(id) on delete cascade not null,
  creator_id uuid references public.profiles(id) on delete cascade not null,
  campaign_id uuid references public.campaigns(id) on delete set null,
  status text not null check (status in ('pending', 'active', 'completed', 'paid', 'rejected')),
  offer_amount numeric not null,
  message text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Messages Table (for the Real-time Chat)
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  deal_id uuid references public.deals(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Setup Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.campaigns enable row level security;
alter table public.deals enable row level security;
alter table public.messages enable row level security;

-- Basic Policies (can be refined later)
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

create policy "Campaigns are viewable by everyone." on public.campaigns for select using (true);
create policy "Businesses can insert campaigns." on public.campaigns for insert with check (auth.uid() = business_id);
create policy "Businesses can update their campaigns." on public.campaigns for update using (auth.uid() = business_id);

create policy "Users can view deals they are involved in." on public.deals for select using (auth.uid() = business_id or auth.uid() = creator_id);
create policy "Businesses can create deals." on public.deals for insert with check (auth.uid() = business_id);
create policy "Involved users can update deals." on public.deals for update using (auth.uid() = business_id or auth.uid() = creator_id);

create policy "Users can view messages of their deals." on public.messages for select using (
  exists (select 1 from public.deals d where d.id = deal_id and (d.business_id = auth.uid() or d.creator_id = auth.uid()))
);
create policy "Users can send messages to their deals." on public.messages for insert with check (
  exists (select 1 from public.deals d where d.id = deal_id and (d.business_id = auth.uid() or d.creator_id = auth.uid()))
  and auth.uid() = sender_id
);

-- Set up Realtime for Messages
alter publication supabase_realtime add table public.messages;
