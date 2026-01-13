# 必要な環境変数リスト

## スクリプト実行に必要な環境変数

`scripts/createDefaultCRMTemplate.ts`を実行するには、以下の環境変数が`.env.local`ファイルに設定されている必要があります。

### 必須環境変数

以下の6つの環境変数は**すべて必須**です。1つでも欠けていると、Firebaseの初期化に失敗します。

```bash
# Firebase設定（必須）
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 環境変数の取得方法

1. [Firebase Console](https://console.firebase.google.com/)にアクセス
2. プロジェクトを選択
3. プロジェクト設定（⚙️アイコン）を開く
4. 「一般」タブの「マイアプリ」セクションから、Webアプリ（</>アイコン）を選択
5. 設定値（`firebaseConfig`）をコピーして、`.env.local`に設定

### `.env.local`ファイルの作成方法

1. プロジェクトルートに`.env.local`ファイルを作成
2. 上記の環境変数をコピー＆ペースト
3. 各値を実際のFirebase設定値に置き換え

例：
```bash
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=my-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=my-project-id
VITE_FIREBASE_STORAGE_BUCKET=my-project-id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

### 注意事項

- `.env.local`ファイルは`.gitignore`に含まれているため、Gitにはコミットされません
- 環境変数の値にスペースや特殊文字が含まれる場合は、引用符で囲む必要はありません（スクリプトが自動的に処理します）
- 環境変数が設定されていない場合、スクリプトはエラーメッセージを表示して終了します

### トラブルシューティング

#### エラー: `.env.localファイルが見つかりません`

→ プロジェクトルート（`package.json`があるディレクトリ）に`.env.local`ファイルが存在することを確認してください。

#### エラー: `Firebase設定が不完全です`

→ すべての必須環境変数が設定されているか確認してください。スクリプトは不足している環境変数を表示します。

#### エラー: `INVALID_ARGUMENT: Invalid resource field value`

→ 環境変数の値が正しく読み込まれていない可能性があります。`.env.local`ファイルの形式を確認してください（`KEY=value`の形式で、各行に1つの環境変数）。
