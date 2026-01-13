# サービスアカウントキーの取得方法

Firebase Admin SDKを使用してスクリプトから直接Firebaseにデータを追加するには、サービスアカウントキーが必要です。

## 手順

### 1. Firebase Consoleにアクセス

1. [Firebase Console](https://console.firebase.google.com/)にアクセス
2. プロジェクト `appnavi-add7e` を選択

### 2. プロジェクト設定を開く

1. 左上の⚙️（歯車）アイコンをクリック
2. 「プロジェクトの設定」を選択

### 3. サービスアカウントタブを開く

1. 設定画面の上部メニューから「サービスアカウント」タブをクリック

### 4. 新しい秘密鍵を生成

1. 「新しい秘密鍵の生成」ボタンをクリック
2. 確認ダイアログが表示されたら「キーを生成」をクリック
3. JSONファイルが自動的にダウンロードされます

### 5. キーファイルを配置

1. ダウンロードしたJSONファイルをプロジェクトルートに配置
2. ファイル名を `serviceAccountKey.json` にリネーム
3. **重要**: `.gitignore` に `serviceAccountKey.json` が含まれていることを確認（機密情報のため）

### 6. 環境変数を設定（オプション）

サービスアカウントキーファイルを別の場所に配置する場合は、環境変数を設定：

```bash
# Windows (PowerShell)
$env:GOOGLE_APPLICATION_CREDENTIALS="C:\path\to\serviceAccountKey.json"

# Windows (CMD)
set GOOGLE_APPLICATION_CREDENTIALS=C:\path\to\serviceAccountKey.json

# macOS/Linux
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/serviceAccountKey.json"
```

## 注意事項

⚠️ **セキュリティ警告**:
- サービスアカウントキーは機密情報です
- Gitにコミットしないでください
- 公開リポジトリにアップロードしないでください
- キーが漏洩した場合は、Firebase Consoleから削除して新しいキーを生成してください

## 使用方法

サービスアカウントキーを配置したら、以下のスクリプトを実行できます：

```bash
# デフォルトテンプレートを作成
npx tsx scripts/createDefaultCRMTemplate.ts

# お知らせを作成
npx tsx scripts/createAnnouncements.ts
```

## トラブルシューティング

### エラー: "Could not load the default credentials"

→ サービスアカウントキーファイルが正しい場所に配置されているか確認してください。

### エラー: "Permission denied"

→ サービスアカウントに適切な権限があるか確認してください。Firestoreのセキュリティルールも確認が必要です。

### エラー: "Invalid service account"

→ キーファイルが破損している可能性があります。新しいキーを生成してください。
