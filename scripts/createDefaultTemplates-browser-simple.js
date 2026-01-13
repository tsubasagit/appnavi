/**
 * ブラウザコンソールから実行するデフォルトテンプレート作成スクリプト（簡易版）
 * 
 * 使用方法:
 * 1. AppNaviアプリケーションにログイン
 * 2. ブラウザの開発者ツール（F12）を開く
 * 3. コンソールタブでこのスクリプトをコピー＆ペーストして実行
 */

async function createDefaultTemplates() {
  try {
    // 既存のFirestoreインスタンスを取得（複数の方法を試す）
    let db = null
    
    // 方法1: window.__firestoreDbから取得
    if (window.__firestoreDb) {
      db = window.__firestoreDb
      console.log('[Firestore] window.__firestoreDbから取得しました')
    }
    
    // 方法2: モジュールから直接インポートを試みる
    if (!db) {
      try {
        // Viteの開発サーバーでは、モジュールを動的にインポートできる
        const firestoreModule = await import('/src/utils/firestore.ts')
        if (firestoreModule.db) {
          db = firestoreModule.db
          console.log('[Firestore] /src/utils/firestore.tsから取得しました')
        }
      } catch (e) {
        console.log('[Firestore] モジュールインポート失敗:', e.message)
      }
    }
    
    // 方法3: createTemplate関数を使用（推奨）
    if (!db) {
      try {
        const { createTemplate } = await import('/src/utils/firestore.ts')
        console.log('[Firestore] createTemplate関数を使用します')
        
        // 1. CRMテンプレート
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
                layout: { type: 'grid', columns: 12, gap: '1rem' },
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
                layout: { type: 'grid', columns: 12, gap: '1rem' },
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
                layout: { type: 'list', gap: '0.5rem' },
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
        }
        
        await createTemplate('crm', crmTemplateData)
        console.log(`✓ テンプレート "crm" を作成しました`)
        
        // 2. ブランクページテンプレート
        const blankPageTemplateData = {
          templateId: 'blank-page',
          name: 'ブランクページ',
          description: 'カスタマイズ可能な空のテンプレート。自由に設計を開始できます。',
          category: 'その他',
          color: '#64748b',
          previewImageUrl: 'https://tsubasagit.github.io/AppNavi-asset/templates/blank-page/preview.png',
          isPublic: true,
          isDefault: true,
          tags: ['カスタム', 'ブランク', '自由設計'],
          version: '1.0.0',
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
                layout: { type: 'grid', columns: 12, gap: '1rem' },
                components: [],
                order: 0,
              },
            ],
            dashboard: {
              kpiCards: [],
              layout: 'grid',
            },
          },
        }
        
        await createTemplate('blank-page', blankPageTemplateData)
        console.log(`✓ テンプレート "blank-page" を作成しました`)
        
        console.log('✅ デフォルトテンプレートの作成が完了しました！')
        console.log('- crm: 顧客管理（CRM）')
        console.log('- blank-page: ブランクページ')
        return
      } catch (e) {
        console.error('[Firestore] createTemplate関数の使用に失敗:', e)
      }
    }
    
    // 方法4: Firestore関数を直接使用
    if (!db) {
      throw new Error('Firestoreインスタンスを取得できませんでした。以下の方法を試してください:\n1. ページをリロード\n2. window.__firestoreDbが存在するか確認\n3. 開発者ツールのコンソールで window.__firestoreDb を確認')
    }
    
    // Firestore関数を取得
    const firestoreModule = window.__firebaseFirestore
    if (!firestoreModule) {
      throw new Error('Firebase Firestoreモジュールが読み込まれていません。')
    }
    
    const { doc, setDoc, Timestamp } = firestoreModule
    
    console.log('デフォルトテンプレートを作成中...')
    
    // 1. CRMテンプレート
    const crmTemplateId = 'crm'
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
            layout: { type: 'grid', columns: 12, gap: '1rem' },
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
            layout: { type: 'grid', columns: 12, gap: '1rem' },
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
            layout: { type: 'list', gap: '0.5rem' },
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
      color: '#64748b',
      previewImageUrl: 'https://tsubasagit.github.io/AppNavi-asset/templates/blank-page/preview.png',
      isPublic: true,
      isDefault: true,
      tags: ['カスタム', 'ブランク', '自由設計'],
      version: '1.0.0',
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
            layout: { type: 'grid', columns: 12, gap: '1rem' },
            components: [],
            order: 0,
          },
        ],
        dashboard: {
          kpiCards: [],
          layout: 'grid',
        },
      },
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }
    
    // Firestoreに保存
    const crmTemplateRef = doc(db, 'templates', crmTemplateId)
    await setDoc(crmTemplateRef, crmTemplateData)
    console.log(`✓ テンプレート "${crmTemplateId}" を作成しました`)
    
    const blankPageTemplateRef = doc(db, 'templates', blankPageTemplateId)
    await setDoc(blankPageTemplateRef, blankPageTemplateData)
    console.log(`✓ テンプレート "${blankPageTemplateId}" を作成しました`)
    
    console.log('✅ デフォルトテンプレートの作成が完了しました！')
    console.log(`- ${crmTemplateId}: ${crmTemplateData.name}`)
    console.log(`- ${blankPageTemplateId}: ${blankPageTemplateData.name}`)
  } catch (error) {
    console.error('❌ エラーが発生しました:', error)
    console.error('スタックトレース:', error.stack)
  }
}

// 実行
createDefaultTemplates()
