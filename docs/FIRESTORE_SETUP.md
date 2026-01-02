# Firestore データベースセットアップガイド

このドキュメントは、AppNaviのFirestoreデータベース構造をセットアップするためのガイドです。

## 基本方針

AppNaviの最大の特徴は **"BYOD (Bring Your Own Data)"** です。
- 顧客の業務データ（顧客リスト、売上明細などの行データ）はFirestoreには保存しません
- Firestoreは「そのデータをどう表示するか」「どのデータを読み込むか」という**設定情報（メタデータ）**のみを管理します

## コレクション構造

### 1. ユーザー・組織管理

#### `users` コレクション
- **ドキュメントID**: `{uid}` (Firebase AuthのUID)
- **フィールド**:
  - `email`: string - メールアドレス
  - `role`: 'user' | 'vendor' | 'admin' - ユーザーロール
  - `displayName`: string (optional) - 表示名
  - `avatar`: string (optional) - アバターURL
  - `createdAt`: Timestamp
  - `updatedAt`: Timestamp

#### `organizations` コレクション
- **ドキュメントID**: `{orgId}` (自動生成)
- **フィールド**:
  - `name`: string - 会社名
  - `plan`: 'free' | 'pro' | 'enterprise' - プラン
  - `ownerId`: string - オーナーのUID
  - `memberIds`: string[] - メンバーのUIDリスト
  - `createdAt`: Timestamp
  - `updatedAt`: Timestamp

### 2. アプリケーション定義

#### `apps` コレクション
- **ドキュメントID**: `{appId}` (自動生成)
- **フィールド**:
  - `title`: string - アプリ名
  - `ownerId`: string - 作成者のUID
  - `organizationId`: string (optional) - 組織ID
  - `theme`: object - テーマ設定
    - `primaryColor`: string
    - `secondaryColor`: string (optional)
    - `fontFamily`: string (optional)
    - `borderRadius`: string (optional)
    - `darkMode`: boolean (optional)
  - `deployedVersion`: string (optional) - 本番公開中のバージョンID
  - `createdAt`: Timestamp
  - `updatedAt`: Timestamp

#### `apps/{appId}/pages` サブコレクション
- **ドキュメントID**: `{pageId}` (自動生成)
- **フィールド**:
  - `title`: string - ページ名
  - `layout`: object - グリッド配置情報 (JSON)
  - `components`: array - 配置されたコンポーネントのリスト
  - `order`: number - 表示順序
  - `createdAt`: Timestamp
  - `updatedAt`: Timestamp

#### `apps/{appId}/dataSources` サブコレクション
- **ドキュメントID**: `{sourceId}` (自動生成)
- **フィールド**:
  - `type`: 'google_sheet' | 'excel' | 'csv' | 'api' - データソースタイプ
  - `name`: string - データソース名
  - `config`: object - データソース設定
    - Google Sheetsの場合: `spreadsheetId`, `sheetName`, `range`
    - Excel/CSVの場合: `fileUrl`
    - APIの場合: `apiEndpoint`, `apiKey`, `headers`
  - `createdAt`: Timestamp
  - `updatedAt`: Timestamp

#### `apps/{appId}/deployments` サブコレクション
- **ドキュメントID**: `{deployId}` (自動生成)
- **フィールド**:
  - `environment`: 'dev' | 'prod' - 環境
  - `version`: string - バージョン
  - `deployedAt`: Timestamp
  - `deployedBy`: string - デプロイしたユーザーのUID
  - `status`: 'success' | 'failed' | 'pending' - ステータス
  - `buildId`: string (optional) - ビルドID
  - `errorMessage`: string (optional) - エラーメッセージ

### 3. マーケットプレイス・ベンダー資産

#### `plugins` コレクション
- **ドキュメントID**: `{pluginId}` (自動生成)
- **フィールド**:
  - `vendorId`: string - 作成ベンダーのUID
  - `name`: string - プラグイン名
  - `description`: string - 説明
  - `category`: string - カテゴリ
  - `latestVersion`: string - 最新バージョン
  - `assetUrl`: string - appnavi-assets.com上のJSファイルURL
  - `iconUrl`: string (optional) - アイコンURL
  - `tags`: string[] - タグ
  - `isPublic`: boolean - 公開フラグ
  - `createdAt`: Timestamp
  - `updatedAt`: Timestamp

#### `plugins/{pluginId}/versions` サブコレクション
- **ドキュメントID**: `{version}` (例: "1.0.0")
- **フィールド**:
  - `changelog`: string - 更新履歴
  - `dependencies`: object - 依存関係
  - `assetUrl`: string - アセットURL
  - `publishedAt`: Timestamp
  - `publishedBy`: string - 公開したユーザーのUID

#### `templates` コレクション
- **ドキュメントID**: `{templateId}` (自動生成)
- **フィールド**:
  - `templateId`: string - テンプレートID（既存のテンプレートIDと一致）
  - `category`: string - 業種・用途
  - `name`: string - テンプレート名
  - `description`: string - 説明
  - `structure`: object - アプリ構造のコピー元データ
  - `vendorId`: string (optional) - 作成ベンダーのUID
  - `isPublic`: boolean - 公開フラグ
  - `iconUrl`: string (optional) - アイコンURL
  - `tags`: string[] - タグ
  - `createdAt`: Timestamp
  - `updatedAt`: Timestamp

### 4. システム設定・その他

#### `system_settings` コレクション
- **ドキュメントID**: `global` (固定)
- **フィールド**:
  - `maintenanceMode`: boolean - メンテナンスモード
  - `maintenanceMessage`: string (optional) - メンテナンスメッセージ
  - `announcements`: array - お知らせリスト
  - `featureFlags`: object - 機能フラグ
  - `updatedAt`: Timestamp

#### `feedback` コレクション
- **ドキュメントID**: 自動生成
- **フィールド**:
  - `userId`: string (optional) - ユーザーID
  - `email`: string (optional) - メールアドレス
  - `type`: 'bug' | 'feature' | 'question' | 'other' - フィードバックタイプ
  - `subject`: string - 件名
  - `message`: string - メッセージ
  - `userAgent`: string (optional) - ユーザーエージェント
  - `url`: string (optional) - URL
  - `status`: 'new' | 'in-progress' | 'resolved' | 'closed' - ステータス
  - `createdAt`: Timestamp

## セキュリティルールの例

```javascript
rules_version = '2';
service cloud.firestore {
  // ヘルパー関数: ユーザーが組織のメンバーかどうかをチェック
  function isOrganizationMember(orgId, userId) {
    let org = get(/databases/$(database)/documents/organizations/$(orgId));
    return org != null && (
      org.data.ownerId == userId ||
      userId in org.data.memberIds
    );
  }
  
  // ヘルパー関数: ユーザーがアプリにアクセス可能かどうかをチェック
  function canAccessApp(appId, userId) {
    let app = get(/databases/$(database)/documents/apps/$(appId));
    return app != null && (
      app.data.ownerId == userId ||
      (app.data.organizationId != null && isOrganizationMember(app.data.organizationId, userId))
    );
  }
  
  match /databases/{database}/documents {
    // ユーザーは自分のデータのみ読み書き可能
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // アプリはオーナーのみ書き込み可能、読み込みはオーナーまたは組織メンバーのみ
    match /apps/{appId} {
      // 読み込み: オーナーまたは組織メンバーのみ
      allow read: if request.auth != null && canAccessApp(appId, request.auth.uid);
      
      // 書き込み: オーナーのみ
      allow write: if request.auth != null && 
        (resource == null || resource.data.ownerId == request.auth.uid);
      
      match /pages/{pageId} {
        // 親アプリの読み込み権限と同じ
        allow read: if request.auth != null && canAccessApp(appId, request.auth.uid);
        allow write: if request.auth != null && 
          get(/databases/$(database)/documents/apps/$(appId)).data.ownerId == request.auth.uid;
      }
      
      match /dataSources/{sourceId} {
        // 親アプリの読み込み権限と同じ
        allow read: if request.auth != null && canAccessApp(appId, request.auth.uid);
        allow write: if request.auth != null && 
          get(/databases/$(database)/documents/apps/$(appId)).data.ownerId == request.auth.uid;
      }
      
      match /deployments/{deployId} {
        // 親アプリの読み込み権限と同じ
        allow read: if request.auth != null && canAccessApp(appId, request.auth.uid);
        allow write: if request.auth != null && 
          get(/databases/$(database)/documents/apps/$(appId)).data.ownerId == request.auth.uid;
      }
    }
    
    // 組織はメンバーまたはオーナーのみ読み書き可能
    match /organizations/{orgId} {
      allow read: if request.auth != null && isOrganizationMember(orgId, request.auth.uid);
      allow write: if request.auth != null && 
        resource.data.ownerId == request.auth.uid;
    }
    
    // プラグインとテンプレートは公開されているものは全員読み込み可能
    match /plugins/{pluginId} {
      allow read: if resource.data.isPublic == true || 
        (request.auth != null && resource.data.vendorId == request.auth.uid);
      allow write: if request.auth != null && 
        resource.data.vendorId == request.auth.uid;
    }
    
    match /templates/{templateId} {
      allow read: if resource.data.isPublic == true;
      allow write: if request.auth != null;
    }
    
    // システム設定は管理者のみ
    match /system_settings/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // フィードバックは全員が作成可能、管理者のみ読み込み可能
    match /feedback/{feedbackId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## 初期データの作成

Firebase Consoleから手動で作成するか、以下のようなスクリプトを使用して初期データを作成できます。

### システム設定の初期化

```typescript
import { updateSystemSettings } from './utils/firestore'

await updateSystemSettings({
  maintenanceMode: false,
  announcements: [],
  featureFlags: {
    enableVendorMode: true,
    enableMarketplace: true,
  }
})
```

## 注意事項

### 保存してはいけないデータ

以下のデータは、コスト増大および「ベンダーロックインの恐怖（No Fear違反）」につながるため、Firestoreには保存しません：

1. **スプレッドシートの中身（行データ）**
   - ❌ NG: `apps/{id}/data/rows` にExcelの全行をコピーする
   - ✅ OK: フロントエンドでGoogle Sheets APIを叩き、オンメモリで表示する

2. **アップロードされたCSVの生データ**
   - ❌ NG: Firestoreのフィールドに巨大な配列として保存
   - ✅ OK: Cloud Storage for Firebaseにファイルを置き、FirestoreにはそのURLだけを保存する

## 関連ファイル

- 型定義: `src/types/firestore.ts`
- ユーティリティ: `src/utils/firestore.ts`

