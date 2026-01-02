/**
 * ブラウザコンソールで実行するためのテンプレート作成スクリプト
 * 
 * 使用方法:
 * 1. アプリにログイン（テストユーザーまたは通常のユーザー）
 * 2. 開発者ツールのコンソールを開く（F12）
 * 3. このファイルの内容をコピー＆ペースト
 * 4. 実行されるまで待つ
 * 
 * 注意: このスクリプトは、既にアプリケーションで初期化されているFirebaseインスタンスを使用します。
 */

// テンプレートデータ（scripts/create-templates.js からコピー）
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
    dashboard: {
      kpiCards: [
        { id: 'kpi_1', label: '総顧客数', dataSource: 'count(customers)', icon: 'Users', format: 'number' },
        { id: 'kpi_2', label: '今月の新規リード', dataSource: 'count(leads)', icon: 'TrendingUp', format: 'number' },
        { id: 'kpi_3', label: '対応中の商談数', dataSource: 'count(deals)', icon: 'Briefcase', format: 'number' },
        { id: 'kpi_4', label: '本日の要対応タスク', dataSource: 'count(tasks)', icon: 'AlertCircle', format: 'number' },
      ],
      charts: [
        { id: 'chart_1', type: 'pie', title: '顧客属性グラフ', dataSource: 'customers', groupBy: 'ステータス' },
        { id: 'chart_2', type: 'bar', title: '売上/商談の推移', dataSource: 'sales', xAxis: 'month', yAxis: 'amount' },
        { id: 'chart_3', type: 'line', title: 'ファネル分析', dataSource: 'funnel', xAxis: 'stage', yAxis: 'count' },
      ],
      layout: 'grid',
    },
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
    sampleData: {
      headers: ['顧客名', '会社名', 'メールアドレス', '電話番号', 'ステータス', '見込み度', '商談金額', '担当者', '最終接触日', '備考'],
      rows: [
        ['山田太郎', '株式会社サンプル', 'yamada@example.com', '090-1234-5678', '商談中', '高', '5000000', '佐藤花子', '2024-01-15', '来月に契約予定'],
        ['佐藤花子', 'サンプル商事', 'sato@example.com', '080-2345-6789', '見込み', '中', '2000000', '山田太郎', '2024-01-20', '提案書送付済み'],
        ['鈴木一郎', 'テスト株式会社', 'suzuki@example.com', '070-3456-7890', '既存顧客', '高', '3000000', '佐藤花子', '2024-01-18', '定期訪問中'],
        ['高橋次郎', 'デモ株式会社', 'takahashi@example.com', '090-9876-5432', '見込み', '低', '1000000', '山田太郎', '2024-01-22', '初回訪問予定'],
      ],
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
      '備考': 'string',
    },
  },
}

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
    dashboard: {
      kpiCards: [
        { id: 'kpi_1', label: '本日の予定', dataSource: 'count(today_events)', icon: 'Calendar', format: 'number' },
        { id: 'kpi_2', label: '今週の予定', dataSource: 'count(week_events)', icon: 'Calendar', format: 'number' },
        { id: 'kpi_3', label: 'アクティブなグループ', dataSource: 'count(groups)', icon: 'Users', format: 'number' },
      ],
      charts: [
        { id: 'chart_1', type: 'bar', title: 'グループ別イベント数', dataSource: 'events', xAxis: 'グループ', yAxis: 'count' },
        { id: 'chart_2', type: 'line', title: '週別イベント推移', dataSource: 'events', xAxis: 'week', yAxis: 'count' },
      ],
      layout: 'grid',
    },
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
    sampleData: {
      headers: ['イベント名', '開始日時', '終了日時', 'グループ', '参加者', '場所'],
      rows: [
        ['定例ミーティング', '2024-01-25 10:00', '2024-01-25 11:00', '営業チーム', '山田、佐藤、鈴木', '会議室A'],
        ['プロジェクトレビュー', '2024-01-26 14:00', '2024-01-26 16:00', '開発チーム', '田中、高橋', 'オンライン'],
        ['顧客訪問', '2024-01-27 09:00', '2024-01-27 10:30', '営業チーム', '山田', '株式会社サンプル'],
      ],
    },
    dataTypes: {
      'イベント名': 'string',
      '開始日時': 'date',
      '終了日時': 'date',
      'グループ': 'string',
      '参加者': 'string',
      '場所': 'string',
    },
  },
}

// 日報チェックテンプレート
const dailyReportTemplate = {
  templateId: 'daily-report',
  name: '日報チェック',
  description: '日々の業務活動の記録とチェック、自動連携',
  category: '業務管理',
  color: '#10b981',
  isPublic: true,
  tags: ['日報', '活動報告', 'チェック', '業務管理'],
  version: '1.0.0',
  uiStructure: {
    theme: {
      primaryColor: '#10b981',
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
          { id: 'c_kpi_1', type: 'kpi_card', position: { x: 0, y: 0, width: 3 }, props: { label: '本日の提出数', dataSource: 'count(today_reports)', icon: 'FileText', format: 'number' } },
          { id: 'c_kpi_2', type: 'kpi_card', position: { x: 3, y: 0, width: 3 }, props: { label: '未提出者数', dataSource: 'count(missing_reports)', icon: 'AlertCircle', format: 'number' } },
          { id: 'c_kpi_3', type: 'kpi_card', position: { x: 6, y: 0, width: 3 }, props: { label: '今週の提出率', dataSource: 'percentage(submitted_reports)', icon: 'TrendingUp', format: 'percentage' } },
          { id: 'c_table_1', type: 'table', position: { x: 0, y: 1, width: 12 }, props: { columns: ['日付', '提出者', 'ステータス', 'チェック者', '提出日時'], sortable: true, searchable: true }, dataSourceId: 'reports' },
        ],
        order: 1,
      },
      {
        id: 'list',
        name: '日報一覧',
        path: '/reports',
        layout: { type: 'list' },
        components: [
          { id: 'c_search_1', type: 'search', position: { x: 0, y: 0, width: 12 }, props: { placeholder: '提出者名で検索...' } },
          { id: 'c_table_2', type: 'table', position: { x: 0, y: 1, width: 12 }, props: { columns: ['日付', '提出者', '活動内容', 'ステータス', 'チェック者', '提出日時'], sortable: true, pagination: true }, dataSourceId: 'reports' },
        ],
        order: 2,
      },
      {
        id: 'form',
        name: '日報入力',
        path: '/reports/new',
        layout: { type: 'flex' },
        components: [
          { id: 'c_form_1', type: 'form', position: { x: 0, y: 0, width: 12 }, props: { fields: [{ name: '日付', type: 'date', required: true }, { name: '活動内容', type: 'textarea', required: true }, { name: '成果', type: 'textarea', required: false }, { name: '課題', type: 'textarea', required: false }] }, dataSourceId: 'reports' },
        ],
        order: 3,
      },
    ],
    dashboard: {
      kpiCards: [
        { id: 'kpi_1', label: '本日の提出数', dataSource: 'count(today_reports)', icon: 'FileText', format: 'number' },
        { id: 'kpi_2', label: '未提出者数', dataSource: 'count(missing_reports)', icon: 'AlertCircle', format: 'number' },
        { id: 'kpi_3', label: '今週の提出率', dataSource: 'percentage(submitted_reports)', icon: 'TrendingUp', format: 'percentage' },
      ],
      charts: [
        { id: 'chart_1', type: 'bar', title: '日別提出数', dataSource: 'reports', xAxis: 'date', yAxis: 'count' },
        { id: 'chart_2', type: 'pie', title: 'ステータス別割合', dataSource: 'reports', groupBy: 'status' },
      ],
      layout: 'grid',
    },
  },
  recommendedSchema: {
    columns: [
      { name: '日付', type: 'date', required: true, description: '日報の日付', example: '2024-01-25' },
      { name: '提出者', type: 'string', required: true, description: '提出者の名前', example: '山田太郎' },
      { name: '活動内容', type: 'string', required: true, description: '本日の活動内容', example: '顧客訪問、資料作成' },
      { name: '成果', type: 'string', required: false, description: '本日の成果', example: '新規顧客1件獲得' },
      { name: '課題', type: 'string', required: false, description: '本日の課題', example: '資料の準備に時間がかかった' },
      { name: 'ステータス', type: 'string', required: false, description: 'チェック状況（未提出、提出済み、承認済み）', example: '承認済み' },
      { name: 'チェック者', type: 'string', required: false, description: 'チェックした人の名前', example: '佐藤花子' },
      { name: '提出日時', type: 'date', required: false, description: '提出日時', example: '2024-01-25 18:00' },
    ],
    sampleData: {
      headers: ['日付', '提出者', '活動内容', '成果', '課題', 'ステータス', 'チェック者', '提出日時'],
      rows: [
        ['2024-01-25', '山田太郎', '顧客訪問、資料作成', '新規顧客1件獲得', '資料の準備に時間がかかった', '承認済み', '佐藤花子', '2024-01-25 18:00'],
        ['2024-01-25', '佐藤花子', '会議参加、提案書作成', '提案書完成', 'なし', '提出済み', '', '2024-01-25 17:30'],
        ['2024-01-24', '鈴木一郎', '営業活動、顧客フォロー', '既存顧客との関係強化', 'なし', '承認済み', '佐藤花子', '2024-01-24 18:15'],
      ],
    },
    dataTypes: {
      '日付': 'date',
      '提出者': 'string',
      '活動内容': 'string',
      '成果': 'string',
      '課題': 'string',
      'ステータス': 'string',
      'チェック者': 'string',
      '提出日時': 'date',
    },
  },
}

// 自動連携テンプレート
const autoIntegrationTemplate = {
  templateId: 'auto-integration',
  name: '自動連携',
  description: '各種サービスとの自動連携とデータ同期',
  category: '連携・統合',
  color: '#3b82f6',
  isPublic: true,
  tags: ['連携', '統合', '自動化', 'データ同期'],
  version: '1.0.0',
  uiStructure: {
    theme: {
      primaryColor: '#3b82f6',
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
          { id: 'c_kpi_1', type: 'kpi_card', position: { x: 0, y: 0, width: 3 }, props: { label: 'アクティブな連携', dataSource: 'count(active_integrations)', icon: 'RefreshCw', format: 'number' } },
          { id: 'c_kpi_2', type: 'kpi_card', position: { x: 3, y: 0, width: 3 }, props: { label: '本日の同期数', dataSource: 'count(today_syncs)', icon: 'Database', format: 'number' } },
          { id: 'c_kpi_3', type: 'kpi_card', position: { x: 6, y: 0, width: 3 }, props: { label: 'エラー数', dataSource: 'count(errors)', icon: 'AlertCircle', format: 'number' } },
          { id: 'c_table_1', type: 'table', position: { x: 0, y: 1, width: 12 }, props: { columns: ['連携名', 'サービス', 'ステータス', '最終同期日時', 'エラー数'], sortable: true, searchable: true }, dataSourceId: 'integrations' },
        ],
        order: 1,
      },
      {
        id: 'list',
        name: '連携一覧',
        path: '/integrations',
        layout: { type: 'list' },
        components: [
          { id: 'c_search_1', type: 'search', position: { x: 0, y: 0, width: 12 }, props: { placeholder: '連携名で検索...' } },
          { id: 'c_table_2', type: 'table', position: { x: 0, y: 1, width: 12 }, props: { columns: ['連携名', 'サービス', 'ステータス', '最終同期日時', 'エラー数', '設定'], sortable: true, pagination: true }, dataSourceId: 'integrations' },
        ],
        order: 2,
      },
      {
        id: 'logs',
        name: '同期ログ',
        path: '/logs',
        layout: { type: 'list' },
        components: [
          { id: 'c_filter_1', type: 'filter', position: { x: 0, y: 0, width: 12 }, props: { filters: [{ name: 'ステータス', type: 'select', field: 'status' }, { name: 'サービス', type: 'select', field: 'service' }] } },
          { id: 'c_table_3', type: 'table', position: { x: 0, y: 1, width: 12 }, props: { columns: ['日時', '連携名', 'サービス', 'ステータス', 'メッセージ'], sortable: true, pagination: true }, dataSourceId: 'sync_logs' },
        ],
        order: 3,
      },
    ],
    dashboard: {
      kpiCards: [
        { id: 'kpi_1', label: 'アクティブな連携', dataSource: 'count(active_integrations)', icon: 'RefreshCw', format: 'number' },
        { id: 'kpi_2', label: '本日の同期数', dataSource: 'count(today_syncs)', icon: 'Database', format: 'number' },
        { id: 'kpi_3', label: 'エラー数', dataSource: 'count(errors)', icon: 'AlertCircle', format: 'number' },
      ],
      charts: [
        { id: 'chart_1', type: 'line', title: '同期数の推移', dataSource: 'sync_logs', xAxis: 'date', yAxis: 'count' },
        { id: 'chart_2', type: 'bar', title: 'サービス別同期数', dataSource: 'sync_logs', xAxis: 'service', yAxis: 'count' },
      ],
      layout: 'grid',
    },
  },
  recommendedSchema: {
    columns: [
      { name: '連携名', type: 'string', required: true, description: '連携の名前', example: 'Googleカレンダー連携' },
      { name: 'サービス', type: 'string', required: true, description: '連携先のサービス名', example: 'Google Calendar' },
      { name: 'ステータス', type: 'string', required: false, description: '連携の状態（有効、無効、エラー）', example: '有効' },
      { name: '最終同期日時', type: 'date', required: false, description: '最後に同期した日時', example: '2024-01-25 10:00' },
      { name: 'エラー数', type: 'number', required: false, description: 'エラーが発生した回数', example: '0' },
      { name: '設定', type: 'string', required: false, description: '連携の設定情報（JSON形式）', example: '{"syncInterval": "1h"}' },
    ],
    sampleData: {
      headers: ['連携名', 'サービス', 'ステータス', '最終同期日時', 'エラー数', '設定'],
      rows: [
        ['Googleカレンダー連携', 'Google Calendar', '有効', '2024-01-25 10:00', '0', '{"syncInterval": "1h"}'],
        ['Slack連携', 'Slack', '有効', '2024-01-25 09:30', '0', '{"channel": "#general"}' ],
        ['Salesforce連携', 'Salesforce', 'エラー', '2024-01-24 15:00', '3', '{"apiKey": "***"}' ],
      ],
    },
    dataTypes: {
      '連携名': 'string',
      'サービス': 'string',
      'ステータス': 'string',
      '最終同期日時': 'date',
      'エラー数': 'number',
      '設定': 'string',
    },
  },
}

// テンプレートを作成する関数
async function createTemplates() {
  try {
    console.log('テンプレート作成スクリプトを開始します...')
    
    // 既にロードされているFirebaseインスタンスを使用
    // 少し待ってからFirebase関数が利用可能になるのを待つ
    let firestoreModule = window.__firebaseFirestore
    let db = window.__firestoreDb
    
    if (!firestoreModule || !db) {
      console.log('Firebaseインスタンスの準備を待っています...')
      // 最大5秒待つ
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
    const { getAuth } = window.__firebaseAuth || {}
    
    // 認証確認（オプション）
    let currentUser = null
    if (getAuth) {
      const auth = getAuth()
      currentUser = auth.currentUser
      if (currentUser) {
        console.log(`✓ 認証ユーザー: ${currentUser.email}`)
      } else {
        console.log('⚠ 認証されていませんが、テストユーザーの場合は続行します。')
      }
    }
    
    console.log('テンプレートを作成中...\n')
    
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
    
    // 日報チェックテンプレートを作成
    const dailyReportRef = doc(db, 'templates', 'daily-report')
    await setDoc(dailyReportRef, {
      ...dailyReportTemplate,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    console.log('✓ 日報チェックテンプレートを作成しました (ID: daily-report)')
    
    // 自動連携テンプレートを作成
    const autoIntegrationRef = doc(db, 'templates', 'auto-integration')
    await setDoc(autoIntegrationRef, {
      ...autoIntegrationTemplate,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    console.log('✓ 自動連携テンプレートを作成しました (ID: auto-integration)')
    
    console.log('\n✅ すべてのテンプレートの作成が完了しました！')
    console.log('ページをリロードして、テンプレートが読み込まれることを確認してください。')
  } catch (error) {
    console.error('❌ エラーが発生しました:', error)
    if (error.code) {
      console.error('エラーコード:', error.code)
      console.error('エラーメッセージ:', error.message)
    }
    console.error('\n解決方法:')
    console.error('1. ページをリロードしてから再度実行してください')
    console.error('2. ログインしていることを確認してください（テストユーザーの場合は不要）')
    console.error('3. Firestoreのセキュリティルールを確認してください')
    throw error
  }
}

// 即座に実行
createTemplates().catch(error => {
  console.error('スクリプト実行エラー:', error)
})

