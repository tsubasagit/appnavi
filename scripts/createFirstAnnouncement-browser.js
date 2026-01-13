/**
 * ブラウザのコンソールから実行できる最初のお知らせ作成スクリプト
 * 
 * 使用方法:
 * 1. AppNaviアプリケーションにログイン（管理者権限が必要）
 * 2. ブラウザの開発者ツール（F12）を開く
 * 3. コンソールタブを開く
 * 4. このファイルの内容をコピー＆ペーストして実行
 * 
 * 注意: 管理者権限が必要です（role: 'admin'）
 */

(async function createFirstAnnouncement() {
  try {
    console.log('📢 最初のお知らせを作成中...');

    // 方法1: createAnnouncement関数を使用（推奨）
    try {
      const { createAnnouncement } = await import('/src/utils/firestore.ts');
      const { Timestamp } = await import('firebase/firestore');
      
      const announcementData = {
        title: '最初のお知らせです。',
        content: '2026年1月13日 - AppNaviへようこそ！',
        type: 'info',
        date: Timestamp.fromDate(new Date('2026-01-13')),
        isActive: true,
        isNew: true,
      };
      
      const announcementId = await createAnnouncement(announcementData);
      console.log('✅ お知らせを作成しました！');
      console.log('   ID:', announcementId);
      console.log('   タイトル:', announcementData.title);
      console.log('   日付:', announcementData.date.toDate().toLocaleDateString('ja-JP'));
      return;
    } catch (importError) {
      console.log('⚠️ createAnnouncement関数のインポートに失敗しました。直接書き込みを試みます...');
    }

    // 方法2: 直接Firestoreに書き込む（フォールバック）
    const db = window.__firestoreDb;
    const firestoreModule = window.__firebaseFirestore;

    if (!db || !firestoreModule) {
      console.error('❌ Firestoreが初期化されていません。ページをリロードしてから再度実行してください。');
      console.log('ヒント: window.__firestoreDb と window.__firebaseFirestore が存在するか確認してください。');
      return;
    }

    const { collection, addDoc, Timestamp } = firestoreModule;

    // 2026/1/13の日付で「最初のお知らせです。」というお知らせを作成
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

    // Firestoreに追加
    const docRef = await addDoc(collection(db, 'announcements'), announcement);
    console.log('✅ お知らせを作成しました！');
    console.log('   ID:', docRef.id);
    console.log('   タイトル:', announcement.title);
    console.log('   日付:', announcement.date.toDate().toLocaleDateString('ja-JP'));
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    console.error('エラーメッセージ:', error.message);
    console.error('エラーコード:', error.code);
    
    if (error.code === 'permission-denied') {
      console.error('⚠️ 権限エラー: 管理者権限が必要です。');
      console.error('解決方法:');
      console.error('1. Firebase Consoleでユーザーのroleを"admin"に設定');
      console.error('2. または、Firebase Consoleから直接お知らせを作成');
      console.error('3. Firebase Console > Firestore Database > announcements コレクション > ドキュメントを追加');
    }
  }
})();
