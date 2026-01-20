# セキュリティアーキテクチャ分析と改善提案

## 現在の構造 vs 提案された構造

### 1. アプリの保存場所

#### 現在の構造 ❌
```
apps/{appId}
  - ownerId: string (フィールドで管理)
  - pages/{pageId}
  - dataSources/{sourceId}
  - deployments/{deployId}
```

**問題点:**
- フラットな構造のため、クエリで `where('ownerId', '==', uid)` が必要
- セキュリティルールが複雑になり、漏れが発生しやすい
- 「一覧取得」時に他のユーザーのデータが見えるリスク

#### 提案された構造 ✅
```
users/{uid}/apps/{appId}
  - pages/{pageId}
  - dataSources/{sourceId}
  - deployments/{deployId}
```

**メリット:**
- パス分離により、セキュリティルールがシンプル
- `request.auth.uid == userId` だけで保護可能
- クエリが不要で、パスベースで自動的にフィルタリング

### 2. テンプレートの管理

#### 現在の構造 ✅
```
templates/{templateId}
  - isPublic: boolean
  - vendorId: string
```

**セキュリティルール:**
- 読み込み: `isPublic == true` または `vendorId == uid`
- 書き込み: 管理者のみ、または `vendorId == uid`

**評価:** 適切に設定されています ✅

**改善点:**
- 開発環境用の緩和ルール（`allow write: if request.auth != null && true`）を本番環境で削除する必要があります

### 3. 秘匿情報の管理

#### 現在の構造 ⚠️
```
apps/{appId}/dataSources/{sourceId}
  - type: 'google-sheets'
  - url: string (スプレッドシートURL)
  - config: {
      spreadsheetId?: string
      apiKey?: string
      // トークン類が含まれる可能性
    }
```

**問題点:**
- SheetsのURLやトークンなどの秘匿情報が `dataSources` に含まれている
- アプリのオーナー以外は見えないが、パス分離が不十分

#### 提案された構造 ✅
```
users/{uid}/apps/{appId}/integrations/sheets/{integrationId}
  - read/write: ownerのみ
```

**さらに安全な方法:**
- トークン類はFirestoreに置かず、Cloud Functionsで管理
- または、別の秘匿情報専用コレクションに分離

### 4. 共有（チーム利用）の準備

#### 現在の構造 ⚠️
```
apps/{appId}
  - ownerId: string
  - organizationId?: string
  - (members管理なし)
```

**問題点:**
- 組織メンバーは `organizationId` で判断しているが、明示的なメンバー管理がない
- 将来の共有機能に対応しにくい

#### 提案された構造 ✅
```
users/{uid}/apps/{appId}  (単独所有)
  - または
apps/{appId}  (共有アプリ)
  - ownerId: string
  - members/{uid}
    - role: 'viewer' | 'editor' | 'admin'
```

**メリット:**
- 単独所有と共有を明確に分離
- メンバー権限を柔軟に管理可能

## 改善提案

### 優先度: 高

1. **アプリのパスを `users/{uid}/apps/{appId}` に変更**
   - セキュリティルールを簡素化
   - データ漏洩リスクを最小化

2. **秘匿情報の分離**
   - `dataSources` からトークン類を分離
   - `users/{uid}/apps/{appId}/integrations/` に移動

3. **開発環境用の緩和ルールを削除**
   - `templates` の書き込みルールから `true` を削除
   - 本番環境用のルールファイルを明確に分離

### 優先度: 中

4. **共有機能の準備**
   - `apps/{appId}/members/{uid}` 構造の検討
   - 単独所有と共有の明確な分離

5. **マルチテナント対応の準備**
   - 将来 `tenants/{tenantId}/users/{uid}` への拡張を考慮

## 移行計画

### フェーズ1: アプリのパス変更
1. 新しいパス `users/{uid}/apps/{appId}` でアプリを作成
2. 既存の `apps/{appId}` からデータを移行
3. セキュリティルールを更新
4. クライアントコードを更新

### フェーズ2: 秘匿情報の分離
1. `integrations` サブコレクションを作成
2. `dataSources` からトークン類を移動
3. セキュリティルールを更新

### フェーズ3: 共有機能の実装
1. `members` サブコレクションを追加
2. 共有アプリのパス構造を決定
3. セキュリティルールを更新

## セキュリティルールの改善例

### 現在のルール（apps/{appId}）
```javascript
match /apps/{appId} {
  allow read: if (
    resource.data.ownerId == request.auth.uid ||
    canAccessApp(appId, request.auth.uid)
  );
  allow write: if resource.data.ownerId == request.auth.uid;
}
```

### 改善後のルール（users/{uid}/apps/{appId}）
```javascript
match /users/{userId}/apps/{appId} {
  // シンプルで安全
  allow read, write: if request.auth != null && request.auth.uid == userId;
  
  match /pages/{pageId} {
    allow read, write: if request.auth != null && request.auth.uid == userId;
  }
  
  match /dataSources/{sourceId} {
    allow read, write: if request.auth != null && request.auth.uid == userId;
  }
  
  match /integrations/{integrationId} {
    // 秘匿情報はさらに厳格に
    allow read, write: if request.auth != null && request.auth.uid == userId;
  }
}
```

## 結論

現在の構造は基本的なセキュリティは確保されていますが、**パス分離による構造改善**により、より安全で保守しやすいシステムになります。

特に重要なのは：
1. ✅ **アプリを `users/{uid}/apps/{appId}` に移動** - 最優先
2. ✅ **秘匿情報の分離** - 高優先度
3. ✅ **開発環境用の緩和ルールを削除** - 本番環境前に必須
