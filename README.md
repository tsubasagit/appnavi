# AppNavi

「データは個人のもの、プラットフォームはみんなのもの」

AppNaviは、IT知識の少ない中小企業経営者向けのNo-Codeアプリ生成プラットフォームです。

## 特徴

- **No Code**: コード不要・設計不要。AIが自動で最適な画面を生成
- **No Cost**: 運用コストゼロ・サーバーレス。データはユーザー自身のストレージに保存
- **No Fear**: データは手元に残る。いつでもExcelに戻れる

## 技術スタック

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router v6
- **Build Tool**: Vite
- **Infrastructure**: Firebase (Auth, Firestore, Hosting)

## セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# プレビュー
npm run preview
```

## プロジェクト構造

```
src/
├── components/       # 再利用可能なコンポーネント
│   ├── Sidebar.tsx
│   └── tabs/        # タブコンポーネント
│       ├── PolicyTab.tsx
│       ├── DataTab.tsx
│       ├── UITab.tsx
│       ├── GraphTab.tsx
│       └── SettingsTab.tsx
├── pages/           # ページコンポーネント
│   ├── Dashboard.tsx
│   ├── MyApps.tsx
│   └── AppDetail.tsx
├── context/         # React Context
│   └── AppContext.tsx
├── types/           # TypeScript型定義
│   └── index.ts
├── utils/           # ユーティリティ関数
│   └── theme.ts
├── App.tsx          # メインアプリコンポーネント
├── main.tsx         # エントリーポイント
└── index.css        # グローバルスタイル
```

## 開発仕様

詳細な開発仕様については、`docs/specs/BASIC_CONCEPT.md`を参照してください。

## ライセンス

MIT
