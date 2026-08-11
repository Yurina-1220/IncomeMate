# PCセットアップ手順

## 1. 必要なもの

- Node.js
- pnpm
- Git
- Supabaseアカウント
- GitHubリポジトリ

## 2. ローカルで起動

```bash
pnpm install
pnpm run dev
```

起動後、次のURLを開きます。

```text
http://localhost:3000/
```

## 3. Supabase設定

SupabaseのSQL Editorで `supabase-schema.sql` を実行します。

その後、`.env` に次を設定します。

```env
SUPABASE_URL=自分のSupabase URL
SUPABASE_SERVICE_ROLE_KEY=自分のservice_role key
```

`SUPABASE_SERVICE_ROLE_KEY` はGitHubやチャットに貼らないでください。

## 4. GitHub連携

GitHub側のリポジトリは `Yurina-1220/IncomeMate` です。

PCの作業フォルダをGitHubに接続するには、通常は次の流れです。

```bash
git remote add origin https://github.com/Yurina-1220/IncomeMate.git
git add .
git commit -m "Initial IncomeMate app"
git push -u origin main
```

現在の環境では `.git/config` が読み取り専用のため、Codexからリモート設定を書き込むことはできませんでした。権限がある環境で上記を実行してください。
