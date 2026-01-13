# AppNavi-asset 開発仕様書

## 1. 概要

本仕様書は、`https://tsubasagit.github.io/AppNavi-asset/` からAppNaviアプリケーションにテンプレートを提供するための開発仕様です。

AppNaviアプリケーションは、この外部サイトからテンプレート一覧を取得し、ユーザーに表示します。

## 2. 要件

### 2.1 APIエンドポイント

以下のエンドポイントでテンプレート一覧を提供する必要があります：

```
GET https://tsubasagit.github.io/AppNavi-asset/api/templates.json
```

### 2.2 レスポンス形式

**Content-Type**: `application/json`

**レスポンス形式**:
```json
{
  "templates": [
    {
      "templateId": "crm",
      "name": "顧客管理（CRM）",
      "description": "顧客情報、商談管理、活動履歴を一元管理",
      "category": "営業・マーケティング",
      "color": "purple",
      "version": "1.0.0",
      "isPublic": true,
      "tags": ["営業", "顧客管理", "商談", "CRM"],
      "author": "AppNavi Team",
      "features": ["顧客管理", "商談パイプライン", "活動履歴"],
      "previewImageUrl": "https://tsubasagit.github.io/AppNavi-asset/images/crm-preview.png",
      "demoUrl": "https://tsubasagit.github.io/AppNavi-asset/demos/crm/"
    }
  ]
}
```

## 3. データ構造の詳細

### 3.1 必須フィールド

| フィールド名 | 型 | 説明 | 例 |
|------------|-----|------|-----|
| `templateId` | string | テンプレートの一意の識別子（英数字とハイフンのみ） | `"crm"` |
| `name` | string | テンプレート名（日本語可） | `"顧客管理（CRM）"` |
| `description` | string | テンプレートの説明（日本語可） | `"顧客情報、商談管理、活動履歴を一元管理"` |
| `category` | string | カテゴリ名（日本語可） | `"営業・マーケティング"` |
| `color` | string | テンプレートの色（`purple`, `orange`, `green`, `blue`, `slate`のいずれか） | `"purple"` |
| `version` | string | バージョン番号（セマンティックバージョニング推奨） | `"1.0.0"` |
| `isPublic` | boolean | 公開フラグ（常に`true`を推奨） | `true` |
| `tags` | string[] | タグの配列 | `["営業", "顧客管理", "商談", "CRM"]` |
| `author` | string | 作成者名 | `"AppNavi Team"` |

### 3.2 オプションフィールド

| フィールド名 | 型 | 説明 | 例 |
|------------|-----|------|-----|
| `features` | string[] | 機能のリスト（日本語可） | `["顧客管理", "商談パイプライン", "活動履歴"]` |
| `previewImageUrl` | string | プレビュー画像のURL | `"https://tsubasagit.github.io/AppNavi-asset/images/crm-preview.png"` |
| `demoUrl` | string | デモページのURL | `"https://tsubasagit.github.io/AppNavi-asset/demos/crm/"` |

### 3.3 フィールドの制約

- **`templateId`**: 
  - 英数字とハイフン（`-`）のみ使用可能
  - 小文字推奨
  - 例: `"crm"`, `"inventory-management"`, `"daily-report"`

- **`color`**: 
  - 以下のいずれかの値のみ許可: `"purple"`, `"orange"`, `"green"`, `"blue"`, `"slate"`
  - 大文字・小文字は区別される（小文字推奨）

- **`version`**: 
  - セマンティックバージョニング（`major.minor.patch`）推奨
  - 例: `"1.0.0"`, `"2.1.3"`

- **`tags`**: 
  - 空配列でも可
  - 各タグは文字列（日本語可）

- **`features`**: 
  - 空配列でも可
  - 各機能は文字列（日本語可）
  - AppNaviアプリケーションでは、この配列を「、」で結合してプレビューとして表示

## 4. ファイル配置

### 4.1 ディレクトリ構造

```
AppNavi-asset/
├── api/
│   └── templates.json          # テンプレート一覧API
├── images/
│   ├── crm-preview.png         # テンプレートのプレビュー画像（オプション）
│   └── ...
└── demos/
    ├── crm/                    # デモページ（オプション）
    └── ...
```

### 4.2 templates.jsonの配置

`api/templates.json` ファイルを配置してください。

**パス**: `/api/templates.json`  
**完全URL**: `https://tsubasagit.github.io/AppNavi-asset/api/templates.json`

## 5. CORS設定

### 5.1 要件

AppNaviアプリケーションから外部サイトへのアクセスを許可するため、CORS（Cross-Origin Resource Sharing）の設定が必要です。

### 5.2 GitHub Pagesでの設定方法

GitHub Pagesでホストしている場合、`_headers` ファイルを作成してCORSを許可します。

**ファイルパス**: `_headers`（リポジトリのルートに配置）

**内容**:
```
/api/templates.json
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: GET
  Access-Control-Allow-Headers: Content-Type
```

### 5.3 代替方法

GitHub Pagesで`_headers`ファイルがサポートされていない場合、以下の方法を検討してください：

1. **Netlify/Vercelを使用**: これらのホスティングサービスは`_headers`ファイルをサポート
2. **プロキシサーバー経由**: バックエンドサーバー経由でテンプレートを取得
3. **JSONP**: JSONP形式でテンプレートを提供（非推奨）

## 6. 実装例

### 6.1 最小限の実装例

```json
{
  "templates": [
    {
      "templateId": "crm",
      "name": "顧客管理（CRM）",
      "description": "顧客情報、商談管理、活動履歴を一元管理",
      "category": "営業・マーケティング",
      "color": "purple",
      "version": "1.0.0",
      "isPublic": true,
      "tags": ["営業", "顧客管理", "商談", "CRM"],
      "author": "AppNavi Team"
    }
  ]
}
```

### 6.2 完全な実装例

```json
{
  "templates": [
    {
      "templateId": "crm",
      "name": "顧客管理（CRM）",
      "description": "顧客情報、商談管理、活動履歴を一元管理",
      "category": "営業・マーケティング",
      "color": "purple",
      "version": "1.0.0",
      "isPublic": true,
      "tags": ["営業", "顧客管理", "商談", "CRM"],
      "author": "AppNavi Team",
      "features": [
        "顧客管理",
        "商談パイプライン",
        "活動履歴",
        "KPIダッシュボード"
      ],
      "previewImageUrl": "https://tsubasagit.github.io/AppNavi-asset/images/crm-preview.png",
      "demoUrl": "https://tsubasagit.github.io/AppNavi-asset/demos/crm/"
    },
    {
      "templateId": "inventory",
      "name": "在庫管理",
      "description": "在庫の入出荷、在庫数管理、ロケーション管理",
      "category": "在庫・物流",
      "color": "blue",
      "version": "1.0.0",
      "isPublic": true,
      "tags": ["在庫", "物流", "管理"],
      "author": "AppNavi Team",
      "features": [
        "在庫管理",
        "入出荷管理",
        "ロケーション管理"
      ],
      "previewImageUrl": "https://tsubasagit.github.io/AppNavi-asset/images/inventory-preview.png",
      "demoUrl": "https://tsubasagit.github.io/AppNavi-asset/demos/inventory/"
    }
  ]
}
```

## 7. テンプレートの追加・更新手順

### 7.1 新規テンプレートの追加

1. `api/templates.json` を開く
2. `templates` 配列に新しいテンプレートオブジェクトを追加
3. 必須フィールドをすべて記入
4. オプションフィールドを必要に応じて追加
5. JSONの構文エラーがないか確認
6. GitHubにコミット・プッシュ

### 7.2 既存テンプレートの更新

1. `api/templates.json` を開く
2. 該当するテンプレートオブジェクトを編集
3. `version` フィールドを更新（例: `1.0.0` → `1.0.1`）
4. JSONの構文エラーがないか確認
5. GitHubにコミット・プッシュ

### 7.3 テンプレートの削除

1. `api/templates.json` を開く
2. 該当するテンプレートオブジェクトを削除
3. JSONの構文エラーがないか確認
4. GitHubにコミット・プッシュ

## 8. バリデーション

### 8.1 JSON構文チェック

以下のツールでJSONの構文を確認してください：

- **オンラインツール**: https://jsonlint.com/
- **コマンドライン**: `jq` コマンドを使用
  ```bash
  cat api/templates.json | jq .
  ```

### 8.2 必須フィールドチェック

以下のスクリプトで必須フィールドをチェックできます：

```javascript
const requiredFields = [
  'templateId',
  'name',
  'description',
  'category',
  'color',
  'version',
  'isPublic',
  'tags',
  'author'
]

function validateTemplate(template) {
  const missingFields = requiredFields.filter(field => !template[field])
  if (missingFields.length > 0) {
    throw new Error(`必須フィールドが不足しています: ${missingFields.join(', ')}`)
  }
  
  // colorの値チェック
  const validColors = ['purple', 'orange', 'green', 'blue', 'slate']
  if (!validColors.includes(template.color)) {
    throw new Error(`無効なcolor値: ${template.color}`)
  }
  
  // templateIdの形式チェック
  if (!/^[a-z0-9-]+$/.test(template.templateId)) {
    throw new Error(`無効なtemplateId形式: ${template.templateId}`)
  }
}
```

## 9. エラーハンドリング

### 9.1 AppNavi側の動作

- **ネットワークエラー**: キャッシュがあればキャッシュから読み込み、なければローカルテンプレートのみ表示
- **JSONパースエラー**: エラーログを出力し、ローカルテンプレートのみ表示
- **必須フィールド不足**: 該当テンプレートをスキップし、他のテンプレートは表示

### 9.2 推奨事項

- エラーが発生してもアプリケーションが動作し続けるように、JSONの構文エラーを避ける
- 必須フィールドを必ず記入する
- 定期的にJSONの構文をチェックする

## 10. パフォーマンス

### 10.1 ファイルサイズ

- `templates.json` のファイルサイズは **100KB以下** を推奨
- テンプレート数が多い場合は、ページネーションを検討（現在は未実装）

### 10.2 キャッシュ

- AppNaviアプリケーションは24時間キャッシュを使用
- テンプレートを更新した場合、ユーザーは「外部サイトから更新」ボタンで最新版を取得可能

### 10.3 レスポンス時間

- APIのレスポンス時間は **3秒以内** を推奨
- GitHub Pagesを使用している場合、通常は1秒以内で応答

## 11. セキュリティ

### 11.1 公開情報

- `templates.json` は公開情報として扱われます
- 機密情報は含めないでください

### 11.2 外部リンク

- `previewImageUrl` と `demoUrl` は外部リンクとして扱われます
- 信頼できるURLのみを使用してください

## 12. テスト

### 12.1 ローカルテスト

```bash
# JSONの構文チェック
cat api/templates.json | jq .

# HTTPリクエストのテスト
curl https://tsubasagit.github.io/AppNavi-asset/api/templates.json
```

### 12.2 AppNaviアプリケーションでのテスト

1. AppNaviアプリケーションを起動
2. アプリの「方針」タブを開く
3. 「外部サイトから更新」ボタンをクリック
4. テンプレートが正しく表示されるか確認

## 13. トラブルシューティング

### 13.1 テンプレートが表示されない

**原因**:
- JSONの構文エラー
- 必須フィールドの不足
- CORS設定の問題

**解決方法**:
1. JSONの構文をチェック
2. 必須フィールドを確認
3. `_headers` ファイルが正しく配置されているか確認

### 13.2 CORSエラー

**エラーメッセージ**:
```
Access to fetch at 'https://tsubasagit.github.io/AppNavi-asset/api/templates.json' from origin '...' has been blocked by CORS policy
```

**解決方法**:
1. `_headers` ファイルを作成・配置
2. GitHub Pagesの設定を確認
3. 必要に応じてNetlify/Vercelなどのホスティングサービスに移行

### 13.3 キャッシュの問題

**症状**: テンプレートを更新したが、AppNaviアプリケーションに反映されない

**解決方法**:
1. AppNaviアプリケーションで「外部サイトから更新」ボタンをクリック（強制更新）
2. ブラウザのキャッシュをクリア
3. 24時間待つ（キャッシュの有効期限が切れるまで）

## 14. 連絡先・サポート

### 14.1 質問・問題報告

- GitHub Issues: `https://github.com/tsubasagit/AppNavi-asset/issues`
- メール: （必要に応じて追加）

### 14.2 更新履歴

- 2024-01-11: 初版作成

## 15. 付録

### 15.1 完全なテンプレート例（複数）

```json
{
  "templates": [
    {
      "templateId": "crm",
      "name": "顧客管理（CRM）",
      "description": "顧客情報、商談管理、活動履歴を一元管理",
      "category": "営業・マーケティング",
      "color": "purple",
      "version": "1.0.0",
      "isPublic": true,
      "tags": ["営業", "顧客管理", "商談", "CRM"],
      "author": "AppNavi Team",
      "features": ["顧客管理", "商談パイプライン", "活動履歴"],
      "previewImageUrl": "https://tsubasagit.github.io/AppNavi-asset/images/crm-preview.png",
      "demoUrl": "https://tsubasagit.github.io/AppNavi-asset/demos/crm/"
    },
    {
      "templateId": "inventory",
      "name": "在庫管理",
      "description": "在庫の入出荷、在庫数管理、ロケーション管理",
      "category": "在庫・物流",
      "color": "blue",
      "version": "1.0.0",
      "isPublic": true,
      "tags": ["在庫", "物流", "管理"],
      "author": "AppNavi Team",
      "features": ["在庫管理", "入出荷管理", "ロケーション管理"],
      "previewImageUrl": "https://tsubasagit.github.io/AppNavi-asset/images/inventory-preview.png",
      "demoUrl": "https://tsubasagit.github.io/AppNavi-asset/demos/inventory/"
    },
    {
      "templateId": "daily-report",
      "name": "日報・活動報告",
      "description": "日々の活動を記録し、チーム内で共有",
      "category": "業務管理",
      "color": "green",
      "version": "1.0.0",
      "isPublic": true,
      "tags": ["日報", "活動報告", "業務管理"],
      "author": "AppNavi Team",
      "features": ["日報作成", "活動記録", "チーム共有"],
      "previewImageUrl": "https://tsubasagit.github.io/AppNavi-asset/images/daily-report-preview.png",
      "demoUrl": "https://tsubasagit.github.io/AppNavi-asset/demos/daily-report/"
    }
  ]
}
```

### 15.2 _headersファイルの完全な例

```
/api/templates.json
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: GET, OPTIONS
  Access-Control-Allow-Headers: Content-Type
  Cache-Control: public, max-age=3600

/images/*
  Access-Control-Allow-Origin: *
  Cache-Control: public, max-age=86400
```

---

**作成日**: 2024-01-11  
**バージョン**: 1.0.0  
**対象**: AppNavi-asset開発チーム
