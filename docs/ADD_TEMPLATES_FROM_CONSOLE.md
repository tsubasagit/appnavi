# ブラウザコンソールからテンプレートを追加する方法

## 手順

1. **アプリにログイン**
   - テストユーザーまたは通常のユーザーでログイン
   - ダッシュボードにアクセス

2. **開発者ツールを開く**
   - `F12` キーを押す
   - または、右クリック → 「検証」→「コンソール」タブ

3. **スクリプトを実行**
   - 以下のコマンドをコンソールに貼り付けて実行：

```javascript
// テンプレートデータを定義
const crmTemplate = {
  templateId: 'crm',
  name: '顧客管理（CRM）',
  description: '顧客情報、商談管理、活動履歴を一元管理',
  category: '営業・マーケティング',
  color: '#8b5cf6',
  isPublic: true,
  tags: ['営業', '顧客管理', '商談', 'CRM'],
  version: '1.0.0',
  uiStructure: {
    theme: {
      primaryColor: '#8b5cf6',
      fontFamily: 'Inter',
      borderRadius: '8px',
      darkMode: true
    },
    pages: [
      {
        id: 'dashboard',
        name: 'ダッシュボード',
        path: '/',
        layout: { type: 'grid', columns: 12, gap: '16px' },
        components: [
          { id: 'c_kpi_1', type: 'kpi_card', position: { x: 0, y: 0, width: 3 }, props: { label: '総顧客数', dataSource: 'count(customers)', icon: 'Users', format: 'number' } },
          { id: 'c_kpi_2', type: 'kpi_card', position: { x: 3, y: 0, width: 3 }, props: { label: '今月の新規リード', dataSource: 'count(leads)', icon: 'TrendingUp', format: 'number' } },
          { id: 'c_kpi_3', type: 'kpi_card', position: { x: 6, y: 0, width: 3 }, props: { label: '対応中の商談数', dataSource: 'count(deals)', icon: 'Briefcase', format: 'number' } },
          { id: 'c_kpi_4', type: 'kpi_card', position: { x: 9, y: 0, width: 3 }, props: { label: '本日の要対応タスク', dataSource: 'count(tasks)', icon: 'AlertCircle', format: 'number' } },
          { id: 'c_table_1', type: 'table', position: { x: 0, y: 1, width: 12 }, props: { columns: ['顧客名', '会社名', 'メールアドレス', 'ステータス', '最終接触日'], sortable: true, searchable: true }, dataSourceId: 'customers' }
        ],
        order: 1
      },
      {
        id: 'list',
        name: '顧客一覧',
        path: '/customers',
        layout: { type: 'list' },
        components: [
          { id: 'c_search_1', type: 'search', position: { x: 0, y: 0, width: 12 }, props: { placeholder: '顧客名、会社名で検索...' } },
          { id: 'c_table_2', type: 'table', position: { x: 0, y: 1, width: 12 }, props: { columns: ['顧客名', '会社名', 'メールアドレス', '電話番号', 'ステータス', '最終接触日'], sortable: true, pagination: true }, dataSourceId: 'customers' }
        ],
        order: 2
      },
      {
        id: 'pipeline',
        name: '商談パイプライン',
        path: '/pipeline',
        layout: { type: 'grid', columns: 12 },
        components: [
          { id: 'c_kanban_1', type: 'kanban', position: { x: 0, y: 0, width: 12 }, props: { columns: ['見込み', '商談中', '提案中', '成約', '失注'], cardFields: ['顧客名', '会社名', '商談金額', '見込み度', '担当者'], sortable: true }, dataSourceId: 'deals' }
        ],
        order: 3
      },
      {
        id: 'detail',
        name: '顧客詳細',
        path: '/customers/:id',
        layout: { type: 'flex' },
        components: [
          { id: 'c_heading_1', type: 'heading', position: { x: 0, y: 0, width: 12 }, props: { text: '顧客情報', level: 1 } },
          { id: 'c_form_1', type: 'form', position: { x: 0, y: 1, width: 6 }, props: { fields: [{ name: '顧客名', type: 'text', required: true }, { name: '会社名', type: 'text', required: false }, { name: 'メールアドレス', type: 'email', required: false }, { name: '電話番号', type: 'tel', required: false }, { name: 'ステータス', type: 'select', required: false, options: ['見込み', '商談中', '既存顧客', '休眠', '失注'] }, { name: '見込み度', type: 'select', required: false, options: ['高', '中', '低'] }, { name: '商談金額', type: 'number', required: false }, { name: '担当者', type: 'text', required: false }, { name: '備考', type: 'textarea', required: false }] }, dataSourceId: 'customers' },
          { id: 'c_timeline_1', type: 'timeline', position: { x: 6, y: 1, width: 6 }, props: { title: '活動履歴', fields: ['日時', '活動種別', '内容', '担当者'] }, dataSourceId: 'activities' }
        ],
        order: 4
      }
    ],
    dashboard: {
      kpiCards: [
        { id: 'kpi_1', label: '総顧客数', dataSource: 'count(customers)', icon: 'Users', format: 'number' },
        { id: 'kpi_2', label: '今月の新規リード', dataSource: 'count(leads)', icon: 'TrendingUp', format: 'number' },
        { id: 'kpi_3', label: '対応中の商談数', dataSource: 'count(deals)', icon: 'Briefcase', format: 'number' },
        { id: 'kpi_4', label: '本日の要対応タスク', dataSource: 'count(tasks)', icon: 'AlertCircle', format: 'number' }
      ],
      charts: [
        { id: 'chart_1', type: 'pie', title: '顧客属性グラフ', dataSource: 'customers', groupBy: 'ステータス' },
        { id: 'chart_2', type: 'bar', title: '売上/商談の推移', dataSource: 'sales', xAxis: 'month', yAxis: 'amount' },
        { id: 'chart_3', type: 'line', title: 'ファネル分析', dataSource: 'funnel', xAxis: 'stage', yAxis: 'count' }
      ],
      layout: 'grid'
    }
  },
  recommendedSchema: {
    columns: [
      { name: '顧客名', type: 'string', required: true, description: '顧客の名前', example: '山田太郎' },
      { name: '会社名', type: 'string', required: false, description: '顧客の会社名', example: '株式会社サンプル' },
      { name: 'メールアドレス', type: 'string', required: false, description: '連絡先メールアドレス', example: 'yamada@example.com' },
      { name: '電話番号', type: 'string', required: false, description: '連絡先電話番号', example: '090-1234-5678' },
      { name: 'ステータス', type: 'string', required: false, description: '顧客ステータス（見込み、商談中、既存顧客、休眠、失注）', example: '見込み' },
      { name: '見込み度', type: 'string', required: false, description: '見込み度（高、中、低）', example: '高' },
      { name: '商談金額', type: 'number', required: false, description: '商談金額（円）', example: '1000000' },
      { name: '担当者', type: 'string', required: false, description: '担当者の名前', example: '山田太郎' },
      { name: '最終接触日', type: 'date', required: false, description: '最後に連絡した日付', example: '2024-01-15' },
      { name: '備考', type: 'string', required: false, description: '備考・メモ', example: '来月に再度訪問予定' }
    ],
    sampleData: {
      headers: ['顧客名', '会社名', 'メールアドレス', '電話番号', 'ステータス', '見込み度', '商談金額', '担当者', '最終接触日', '備考'],
      rows: [
        ['山田太郎', '株式会社サンプル', 'yamada@example.com', '090-1234-5678', '商談中', '高', '5000000', '佐藤花子', '2024-01-15', '来月に契約予定'],
        ['佐藤花子', 'サンプル商事', 'sato@example.com', '080-2345-6789', '見込み', '中', '2000000', '山田太郎', '2024-01-20', '提案書送付済み'],
        ['鈴木一郎', 'テスト株式会社', 'suzuki@example.com', '070-3456-7890', '既存顧客', '高', '3000000', '佐藤花子', '2024-01-18', '定期訪問中'],
        ['高橋次郎', 'デモ株式会社', 'takahashi@example.com', '090-9876-5432', '見込み', '低', '1000000', '山田太郎', '2024-01-22', '初回訪問予定']
      ]
    },
    dataTypes: {
      '顧客名': 'string',
      '会社名': 'string',
      'メールアドレス': 'string',
      '電話番号': 'string',
      'ステータス': 'string',
      '見込み度': 'string',
      '商談金額': 'number',
      '担当者': 'string',
      '最終接触日': 'date',
      '備考': 'string'
    }
  }
}

// Firebaseインスタンスを取得
async function addTemplate() {
  try {
    // Firebaseインスタンスの準備を待つ
    let firestoreModule = window.__firebaseFirestore
    let db = window.__firestoreDb
    
    if (!firestoreModule || !db) {
      console.log('Firebaseインスタンスの準備を待っています...')
      for (let i = 0; i < 50; i++) {
        await new Promise(resolve => setTimeout(resolve, 100))
        firestoreModule = window.__firebaseFirestore
        db = window.__firestoreDb
        if (firestoreModule && db) break
      }
    }
    
    if (!firestoreModule || !db) {
      throw new Error('Firebaseインスタンスが見つかりません。ページをリロードしてから再度実行してください。')
    }
    
    const { doc, setDoc, serverTimestamp } = firestoreModule
    
    // テンプレートを追加
    const crmRef = doc(db, 'templates', 'crm')
    await setDoc(crmRef, {
      ...crmTemplate,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    
    console.log('✅ CRMテンプレートを追加しました！')
    console.log('ページをリロードして、テンプレートが読み込まれることを確認してください。')
  } catch (error) {
    console.error('❌ エラー:', error)
  }
}

// 実行
addTemplate()
```

4. **実行結果を確認**
   - コンソールに「✅ CRMテンプレートを追加しました！」と表示されれば成功
   - ページをリロードして、テンプレートが読み込まれることを確認

## 注意事項

- この方法では、既にログインしているFirebase認証を使用します
- テストユーザーの場合も動作します（Firestoreのセキュリティルールで許可されている場合）
- エラーが発生した場合は、ページをリロードしてから再度実行してください


