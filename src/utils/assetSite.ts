/**
 * AppNavi-assetサイトからテンプレートを取得するユーティリティ
 */

const ASSET_SITE_URL = 'https://tsubasagit.github.io/AppNavi-asset'
const PROXY_API_URL = import.meta.env.VITE_PROXY_API_URL || null // バックエンドプロキシAPI URL（本番環境用）
const DEV_PROXY_URL = '/api/asset-templates' // 開発環境用Viteプロキシ
const CACHE_KEY = 'appnavi_asset_templates'
const CACHE_EXPIRY_HOURS = 24
const FETCH_TIMEOUT_MS = 10000 // 10秒
const MAX_RETRIES = 3 // 最大リトライ回数
const RETRY_DELAY_MS = 1000 // リトライ間隔（1秒）

// 開発環境かどうかを判定
const isDevelopment = import.meta.env.DEV

export interface AssetSiteTemplate {
  templateId: string
  name: string
  description: string
  category: string
  color: 'purple' | 'orange' | 'green' | 'blue' | 'slate'
  version: string
  updatedAt?: string
  isPublic: boolean
  tags: string[]
  author: string
  features?: string[]
  previewImageUrl?: string
  demoUrl?: string
  schemaUrl?: string
  viewsUrl?: string
  sampleDataUrl?: string
}

export interface AssetSiteResponse {
  templates: AssetSiteTemplate[]
}

interface CachedData {
  templates: AssetSiteTemplate[]
  timestamp: number
  version?: string // キャッシュ時のバージョン情報
}

/**
 * タイムアウト付きfetch
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number = FETCH_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    return response
  } catch (error: any) {
    clearTimeout(timeoutId)
    if (error.name === 'AbortError') {
      throw new Error(`リクエストがタイムアウトしました（${timeoutMs}ms）`)
    }
    throw error
  }
}

/**
 * リトライ付きfetch
 */
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries: number = MAX_RETRIES,
  retryDelay: number = RETRY_DELAY_MS
): Promise<Response> {
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, options)
      if (response.ok) {
        return response
      }
      // 404や500などのHTTPエラーはリトライしない
      if (response.status >= 400 && response.status < 500) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`)
      }
      // サーバーエラー（500番台）の場合はリトライ
      lastError = new Error(`HTTP error! status: ${response.status} - ${response.statusText}`)
    } catch (error: any) {
      lastError = error
      if (attempt < maxRetries) {
        console.log(`[assetSite] リトライ ${attempt}/${maxRetries} (${retryDelay}ms後に再試行)`)
        await new Promise(resolve => setTimeout(resolve, retryDelay))
        // 指数バックオフ: リトライ間隔を徐々に増やす
        retryDelay *= 1.5
      }
    }
  }

  throw lastError || new Error('リトライ回数の上限に達しました')
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
    // 最新のバージョン情報を取得（最初のテンプレートのバージョンを使用）
    const latestVersion = templates.length > 0 ? templates[0].version : undefined
    
    const data: CachedData = {
      templates,
      timestamp: Date.now(),
      version: latestVersion,
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('キャッシュの保存エラー:', error)
  }
}

/**
 * テンプレートの更新をチェック
 * @returns 更新がある場合true
 */
export function checkTemplateUpdates(
  cachedTemplates: AssetSiteTemplate[],
  newTemplates: AssetSiteTemplate[]
): boolean {
  if (cachedTemplates.length !== newTemplates.length) {
    return true
  }

  // 各テンプレートのバージョンと更新日時を比較
  for (const newTemplate of newTemplates) {
    const cachedTemplate = cachedTemplates.find(t => t.templateId === newTemplate.templateId)
    if (!cachedTemplate) {
      return true // 新しいテンプレートが追加された
    }

    // バージョンが異なる場合
    if (cachedTemplate.version !== newTemplate.version) {
      return true
    }

    // 更新日時が異なる場合
    if (cachedTemplate.updatedAt && newTemplate.updatedAt) {
      const cachedDate = new Date(cachedTemplate.updatedAt).getTime()
      const newDate = new Date(newTemplate.updatedAt).getTime()
      if (cachedDate < newDate) {
        return true
      }
    }
  }

  return false
}

/**
 * 外部サイトからテンプレートを取得
 * @param forceRefresh キャッシュを無視して強制更新するか
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

    // URLの決定（優先順位: プロキシAPI > 開発プロキシ > 直接取得）
    // 開発環境ではViteプロキシを使用（CORSエラー回避）
    // プロキシが動作しない場合は、直接取得を試みる（CORSエラーの可能性あり）
    let url: string
    if (PROXY_API_URL) {
      // 本番環境: バックエンドプロキシ経由（CORSエラー回避）
      url = PROXY_API_URL
    } else if (isDevelopment) {
      // 開発環境: まずViteプロキシを試みる
      // プロキシが404を返す場合は、直接取得にフォールバック
      url = DEV_PROXY_URL
    } else {
      // 本番環境（プロキシなし）: 直接取得（CORSエラーの可能性あり）
      url = `${ASSET_SITE_URL}/api/templates.json`
    }

    // 外部サイトから取得
    // forceRefreshの場合は、キャッシュを完全に無効化するため、タイムスタンプを追加
    // ただし、Viteプロキシの場合はクエリパラメータを追加しない（プロキシが正しく動作しない可能性がある）
    const urlWithCacheBust = forceRefresh && !isDevelopment && !url.startsWith('/')
      ? `${url}?t=${Date.now()}` 
      : url

    console.log(`[assetSite] テンプレート取得開始: ${urlWithCacheBust}`)
    console.log(`[assetSite] 開発環境: ${isDevelopment}, プロキシURL: ${PROXY_API_URL || 'なし'}`)
    
    let response: Response
    try {
      // リトライ付きfetchを使用
      response = await fetchWithRetry(urlWithCacheBust, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // CORSエラー対策: モードを指定
        mode: 'cors',
        // キャッシュ制御: forceRefreshの場合は完全に無効化
        cache: forceRefresh ? 'no-store' : 'no-cache',
      })
    } catch (fetchError: any) {
      // ネットワークエラーやCORSエラーの場合
      console.error('[assetSite] Fetch error:', fetchError)
      
      // 開発環境でプロキシ経由が失敗した場合、直接取得を試みる
      if (isDevelopment && url === DEV_PROXY_URL) {
        console.log('[assetSite] プロキシ経由が失敗したため、直接取得を試みます')
        const directUrl = `${ASSET_SITE_URL}/api/templates.json`
        try {
          response = await fetchWithRetry(directUrl, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            mode: 'cors',
            cache: forceRefresh ? 'no-store' : 'no-cache',
          })
        } catch (directError: any) {
          throw new Error(
            directError instanceof TypeError && directError.message === 'Failed to fetch'
              ? 'ネットワークエラーまたはCORSエラーが発生しました。外部サイト（https://tsubasagit.github.io/AppNavi-asset/）にアクセスできない可能性があります。'
              : `ネットワークエラー: ${directError.message}`
          )
        }
      } else {
        throw new Error(
          fetchError instanceof TypeError && fetchError.message === 'Failed to fetch'
            ? 'ネットワークエラーまたはCORSエラーが発生しました。外部サイト（https://tsubasagit.github.io/AppNavi-asset/）にアクセスできない可能性があります。'
            : `ネットワークエラー: ${fetchError.message}`
        )
      }
    }

    if (!response.ok) {
      // 開発環境でプロキシ経由が404を返した場合、直接取得を試みる
      if (isDevelopment && url === DEV_PROXY_URL && response.status === 404) {
        console.log('[assetSite] プロキシが404を返したため、直接取得を試みます')
        const directUrl = `${ASSET_SITE_URL}/api/templates.json`
        try {
          const directResponse = await fetchWithRetry(directUrl, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            mode: 'cors',
            cache: forceRefresh ? 'no-store' : 'no-cache',
          })
          
          if (!directResponse.ok) {
            throw new Error(`HTTP error! status: ${directResponse.status} - ${directResponse.statusText}`)
          }
          
          response = directResponse
        } catch (directError: any) {
          // CORSエラーの場合、エラーメッセージを改善
          if (directError instanceof TypeError && directError.message === 'Failed to fetch') {
            throw new Error(
              'CORSエラーが発生しました。外部サイト（https://tsubasagit.github.io/AppNavi-asset/）でCORS設定が必要です。\n\n' +
              '開発環境では、Viteプロキシを使用することを推奨しますが、プロキシが404を返しているため、\n' +
              '外部サイト側でCORS設定を追加するか、Viteプロキシの設定を確認してください。'
            )
          }
          throw directError
        }
      } else {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`)
      }
    }

    let data: AssetSiteResponse
    try {
      data = await response.json()
    } catch (jsonError) {
      throw new Error('JSONの解析に失敗しました。レスポンスが正しい形式ではありません。')
    }

    const templates = data.templates || []

    // バリデーション: テンプレートデータの整合性チェック
    const validTemplates = templates.filter(template => {
      if (!template.templateId || !template.name) {
        console.warn(`[assetSite] 無効なテンプレートをスキップ:`, template)
        return false
      }
      return true
    })

    // デバッグ: 取得したテンプレートの詳細をログ出力
    console.log(`[assetSite] 取得したテンプレート数: ${validTemplates.length}件（無効なテンプレート: ${templates.length - validTemplates.length}件）`)
    validTemplates.forEach((template, index) => {
      console.log(`[assetSite] ${index + 1}. ID: ${template.templateId}, 名前: ${template.name}, バージョン: ${template.version || 'N/A'}`)
    })

    // 更新チェック（キャッシュがある場合）
    if (!forceRefresh) {
      const cached = getCachedTemplates()
      if (cached && cached.length > 0) {
        const hasUpdates = checkTemplateUpdates(cached, validTemplates)
        if (hasUpdates) {
          console.log('[assetSite] テンプレートの更新を検出しました')
        } else {
          console.log('[assetSite] テンプレートに更新はありません')
        }
      }
    }

    // キャッシュに保存
    setCachedTemplates(validTemplates)

    console.log(`[assetSite] ${validTemplates.length}件のテンプレートを外部サイトから取得しました`)
    return validTemplates
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

/**
 * テンプレートの詳細データを取得（schemaUrl, viewsUrl, sampleDataUrl）
 */
export async function fetchTemplateDetails(
  template: AssetSiteTemplate
): Promise<{
  schema?: any
  views?: any
  sampleData?: any
}> {
  const results: {
    schema?: any
    views?: any
    sampleData?: any
  } = {}

  // スキーマを取得
  if (template.schemaUrl) {
    try {
      const schemaResponse = await fetchWithRetry(template.schemaUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      })
      if (schemaResponse.ok) {
        results.schema = await schemaResponse.json()
        console.log(`[assetSite] スキーマを取得しました: ${template.schemaUrl}`)
      }
    } catch (error: any) {
      console.warn(`[assetSite] スキーマ取得エラー (${template.schemaUrl}):`, error?.message || error)
      console.warn('[assetSite] CORSエラーの可能性があります。基本情報のみでインストールを続行します。')
    }
  }

  // ビュー定義を取得
  if (template.viewsUrl) {
    try {
      const viewsResponse = await fetchWithRetry(template.viewsUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      })
      if (viewsResponse.ok) {
        results.views = await viewsResponse.json()
        console.log(`[assetSite] ビュー定義を取得しました: ${template.viewsUrl}`)
      }
    } catch (error: any) {
      console.warn(`[assetSite] ビュー定義取得エラー (${template.viewsUrl}):`, error?.message || error)
      console.warn('[assetSite] CORSエラーの可能性があります。デフォルトのUI構造を使用します。')
    }
  }

  // サンプルデータを取得
  if (template.sampleDataUrl) {
    try {
      const sampleDataResponse = await fetchWithRetry(template.sampleDataUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      })
      if (sampleDataResponse.ok) {
        results.sampleData = await sampleDataResponse.json()
        console.log(`[assetSite] サンプルデータを取得しました: ${template.sampleDataUrl}`)
      }
    } catch (error: any) {
      console.warn(`[assetSite] サンプルデータ取得エラー (${template.sampleDataUrl}):`, error?.message || error)
      console.warn('[assetSite] CORSエラーの可能性があります。サンプルデータなしでインストールを続行します。')
    }
  }

  // 詳細データが取得できなかった場合でも、基本情報のみでインストール可能にする
  console.log(`[assetSite] テンプレート詳細取得完了: schema=${!!results.schema}, views=${!!results.views}, sampleData=${!!results.sampleData}`)
  return results
}
