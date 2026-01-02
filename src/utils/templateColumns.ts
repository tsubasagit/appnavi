/**
 * テンプレートごとの必要なカラム定義とサンプルデータ
 */

import { RequiredColumn } from './templates'

// テンプレートIDごとの必要なカラム定義
export const templateRequiredColumns: Record<string, RequiredColumn[]> = {
  'crm': [
    { name: '顧客名', type: 'string', required: true, description: '顧客の名前' },
    { name: '会社名', type: 'string', required: false, description: '顧客の会社名' },
    { name: 'メールアドレス', type: 'string', required: false, description: '連絡先メールアドレス' },
    { name: '電話番号', type: 'string', required: false, description: '連絡先電話番号' },
    { name: 'ステータス', type: 'string', required: false, description: '顧客ステータス（見込み、既存など）' },
    { name: '最終接触日', type: 'date', required: false, description: '最後に連絡した日付' },
  ],
  'inventory': [
    { name: '商品名', type: 'string', required: true, description: '商品の名前' },
    { name: '商品コード', type: 'string', required: false, description: '商品を識別するコード' },
    { name: '在庫数', type: 'number', required: true, description: '現在の在庫数量' },
    { name: '単価', type: 'number', required: false, description: '商品の単価' },
    { name: 'カテゴリ', type: 'string', required: false, description: '商品カテゴリ' },
    { name: 'ロケーション', type: 'string', required: false, description: '保管場所' },
  ],
  'daily-report': [
    { name: '日付', type: 'date', required: true, description: '活動日付' },
    { name: '担当者', type: 'string', required: true, description: '活動した担当者名' },
    { name: '活動内容', type: 'string', required: true, description: '実施した活動の内容' },
    { name: '時間', type: 'number', required: false, description: '活動にかかった時間（時間）' },
    { name: '成果', type: 'string', required: false, description: '活動の成果や結果' },
    { name: 'チェック状況', type: 'string', required: false, description: 'チェック済み/未チェック' },
  ],
  'google-calendar-group': [
    { name: 'イベント名', type: 'string', required: true, description: 'カレンダーイベントの名前' },
    { name: '開始日時', type: 'date', required: true, description: 'イベントの開始日時' },
    { name: '終了日時', type: 'date', required: false, description: 'イベントの終了日時' },
    { name: 'グループ', type: 'string', required: false, description: 'カレンダーのグループ名' },
    { name: '参加者', type: 'string', required: false, description: 'イベントの参加者' },
    { name: '場所', type: 'string', required: false, description: 'イベントの場所' },
  ],
  'auto-integration': [
    { name: '連携サービス名', type: 'string', required: true, description: '連携するサービスの名前' },
    { name: '連携タイプ', type: 'string', required: true, description: '連携の種類（API、Webhookなど）' },
    { name: '最終同期日時', type: 'date', required: false, description: '最後に同期した日時' },
    { name: '同期ステータス', type: 'string', required: false, description: '同期の状態（成功、失敗など）' },
    { name: '同期データ数', type: 'number', required: false, description: '同期したデータの件数' },
  ],
  'reservation': [
    { name: '予約日時', type: 'date', required: true, description: '予約の日時' },
    { name: '予約者名', type: 'string', required: true, description: '予約した人の名前' },
    { name: '施設名', type: 'string', required: true, description: '予約する施設や設備の名前' },
    { name: '用途', type: 'string', required: false, description: '予約の用途' },
    { name: '人数', type: 'number', required: false, description: '利用人数' },
  ],
  'document-management': [
    { name: '文書名', type: 'string', required: true, description: '文書の名前' },
    { name: 'カテゴリ', type: 'string', required: false, description: '文書のカテゴリ' },
    { name: '作成日', type: 'date', required: false, description: '文書の作成日' },
    { name: '更新日', type: 'date', required: false, description: '最終更新日' },
    { name: '作成者', type: 'string', required: false, description: '文書を作成した人' },
  ],
  'e-commerce': [
    { name: '商品名', type: 'string', required: true, description: '商品の名前' },
    { name: '価格', type: 'number', required: true, description: '商品の価格' },
    { name: '在庫数', type: 'number', required: true, description: '在庫数量' },
    { name: 'カテゴリ', type: 'string', required: false, description: '商品カテゴリ' },
    { name: '説明', type: 'string', required: false, description: '商品の説明' },
  ],
  'asset-management': [
    { name: '資産名', type: 'string', required: true, description: '資産の名前' },
    { name: '資産番号', type: 'string', required: false, description: '資産を識別する番号' },
    { name: '取得日', type: 'date', required: false, description: '資産を取得した日' },
    { name: '取得価額', type: 'number', required: false, description: '資産の取得価額' },
    { name: '保管場所', type: 'string', required: false, description: '資産の保管場所' },
  ],
  'logistics': [
    { name: '配送先', type: 'string', required: true, description: '配送先の名前や住所' },
    { name: '配送日', type: 'date', required: true, description: '配送予定日' },
    { name: '配送ステータス', type: 'string', required: false, description: '配送の状態' },
    { name: '配送担当者', type: 'string', required: false, description: '配送を担当する人' },
  ],
  'expense-management': [
    { name: '日付', type: 'date', required: true, description: '経費が発生した日' },
    { name: '項目', type: 'string', required: true, description: '経費の項目名' },
    { name: '金額', type: 'number', required: true, description: '経費の金額' },
    { name: '申請者', type: 'string', required: true, description: '経費を申請した人' },
    { name: '承認ステータス', type: 'string', required: false, description: '承認の状態' },
  ],
  'hr-management': [
    { name: '従業員名', type: 'string', required: true, description: '従業員の名前' },
    { name: '部署', type: 'string', required: false, description: '所属部署' },
    { name: '入社日', type: 'date', required: false, description: '入社した日' },
    { name: 'メールアドレス', type: 'string', required: false, description: '連絡先メールアドレス' },
  ],
  'project-management': [
    { name: 'タスク名', type: 'string', required: true, description: 'タスクの名前' },
    { name: '担当者', type: 'string', required: true, description: 'タスクを担当する人' },
    { name: '期限', type: 'date', required: false, description: 'タスクの期限' },
    { name: 'ステータス', type: 'string', required: false, description: 'タスクの状態' },
    { name: '優先度', type: 'string', required: false, description: 'タスクの優先度' },
  ],
  'quality-control': [
    { name: '検査日', type: 'date', required: true, description: '検査を実施した日' },
    { name: '検査項目', type: 'string', required: true, description: '検査の項目名' },
    { name: '結果', type: 'string', required: true, description: '検査の結果' },
    { name: '検査者', type: 'string', required: false, description: '検査を実施した人' },
  ],
  'sales-analysis': [
    { name: '日付', type: 'date', required: true, description: '売上が発生した日' },
    { name: '商品名', type: 'string', required: true, description: '販売した商品名' },
    { name: '数量', type: 'number', required: true, description: '販売数量' },
    { name: '単価', type: 'number', required: true, description: '商品の単価' },
    { name: '合計金額', type: 'number', required: true, description: '売上合計金額' },
  ],
  'budget-management': [
    { name: '項目', type: 'string', required: true, description: '予算項目名' },
    { name: '予算額', type: 'number', required: true, description: '予算の金額' },
    { name: '実績額', type: 'number', required: false, description: '実際の支出額' },
    { name: '期間', type: 'string', required: false, description: '予算の期間' },
  ],
  'performance-tracking': [
    { name: '指標名', type: 'string', required: true, description: 'KPIの名前' },
    { name: '目標値', type: 'number', required: true, description: '目標とする数値' },
    { name: '実績値', type: 'number', required: false, description: '実際の数値' },
    { name: '測定日', type: 'date', required: false, description: '測定した日' },
  ],
}

// テンプレートIDごとのサンプルデータ
export const templateSampleData: Record<string, string[][]> = {
  'crm': [
    ['顧客名', '会社名', 'メールアドレス', '電話番号', 'ステータス', '最終接触日'],
    ['山田太郎', '株式会社サンプル', 'yamada@example.com', '090-1234-5678', '既存顧客', '2024-01-15'],
    ['佐藤花子', 'サンプル商事', 'sato@example.com', '080-2345-6789', '見込み', '2024-01-20'],
    ['鈴木一郎', 'テスト株式会社', 'suzuki@example.com', '070-3456-7890', '既存顧客', '2024-01-18'],
  ],
  'inventory': [
    ['商品名', '商品コード', '在庫数', '単価', 'カテゴリ', 'ロケーション'],
    ['ノートPC', 'PC-001', '15', '98000', 'PC', '倉庫A-1'],
    ['マウス', 'MS-002', '50', '2500', '周辺機器', '倉庫A-2'],
    ['キーボード', 'KB-003', '30', '4500', '周辺機器', '倉庫A-2'],
  ],
  'daily-report': [
    ['日付', '担当者', '活動内容', '時間', '成果', 'チェック状況'],
    ['2024-01-20', '田中', '顧客訪問', '2', '新規商談獲得', 'チェック済み'],
    ['2024-01-20', '佐藤', '資料作成', '3', '提案資料完成', 'チェック済み'],
    ['2024-01-21', '山田', '会議', '1', 'プロジェクト方針決定', '未チェック'],
  ],
  'google-calendar-group': [
    ['イベント名', '開始日時', '終了日時', 'グループ', '参加者', '場所'],
    ['定例ミーティング', '2024-01-25 10:00', '2024-01-25 11:00', '営業チーム', '山田、佐藤、鈴木', '会議室A'],
    ['プロジェクトレビュー', '2024-01-26 14:00', '2024-01-26 16:00', '開発チーム', '田中、高橋', 'オンライン'],
    ['顧客訪問', '2024-01-27 09:00', '2024-01-27 10:30', '営業チーム', '山田', '株式会社サンプル'],
  ],
  'auto-integration': [
    ['連携サービス名', '連携タイプ', '最終同期日時', '同期ステータス', '同期データ数'],
    ['Google Sheets', 'API', '2024-01-25 09:00', '成功', '150'],
    ['Slack', 'Webhook', '2024-01-25 09:05', '成功', '23'],
    ['メール通知', 'SMTP', '2024-01-25 09:10', '失敗', '0'],
  ],
  'reservation': [
    ['予約日時', '予約者名', '施設名', '用途', '人数'],
    ['2024-01-25 10:00', '山田太郎', '会議室A', '打ち合わせ', '5'],
    ['2024-01-25 14:00', '佐藤花子', '会議室B', 'セミナー', '20'],
    ['2024-01-26 09:00', '鈴木一郎', '会議室A', '面接', '3'],
  ],
  'e-commerce': [
    ['商品名', '価格', '在庫数', 'カテゴリ', '説明'],
    ['Tシャツ', '2980', '100', 'アパレル', '綿100%のTシャツ'],
    ['ジーンズ', '5980', '50', 'アパレル', 'ストレッチ素材のジーンズ'],
    ['スニーカー', '8900', '30', 'シューズ', '軽量で履きやすいスニーカー'],
  ],
}

// テンプレートIDから必要なカラムを取得
export const getRequiredColumns = (templateId: string): RequiredColumn[] => {
  return templateRequiredColumns[templateId] || []
}

// テンプレートIDからサンプルデータを取得
export const getSampleData = (templateId: string): string[][] => {
  return templateSampleData[templateId] || []
}

