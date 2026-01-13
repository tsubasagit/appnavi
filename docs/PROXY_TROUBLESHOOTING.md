# Viteプロキシ トラブルシューティング

## プロキシの確認方法

### 1. 開発サーバーのログを確認

開発サーバーを起動したターミナルで、以下のログが表示されることを確認：

```
[Vite Proxy] Rewriting /api/asset-templates to /AppNavi-asset/api/templates.json
[Vite Proxy] Proxying /api/asset-templates to /AppNavi-asset/api/templates.json
[Vite Proxy] Response status: 200
```

### 2. ブラウザの開発者ツールで確認

1. ブラウザの開発者ツールを開く（F12）
2. 「Network」タブを開く
3. 「外部サイトから更新」ボタンをクリック
4. `/api/asset-templates` のリクエストを確認：
   - **Status**: 200 OK であることを確認
   - **Response**: JSONが返ってくることを確認

### 3. 直接URLを確認

ブラウザで以下のURLに直接アクセス：
```
http://localhost:5173/api/asset-templates
```

正しく動作していれば、JSONが表示されます。

### 4. 外部サイトのURLを直接確認

ブラウザで以下のURLに直接アクセス：
```
https://tsubasagit.github.io/AppNavi-asset/api/templates.json
```

- **200 OK**: ファイルが存在する
- **404 Not Found**: ファイルが存在しない、またはパスが間違っている

## よくある問題と解決方法

### 問題1: プロキシが404を返す

**原因**: 
- 外部サイトのファイルが存在しない
- プロキシの`rewrite`が正しく動作していない

**解決方法**:
1. 外部サイトのURLを直接確認
2. `vite.config.ts`の`rewrite`設定を確認
3. 開発サーバーを再起動

### 問題2: CORSエラーが発生する

**原因**: 
- プロキシが正しく動作していない
- CORSヘッダーが追加されていない

**解決方法**:
1. `vite.config.ts`の`configure`設定を確認
2. 開発サーバーを再起動

### 問題3: プロキシが動作しない

**原因**: 
- 開発サーバーが再起動されていない
- `vite.config.ts`の設定が間違っている

**解決方法**:
1. 開発サーバーを完全に停止（`Ctrl+C`）
2. 開発サーバーを再起動（`npm run dev`）
3. `vite.config.ts`の設定を確認

## プロキシ設定の確認

`vite.config.ts`の設定：

```typescript
proxy: {
  '/api/asset-templates': {
    target: 'https://tsubasagit.github.io',
    changeOrigin: true,
    secure: true,
    rewrite: (path) => {
      // /api/asset-templates を /AppNavi-asset/api/templates.json に変換
      return path.replace(/^\/api\/asset-templates/, '/AppNavi-asset/api/templates.json')
    },
  },
}
```

## デバッグ方法

### コンソールログで確認

ブラウザのコンソールに以下のログが表示されます：

```
[assetSite] テンプレート取得開始: /api/asset-templates
[assetSite] 開発環境: true, プロキシURL: なし
[Vite Proxy] Rewriting /api/asset-templates to /AppNavi-asset/api/templates.json
[Vite Proxy] Proxying /api/asset-templates to /AppNavi-asset/api/templates.json
[Vite Proxy] Response status: 200
[assetSite] 取得したテンプレート数: 5件
```

### エラーの場合

```
[Vite Proxy] Error: [エラーメッセージ]
[Vite Proxy] Response status: 404
[assetSite] 外部サイトからのテンプレート取得エラー: Error: HTTP error! status: 404
```

---

**作成日**: 2024-01-11
