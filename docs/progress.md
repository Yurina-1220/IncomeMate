# IncomeMate Progress

IncomeMateの開発進捗を管理するページです。

## 現在のフェーズ

現在は、ローカルで作ったIncomeMateをGitHubとSupabaseにつなぎ、PCとスマホで使える形に整えている段階です。

```mermaid
flowchart TD
  A["アプリ名をIncomeMateに変更"] --> B["GitHubリポジトリ作成"]
  B --> C["README / docs 整備"]
  C --> D["GitHubへ初回push"]
  D --> E["Supabaseテーブル作成"]
  E --> F[".env設定"]
  F --> G["PCで保存テスト"]
  G --> H["スマホで表示確認"]
  H --> I["PC・スマホ同期確認"]
