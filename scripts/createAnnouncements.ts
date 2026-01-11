/**
 * お知らせの初期データを作成するスクリプト
 * 実行方法: npx tsx scripts/createAnnouncements.ts
 */

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// 環境変数を読み込む
dotenv.config({ path: resolve(__dirname, '../.env.local') })

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
}

async function createAnnouncements() {
  try {
    // Firebaseを初期化
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)

    console.log('お知らせを作成中...')

    // お知らせ1: 明けましておめでとうございます
    const announcement1 = {
      title: '明けましておめでとうございます',
      content: '2025年もAppNaviをよろしくお願いいたします。',
      type: 'info' as const,
      date: Timestamp.fromDate(new Date('2025-01-11')),
      isActive: true,
      isNew: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }

    // お知らせ2: メンテナンスのお知らせ
    const announcement2 = {
      title: 'メンテナンスのお知らせ',
      content: '2025年1月12日 2:00-4:00にメンテナンスを実施します。ご不便をおかけして申し訳ございません。',
      type: 'warning' as const,
      date: Timestamp.fromDate(new Date('2025-01-12')),
      isActive: true,
      isNew: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }

    // Firestoreに追加
    const docRef1 = await addDoc(collection(db, 'announcements'), announcement1)
    console.log('お知らせ1を作成しました:', docRef1.id)

    const docRef2 = await addDoc(collection(db, 'announcements'), announcement2)
    console.log('お知らせ2を作成しました:', docRef2.id)

    console.log('お知らせの作成が完了しました！')
    process.exit(0)
  } catch (error) {
    console.error('エラーが発生しました:', error)
    process.exit(1)
  }
}

createAnnouncements()
