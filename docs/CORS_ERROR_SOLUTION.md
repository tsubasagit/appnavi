# CORSエラー解決方法

## 問題の概要

GitHub PagesではCORSヘッダーを設定できないため、`https://tsubasagit.github.io/AppNavi-asset/api/templates.json` から直接取得しようとするとCORSエラーが発生します。

## 解決方法（優先順位順）

### 方法1: Viteのプロキシ機能を使用（開発環境用・推奨）

Viteの開発サーバーにプロキシ設定を追加することで、CORSエラーを回避できます。

**実装手順**:

1. `vite.config.ts` にプロキシ設定を追加
2. `assetSite.ts` で開発環境時はプロキシ経由で取得

**メリット**:
- ✅ 開発環境で即座に動作
- ✅ コード変更が最小限
- ✅ 本番環境への影響なし

**デメリット**:
- ❌ 開発環境のみ有効（本番環境では別の方法が必要）

### 方法2: バックエンドプロキシサーバーを作成（本番環境用・推奨）

AppNaviのバックエンドサーバー経由でテンプレートを取得する。

**実装手順**:
1. バックエンドAPIエンドポイントを作成（例: `/api/templates`)
2. バックエンドで外部サイトから取得し、CORSヘッダーを設定して返す
3. フロントエンドからはバックエンドAPIを呼び出す

**メリット**:
- ✅ 本番環境でも動作
- ✅ CORSエラーを完全に回避
- ✅ キャッシュや認証を追加可能

**デメリット**:
- ❌ バックエンドサーバーが必要

### 方法3: CORS拡張機能を使用（開発環境のみ・一時的）

ブラウザのCORS拡張機能を使用してCORSエラーを回避する。

**実装手順**:
1. Chrome拡張機能「CORS Unblock」などをインストール
2. 開発時に有効化

**メリット**:
- ✅ コード変更不要
- ✅ 即座に動作

**デメリット**:
- ❌ 開発環境のみ
- ❌ チーム全員が拡張機能をインストールする必要がある
- ❌ 本番環境では使用不可

### 方法4: ローカルにJSONファイルを配置（開発環境のみ・一時的）

テンプレートJSONファイルをローカルに配置して、開発環境で使用する。

**実装手順**:
1. `public/api/templates.json` にファイルを配置
2. 開発環境時はローカルファイルを読み込む

**メリット**:
- ✅ 即座に動作
- ✅ CORSエラーを回避

**デメリット**:
- ❌ 開発環境のみ
- ❌ ファイルを手動で更新する必要がある

### 方法5: Netlify/Vercelに移行（Asset側）

GitHub Pagesの代わりにNetlifyやVercelを使用する。

**実装手順**:
1. AssetリポジトリをNetlify/Vercelにデプロイ
2. `_headers` ファイルでCORSを許可

**メリット**:
- ✅ CORSを正しく設定可能
- ✅ 本番環境でも動作

**デメリット**:
- ❌ Asset側の変更が必要

## 推奨実装（方法1: Viteプロキシ）

開発環境ではViteのプロキシ機能を使用することを推奨します。

### 実装コード

**`vite.config.ts`**:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/asset-templates': {
        target: 'https://tsubasagit.github.io/AppNavi-asset',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/asset-templates/, '/api/templates.json'),
        configure: (proxy, _options) => {
          proxy.on('proxyRes', (proxyRes, req, res) => {
            // CORSヘッダーを追加
            proxyRes.headers['Access-Control-Allow-Origin'] = '*'
            proxyRes.headers['Access-Control-Allow-Methods'] = 'GET'
            proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type'
          })
        },
      },
    },
  },
})
```

**`src/utils/assetSite.ts`**:
```typescript
const ASSET_SITE_URL = 'https://tsubasagit.github.io/AppNavi-asset'
const DEV_PROXY_URL = '/api/asset-templates' // 開発環境用プロキシ

// 開発環境かどうかを判定
const isDevelopment = import.meta.env.DEV

export async function fetchTemplatesFromAssetSite(
  forceRefresh: boolean = false
): Promise<AssetSiteTemplate[]> {
  try {
    // キャッシュがある場合はそれを使用（forceRefreshがfalseの場合）
    if (!forceRefresh) {
      const cached = getCachedTemplates()
      if (cached) {
        console.log('キャッシュからテンプレートを読み込みました')
        return cached
      }
    }

    // 開発環境ではプロキシ経由、本番環境では直接取得
    const url = isDevelopment 
      ? DEV_PROXY_URL 
      : `${ASSET_SITE_URL}/api/templates.json`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      cache: 'no-cache',
    }).catch((fetchError) => {
      // ... エラーハンドリング
    })

    // ... 残りの処理
  }
}
```

## 本番環境での対応

本番環境では、以下のいずれかの方法が必要です：

1. **バックエンドプロキシサーバー**: 最も確実
2. **Netlify/Vercelに移行**: Asset側の変更が必要だが、CORSを正しく設定可能
3. **CDN経由**: CloudflareなどのCDNを使用してCORSヘッダーを設定

## 一時的な回避策（開発環境）

開発を続けるために、一時的に以下の方法を使用できます：

1. **ローカルファイル**: `public/api/templates.json` にファイルを配置
2. **CORS拡張機能**: ブラウザ拡張機能を使用
3. **手動でJSONをコピー**: コンソールから直接JSONを設定

---

**作成日**: 2024-01-11  
**更新日**: 2024-01-11
