# テンプレートサーバーのデプロイ手順

## 概要

このテンプレートサーバーは、AppNaviのテンプレートを公開・配信するための静的サイトです。

## デプロイ方法

### 1. Firebase Hosting

```bash
# Firebase CLIをインストール
npm install -g firebase-tools

# Firebaseにログイン
firebase login

# Firebaseプロジェクトを初期化
firebase init hosting

# デプロイ
firebase deploy --only hosting
```

### 2. Netlify

```bash
# Netlify CLIをインストール
npm install -g netlify-cli

# Netlifyにログイン
netlify login

# デプロイ
netlify deploy --prod
```

### 3. Vercel

```bash
# Vercel CLIをインストール
npm install -g vercel

# デプロイ
vercel --prod
```

### 4. GitHub Pages

1. GitHubリポジトリにプッシュ
2. リポジトリのSettings > Pagesで、Sourceを「main」ブランチに設定
3. 自動的にデプロイされます

## 環境変数の設定

AppNavi側でテンプレートサーバーのURLを設定する必要があります。

### 方法1: 環境変数ファイル（.env）

```env
VITE_TEMPLATE_SERVER_URL=https://templates.appnavi.com
```

### 方法2: ビルド時の環境変数

```bash
VITE_TEMPLATE_SERVER_URL=https://templates.appnavi.com npm run build
```

### 方法3: コード内で直接設定

`src/utils/templateServer.ts`の`TEMPLATE_SERVER_URL`を直接変更

## カスタムドメインの設定

テンプレートサーバーをカスタムドメインで公開する場合：

1. デプロイ先のプラットフォームでカスタムドメインを設定
2. AppNaviの環境変数を更新
3. 再ビルド・再デプロイ

## CORS設定

テンプレートサーバーからAppNaviへのアクセスを許可する必要があります。

### Firebase Hosting

`firebase.json`に以下を追加：

```json
{
  "hosting": {
    "headers": [
      {
        "source": "/api/**",
        "headers": [
          {
            "key": "Access-Control-Allow-Origin",
            "value": "*"
          }
        ]
      }
    ]
  }
}
```

### Netlify

`netlify.toml`を作成：

```toml
[[headers]]
  for = "/api/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
```

### Vercel

`vercel.json`を作成：

```json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }
      ]
    }
  ]
}
```

## トラブルシューティング

### CORSエラーが発生する場合

- テンプレートサーバーのCORS設定を確認
- AppNaviの環境変数が正しく設定されているか確認

### テンプレートが表示されない場合

- テンプレートサーバーのURLが正しいか確認
- ブラウザの開発者ツールでネットワークエラーを確認
- `/api/templates.json`にアクセスして、JSONが正しく返されるか確認


