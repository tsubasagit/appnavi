# バックエンドプロキシサーバー仕様書

## 1. 概要

AppNaviアプリケーションから外部サイト（`https://tsubasagit.github.io/AppNavi-asset/`）のテンプレートを取得する際のCORSエラーを回避するため、バックエンドプロキシサーバーを作成します。

### 1.1 目的

- CORSエラーを完全に回避
- 本番環境でも動作する
- キャッシュ機能を追加可能
- 認証やレート制限を追加可能

### 1.2 アーキテクチャ

```
[AppNavi Frontend] 
    ↓ (CORSエラー回避)
[Backend Proxy Server]
    ↓ (CORSヘッダー付き)
[External Asset Site]
```

## 2. 実装方式の選択

### 方式1: Firebase Cloud Functions（推奨）

**メリット**:
- ✅ Firebaseプロジェクトに統合可能
- ✅ サーバーレス（運用コストが低い）
- ✅ 自動スケーリング
- ✅ Firebase認証と統合可能

**デメリット**:
- ❌ コールドスタートの遅延（初回リクエスト時）
- ❌ Firebaseプロジェクトが必要

### 方式2: 独立したNode.jsサーバー

**メリット**:
- ✅ 完全な制御が可能
- ✅ 柔軟な実装
- ✅ コールドスタートなし

**デメリット**:
- ❌ サーバーの運用が必要
- ❌ スケーリングの考慮が必要
- ❌ 運用コストが発生

### 方式3: Vercel/Netlify Functions

**メリット**:
- ✅ サーバーレス
- ✅ 簡単なデプロイ
- ✅ 無料プランあり

**デメリット**:
- ❌ 実行時間の制限
- ❌ コールドスタートの遅延

## 3. 推奨実装: Firebase Cloud Functions

### 3.1 プロジェクト構成

```
appnavi-backend/
├── functions/
│   ├── src/
│   │   ├── index.ts          # エントリーポイント
│   │   └── templates.ts       # テンプレート取得ロジック
│   ├── package.json
│   └── tsconfig.json
├── firebase.json
└── .firebaserc
```

### 3.2 APIエンドポイント仕様

#### エンドポイント

```
GET /api/templates
```

#### リクエスト

- **メソッド**: `GET`
- **認証**: 不要（またはオプション）
- **クエリパラメータ**: なし

#### レスポンス

**成功時 (200 OK)**:
```json
{
  "templates": [
    {
      "templateId": "crm",
      "name": "顧客管理（CRM）",
      "description": "顧客情報、商談管理、活動履歴を一元管理",
      "category": "営業・マーケティング",
      "color": "purple",
      "version": "1.0.0",
      "isPublic": true,
      "tags": ["営業", "顧客管理", "商談", "CRM"],
      "author": "AppNavi Team",
      "features": ["顧客管理", "商談パイプライン", "活動履歴"],
      "previewImageUrl": "https://tsubasagit.github.io/AppNavi-asset/templates/crm/preview.png",
      "demoUrl": "https://tsubasagit.github.io/AppNavi-asset/templates/crm/"
    }
  ]
}
```

**エラー時 (500 Internal Server Error)**:
```json
{
  "error": "Failed to fetch templates",
  "message": "詳細なエラーメッセージ"
}
```

#### CORSヘッダー

レスポンスに以下のヘッダーを必ず含める：

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type
Access-Control-Max-Age: 3600
```

### 3.3 実装コード例

#### `functions/src/index.ts`

```typescript
import * as functions from 'firebase-functions'
import * as cors from 'cors'
import { fetchTemplates } from './templates'

const corsHandler = cors({ origin: true })

export const getTemplates = functions.https.onRequest((request, response) => {
  corsHandler(request, response, async () => {
    try {
      if (request.method !== 'GET') {
        response.status(405).json({ error: 'Method not allowed' })
        return
      }

      const templates = await fetchTemplates()
      
      response.status(200).json({
        templates,
      })
    } catch (error: any) {
      console.error('Error fetching templates:', error)
      response.status(500).json({
        error: 'Failed to fetch templates',
        message: error.message,
      })
    }
  })
})
```

#### `functions/src/templates.ts`

```typescript
const ASSET_SITE_URL = 'https://tsubasagit.github.io/AppNavi-asset'

export interface Template {
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

export interface TemplatesResponse {
  templates: Template[]
}

export async function fetchTemplates(): Promise<Template[]> {
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
```

#### `functions/package.json`

```json
{
  "name": "functions",
  "scripts": {
    "build": "tsc",
    "serve": "npm run build && firebase emulators:start --only functions",
    "shell": "npm run build && firebase functions:shell",
    "start": "npm run shell",
    "deploy": "firebase deploy --only functions",
    "logs": "firebase functions:log"
  },
  "engines": {
    "node": "18"
  },
  "main": "lib/index.js",
  "dependencies": {
    "firebase-admin": "^11.8.0",
    "firebase-functions": "^4.3.1",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "typescript": "^4.9.0",
    "@types/cors": "^2.8.13"
  },
  "private": true
}
```

### 3.4 デプロイ手順

```bash
# Firebase CLIをインストール
npm install -g firebase-tools

# Firebaseにログイン
firebase login

# プロジェクトを初期化
firebase init functions

# 関数をデプロイ
cd functions
npm install
npm run build
firebase deploy --only functions
```

### 3.5 エンドポイントURL

デプロイ後、以下のURLでアクセス可能：

```
https://<region>-<project-id>.cloudfunctions.net/getTemplates
```

例：
```
https://us-central1-appnavi-add7e.cloudfunctions.net/getTemplates
```

## 4. 方式2: 独立したNode.jsサーバー

### 4.1 プロジェクト構成

```
appnavi-proxy-server/
├── src/
│   ├── index.ts
│   └── templates.ts
├── package.json
├── tsconfig.json
└── .env
```

### 4.2 実装コード例

#### `src/index.ts`

```typescript
import express from 'express'
import cors from 'cors'
import { fetchTemplates } from './templates'

const app = express()
const PORT = process.env.PORT || 3000

// CORS設定
app.use(cors({
  origin: '*',
  methods: ['GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}))

// ヘルスチェック
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// テンプレート取得エンドポイント
app.get('/api/templates', async (req, res) => {
  try {
    const templates = await fetchTemplates()
    res.json({ templates })
  } catch (error: any) {
    console.error('Error fetching templates:', error)
    res.status(500).json({
      error: 'Failed to fetch templates',
      message: error.message,
    })
  }
})

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`)
})
```

#### `package.json`

```json
{
  "name": "appnavi-proxy-server",
  "version": "1.0.0",
  "scripts": {
    "dev": "ts-node-dev --respawn src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "@types/express": "^4.17.17",
    "@types/cors": "^2.8.13",
    "typescript": "^5.0.0",
    "ts-node-dev": "^2.0.0"
  }
}
```

### 4.3 デプロイ方法

#### Vercel

```bash
# vercel.jsonを作成
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/templates",
      "dest": "src/index.ts"
    }
  ]
}

# デプロイ
vercel deploy
```

#### Railway/Render

```bash
# Dockerfileを作成
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## 5. AppNavi側の実装変更

### 5.1 環境変数の追加

`.env.local`:
```
VITE_PROXY_API_URL=https://us-central1-appnavi-add7e.cloudfunctions.net/getTemplates
```

### 5.2 assetSite.ts の修正

```typescript
const ASSET_SITE_URL = 'https://tsubasagit.github.io/AppNavi-asset'
const PROXY_API_URL = import.meta.env.VITE_PROXY_API_URL || null
const DEV_PROXY_URL = '/api/asset-templates' // 開発環境用Viteプロキシ
const isDevelopment = import.meta.env.DEV

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

## 6. キャッシュ機能の追加（オプション）

### 6.1 サーバー側キャッシュ

```typescript
// メモリキャッシュ（例）
let cachedTemplates: Template[] | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 60 * 60 * 1000 // 1時間

export async function fetchTemplates(): Promise<Template[]> {
  const now = Date.now()
  
  // キャッシュが有効な場合は返す
  if (cachedTemplates && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedTemplates
  }

  // 外部サイトから取得
  const templates = await fetchTemplatesFromAssetSite()
  
  // キャッシュに保存
  cachedTemplates = templates
  cacheTimestamp = now
  
  return templates
}
```

### 6.2 Redisキャッシュ（本番環境推奨）

```typescript
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

export async function fetchTemplates(): Promise<Template[]> {
  // キャッシュから取得を試みる
  const cached = await redis.get('templates')
  if (cached) {
    return JSON.parse(cached)
  }

  // 外部サイトから取得
  const templates = await fetchTemplatesFromAssetSite()
  
  // キャッシュに保存（1時間）
  await redis.setex('templates', 3600, JSON.stringify(templates))
  
  return templates
}
```

## 7. 認証の追加（オプション）

### 7.1 Firebase認証との統合

```typescript
import * as admin from 'firebase-admin'

export const getTemplates = functions.https.onRequest(async (request, response) => {
  corsHandler(request, response, async () => {
    try {
      // 認証トークンを検証（オプション）
      const authHeader = request.headers.authorization
      if (authHeader) {
        const token = authHeader.split('Bearer ')[1]
        await admin.auth().verifyIdToken(token)
      }

      const templates = await fetchTemplates()
      response.status(200).json({ templates })
    } catch (error: any) {
      response.status(500).json({ error: error.message })
    }
  })
})
```

## 8. エラーハンドリング

### 8.1 リトライ機能

```typescript
async function fetchWithRetry(
  url: string,
  maxRetries: number = 3
): Promise<Response> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url)
      if (response.ok) {
        return response
      }
      throw new Error(`HTTP ${response.status}`)
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
  throw new Error('Max retries exceeded')
}
```

### 8.2 タイムアウト設定

```typescript
async function fetchWithTimeout(
  url: string,
  timeout: number = 5000
): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, { signal: controller.signal })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}
```

## 9. 監視とログ

### 9.1 ログ出力

```typescript
export async function fetchTemplates(): Promise<Template[]> {
  const startTime = Date.now()
  
  try {
    const templates = await fetchTemplatesFromAssetSite()
    const duration = Date.now() - startTime
    
    console.log(`Templates fetched successfully: ${templates.length} templates in ${duration}ms`)
    return templates
  } catch (error) {
    const duration = Date.now() - startTime
    console.error(`Failed to fetch templates after ${duration}ms:`, error)
    throw error
  }
}
```

### 9.2 メトリクス収集

```typescript
// 成功/失敗のカウント
let successCount = 0
let failureCount = 0

export async function fetchTemplates(): Promise<Template[]> {
  try {
    const templates = await fetchTemplatesFromAssetSite()
    successCount++
    return templates
  } catch (error) {
    failureCount++
    throw error
  }
}

// メトリクスエンドポイント
app.get('/api/metrics', (req, res) => {
  res.json({
    success: successCount,
    failure: failureCount,
    successRate: successCount / (successCount + failureCount),
  })
})
```

## 10. セキュリティ

### 10.1 レート制限

```typescript
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: 100, // 最大100リクエスト
})

app.use('/api/templates', limiter)
```

### 10.2 入力検証

```typescript
// クエリパラメータの検証（将来の拡張用）
app.get('/api/templates', async (req, res) => {
  const { category, version } = req.query
  
  // 入力検証
  if (category && typeof category !== 'string') {
    res.status(400).json({ error: 'Invalid category parameter' })
    return
  }
  
  // ... 処理
})
```

## 11. デプロイ先の選択

### 11.1 Firebase Cloud Functions（推奨）

- **コスト**: 無料枠あり、従量課金
- **スケーリング**: 自動
- **統合**: Firebaseプロジェクトと統合可能

### 11.2 Vercel

- **コスト**: 無料プランあり
- **スケーリング**: 自動
- **デプロイ**: Git連携で自動デプロイ

### 11.3 Railway/Render

- **コスト**: 従量課金
- **スケーリング**: 手動設定
- **柔軟性**: 高い

## 12. 実装チェックリスト

- [ ] プロジェクトのセットアップ
- [ ] APIエンドポイントの実装
- [ ] CORSヘッダーの設定
- [ ] エラーハンドリングの実装
- [ ] ログ出力の実装
- [ ] デプロイの設定
- [ ] 環境変数の設定
- [ ] AppNavi側の実装変更
- [ ] 動作確認
- [ ] 監視とアラートの設定（オプション）

## 13. トラブルシューティング

### 13.1 タイムアウトエラー

**原因**: 外部サイトへの接続が遅い

**解決方法**:
- タイムアウト時間を延長
- リトライ機能を追加
- キャッシュ機能を追加

### 13.2 メモリ不足

**原因**: 大量のリクエスト

**解決方法**:
- キャッシュ機能を追加
- レート制限を設定
- サーバーのメモリを増やす

### 13.3 CORSエラーが続く

**原因**: CORSヘッダーが正しく設定されていない

**解決方法**:
- レスポンスヘッダーを確認
- CORSミドルウェアの設定を確認

---

**作成日**: 2024-01-11  
**バージョン**: 1.0.0
