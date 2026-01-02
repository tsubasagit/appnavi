# テンプレートJSONファイル

このディレクトリには、Firebase Firestoreに追加するためのテンプレートJSONファイルが含まれています。

## 使用方法

### 方法1: Firebase Consoleから直接追加

1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. プロジェクト `appnavi-add7e` を選択
3. Firestore Database を開く
4. `templates` コレクションを選択（存在しない場合は作成）
5. ドキュメントIDとして `crm` または `google-calendar-group` を指定
6. 対応するJSONファイル（`crm.json` または `google-calendar-group.json`）の内容をコピー
7. Firebase Consoleの「フィールドを追加」から、JSONの各フィールドを手動で追加
   - または、Firebase CLIを使用してインポート

### 方法2: Firebase CLIを使用（推奨）

```bash
# Firebase CLIがインストールされている場合
firebase firestore:import templates/ --project appnavi-add7e
```

### 方法3: ブラウザコンソールから実行

1. アプリにログイン（テストユーザーまたは通常のユーザー）
2. 開発者ツールのコンソールを開く（F12）
3. `scripts/create-templates-browser.js` の内容をコピー＆ペースト
4. 実行されるまで待つ

## 注意事項

- `createdAt` と `updatedAt` フィールドは、Firebase Consoleで追加する際に自動的に設定されます（`serverTimestamp()`）
- JSONファイルには `createdAt` と `updatedAt` が含まれていません。Firebase Consoleで追加する際に自動的に設定されます
- テンプレートID（`templateId`）は、ドキュメントIDと一致させる必要があります

## ファイル一覧

- `crm.json` - 顧客管理（CRM）テンプレート
- `google-calendar-group.json` - Googleカレンダーのグループ化管理テンプレート

