/**
 * ブラウザコンソールで実行するための短縮版スクリプト
 * 
 * 使用方法:
 * 1. 開発者ツールのコンソールを開く（F12）
 * 2. このファイルの内容をコピー＆ペースト
 * 3. 実行されるまで待つ
 */

(async function() {
  console.log('テンプレート作成スクリプトを開始します...')
  
  // Firebaseのインポート
  const { getFirestore, doc, setDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js')
  const { getAuth } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js')
  
  // Firebase初期化（既に初期化されている場合は使用）
  const db = getFirestore()
  const auth = getAuth()
  
  // 認証確認
  const currentUser = auth.currentUser
  if (!currentUser) {
    console.error('❌ エラー: ログインしていません。管理者アカウントでログインしてください。')
    return
  }

  console.log(`✓ 認証ユーザー: ${currentUser.email}`)
  console.log('テンプレートを作成中...\n')

  // CRMテンプレート
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
        darkMode: true,
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
            { id: 'c_table_1', type: 'table', position: { x: 0, y: 1, width: 12 }, props: { columns: ['顧客名', '会社名', 'メールアドレス', 'ステータス', '最終接触日'], sortable: true, searchable: true }, dataSourceId: 'customers' },
          ],
          order: 1,
        },
        {
          id: 'list',
          name: '顧客一覧',
          path: '/customers',
          layout: { type: 'list' },
          components: [
            { id: 'c_search_1', type: 'search', position: { x: 0, y: 0, width: 12 }, props: { placeholder: '顧客名、会社名で検索...' } },
            { id: 'c_table_2', type: 'table', position: { x: 0, y: 1, width: 12 }, props: { columns: ['顧客名', '会社名', 'メールアドレス', '電話番号', 'ステータス', '最終接触日'], sortable: true, pagination: true }, dataSourceId: 'customers' },
          ],
          order: 2,
        },
        {
          id: 'pipeline',
          name: '商談パイプライン',
          path: '/pipeline',
          layout: { type: 'grid', columns: 12 },
          components: [
            { id: 'c_kanban_1', type: 'kanban', position: { x: 0, y: 0, width: 12 }, props: { columns: ['見込み', '商談中', '提案中', '成約', '失注'], cardFields: ['顧客名', '会社名', '商談金額', '見込み度', '担当者'], sortable: true }, dataSourceId: 'deals' },
          ],
          order: 3,
        },
        {
          id: 'detail',
          name: '顧客詳細',
          path: '/customers/:id',
          layout: { type: 'flex' },
          components: [
            { id: 'c_heading_1', type: 'heading', position: { x: 0, y: 0, width: 12 }, props: { text: '顧客情報', level: 1 } },
            { id: 'c_form_1', type: 'form', position: { x: 0, y: 1, width: 6 }, props: { fields: [{ name: '顧客名', type: 'text', required: true }, { name: '会社名', type: 'text', required: false }, { name: 'メールアドレス', type: 'email', required: false }, { name: '電話番号', type: 'tel', required: false }, { name: 'ステータス', type: 'select', required: false, options: ['見込み', '商談中', '既存顧客', '休眠', '失注'] }, { name: '見込み度', type: 'select', required: false, options: ['高', '中', '低'] }, { name: '商談金額', type: 'number', required: false }, { name: '担当者', type: 'text', required: false }, { name: '備考', type: 'textarea', required: false }] }, dataSourceId: 'customers' },
            { id: 'c_timeline_1', type: 'timeline', position: { x: 6, y: 1, width: 6 }, props: { title: '活動履歴', fields: ['日時', '活動種別', '内容', '担当者'] }, dataSourceId: 'activities' },
          ],
          order: 4,
        },
      ],
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
        { name: '備考', type: 'string', required: false, description: '備考・メモ', example: '来月に再度訪問予定' },
      ],
    },
  }

  // Googleカレンダー管理テンプレート
  const googleCalendarTemplate = {
    templateId: 'google-calendar-group',
    name: 'Googleカレンダーのグループ化',
    description: '複数のGoogleカレンダーを統合し、グループ別に管理・表示',
    category: 'スケジュール管理',
    color: '#f97316',
    isPublic: true,
    tags: ['カレンダー', 'スケジュール', 'Google', 'グループ管理'],
    version: '1.0.0',
    uiStructure: {
      theme: {
        primaryColor: '#f97316',
        fontFamily: 'Inter',
        borderRadius: '8px',
        darkMode: true,
      },
      pages: [
        {
          id: 'dashboard',
          name: 'ダッシュボード',
          path: '/',
          layout: { type: 'grid', columns: 12, gap: '16px' },
          components: [
            { id: 'c_kpi_1', type: 'kpi_card', position: { x: 0, y: 0, width: 3 }, props: { label: '本日の予定', dataSource: 'count(today_events)', icon: 'Calendar', format: 'number' } },
            { id: 'c_kpi_2', type: 'kpi_card', position: { x: 3, y: 0, width: 3 }, props: { label: '今週の予定', dataSource: 'count(week_events)', icon: 'Calendar', format: 'number' } },
            { id: 'c_kpi_3', type: 'kpi_card', position: { x: 6, y: 0, width: 3 }, props: { label: 'アクティブなグループ', dataSource: 'count(groups)', icon: 'Users', format: 'number' } },
            { id: 'c_calendar_1', type: 'calendar', position: { x: 0, y: 1, width: 8 }, props: { view: 'week', showGroups: true, groupBy: 'グループ' }, dataSourceId: 'events' },
            { id: 'c_list_1', type: 'list', position: { x: 8, y: 1, width: 4 }, props: { title: '今後の予定', limit: 10, fields: ['イベント名', '開始日時', 'グループ', '参加者'] }, dataSourceId: 'upcoming_events' },
          ],
          order: 1,
        },
        {
          id: 'calendar',
          name: 'カレンダー表示',
          path: '/calendar',
          layout: { type: 'grid', columns: 12 },
          components: [
            { id: 'c_filter_1', type: 'filter', position: { x: 0, y: 0, width: 12 }, props: { filters: [{ name: 'グループ', type: 'select', field: 'グループ' }, { name: '参加者', type: 'select', field: '参加者' }] } },
            { id: 'c_calendar_2', type: 'calendar', position: { x: 0, y: 1, width: 12 }, props: { view: 'week', showGroups: true, groupBy: 'グループ', teamFilter: true }, dataSourceId: 'events' },
          ],
          order: 2,
        },
        {
          id: 'list',
          name: 'イベント一覧',
          path: '/events',
          layout: { type: 'list' },
          components: [
            { id: 'c_search_1', type: 'search', position: { x: 0, y: 0, width: 12 }, props: { placeholder: 'イベント名で検索...' } },
            { id: 'c_table_1', type: 'table', position: { x: 0, y: 1, width: 12 }, props: { columns: ['イベント名', '開始日時', '終了日時', 'グループ', '参加者', '場所'], sortable: true, pagination: true }, dataSourceId: 'events' },
          ],
          order: 3,
        },
        {
          id: 'groups',
          name: 'グループ管理',
          path: '/groups',
          layout: { type: 'grid', columns: 12 },
          components: [
            { id: 'c_table_2', type: 'table', position: { x: 0, y: 0, width: 12 }, props: { columns: ['グループ名', 'カレンダー数', 'メンバー数', '最終同期日時'], sortable: true }, dataSourceId: 'groups' },
          ],
          order: 4,
        },
      ],
    },
    recommendedSchema: {
      columns: [
        { name: 'イベント名', type: 'string', required: true, description: 'カレンダーイベントの名前', example: '定例ミーティング' },
        { name: '開始日時', type: 'date', required: true, description: 'イベントの開始日時', example: '2024-01-25 10:00' },
        { name: '終了日時', type: 'date', required: false, description: 'イベントの終了日時', example: '2024-01-25 11:00' },
        { name: 'グループ', type: 'string', required: false, description: 'カレンダーのグループ名', example: '営業チーム' },
        { name: '参加者', type: 'string', required: false, description: 'イベントの参加者（カンマ区切り）', example: '山田、佐藤、鈴木' },
        { name: '場所', type: 'string', required: false, description: 'イベントの場所', example: '会議室A' },
      ],
    },
  }

  try {
    // CRMテンプレートを作成
    const crmRef = doc(db, 'templates', 'crm')
    await setDoc(crmRef, {
      ...crmTemplate,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    console.log('✓ CRMテンプレートを作成しました (ID: crm)')

    // Googleカレンダー管理テンプレートを作成
    const calendarRef = doc(db, 'templates', 'google-calendar-group')
    await setDoc(calendarRef, {
      ...googleCalendarTemplate,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    console.log('✓ Googleカレンダー管理テンプレートを作成しました (ID: google-calendar-group)')

    console.log('\n✅ すべてのテンプレートの作成が完了しました！')
    console.log('ページをリロードして、テンプレートが読み込まれることを確認してください。')
  } catch (error) {
    console.error('❌ エラーが発生しました:', error)
    if (error.code) {
      console.error('エラーコード:', error.code)
      console.error('エラーメッセージ:', error.message)
    }
    throw error
  }
})()


