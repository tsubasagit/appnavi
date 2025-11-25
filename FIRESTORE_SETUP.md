# Firestore Database 設定ガイド

## 現在の状態

✅ Firebaseプロジェクト作成済み
✅ Google認証有効化済み
✅ Firebase設定値反映済み

## 次のステップ

### 1. Firestore Databaseの作成

1. [Firebase Console](https://console.firebase.google.com/)にアクセス
2. プロジェクト「appnavi-add7e」を選択
3. 左側メニューから「Firestore Database」を選択
4. 「データベースを作成」をクリック（まだ作成していない場合）

### 2. セキュリティルールの選択

データベース作成時に、セキュリティルールを選択します：

#### オプション1: 開発モード（テスト用）

- **推奨**: 初回テスト時のみ
- **注意**: 本番環境では使用しないでください
- すべての読み書きが許可されます

#### オプション2: 本番モード（推奨）

- **推奨**: 本番環境用
- セキュリティルールを設定する必要があります
- 以下のルールを設定してください

### 3. ロケーションの選択

- **推奨**: `asia-northeast1` (東京)
- 日本からのアクセスが最も高速
- 一度設定したら変更できません

### 4. セキュリティルールの設定（本番モードの場合）

Firestore Databaseの「ルール」タブで、以下のルールを設定してください：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ユーザーは自分のアプリのみ読み書き可能
    match /apps/{appId} {
      // 読み取り: データのuserIdがリクエストのuserIdと一致する場合のみ
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      
      // 作成: リクエストのuserIdがデータのuserIdと一致する場合のみ
      allow create: if request.auth != null && 
                       request.resource.data.userId == request.auth.uid;
      
      // 更新: 既存データのuserIdがリクエストのuserIdと一致する場合のみ
      allow update: if request.auth != null && 
                       resource.data.userId == request.auth.uid &&
                       request.resource.data.userId == request.auth.uid;
      
      // 削除: データのuserIdがリクエストのuserIdと一致する場合のみ
      allow delete: if request.auth != null && 
                       resource.data.userId == request.auth.uid;
    }
  }
}
```

**重要**: 現在のAppNaviIDシステムでは、クライアント側でAppNaviIDによるフィルタリングを行っています。上記のルールは、Firebase Authenticationを使用する場合の追加セキュリティ層です。

### 5. インデックスの作成（必要に応じて）

複合クエリを使用する場合、インデックスの作成が必要になることがあります。エラーメッセージに従ってインデックスを作成してください。

## 動作確認

### 1. 接続テスト

1. `index.html`にアクセス
2. ダッシュボードの「Firebase接続状態」セクションを確認
3. 「接続テストを実行」ボタンをクリック
4. 接続成功を確認

### 2. データ保存方法の選択

1. ダッシュボードで「データ保存方法を選択」セクションを確認
2. 「Firebase（クラウド）」を選択
3. 「保存方法を確定」をクリック

**注意**: 一度設定したら変更できません。

### 3. アプリの作成と保存

1. アプリを作成
2. データを追加
3. Firestore Databaseでデータが保存されているか確認

## トラブルシューティング

### エラー：権限エラー

**原因**: セキュリティルールが正しく設定されていない

**解決方法**:
1. Firestore Databaseの「ルール」タブを確認
2. 上記のセキュリティルールを設定
3. 「公開」をクリック

### エラー：データベースが見つかりません

**原因**: Firestore Databaseが作成されていない

**解決方法**:
1. Firebase Consoleで「Firestore Database」を選択
2. 「データベースを作成」をクリック
3. セキュリティルールとロケーションを選択
4. 「有効にする」をクリック

### エラー：接続タイムアウト

**原因**: ネットワークの問題、またはFirestore Databaseが作成されていない

**解決方法**:
1. インターネット接続を確認
2. Firestore Databaseが作成されているか確認
3. ブラウザのコンソールでエラーの詳細を確認

## 現在のアーキテクチャとの関係

### AppNaviIDシステム

- AppNaviIDは必須（Firebase設定の有無に関わらず）
- Firebaseを使用する場合でも、AppNaviIDでユーザーを識別
- データの`userId`フィールドにAppNaviIDを保存

### Firebase Authentication

- 現在はオプション（Google認証は実装済みだが、必須ではない）
- 将来的にFirebase AuthenticationのUIDとAppNaviIDを連携することも可能

### データ保存

- **localStorage**: デフォルト（設定不要）
- **Firebase Firestore**: オプション（設定が必要）
- 両方を使用することも可能（将来的な拡張）

