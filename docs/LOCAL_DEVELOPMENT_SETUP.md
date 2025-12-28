# ローカル開発環境でのGoogle認証設定

ローカル環境（`localhost`）でGoogle認証を動作させるための設定手順です。

## 前提条件

- Firebaseプロジェクトが作成されていること
- Google Cloud Consoleへのアクセス権限があること

## 設定手順

### 1. Firebase Consoleでの設定

1. [Firebase Console](https://console.firebase.google.com/)にアクセス
2. プロジェクトを選択（`appnavi-add7e`）
3. **Authentication** > **Sign-in method** に移動
4. **Google** プロバイダーが有効になっていることを確認
5. **承認済みドメイン** セクションで、以下が追加されていることを確認：
   - `localhost`
   - `127.0.0.1`
   - （必要に応じて）`localhost:5173`（Viteのデフォルトポート）

### 2. Google Cloud Consoleでの設定

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 同じプロジェクト（`appnavi-add7e`）を選択
3. **APIとサービス** > **認証情報** に移動
4. OAuth 2.0 クライアントIDを確認または作成：
   - **OAuth 2.0 クライアントID** をクリック
   - **承認済みの JavaScript 生成元** に以下を追加：
     - `http://localhost`
     - `http://localhost:5173`
     - `http://127.0.0.1:5173`
   - **承認済みのリダイレクト URI** に以下を追加：
     - `http://localhost:5173/appnavi/login`（リダイレクト方式用）
     - `http://localhost:5173/appnavi/register`（リダイレクト方式用）
     - `http://localhost:5173/appnavi`（リダイレクト方式用 - フォールバック）
     - 注意: Firebaseは自動的に元のURLにリダイレクトするため、上記のURLを追加してください

### 3. OAuth同意画面の設定

1. Google Cloud Consoleで **APIとサービス** > **OAuth同意画面** に移動
2. ユーザータイプを選択（通常は「外部」）
3. アプリ情報を入力：
   - アプリ名: `AppNavi`
   - ユーザーサポートメール: あなたのメールアドレス
   - デベロッパーの連絡先情報: あなたのメールアドレス
4. スコープを追加（必要に応じて）
5. テストユーザーを追加（開発中の場合）

## トラブルシューティング

### エラー: "auth/popup-blocked"

**原因**: ブラウザがポップアップをブロックしている

**解決方法**:
- **自動フォールバック**: アプリは自動的にリダイレクト方式に切り替わります
- **Cursorブラウザ**: Cursorの内蔵ブラウザでは、ポップアップがブロックされる場合があります。自動的にリダイレクト方式が使用されます
- **通常のブラウザ**: ブラウザの設定でポップアップを許可することもできます

### リダイレクト認証後のページが真っ白になる

**原因**: Firebaseの認証ハンドラーページから元のアプリにリダイレクトされていない

**解決方法**:
1. **通常のブラウザを使用**: Cursorの内蔵ブラウザではなく、ChromeやFirefoxなどの通常のブラウザでアプリを開いてください
2. **リダイレクトURIの確認**: Google Cloud Consoleで、OAuth 2.0 クライアントIDの「承認済みのリダイレクト URI」に以下が追加されているか確認してください：
   - `http://localhost:5173/appnavi/login`
   - `http://localhost:5173/appnavi/register`
3. **手動でリダイレクト**: 真っ白なページが表示された場合、ブラウザのアドレスバーに`http://localhost:5173/appnavi/login`と入力してアプリに戻ってください

### エラー: "auth/unauthorized-domain"

**原因**: 現在のドメインが承認済みドメインに追加されていない

**解決方法**:
1. Firebase Console > Authentication > 承認済みドメインに`localhost`を追加
2. Google Cloud Console > OAuth 2.0 クライアントIDの設定を確認

### エラー: "auth/network-request-failed"

**原因**: ネットワーク接続の問題、またはCORSエラー

**解決方法**:
- インターネット接続を確認
- ファイアウォールやプロキシの設定を確認

### 認証は成功するが、リダイレクトされない

**原因**: 認証後の処理に問題がある可能性

**解決方法**:
- ブラウザのコンソールでエラーを確認
- `AuthContext`の`onAuthStateChanged`が正しく動作しているか確認

## セキュリティに関する重要な注意事項

### `localhost`を承認済みドメインに追加することについて

**開発環境では安全です：**
- `localhost`はローカルマシン上でのみアクセス可能で、外部からアクセスできません
- Firebaseはデフォルトで`localhost`を承認済みドメインに追加しています
- 開発環境での使用は一般的で推奨される実践です

**本番環境では削除すべきです：**
- 本番環境では`localhost`を承認済みドメインから削除してください
- 本番環境では実際のドメイン（例：`appnavi.example.com`）のみを追加してください
- `localhost`を本番環境に残すと、悪意のあるユーザーが自分のローカルマシンでコードを実行し、あなたの本番プロジェクトにアクセスする可能性があります

### セキュリティのベストプラクティス

1. **環境の分離**
   - 開発用と本番用で別々のFirebaseプロジェクトを使用することを推奨します
   - または、本番環境では`localhost`を削除し、開発環境でのみ使用します

2. **APIキーの保護**
   - Firebase APIキーにHTTPリファラー制限を設定してください
   - これにより、指定されたドメインからのみAPIキーを使用できます

3. **定期的な監査**
   - 承認済みドメインのリストを定期的に確認し、不要なドメインを削除してください

## 開発時の注意点

1. **ポート番号**: Viteのデフォルトポートは`5173`ですが、変更している場合は適宜調整してください
2. **HTTPS**: 本番環境ではHTTPSが必要ですが、ローカル開発ではHTTPでも動作します
3. **テストユーザー**: OAuth同意画面が「テスト」モードの場合、テストユーザーとして追加されたアカウントのみが認証できます
4. **環境の分離**: 可能であれば、開発用と本番用で別々のFirebaseプロジェクトを使用してください

## 確認方法

1. 開発サーバーを起動: `npm run dev`
2. ブラウザで `http://localhost:5173/login` にアクセス
3. 「Googleでログイン」ボタンをクリック
4. Google認証ポップアップが表示され、認証が完了することを確認

## 参考リンク

- [Firebase Authentication ドキュメント](https://firebase.google.com/docs/auth)
- [Google OAuth 2.0 設定](https://developers.google.com/identity/protocols/oauth2)

