# AppNavi 開発ガイド

## ビジョン

**「誰もがテクノロジーを使いこなし、自らの手でアイデアを形にできる社会を実現する」**

AppNaviは、技術的な知識がなくても、Excelで管理しているデータからWebアプリケーションを作成できるプラットフォームです。コードを書かず、サーバーを管理せず、コストをかけずに、誰もが自分のアイデアを形にできる環境を提供します。

## 開発方針

### 1. 完全オープンソース

- **MITライセンス**: 誰でも自由に使用・改変・配布可能
- **コード完全公開**: すべてのコードをGitHubで公開
- **透明性**: セキュリティやプライバシーに関する懸念を排除

### 2. サーバーレスアーキテクチャ

- **ゼロインフラ管理**: サーバーの構築・運用・保守が不要
- **完全マネージドサービス**: Firebase、GitHub Pagesなどのマネージドサービスを活用
- **コストゼロ**: 小規模利用では完全無料

### 3. ユーザー主導のデータ管理

- **AppNaviID**: ユーザー識別のための必須IDシステム
- **データ所有権**: ユーザーのデータはユーザーのもの
- **プラットフォーム独立性**: データを自由にエクスポート可能

### 4. スプレッドシートユーザー向け設計

- **Excel/Google Sheets連携**: 既存のスプレッドシートから直接アプリ作成
- **直感的なUI**: スプレッドシートユーザーが迷わない設計
- **段階的なDX化**: Excel管理からの脱却を支援

## アーキテクチャ

### 技術スタック

```
フロントエンド:
  - HTML5 / CSS3 (Tailwind CSS)
  - JavaScript (Vanilla JS)
  - Chart.js (データ可視化)

バックエンド:
  - Firebase Firestore (データベース)
  - Firebase Authentication (認証)
  - Google Sheets API (スプレッドシート連携)

ホスティング:
  - GitHub Pages (静的ホスティング)

認証:
  - AppNaviID (独自IDシステム)
  - Firebase Authentication (オプション)
```

### データフロー

```
ユーザー
  ↓
AppNaviID認証
  ↓
データ入力/編集
  ↓
localStorage (即座に保存)
  ↓
Firebase Firestore (クラウド同期、オプション)
  ↓
Google Sheets API (スプレッドシート連携、オプション)
```

### セキュリティ設計

- **AppNaviID**: クライアント側で生成・管理（UUID v4形式）
- **データ分離**: AppNaviIDでユーザーデータを完全分離
- **Firestoreセキュリティルール**: ユーザーは自分のデータのみアクセス可能
- **公開コード対応**: 機密情報を含まない設計

## 機能仕様

### 1. ダッシュボード

**機能:**
- アプリ一覧表示
- アプリ作成（Excel/CSVアップロード、スプレッドシートURL入力）
- テンプレート選択
- 最近開いたアプリ表示

**必須要件:**
- AppNaviID必須（未設定時は自動リダイレクト）

### 2. データ管理

**機能:**
- テーブル表示（フィルタリング、ソート、検索対応）
- データ追加（手動入力、CSV/Excelインポート）
- データ編集（インライン編集）
- データ削除
- データエクスポート（CSV/Excel）
- 印刷機能

**必須要件:**
- AppNaviID必須
- ユーザーは自分のデータのみ表示・編集可能

### 3. UIビルダー

**機能:**
- ページ管理（追加、削除、並び替え、名前変更）
- フィールド追加（テキスト、テキストエリア、選択肢、ラジオ、チェックボックス、日付、数値）
- フィールド設定（ラベル、必須、選択肢）
- テンプレート選択（空白、スプレッドシートから生成、プリセット）
- 自動フィールドタイプ推測（列名から推測）
- プレビュー機能

**必須要件:**
- AppNaviID必須
- pagesデータは自動保存（ユーザーごとに分離）

### 4. グラフ・可視化

**機能:**
- 棒グラフ、折れ線グラフ、円グラフ、ドーナツグラフ
- 集計方法選択（日付別、担当者別、顧客別など）
- 時系列トレンド表示

**必須要件:**
- AppNaviID必須
- ユーザーのデータのみ表示

### 5. 設定

**機能:**
- アプリ名・説明の編集
- Google Sheets連携設定
- データ保存方法の選択（初回のみ）

**必須要件:**
- AppNaviID必須

## 技術仕様

### AppNaviIDシステム

**形式:**
- UUID v4形式: `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`
- 例: `a1b2c3d4-e5f6-4789-a012-b3c4d5e6f789`

**保存場所:**
- localStorage: `appnavi_user_id`

**必須性:**
- すべての機能で必須
- 未設定時は自動的に`appnavi-id-register.html`にリダイレクト

**用途:**
- ユーザー識別
- データ分離（Firestore、localStorage）
- セキュリティ（自分のデータのみアクセス）

### データ構造

**アプリデータ:**
```javascript
{
  id: string,                    // アプリID
  name: string,                  // アプリ名
  description: string,           // 説明
  userId: string,                // AppNaviID（必須）
  columns: Array<{               // 列定義
    name: string,
    type: string,                // text, number, date, select, etc.
    required: boolean,
    options: Array<string>       // select型の場合
  }>,
  data: Array<Object>,           // データ行
  pages: Array<{                 // UIビルダーのページデータ
    id: string,
    name: string,
    fields: Array<{
      type: string,
      label: string,
      required: boolean,
      options: Array<string>
    }>
  }>,
  createdAt: timestamp,
  updatedAt: timestamp,
  storageType: string,           // 'local' or 'firebase'
  googleSheetsUrl: string,       // オプション
  googleAccessToken: string,     // オプション
  googleSheetsLastSynced: timestamp
}
```

### 認証フロー

```
1. ユーザーがページにアクセス
   ↓
2. AppNaviIDチェック
   ↓
3. AppNaviID未設定 → appnavi-id-register.htmlにリダイレクト
   ↓
4. AppNaviID設定済み → 機能利用可能
   ↓
5. データ操作時、AppNaviIDでフィルタリング
```

### データ保存方法

**1. localStorage（デフォルト）**
- ブラウザのlocalStorageに保存
- 設定不要
- 同一ブラウザでのみ有効

**2. Firebase Firestore（オプション）**
- クラウドに保存
- 複数デバイスで同期可能
- Firebase設定が必要

**3. Google Sheets（オプション）**
- スプレッドシートと連携
- リアルタイム同期
- Google認証が必要

## セキュリティ

### AppNaviIDのセキュリティ

- **生成**: クライアント側でUUID v4形式で生成
- **保存**: localStorageに保存（同一オリジンのみアクセス可能）
- **検証**: 正規表現で形式を検証
- **分離**: AppNaviIDでデータを完全分離

### Firestoreセキュリティルール

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ユーザーは自分のアプリのみ読み書き可能
    match /apps/{appId} {
      allow read, write: if request.auth != null && 
                            request.resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && 
                       request.resource.data.userId == request.auth.uid;
    }
  }
}
```

### データプライバシー

- **データ所有権**: ユーザーのデータはユーザーのもの
- **エクスポート**: いつでもデータをエクスポート可能
- **削除**: ユーザーが自分のデータを完全削除可能

## 開発環境セットアップ

### 前提条件

- Node.js（オプション、ローカルサーバー用）
- Python 3（オプション、ローカルサーバー用）
- モダンブラウザ（Chrome、Firefox、Edge、Safari）

### ローカル開発

**1. リポジトリのクローン**
```bash
git clone https://github.com/tsubasagit/appnavi.git
cd appnavi
```

**2. ローカルサーバーの起動**

**Windows:**
```bash
start-local-server.bat
```

**Mac/Linux:**
```bash
python3 -m http.server 8000
```

**3. ブラウザでアクセス**
```
http://localhost:8000
```

### Firebase設定（オプション）

Firebaseを使用する場合は、`FIREBASE_SETUP.md`を参照してください。

## コントリビューション

### コーディング規約

- **JavaScript**: ES6+、Vanilla JS（フレームワーク不使用）
- **CSS**: Tailwind CSS（ユーティリティファースト）
- **命名規則**: camelCase（変数・関数）、PascalCase（クラス）
- **コメント**: 日本語で記述

### プルリクエスト

1. 機能ブランチを作成
2. 変更をコミット
3. プルリクエストを作成
4. レビューを待つ

### イシュー報告

- バグ報告: `[Bug]`タグ
- 機能要望: `[Feature]`タグ
- 質問: `[Question]`タグ

## ライセンス

MIT License

詳細は`LICENSE`ファイルを参照してください。

## 関連ドキュメント

- [README.md](./README.md) - プロジェクト概要
- [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) - Firebase設定ガイド
- [ARCHITECTURE_STRATEGY.md](./ARCHITECTURE_STRATEGY.md) - アーキテクチャ戦略


