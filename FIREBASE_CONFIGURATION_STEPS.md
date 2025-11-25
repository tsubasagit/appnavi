# Firebase設定手順（現在の状態から）

## 現在の状態

✅ Firebaseプロジェクト作成済み
✅ Google認証有効化済み

## 次のステップ

### 1. Firebase設定値の取得

1. Firebase Consoleでプロジェクトを選択
2. プロジェクトの設定（⚙️アイコン）をクリック
3. 「アプリを追加」→「</> Web」を選択（まだ追加していない場合）
4. アプリのニックネームを入力（例：`AppNavi Web`）
5. 「このアプリのFirebase Hostingも設定します」はチェック不要
6. 「アプリを登録」をクリック

### 2. 設定値のコピー

アプリ登録後、以下のような設定値が表示されます：

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

### 3. firebase-config.jsの更新

`firebase-config.js`ファイルを開き、上記の設定値をコピー＆ペーストしてください：

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890"
};
```

### 4. Firestore Databaseの設定

1. Firebase Consoleで「Firestore Database」を選択
2. 「データベースを作成」をクリック（まだ作成していない場合）
3. セキュリティルールを選択：
   - **開発モード**: テスト用（本番環境では使用しない）
   - **本番モード**: セキュリティルールを設定（推奨）
4. ロケーションを選択（例：`asia-northeast1` - 東京）
5. 「有効にする」をクリック

### 5. セキュリティルールの設定（本番モードの場合）

本番モードを選択した場合、以下のセキュリティルールを設定してください：

**重要**: AppNaviIDを使用するため、Firebase AuthenticationのUIDではなく、データ内の`userId`フィールドでフィルタリングします。

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ユーザーは自分のアプリのみ読み書き可能（AppNaviIDでフィルタリング）
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

**注意**: 現在のAppNaviIDシステムでは、Firebase AuthenticationのUIDを直接使用していません。そのため、上記のルールは将来的な拡張用です。現在は、クライアント側でAppNaviIDによるフィルタリングを行っています。

### 6. 動作確認

1. `index.html`にアクセス
2. ダッシュボードの「Firebase接続状態」セクションを確認
3. 「接続テストを実行」ボタンをクリック
4. 接続成功を確認

### 7. データ保存方法の選択

1. ダッシュボードで「データ保存方法を選択」セクションを確認
2. 「Firebase（クラウド）」を選択
3. 「保存方法を確定」をクリック

**注意**: 一度設定したら変更できません。

## トラブルシューティング

### エラー：Firebase SDKが読み込まれていません

- `index.html`でFirebase SDKの読み込みを確認
- ブラウザのコンソールでエラーを確認

### エラー：Firebase設定が未設定です

- `firebase-config.js`の設定値を確認
- プレースホルダー（`YOUR_API_KEY`など）が残っていないか確認

### エラー：Firebase接続エラー

- Firestore Databaseが作成されているか確認
- セキュリティルールが正しく設定されているか確認
- ブラウザのコンソールでエラーの詳細を確認

### エラー：権限エラー

- Firestoreのセキュリティルールを確認
- 開発モードの場合は、一時的にすべての読み書きを許可してテスト

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

