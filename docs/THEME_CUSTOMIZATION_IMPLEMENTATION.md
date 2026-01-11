# テーマ編集機能の実装ガイド

## 概要

データ保管とテンプレート設計に基づいて、テーマ編集機能を実装する方法を説明します。

---

## 1. データ構造

### ThemeConfig型（既存）

```typescript
export interface ThemeConfig {
  mode: 'light' | 'dark';
  primaryColor: string;  // 16進数カラーコード（例: '#3b82f6'）
  radius: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
}
```

### DesignConfig型（既存）

```typescript
export interface DesignConfig {
  pages: PageConfig;
  theme: ThemeConfig;  // テーマ設定を含む
}
```

### 保存場所

- **Firebase Firestore**: `users/{userId}/apps/{appId}/design`
- **データ構造**: `DesignConfig`型として保存
- **アクセス**: ユーザーは自分のアプリのテーマのみ編集可能

---

## 2. 実装方針

### 2.1 AppContextの拡張

`AppContext`に`DesignConfig`の管理を追加します。

```typescript
// src/context/AppContext.tsx

interface AppContextType {
  // ... 既存のプロパティ
  designConfig: DesignConfig | null;
  setDesignConfig: (config: DesignConfig | null) => void;
  updateTheme: (theme: Partial<ThemeConfig>) => void;
}

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // ... 既存のstate
  const [designConfig, setDesignConfig] = useState<DesignConfig | null>(null);

  // テーマを更新する関数
  const updateTheme = (themeUpdates: Partial<ThemeConfig>) => {
    setDesignConfig(prev => {
      if (!prev) {
        // デフォルトテーマで初期化
        return {
          pages: {},
          theme: {
            mode: 'light',
            primaryColor: '#3b82f6',
            radius: 'md',
          },
        };
      }
      return {
        ...prev,
        theme: {
          ...prev.theme,
          ...themeUpdates,
        },
      };
    });
  };

  return (
    <AppContext.Provider
      value={{
        // ... 既存の値
        designConfig,
        setDesignConfig,
        updateTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
```

---

### 2.2 UITabにテーマ編集パネルを追加

`UITab.tsx`の右側パネル（Property Inspector）に、テーマ編集セクションを追加します。

#### 実装例

```typescript
// src/components/tabs/UITab.tsx

import { Palette, Moon, Sun, Circle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ThemeConfig } from '../../types';

const UITab = () => {
  const { designConfig, updateTheme, activeAppId } = useApp();
  
  // テーマ設定（デフォルト値）
  const currentTheme: ThemeConfig = designConfig?.theme || {
    mode: 'light',
    primaryColor: '#3b82f6',
    radius: 'md',
  };

  // カラーパレット（プリセット）
  const colorPresets = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Purple', value: '#9333ea' },
    { name: 'Green', value: '#16a34a' },
    { name: 'Orange', value: '#ea580c' },
    { name: 'Red', value: '#dc2626' },
    { name: 'Indigo', value: '#6366f1' },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* ... 既存のコード ... */}
      
      {/* Right Panel - Property Inspector */}
      <aside className="w-80 bg-white border-l border-slate-200 p-6 overflow-auto">
        {/* テーマ編集セクション */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
            <Palette className="w-5 h-5 mr-2 text-primary-600" />
            テーマ設定
          </h3>
          
          {/* カラーモード */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              カラーモード
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => updateTheme({ mode: 'light' })}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 transition ${
                  currentTheme.mode === 'light'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Sun className="w-4 h-4" />
                <span>ライト</span>
              </button>
              <button
                onClick={() => updateTheme({ mode: 'dark' })}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 transition ${
                  currentTheme.mode === 'dark'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span>ダーク</span>
              </button>
            </div>
          </div>

          {/* プライマリカラー */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              プライマリカラー
            </label>
            
            {/* カラーパレット（プリセット） */}
            <div className="grid grid-cols-6 gap-2 mb-3">
              {colorPresets.map((color) => (
                <button
                  key={color.value}
                  onClick={() => updateTheme({ primaryColor: color.value })}
                  className={`w-10 h-10 rounded-lg border-2 transition ${
                    currentTheme.primaryColor === color.value
                      ? 'border-slate-900 scale-110'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
            
            {/* カスタムカラー選択 */}
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={currentTheme.primaryColor}
                onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                className="w-12 h-12 rounded-lg border-2 border-slate-200 cursor-pointer"
              />
              <input
                type="text"
                value={currentTheme.primaryColor}
                onChange={(e) => {
                  if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                    updateTheme({ primaryColor: e.target.value });
                  }
                }}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                placeholder="#3b82f6"
              />
            </div>
          </div>

          {/* 角丸の設定 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              角丸
            </label>
            <div className="grid grid-cols-5 gap-2">
              {(['none', 'sm', 'md', 'lg', 'xl', 'full'] as const).map((radius) => (
                <button
                  key={radius}
                  onClick={() => updateTheme({ radius })}
                  className={`px-3 py-2 text-sm rounded-lg border-2 transition ${
                    currentTheme.radius === radius
                      ? 'border-primary-500 bg-primary-50 text-primary-700 font-medium'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  style={{
                    borderRadius: 
                      radius === 'none' ? '0' :
                      radius === 'sm' ? '0.125rem' :
                      radius === 'md' ? '0.375rem' :
                      radius === 'lg' ? '0.5rem' :
                      radius === 'xl' ? '0.75rem' :
                      '9999px'
                  }}
                >
                  {radius === 'none' ? 'なし' :
                   radius === 'sm' ? '小' :
                   radius === 'md' ? '中' :
                   radius === 'lg' ? '大' :
                   radius === 'xl' ? '特大' :
                   '完全'}
                </button>
              ))}
            </div>
          </div>

          {/* プレビュー */}
          <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-xs font-medium text-slate-600 mb-2">プレビュー</p>
            <div
              className="p-3 rounded-lg text-white text-sm font-medium"
              style={{
                backgroundColor: currentTheme.primaryColor,
                borderRadius: 
                  currentTheme.radius === 'none' ? '0' :
                  currentTheme.radius === 'sm' ? '0.125rem' :
                  currentTheme.radius === 'md' ? '0.375rem' :
                  currentTheme.radius === 'lg' ? '0.5rem' :
                  currentTheme.radius === 'xl' ? '0.75rem' :
                  '9999px'
              }}
            >
              プライマリボタン
            </div>
          </div>
        </div>

        {/* 既存のコンポーネントプロパティ編集セクション */}
        {selectedComponent ? (
          // ... 既存のコード ...
        ) : (
          <div className="text-center py-12 text-slate-500">
            <p>コンポーネントを選択するか、テーマを編集してください</p>
          </div>
        )}
      </aside>
    </div>
  );
};
```

---

### 2.3 テーマの適用（CSS変数を使用）

テーマ設定を実際のUIに適用するために、CSS変数を使用します。

#### 実装例

```typescript
// src/utils/applyTheme.ts

import { ThemeConfig } from '../types';

export const applyTheme = (theme: ThemeConfig) => {
  const root = document.documentElement;
  
  // プライマリカラーをCSS変数に設定
  root.style.setProperty('--color-primary', theme.primaryColor);
  
  // カラーモード
  if (theme.mode === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  
  // 角丸の設定（Tailwindのカスタムプロパティとして）
  const radiusMap = {
    none: '0',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px',
  };
  root.style.setProperty('--radius', radiusMap[theme.radius]);
};

// UITabで使用
useEffect(() => {
  if (designConfig?.theme) {
    applyTheme(designConfig.theme);
  }
}, [designConfig?.theme]);
```

---

### 2.4 Firebase Firestoreへの保存

テーマ設定をFirestoreに保存します。

#### 実装例

```typescript
// src/utils/firestore.ts

import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { DesignConfig } from '../types';

const db = getFirestore();

// デザイン設定を保存
export const saveDesignConfig = async (
  userId: string,
  appId: string,
  designConfig: DesignConfig
): Promise<void> => {
  const designRef = doc(db, `users/${userId}/apps/${appId}/design`);
  await setDoc(designRef, designConfig, { merge: true });
};

// デザイン設定を読み込み
export const loadDesignConfig = async (
  userId: string,
  appId: string
): Promise<DesignConfig | null> => {
  const designRef = doc(db, `users/${userId}/apps/${appId}/design`);
  const docSnap = await getDoc(designRef);
  
  if (docSnap.exists()) {
    return docSnap.data() as DesignConfig;
  }
  return null;
};
```

#### AppContextでの使用

```typescript
// src/context/AppContext.tsx

import { saveDesignConfig, loadDesignConfig } from '../utils/firestore';

const updateTheme = async (themeUpdates: Partial<ThemeConfig>) => {
  const updatedConfig = {
    ...designConfig,
    theme: {
      ...designConfig?.theme,
      ...themeUpdates,
    },
  };
  
  setDesignConfig(updatedConfig);
  
  // Firebaseに保存
  if (user && activeAppId && updatedConfig) {
    await saveDesignConfig(user.id, activeAppId, updatedConfig);
  }
};

// アプリ読み込み時にデザイン設定を取得
useEffect(() => {
  if (user && activeAppId) {
    loadDesignConfig(user.id, activeAppId).then(setDesignConfig);
  }
}, [user, activeAppId]);
```

---

### 2.5 テンプレートのデフォルトテーマ

テンプレート選択時に、デフォルトテーマを適用します。

#### 実装例

```typescript
// src/utils/templateDefaults.ts

import { ThemeConfig } from '../types';

export const getTemplateDefaultTheme = (
  templateId: string
): ThemeConfig => {
  const themeMap: Record<string, ThemeConfig> = {
    crm: {
      mode: 'light',
      primaryColor: '#9333ea', // Purple
      radius: 'md',
    },
    inventory: {
      mode: 'light',
      primaryColor: '#3b82f6', // Blue
      radius: 'md',
    },
    'daily-report': {
      mode: 'light',
      primaryColor: '#16a34a', // Green
      radius: 'md',
    },
    reservation: {
      mode: 'light',
      primaryColor: '#ea580c', // Orange
      radius: 'md',
    },
    // ... 他のテンプレート
  };
  
  return themeMap[templateId] || {
    mode: 'light',
    primaryColor: '#3b82f6',
    radius: 'md',
  };
};

// PolicyTabでテンプレート選択時に使用
const handleTemplateSelect = () => {
  if (app && selectedTemplateForModal) {
    updateApp(app.id, { template: selectedTemplateForModal.id });
    
    // デフォルトテーマを適用
    const defaultTheme = getTemplateDefaultTheme(selectedTemplateForModal.id);
    updateTheme(defaultTheme);
  }
};
```

---

## 3. 実装のステップ

### Step 1: AppContextの拡張
1. `DesignConfig`のstateを追加
2. `updateTheme`関数を実装
3. Firebaseへの保存・読み込み機能を追加

### Step 2: UITabにテーマ編集UIを追加
1. 右側パネルにテーマ編集セクションを追加
2. カラーモード、プライマリカラー、角丸の編集UIを実装
3. リアルタイムプレビューを実装

### Step 3: テーマの適用
1. `applyTheme`関数を実装
2. CSS変数を使用してテーマを適用
3. プレビュー画面にテーマを反映

### Step 4: Firebase連携
1. Firestoreへの保存機能を実装
2. アプリ読み込み時にテーマ設定を取得
3. リアルタイム同期（オプション）

### Step 5: テンプレートのデフォルトテーマ
1. テンプレートごとのデフォルトテーマを定義
2. テンプレート選択時に自動適用

---

## 4. データフロー

```
1. ユーザーがテーマを編集
   ↓
2. updateTheme()が呼ばれる
   ↓
3. AppContextのstateが更新される
   ↓
4. applyTheme()でCSS変数が更新される
   ↓
5. プレビュー画面に即座に反映
   ↓
6. Firebase Firestoreに保存（非同期）
```

---

## 5. セキュリティ

### Firestoreセキュリティルール

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/apps/{appId}/design {
      // ユーザーは自分のアプリのデザイン設定のみ読み書き可能
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 6. まとめ

### 実装のポイント

1. **データ保管**: `DesignConfig`としてFirestoreに保存
2. **リアルタイム反映**: CSS変数を使用して即座に反映
3. **テンプレート連携**: テンプレート選択時にデフォルトテーマを適用
4. **ユーザビリティ**: プリセットカラーとカスタムカラーの両方をサポート

### 次のステップ

- テーマのエクスポート/インポート機能
- テーマの共有機能（将来の拡張）
- より詳細なカスタマイズ（フォント、スペーシング等）



