# B2B2B機能の実装分担（AppNavi vs AppNavi-asset）

## 概要

B2B2B機能を実装する際の、AppNavi本体とAppNavi-asset（外部サイト）の役割分担を定義します。

---

## 実装分担の原則

### AppNavi（本体）
- **エンドユーザー向け機能**: テンプレートの選択、適用、カスタマイズ
- **テンプレート実行環境**: テンプレートを実際に動作させる
- **プラグイン実行環境**: プラグイン（決済等）を実行する
- **データ管理**: ユーザーのアプリデータを管理

### AppNavi-asset（外部サイト）
- **マーケットプレイス**: テンプレートの検索、閲覧、購入
- **ベンダー向け管理**: テンプレートのアップロード、管理、統計
- **コンテンツ配信**: テンプレートファイル（JSON、画像等）の配信
- **コミュニティ機能**: レビュー、評価、サポート

### プラグイン（決済等）
- **独立したモジュール**: AppNaviとAppNavi-assetの両方から利用可能
- **AppNavi側で実行**: エンドユーザーの決済処理はAppNavi側で実行
- **AppNavi-asset側で管理**: プラグインの登録、設定はAppNavi-asset側で管理

---

## 詳細な実装分担

### 1. テンプレート管理機能

#### ✅ AppNavi（本体）で実装

##### 1.1 テンプレートの読み込み・インストール
- **機能**: AppNavi-assetからテンプレート情報を取得し、Firestoreにインストール
- **実装場所**: `src/utils/assetSite.ts`, `src/utils/firestore.ts`
- **既存実装**: `installTemplateFromAssetSite`関数
- **追加実装**:
  ```typescript
  // 価格・ライセンス情報も含めてインストール
  interface TemplateInstallData {
    templateId: string
    pricing?: PricingInfo      // 価格情報
    license?: LicenseInfo       // ライセンス情報
    // ... 既存フィールド
  }
  ```

##### 1.2 テンプレートの適用
- **機能**: 選択したテンプレートをアプリに適用
- **実装場所**: `src/components/tabs/PolicyTab.tsx`
- **既存実装**: `confirmTemplateChange`関数
- **追加実装**: 価格・ライセンス情報の表示、決済処理の呼び出し

##### 1.3 テンプレートのカスタマイズ
- **機能**: ユーザーがテンプレートを編集
- **実装場所**: `src/components/tabs/UITab.tsx`
- **既存実装**: コンポーネント編集機能
- **追加実装**: `isCustomized`フラグの更新

##### 1.4 価格・ライセンス情報の表示
- **機能**: テンプレート選択時に価格・ライセンス情報を表示
- **実装場所**: `src/components/tabs/PolicyTab.tsx`
- **新規実装**:
  ```typescript
  interface PricingInfo {
    model: 'free' | 'subscription' | 'one-time' | 'trial'
    price?: number
    currency?: string
    billingPeriod?: 'monthly' | 'yearly'
    trialDays?: number
  }
  
  interface LicenseInfo {
    type: 'free' | 'paid' | 'enterprise'
    terms?: string
    maxUsers?: number
    maxApps?: number
  }
  ```

##### 1.5 決済プラグインとの連携
- **機能**: 有料テンプレート選択時に決済プラグインを呼び出す
- **実装場所**: `src/components/tabs/PolicyTab.tsx`
- **新規実装**:
  ```typescript
  // 決済プラグインの呼び出し
  const handlePurchaseTemplate = async (template: Template) => {
    if (template.pricing?.model === 'free') {
      // 無料テンプレートはそのまま適用
      await applyTemplate(template)
    } else {
      // 有料テンプレートは決済プラグインを呼び出す
      const paymentPlugin = await loadPaymentPlugin()
      const result = await paymentPlugin.processPayment({
        templateId: template.templateId,
        price: template.pricing.price,
        // ...
      })
      if (result.success) {
        await applyTemplate(template)
      }
    }
  }
  ```

#### ✅ AppNavi-asset（外部サイト）で実装

##### 1.1 テンプレートのアップロード・管理
- **機能**: ベンダーがテンプレートをアップロード、編集、公開/非公開切り替え
- **実装場所**: AppNavi-asset側の管理画面
- **新規実装**: 
  - テンプレートアップロードフォーム
  - 価格設定フォーム
  - ライセンス設定フォーム
  - 公開/非公開切り替え

##### 1.2 テンプレートの配信
- **機能**: テンプレートファイル（JSON、画像等）を配信
- **実装場所**: AppNavi-asset側のAPI
- **既存実装**: `templates.json`, `schema.json`, `views.json`
- **追加実装**: 価格・ライセンス情報を含む`metadata.json`

##### 1.3 テンプレートの検索・閲覧
- **機能**: ユーザーがテンプレートを検索、閲覧
- **実装場所**: AppNavi-asset側のマーケットプレイス
- **新規実装**: 
  - 検索・フィルタ機能
  - カテゴリ別表示
  - 価格別表示
  - レビュー・評価表示

---

### 2. マーケットプレイス機能

#### ✅ AppNavi-asset（外部サイト）で実装

##### 2.1 テンプレート一覧・検索
- **機能**: テンプレートの一覧表示、検索、フィルタ
- **実装場所**: AppNavi-asset側のマーケットプレイスページ
- **新規実装**:
  - 検索バー
  - カテゴリフィルタ
  - 価格フィルタ
  - 評価フィルタ
  - ソート機能

##### 2.2 テンプレート詳細ページ
- **機能**: テンプレートの詳細情報、プレビュー、レビューを表示
- **実装場所**: AppNavi-asset側のテンプレート詳細ページ
- **新規実装**:
  - テンプレート情報表示
  - プレビュー画像・動画
  - 価格・ライセンス情報
  - レビュー・評価
  - 「AppNaviで開く」ボタン（AppNavi側へのリダイレクト）

##### 2.3 レビュー・評価機能
- **機能**: ユーザーがテンプレートをレビュー・評価
- **実装場所**: AppNavi-asset側のレビューページ
- **新規実装**:
  - レビュー投稿フォーム
  - 評価（星評価）
  - レビュー一覧表示

---

### 3. ベンダー向けダッシュボード

#### ✅ AppNavi-asset（外部サイト）で実装

##### 3.1 テンプレート管理
- **機能**: ベンダーが自分のテンプレートを管理
- **実装場所**: AppNavi-asset側のベンダーダッシュボード
- **新規実装**:
  - テンプレート一覧（自分のテンプレートのみ）
  - テンプレートの追加・編集・削除
  - 公開/非公開切り替え
  - 価格設定

##### 3.2 売上・統計情報
- **機能**: テンプレートの売上、ダウンロード数、評価を表示
- **実装場所**: AppNavi-asset側のベンダーダッシュボード
- **新規実装**:
  - 売上グラフ（月次、年次）
  - ダウンロード数
  - 評価平均
  - レビュー一覧

##### 3.3 アカウント管理
- **機能**: ベンダーアカウントの管理
- **実装場所**: AppNavi-asset側のベンダーダッシュボード
- **新規実装**:
  - プロフィール編集
  - 決済情報設定（受取口座等）
  - 通知設定

---

### 4. 決済機能（プラグイン）

#### ✅ プラグインとして実装

##### 4.1 プラグインの位置づけ

**決済プラグインは、AppNaviとAppNavi-assetの両方から利用可能な独立したモジュールとして実装します。**

```
┌─────────────────┐         ┌──────────────────┐
│  AppNavi-asset  │         │     AppNavi      │
│  (外部サイト)    │         │    (本体)         │
└────────┬────────┘         └────────┬─────────┘
         │                            │
         │  プラグイン管理              │  プラグイン実行
         │  (登録、設定)               │  (決済処理)
         │                            │
         └────────────┬───────────────┘
                      │
              ┌───────▼────────┐
              │  決済プラグイン   │
              │  (独立モジュール) │
              └─────────────────┘
```

##### 4.2 AppNavi-asset側の役割

###### 4.2.1 プラグインの登録・管理
- **機能**: ベンダーが決済プラグインを登録、設定
- **実装場所**: AppNavi-asset側のプラグイン管理画面
- **新規実装**:
  - プラグイン登録フォーム
  - プラグイン設定（Stripe API Key等）
  - プラグイン一覧
  - プラグインの有効/無効切り替え

###### 4.2.2 プラグインの配信
- **機能**: プラグインのJavaScriptファイルを配信
- **実装場所**: AppNavi-asset側のCDN
- **新規実装**:
  - プラグインのバンドル・配信
  - バージョン管理
  - プラグインのメタデータ（`plugin.json`）

##### 4.3 AppNavi側の役割

###### 4.3.1 プラグインの読み込み
- **機能**: AppNavi-assetからプラグインを動的に読み込む
- **実装場所**: `src/utils/plugins.ts`（新規作成）
- **新規実装**:
  ```typescript
  // プラグインの読み込み
  export const loadPaymentPlugin = async (pluginId: string) => {
    // AppNavi-assetからプラグインのメタデータを取得
    const metadata = await fetch(`https://tsubasagit.github.io/AppNavi-asset/plugins/${pluginId}/plugin.json`)
    const pluginData = await metadata.json()
    
    // プラグインのJavaScriptファイルを動的に読み込む
    const script = document.createElement('script')
    script.src = pluginData.assetUrl
    document.head.appendChild(script)
    
    // プラグインの初期化
    return new Promise((resolve) => {
      script.onload = () => {
        const plugin = window.PaymentPlugins[pluginId]
        resolve(plugin)
      }
    })
  }
  ```

###### 4.3.2 プラグインの実行
- **機能**: 決済処理を実行
- **実装場所**: `src/components/tabs/PolicyTab.tsx`
- **新規実装**:
  ```typescript
  // 決済処理の実行
  const handlePurchaseTemplate = async (template: Template) => {
    if (template.pricing?.model === 'free') {
      await applyTemplate(template)
      return
    }
    
    // 決済プラグインを読み込む
    const paymentPlugin = await loadPaymentPlugin('stripe-payment')
    
    // 決済処理を実行
    const result = await paymentPlugin.processPayment({
      templateId: template.templateId,
      price: template.pricing.price,
      currency: template.pricing.currency || 'JPY',
      billingPeriod: template.pricing.billingPeriod,
      // コールバックURL（決済完了後の処理）
      successUrl: `${window.location.origin}/app/${activeAppId}/policy?template=${template.templateId}&status=success`,
      cancelUrl: `${window.location.origin}/app/${activeAppId}/policy?template=${template.templateId}&status=cancel`,
    })
    
    if (result.success) {
      // 決済成功時、テンプレートを適用
      await applyTemplate(template)
      // ライセンス情報を保存
      await saveLicense(template.templateId, result.license)
    }
  }
  ```

###### 4.3.3 ライセンス管理
- **機能**: ユーザーのライセンス情報を管理
- **実装場所**: `src/utils/firestore.ts`
- **新規実装**:
  ```typescript
  // ライセンス情報の保存
  export const saveLicense = async (
    userId: string,
    templateId: string,
    license: LicenseInfo
  ) => {
    const licenseRef = doc(
      db,
      getSubCollectionPath.users(userId),
      'licenses',
      templateId
    )
    await setDoc(licenseRef, {
      templateId,
      licenseType: license.type,
      purchasedAt: serverTimestamp(),
      expiresAt: license.expiresAt,
      // ...
    })
  }
  
  // ライセンス情報の確認
  export const checkLicense = async (
    userId: string,
    templateId: string
  ): Promise<boolean> => {
    const licenseRef = doc(
      db,
      getSubCollectionPath.users(userId),
      'licenses',
      templateId
    )
    const licenseDoc = await getDoc(licenseRef)
    if (!licenseDoc.exists()) return false
    
    const license = licenseDoc.data()
    // 有効期限の確認
    if (license.expiresAt && license.expiresAt.toMillis() < Date.now()) {
      return false
    }
    return true
  }
  ```

##### 4.4 プラグインの実装例（Stripe決済プラグイン）

```typescript
// AppNavi-asset側で配信されるプラグイン
// plugins/stripe-payment/plugin.js

window.PaymentPlugins = window.PaymentPlugins || {}

window.PaymentPlugins['stripe-payment'] = {
  async processPayment(options: {
    templateId: string
    price: number
    currency: string
    billingPeriod?: 'monthly' | 'yearly'
    successUrl: string
    cancelUrl: string
  }) {
    // Stripe Checkoutを開く
    const stripe = Stripe(process.env.VITE_STRIPE_PUBLIC_KEY)
    const session = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        templateId: options.templateId,
        price: options.price,
        currency: options.currency,
        billingPeriod: options.billingPeriod,
        successUrl: options.successUrl,
        cancelUrl: options.cancelUrl,
      }),
    }).then(res => res.json())
    
    // Stripe Checkoutにリダイレクト
    const result = await stripe.redirectToCheckout({ sessionId: session.id })
    
    if (result.error) {
      return { success: false, error: result.error.message }
    }
    
    return { success: true }
  },
  
  async verifyPayment(sessionId: string) {
    // 決済の確認
    const session = await fetch(`/api/verify-payment?sessionId=${sessionId}`)
      .then(res => res.json())
    
    if (session.payment_status === 'paid') {
      return {
        success: true,
        license: {
          type: 'paid',
          expiresAt: session.expiresAt,
        },
      }
    }
    
    return { success: false }
  },
}
```

---

## データフロー

### テンプレート購入フロー

```
1. ユーザーがAppNavi-assetでテンプレートを閲覧
   ↓
2. 「AppNaviで開く」ボタンをクリック
   ↓
3. AppNavi側にリダイレクト（テンプレートIDをパラメータに含む）
   ↓
4. AppNavi側でテンプレート情報を取得（価格・ライセンス情報を含む）
   ↓
5. 有料テンプレートの場合、決済プラグインを読み込む
   ↓
6. 決済処理を実行（Stripe Checkout等）
   ↓
7. 決済成功後、テンプレートを適用
   ↓
8. ライセンス情報をFirestoreに保存
```

### プラグイン読み込みフロー

```
1. AppNavi側で有料テンプレートを選択
   ↓
2. AppNavi-assetからプラグインのメタデータを取得
   ↓
3. プラグインのJavaScriptファイルを動的に読み込む
   ↓
4. プラグインを初期化
   ↓
5. 決済処理を実行
```

---

## 実装優先順位

### Phase 1: 基盤実装（最優先）
1. **AppNavi側**: 価格・ライセンス情報の表示
2. **AppNavi側**: 決済プラグインの読み込み機能
3. **AppNavi-asset側**: テンプレートに価格・ライセンス情報を追加
4. **AppNavi-asset側**: プラグインのメタデータ配信

### Phase 2: 決済機能（最優先）
1. **プラグイン**: Stripe決済プラグインの実装
2. **AppNavi側**: 決済処理の実行
3. **AppNavi側**: ライセンス管理機能

### Phase 3: マーケットプレイス（中優先）
1. **AppNavi-asset側**: テンプレート一覧・検索機能
2. **AppNavi-asset側**: テンプレート詳細ページ
3. **AppNavi-asset側**: レビュー・評価機能

### Phase 4: ベンダー向けダッシュボード（中優先）
1. **AppNavi-asset側**: ベンダーダッシュボード
2. **AppNavi-asset側**: テンプレート管理機能
3. **AppNavi-asset側**: 売上・統計情報

---

## まとめ

### AppNavi（本体）で実装
- ✅ テンプレートの読み込み・適用
- ✅ 価格・ライセンス情報の表示
- ✅ 決済プラグインの読み込み・実行
- ✅ ライセンス管理

### AppNavi-asset（外部サイト）で実装
- ✅ マーケットプレイス（検索、閲覧、レビュー）
- ✅ ベンダー向けダッシュボード（管理、統計）
- ✅ テンプレートのアップロード・配信
- ✅ プラグインの登録・配信

### プラグイン（決済等）
- ✅ 独立したモジュールとして実装
- ✅ AppNavi-asset側で管理・配信
- ✅ AppNavi側で実行

この分担により、AppNavi本体はシンプルに保ちつつ、B2B2B機能を実現できます。
