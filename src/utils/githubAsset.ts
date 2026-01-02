// GitHubリポジトリからアセット（テンプレート・プラグイン）を取得するユーティリティ

const GITHUB_REPO = 'tsubasagit/AppNavi-asset'
const GITHUB_API_BASE = 'https://api.github.com/repos'

export interface GitHubAsset {
  name: string
  path: string
  type: 'file' | 'dir'
  download_url?: string
  sha: string
}

export interface AssetMetadata {
  id: string
  name: string
  description: string
  version: string
  author: string
  category: string
  type: 'template' | 'plugin'
  githubPath: string
  downloadUrl: string
}

/**
 * GitHubリポジトリのディレクトリ内容を取得
 */
export const fetchGitHubDirectory = async (path: string = ''): Promise<GitHubAsset[]> => {
  try {
    const url = `${GITHUB_API_BASE}/${GITHUB_REPO}/contents/${path}`
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`)
    }
    
    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Error fetching GitHub directory:', error)
    throw error
  }
}

/**
 * テンプレート一覧を取得
 */
export const fetchTemplates = async (): Promise<AssetMetadata[]> => {
  try {
    const templatesDir = await fetchGitHubDirectory('templates')
    const templates: AssetMetadata[] = []
    
    for (const item of templatesDir) {
      if (item.type === 'dir') {
        try {
          // 各テンプレートディレクトリ内のmetadata.jsonを取得
          const metadataUrl = `${GITHUB_API_BASE}/${GITHUB_REPO}/contents/${item.path}/metadata.json`
          const metadataResponse = await fetch(metadataUrl)
          
          if (metadataResponse.ok) {
            const metadataData = await metadataResponse.json()
            const content = atob(metadataData.content)
            const metadata = JSON.parse(content)
            
            templates.push({
              id: item.name,
              name: metadata.name || item.name,
              description: metadata.description || '',
              version: metadata.version || '1.0.0',
              author: metadata.author || 'Unknown',
              category: metadata.category || 'other',
              type: 'template',
              githubPath: item.path,
              downloadUrl: metadataData.download_url || '',
            })
          }
        } catch (error) {
          console.warn(`Failed to load metadata for template ${item.name}:`, error)
        }
      }
    }
    
    return templates
  } catch (error) {
    console.error('Error fetching templates:', error)
    return []
  }
}

/**
 * プラグイン一覧を取得
 */
export const fetchPlugins = async (): Promise<AssetMetadata[]> => {
  try {
    const pluginsDir = await fetchGitHubDirectory('plugins')
    const plugins: AssetMetadata[] = []
    
    for (const item of pluginsDir) {
      if (item.type === 'dir') {
        try {
          // 各プラグインディレクトリ内のmetadata.jsonを取得
          const metadataUrl = `${GITHUB_API_BASE}/${GITHUB_REPO}/contents/${item.path}/metadata.json`
          const metadataResponse = await fetch(metadataUrl)
          
          if (metadataResponse.ok) {
            const metadataData = await metadataResponse.json()
            const content = atob(metadataData.content)
            const metadata = JSON.parse(content)
            
            plugins.push({
              id: item.name,
              name: metadata.name || item.name,
              description: metadata.description || '',
              version: metadata.version || '1.0.0',
              author: metadata.author || 'Unknown',
              category: metadata.category || 'other',
              type: 'plugin',
              githubPath: item.path,
              downloadUrl: metadataData.download_url || '',
            })
          }
        } catch (error) {
          console.warn(`Failed to load metadata for plugin ${item.name}:`, error)
        }
      }
    }
    
    return plugins
  } catch (error) {
    console.error('Error fetching plugins:', error)
    return []
  }
}

/**
 * アセットをインストール（ダウンロード）
 */
export const installAsset = async (asset: AssetMetadata): Promise<void> => {
  try {
    // 実際のインストール処理は、アセットのタイプに応じて実装
    // ここでは、メタデータを取得してローカルストレージやFirestoreに保存する想定
    console.log('Installing asset:', asset)
    
    // TODO: 実際のインストール処理を実装
    // - テンプレートの場合: templates.tsに追加
    // - プラグインの場合: プラグインレジストリに追加
    
    alert(`${asset.name} をインストールしました。`)
  } catch (error) {
    console.error('Error installing asset:', error)
    throw error
  }
}

/**
 * アセットをアップロード（GitHubにプッシュ）
 * 注意: 実際の実装では、GitHub APIの認証が必要です
 */
export const uploadAsset = async (
  assetType: 'template' | 'plugin',
  assetData: {
    name: string
    description: string
    version: string
    author: string
    category: string
    files: { path: string; content: string }[]
  }
): Promise<void> => {
  try {
    // 実際のアップロード処理は、GitHub APIの認証が必要
    // ここでは、プレースホルダーとして実装
    console.log('Uploading asset:', assetType, assetData)
    
    // TODO: GitHub APIを使用してアセットをアップロード
    // - GitHub Personal Access Tokenが必要
    // - GitHub API v3またはv4を使用
    
    alert(`${assetData.name} のアップロード機能は開発中です。GitHubリポジトリに直接プッシュしてください。`)
  } catch (error) {
    console.error('Error uploading asset:', error)
    throw error
  }
}


