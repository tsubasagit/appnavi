import { 
  ClipboardList, 
  UserCheck, 
  Calendar, 
  RefreshCw
} from 'lucide-react'

// サンプルデータの型定義
export interface TemplateSampleData {
  headers: string[];
  rows: string[][];
}

// テンプレート型定義
export interface Template {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'slate';
  category: string;
  preview: string;
  author: string;
  requiredColumns?: RequiredColumn[];
  sampleData?: TemplateSampleData;
}

// 必要なカラム定義
export interface RequiredColumn {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  required: boolean;
  description: string;
}

// テンプレート定義（目的特化型）- 4つのテンプレートのみ
export const allTemplates: Template[] = [
  {
    id: 'crm',
    name: '顧客管理',
    description: '顧客情報、商談管理、活動履歴を一元管理',
    icon: UserCheck,
    color: 'purple',
    category: '営業・マーケティング',
    preview: '顧客一覧テーブル、商談パイプライン、活動履歴タイムライン、営業ダッシュボード（KPI表示）',
    author: 'AppTalentHub',
  },
  {
    id: 'google-calendar-group',
    name: 'Googleカレンダーのグループ化',
    description: '複数のGoogleカレンダーを統合し、グループ別に管理・表示',
    icon: Calendar,
    color: 'orange',
    category: 'スケジュール管理',
    preview: 'カレンダー統合表示、グループ別フィルター、イベント一覧、参加者管理、自動同期',
    author: 'AppTalentHub',
  },
  {
    id: 'daily-report',
    name: '日報チェック',
    description: '日々の業務活動の記録とチェック、自動連携',
    icon: ClipboardList,
    color: 'green',
    category: '業務管理',
    preview: '日報入力フォーム、活動一覧テーブル、カレンダー表示、チェック状況ダッシュボード、自動承認フロー',
    author: 'AppTalentHub',
  },
  {
    id: 'auto-integration',
    name: '自動連携',
    description: '各種サービスとの自動連携とデータ同期',
    icon: RefreshCw,
    color: 'blue',
    category: '連携・統合',
    preview: '連携設定画面、データ同期状況、連携ログ、エラー通知、自動更新ダッシュボード',
    author: 'AppTalentHub',
  },
]

// カテゴリごとにグループ化
export const templatesByCategory = allTemplates.reduce((acc, template) => {
  if (!acc[template.category]) {
    acc[template.category] = []
  }
  acc[template.category].push(template)
  return acc
}, {} as Record<string, Template[]>)

// テンプレートIDで検索
export const getTemplateById = (id: string): Template | undefined => {
  return allTemplates.find(t => t.id === id)
}

