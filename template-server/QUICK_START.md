# テンプレートサーバー クイックスタートガイド

## 5分で始める

### 1. リポジトリのクローン

```bash
git clone https://github.com/tsubasagit/AppNavi-asset.git
cd AppNavi-asset
```

### 2. ディレクトリ構造の作成

```bash
mkdir -p templates/api
mkdir -p templates/templates/{crm,google-calendar-group,daily-report,auto-integration}
mkdir -p templates/assets
```

### 3. ファイルのコピー

このリポジトリの `template-server/` フォルダから、以下のファイルを `AppNavi-asset/templates/` にコピーしてください：

- `index.html` → `templates/index.html`
- `api/templates.json` → `templates/api/templates.json`
- `templates/crm/index.html` → `templates/templates/crm/index.html`
- `templates/google-calendar-group/index.html` → `templates/templates/google-calendar-group/index.html`
- `templates/daily-report/index.html` → `templates/templates/daily-report/index.html`
- `templates/auto-integration/index.html` → `templates/templates/auto-integration/index.html`

### 4. ローカルで確認

```bash
cd templates
python -m http.server 8000
# または
npx serve .
```

ブラウザで `http://localhost:8000` にアクセスして確認してください。

### 5. デプロイ

#### Firebase Hosting（推奨）

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Public directory: templates
firebase deploy --only hosting
```

#### Netlify

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=templates
```

#### Vercel

```bash
npm install -g vercel
cd templates
vercel --prod
```

### 6. AppNavi側の設定

デプロイ後、AppNaviの `.env` ファイルに以下を追加：

```env
VITE_TEMPLATE_SERVER_URL=https://your-deployed-url.com
```

## 次のステップ

詳細な構築手順については、[BUILD_INSTRUCTIONS.md](./BUILD_INSTRUCTIONS.md)を参照してください。


