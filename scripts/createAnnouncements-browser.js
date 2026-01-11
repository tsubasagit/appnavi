/**
 * ブラウザのコンソールから実行できるお知らせ作成スクリプト
 * 
 * 使用方法:
 * 1. ブラウザの開発者ツール（F12）を開く
 * 2. コンソールタブを開く
 * 3. このファイルの内容をコピー＆ペーストして実行
 * 
 * 注意: 管理者権限が必要です（role: 'admin'）
 */

(async function createAnnouncements() {
  try {
    // Firebaseモジュールをインポート（既に読み込まれている場合）
    const { getFirestore, collection, addDoc, Timestamp } = window.__firebaseFirestore || {};
    const db = window.__firestoreDb;

    if (!db || !addDoc) {
      console.error('Firestoreが初期化されていません。ページをリロードしてから再度実行してください。');
      return;
    }

    console.log('お知らせを作成中...');

    // お知らせ1: 明けましておめでとうございます
    const announcement1 = {
      title: '明けましておめでとうございます',
      content: '2025年もAppNaviをよろしくお願いいたします。',
      type: 'info',
      date: Timestamp.fromDate(new Date('2025-01-11')),
      isActive: true,
      isNew: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    // お知らせ2: メンテナンスのお知らせ
    const announcement2 = {
      title: 'メンテナンスのお知らせ',
      content: '2025年1月12日 2:00-4:00にメンテナンスを実施します。ご不便をおかけして申し訳ございません。',
      type: 'warning',
      date: Timestamp.fromDate(new Date('2025-01-12')),
      isActive: true,
      isNew: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    // Firestoreに追加
    const docRef1 = await addDoc(collection(db, 'announcements'), announcement1);
    console.log('✅ お知らせ1を作成しました:', docRef1.id);

    const docRef2 = await addDoc(collection(db, 'announcements'), announcement2);
    console.log('✅ お知らせ2を作成しました:', docRef2.id);

    console.log('🎉 お知らせの作成が完了しました！');
    console.log('ページをリロードして、お知らせが表示されることを確認してください。');
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    if (error.code === 'permission-denied') {
      console.error('権限エラー: 管理者権限が必要です。');
    }
  }
})();
