/**
 * 既存のテンプレートを公開テンプレートとして更新するスクリプト
 * 
 * 使用方法:
 * 1. AppNaviアプリケーションに管理者でログイン
 * 2. 開発者ツールのコンソールを開く（F12）
 * 3. このファイルの内容をコピー＆ペースト
 * 4. 実行されるまで待つ
 */

// テンプレートを公開テンプレートとして更新する関数
async function updateTemplatesToPublic() {
  try {
    console.log('テンプレートを公開テンプレートとして更新中...')
    
    // Firebaseインスタンスの準備を待つ
    let firestoreModule = window.__firebaseFirestore
    let db = window.__firestoreDb
    
    if (!firestoreModule || !db) {
      console.log('Firebaseインスタンスの準備を待っています...')
      for (let i = 0; i < 50; i++) {
        await new Promise(resolve => setTimeout(resolve, 100))
        firestoreModule = window.__firebaseFirestore
        db = window.__firestoreDb
        if (firestoreModule && db) break
      }
    }
    
    if (!firestoreModule || !db) {
      throw new Error('Firebaseインスタンスが見つかりません。ページをリロードしてから再度実行してください。')
    }
    
    const { doc, getDoc, updateDoc, serverTimestamp } = firestoreModule
    
    // 更新するテンプレートIDのリスト
    const templateIds = ['crm', 'google-calendar-group', 'daily-report', 'auto-integration']
    
    console.log(`\n${templateIds.length}個のテンプレートを更新します...\n`)
    
    for (const templateId of templateIds) {
      try {
        const templateRef = doc(db, 'templates', templateId)
        const templateSnap = await getDoc(templateRef)
        
        if (templateSnap.exists()) {
          const templateData = templateSnap.data()
          
          // 既にisPublicがtrueの場合はスキップ
          if (templateData.isPublic === true) {
            console.log(`✓ ${templateId}: 既に公開テンプレートです（スキップ）`)
            continue
          }
          
          // isPublicをtrueに更新
          await updateDoc(templateRef, {
            isPublic: true,
            updatedAt: serverTimestamp()
          })
          
          console.log(`✓ ${templateId}: 公開テンプレートに更新しました`)
        } else {
          console.log(`⚠ ${templateId}: テンプレートが見つかりません（作成が必要です）`)
        }
      } catch (error) {
        console.error(`❌ ${templateId}: 更新エラー`, error)
      }
    }
    
    console.log('\n✅ すべてのテンプレートの更新が完了しました！')
    console.log('ページをリロードして、変更を確認してください。')
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
  window.updateTemplatesToPublic = updateTemplatesToPublic
  console.log('updateTemplatesToPublic() 関数が利用可能です。')
  console.log('実行するには: updateTemplatesToPublic()')
}

// 即座に実行
updateTemplatesToPublic().catch(error => {
  console.error('スクリプト実行エラー:', error)
})

