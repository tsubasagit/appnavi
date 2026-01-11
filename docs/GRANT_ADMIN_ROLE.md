# 管理者権限の付与方法

## 概要

特定のユーザーに管理者権限を付与する方法を説明します。

## 方法1: ブラウザコンソールから実行（推奨）

### 手順

1. **AppNaviアプリケーションにログイン**
   - 既に管理者権限を持つユーザーでログイン（初回の場合は、Firebase Consoleから直接更新）

2. **開発者ツールを開く**
   - `F12` キーを押す
   - または、右クリック → 「検証」→「コンソール」タブ

3. **スクリプトを実行**
   - `scripts/grant-admin-role.js` の内容をコピー＆ペースト
   - 以下のコマンドを実行：

```javascript
grantAdminRole('tsubasa.miyazaki@apptalenthub.co.jp')
```

4. **実行結果を確認**
   - コンソールに「✅ 管理者権限を付与しました！」と表示されれば成功
   - ページをリロードして、変更を確認

## 方法2: Firebase Consoleから直接更新

1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. プロジェクト `appnavi-add7e` を選択
3. **Firestore Database** を開く
4. **`users`** コレクションを選択
5. 該当するユーザーのドキュメントを開く（メールアドレスで検索）
6. **`role`** フィールドを編集
   - 値: `admin`
7. **保存**

## 方法3: Firebase Admin SDKを使用（Node.jsスクリプト）

管理者がNode.jsスクリプトを使用して管理者権限を付与します：

```javascript
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// Firebase Admin SDKを初期化
initializeApp({
  credential: cert(serviceAccount),
  projectId: 'appnavi-add7e'
})

const db = getFirestore()

// メールアドレスでユーザーを検索
const usersRef = db.collection('users')
const snapshot = await usersRef.where('email', '==', 'tsubasa.miyazaki@apptalenthub.co.jp').get()

if (snapshot.empty) {
  console.error('ユーザーが見つかりません')
  process.exit(1)
}

// 最初のユーザーに管理者権限を付与
const userDoc = snapshot.docs[0]
await userDoc.ref.update({
  role: 'admin',
  updatedAt: new Date()
})

console.log('✅ 管理者権限を付与しました')
```

## 注意事項

- **初回の管理者権限付与**: 最初の管理者を作成する場合は、Firebase Consoleから直接更新する必要があります
- **セキュリティ**: 管理者権限を持つユーザーは、すべてのテンプレートを管理できます
- **ロールの種類**:
  - `user`: 一般ユーザー（デフォルト）
  - `vendor`: ベンダー（自分のテンプレートのみ管理可能）
  - `admin`: 管理者（すべてのテンプレートを管理可能）

## トラブルシューティング

### エラー: "ユーザーが見つかりません"

- メールアドレスが正しいか確認
- ユーザーがFirestoreの`users`コレクションに存在するか確認
- ユーザーが初回ログインしているか確認（初回ログイン時にユーザードキュメントが作成されます）

### エラー: "Missing or insufficient permissions"

- 管理者権限を持つユーザーでログインしているか確認
- Firestoreのセキュリティルールを確認


