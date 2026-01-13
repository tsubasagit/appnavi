# Google Workspaceでサービスアカウントキーが作成できない場合の対処法

Google Workspaceを使用している場合、組織のポリシーによってサービスアカウントキーの作成が制限されている可能性があります。

## エラーメッセージ

```
このサービス アカウントの鍵の作成が許可されていません。
サービス アカウントの鍵の作成が組織のポリシーによって制限されているかどうかを確認してください。
```

## 解決方法

### 方法1: Google Workspaceの組織ポリシーを変更（管理者権限が必要）

1. **Google Admin Consoleにアクセス**
   - [Google Admin Console](https://admin.google.com/)にアクセス
   - 管理者アカウントでログイン

2. **セキュリティ設定を開く**
   - 左メニューから「セキュリティ」を選択
   - 「API制御」または「アクセスとデータ制御」を選択

3. **サービスアカウントキーの作成を許可**
   - 「サービスアカウントキーの作成」の設定を確認
   - 必要に応じて、特定の組織単位（OU）またはユーザーに対して許可を設定

4. **Cloud Identityの設定を確認**
   - [Cloud Identity Admin](https://admin.cloudidentity.google.com/)にアクセス
   - 「セキュリティ」→「API制御」を確認
   - サービスアカウントキーの作成が許可されているか確認

### 方法2: ブラウザコンソールから実行（推奨・簡単）

サービスアカウントキーが不要な方法です。ブラウザコンソールから直接実行できます。

#### お知らせを作成する場合

1. AppNaviアプリケーションにログイン（管理者権限が必要）
2. ブラウザの開発者ツール（F12）を開く
3. コンソールタブで以下のスクリプトを実行：

```javascript
// scripts/createFirstAnnouncement-browser.js の内容をコピー＆ペースト
```

または、直接実行：

```javascript
(async function createFirstAnnouncement() {
  try {
    const db = window.__firestoreDb;
    const firestoreModule = window.__firebaseFirestore;

    if (!db || !firestoreModule) {
      console.error('❌ Firestoreが初期化されていません。ページをリロードしてから再度実行してください。');
      return;
    }

    const { collection, addDoc, Timestamp } = firestoreModule;

    const announcement = {
      title: '最初のお知らせです。',
      content: '2026年1月13日 - AppNaviへようこそ！',
      type: 'info',
      date: Timestamp.fromDate(new Date('2026-01-13')),
      isActive: true,
      isNew: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, 'announcements'), announcement);
    console.log('✅ お知らせを作成しました！ID:', docRef.id);
  } catch (error) {
    console.error('❌ エラー:', error);
    if (error.code === 'permission-denied') {
      console.error('⚠️ 管理者権限が必要です。');
    }
  }
})();
```

#### テンプレートを作成する場合

```javascript
// scripts/createDefaultTemplates-browser-simple.js の内容をコピー＆ペースト
```

### 方法3: Firebase Consoleから直接作成

1. [Firebase Console](https://console.firebase.google.com/)にアクセス
2. プロジェクト `appnavi-add7e` を選択
3. **Firestore Database** を開く
4. コレクションを選択（`announcements` または `templates`）
5. 「ドキュメントを追加」をクリック
6. データを手動で入力

### 方法4: 個人のGoogleアカウントを使用（可能な場合）

組織アカウントではなく、個人のGoogleアカウントでFirebaseプロジェクトにアクセスできる場合は、個人アカウントからサービスアカウントキーを取得できます。

## 推奨される方法

**ブラウザコンソールから実行する方法（方法2）**が最も簡単で、組織ポリシーの制限を受けません。

## 管理者権限の確認

ブラウザコンソールから実行する場合、管理者権限が必要です。以下の方法で確認・設定できます：

1. Firebase Console > Firestore Database > `users` コレクション
2. 自分のユーザードキュメントを開く
3. `role` フィールドを `admin` に設定

または、ブラウザコンソールで：

```javascript
// 管理者権限を付与（既存のスクリプトを使用）
// scripts/grant-admin-role.js を参照
```
