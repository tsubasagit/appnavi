# テンプレートデータ構造（公開版）

## 概要

AppNaviのテンプレートシステムにおけるFirebase Firestoreのデータ構造定義です。ユーザーが自由にテンプレートを選択・変更でき、テンプレート変更時にUIが自動的に更新される仕様を実現します。

## Firestoreコレクション構造

### コレクション: `templates`

**パス**: `/templates/{templateId}`

**説明**: すべてのユーザーが利用可能なテンプレート定義を格納するパブリックコレクション

## データ型定義

### Template（テンプレート基本情報）

```typescript
interface Template {
  // 基本情報
  templateId: string                    // テンプレートID（例: 'crm', 'inventory'）
  name: string                          // テンプレート名
  description: string                   // 説明文
  category: string                      // カテゴリ
  
  // 表示用情報
  iconUrl?: string                      // アイコン画像URL
  previewImageUrl?: string              // プレビュー画像URL
  color: string                         // テーマカラー（例: '#8b5cf6'）
  
  // メタデータ
  vendorId?: string                     // ベンダーID（システム提供の場合は空）
  isPublic: boolean                     // 公開フラグ
  tags: string[]                        // タグ（検索・フィルタ用）
  
  // UI構成（テンプレート変更時に適用される）
  uiStructure: TemplateUIStructure      // UI構成定義
  
  // データ構造の推奨
  recommendedSchema?: RecommendedSchema  // 推奨データスキーマ
  
  // 管理情報
  version: string                        // テンプレートバージョン
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### TemplateUIStructure（UI構成）

```typescript
interface TemplateUIStructure {
  // テーマ設定
  theme: {
    primaryColor: string                 // プライマリカラー
    secondaryColor?: string              // セカンダリカラー
    fontFamily?: string                  // フォントファミリー
    borderRadius?: string                // 角丸
    darkMode?: boolean                   // ダークモード対応
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

### TemplatePage（ページ定義）

```typescript
interface TemplatePage {
  id: string                             // ページID（例: 'dashboard', 'list'）
  name: string                           // ページ名
  path: string                           // パス（例: '/', '/list'）
  layout: {
    type: 'grid' | 'flex' | 'list'       // レイアウトタイプ
    columns?: number                     // グリッド列数
    gap?: string                         // 間隔
  }
  
  // コンポーネント構成
  components: TemplateComponent[]         // ページ内のコンポーネント
  
  // データソースマッピング
  dataSourceMapping?: {
    [componentId: string]: {
      dataSourceId?: string
      columnMapping?: Record<string, string>
    }
  }
  
  order: number                          // 表示順序
}
```

### TemplateComponent（コンポーネント定義）

```typescript
interface TemplateComponent {
  id: string                             // コンポーネントID
  type: TemplateComponentType            // コンポーネントタイプ
  
  // 位置・サイズ
  position: {
    x: number                            // X座標
    y: number                            // Y座標
    width?: number                       // 幅（グリッド列数）
    height?: number                      // 高さ（グリッド行数）
  }
  
  // プロパティ
  props: Record<string, any>             // コンポーネント固有のプロパティ
  
  // データソース関連
  dataSourceId?: string
  dataMapping?: {
    [key: string]: string                // プロパティ名 -> データ列名
  }
}

type TemplateComponentType = 
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

### RecommendedSchema（推奨データスキーマ）

```typescript
interface RecommendedSchema {
  // 推奨カラム定義
  columns: RecommendedColumn[]
  
  // サンプルデータ（オプション）
  sampleData?: {
    headers: string[]
    rows: string[][]
  }
  
  // データ型の説明
  dataTypes?: Record<string, string>
}

interface RecommendedColumn {
  name: string
  type: 'string' | 'number' | 'date' | 'boolean'
  required: boolean
  description: string
  example?: string
}
```

### KPICardConfig（KPIカード設定）

```typescript
interface KPICardConfig {
  id: string
  label: string                          // ラベル（例: '総顧客数'）
  dataSource: string                     // データソース（例: 'count(customers)'）
  icon?: string                          // アイコン名
  format?: 'number' | 'currency' | 'percentage'
  color?: string
}
```

### ChartConfig（グラフ設定）

```typescript
interface ChartConfig {
  id: string
  type: 'bar' | 'line' | 'pie' | 'area'
  title: string
  dataSource: string
  xAxis?: string                         // X軸カラム名
  yAxis?: string                         // Y軸カラム名
  groupBy?: string                       // グループ化カラム
}
```

## アプリとテンプレートの関連

### App型への追加フィールド

```typescript
interface App {
  // ... 既存のフィールド ...
  templateId: string                     // 現在選択されているテンプレートID
  templateVersion?: string               // テンプレートバージョン（オプション）
}
```

## データ例

### CRMテンプレートの例

```json
{
  "templateId": "crm",
  "name": "顧客管理（CRM）",
  "description": "顧客情報、商談管理、活動履歴を一元管理",
  "category": "営業・マーケティング",
  "color": "#8b5cf6",
  "isPublic": true,
  "tags": ["営業", "顧客管理", "商談"],
  "version": "1.0.0",
  "uiStructure": {
    "theme": {
      "primaryColor": "#8b5cf6",
      "fontFamily": "Inter",
      "borderRadius": "8px"
    },
    "pages": [
      {
        "id": "dashboard",
        "name": "ダッシュボード",
        "path": "/",
        "layout": {
          "type": "grid",
          "columns": 12,
          "gap": "16px"
        },
        "components": [
          {
            "id": "c_kpi_1",
            "type": "kpi_card",
            "position": {
              "x": 0,
              "y": 0,
              "width": 3
            },
            "props": {
              "label": "総顧客数",
              "dataSource": "count(customers)"
            }
          },
          {
            "id": "c_table_1",
            "type": "table",
            "position": {
              "x": 0,
              "y": 1,
              "width": 12
            },
            "props": {
              "columns": ["name", "email", "status"],
              "sortable": true
            },
            "dataSourceId": "customers"
          }
        ],
        "order": 1
      }
    ],
    "dashboard": {
      "kpiCards": [
        {
          "id": "kpi_1",
          "label": "総顧客数",
          "dataSource": "count(customers)",
          "icon": "Users"
        }
      ],
      "charts": [
        {
          "id": "chart_1",
          "type": "bar",
          "title": "売上推移",
          "dataSource": "sales",
          "xAxis": "month",
          "yAxis": "amount"
        }
      ]
    }
  },
  "recommendedSchema": {
    "columns": [
      {
        "name": "name",
        "type": "string",
        "required": true,
        "description": "顧客名"
      },
      {
        "name": "email",
        "type": "string",
        "required": true,
        "description": "メールアドレス"
      },
      {
        "name": "status",
        "type": "string",
        "required": false,
        "description": "ステータス"
      }
    ],
    "sampleData": {
      "headers": ["name", "email", "status"],
      "rows": [
        ["株式会社A", "a@example.com", "商談中"],
        ["株式会社B", "b@example.com", "成約"]
      ]
    }
  }
}
```

## セキュリティルール

### 読み取り権限

```javascript
// templatesコレクションは全ユーザーが読み取り可能
match /templates/{templateId} {
  allow read: if request.auth != null || resource.data.isPublic == true;
  allow write: if request.auth != null && 
    (request.auth.uid == resource.data.vendorId || 
     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
}
```

### 書き込み権限

- **システム管理者**: すべてのテンプレートを作成・更新・削除可能
- **ベンダー**: 自分のテンプレートのみ作成・更新・削除可能
- **一般ユーザー**: 読み取りのみ

## テンプレート変更時の処理フロー

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

## 特徴

✅ **ユーザーが自由にテンプレートを変更できる**
- `App.templateId`を更新するだけでテンプレートを変更可能

✅ **テンプレート変更時にUIが自動更新される**
- `Template.uiStructure`にUI構成が定義されているため、自動的に適用可能

✅ **柔軟なカスタマイズ**
- テンプレートは推奨構成であり、ユーザーは自由にカスタマイズ可能

✅ **スケーラブルな設計**
- 新しいテンプレートを追加するだけで、すべてのユーザーが利用可能

## 関連ドキュメント

- [Firestoreセキュリティルール](./FIRESTORE_SECURITY_RULES.md)
- [データストレージとテンプレート設計](./DATA_STORAGE_AND_TEMPLATE_DESIGN.md)

