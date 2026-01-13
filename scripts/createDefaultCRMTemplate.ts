/**
 * デフォルトのテンプレート（CRM、ブランクページ）をFirebaseに作成するスクリプト
 * 実行方法: npx tsx scripts/createDefaultCRMTemplate.ts
 * 
 * 注意: このスクリプトはFirebase Admin SDKを使用します。
 * サービスアカウントキーが必要な場合があります。
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'
import { readFileSync } from 'fs'
import { resolve, dirname, join } from 'path'
import { fileURLToPath } from 'url'

// ESMモジュール対応: __dirnameの代替
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 環境変数を読み込む（.env.localから直接読み込む）
function loadEnv() {
  try {
    const envPath = resolve(__dirname, '../.env.local')
    console.log(`[環境変数] .env.localファイルを読み込み中: ${envPath}`)
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
    
    console.log(`[環境変数] ${Object.keys(envVars).length}個の環境変数を読み込みました`)
    return envVars
  } catch (error: any) {
    console.error(`[環境変数] .env.localファイルの読み込みエラー:`, error.message)
    console.warn('[環境変数] process.envから環境変数を取得します')
    return {}
  }
}

const env = loadEnv()

// FirebaseプロジェクトIDを取得（優先順位: .env.local > process.env）
const projectId = env.VITE_FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID

if (!projectId) {
  console.error('[Firebase設定] プロジェクトIDが設定されていません')
  console.error('[Firebase設定] .env.localファイルに以下の環境変数を設定してください:')
  console.error('  VITE_FIREBASE_PROJECT_ID=your-project-id')
  process.exit(1)
}

// Firebase Admin SDKの初期化
function initializeFirebaseAdmin() {
  try {
    // 既に初期化されている場合は使用
    if (getApps().length === 0) {
      // サービスアカウントキーファイルのパス（環境変数から取得、またはデフォルトパス）
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
        // サービスアカウントキーが見つからない場合は、Application Default Credentialsを使用
        console.log('[Firebase Admin] サービスアカウントキーが見つかりません。Application Default Credentialsを使用します。')
        console.log('[Firebase Admin] ヒント: GOOGLE_APPLICATION_CREDENTIALS環境変数を設定するか、gcloud auth application-default loginを実行してください。')
        initializeApp({
          projectId: projectId
        })
        console.log(`[Firebase Admin] Application Default Credentialsで初期化しました（プロジェクトID: ${projectId}）`)
      }
    }
    return getFirestore()
  } catch (error: any) {
    console.error('[Firebase Admin] 初期化エラー:', error.message)
    throw error
  }
}

// undefinedフィールドを削除するヘルパー関数
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

async function createDefaultTemplates() {
  try {
    // Firebase Admin SDKを初期化
    console.log('[Firebase Admin] Firebase Admin SDKを初期化中...')
    const db = initializeFirebaseAdmin()
    console.log('[Firebase Admin] 初期化が完了しました')

    console.log('デフォルトテンプレートを作成中...')

    // 1. CRMテンプレート
    const crmTemplateId = 'crm'
    const crmTemplateData = {
      templateId: 'crm',
      name: '顧客管理（CRM）',
      description: '顧客情報、商談管理、活動履歴を一元管理',
      category: '営業・マーケティング',
      color: '#8b5cf6', // purple
      previewImageUrl: 'https://tsubasagit.github.io/AppNavi-asset/templates/crm/preview.png',
      isPublic: true,
      isDefault: true, // 全ユーザーが初期でインストール済み
      tags: ['営業', '顧客管理', '商談', 'CRM'],
      version: '1.0.0',
      // 外部インストール関連フィールド
      assetId: 'crm', // appnavi-asset.com上のID（デフォルトテンプレートも外部サイトからインストールされたものとして扱う）
      vendorId: 'appnavi', // 公式テンプレート
      isCustomized: false, // 初期状態では未編集
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
                    { label: '進行中商談', value: '0', icon: 'TrendingUp' },
                    { label: '今月の売上', value: '¥0', icon: 'Briefcase' },
                    { label: 'アクション待ち', value: '0', icon: 'AlertCircle' },
                  ],
                },
                order: 0,
              },
              {
                id: 'c_table_1',
                type: 'table',
                position: { x: 0, y: 2, width: 12, height: 6 },
                props: {
                  title: '顧客一覧',
                  columns: [
                    { key: 'name', label: '顧客名', sortable: true },
                    { key: 'company', label: '会社名', sortable: true },
                    { key: 'email', label: 'メールアドレス' },
                    { key: 'phone', label: '電話番号' },
                    { key: 'status', label: 'ステータス', sortable: true },
                    { key: 'lastContact', label: '最終連絡日', sortable: true },
                  ],
                  searchable: true,
                  pagination: true,
                },
                order: 1,
              },
            ],
            order: 0,
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
            order: 1,
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
                },
                order: 0,
              },
            ],
            order: 2,
          },
        ],
        dashboard: {
          kpiCards: [
            { id: 'kpi_1', label: '総顧客数', value: '0', icon: 'Users' },
            { id: 'kpi_2', label: '進行中商談', value: '0', icon: 'TrendingUp' },
            { id: 'kpi_3', label: '今月の売上', value: '¥0', icon: 'Briefcase' },
            { id: 'kpi_4', label: 'アクション待ち', value: '0', icon: 'AlertCircle' },
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
          status: { type: 'string', required: true, label: 'ステータス', options: ['active', 'inactive', 'prospect'] },
          createdAt: { type: 'date', required: true, label: '作成日' },
          updatedAt: { type: 'date', required: true, label: '更新日' },
        },
        deals: {
          customerId: { type: 'string', required: true, label: '顧客ID' },
          title: { type: 'string', required: true, label: '商談名' },
          amount: { type: 'number', required: false, label: '金額' },
          stage: { type: 'string', required: true, label: 'ステージ', options: ['prospecting', 'qualification', 'proposal', 'negotiation', 'closed'] },
          probability: { type: 'number', required: false, label: '確度（%）' },
          expectedCloseDate: { type: 'date', required: false, label: '予定成約日' },
          createdAt: { type: 'date', required: true, label: '作成日' },
          updatedAt: { type: 'date', required: true, label: '更新日' },
        },
        activities: {
          customerId: { type: 'string', required: true, label: '顧客ID' },
          dealId: { type: 'string', required: false, label: '商談ID' },
          type: { type: 'string', required: true, label: '活動種別', options: ['call', 'meeting', 'email', 'note'] },
          title: { type: 'string', required: true, label: 'タイトル' },
          description: { type: 'string', required: false, label: '説明' },
          date: { type: 'date', required: true, label: '日時' },
          createdAt: { type: 'date', required: true, label: '作成日' },
        },
      },
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }

    // 2. ブランクページテンプレート
    const blankPageTemplateId = 'blank-page'
    const blankPageTemplateData = {
      templateId: 'blank-page',
      name: 'ブランクページ',
      description: 'カスタマイズ可能な空のテンプレート。自由に設計を開始できます。',
      category: 'その他',
      color: '#64748b', // slate
      previewImageUrl: 'https://tsubasagit.github.io/AppNavi-asset/templates/blank-page/preview.png',
      isPublic: true,
      isDefault: true, // 全ユーザーが初期でインストール済み
      tags: ['カスタム', 'ブランク', '自由設計'],
      version: '1.0.0',
      // 外部インストール関連フィールド
      assetId: 'blank-page', // appnavi-asset.com上のID（デフォルトテンプレートも外部サイトからインストールされたものとして扱う）
      vendorId: 'appnavi', // 公式テンプレート
      isCustomized: false, // 初期状態では未編集
      uiStructure: {
        theme: {
          primaryColor: '#64748b',
          secondaryColor: '#94a3b8',
          darkMode: false,
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
            components: [],
            order: 0,
          },
        ],
        dashboard: {
          kpiCards: [],
          layout: 'grid',
        },
      },
      recommendedSchema: undefined,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }

    // Firestoreに保存（既存の場合は上書き）
    // undefinedフィールドを削除してから保存
    const cleanedCrmData = removeUndefinedFields(crmTemplateData)
    const crmTemplateRef = db.collection('templates').doc(crmTemplateId)
    console.log(`[Firestore] テンプレート "${crmTemplateId}" を保存中...`)
    await crmTemplateRef.set(cleanedCrmData)
    console.log(`✓ テンプレート "${crmTemplateId}" を作成しました`)

    const cleanedBlankPageData = removeUndefinedFields(blankPageTemplateData)
    const blankPageTemplateRef = db.collection('templates').doc(blankPageTemplateId)
    console.log(`[Firestore] テンプレート "${blankPageTemplateId}" を保存中...`)
    await blankPageTemplateRef.set(cleanedBlankPageData)
    console.log(`✓ テンプレート "${blankPageTemplateId}" を作成しました`)

    console.log('デフォルトテンプレートの作成が完了しました！')
    console.log(`- ${crmTemplateId}: ${crmTemplateData.name}`)
    console.log(`- ${blankPageTemplateId}: ${blankPageTemplateData.name}`)
    process.exit(0)
  } catch (error: any) {
    console.error('\n[エラー] テンプレート作成中にエラーが発生しました:')
    console.error('エラータイプ:', error?.name || 'Unknown')
    console.error('エラーメッセージ:', error?.message || String(error))
    if (error?.code) {
      console.error('エラーコード:', error.code)
    }
    if (error?.stack) {
      console.error('\nスタックトレース:')
      console.error(error.stack)
    }
    process.exit(1)
  }
}

createDefaultTemplates()
