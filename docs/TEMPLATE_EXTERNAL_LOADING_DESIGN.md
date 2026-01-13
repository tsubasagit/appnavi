# 外部サイトからのテンプレート読み込み機能 設計書

## 1. 概要

`https://tsubasagit.github.io/AppNavi-asset/` からテンプレートを読み込む機能の設計書です。

## 2. 要件

- PolicyTab（方針タブ）を開いたときに、外部サイトからテンプレートを自動的に読み込む
- 手動で更新することも可能
- エラーが発生してもアプリは動作し続ける（フォールバック）

## 3. 設計方針

### 3.1 推奨方式: **初回自動読み込み + 手動更新 + キャッシュ**

**動作フロー**:
1. PolicyTabが開かれたとき（初回のみ）自動で外部サイトからテンプレートを取得
2. 取得したテンプレートをローカルストレージにキャッシュ（24時間有効）
3. 次回以降はキャッシュから読み込み（高速化）
4. 「更新」ボタンで手動で最新版を取得可能

**メリット**:
- ✅ ユーザーが何もしなくても最新のテンプレートが表示される
- ✅ キャッシュにより2回目以降は高速
- ✅ ネットワークエラー時もキャッシュがあれば表示可能
- ✅ 手動更新で最新版を取得可能

### 3.2 代替方式: **完全自動読み込み**

**動作フロー**:
1. PolicyTabが開かれるたびに外部サイトからテンプレートを取得
2. キャッシュは使用しない

**メリット**:
- ✅ 常に最新のテンプレートが表示される

**デメリット**:
- ❌ 毎回ネットワークリクエストが発生（パフォーマンス低下）
- ❌ ネットワークエラー時にテンプレートが表示されない

## 4. 実装詳細

### 4.1 外部サイトの想定構造

外部サイト（`https://tsubasagit.github.io/AppNavi-asset/`）には以下のエンドポイントが存在すると想定：

```
GET https://tsubasagit.github.io/AppNavi-asset/api/templates.json
```

**レスポンス形式**:
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
      "features": ["顧客管理", "商談パイプライン", "活動履歴"]
    }
  ]
}
```

### 4.2 新しいユーティリティ関数の作成

`src/utils/assetSite.ts` を新規作成:

```typescript
/**
 * AppNavi-assetサイトからテンプレートを取得するユーティリティ
 */

const ASSET_SITE_URL = 'https://tsubasagit.github.io/AppNavi-asset'
const CACHE_KEY = 'appnavi_asset_templates'
const CACHE_EXPIRY_HOURS = 24

export interface AssetSiteTemplate {
  templateId: string
  name: string
  description: string
  category: string
  color: 'purple' | 'orange' | 'green' | 'blue' | 'slate'
  version: string
  isPublic: boolean
  tags: string[]
  author: string
  features?: string[]
  previewImageUrl?: string
  demoUrl?: string
}

export interface AssetSiteResponse {
  templates: AssetSiteTemplate[]
}

interface CachedData {
  templates: AssetSiteTemplate[]
  timestamp: number
}

/**
 * キャッシュからテンプレートを取得
 */
function getCachedTemplates(): AssetSiteTemplate[] | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!cached) return null

    const data: CachedData = JSON.parse(cached)
    const now = Date.now()
    const expiry = CACHE_EXPIRY_HOURS * 60 * 60 * 1000

    // キャッシュが有効期限内かチェック
    if (now - data.timestamp < expiry) {
      return data.templates
    }

    // 期限切れの場合はキャッシュを削除
    localStorage.removeItem(CACHE_KEY)
    return null
  } catch (error) {
    console.error('キャッシュの読み込みエラー:', error)
    return null
  }
}

/**
 * テンプレートをキャッシュに保存
 */
function setCachedTemplates(templates: AssetSiteTemplate[]): void {
  try {
    const data: CachedData = {
      templates,
      timestamp: Date.now(),
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('キャッシュの保存エラー:', error)
  }
}

/**
 * 外部サイトからテンプレートを取得（キャッシュを使用しない）
 */
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

    // 外部サイトから取得
    const response = await fetch(`${ASSET_SITE_URL}/api/templates.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // CORSエラー対策: モードを指定
      mode: 'cors',
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: AssetSiteResponse = await response.json()
    const templates = data.templates || []

    // キャッシュに保存
    setCachedTemplates(templates)

    console.log(`${templates.length}件のテンプレートを外部サイトから取得しました`)
    return templates
  } catch (error) {
    console.error('外部サイトからのテンプレート取得エラー:', error)

    // エラー時はキャッシュがあればそれを返す
    const cached = getCachedTemplates()
    if (cached) {
      console.log('エラーが発生しましたが、キャッシュからテンプレートを読み込みました')
      return cached
    }

    // キャッシュもない場合は空配列を返す
    return []
  }
}

/**
 * キャッシュをクリア
 */
export function clearAssetSiteCache(): void {
  localStorage.removeItem(CACHE_KEY)
}

/**
 * 外部サイトのURLを取得
 */
export function getAssetSiteUrl(): string {
  return ASSET_SITE_URL
}
```

### 4.3 PolicyTabの修正

`src/components/tabs/PolicyTab.tsx` に以下を追加：

1. **状態管理**:
```typescript
const [assetSiteTemplates, setAssetSiteTemplates] = useState<AssetSiteTemplate[]>([])
const [isLoadingAssetSiteTemplates, setIsLoadingAssetSiteTemplates] = useState(false)
```

2. **初回自動読み込み**:
```typescript
// 外部サイトからテンプレートを取得（初回のみ自動読み込み）
useEffect(() => {
  const loadAssetSiteTemplates = async () => {
    setIsLoadingAssetSiteTemplates(true)
    try {
      const templates = await fetchTemplatesFromAssetSite(false) // キャッシュを使用
      setAssetSiteTemplates(templates)
    } catch (error) {
      console.error('外部サイトからのテンプレート取得エラー:', error)
      // エラーが発生しても続行（ローカルテンプレートのみ表示）
    } finally {
      setIsLoadingAssetSiteTemplates(false)
    }
  }
  
  loadAssetSiteTemplates()
}, [])
```

3. **手動更新ボタン**:
```typescript
<button
  onClick={async () => {
    setIsLoadingAssetSiteTemplates(true)
    try {
      const templates = await fetchTemplatesFromAssetSite(true) // 強制更新
      setAssetSiteTemplates(templates)
      alert(`${templates.length}件のテンプレートを外部サイトから取得しました。`)
    } catch (error) {
      alert('外部サイトからテンプレートを取得できませんでした。')
      console.error(error)
    } finally {
      setIsLoadingAssetSiteTemplates(false)
    }
  }}
  className="btn-secondary flex items-center space-x-2"
  disabled={isLoadingAssetSiteTemplates}
  title="外部サイトから最新のテンプレートを取得"
>
  <RefreshCw size={16} className={isLoadingAssetSiteTemplates ? 'animate-spin' : ''} />
  <span>{isLoadingAssetSiteTemplates ? '取得中...' : '外部サイトから更新'}</span>
</button>
```

4. **テンプレートの統合**:
```typescript
// 外部サイトのテンプレートをTemplate型に変換
const convertedAssetSiteTemplates: Template[] = assetSiteTemplates.map(assetTemplate => {
  const iconMap: Record<string, any> = {
    'crm': UserCheck,
    'google-calendar-group': Calendar,
    'daily-report': ClipboardList,
    'auto-integration': RefreshCw,
  }
  
  return {
    id: assetTemplate.templateId,
    name: assetTemplate.name,
    description: assetTemplate.description,
    icon: iconMap[assetTemplate.templateId] || Target,
    color: assetTemplate.color,
    category: assetTemplate.category,
    preview: assetTemplate.features?.join('、') || assetTemplate.description,
    author: assetTemplate.author,
  }
})

// すべてのテンプレートを統合（重複を避ける）
const allAvailableTemplates = [
  ...allTemplates,
  ...convertedServerTemplates.filter(
    serverTemplate => !allTemplates.some(local => local.id === serverTemplate.id)
  ),
  ...convertedAssetSiteTemplates.filter(
    assetTemplate => !allTemplates.some(local => local.id === assetTemplate.id) &&
                     !convertedServerTemplates.some(server => server.id === assetTemplate.id)
  ),
]
```

5. **テンプレートカードにバッジ表示**:
```typescript
{isFromAssetSite && (
  <div className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
    <Globe size={10} />
    外部サイト
  </div>
)}
```

## 5. エラーハンドリング

### 5.1 CORSエラー対策

外部サイトがCORSを許可していない場合、以下の対策を検討：

1. **プロキシサーバー経由**: バックエンドサーバー経由で取得
2. **GitHub Pagesの設定**: `_headers` ファイルでCORSを許可
3. **JSONP**: 外部サイトがJSONPをサポートしている場合

### 5.2 ネットワークエラー時のフォールバック

- キャッシュがあればキャッシュから読み込み
- キャッシュもない場合はローカルテンプレートのみ表示
- エラーメッセージは表示しない（ユーザー体験を損なわない）

## 6. パフォーマンス最適化

### 6.1 キャッシュ戦略

- **有効期限**: 24時間
- **ストレージ**: localStorage
- **更新タイミング**: 手動更新ボタンまたは初回読み込み時

### 6.2 読み込みタイミング

- **初回**: PolicyTabが開かれたとき（自動）
- **更新**: 手動更新ボタンをクリックしたとき
- **バックグラウンド更新**: 実装しない（ユーザー体験を損なう可能性）

## 7. UI/UX設計

### 7.1 ローディング状態

- 初回読み込み時: テンプレートグリッドの上に「外部サイトからテンプレートを読み込み中...」と表示
- 手動更新時: ボタン内にスピナーを表示

### 7.2 テンプレートカードの表示

- 外部サイトからのテンプレートには「外部サイト」バッジを表示
- 色分け: 緑色のバッジ（既存の「サーバー」バッジは青色）

### 7.3 エラー表示

- エラー時は静かにフォールバック（エラーメッセージは表示しない）
- 手動更新時にエラーが発生した場合のみアラートを表示

## 8. 実装チェックリスト

- [ ] `src/utils/assetSite.ts` を作成
- [ ] `PolicyTab.tsx` に外部サイトからの読み込み機能を追加
- [ ] 初回自動読み込みの実装
- [ ] 手動更新ボタンの実装
- [ ] キャッシュ機能の実装
- [ ] テンプレートの統合（重複チェック）
- [ ] バッジ表示の実装
- [ ] エラーハンドリングの実装
- [ ] CORSエラーの確認と対策
- [ ] パフォーマンステスト

## 9. テスト項目

1. **正常系**:
   - 外部サイトからテンプレートが正常に取得できる
   - キャッシュが正しく保存・読み込みされる
   - テンプレートが正しく表示される

2. **異常系**:
   - ネットワークエラー時にキャッシュから読み込める
   - CORSエラーが発生してもアプリが動作し続ける
   - キャッシュが期限切れの場合、外部サイトから再取得される

3. **パフォーマンス**:
   - 初回読み込み時間が3秒以内
   - キャッシュからの読み込み時間が1秒以内

## 10. 今後の拡張

- **バックグラウンド更新**: アプリ起動時にバックグラウンドで更新
- **通知機能**: 新しいテンプレートが追加されたときに通知
- **バージョン管理**: テンプレートのバージョンが更新されたときに通知

---

**作成日**: 2024-01-11  
**バージョン**: 1.0.0
