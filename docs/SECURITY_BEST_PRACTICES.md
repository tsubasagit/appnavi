# セキュリティのベストプラクティス

AppNaviプロジェクトのセキュリティに関する推奨事項です。

## Firebase Authentication のセキュリティ

### 承認済みドメインの管理

#### 開発環境
- `localhost`と`127.0.0.1`を承認済みドメインに追加することは**安全**です
- これらはローカルマシン上でのみアクセス可能で、外部からアクセスできません
- Firebaseはデフォルトで`localhost`を追加しています

#### 本番環境
- **必ず`localhost`を削除してください**
- 本番環境では実際のドメインのみを追加してください
- 例：`appnavi.example.com`、`www.appnavi.example.com`

### APIキーの保護

1. **HTTPリファラー制限の設定**
   - Firebase Console > プロジェクト設定 > 全般
   - Web APIキーにHTTPリファラー制限を設定
   - 許可するドメインのみを指定

2. **環境変数の使用**
   - APIキーをコードに直接書かない
   - `.env.local`ファイルを使用（Gitにコミットしない）
   - 本番環境では環境変数またはシークレット管理サービスを使用

### 環境の分離

**推奨される構成：**

```
開発環境: appnavi-dev (Firebaseプロジェクト)
本番環境: appnavi-prod (Firebaseプロジェクト)
```

**または、同じプロジェクトを使用する場合：**

```
開発環境: localhost を承認済みドメインに追加
本番環境: localhost を削除、実際のドメインのみを追加
```

## データベースのセキュリティ

### Firestore セキュリティルール

本番環境では、適切なセキュリティルールを設定してください：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ユーザーは自分のデータのみ読み書き可能
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // アプリデータは認証済みユーザーのみアクセス可能
    match /apps/{appId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 認証のセキュリティ

### Google OAuth の設定

1. **OAuth同意画面**
   - 本番環境では適切なアプリ情報を設定
   - プライバシーポリシーと利用規約のURLを追加

2. **OAuth クライアントID**
   - 本番環境では`localhost`を削除
   - 実際のドメインのみを承認済みのJavaScript生成元に追加

### パスワードポリシー

メール/パスワード認証を使用する場合：
- 最小文字数: 8文字以上
- 複雑さの要件: 大文字、小文字、数字、記号を含む
- パスワードリセット機能の実装

## デプロイメントのセキュリティ

### GitHub Actions / CI/CD

1. **シークレットの管理**
   - Firebase設定値をGitHub Secretsに保存
   - `.env`ファイルをGitにコミットしない

2. **環境変数の使用**
   - ビルド時に環境変数から設定値を読み込む
   - 本番環境と開発環境で異なる設定を使用

### 本番環境のチェックリスト

デプロイ前に確認：

- [ ] `localhost`が承認済みドメインから削除されている
- [ ] 本番環境のドメインが承認済みドメインに追加されている
- [ ] APIキーにHTTPリファラー制限が設定されている
- [ ] Firestoreセキュリティルールが適切に設定されている
- [ ] 環境変数が正しく設定されている
- [ ] `.env`ファイルがGitにコミットされていない

## 定期的な監査

### 月次チェック

1. **承認済みドメインの確認**
   - 不要なドメインを削除
   - 本番環境に`localhost`が残っていないか確認

2. **APIキーの確認**
   - 使用されていないAPIキーを削除
   - リファラー制限が適切に設定されているか確認

3. **アクセスログの確認**
   - 異常なアクセスパターンを確認
   - 不正なアクセス試行を検出

## 参考リンク

- [Firebase セキュリティ ドキュメント](https://firebase.google.com/docs/rules)
- [Firebase Authentication セキュリティ](https://firebase.google.com/docs/auth/security)
- [Google Cloud セキュリティ ベストプラクティス](https://cloud.google.com/security/best-practices)

