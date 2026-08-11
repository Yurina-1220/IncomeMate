# セキュリティ方針

IncomeMateでは、収入・勤務先・カレンダー情報を扱うため、個人情報として慎重に管理します。

## 公開してよいもの

- `README.md`
- `docs/`
- `.env.example`
- アプリのコード
- `supabase-schema.sql`

## 公開してはいけないもの

- `.env`
- Supabaseの `service_role key`
- 外部サービスのID・パスワード
- 銀行ログイン情報
- 個人の実データ

## .envとは

`.env` は秘密情報を入れるローカル設定ファイルです。

```env
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

`.env` はGitHubにアップしません。必要な項目名だけを `.env.example` に書きます。

## service_role keyについて

`service_role key` はSupabaseの管理者用の強い鍵です。ブラウザやスマホに出してはいけません。

IncomeMateでは、API側だけがこの鍵を使う設計にします。
