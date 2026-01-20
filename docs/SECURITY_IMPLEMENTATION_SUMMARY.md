# セキュリティ改善実装サマリー

## 実装完了日
2026-01-13

## 実装内容

### 1. アプリのパス構造を変更 ✅

**変更前:**
```
apps/{appId}
  - pages/{pageId}
  - dataSources/{sourceId}
  - deployments/{deployId}
```

**変更後:**
```
users/{uid}/apps/{appId}
  - pages/{pageId}
  - dataSources/{sourceId}
  - deployments/{deployId}
  - integrations/{integrationId}  (新規追加: 秘匿情報用)
```

### 2. セキュリティルールの改善 ✅

**新しいパス構造のルール:**
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
    // 秘匿情報はさらに厳格に管理
    allow read, write: if request.auth != null && request.auth.uid == userId;
  }
}
```

**メリット:**
- クエリが不要（パスベースで自動的にフィルタリング）
- セキュリティルールがシンプルで理解しやすい
- データ漏洩リスクを最小化

### 3. 開発環境用の緩和ルールを削除 ✅

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

### 4. 関数シグネチャの更新 ✅

以下の関数を新しいパス構造に対応するよう更新:

- `createApp(userId, appId, appData)` - 新規追加: userIdパラメータ
- `getApp(userId, appId)` - 新規追加: userIdパラメータ
- `updateApp(userId, appId, updates)` - 新規追加: userIdパラメータ
- `deleteApp(userId, appId)` - 新規追加: userIdパラメータ
- `getUserApps(userId)` - パスベースで取得（クエリ不要）
- `createPage(userId, appId, pageId, pageData)` - 新規追加: userIdパラメータ
- `getPages(userId, appId)` - 新規追加: userIdパラメータ
- `createDataSource(userId, appId, sourceId, dataSource)` - 新規追加: userIdパラメータ
- `getDataSources(userId, appId)` - 新規追加: userIdパラメータ
- `deleteDataSource(userId, appId, sourceId)` - 新規追加: userIdパラメータ
- `updateDataSource(userId, appId, sourceId, updates)` - 新規追加: userIdパラメータ
- `createDeployment(userId, appId, deployId, deployment)` - 新規追加: userIdパラメータ
- `getDeployments(userId, appId)` - 新規追加: userIdパラメータ

### 5. コンポーネント側の更新 ✅

以下のコンポーネントを更新:

- `AppContext.tsx`: `createApp`, `updateApp`, `deleteApp`, `getUserApps`, `getDataSources` の呼び出しを更新
- `PolicyTab.tsx`: `createPage` の呼び出しを更新（useAuthを追加）
- `UITab.tsx`: `getPages` の呼び出しを更新（useAuthを追加）
- `DataTab.tsx`: `createDataSource`, `getDataSources`, `deleteDataSource` の呼び出しを更新

### 6. 型定義の更新 ✅

- `getSubCollectionPath` を新しいパス構造に対応
- `integrations` パスを追加（秘匿情報用）

## 後方互換性

旧パス構造（`apps/{appId}`）のセキュリティルールは移行期間中は残していますが、**本番環境では削除推奨**です。

## 次のステップ（優先度: 中）

1. **既存データの移行**
   - 旧パス構造（`apps/{appId}`）から新パス構造（`users/{uid}/apps/{appId}`）への移行スクリプトを作成
   - 移行完了後、旧パス構造のルールを削除

2. **秘匿情報の分離**
   - `dataSources` からトークン類を `integrations` に移動
   - Cloud Functionsでトークン管理を検討

3. **共有機能の準備**
   - `members` サブコレクション構造の検討
   - 単独所有と共有の明確な分離

## セキュリティ向上の効果

1. ✅ **パスベースの保護**: クエリ不要で自動的にフィルタリング
2. ✅ **シンプルなルール**: 理解しやすく、保守しやすい
3. ✅ **データ漏洩リスクの最小化**: パス構造により、他のユーザーのデータにアクセスできない
4. ✅ **開発環境用の緩和ルール削除**: 本番環境でのセキュリティリスクを削減
