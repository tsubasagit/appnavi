/**
 * ブラウザコンソールから実行するお知らせ作成スクリプト
 * 
 * 使用方法:
 * 1. AppNaviアプリケーションにログイン（管理者権限が必要）
 * 2. ブラウザの開発者ツール（F12）を開く
 * 3. コンソールタブでこのスクリプトをコピー＆ペーストして実行
 */

async function createAnnouncement() {
  try {
    // createAnnouncement関数をインポート
    const { createAnnouncement } = await import('/src/utils/firestore.ts')
    
    // 2026/1/13の日付で「最初のお知らせです。」というお知らせを作成
    const announcementData = {
      title: '最初のお知らせです。',
      content: '2026年1月13日 - AppNaviへようこそ！',
      type: 'info',
      date: new Date('2026-01-13'),
      isActive: true,
      isNew: true,
    }
    
    await createAnnouncement(announcementData)
    console.log('✅ お知らせを作成しました:', announcementData.title)
  } catch (error) {
    console.error('❌ エラーが発生しました:', error)
    console.error('スタックトレース:', error.stack)
    
    // フォールバック: 直接Firestoreに書き込む
    try {
      const db = window.__firestoreDb
      if (!db) {
        throw new Error('Firestoreが初期化されていません。ページをリロードしてから再試行してください。')
      }
      
      const firestoreModule = window.__firebaseFirestore
      if (!firestoreModule) {
        throw new Error('Firebase Firestoreモジュールが読み込まれていません。')
      }
      
      const { collection, addDoc, Timestamp } = firestoreModule
      
      const announcementData = {
        title: '最初のお知らせです。',
        content: '2026年1月13日 - AppNaviへようこそ！',
        type: 'info',
        date: Timestamp.fromDate(new Date('2026-01-13')),
        isActive: true,
        isNew: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      }
      
      const docRef = await addDoc(collection(db, 'announcements'), announcementData)
      console.log('✅ お知らせを作成しました（直接書き込み）:', docRef.id)
    } catch (fallbackError) {
      console.error('❌ フォールバック処理も失敗しました:', fallbackError)
    }
  }
}

// 実行
createAnnouncement()
