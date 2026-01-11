/**
 * ユーザーに管理者権限を付与するスクリプト
 * 
 * 使用方法:
 * 1. AppNaviアプリケーションにログイン（管理者権限を持つユーザーで）
 * 2. 開発者ツールのコンソールを開く（F12）
 * 3. このファイルの内容をコピー＆ペースト
 * 4. grantAdminRole('tsubasa.miyazaki@apptalenthub.co.jp') を実行
 * 
 * 注意: このスクリプトは、既にアプリケーションで初期化されているFirebaseインスタンスを使用します。
 */

// ユーザーに管理者権限を付与する関数
async function grantAdminRole(email) {
  try {
    console.log(`管理者権限を付与中: ${email}`)
    
    // Firebaseインスタンスの準備を待つ
    let firestoreModule = window.__firebaseFirestore
    let db = window.__firestoreDb
    let authModule = window.__firebaseAuth
    
    if (!firestoreModule || !db) {
      console.log('Firebaseインスタンスの準備を待っています...')
      for (let i = 0; i < 50; i++) {
        await new Promise(resolve => setTimeout(resolve, 100))
        firestoreModule = window.__firebaseFirestore
        db = window.__firestoreDb
        authModule = window.__firebaseAuth
        if (firestoreModule && db) break
      }
    }
    
    if (!firestoreModule || !db) {
      throw new Error('Firebaseインスタンスが見つかりません。ページをリロードしてから再度実行してください。')
    }
    
    const { doc, getDoc, updateDoc, collection, query, where, getDocs, serverTimestamp } = firestoreModule
    
    // メールアドレスでユーザーを検索
    console.log('ユーザーを検索中...')
    const usersRef = collection(db, 'users')
    const q = query(usersRef, where('email', '==', email))
    const querySnapshot = await getDocs(q)
    
    if (querySnapshot.empty) {
      throw new Error(`ユーザーが見つかりません: ${email}`)
    }
    
    // 最初のユーザードキュメントを取得
    const userDoc = querySnapshot.docs[0]
    const userId = userDoc.id
    const userData = userDoc.data()
    
    console.log(`ユーザーが見つかりました:`)
    console.log(`  - UID: ${userId}`)
    console.log(`  - メールアドレス: ${userData.email}`)
    console.log(`  - 現在のロール: ${userData.role || 'user'}`)
    
    // 管理者権限を付与
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
      role: 'admin',
      updatedAt: serverTimestamp()
    })
    
    console.log(`✅ 管理者権限を付与しました！`)
    console.log(`  - ユーザー: ${email}`)
    console.log(`  - UID: ${userId}`)
    console.log(`  - 新しいロール: admin`)
    console.log(`\nページをリロードして、変更を確認してください。`)
  } catch (error) {
    console.error('❌ エラーが発生しました:', error)
    if (error.code) {
      console.error('エラーコード:', error.code)
      console.error('エラーメッセージ:', error.message)
    }
    throw error
  }
}

// グローバル関数として公開
if (typeof window !== 'undefined') {
  window.grantAdminRole = grantAdminRole
  console.log('grantAdminRole() 関数が利用可能です。')
  console.log('実行するには: grantAdminRole("tsubasa.miyazaki@apptalenthub.co.jp")')
}


