# ブラウザコンソールでスクリプトを実行する方法

## 正しい実行方法

ブラウザコンソールでは、**ファイルパスではなく、ファイルの内容全体をコピー＆ペースト**する必要があります。

### ❌ 間違った方法

```javascript
// これは実行できません
scripts/createFirstAnnouncement-browser.js
```

### ✅ 正しい方法

1. `scripts/createFirstAnnouncement-browser.js` ファイルを開く
2. **ファイルの内容全体をコピー**（Ctrl+A → Ctrl+C）
3. ブラウザコンソールに**貼り付け**（Ctrl+V）
4. Enterキーを押して実行

## 簡単な実行用コード（コピー用）

### お知らせを作成

以下のコードをコピーしてコンソールに貼り付けてください：

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
