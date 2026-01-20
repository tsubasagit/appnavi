# Firebaseセキュリティルールのデプロイ手順

## 更新内容

以下のセキュリティ改善を実装しました：

1. **新しいパス構造**: `users/{uid}/apps/{appId}` に対応
2. **開発環境用の緩和ルール削除**: `templates` の書き込みルールから `true` を削除

## デプロイ方法

### 方法1: Firebase CLI（推奨）

```bash
# プロジェクトを選択
firebase use appnavi-add7e

# セキュリティルールをデプロイ
firebase deploy --only firestore:rules
```

### 方法2: Firebaseコンソール（手動）

1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. プロジェクト `appnavi-add7e` を選択
3. 左メニューから **Firestore Database** を選択
4. **ルール** タブをクリック
5. `firestore.rules` の内容をコピー＆ペースト
6. **公開** ボタンをクリック

### 方法3: 本番環境用ルール

本番環境では `firestore.rules.production` を使用してください：

```bash
# 本番環境用ルールをデプロイ
firebase deploy --only firestore:rules --project appnavi-add7e
```

または、Firebaseコンソールで `firestore.rules.production` の内容をコピー＆ペーストしてください。

## 更新されたルールの主な変更点

### 1. 新しいパス構造の追加

```javascript
match /users/{userId}/apps/{appId} {
  // シンプルで安全: パスベースで自動的にフィルタリング
  allow read, write: if request.auth != null && request.auth.uid == userId;
  
  match /pages/{pageId} {
    allow read, write: if request.auth != null && request.auth.uid == userId;
  }
  
  match /dataSources/{sourceId} {
    allow read, write: if request.auth != null && request.auth.uid == userId;
  }
  
  match /integrations/{integrationId} {
    // 秘匿情報用（将来の拡張）
    allow read, write: if request.auth != null && request.auth.uid == userId;
  }
}
```

### 2. 開発環境用の緩和ルール削除

**変更前:**
```javascript
allow write: if request.auth != null && (
  // ... 管理者・ベンダーのチェック ...
  true  // ⚠️ 開発環境用の緩和
);
```

**変更後:**
```javascript
allow write: if request.auth != null && (
  // 管理者はすべてのテンプレートを書き込み可能
  get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin' ||
  // ベンダーは自分のテンプレートのみ書き込み可能
  (resource.data.vendorId != null && resource.data.vendorId == request.auth.uid) ||
  // 新規作成時: ベンダーは自分のvendorIdを設定したテンプレートのみ作成可能
  (request.resource.data.vendorId != null && request.resource.data.vendorId == request.auth.uid)
);
```

## 注意事項

1. **後方互換性**: 旧パス構造（`apps/{appId}`）のルールは移行期間中は残していますが、本番環境では削除推奨です。

2. **権限エラーが発生する場合**: 
   - Firebaseプロジェクトのオーナーまたは編集者権限が必要です
   - Firebase CLIでログインしていることを確認: `firebase login:list`
   - プロジェクトへのアクセス権限を確認してください

3. **ルールの検証**: デプロイ前に、Firebaseコンソールの「ルールプレイグラウンド」でテストすることを推奨します。

## デプロイ後の確認

1. Firebaseコンソールでルールが正しくデプロイされているか確認
2. アプリケーションで新しいパス構造（`users/{uid}/apps/{appId}`）が正常に動作するか確認
3. 旧パス構造（`apps/{appId}`）のデータが正常に動作するか確認（移行期間中）
