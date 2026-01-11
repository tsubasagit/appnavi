# テンプレート作成ガイド

## 概要

Firestoreにテンプレート（CRM、Googleカレンダー管理）を作成する方法を説明します。

## 方法1: ブラウザコンソールから実行（推奨）

### 手順

1. **アプリにログイン**
   - 管理者権限を持つアカウントでログインしてください

2. **開発者ツールを開く**
   - ブラウザの開発者ツール（F12）を開く
   - 「Console」タブを選択

3. **スクリプトを実行**
   - `scripts/create-templates.js`の内容をコピー
   - コンソールに貼り付けて実行
   - または、以下のコマンドを実行：

```javascript
// スクリプトを読み込んで実行
(async () => {
  const response = await fetch('/scripts/create-templates.js')
  const script = await response.text()
  eval(script)
  await createTemplates()
})()
```

## 方法2: Firebase Consoleから直接作成

### CRMテンプレート

1. Firebase Consoleを開く
2. Firestore Databaseに移動
3. `templates`コレクションを作成（存在しない場合）
4. ドキュメントID `crm` で新規ドキュメントを作成
5. 以下のJSONデータをコピー＆ペースト：

```json
{
  "templateId": "crm",
  "name": "顧客管理（CRM）",
  "description": "顧客情報、商談管理、活動履歴を一元管理",
  "category": "営業・マーケティング",
  "color": "#8b5cf6",
  "isPublic": true,
  "tags": ["営業", "顧客管理", "商談", "CRM"],
  "version": "1.0.0",
  "uiStructure": {
    "theme": {
      "primaryColor": "#8b5cf6",
      "fontFamily": "Inter",
      "borderRadius": "8px",
      "darkMode": true
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
            "position": { "x": 0, "y": 0, "width": 3 },
            "props": {
              "label": "総顧客数",
              "dataSource": "count(customers)",
              "icon": "Users",
              "format": "number"
            }
          },
          {
            "id": "c_table_1",
            "type": "table",
            "position": { "x": 0, "y": 1, "width": 12 },
            "props": {
              "columns": ["顧客名", "会社名", "メールアドレス", "ステータス", "最終接触日"],
              "sortable": true,
              "searchable": true
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
          "icon": "Users",
          "format": "number"
        }
      ],
      "layout": "grid"
    }
  },
  "recommendedSchema": {
    "columns": [
      {
        "name": "顧客名",
        "type": "string",
        "required": true,
        "description": "顧客の名前",
        "example": "山田太郎"
      },
      {
        "name": "会社名",
        "type": "string",
        "required": false,
        "description": "顧客の会社名",
        "example": "株式会社サンプル"
      },
      {
        "name": "メールアドレス",
        "type": "string",
        "required": false,
        "description": "連絡先メールアドレス",
        "example": "yamada@example.com"
      },
      {
        "name": "電話番号",
        "type": "string",
        "required": false,
        "description": "連絡先電話番号",
        "example": "090-1234-5678"
      },
      {
        "name": "ステータス",
        "type": "string",
        "required": false,
        "description": "顧客ステータス（見込み、既存など）",
        "example": "既存顧客"
      },
      {
        "name": "最終接触日",
        "type": "date",
        "required": false,
        "description": "最後に連絡した日付",
        "example": "2024-01-15"
      }
    ],
    "sampleData": {
      "headers": ["顧客名", "会社名", "メールアドレス", "電話番号", "ステータス", "最終接触日"],
      "rows": [
        ["山田太郎", "株式会社サンプル", "yamada@example.com", "090-1234-5678", "既存顧客", "2024-01-15"],
        ["佐藤花子", "サンプル商事", "sato@example.com", "080-2345-6789", "見込み", "2024-01-20"]
      ]
    }
  }
}
```

### Googleカレンダー管理テンプレート

同様に、ドキュメントID `google-calendar-group` で新規ドキュメントを作成し、以下のJSONデータを使用：

（完全なJSONデータは `scripts/create-templates.js` を参照してください）

## 方法3: プログラムから実行

`src/utils/firestore.ts`の`createTemplate`関数を使用：

```typescript
import { createTemplate } from './utils/firestore'

// CRMテンプレートを作成
await createTemplate('crm', {
  templateId: 'crm',
  name: '顧客管理（CRM）',
  // ... その他のフィールド
})
```

## 注意事項

- **管理者権限が必要**: テンプレートの作成には管理者権限が必要です
- **セキュリティルール**: Firestoreのセキュリティルールで書き込み権限を確認してください
- **データ検証**: 作成後、Firebase Consoleでデータが正しく保存されているか確認してください

## 確認方法

作成後、以下の方法で確認できます：

1. **Firebase Console**: Firestore Databaseの`templates`コレクションを確認
2. **アプリ内**: テンプレート選択画面で新しいテンプレートが表示されるか確認


