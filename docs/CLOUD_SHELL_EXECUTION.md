# Cloud ShellでFirebaseデータを追加する方法

Google Cloud Shellを使用すると、サービスアカウントキーなしでFirebaseに直接データを追加できます。

## 前提条件

- Google Cloud Platformのプロジェクトにアクセスできること
- Cloud Shellが有効になっていること

## 手順

### 1. Cloud Shellを開く

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. プロジェクト `appnavi-add7e` を選択
3. 右上の「Cloud Shell」アイコン（>_）をクリック
4. Cloud Shellが開くまで待つ（初回は数分かかる場合があります）

### 2. 必要なパッケージをインストール

```bash
# Node.jsがインストールされているか確認
node --version

# firebase-adminをインストール
npm install firebase-admin
```

### 3. スクリプトをアップロードまたは作成

Cloud Shellエディタで以下のスクリプトを作成します：

- `scripts/createFirstAnnouncement-cloudshell.js` - お知らせを作成
- `scripts/createDefaultTemplates-cloudshell.js` - デフォルトテンプレートを作成

### 4. スクリプトを実行

```bash
# お知らせを作成
node scripts/createFirstAnnouncement-cloudshell.js

# デフォルトテンプレートを作成
node scripts/createDefaultTemplates-cloudshell.js
```

## メリット

- ✅ サービスアカウントキーが不要
- ✅ Google Workspaceの組織ポリシーの制限を受けない
- ✅ 既に認証されているため、すぐに実行可能
- ✅ コマンドラインから直接実行できる

## トラブルシューティング

### エラー: "Could not load the default credentials"

→ Cloud Shellで認証を確認：
```bash
gcloud auth list
gcloud config set project appnavi-add7e
```

### エラー: "Permission denied"

→ Firestoreのセキュリティルールを確認してください。
