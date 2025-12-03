# GitHub Pages トラブルシューティング

## 現在の状況

GitHub PagesでReactアプリが真っ白になっている問題を解決するためのチェックリストです。

## 確認事項

### 1. GitHub Pagesの設定

1. リポジトリの **Settings** > **Pages** に移動
2. **Source** で **「GitHub Actions」** が選択されていることを確認
3. 選択されていない場合は選択して保存

### 2. GitHub Actionsの実行状況

1. リポジトリの **Actions** タブを確認
2. 最新のワークフロー「Deploy to GitHub Pages」が実行されているか確認
3. エラーがある場合は、エラーメッセージを確認

### 3. ビルドの確認

ローカルでビルドが成功することを確認：

```bash
npm run build
```

`dist/index.html`に以下のようなスクリプトタグが含まれていることを確認：

```html
<script type="module" crossorigin src="/appnavi/assets/index-XXXXX.js"></script>
<link rel="stylesheet" crossorigin href="/appnavi/assets/index-XXXXX.css">
```

### 4. デプロイの待機

- 初回デプロイや変更後は数分かかることがあります
- GitHub Actionsのワークフローが完了するまで待機
- デプロイ完了後、数分待ってからアクセス

## 現在の設定

- **Base Path**: `/appnavi/`
- **Build Output**: `dist/`
- **GitHub Actions**: 自動デプロイ設定済み

## 手動デプロイ（緊急時）

GitHub Actionsが動作しない場合、以下の手順で手動デプロイできます：

1. ローカルでビルド：
   ```bash
   npm run build
   ```

2. `dist`フォルダの内容を`gh-pages`ブランチにプッシュ

ただし、通常はGitHub Actionsが自動でデプロイするため、手動デプロイは不要です。

