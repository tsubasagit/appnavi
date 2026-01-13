/**
 * Cloud Shellで実行するデフォルトテンプレート作成スクリプト
 * 
 * 実行方法:
 * 1. Google Cloud ConsoleでCloud Shellを開く
 * 2. プロジェクトをクローンまたはファイルをアップロード
 * 3. このスクリプトを実行: node scripts/createDefaultTemplates-cloudshell.js
 * 
 * 注意: Cloud Shellでは既に認証されているため、サービスアカウントキーは不要です
 */

const { initializeApp, getApps } = require('firebase-admin/app');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');

async function createDefaultTemplates() {
  try {
    console.log('デフォルトテンプレートを作成中...');

    // Cloud Shellでは既に認証されているため、プロジェクトIDのみ指定
    const projectId = 'appnavi-add7e';
    
    // Firebase Admin SDKを初期化（Application Default Credentialsを使用）
    let app;
    try {
      app = initializeApp({
        projectId: projectId
      });
      console.log('✅ Firebase Admin SDKを初期化しました');
    } catch (error) {
      // 既に初期化されている場合は無視
      const apps = getApps();
      if (apps.length > 0) {
        app = apps[0];
        console.log('✅ 既存のFirebase Admin SDKインスタンスを使用します');
      } else {
        throw error;
      }
    }

    const db = getFirestore(app);

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
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

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
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    // Firestoreに保存
    const crmRef = db.collection('templates').doc('crm');
    await crmRef.set(crmTemplateData);
    console.log('✓ テンプレート "crm" を作成しました');

    const blankPageRef = db.collection('templates').doc('blank-page');
    await blankPageRef.set(blankPageTemplateData);
    console.log('✓ テンプレート "blank-page" を作成しました');

    console.log('✅ デフォルトテンプレートの作成が完了しました！');
    console.log('- crm: 顧客管理（CRM）');
    console.log('- blank-page: ブランクページ');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    console.error('エラーメッセージ:', error.message);
    console.error('エラーコード:', error.code);
    process.exit(1);
  }
}

createDefaultTemplates();
