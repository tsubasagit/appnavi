# GitHubへのアップロード手順

## 方法1: GitHub Web UIを使用（推奨）

1. **GitHubでリポジトリを作成**
   - https://github.com/new にアクセス
   - リポジトリ名を入力（例: `Cursor-OpenDX` または `appnavi`）
   - 説明を入力（オプション）
   - **Public** または **Private** を選択
   - **「Initialize this repository with a README」のチェックを外す**（既にREADME.mdがあるため）
   - 「Create repository」をクリック

2. **リモートリポジトリを追加してプッシュ**
   ```bash
   # リモートリポジトリを追加（YOUR_USERNAMEとREPO_NAMEを置き換えてください）
   git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
   
   # メインブランチをプッシュ
   git push -u origin main
   ```

## 方法2: GitHub CLIを使用（インストール済みの場合）

```bash
# GitHub CLIをインストール（未インストールの場合）
# Windows: winget install --id GitHub.cli
# または https://cli.github.com/ からダウンロード

# ログイン
gh auth login

# リポジトリを作成してプッシュ
gh repo create Cursor-OpenDX --public --source=. --remote=origin --push
```

## 方法3: SSHを使用（設定済みの場合）

```bash
# SSHリモートを追加（YOUR_USERNAMEとREPO_NAMEを置き換えてください）
git remote add origin git@github.com:YOUR_USERNAME/REPO_NAME.git

# プッシュ
git push -u origin main
```

## 注意事項

- GitHubの認証が必要な場合、Personal Access Token（PAT）を使用する必要があります
- 初回プッシュ時は、GitHubの認証情報を求められる場合があります
- リポジトリ名は既存のものと重複しないようにしてください








