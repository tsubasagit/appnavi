/**
 * 強化版CRMテンプレートを作成するスクリプト
 * 地方の中小企業経営者向けに、月1000円の価値を提供する機能を追加
 * 実行方法: npx tsx scripts/createEnhancedCRMTemplate.ts
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'
import { readFileSync } from 'fs'
import { resolve, dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

function loadEnv() {
  try {
    const envPath = resolve(__dirname, '../.env.local')
    const envFile = readFileSync(envPath, 'utf-8')
    const envVars: Record<string, string> = {}
    
    envFile.split('\n').forEach(line => {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=')
        if (key && valueParts.length > 0) {
          envVars[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '')
        }
      }
    })
    
    return envVars
  } catch (error: any) {
    return {}
  }
}

const env = loadEnv()
const projectId = env.VITE_FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID

if (!projectId) {
  console.error('[Firebase設定] プロジェクトIDが設定されていません')
  process.exit(1)
}

function initializeFirebaseAdmin() {
  try {
    if (getApps().length === 0) {
      const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || 
        join(__dirname, '../serviceAccountKey.json')
      
      try {
        const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'))
        initializeApp({
          credential: cert(serviceAccount),
          projectId: projectId
        })
        console.log('[Firebase Admin] サービスアカウントキーから初期化しました')
      } catch (error: any) {
        initializeApp({
          projectId: projectId
        })
        console.log(`[Firebase Admin] Application Default Credentialsで初期化しました`)
      }
    }
    return getFirestore()
  } catch (error: any) {
    console.error('[Firebase Admin] 初期化エラー:', error.message)
    throw error
  }
}

function removeUndefinedFields<T extends Record<string, any>>(obj: T): T {
  const cleaned: any = {}
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value) && !(value instanceof Timestamp)) {
        cleaned[key] = removeUndefinedFields(value)
      } else {
        cleaned[key] = value
      }
    }
  }
  return cleaned as T
}

async function createEnhancedCRMTemplate() {
  try {
    console.log('[Firebase Admin] Firebase Admin SDKを初期化中...')
    const db = initializeFirebaseAdmin()
    console.log('[Firebase Admin] 初期化が完了しました')

    console.log('強化版CRMテンプレートを作成中...')

    // 強化版CRMテンプレート
    const crmTemplateId = 'crm'
    const crmTemplateData = {
      templateId: 'crm',
      name: '顧客管理（CRM）',
      description: '顧客情報、商談管理、活動履歴を一元管理。売上分析・レポート機能付き',
      category: '営業・マーケティング',
      color: '#8b5cf6',
      previewImageUrl: 'https://tsubasagit.github.io/AppNavi-asset/templates/crm/preview.png',
      isPublic: true,
      isDefault: true,
      tags: ['営業', '顧客管理', '商談', 'CRM', '売上分析', 'レポート'],
      version: '2.0.0',
      assetId: 'crm',
      vendorId: 'appnavi',
      isCustomized: false,
      uiStructure: {
        theme: {
          primaryColor: '#8b5cf6',
          secondaryColor: '#a78bfa',
          darkMode: true,
        },
        pages: [
          {
            id: 'dashboard',
            name: 'ダッシュボード',
            path: '/',
            layout: {
              type: 'grid',
              columns: 12,
              gap: '1rem',
            },
            components: [
              {
                id: 'c_kpi_1',
                type: 'kpi_grid',
                position: { x: 0, y: 0, width: 12, height: 2 },
                props: {
                  kpis: [
                    { label: '総顧客数', value: '0', icon: 'Users' },
                    { label: '今月の売上', value: '¥0', icon: 'Briefcase' },
                    { label: '前月比', value: '+0%', icon: 'TrendingUp' },
                    { label: '進行中商談', value: '0', icon: 'Target' },
                    { label: '今月の成約数', value: '0', icon: 'CheckCircle2' },
                    { label: 'アクション待ち', value: '0', icon: 'AlertCircle' },
                  ],
                },
                order: 0,
              },
              {
                id: 'c_chart_1',
                type: 'chart',
                position: { x: 0, y: 2, width: 6, height: 4 },
                props: {
                  title: '月次売上推移',
                  type: 'line',
                  xAxis: 'month',
                  yAxis: 'amount',
                },
                order: 1,
              },
              {
                id: 'c_chart_2',
                type: 'chart',
                position: { x: 6, y: 2, width: 6, height: 4 },
                props: {
                  title: '商談ステージ別分布',
                  type: 'pie',
                  groupBy: 'stage',
                },
                order: 2,
              },
              {
                id: 'c_table_1',
                type: 'table',
                position: { x: 0, y: 6, width: 12, height: 6 },
                props: {
                  title: '重要顧客一覧（売上順）',
                  columns: [
                    { key: 'name', label: '顧客名', sortable: true },
                    { key: 'company', label: '会社名', sortable: true },
                    { key: 'totalSales', label: '累計売上', sortable: true },
                    { key: 'lastOrderDate', label: '最終注文日', sortable: true },
                    { key: 'status', label: 'ステータス', sortable: true },
                    { key: 'priority', label: '優先度', sortable: true },
                  ],
                  searchable: true,
                  pagination: true,
                },
                order: 3,
              },
            ],
            order: 0,
          },
          {
            id: 'customers',
            name: '顧客管理',
            path: '/customers',
            layout: {
              type: 'grid',
              columns: 12,
              gap: '1rem',
            },
            components: [
              {
                id: 'c_search_1',
                type: 'search',
                position: { x: 0, y: 0, width: 12, height: 1 },
                props: {
                  placeholder: '顧客名、会社名、メールアドレスで検索...',
                },
                order: 0,
              },
              {
                id: 'c_table_2',
                type: 'table',
                position: { x: 0, y: 1, width: 12, height: 8 },
                props: {
                  title: '顧客一覧',
                  columns: [
                    { key: 'name', label: '顧客名', sortable: true },
                    { key: 'company', label: '会社名', sortable: true },
                    { key: 'email', label: 'メールアドレス' },
                    { key: 'phone', label: '電話番号' },
                    { key: 'status', label: 'ステータス', sortable: true },
                    { key: 'priority', label: '優先度', sortable: true },
                    { key: 'totalSales', label: '累計売上', sortable: true },
                    { key: 'lastContact', label: '最終連絡日', sortable: true },
                    { key: 'nextFollowUp', label: '次回フォロー', sortable: true },
                  ],
                  searchable: true,
                  pagination: true,
                  filterable: true,
                },
                order: 1,
              },
            ],
            order: 1,
          },
          {
            id: 'deals',
            name: '商談管理',
            path: '/deals',
            layout: {
              type: 'grid',
              columns: 12,
              gap: '1rem',
            },
            components: [
              {
                id: 'c_kanban_1',
                type: 'kanban',
                position: { x: 0, y: 0, width: 12, height: 8 },
                props: {
                  title: '商談パイプライン',
                  columns: [
                    { id: 'prospecting', name: '見込み', color: '#94a3b8' },
                    { id: 'qualification', name: '選定', color: '#3b82f6' },
                    { id: 'proposal', name: '提案', color: '#8b5cf6' },
                    { id: 'negotiation', name: '交渉', color: '#f59e0b' },
                    { id: 'closed', name: '成約', color: '#10b981' },
                  ],
                },
                order: 0,
              },
            ],
            order: 2,
          },
          {
            id: 'sales',
            name: '売上分析',
            path: '/sales',
            layout: {
              type: 'grid',
              columns: 12,
              gap: '1rem',
            },
            components: [
              {
                id: 'c_chart_3',
                type: 'chart',
                position: { x: 0, y: 0, width: 12, height: 4 },
                props: {
                  title: '月次売上推移（過去12ヶ月）',
                  type: 'line',
                  xAxis: 'month',
                  yAxis: 'amount',
                },
                order: 0,
              },
              {
                id: 'c_chart_4',
                type: 'chart',
                position: { x: 0, y: 4, width: 6, height: 4 },
                props: {
                  title: '顧客別売上ランキング（TOP10）',
                  type: 'bar',
                  xAxis: 'customer',
                  yAxis: 'amount',
                },
                order: 1,
              },
              {
                id: 'c_chart_5',
                type: 'chart',
                position: { x: 6, y: 4, width: 6, height: 4 },
                props: {
                  title: '商品・サービス別売上',
                  type: 'pie',
                  groupBy: 'product',
                },
                order: 2,
              },
              {
                id: 'c_table_3',
                type: 'table',
                position: { x: 0, y: 8, width: 12, height: 4 },
                props: {
                  title: '月次売上サマリー',
                  columns: [
                    { key: 'month', label: '月', sortable: true },
                    { key: 'amount', label: '売上', sortable: true },
                    { key: 'count', label: '件数', sortable: true },
                    { key: 'average', label: '平均単価', sortable: true },
                    { key: 'growth', label: '前月比', sortable: true },
                  ],
                  searchable: false,
                  pagination: true,
                },
                order: 3,
              },
            ],
            order: 3,
          },
          {
            id: 'tasks',
            name: 'タスク・フォローアップ',
            path: '/tasks',
            layout: {
              type: 'list',
              gap: '0.5rem',
            },
            components: [
              {
                id: 'c_table_4',
                type: 'table',
                position: { x: 0, y: 0, width: 12, height: 8 },
                props: {
                  title: 'フォローアップタスク',
                  columns: [
                    { key: 'customer', label: '顧客名', sortable: true },
                    { key: 'task', label: 'タスク内容', sortable: true },
                    { key: 'dueDate', label: '期限', sortable: true },
                    { key: 'priority', label: '優先度', sortable: true },
                    { key: 'status', label: 'ステータス', sortable: true },
                  ],
                  searchable: true,
                  pagination: true,
                  filterable: true,
                },
                order: 0,
              },
            ],
            order: 4,
          },
          {
            id: 'activities',
            name: '活動履歴',
            path: '/activities',
            layout: {
              type: 'list',
              gap: '0.5rem',
            },
            components: [
              {
                id: 'c_timeline_1',
                type: 'list',
                position: { x: 0, y: 0, width: 12, height: 8 },
                props: {
                  title: '活動履歴タイムライン',
                  showDate: true,
                  showTime: true,
                  groupBy: 'date',
                },
                order: 0,
              },
            ],
            order: 5,
          },
        ],
        dashboard: {
          kpiCards: [
            { id: 'kpi_1', label: '総顧客数', value: '0', icon: 'Users' },
            { id: 'kpi_2', label: '今月の売上', value: '¥0', icon: 'Briefcase' },
            { id: 'kpi_3', label: '前月比', value: '+0%', icon: 'TrendingUp' },
            { id: 'kpi_4', label: '進行中商談', value: '0', icon: 'Target' },
            { id: 'kpi_5', label: '今月の成約数', value: '0', icon: 'CheckCircle2' },
            { id: 'kpi_6', label: 'アクション待ち', value: '0', icon: 'AlertCircle' },
          ],
          charts: [
            {
              id: 'chart_1',
              type: 'line',
              title: '月次売上推移',
              dataSource: 'sales',
              xAxis: 'month',
              yAxis: 'amount',
            },
            {
              id: 'chart_2',
              type: 'pie',
              title: '商談ステージ別分布',
              dataSource: 'deals',
              groupBy: 'stage',
            },
          ],
          layout: 'grid',
        },
      },
      recommendedSchema: {
        customers: {
          name: { type: 'string', required: true, label: '顧客名' },
          company: { type: 'string', required: false, label: '会社名' },
          email: { type: 'string', required: true, label: 'メールアドレス' },
          phone: { type: 'string', required: false, label: '電話番号' },
          address: { type: 'string', required: false, label: '住所' },
          status: { type: 'string', required: true, label: 'ステータス', options: ['active', 'inactive', 'prospect', 'lost'] },
          priority: { type: 'string', required: false, label: '優先度', options: ['high', 'medium', 'low'] },
          totalSales: { type: 'number', required: false, label: '累計売上' },
          lastOrderDate: { type: 'date', required: false, label: '最終注文日' },
          lastContact: { type: 'date', required: false, label: '最終連絡日' },
          nextFollowUp: { type: 'date', required: false, label: '次回フォロー予定日' },
          notes: { type: 'string', required: false, label: '備考' },
          createdAt: { type: 'date', required: true, label: '作成日' },
          updatedAt: { type: 'date', required: true, label: '更新日' },
        },
        deals: {
          customerId: { type: 'string', required: true, label: '顧客ID' },
          title: { type: 'string', required: true, label: '商談名' },
          amount: { type: 'number', required: false, label: '金額' },
          stage: { type: 'string', required: true, label: 'ステージ', options: ['prospecting', 'qualification', 'proposal', 'negotiation', 'closed', 'lost'] },
          probability: { type: 'number', required: false, label: '確度（%）' },
          expectedCloseDate: { type: 'date', required: false, label: '予定成約日' },
          actualCloseDate: { type: 'date', required: false, label: '実際の成約日' },
          product: { type: 'string', required: false, label: '商品・サービス' },
          createdAt: { type: 'date', required: true, label: '作成日' },
          updatedAt: { type: 'date', required: true, label: '更新日' },
        },
        sales: {
          customerId: { type: 'string', required: true, label: '顧客ID' },
          dealId: { type: 'string', required: false, label: '商談ID' },
          amount: { type: 'number', required: true, label: '金額' },
          date: { type: 'date', required: true, label: '売上日' },
          product: { type: 'string', required: false, label: '商品・サービス' },
          paymentMethod: { type: 'string', required: false, label: '支払方法', options: ['cash', 'transfer', 'credit', 'other'] },
          createdAt: { type: 'date', required: true, label: '作成日' },
        },
        activities: {
          customerId: { type: 'string', required: true, label: '顧客ID' },
          dealId: { type: 'string', required: false, label: '商談ID' },
          type: { type: 'string', required: true, label: '活動種別', options: ['call', 'meeting', 'email', 'note', 'visit'] },
          title: { type: 'string', required: true, label: 'タイトル' },
          description: { type: 'string', required: false, label: '説明' },
          date: { type: 'date', required: true, label: '日時' },
          createdAt: { type: 'date', required: true, label: '作成日' },
        },
        tasks: {
          customerId: { type: 'string', required: true, label: '顧客ID' },
          dealId: { type: 'string', required: false, label: '商談ID' },
          task: { type: 'string', required: true, label: 'タスク内容' },
          dueDate: { type: 'date', required: true, label: '期限' },
          priority: { type: 'string', required: false, label: '優先度', options: ['high', 'medium', 'low'] },
          status: { type: 'string', required: true, label: 'ステータス', options: ['pending', 'in_progress', 'completed', 'cancelled'] },
          completedAt: { type: 'date', required: false, label: '完了日' },
          createdAt: { type: 'date', required: true, label: '作成日' },
        },
      },
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }

    const cleanedCrmData = removeUndefinedFields(crmTemplateData)
    const crmTemplateRef = db.collection('templates').doc(crmTemplateId)
    console.log(`[Firestore] テンプレート "${crmTemplateId}" を保存中...`)
    await crmTemplateRef.set(cleanedCrmData)
    console.log(`✓ 強化版テンプレート "${crmTemplateId}" を作成しました`)
    console.log(`  ページ数: ${cleanedCrmData.uiStructure.pages.length}ページ`)
    console.log(`  - ダッシュボード（売上分析付き）`)
    console.log(`  - 顧客管理（優先度・フォローアップ管理）`)
    console.log(`  - 商談管理（カンバン）`)
    console.log(`  - 売上分析（グラフ・レポート）`)
    console.log(`  - タスク・フォローアップ管理`)
    console.log(`  - 活動履歴`)

    process.exit(0)
  } catch (error: any) {
    console.error('\n[エラー] テンプレート作成中にエラーが発生しました:')
    console.error('エラータイプ:', error?.name || 'Unknown')
    console.error('エラーメッセージ:', error?.message || String(error))
    if (error?.stack) {
      console.error('\nスタックトレース:')
      console.error(error.stack)
    }
    process.exit(1)
  }
}

createEnhancedCRMTemplate()
