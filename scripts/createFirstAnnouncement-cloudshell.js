/**
 * Cloud Shellで実行する最初のお知らせ作成スクリプト
 * 
 * 実行方法:
 * 1. Google Cloud ConsoleでCloud Shellを開く
 * 2. プロジェクトをクローンまたはファイルをアップロード
 * 3. このスクリプトを実行: node scripts/createFirstAnnouncement-cloudshell.js
 * 
 * 注意: Cloud Shellでは既に認証されているため、サービスアカウントキーは不要です
 */

const { initializeApp } = require('firebase-admin/app');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');

async function createFirstAnnouncement() {
  try {
    console.log('📢 最初のお知らせを作成中...');

    // Cloud Shellでは既に認証されているため、プロジェクトIDのみ指定
    const projectId = 'appnavi-add7e';
    
    // Firebase Admin SDKを初期化（Application Default Credentialsを使用）
    let app;
    try {
      app = initializeApp({
        projectId: projectId
      });
      console.log('✅ Firebase Admin SDKを初期化しました');
    } catch (error) {
      // 既に初期化されている場合は無視
      const { getApps } = require('firebase-admin/app');
      const apps = getApps();
      if (apps.length > 0) {
        app = apps[0];
        console.log('✅ 既存のFirebase Admin SDKインスタンスを使用します');
      } else {
        throw error;
      }
    }

    const db = getFirestore(app);

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
    const docRef = await db.collection('announcements').add(announcement);
    console.log('✅ お知らせを作成しました！');
    console.log('   ID:', docRef.id);
    console.log('   タイトル:', announcement.title);
    console.log('   日付:', announcement.date.toDate().toLocaleDateString('ja-JP'));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    console.error('エラーメッセージ:', error.message);
    console.error('エラーコード:', error.code);
    
    if (error.code === 'permission-denied') {
      console.error('⚠️ 権限エラー: Firestoreのセキュリティルールを確認してください。');
    }
    
    process.exit(1);
  }
}

createFirstAnnouncement();
