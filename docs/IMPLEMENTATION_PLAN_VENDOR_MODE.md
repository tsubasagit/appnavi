# ベンダーモード実装計画

## 概要

B2B2Bベンダーイネーブルメント機能の実装計画です。

## 実装ステップ

### Step 1: 権限管理とベンダーモード基盤

#### 1.1 ユーザーロールの追加

**ファイル**: `src/types/index.ts`

```typescript
export type UserRole = 'user' | 'vendor' | 'admin'

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole; // 追加
}
```

#### 1.2 ベンダーモードの状態管理

**ファイル**: `src/context/AppContext.tsx`

```typescript
interface AppContextType {
  // ... 既存のプロパティ
  isVendorMode: boolean;
  environment: 'dev' | 'prod';
  setEnvironment: (env: 'dev' | 'prod') => void;
}
```

#### 1.3 サイドバーにベンダータブを追加

**ファイル**: `src/pages/AppDetail.tsx`

- 「Plugins」タブ
- 「Logic」タブ
- 環境切り替えスイッチ（Dev/Prod）

---

### Step 2: プラグイン管理システム（The Armory）

#### 2.1 プラグイン型定義

**ファイル**: `src/types/plugin.ts`（新規作成）

```typescript
export interface Plugin {
  id: string;
  name: string;
  description: string;
  version: string;
  component: React.ComponentType<any>;
  props: Record<string, any>;
  author: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface PluginRegistry {
  [pluginId: string]: Plugin;
}
```

#### 2.2 プラグイン管理タブ

**ファイル**: `src/components/tabs/PluginsTab.tsx`（新規作成）

- プラグイン一覧表示
- プラグイン登録フォーム
- プラグイン編集・削除機能
- GitHub連携（オプション）

#### 2.3 プラグインの動的読み込み

**ファイル**: `src/utils/pluginLoader.ts`（新規作成）

```typescript
export const loadPlugin = async (pluginId: string): Promise<Plugin> => {
  // プラグインの動的インポート
  // セキュリティチェック
  // コンポーネントの登録
}
```

---

### Step 3: コードエディタ統合（The Workshop）

#### 3.1 Monaco Editorの統合

**パッケージ**: `@monaco-editor/react`

**ファイル**: `src/components/CodeEditor.tsx`（新規作成）

```typescript
import Editor from '@monaco-editor/react'

export const CodeEditor = ({ code, onChange, language = 'typescript' }) => {
  return (
    <Editor
      height="500px"
      language={language}
      value={code}
      onChange={onChange}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: 'on',
      }}
    />
  )
}
```

#### 3.2 コードオーバーライド管理

**ファイル**: `src/components/tabs/LogicTab.tsx`（新規作成）

- コンポーネント選択
- コードエディタ表示
- オーバーライドタイプ選択（props/logic/render）
- 保存・適用機能

#### 3.3 コード実行環境

**ファイル**: `src/utils/codeExecutor.ts`（新規作成）

```typescript
export const executeCode = (code: string, context: any) => {
  // サンドボックス環境でのコード実行
  // セキュリティチェック
  // エラーハンドリング
}
```

---

### Step 4: 環境管理とデプロイフロー

#### 4.1 環境切り替えUI

**ファイル**: `src/components/EnvironmentSwitcher.tsx`（新規作成）

```typescript
export const EnvironmentSwitcher = () => {
  const { environment, setEnvironment } = useApp()
  
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setEnvironment('dev')}
        className={environment === 'dev' ? 'active' : ''}
      >
        Dev
      </button>
      <button
        onClick={() => setEnvironment('prod')}
        className={environment === 'prod' ? 'active' : ''}
      >
        Prod
      </button>
    </div>
  )
}
```

#### 4.2 データソースの環境分離

**ファイル**: `src/utils/dataSourceManager.ts`（新規作成）

```typescript
export const getDataSource = (environment: 'dev' | 'prod') => {
  if (environment === 'dev') {
    return mockDataSource
  }
  return productionDataSource
}
```

#### 4.3 デプロイフロー

**ファイル**: `src/components/DeployButton.tsx`（新規作成）

- Dev環境の変更を確認
- Prod環境への反映
- デプロイ履歴の記録

---

## ファイル構成

```
src/
├── components/
│   ├── tabs/
│   │   ├── PluginsTab.tsx      # 新規: プラグイン管理
│   │   └── LogicTab.tsx         # 新規: ロジック編集
│   ├── CodeEditor.tsx           # 新規: コードエディタ
│   ├── EnvironmentSwitcher.tsx # 新規: 環境切り替え
│   └── DeployButton.tsx         # 新規: デプロイボタン
├── types/
│   └── plugin.ts                # 新規: プラグイン型定義
├── utils/
│   ├── pluginLoader.ts          # 新規: プラグイン読み込み
│   ├── codeExecutor.ts          # 新規: コード実行
│   └── dataSourceManager.ts     # 新規: データソース管理
└── context/
    └── AppContext.tsx            # 拡張: ベンダーモード状態管理
```

---

## 依存パッケージ

```json
{
  "@monaco-editor/react": "^4.6.0",
  "react-sandbox": "^1.0.0" // オプション: コードサンドボックス
}
```

---

## セキュリティ考慮事項

1. **コードサンドボックス**: 実行されるコードを安全に隔離
2. **権限チェック**: ベンダーモードへのアクセス制御
3. **コード検証**: TypeScript型チェックとリント
4. **XSS対策**: 動的に実行されるコードのサニタイズ

---

## 実装優先順位

1. **Phase 1（必須）**: 権限管理、環境切り替え、基本的なコードエディタ
2. **Phase 2（重要）**: プラグイン管理システム
3. **Phase 3（拡張）**: コードオーバーライド、ロジック注入
4. **Phase 4（将来）**: GitHub連携、高度なデプロイフロー



