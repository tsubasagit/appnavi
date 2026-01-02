# テンプレートデータ構造設計書

## 概要

ユーザーが自由にテンプレートを選択・変更でき、テンプレート変更時にデザイン（UI）が自動的に更新される仕様を実現するためのFirebaseデータ構造設計書です。

## 1. Firestoreコレクション構造

### コレクション: `templates`

**パス**: `/templates/{templateId}`

**説明**: すべてのユーザーが利用可能なテンプレート定義を格納するパブリックコレクション

## 2. データ構造

### 2.1 Template型（基本情報）

```typescript
interface Template {
  // 基本情報
  templateId: string                    // テンプレートID（例: 'crm', 'inventory', 'daily-report'）
  name: string                          // テンプレート名（例: '顧客管理（CRM）'）
  description: string                   // 説明文
  category: string                      // カテゴリ（例: '営業・マーケティング', '業務管理'）
  
  // 表示用情報
  iconUrl?: string                      // アイコン画像URL（オプション）
  previewImageUrl?: string              // プレビュー画像URL（オプション）
  color: string                         // テーマカラー（例: '#8b5cf6'）
  
  // メタデータ
  vendorId?: string                     // ベンダーID（システム提供の場合は空）
  isPublic: boolean                     // 公開フラグ（true: 全ユーザーが利用可能）
  tags: string[]                        // タグ（検索・フィルタ用）
  
  // UI構成（テンプレート変更時に適用される）
  uiStructure: TemplateUIStructure      // UI構成定義
  
  // データ構造の推奨
  recommendedSchema?: RecommendedSchema  // 推奨データスキーマ（オプション）
  
  // 管理情報
  version: string                        // テンプレートバージョン（例: '1.0.0'）
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### 2.2 TemplateUIStructure型（UI構成）

```typescript
interface TemplateUIStructure {
  // テーマ設定
  theme: {
    primaryColor: string                 // プライマリカラー（例: '#8b5cf6'）
    secondaryColor?: string              // セカンダリカラー（オプション）
    fontFamily?: string                  // フォントファミリー（オプション）
    borderRadius?: string                // 角丸（オプション）
    darkMode?: boolean                   // ダークモード対応（オプション）
  }
  
  // ページ構成
  pages: TemplatePage[]                  // デフォルトページ構成
  
  // ダッシュボード構成（オプション）
  dashboard?: {
    kpiCards?: KPICardConfig[]           // KPIカード設定
    charts?: ChartConfig[]               // グラフ設定
    layout?: 'grid' | 'list' | 'custom'  // レイアウトタイプ
  }
}
```

### 2.3 TemplatePage型（ページ定義）

```typescript
interface TemplatePage {
  id: string                             // ページID（例: 'dashboard', 'list', 'detail'）
  name: string                           // ページ名（例: 'ダッシュボード', '一覧', '詳細'）
  path: string                           // パス（例: '/', '/list', '/detail/:id'）
  layout: {
    type: 'grid' | 'flex' | 'list'       // レイアウトタイプ
    columns?: number                     // グリッド列数（gridの場合）
    gap?: string                         // 間隔
  }
  
  // コンポーネント構成
  components: TemplateComponent[]         // ページ内のコンポーネント
  
  // データソースマッピング
  dataSourceMapping?: {                  // データソースとのマッピング
    [componentId: string]: {
      dataSourceId?: string              // データソースID
      columnMapping?: Record<string, string>  // 列マッピング
    }
  }
  
  order: number                          // 表示順序
}
```

### 2.4 TemplateComponent型（コンポーネント定義）

```typescript
interface TemplateComponent {
  id: string                             // コンポーネントID（例: 'c_header_1', 'c_table_1'）
  type: ComponentType                    // コンポーネントタイプ
  
  // 位置・サイズ
  position: {
    x: number                            // X座標（グリッドの場合）
    y: number                            // Y座標（グリッドの場合）
    width?: number                       // 幅（グリッド列数）
    height?: number                      // 高さ（グリッド行数）
  }
  
  // プロパティ
  props: Record<string, any>             // コンポーネント固有のプロパティ
  
  // データソース関連
  dataSourceId?: string                  // 関連するデータソースID（オプション）
  dataMapping?: {                        // データマッピング（オプション）
    [key: string]: string                // プロパティ名 -> データ列名
  }
}

type ComponentType = 
  | 'heading'                            // 見出し
  | 'text'                               // テキスト
  | 'table'                              // テーブル
  | 'form'                               // フォーム
  | 'chart'                              // グラフ
  | 'kpi_card'                           // KPIカード
  | 'button'                             // ボタン
  | 'filter'                             // フィルター
  | 'search'                             // 検索
  | 'calendar'                           // カレンダー
  | 'timeline'                           // タイムライン
  | 'card'                               // カード
  | 'list'                               // リスト
```

### 2.5 RecommendedSchema型（推奨データスキーマ）

```typescript
interface RecommendedSchema {
  // 推奨カラム定義
  columns: RecommendedColumn[]           // 推奨カラム一覧
  
  // サンプルデータ（オプション）
  sampleData?: {
    headers: string[]                     // ヘッダー行
    rows: string[][]                     // データ行（最大10行程度）
  }
  
  // データ型の説明
  dataTypes?: Record<string, string>     // カラム名 -> データ型（例: 'string', 'number', 'date'）
}

interface RecommendedColumn {
  name: string                           // カラム名
  type: 'string' | 'number' | 'date' | 'boolean'  // データ型
  required: boolean                      // 必須フラグ
  description: string                    // 説明
  example?: string                       // 例（オプション）
}
```

### 2.6 KPICardConfig型（KPIカード設定）

```typescript
interface KPICardConfig {
  id: string                             // KPIカードID
  label: string                          // ラベル（例: '総顧客数'）
  dataSource: string                     // データソース（例: 'count(customers)'）
  icon?: string                          // アイコン名（例: 'Users'）
  format?: 'number' | 'currency' | 'percentage'  // 表示形式
  color?: string                         // カラー（オプション）
}
```

### 2.7 ChartConfig型（グラフ設定）

```typescript
interface ChartConfig {
  id: string                             // グラフID
  type: 'bar' | 'line' | 'pie' | 'area'  // グラフタイプ
  title: string                          // タイトル
  dataSource: string                     // データソース
  xAxis?: string                         // X軸カラム名
  yAxis?: string                         // Y軸カラム名
  groupBy?: string                       // グループ化カラム（オプション）
}
```

## 3. アプリとテンプレートの関連

### 3.1 App型への追加

アプリは現在選択されているテンプレートIDを保持します：

```typescript
interface App {
  // ... 既存のフィールド ...
  templateId: string                     // 現在選択されているテンプレートID
  templateVersion?: string               // テンプレートバージョン（オプション、変更履歴用）
}
```

### 3.2 テンプレート変更時の処理フロー

1. **ユーザーがテンプレートを選択**
   - `App.templateId`を更新
   - `App.templateVersion`を更新（オプション）

2. **テンプレート情報を取得**
   - Firestoreから`/templates/{templateId}`を取得
   - `Template.uiStructure`を取得

3. **UIを更新**
   - `TemplateUIStructure.pages`を`App.pages`に適用
   - `TemplateUIStructure.theme`を`App.theme`に適用
   - 既存のデータソースマッピングを保持（可能な限り）

4. **データソースマッピングの調整**
   - テンプレートの推奨スキーマと既存データソースを比較
   - 可能な限り自動マッピング
   - マッピングできない場合はユーザーに確認

## 4. セキュリティルール

### 4.1 読み取り権限

```javascript
// templatesコレクションは全ユーザーが読み取り可能
match /templates/{templateId} {
  allow read: if request.auth != null || resource.data.isPublic == true;
  allow write: if request.auth != null && 
    (request.auth.uid == resource.data.vendorId || 
     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
}
```

### 4.2 書き込み権限

- **システム管理者**: すべてのテンプレートを作成・更新・削除可能
- **ベンダー**: 自分のテンプレートのみ作成・更新・削除可能
- **一般ユーザー**: 読み取りのみ（テンプレートは変更できない）

## 5. 実装例

### 5.1 テンプレート作成例（CRM）

```typescript
const crmTemplate: Template = {
  templateId: 'crm',
  name: '顧客管理（CRM）',
  description: '顧客情報、商談管理、活動履歴を一元管理',
  category: '営業・マーケティング',
  color: '#8b5cf6',
  isPublic: true,
  tags: ['営業', '顧客管理', '商談'],
  version: '1.0.0',
  
  uiStructure: {
    theme: {
      primaryColor: '#8b5cf6',
      fontFamily: 'Inter',
      borderRadius: '8px',
    },
    pages: [
      {
        id: 'dashboard',
        name: 'ダッシュボード',
        path: '/',
        layout: { type: 'grid', columns: 12, gap: '16px' },
        components: [
          {
            id: 'c_kpi_1',
            type: 'kpi_card',
            position: { x: 0, y: 0, width: 3 },
            props: { label: '総顧客数', dataSource: 'count(customers)' },
          },
          // ... 他のコンポーネント
        ],
        order: 1,
      },
      {
        id: 'list',
        name: '顧客一覧',
        path: '/customers',
        layout: { type: 'list' },
        components: [
          {
            id: 'c_table_1',
            type: 'table',
            position: { x: 0, y: 0, width: 12 },
            props: { 
              columns: ['name', 'email', 'status'],
              sortable: true,
            },
            dataSourceId: 'customers',
          },
        ],
        order: 2,
      },
    ],
    dashboard: {
      kpiCards: [
        { id: 'kpi_1', label: '総顧客数', dataSource: 'count(customers)', icon: 'Users' },
        { id: 'kpi_2', label: '今月の新規リード', dataSource: 'count(leads)', icon: 'TrendingUp' },
      ],
      charts: [
        { id: 'chart_1', type: 'bar', title: '売上推移', dataSource: 'sales', xAxis: 'month', yAxis: 'amount' },
      ],
    },
  },
  
  recommendedSchema: {
    columns: [
      { name: 'name', type: 'string', required: true, description: '顧客名' },
      { name: 'email', type: 'string', required: true, description: 'メールアドレス' },
      { name: 'status', type: 'string', required: false, description: 'ステータス' },
    ],
    sampleData: {
      headers: ['name', 'email', 'status'],
      rows: [
        ['株式会社A', 'a@example.com', '商談中'],
        ['株式会社B', 'b@example.com', '成約'],
      ],
    },
  },
}
```

## 6. データ移行・バージョン管理

### 6.1 テンプレートバージョン管理

- テンプレートに`version`フィールドを追加
- アプリに`templateVersion`フィールドを追加（オプション）
- テンプレート更新時は新しいバージョンとして保存
- 既存アプリは古いバージョンのテンプレートを参照し続ける（後方互換性）

### 6.2 テンプレート変更時の注意事項

- テンプレート変更時は、既存のデータソースマッピングを可能な限り保持
- 新しいテンプレートに存在しないコンポーネントは削除
- ユーザーがカスタマイズした部分は可能な限り保持（マージ戦略）

## 7. まとめ

このデータ構造により、以下の要件を満たします：

✅ **ユーザーが自由にテンプレートを変更できる**
- `App.templateId`を更新するだけでテンプレートを変更可能

✅ **テンプレート変更時にUIが自動更新される**
- `Template.uiStructure`にUI構成が定義されているため、自動的に適用可能

✅ **柔軟なカスタマイズ**
- テンプレートは推奨構成であり、ユーザーは自由にカスタマイズ可能

✅ **スケーラブルな設計**
- 新しいテンプレートを追加するだけで、すべてのユーザーが利用可能

