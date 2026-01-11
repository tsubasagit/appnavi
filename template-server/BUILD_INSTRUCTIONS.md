# テンプレートサーバー構築指示書（エンジニア向け）

## 概要

このドキュメントは、AppNaviのテンプレートを公開・配信するためのテンプレートサーバーを構築するための詳細な指示書です。

**リポジトリ**: https://github.com/tsubasagit/AppNavi-asset

## 前提条件

- Node.js 18以上がインストールされていること
- Gitがインストールされていること
- GitHubアカウントへのアクセス権限があること
- デプロイ先（Firebase Hosting、Netlify、Vercelなど）のアカウントがあること

## 1. リポジトリのクローンとセットアップ

### 1.1 リポジトリのクローン

```bash
git clone https://github.com/tsubasagit/AppNavi-asset.git
cd AppNavi-asset
```

### 1.2 ブランチの作成

```bash
git checkout -b feature/template-server
```

## 2. ディレクトリ構造の作成

以下のディレクトリ構造を作成してください：

```
AppNavi-asset/
├── templates/                    # テンプレート関連ファイル（新規作成）
│   ├── index.html                # テンプレート一覧ページ
│   ├── api/
│   │   └── templates.json        # テンプレートメタデータAPI
│   ├── templates/
│   │   ├── crm/
│   │   │   └── index.html        # 顧客管理テンプレート詳細ページ
│   │   ├── google-calendar-group/
│   │   │   └── index.html        # Googleカレンダーテンプレート詳細ページ
│   │   ├── daily-report/
│   │   │   └── index.html        # 日報チェックテンプレート詳細ページ
│   │   └── auto-integration/
│   │       └── index.html        # 自動連携テンプレート詳細ページ
│   ├── assets/                   # 共通アセット（画像、CSS、JSなど）
│   │   └── (必要に応じて追加)
│   ├── README.md                 # テンプレートサーバーの説明
│   ├── DEPLOY.md                 # デプロイ手順
│   └── .gitignore                # Git除外設定
└── (既存のファイル)
```

### 2.1 ディレクトリの作成コマンド

```bash
# templatesディレクトリを作成
mkdir -p templates/api
mkdir -p templates/templates/crm
mkdir -p templates/templates/google-calendar-group
mkdir -p templates/templates/daily-report
mkdir -p templates/templates/auto-integration
mkdir -p templates/assets
```

## 3. ファイルの作成

### 3.1 テンプレート一覧ページ (`templates/index.html`)

以下の内容でファイルを作成してください：

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AppNavi テンプレート一覧</title>
  <style>
    /* (既存のスタイルをコピー) */
  </style>
</head>
<body>
  <!-- (既存のHTMLをコピー) -->
</body>
</html>
```

**注意**: 完全なコードは `template-server/index.html` を参照してください。

### 3.2 テンプレートメタデータAPI (`templates/api/templates.json`)

以下のJSONファイルを作成してください：

```json
{
  "templates": [
    {
      "templateId": "crm",
      "name": "顧客管理（CRM）",
      "description": "顧客情報、商談管理、活動履歴を一元管理",
      "category": "営業・マーケティング",
      "color": "purple",
      "previewImageUrl": "/templates/crm/preview.png",
      "demoUrl": "/templates/crm/",
      "version": "1.0.0",
      "isPublic": true,
      "tags": ["営業", "顧客管理", "商談", "CRM"],
      "author": "AppTalentHub",
      "features": [
        "顧客一覧テーブル",
        "商談パイプライン（カンバン）",
        "活動履歴タイムライン",
        "営業ダッシュボード（KPI表示）"
      ]
    },
    {
      "templateId": "google-calendar-group",
      "name": "Googleカレンダーのグループ化",
      "description": "複数のGoogleカレンダーを統合し、グループ別に管理・表示",
      "category": "スケジュール管理",
      "color": "orange",
      "previewImageUrl": "/templates/google-calendar-group/preview.png",
      "demoUrl": "/templates/google-calendar-group/",
      "version": "1.0.0",
      "isPublic": true,
      "tags": ["カレンダー", "スケジュール", "Google", "グループ管理"],
      "author": "AppTalentHub",
      "features": [
        "カレンダー統合表示",
        "グループ別フィルター",
        "イベント一覧",
        "参加者管理",
        "自動同期"
      ]
    },
    {
      "templateId": "daily-report",
      "name": "日報チェック",
      "description": "日々の業務活動の記録とチェック、自動連携",
      "category": "業務管理",
      "color": "green",
      "previewImageUrl": "/templates/daily-report/preview.png",
      "demoUrl": "/templates/daily-report/",
      "version": "1.0.0",
      "isPublic": true,
      "tags": ["日報", "活動報告", "チェック", "業務管理"],
      "author": "AppTalentHub",
      "features": [
        "日報入力フォーム",
        "活動一覧テーブル",
        "カレンダー表示",
        "チェック状況ダッシュボード",
        "自動承認フロー"
      ]
    },
    {
      "templateId": "auto-integration",
      "name": "自動連携",
      "description": "各種サービスとの自動連携とデータ同期",
      "category": "連携・統合",
      "color": "blue",
      "previewImageUrl": "/templates/auto-integration/preview.png",
      "demoUrl": "/templates/auto-integration/",
      "version": "1.0.0",
      "isPublic": true,
      "tags": ["連携", "統合", "自動化", "データ同期"],
      "author": "AppTalentHub",
      "features": [
        "連携設定画面",
        "データ同期状況",
        "連携ログ",
        "エラー通知",
        "自動更新ダッシュボード"
      ]
    }
  ]
}
```

### 3.3 各テンプレートの詳細ページ

以下の4つのファイルを作成してください：

1. `templates/templates/crm/index.html`
2. `templates/templates/google-calendar-group/index.html`
3. `templates/templates/daily-report/index.html`
4. `templates/templates/auto-integration/index.html`

**注意**: 各ファイルの完全なコードは、`template-server/templates/` 配下の対応するファイルを参照してください。

## 4. CORS設定

テンプレートサーバーからAppNaviへのアクセスを許可するため、CORS設定が必要です。

### 4.1 Firebase Hostingの場合

`firebase.json` を作成または更新：

```json
{
  "hosting": {
    "public": "templates",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "/api/**",
        "headers": [
          {
            "key": "Access-Control-Allow-Origin",
            "value": "*"
          },
          {
            "key": "Access-Control-Allow-Methods",
            "value": "GET, OPTIONS"
          },
          {
            "key": "Access-Control-Allow-Headers",
            "value": "Content-Type"
          }
        ]
      }
    ]
  }
}
```

### 4.2 Netlifyの場合

`netlify.toml` を作成：

```toml
[build]
  publish = "templates"

[[headers]]
  for = "/api/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
    Access-Control-Allow-Methods = "GET, OPTIONS"
    Access-Control-Allow-Headers = "Content-Type"
```

### 4.3 Vercelの場合

`vercel.json` を作成：

```json
{
  "public": true,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/templates/$1"
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type"
        }
      ]
    }
  ]
}
```

## 5. ローカルでの動作確認

### 5.1 静的ファイルサーバーで確認

```bash
cd templates
# Python 3の場合
python -m http.server 8000

# Node.jsの場合
npx serve .
```

ブラウザで `http://localhost:8000` にアクセスして確認してください。

### 5.2 APIの動作確認

```bash
# templates.jsonが正しく返されるか確認
curl http://localhost:8000/api/templates.json
```

## 6. デプロイ

### 6.1 Firebase Hosting

```bash
# Firebase CLIをインストール
npm install -g firebase-tools

# Firebaseにログイン
firebase login

# Firebaseプロジェクトを初期化
firebase init hosting
# 以下の設定を選択：
# - Public directory: templates
# - Single-page app: No
# - Set up automatic builds: No

# デプロイ
firebase deploy --only hosting
```

### 6.2 Netlify

```bash
# Netlify CLIをインストール
npm install -g netlify-cli

# Netlifyにログイン
netlify login

# デプロイ
netlify deploy --prod --dir=templates
```

### 6.3 Vercel

```bash
# Vercel CLIをインストール
npm install -g vercel

# デプロイ
cd templates
vercel --prod
```

## 7. AppNavi側の設定

テンプレートサーバーがデプロイされたら、AppNavi側で環境変数を設定してください。

### 7.1 環境変数の設定

`.env` または `.env.local` ファイルに以下を追加：

```env
VITE_TEMPLATE_SERVER_URL=https://your-template-server-domain.com
```

### 7.2 コード内での設定（オプション）

`src/utils/templateServer.ts` の `TEMPLATE_SERVER_URL` を直接変更することも可能です：

```typescript
const TEMPLATE_SERVER_URL = import.meta.env.VITE_TEMPLATE_SERVER_URL || 'https://your-template-server-domain.com'
```

## 8. 動作確認

### 8.1 テンプレートサーバーの確認

1. テンプレート一覧ページが表示されること
2. `/api/templates.json` が正しく返されること
3. 各テンプレートの詳細ページが表示されること

### 8.2 AppNavi側の確認

1. AppNaviの「方針」タブを開く
2. 「サーバーから取得」ボタンをクリック
3. テンプレートが表示され、「サーバー」バッジが付いていること
4. テンプレートを選択して適用できること

## 9. トラブルシューティング

### 9.1 CORSエラーが発生する場合

- テンプレートサーバーのCORS設定を確認
- ブラウザの開発者ツールでネットワークタブを確認
- レスポンスヘッダーに `Access-Control-Allow-Origin` が含まれているか確認

### 9.2 テンプレートが表示されない場合

- テンプレートサーバーのURLが正しいか確認
- `/api/templates.json` に直接アクセスして、JSONが正しく返されるか確認
- AppNavi側の環境変数が正しく設定されているか確認

### 9.3 404エラーが発生する場合

- ファイルパスが正しいか確認
- デプロイ先の設定（publicディレクトリなど）を確認
- リライトルールが正しく設定されているか確認

## 10. 今後の拡張

### 10.1 新しいテンプレートの追加

1. `templates/api/templates.json` に新しいテンプレート情報を追加
2. `templates/templates/{template-id}/index.html` を作成
3. テンプレート一覧ページに表示されることを確認

### 10.2 プレビュー画像の追加

1. `templates/templates/{template-id}/preview.png` を追加
2. `templates/api/templates.json` の `previewImageUrl` を更新

### 10.3 動的コンテンツの追加

必要に応じて、静的HTMLから動的コンテンツ（React、Vue.jsなど）への移行を検討してください。

## 11. セキュリティ考慮事項

- CORS設定は本番環境では適切に制限することを推奨
- テンプレートサーバーは読み取り専用として設計
- 機密情報を含むテンプレートは公開しない

## 12. 参考資料

- [Firebase Hosting ドキュメント](https://firebase.google.com/docs/hosting)
- [Netlify ドキュメント](https://docs.netlify.com/)
- [Vercel ドキュメント](https://vercel.com/docs)
- [CORS の理解](https://developer.mozilla.org/ja/docs/Web/HTTP/CORS)

## 13. サポート

問題が発生した場合は、以下を確認してください：

1. このドキュメントの該当セクション
2. デプロイ先のドキュメント
3. GitHubリポジトリのIssues

---

**最終更新日**: 2024年12月29日
**バージョン**: 1.0.0


