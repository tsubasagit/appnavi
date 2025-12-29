# GitHub Pages デプロイ設定手順

## 1. GitHubリポジトリの設定

### GitHub Pagesを有効にする

1. GitHubリポジトリ（https://github.com/tsubasagit/appnavi）にアクセス
2. **Settings** タブをクリック
3. 左サイドバーから **Pages** を選択
4. **Source** セクションで：
   - **Source** を **"GitHub Actions"** に設定
   - これにより、`.github/workflows/deploy.yml` のワークフローが自動的にデプロイを実行します

## 2. デプロイの確認

### デプロイ状況の確認

1. リポジトリの **Actions** タブをクリック
2. 最新のワークフロー実行を確認
3. 緑色のチェックマークが表示されればデプロイ成功

### デプロイ後のURL

デプロイが完了すると、以下のURLでアクセスできます：
- **https://tsubasagit.github.io/appnavi/**

## 3. トラブルシューティング

### デプロイが失敗する場合

1. **Actions** タブでエラーログを確認
2. よくある問題：
   - `npm ci` が失敗する → `package-lock.json` が最新か確認
   - ビルドエラー → ローカルで `npm run build` を実行して確認
   - パーミッションエラー → リポジトリのSettings > Actions > General で権限を確認

### 手動でデプロイをトリガーする

1. **Actions** タブを開く
2. 左サイドバーから **"Deploy to GitHub Pages"** を選択
3. **"Run workflow"** ボタンをクリック
4. ブランチを選択（通常は `main`）
5. **"Run workflow"** をクリック

## 4. 現在の設定

- **リポジトリ**: https://github.com/tsubasagit/appnavi
- **デプロイブランチ**: `main`
- **ベースパス**: `/appnavi/` (vite.config.tsで設定)
- **ビルド出力**: `dist/` フォルダ

## 5. 今後のデプロイ

`main` ブランチにプッシュするたびに、自動的にデプロイが実行されます。

```bash
# 変更をコミット
git add .
git commit -m "Your commit message"

# mainブランチにプッシュ
git push origin main
```

デプロイには通常2-5分かかります。

