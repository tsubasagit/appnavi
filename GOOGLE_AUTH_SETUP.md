# Google認証の設定方法

## 概要

AppNaviでGoogleスプレッドシートにデータを書き込むには、Google OAuth 2.0クライアントIDが必要です。

## セキュリティについて

**重要**: OAuth 2.0のクライアントIDは公開しても安全です。

- ✅ **クライアントID**: 公開しても問題ありません（ブラウザベースのアプリでは公開が前提）
- ❌ **クライアントシークレット**: サーバーサイドでのみ使用し、絶対に公開してはいけません
- AppNaviはブラウザベースのアプリなので、クライアントシークレットは使用しません

## 設定手順

### 1. Google Cloud Consoleでプロジェクトを作成

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. プロジェクトを作成または選択

### 2. OAuth 2.0クライアントIDを作成

1. 「APIとサービス」>「認証情報」を開く
2. 「認証情報を作成」>「OAuth 2.0 クライアント ID」を選択
3. アプリケーションの種類で「ウェブアプリケーション」を選択
4. 以下の設定を行います：

   **承認済みのJavaScript生成元**:
   - GitHub Pages: `https://tsubasagit.github.io`
   - カスタムドメイン: `https://yourdomain.com`
   - **注意**: `localhost`は追加しないでください（セキュリティ上の理由）

   **承認済みのリダイレクトURI**:
   - GitHub Pages: `https://tsubasagit.github.io/` と `https://tsubasagit.github.io/index.html`
   - カスタムドメイン: `https://yourdomain.com/` と `https://yourdomain.com/index.html`
   - **重要**: Google Identity ServicesのOAuth 2.0トークンクライアントを使用する場合、リダイレクトURIを設定する必要があります
   - **セキュリティ**: `localhost`は追加しないでください。誰でもローカル環境でそのクライアントIDを使用できてしまいます

5. 「作成」をクリック
6. 作成されたクライアントIDをコピー

### 3. AppNaviにクライアントIDを設定

#### 方法1: 設定画面から設定（推奨）

1. AppNaviを開く
2. 設定画面（API・連携設定）を開く
3. 「OAuth 2.0 クライアントID」欄にクライアントIDを入力
4. 「保存」をクリック

#### 方法2: ブラウザのコンソールから設定

1. ブラウザの開発者ツール（F12キー）を開く
2. コンソールタブを開く
3. 以下を実行：

```javascript
localStorage.setItem('google_client_id', 'YOUR_CLIENT_ID_HERE');
```

4. ページを再読み込み

## オープンソースプロジェクトとして公開する場合

### 推奨事項

1. **デモ用クライアントIDを提供する場合**:
   - 承認済みのJavaScript生成元を適切に制限する
   - スコープを最小限に設定する
   - 使用量制限を設定する

2. **ユーザーが自分のクライアントIDを設定する場合**:
   - READMEに設定方法を記載する
   - 設定画面で簡単に設定できるようにする
   - デフォルトではクライアントIDを設定しない

3. **環境変数として設定可能にする**:
   - コードに直接クライアントIDを書かない
   - 設定ファイルや環境変数から読み込む

## トラブルシューティング

### エラー: "The OAuth client was not found"

- クライアントIDが正しく設定されているか確認
- Google Cloud ConsoleでクライアントIDが削除されていないか確認
- 承認済みのJavaScript生成元に現在のURLが含まれているか確認

### エラー: "invalid_client"

- クライアントIDの形式が正しいか確認（例: `123456789-abcdefghijklmnop.apps.googleusercontent.com`）
- クライアントIDに余分なスペースが含まれていないか確認

### エラー: "redirect_uri_mismatch"

- **最も一般的なエラー**: Google Cloud ConsoleでリダイレクトURIが正しく設定されていない場合に発生します
- **解決方法**:
  1. Google Cloud ConsoleでOAuth 2.0クライアントIDを開く
  2. 「承認済みのリダイレクトURI」に以下を追加:
     - `https://tsubasagit.github.io/`
     - `https://tsubasagit.github.io/index.html`
  3. 「保存」をクリック
  4. 数分待ってから再度認証を試す
- **注意**: リダイレクトURIは完全一致する必要があります（末尾のスラッシュも含めて）
- **セキュリティ**: `localhost`は追加しないでください。本番用のクライアントIDは本番環境のみに制限してください

### 認証は成功するが、スプレッドシートに書き込めない

- Google Sheets APIが有効になっているか確認
- スプレッドシートの共有設定を確認
- 認証スコープが正しいか確認（`https://www.googleapis.com/auth/spreadsheets`）

## 参考リンク

- [Google OAuth 2.0 ドキュメント](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Google Sheets API ドキュメント](https://developers.google.com/sheets/api)

