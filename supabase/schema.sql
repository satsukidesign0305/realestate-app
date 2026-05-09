-- ============================================================
-- 不動産管理アプリ: テーブル定義 & RLSポリシー
-- Supabaseダッシュボードの「SQL Editor」で実行してください
-- ============================================================

-- 物件テーブルを作成
create table public.properties (
  id         uuid        primary key default gen_random_uuid(), -- 主キー
  name       text        not null,                              -- 物件名
  rent       integer     not null,                              -- 月額家賃（円）
  area       text        not null,                              -- エリア名
  rooms      text        not null,                              -- 間取り（例: 1LDK）
  user_id    uuid        not null references auth.users(id) on delete cascade, -- 登録ユーザー
  created_at timestamptz not null default now()                 -- 登録日時
);

-- Row Level Security（行レベルセキュリティ）を有効化
alter table public.properties enable row level security;

-- SELECT: 自分が登録した物件のみ参照可能
create policy "自分の物件のみ参照可能"
  on public.properties for select
  using (auth.uid() = user_id);

-- INSERT: user_idが自分のIDと一致する場合のみ登録可能
create policy "自分の物件のみ登録可能"
  on public.properties for insert
  with check (auth.uid() = user_id);

-- UPDATE: 自分が登録した物件のみ更新可能
create policy "自分の物件のみ更新可能"
  on public.properties for update
  using (auth.uid() = user_id);

-- DELETE: 自分が登録した物件のみ削除可能
create policy "自分の物件のみ削除可能"
  on public.properties for delete
  using (auth.uid() = user_id);
