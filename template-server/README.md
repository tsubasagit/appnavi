# テンプレートサーバー

AppNaviのテンプレートを公開・配信するためのサーバーです。

**リポジトリ**: https://github.com/tsubasagit/AppNavi-asset

## クイックスタート

詳細な構築手順については、[BUILD_INSTRUCTIONS.md](./BUILD_INSTRUCTIONS.md)を参照してください。

## ディレクトリ構造

```
template-server/
├── index.html              # テンプレート一覧ページ
├── api/
│   └── templates.json      # テンプレートメタデータAPI
├── templates/
│   ├── crm/                # 顧客管理（CRM）テンプレート
│   ├── google-calendar-group/  # Googleカレンダー管理テンプレート
│   ├── daily-report/       # 日報チェックテンプレート
│   └── auto-integration/   # 自動連携テンプレート
└── assets/                 # 共通アセット（CSS、JS、画像など）
```

## デプロイ方法

### Firebase Hosting

```bash
cd template-server
firebase init hosting
firebase deploy
```

### Netlify

```bash
cd template-server
netlify deploy --prod
```

### Vercel

```bash
cd template-server
vercel deploy --prod
```

### 静的ファイルサーバー

```bash
cd template-server
# Python
python -m http.server 8000

# Node.js
npx serve .
```

## API仕様

### GET /api/templates.json

すべてのテンプレートのメタデータを返します。

```json
{
  "templates": [
    {
      "templateId": "crm",
      "name": "顧客管理（CRM）",
      "description": "顧客情報、商談管理、活動履歴を一元管理",
      "category": "営業・マーケティング",
      "color": "#8b5cf6",
      "previewImageUrl": "/templates/crm/preview.png",
      "demoUrl": "/templates/crm/",
      "version": "1.0.0",
      "isPublic": true
    }
  ]
}
```

## AppNaviとの連携

AppNaviの「方針」タブから、このサーバーのテンプレートを取得して表示します。

設定例：
```typescript
const TEMPLATE_SERVER_URL = 'https://templates.appnavi.com'
```

