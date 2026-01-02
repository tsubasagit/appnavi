# Google Sheets API セットアップガイド

AppNaviでGoogleスプレッドシートをデータソースとして使用するには、Google Sheets APIを有効化する必要があります。

## エラーメッセージ

以下のようなエラーが表示された場合、Google Sheets APIが有効化されていません：

```
Google Sheets API has not been used in project 917670325982 before or it is disabled.
```

## セットアップ手順

### 1. Google Cloud Consoleにアクセス

以下のURLにアクセスして、Google Sheets APIを有効化してください：

**プロジェクトID: 917670325982 の場合:**
https://console.developers.google.com/apis/api/sheets.googleapis.com/overview?project=917670325982

**他のプロジェクトIDの場合:**
エラーメッセージに表示されているプロジェクトIDを確認し、以下のURLの`{PROJECT_ID}`を置き換えてください：
```
https://console.developers.google.com/apis/api/sheets.googleapis.com/overview?project={PROJECT_ID}
```

### 2. APIを有効化

1. 上記のURLにアクセスすると、Google Cloud ConsoleのAPI有効化ページが表示されます
2. 「有効にする」または「Enable」ボタンをクリックします
3. APIが有効化されるまで数秒〜数分かかることがあります

### 3. 認証情報の確認

Google Sheets APIを使用するには、以下の認証情報が必要です：

- **OAuth 2.0 クライアントID**: Firebase Consoleで設定済み
- **APIキー**: 必要に応じて設定（通常はOAuth 2.0で十分）

### 4. 再試行

APIを有効化した後、以下の手順で再試行してください：

1. 数分待つ（APIの有効化が反映されるまで時間がかかる場合があります）
2. ブラウザをリロードする
3. 再度スプレッドシート接続を試す

## トラブルシューティング

### APIが有効化されてもエラーが続く場合

1. **認証トークンの確認**
   - Googleアカウントでログインし直してください
   - スプレッドシートへのアクセス権限が付与されているか確認してください

2. **プロジェクトIDの確認**
   - Firebase Consoleで正しいプロジェクトIDを確認してください
   - エラーメッセージに表示されているプロジェクトIDと一致しているか確認してください

3. **APIの有効化状態の確認**
   - Google Cloud Consoleの「APIとサービス」→「有効なAPI」で、Google Sheets APIが有効になっているか確認してください

### スプレッドシートへのアクセス権限

スプレッドシートにアクセスするには、以下のいずれかの条件を満たす必要があります：

1. **スプレッドシートの所有者である**
2. **スプレッドシートの共有設定で、あなたのGoogleアカウントにアクセス権限が付与されている**

## 関連ドキュメント

- [Firebase セットアップガイド](./LOCAL_DEVELOPMENT_SETUP.md)
- [Google Sheets API 公式ドキュメント](https://developers.google.com/sheets/api)


