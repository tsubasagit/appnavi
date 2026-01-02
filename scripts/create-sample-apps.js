/**
 * サンプルアプリ作成スクリプト
 * ブラウザのコンソールから実行してください
 * 
 * 使用方法:
 * 1. ブラウザでアプリにログイン（tsubasa.test@apptalenthub.co.jp）
 * 2. 開発者ツールのコンソールを開く
 * 3. このスクリプトをコピー＆ペーストして実行
 */

// Firebaseのインポート（ブラウザ環境で実行するため、グローバル変数を使用）
// 注意: このスクリプトは src/utils/firestore.ts の関数を使用します

// サンプルアプリのデータ
const sampleApps = [
  {
    name: '顧客管理アプリ',
    template: 'crm',
    description: '顧客情報を管理するアプリ',
    mission: '顧客情報を一元管理し、営業活動を効率化する',
  },
  {
    name: '在庫管理アプリ',
    template: 'inventory',
    description: '商品の在庫を管理するアプリ',
    mission: '在庫状況をリアルタイムで把握し、適切な発注を行う',
  },
  {
    name: '日報アプリ',
    template: 'daily-report',
    description: '日次レポートを記録するアプリ',
    mission: '日々の業務内容を記録し、進捗を可視化する',
  },
]

// スクリプト実行関数
async function createSampleApps() {
  try {
    // Firebase Authから現在のユーザーを取得
    const { getAuth } = await import('firebase/auth')
    const auth = getAuth()
    const currentUser = auth.currentUser

    if (!currentUser) {
      console.error('エラー: ログインしていません。tsubasa.test@apptalenthub.co.jpでログインしてください。')
      return
    }

    if (currentUser.email !== 'tsubasa.test@apptalenthub.co.jp') {
      console.error(`エラー: 現在のユーザーは ${currentUser.email} です。tsubasa.test@apptalenthub.co.jpでログインしてください。`)
      return
    }

    const userId = currentUser.uid
    console.log(`ユーザーID: ${userId}`)
    console.log(`メールアドレス: ${currentUser.email}`)

    // Firestoreの関数をインポート
    const { getFirestore, collection, doc, setDoc, serverTimestamp } = await import('firebase/firestore')
    const { app } = await import('/src/utils/firebase.ts')
    const db = getFirestore(app)

    const FIRESTORE_COLLECTIONS = {
      APPS: 'apps',
    }

    // 各サンプルアプリを作成
    for (const appData of sampleApps) {
      const appId = `app-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      const appDoc = {
        title: appData.name,
        ownerId: userId,
        // App型（src/types/index.ts）のデータも含める
        id: appId,
        name: appData.name,
        description: appData.description,
        template: appData.template,
        mission: appData.mission,
        dataSource: {
          type: 'google-sheets',
        },
        status: 'building',
        buildProgress: {
          strategy: false,
          design: false,
          data: false,
        },
        lastUpdated: new Date().toISOString().slice(0, 16).replace('T', ' '),
        views: 0,
        createdAt: new Date().toISOString().slice(0, 10),
        deployment: {
          dockerGenerated: false,
        },
        // Firestore型（src/types/firestore.ts）のデータ
        theme: {
          primaryColor: '#3b82f6',
          darkMode: false,
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      const appRef = doc(db, FIRESTORE_COLLECTIONS.APPS, appId)
      await setDoc(appRef, appDoc)
      
      console.log(`✓ 作成完了: ${appData.name} (ID: ${appId})`)
    }

    console.log('✓ すべてのサンプルアプリの作成が完了しました！')
    console.log('ページをリロードして、アプリ一覧を確認してください。')
  } catch (error) {
    console.error('エラーが発生しました:', error)
  }
}

// 実行
createSampleApps()


