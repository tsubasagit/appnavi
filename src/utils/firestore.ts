/**
 * Firestore ユーティリティ
 * Firestoreへのアクセスとデータ操作を提供
 */

import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
  Firestore
} from 'firebase/firestore'
import { app } from './firebase'
import type {
  FirestoreUser,
  Organization,
  App,
  Page,
  DataSource,
  Deployment,
  Plugin,
  PluginVersion,
  Template,
  SystemSettings,
  Feedback,
} from '../types/firestore'
import {
  FIRESTORE_COLLECTIONS,
  getSubCollectionPath
} from '../types/firestore'

// getFirestoreが正しくインポートされているか確認
console.log('[firestore.ts] getFirestore type:', typeof getFirestore)
console.log('[firestore.ts] app type:', typeof app, 'app:', app)

// Firestoreインスタンス
// Firebase v10のモジュラーAPIを使用
// エラーハンドリングを追加して、初期化に失敗してもアプリがクラッシュしないようにする
let dbInstance: ReturnType<typeof getFirestore> | null = null

try {
  if (typeof getFirestore !== 'function') {
    console.error('[firestore.ts] getFirestore is not a function. Current value:', getFirestore)
    throw new Error('getFirestore is not a function. Firebase Firestore module may not be loaded correctly.')
  }
  if (!app) {
    console.error('[firestore.ts] app is not initialized')
    throw new Error('Firebase app is not initialized.')
  }
  console.log('[firestore.ts] Calling getFirestore(app)...')
  dbInstance = getFirestore(app)
  console.log('[firestore.ts] db initialized successfully:', dbInstance)
} catch (error) {
  console.error('[firestore.ts] Firestore初期化エラー:', error)
  // エラーが発生しても、後で再試行できるようにnullのままにする
  // 実際の使用時にエラーハンドリングを行う
}

// dbをエクスポート（初期化に失敗した場合はnullになる可能性がある）
export const db = dbInstance as ReturnType<typeof getFirestore>

// 開発環境でブラウザコンソールからアクセス可能にする
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  try {
    if (dbInstance) {
      (window as any).__firestoreDb = dbInstance
      (window as any).__firebaseApp = app
      // Firebase関数も公開
      ;(async () => {
        try {
          const firestoreModule = await import('firebase/firestore')
          const authModule = await import('firebase/auth')
          ;(window as any).__firebaseFirestore = firestoreModule
          ;(window as any).__firebaseAuth = authModule
        } catch (error) {
          console.warn('Firebase関数の公開エラー:', error)
        }
      })()
    } else {
      console.warn('[firestore.ts] dbInstanceがnullのため、グローバル公開をスキップします')
    }
  } catch (error) {
    console.warn('[firestore.ts] 開発環境でのFirebase公開エラー:', error)
  }
}

// ============================================================================
// ユーザー管理
// ============================================================================

export const createUser = async (uid: string, userData: Omit<FirestoreUser, 'createdAt' | 'updatedAt'>) => {
  const userRef = doc(db, FIRESTORE_COLLECTIONS.USERS, uid)
  await setDoc(userRef, {
    ...userData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export const getUser = async (uid: string): Promise<FirestoreUser | null> => {
  const userRef = doc(db, FIRESTORE_COLLECTIONS.USERS, uid)
  const userSnap = await getDoc(userRef)
  return userSnap.exists() ? (userSnap.data() as FirestoreUser) : null
}

export const updateUser = async (uid: string, updates: Partial<FirestoreUser>) => {
  const userRef = doc(db, FIRESTORE_COLLECTIONS.USERS, uid)
  await updateDoc(userRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  })
}

// ============================================================================
// 組織管理
// ============================================================================

export const getOrganization = async (orgId: string): Promise<Organization | null> => {
  const orgRef = doc(db, FIRESTORE_COLLECTIONS.ORGANIZATIONS, orgId)
  const orgSnap = await getDoc(orgRef)
  return orgSnap.exists() ? (orgSnap.data() as Organization) : null
}

/**
 * ユーザーがメンバーとして参加している組織のIDリストを取得
 * 注意: セキュリティルールにより、クエリが失敗する可能性があるため、エラーハンドリングが必要
 */
export const getUserOrganizations = async (userId: string): Promise<string[]> => {
  try {
    const orgsRef = collection(db, FIRESTORE_COLLECTIONS.ORGANIZATIONS)
    // ownerIdまたはmemberIdsに含まれる組織を取得
    const q = query(
      orgsRef,
      where('memberIds', 'array-contains', userId)
    )
    const querySnapshot = await getDocs(q)
    const orgIds: string[] = []
    
    querySnapshot.docs.forEach(doc => {
      const org = doc.data() as Organization
      // ownerIdまたはmemberIdsに含まれる場合
      if (org.ownerId === userId || org.memberIds.includes(userId)) {
        orgIds.push(doc.id)
      }
    })
    
    return orgIds
  } catch (error) {
    console.error('getUserOrganizations - エラー:', error)
    // エラーが発生した場合は空配列を返す（組織機能はオプション）
    return []
  }
}

// ============================================================================
// アプリケーション管理
// ============================================================================

export const createApp = async (appId: string, appData: Omit<App, 'createdAt' | 'updatedAt'>) => {
  const appRef = doc(db, FIRESTORE_COLLECTIONS.APPS, appId)
  await setDoc(appRef, {
    ...appData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export const getApp = async (appId: string): Promise<App | null> => {
  const appRef = doc(db, FIRESTORE_COLLECTIONS.APPS, appId)
  const appSnap = await getDoc(appRef)
  return appSnap.exists() ? (appSnap.data() as App) : null
}

export const updateApp = async (appId: string, updates: Partial<App>) => {
  const appRef = doc(db, FIRESTORE_COLLECTIONS.APPS, appId)
  await updateDoc(appRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  })
}

export const deleteApp = async (appId: string): Promise<void> => {
  const appRef = doc(db, FIRESTORE_COLLECTIONS.APPS, appId)
  await deleteDoc(appRef)
}

/**
 * ユーザーがアクセス可能なアプリを取得
 * - オーナーのアプリ
 * - 組織メンバーとして参加しているアプリ
 * 
 * 注意: テストユーザー（'test-user-tsubasa'）でログインしている場合、
 * 実際のFirebase認証のUIDも検索対象に含めます。
 */
export const getUserApps = async (userId: string, userEmail?: string): Promise<(App & { id: string })[]> => {
  const appsRef = collection(db, FIRESTORE_COLLECTIONS.APPS)
  
  // テストユーザーの場合、実際のFirebase認証のUIDも取得
  let actualFirebaseUid: string | null = null
  if (userId === 'test-user-tsubasa' && userEmail === 'tsubasa.test@apptalenthub.co.jp') {
    try {
      // Firestoreのusersコレクションから、このメールアドレスのユーザーを検索
      const usersRef = collection(db, FIRESTORE_COLLECTIONS.USERS)
      const userQuery = query(
        usersRef,
        where('email', '==', 'tsubasa.test@apptalenthub.co.jp')
      )
      const userSnapshot = await getDocs(userQuery)
      if (!userSnapshot.empty) {
        // 最初のユーザードキュメントのIDが実際のFirebase UID
        actualFirebaseUid = userSnapshot.docs[0].id
        console.log('テストユーザー: 実際のFirebase UIDを取得:', actualFirebaseUid)
      }
    } catch (error) {
      console.error('テストユーザーのFirebase UID取得エラー（続行）:', error)
      // エラーが発生しても続行
    }
  }
  
  // 1. オーナーのアプリを取得（テストユーザーのIDと実際のFirebase UIDの両方を検索）
  let ownerApps: (App & { id: string })[] = []
  const userIdsToSearch = actualFirebaseUid ? [userId, actualFirebaseUid] : [userId]
  
  for (const searchUserId of userIdsToSearch) {
    try {
      // ownerIdでクエリ
      const ownerQuery = query(
        appsRef,
        where('ownerId', '==', searchUserId)
      )
      const ownerSnapshot = await getDocs(ownerQuery)
      const apps = ownerSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as App & { id: string }))
      ownerApps.push(...apps)
    } catch (error) {
      console.error(`オーナーアプリの取得エラー (userId: ${searchUserId}):`, error)
      // エラーが発生しても続行
    }
  }
  
  // 重複を除去
  ownerApps = ownerApps.reduce((acc, app) => {
    if (!acc.find(a => a.id === app.id)) {
      acc.push(app)
    }
    return acc
  }, [] as (App & { id: string })[])
  
  console.log('ownerIdで取得したアプリ:', ownerApps.length)
  
  // ownerAppsが取得できた場合、メモリ上でソート
  if (ownerApps.length > 0) {
    ownerApps.sort((a, b) => {
      const aTime = a.updatedAt?.toMillis?.() || (a.updatedAt as any)?.seconds * 1000 || 0
      const bTime = b.updatedAt?.toMillis?.() || (b.updatedAt as any)?.seconds * 1000 || 0
      return bTime - aTime
    })
  }
  
  // 2. ユーザーがメンバーとして参加している組織を取得（エラーが発生しても続行）
  let userOrgIds: string[] = []
  try {
    userOrgIds = await getUserOrganizations(userId)
    console.log('ユーザーの組織ID:', userOrgIds.length)
  } catch (error) {
    console.error('組織の取得エラー（続行）:', error)
    // エラーが発生しても、ownerAppsだけを返す
    console.log('getUserApps - ownerAppsのみ返却:', ownerApps.length)
    return ownerApps
  }
  
  // 3. 組織に所属するアプリを取得（組織IDが設定されているアプリのみ）
  const orgApps: (App & { id: string })[] = []
  if (userOrgIds.length > 0) {
    // Firestoreのクエリでは配列の複数条件が難しいため、各組織IDで個別にクエリ
    for (const orgId of userOrgIds) {
      try {
        const orgQuery = query(
          appsRef,
          where('organizationId', '==', orgId)
        )
        const orgSnapshot = await getDocs(orgQuery)
        const apps = orgSnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        } as App & { id: string }))
        orgApps.push(...apps)
      } catch (error) {
        console.error(`組織 ${orgId} のアプリ取得エラー（続行）:`, error)
        // エラーが発生しても続行
      }
    }
  }
  
  // 4. 重複を除去して結合（同じアプリがオーナーと組織の両方に含まれる可能性がある）
  const allApps = [...ownerApps, ...orgApps]
  const uniqueApps = allApps.reduce((acc, app) => {
    if (!acc.find(a => a.id === app.id)) {
      acc.push(app)
    }
    return acc
  }, [] as (App & { id: string })[])
  
  // 5. updatedAtでソート（メモリ上で）
  uniqueApps.sort((a, b) => {
    const aTime = a.updatedAt?.toMillis?.() || (a.updatedAt as any)?.seconds * 1000 || 0
    const bTime = b.updatedAt?.toMillis?.() || (b.updatedAt as any)?.seconds * 1000 || 0
    return bTime - aTime
  })
  
  console.log('getUserApps - 最終結果:', { ownerApps: ownerApps.length, orgApps: orgApps.length, total: uniqueApps.length })
  
  return uniqueApps
}

// ============================================================================
// ページ管理
// ============================================================================

export const createPage = async (appId: string, pageId: string, pageData: Omit<Page, 'createdAt' | 'updatedAt'>) => {
  const pageRef = doc(db, getSubCollectionPath.pages(appId), pageId)
  await setDoc(pageRef, {
    ...pageData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export const getPages = async (appId: string): Promise<(Page & { id: string })[]> => {
  const pagesRef = collection(db, getSubCollectionPath.pages(appId))
  const querySnapshot = await getDocs(pagesRef)
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Page & { id: string }))
}

// ============================================================================
// データソース管理
// ============================================================================

export const createDataSource = async (
  appId: string, 
  sourceId: string, 
  dataSource: Omit<DataSource, 'createdAt' | 'updatedAt'>
) => {
  const sourceRef = doc(db, getSubCollectionPath.dataSources(appId), sourceId)
  await setDoc(sourceRef, {
    ...dataSource,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export const getDataSources = async (appId: string): Promise<(DataSource & { id: string })[]> => {
  const sourcesRef = collection(db, getSubCollectionPath.dataSources(appId))
  const querySnapshot = await getDocs(sourcesRef)
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DataSource & { id: string }))
}

export const deleteDataSource = async (appId: string, sourceId: string): Promise<void> => {
  const sourceRef = doc(db, getSubCollectionPath.dataSources(appId), sourceId)
  await deleteDoc(sourceRef)
}

// ============================================================================
// デプロイメント管理
// ============================================================================

export const createDeployment = async (
  appId: string,
  deployId: string,
  deployment: Omit<Deployment, 'deployedAt'>
) => {
  const deployRef = doc(db, getSubCollectionPath.deployments(appId), deployId)
  await setDoc(deployRef, {
    ...deployment,
    deployedAt: serverTimestamp(),
  })
}

export const getDeployments = async (appId: string): Promise<(Deployment & { id: string })[]> => {
  const deploymentsRef = collection(db, getSubCollectionPath.deployments(appId))
  const q = query(deploymentsRef, orderBy('deployedAt', 'desc'), limit(10))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Deployment & { id: string }))
}

// ============================================================================
// プラグイン管理
// ============================================================================

export const createPlugin = async (pluginId: string, pluginData: Omit<Plugin, 'createdAt' | 'updatedAt'>) => {
  const pluginRef = doc(db, FIRESTORE_COLLECTIONS.PLUGINS, pluginId)
  await setDoc(pluginRef, {
    ...pluginData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export const getPublicPlugins = async (): Promise<(Plugin & { id: string })[]> => {
  const pluginsRef = collection(db, FIRESTORE_COLLECTIONS.PLUGINS)
  const q = query(pluginsRef, where('isPublic', '==', true), orderBy('createdAt', 'desc'))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Plugin & { id: string }))
}

// ============================================================================
// テンプレート管理
// ============================================================================

export const createTemplate = async (templateId: string, templateData: Omit<Template, 'createdAt' | 'updatedAt'>) => {
  const templateRef = doc(db, FIRESTORE_COLLECTIONS.TEMPLATES, templateId)
  await setDoc(templateRef, {
    ...templateData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export const getPublicTemplates = async (): Promise<(Template & { id: string })[]> => {
  const templatesRef = collection(db, FIRESTORE_COLLECTIONS.TEMPLATES)
  const q = query(templatesRef, where('isPublic', '==', true), orderBy('createdAt', 'desc'))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Template & { id: string }))
}

export const getTemplate = async (templateId: string): Promise<(Template & { id: string }) | null> => {
  try {
    const templateRef = doc(db, FIRESTORE_COLLECTIONS.TEMPLATES, templateId)
    const templateDoc = await getDoc(templateRef)
    
    if (templateDoc.exists()) {
      const templateData = { id: templateDoc.id, ...templateDoc.data() } as Template & { id: string }
      console.log(`テンプレート "${templateId}" を取得しました:`, templateData.name)
      return templateData
    } else {
      console.warn(`テンプレート "${templateId}" はFirestoreに存在しません。テンプレートを作成してください。`)
      return null
    }
  } catch (error: any) {
    console.error(`テンプレート "${templateId}" の取得エラー:`, error)
    if (error?.code === 'permission-denied') {
      console.error('Firestoreのセキュリティルールで読み込みが拒否されました。')
    }
    throw error
  }
}

// ============================================================================
// フィードバック管理
// ============================================================================

export const createFeedback = async (feedbackData: Omit<Feedback, 'createdAt'>) => {
  const feedbackRef = doc(collection(db, FIRESTORE_COLLECTIONS.FEEDBACK))
  await setDoc(feedbackRef, {
    ...feedbackData,
    createdAt: serverTimestamp(),
  })
  return feedbackRef.id
}

// ============================================================================
// システム設定
// ============================================================================

export const getSystemSettings = async (): Promise<SystemSettings | null> => {
  const settingsRef = doc(db, FIRESTORE_COLLECTIONS.SYSTEM_SETTINGS, 'global')
  const settingsSnap = await getDoc(settingsRef)
  return settingsSnap.exists() ? (settingsSnap.data() as SystemSettings) : null
}

export const updateSystemSettings = async (updates: Partial<SystemSettings>) => {
  const settingsRef = doc(db, FIRESTORE_COLLECTIONS.SYSTEM_SETTINGS, 'global')
  if (!(await getDoc(settingsRef)).exists()) {
    await setDoc(settingsRef, {
      maintenanceMode: false,
      announcements: [],
      featureFlags: {},
      updatedAt: serverTimestamp(),
    })
  }
  await updateDoc(settingsRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  })
}

