# Firebase設定ガイド

AppNaviでログイン機能を使用するには、Firebase認証の設定が必要です。

## 1. Firebaseプロジェクトの作成

1. [Firebase Console](https://console.firebase.google.com/)にアクセス
2. 「プロジェクトを追加」をクリック
3. プロジェクト名を入力（例：`appnavi`）
4. Google Analyticsの設定（任意）を選択
5. プロジェクトを作成

## 2. Webアプリの追加

1. Firebase Consoleでプロジェクトを選択
2. プロジェクトの設定（⚙️アイコン）をクリック
3. 「アプリを追加」→「</> Web」を選択
4. アプリのニックネームを入力（例：`AppNavi Web`）
5. 「このアプリのFirebase Hostingも設定します」はチェック不要
6. 「アプリを登録」をクリック

## 3. 設定値の取得

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

## 4. firebase-config.jsの更新

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

## 5. Firebase Authenticationの有効化

1. Firebase Consoleで「Authentication」を選択
2. 「始める」をクリック
3. 「Sign-in method」タブを選択
4. 「Google」をクリック
5. 「有効にする」をトグルON
6. プロジェクトのサポートメールを選択（または入力）
7. 「保存」をクリック

## 6. Firestore Databaseの設定

1. Firebase Consoleで「Firestore Database」を選択
2. 「データベースを作成」をクリック
3. セキュリティルールを選択：
   - **開発モード**：テスト用（本番環境では使用しない）
   - **本番モード**：セキュリティルールを設定（推奨）
4. ロケーションを選択（例：`asia-northeast1` - 東京）
5. 「有効にする」をクリック

### セキュリティルール（本番モードの場合）

本番モードを選択した場合、以下のセキュリティルールを設定してください：

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ユーザーは自分のアプリのみ読み書き可能
    match /apps/{appId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## 7. 動作確認

1. `login.html`にアクセス
2. 「Googleでログイン」ボタンをクリック
3. Googleアカウントでログイン
4. ダッシュボードにリダイレクトされることを確認

## トラブルシューティング

### エラー：Firebase認証が設定されていません

- `firebase-config.js`の設定値が正しいか確認
- ブラウザのコンソールでエラーメッセージを確認

### エラー：ポップアップがブロックされました

- ブラウザの設定でポップアップを許可
- または、`signInWithRedirect`を使用する方法に変更

### エラー：Firestoreの権限エラー

- Firestoreのセキュリティルールを確認
- 開発モードの場合は、一時的にすべての読み書きを許可してテスト

## 注意事項

- Firebase設定値は機密情報です。GitHubに公開しないよう注意してください
- 本番環境では、環境変数や別の設定ファイルで管理することを推奨します
- Firestoreのセキュリティルールは必ず設定してください


