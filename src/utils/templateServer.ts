/**
 * テンプレートサーバーからテンプレートを取得するユーティリティ
 */

// テンプレートサーバーのURL（環境変数または設定ファイルから取得可能）
const TEMPLATE_SERVER_URL = import.meta.env.VITE_TEMPLATE_SERVER_URL || 'https://templates.appnavi.com'

export interface TemplateServerTemplate {
  templateId: string
  name: string
  description: string
  category: string
  color: 'purple' | 'orange' | 'green' | 'blue' | 'slate'
  previewImageUrl?: string
  demoUrl?: string
  version: string
  isPublic: boolean
  tags: string[]
  author: string
  features?: string[]
}

export interface TemplateServerResponse {
  templates: TemplateServerTemplate[]
}

/**
 * テンプレートサーバーからすべてのテンプレートを取得
 */
export async function fetchTemplatesFromServer(
  serverUrl: string = TEMPLATE_SERVER_URL
): Promise<TemplateServerTemplate[]> {
  try {
    const response = await fetch(`${serverUrl}/api/templates.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: TemplateServerResponse = await response.json()
    return data.templates || []
  } catch (error) {
    console.error('テンプレートサーバーからの取得エラー:', error)
    throw error
  }
}

/**
 * テンプレートサーバーから特定のテンプレートを取得
 */
export async function fetchTemplateFromServer(
  templateId: string,
  serverUrl: string = TEMPLATE_SERVER_URL
): Promise<TemplateServerTemplate | null> {
  try {
    const templates = await fetchTemplatesFromServer(serverUrl)
    return templates.find(t => t.templateId === templateId) || null
  } catch (error) {
    console.error(`テンプレート "${templateId}" の取得エラー:`, error)
    return null
  }
}

/**
 * テンプレートサーバーのURLを取得
 */
export function getTemplateServerUrl(): string {
  return TEMPLATE_SERVER_URL
}


