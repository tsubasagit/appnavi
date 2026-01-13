/**
 * ブラウザコンソールから実行するCRMテンプレート更新スクリプト
 * 
 * 使用方法:
 * 1. AppNaviアプリケーションに管理者（admin）でログイン
 * 2. ブラウザの開発者ツール（F12）を開く
 * 3. コンソールタブでこのスクリプトをコピー＆ペーストして実行
 * 4. updateCRMTemplate() を実行
 */

async function updateCRMTemplate() {
  try {
    console.log('=== CRMテンプレート更新スクリプト開始 ===')
    
    // Firestoreインスタンスを取得
    let db = null
    
    // 方法1: window.__firestoreDbから取得
    if (window.__firestoreDb) {
      db = window.__firestoreDb
      console.log('[Firestore] window.__firestoreDbから取得しました')
    }
    
    // 方法2: モジュールから直接インポートを試みる
    if (!db) {
      try {
        const firestoreModule = await import('/src/utils/firestore.ts')
        if (firestoreModule.db) {
          db = firestoreModule.db
          console.log('[Firestore] /src/utils/firestore.tsから取得しました')
        }
      } catch (e) {
        console.error('[Firestore] モジュールインポート失敗:', e.message)
      }
    }
    
    if (!db) {
      throw new Error('Firestoreインスタンスを取得できませんでした。ページをリロードしてから再試行してください。')
    }
    
    // Firebase Firestoreの関数を取得
    let doc, setDoc, serverTimestamp
    
    // 方法1: window.__firebaseFirestoreから取得を試みる
    if (window.__firebaseFirestore) {
      doc = window.__firebaseFirestore.doc
      setDoc = window.__firebaseFirestore.setDoc
      serverTimestamp = window.__firebaseFirestore.serverTimestamp
      console.log('[Firestore] window.__firebaseFirestoreから関数を取得しました')
    } else {
      // 方法2: createTemplate関数を使用（フォールバック）
      try {
        const firestoreModule = await import('/src/utils/firestore.ts')
        const createTemplate = firestoreModule.createTemplate
        
        // createTemplate関数を使用してテンプレートを作成
        // updatedAtはcreateTemplate内で自動的に追加されるため削除
        const { updatedAt, ...templateDataWithoutTimestamp } = crmTemplateData
        
        await createTemplate('crm', templateDataWithoutTimestamp)
        
        console.log('✓ CRMテンプレートを更新しました！')
        console.log('✓ ページ数:', crmTemplateData.uiStructure.pages.length, 'ページ')
        console.log('✓ ページ一覧:', crmTemplateData.uiStructure.pages.map(p => `- ${p.name}`).join('\n'))
        console.log('=== CRMテンプレート更新完了 ===')
        
        return {
          success: true,
          message: 'CRMテンプレートを更新しました',
          pages: crmTemplateData.uiStructure.pages.map(p => p.name)
        }
      } catch (e) {
        console.error('[Firestore] モジュールインポート失敗:', e.message)
        throw new Error('Firestore関数を取得できませんでした。ページをリロードしてから再試行してください。')
      }
    }
    
    if (!doc || !setDoc) {
      throw new Error('Firestore関数（doc, setDoc）が見つかりませんでした。')
    }
    
    // CRMテンプレートデータ（3つのページを含む）
    // updatedAtはcreateTemplate内で自動的に追加されるため含めない
    const crmTemplateData = {
      templateId: 'crm',
      name: '顧客管理（CRM）',
      description: '顧客情報、商談管理、活動履歴を一元管理',
      category: '営業・マーケティング',
      color: '#8b5cf6',
      previewImageUrl: 'https://tsubasagit.github.io/AppNavi-asset/templates/crm/preview.png',
      isPublic: true,
      isDefault: true,
      tags: ['営業', '顧客管理', '商談', 'CRM'],
      version: '1.0.0',
      // 外部インストール関連フィールド
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
      updatedAt: serverTimestamp(),
    }
    
    // undefinedフィールドを削除するヘルパー関数
    const removeUndefinedFields = (obj) => {
      const cleaned = {}
      for (const [key, value] of Object.entries(obj)) {
        if (value !== undefined) {
          if (typeof value === 'object' && value !== null && !Array.isArray(value) && value.constructor !== Date && typeof value.toMillis !== 'function') {
            cleaned[key] = removeUndefinedFields(value)
          } else {
            cleaned[key] = value
          }
        }
      }
      return cleaned
    }
    
    // undefinedフィールドを削除
    const cleanedTemplateData = removeUndefinedFields(crmTemplateData)
    
    // Firestoreに保存
    const templateRef = doc(db, 'templates', 'crm')
    console.log('[Firestore] CRMテンプレートを保存中...')
    console.log('[Firestore] ページ数:', cleanedTemplateData.uiStructure.pages.length)
    console.log('[Firestore] ページ一覧:', cleanedTemplateData.uiStructure.pages.map(p => p.name))
    
    await setDoc(templateRef, cleanedTemplateData, { merge: true })
    
    console.log('✓ CRMテンプレートを更新しました！')
    console.log('✓ ページ数:', cleanedTemplateData.uiStructure.pages.length, 'ページ')
    console.log('✓ ページ一覧:', cleanedTemplateData.uiStructure.pages.map(p => `- ${p.name}`).join('\n'))
    console.log('=== CRMテンプレート更新完了 ===')
    
    return {
      success: true,
      message: 'CRMテンプレートを更新しました',
      pages: cleanedTemplateData.uiStructure.pages.map(p => p.name)
    }
  } catch (error) {
    console.error('❌ CRMテンプレート更新エラー:', error)
    console.error('エラー詳細:', {
      name: error?.name,
      message: error?.message,
      code: error?.code,
      stack: error?.stack
    })
    
    if (error?.code === 'permission-denied') {
      console.error('❌ 権限エラー: 管理者（admin）でログインしていることを確認してください。')
      console.error('❌ Firestoreのセキュリティルールで書き込みが拒否されました。')
    }
    
    return {
      success: false,
      error: error?.message || '不明なエラー',
      code: error?.code
    }
  }
}

// スクリプトを実行
console.log('CRMテンプレート更新スクリプトを読み込みました。')
console.log('実行するには: updateCRMTemplate()')
console.log('')
console.log('このスクリプトは、CRMテンプレートを3つのページ（ダッシュボード、商談管理、活動履歴）で更新します。')
