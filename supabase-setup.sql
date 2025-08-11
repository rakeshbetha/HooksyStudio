-- Create collections table
create table if not exists collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  created_at timestamp with time zone default now()
);

-- Create hooks table
create table if not exists hooks (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references collections(id) on delete cascade,
  text text not null,
  platform text,
  scores jsonb,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table collections enable row level security;
alter table hooks enable row level security;

-- Collections policies
create policy "select own collections"
on collections for select
using ( auth.uid() = user_id );

create policy "insert own collections"
on collections for insert
with check ( auth.uid() = user_id );

create policy "update own collections"
on collections for update
using ( auth.uid() = user_id );

create policy "delete own collections"
on collections for delete
using ( auth.uid() = user_id );

-- Hooks policies
create policy "select hooks via parent collections"
on hooks for select
using (
  exists (select 1 from collections c where c.id = hooks.collection_id and c.user_id = auth.uid())
);

create policy "insert hooks via parent collections"
on hooks for insert
with check (
  exists (select 1 from collections c where c.id = hooks.collection_id and c.user_id = auth.uid())
);

create policy "update hooks via parent collections"
on hooks for update
using (
  exists (select 1 from collections c where c.id = hooks.collection_id and c.user_id = auth.uid())
);

create policy "delete hooks via parent collections"
on hooks for delete
using (
  exists (select 1 from collections c where c.id = hooks.collection_id and c.user_id = auth.uid())
); 