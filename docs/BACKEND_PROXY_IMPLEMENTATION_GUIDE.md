# バックエンドプロキシサーバー実装ガイド

## クイックスタート（Firebase Cloud Functions）

### ステップ1: Firebase Functionsのセットアップ

```bash
# Firebase CLIをインストール（未インストールの場合）
npm install -g firebase-tools

# Firebaseにログイン
firebase login

# プロジェクトディレクトリで初期化
firebase init functions

# TypeScriptを選択
# 既存のFirebaseプロジェクトを選択（appnavi-add7e）
```

### ステップ2: 依存関係のインストール

```bash
cd functions
npm install cors
npm install --save-dev @types/cors
```

### ステップ3: コードの実装

#### `functions/src/index.ts`

```typescript
import * as functions from 'firebase-functions'
import * as cors from 'cors'
import { Request, Response } from 'express'

const corsHandler = cors({ origin: true })

const ASSET_SITE_URL = 'https://tsubasagit.github.io/AppNavi-asset'

interface Template {
  templateId: string
  name: string
  description: string
  category: string
  color: string
  version: string
  isPublic: boolean
  tags: string[]
  author: string
  features?: string[]
  previewImageUrl?: string
  demoUrl?: string
}

interface TemplatesResponse {
  templates: Template[]
}

async function fetchTemplatesFromAssetSite(): Promise<Template[]> {
  try {
    const response = await fetch(`${ASSET_SITE_URL}/api/templates.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: TemplatesResponse = await response.json()
    return data.templates || []
  } catch (error) {
    console.error('Error fetching templates from asset site:', error)
    throw error
  }
}

export const getTemplates = functions.https.onRequest(
  async (request: Request, response: Response) => {
    corsHandler(request, response, async () => {
      try {
        if (request.method !== 'GET') {
          response.status(405).json({ error: 'Method not allowed' })
          return
        }

        const templates = await fetchTemplatesFromAssetSite()

        response.status(200).json({
          templates,
        })
      } catch (error: any) {
        console.error('Error fetching templates:', error)
        response.status(500).json({
          error: 'Failed to fetch templates',
          message: error.message || 'Unknown error',
        })
      }
    })
  }
)
```

### ステップ4: ビルドとデプロイ

```bash
# ビルド
npm run build

# デプロイ
firebase deploy --only functions:getTemplates
```

### ステップ5: エンドポイントURLの確認

デプロイ後、以下のようなURLが表示されます：

```
https://us-central1-appnavi-add7e.cloudfunctions.net/getTemplates
```

このURLをコピーして、AppNavi側の環境変数に設定します。

## AppNavi側の設定

### 環境変数の追加

`.env.local` または `.env.production`:

```
VITE_PROXY_API_URL=https://us-central1-appnavi-add7e.cloudfunctions.net/getTemplates
```

### assetSite.ts の修正

```typescript
const PROXY_API_URL = import.meta.env.VITE_PROXY_API_URL || null

export async function fetchTemplatesFromAssetSite(
  forceRefresh: boolean = false
): Promise<AssetSiteTemplate[]> {
  try {
    // キャッシュがある場合はそれを使用
    if (!forceRefresh) {
      const cached = getCachedTemplates()
      if (cached) {
        return cached
      }
    }

    // URLの決定（優先順位: プロキシAPI > 開発プロキシ > 直接取得）
    let url: string
    if (PROXY_API_URL) {
      // 本番環境: バックエンドプロキシ経由
      url = PROXY_API_URL
    } else if (isDevelopment) {
      // 開発環境: Viteプロキシ経由
      url = DEV_PROXY_URL
    } else {
      // フォールバック: 直接取得（CORSエラーの可能性あり）
      url = `${ASSET_SITE_URL}/api/templates.json`
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      cache: 'no-cache',
    })

    // ... 残りの処理
  }
}
```

## 動作確認

1. バックエンドプロキシサーバーをデプロイ
2. エンドポイントURLを環境変数に設定
3. AppNaviアプリケーションを再起動
4. 「外部サイトから更新」ボタンをクリック
5. テンプレートが正常に取得できることを確認

## トラブルシューティング

### エラー: "Function failed to deploy"

**解決方法**:
- `functions/package.json` の依存関係を確認
- `npm install` を実行
- TypeScriptのビルドエラーを確認

### エラー: "CORS policy"

**解決方法**:
- `cors` ミドルウェアが正しく設定されているか確認
- レスポンスヘッダーを確認

### エラー: "Timeout"

**解決方法**:
- Cloud Functionsのタイムアウト設定を確認（デフォルト60秒）
- 外部サイトへの接続が遅い場合は、タイムアウト時間を延長

---

**作成日**: 2024-01-11
