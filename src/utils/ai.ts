/**
 * AI機能（Gemini API）の統合
 */

export interface AISuggestion {
  template?: string
  uiConfig?: {
    layoutType: 'list' | 'card' | 'calendar'
    components: string[]
  }
  dataStructure?: {
    requiredColumns: Array<{
      name: string
      type: 'string' | 'number' | 'date' | 'boolean'
      description: string
    }>
  }
  charts?: Array<{
    type: 'bar' | 'line' | 'pie' | 'table'
    title: string
    description: string
  }>
}

/**
 * 方針データからAI提案を生成
 * @param policyData 方針データ（現状の課題、解決策、KPIなど）
 * @returns AI提案
 */
export const generateAISuggestion = async (policyData: {
  appName: string
  description: string
  currentIssue: string
  solution: string
  kpi: string
}): Promise<AISuggestion> => {
  // 環境変数からAPIキーを取得
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  
  if (!apiKey) {
    // APIキーがない場合は、ルールベースの提案を返す
    return generateRuleBasedSuggestion(policyData)
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `あなたは業務アプリケーションの設計アシスタントです。以下の情報を基に、最適なアプリ設計を提案してください。

アプリ名: ${policyData.appName}
概要: ${policyData.description}
現状の課題: ${policyData.currentIssue}
解決策: ${policyData.solution}
成果指標（KPI）: ${policyData.kpi}

以下のJSON形式で回答してください:
{
  "template": "テンプレートID（crm, inventory, daily-report, reservation, custom のいずれか）",
  "uiConfig": {
    "layoutType": "list | card | calendar",
    "components": ["コンポーネント名の配列"]
  },
  "dataStructure": {
    "requiredColumns": [
      {
        "name": "カラム名",
        "type": "string | number | date | boolean",
        "description": "カラムの説明"
      }
    ]
  },
  "charts": [
    {
      "type": "bar | line | pie | table",
      "title": "グラフのタイトル",
      "description": "グラフの説明"
    }
  ]
}`
            }]
          }]
        })
      }
    )

    if (!response.ok) {
      throw new Error(`AI API エラー: ${response.statusText}`)
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    
    // JSONを抽出（コードブロック内のJSONを探す）
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/) || [null, text]
    const jsonText = jsonMatch[1] || text
    
    try {
      const suggestion = JSON.parse(jsonText) as AISuggestion
      return suggestion
    } catch (parseError) {
      console.error('JSON解析エラー:', parseError, 'テキスト:', jsonText)
      // パースに失敗した場合はルールベースの提案を返す
      return generateRuleBasedSuggestion(policyData)
    }
  } catch (error) {
    console.error('AI API エラー:', error)
    // エラーが発生した場合はルールベースの提案を返す
    return generateRuleBasedSuggestion(policyData)
  }
}

/**
 * ルールベースの提案を生成（APIキーがない場合やエラー時のフォールバック）
 */
const generateRuleBasedSuggestion = (policyData: {
  appName: string
  description: string
  currentIssue: string
  solution: string
  kpi: string
}): AISuggestion => {
  const lowerDescription = policyData.description.toLowerCase()
  const lowerIssue = policyData.currentIssue.toLowerCase()
  const lowerSolution = policyData.solution.toLowerCase()

  // キーワードベースでテンプレートを推奨
  let template = 'custom'
  if (lowerDescription.includes('顧客') || lowerDescription.includes('crm') || lowerIssue.includes('顧客')) {
    template = 'crm'
  } else if (lowerDescription.includes('在庫') || lowerIssue.includes('在庫')) {
    template = 'inventory'
  } else if (lowerDescription.includes('日報') || lowerDescription.includes('報告') || lowerIssue.includes('日報')) {
    template = 'daily-report'
  } else if (lowerDescription.includes('予約') || lowerIssue.includes('予約')) {
    template = 'reservation'
  }

  // データ構造の推奨
  const requiredColumns: AISuggestion['dataStructure'] = {
    requiredColumns: []
  }

  // KPIから必要なカラムを推測
  if (policyData.kpi.includes('数') || policyData.kpi.includes('件')) {
    requiredColumns.requiredColumns.push({
      name: '数量',
      type: 'number',
      description: '数量を記録'
    })
  }
  if (policyData.kpi.includes('日') || policyData.kpi.includes('期間')) {
    requiredColumns.requiredColumns.push({
      name: '日付',
      type: 'date',
      description: '日付を記録'
    })
  }

  return {
    template,
    uiConfig: {
      layoutType: 'list',
      components: ['table', 'search', 'form']
    },
    dataStructure: requiredColumns,
    charts: [
      {
        type: 'bar',
        title: 'KPI推移',
        description: policyData.kpi + 'の推移を表示'
      }
    ]
  }
}

/**
 * テンプレート選択時の自動UI生成提案
 */
export const suggestUIFromTemplate = async (templateId: string): Promise<AISuggestion['uiConfig']> => {
  // テンプレートに応じたデフォルトUI設定を返す
  const templateUIConfigs: Record<string, AISuggestion['uiConfig']> = {
    'crm': {
      layoutType: 'list',
      components: ['table', 'search', 'form', 'stats']
    },
    'inventory': {
      layoutType: 'list',
      components: ['table', 'search', 'form', 'stats']
    },
    'daily-report': {
      layoutType: 'card',
      components: ['form', 'calendar', 'table']
    },
    'reservation': {
      layoutType: 'calendar',
      components: ['calendar', 'form', 'table']
    },
    'custom': {
      layoutType: 'list',
      components: ['table', 'form']
    }
  }

  return templateUIConfigs[templateId] || templateUIConfigs['custom']
}



