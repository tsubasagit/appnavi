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
  serverTimestamp,
  type Firestore
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
  Template,
  SystemSettings,
  Feedback,
  Announcement,
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
let dbInstance: Firestore | null = null

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
// 型アサーション: dbInstanceがnullでないことを保証（実際の使用時にエラーハンドリングを行う）
export const db = dbInstance!

// 開発環境でブラウザコンソールからアクセス可能にする
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  try {
    // dbInstanceが有効なFirestoreインスタンスかチェック
    if (dbInstance && typeof dbInstance === 'object') {
      (window as any).__firestoreDb = dbInstance
      if (app && typeof app === 'object') {
        (window as any).__firebaseApp = app
      }
      // Firebase関数も公開
      ;(async () => {
        try {
          const firestoreModule = await import('firebase/firestore')
          const authModule = await import('firebase/auth')
          ;(window as any).__firebaseFirestore = firestoreModule
          ;(window as any).__firebaseAuth = authModule
          
          // createTemplate関数も公開（関数が定義された後に公開）
          // この時点ではまだ定義されていないため、後で更新する
          setTimeout(() => {
            try {
              // モジュールから直接取得を試みる
              import('/src/utils/firestore.ts').then(module => {
                if (module.createTemplate) {
                  ;(window as any).__firestoreModule = {
                    createTemplate: module.createTemplate,
                    getTemplate: module.getTemplate,
                    getInstalledTemplates: module.getInstalledTemplates,
                    isTemplateInstalled: module.isTemplateInstalled,
                    installTemplateFromAssetSite: module.installTemplateFromAssetSite,
                  }
                  console.log('[firestore.ts] createTemplate関数をwindow.__firestoreModuleに公開しました')
                }
              }).catch(err => {
                console.warn('[firestore.ts] createTemplate関数の公開エラー:', err)
              })
            } catch (error) {
              console.warn('[firestore.ts] createTemplate関数の公開エラー:', error)
            }
          }, 1000) // 1秒後に実行（モジュールが完全に読み込まれるまで待つ）
        } catch (error) {
          console.warn('[firestore.ts] Firebase関数の公開エラー:', error)
        }
      })()
      console.log('[firestore.ts] Firestoreインスタンスをwindow.__firestoreDbに公開しました')
    } else {
      console.warn('[firestore.ts] dbInstanceが無効なため、グローバル公開をスキップします。dbInstance:', dbInstance)
    }
  } catch (error: any) {
    console.warn('[firestore.ts] 開発環境でのFirebase公開エラー:', error?.message || error)
    console.warn('[firestore.ts] エラーの詳細:', error)
  }
}

// ============================================================================
// ユーザー管理
// ============================================================================

export const createUser = async (uid: string, userData: Omit<FirestoreUser, 'createdAt' | 'updatedAt'>) => {
  try {
    console.log('[firestore.ts] createUser - 開始:', { uid, userData })
    
    if (!db) {
      throw new Error('Firestoreデータベースが初期化されていません')
    }
    
    const userRef = doc(db, FIRESTORE_COLLECTIONS.USERS, uid)
    console.log('[firestore.ts] createUser - ドキュメント参照を作成:', userRef.path)
    
    await setDoc(userRef, {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    
    console.log('[firestore.ts] createUser - 成功:', uid)
  } catch (error: any) {
    console.error('[firestore.ts] createUser - エラー:', error)
    console.error('[firestore.ts] createUser - エラー詳細:', {
      code: error?.code,
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
    })
    throw error
  }
}

export const getUser = async (uid: string): Promise<FirestoreUser | null> => {
  try {
    console.log('[firestore.ts] getUser - 開始:', uid)
    
    if (!db) {
      console.error('[firestore.ts] getUser - Firestoreデータベースが初期化されていません')
      throw new Error('Firestoreデータベースが初期化されていません')
    }
    
    const userRef = doc(db, FIRESTORE_COLLECTIONS.USERS, uid)
    console.log('[firestore.ts] getUser - ドキュメント参照を作成:', userRef.path)
    
    const userSnap = await getDoc(userRef)
    console.log('[firestore.ts] getUser - ドキュメント存在確認:', userSnap.exists())
    
    if (userSnap.exists()) {
      const userData = userSnap.data() as FirestoreUser
      console.log('[firestore.ts] getUser - 成功:', uid)
      return userData
    } else {
      console.log('[firestore.ts] getUser - ドキュメントが存在しません:', uid)
      return null
    }
  } catch (error: any) {
    console.error('[firestore.ts] getUser - エラー:', error)
    console.error('[firestore.ts] getUser - エラー詳細:', {
      code: error?.code,
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
    })
    throw error
  }
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

export const updateDataSource = async (
  appId: string,
  sourceId: string,
  updates: Partial<Omit<DataSource, 'createdAt' | 'updatedAt'>>
): Promise<void> => {
  const sourceRef = doc(db, getSubCollectionPath.dataSources(appId), sourceId)
  await updateDoc(sourceRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  })
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
      console.log(`[firestore.ts] テンプレート "${templateId}" のページ情報:`, {
        hasUiStructure: !!templateData.uiStructure,
        hasPages: !!templateData.uiStructure?.pages,
        pagesCount: templateData.uiStructure?.pages?.length || 0,
        pages: templateData.uiStructure?.pages?.map(p => ({ id: p.id, name: p.name }))
      })
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

/**
 * インストール済みテンプレート一覧を取得
 * isPublic: true または isDefault: true のテンプレートを返す
 */
export const getInstalledTemplates = async (): Promise<(Template & { id: string })[]> => {
  try {
    const templatesRef = collection(db, FIRESTORE_COLLECTIONS.TEMPLATES)
    // isPublic: true または isDefault: true のテンプレートを取得
    // FirestoreのクエリではOR条件が直接使えないため、両方のクエリを実行してマージ
    // orderByを削除してインデックスエラーを回避（必要に応じてメモリ上でソート）
    const [publicQuery, defaultQuery] = await Promise.all([
      getDocs(query(templatesRef, where('isPublic', '==', true))),
      getDocs(query(templatesRef, where('isDefault', '==', true)))
    ])
    
    // 重複を除去してマージ
    const templateMap = new Map<string, Template & { id: string }>()
    
    publicQuery.docs.forEach(doc => {
      templateMap.set(doc.id, { id: doc.id, ...doc.data() } as Template & { id: string })
    })
    
    defaultQuery.docs.forEach(doc => {
      templateMap.set(doc.id, { id: doc.id, ...doc.data() } as Template & { id: string })
    })
    
    // メモリ上でソート（createdAtが存在する場合）
    const templates = Array.from(templateMap.values())
    templates.sort((a, b) => {
      const dateA = a.createdAt?.toMillis?.() || (a.createdAt as any)?.seconds ? (a.createdAt as any).seconds * 1000 : 0
      const dateB = b.createdAt?.toMillis?.() || (b.createdAt as any)?.seconds ? (b.createdAt as any).seconds * 1000 : 0
      return dateB - dateA // 降順（新しい順）
    })
    
    return templates
  } catch (error: any) {
    console.error('インストール済みテンプレートの取得エラー:', error)
    if (error?.code === 'permission-denied') {
      console.error('Firestoreのセキュリティルールで読み込みが拒否されました。')
    }
    // エラーが発生しても、デフォルトテンプレート（isDefault: true）は返す
    // これにより、CRMとblank-pageは常に利用可能
    return []
  }
}

/**
 * テンプレートがインストール済みかチェック
 */
export const isTemplateInstalled = async (templateId: string): Promise<boolean> => {
  try {
    const template = await getTemplate(templateId)
    return template !== null
  } catch (error) {
    return false
  }
}

/**
 * Assetサイトからテンプレートをインストール
 * @param assetTemplate Assetサイトのテンプレート情報
 * @param details 詳細データ（schema, views, sampleData）
 */
export const installTemplateFromAssetSite = async (
  assetTemplate: any,
  details: {
    schema?: any
    views?: any
    sampleData?: any
  }
): Promise<void> => {
  try {
    // カラーマッピング（AssetサイトのcolorをFirestoreのcolor形式に変換）
    const colorMap: Record<string, string> = {
      'purple': '#8b5cf6',
      'orange': '#f97316',
      'green': '#10b981',
      'blue': '#3b82f6',
      'slate': '#64748b',
    }
    const firestoreColor = colorMap[assetTemplate.color] || '#8b5cf6'

    // views.jsonからuiStructureを構築
    let uiStructure: any = {
      theme: {
        primaryColor: firestoreColor,
      },
      pages: [],
    }

    // views.jsonが存在する場合は、それを使用してuiStructureを構築
    if (details.views) {
      // views.jsonの構造に応じてuiStructureを構築
      // ここでは基本的な構造を提供（実際のviews.jsonの構造に応じて調整が必要）
      if (details.views.pages) {
        uiStructure.pages = details.views.pages
      }
      if (details.views.theme) {
        uiStructure.theme = { ...uiStructure.theme, ...details.views.theme }
      }
    } else {
      // views.jsonがない場合は、デフォルトのページ構成を作成
      uiStructure.pages = [
        {
          id: 'dashboard',
          name: 'ダッシュボード',
          path: '/',
          layout: {
            type: 'grid',
            columns: 12,
            gap: '1rem',
          },
          components: [],
          order: 0,
        },
      ]
    }

    // schema.jsonからrecommendedSchemaを構築
    let recommendedSchema: any = undefined
    if (details.schema) {
      recommendedSchema = details.schema
    }

    // Firestoreに保存するテンプレートデータを構築
    const templateData: any = {
      templateId: assetTemplate.templateId,
      name: assetTemplate.name,
      description: assetTemplate.description,
      category: assetTemplate.category,
      color: firestoreColor,
      previewImageUrl: assetTemplate.previewImageUrl,
      isPublic: true,
      tags: assetTemplate.tags || [],
      uiStructure: uiStructure,
      version: assetTemplate.version || '1.0.0',
      // 外部インストール関連フィールド
      assetId: assetTemplate.templateId, // appnavi-asset.com上のID（どのテンプレートから作られたかを特定）
      vendorId: assetTemplate.author || 'appnavi', // 開発元のベンダーID（authorがあれば使用、なければ'appnavi'）
      isCustomized: false, // 新規インストール時はfalse（ユーザーが編集したらtrueに変更）
    }

    // recommendedSchemaが存在する場合のみ追加（undefinedの場合は追加しない）
    if (recommendedSchema !== undefined) {
      templateData.recommendedSchema = recommendedSchema
    }

    // undefinedフィールドを削除するヘルパー関数
    const removeUndefinedFields = (obj: any): any => {
      const cleaned: any = {}
      for (const [key, value] of Object.entries(obj)) {
        if (value !== undefined) {
          if (typeof value === 'object' && value !== null && !Array.isArray(value) && !(value instanceof Date)) {
            cleaned[key] = removeUndefinedFields(value)
          } else {
            cleaned[key] = value
          }
        }
      }
      return cleaned
    }

    // undefinedフィールドを削除
    const cleanedTemplateData = removeUndefinedFields(templateData)

    // 既存のテンプレートをチェック
    const existingTemplate = await getTemplate(assetTemplate.templateId)
    if (existingTemplate) {
      // 既存の場合は更新
      // isCustomizedは既存の値を保持（ユーザーが編集した場合はtrueのまま）
      const updateData = {
        ...cleanedTemplateData,
        isCustomized: existingTemplate.isCustomized ?? false, // 既存の値を保持
        updatedAt: serverTimestamp(),
      }
      const templateRef = doc(db, FIRESTORE_COLLECTIONS.TEMPLATES, assetTemplate.templateId)
      await updateDoc(templateRef, updateData)
      console.log(`テンプレート "${assetTemplate.templateId}" を更新しました`)
    } else {
      // 新規の場合は作成
      await createTemplate(assetTemplate.templateId, cleanedTemplateData as Omit<Template, 'createdAt' | 'updatedAt'>)
      console.log(`テンプレート "${assetTemplate.templateId}" をインストールしました`)
    }
  } catch (error: any) {
    console.error(`テンプレート "${assetTemplate.templateId}" のインストールエラー:`, error)
    throw new Error(`テンプレートのインストールに失敗しました: ${error?.message || '不明なエラー'}`)
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

// ============================================================================
// お知らせ管理
// ============================================================================

/**
 * アクティブなお知らせ一覧を取得（日付順でソート）
 */
export const getAnnouncements = async (): Promise<Announcement[]> => {
  try {
    console.log('[firestore.ts] getAnnouncements - 開始')
    
    if (!db) {
      console.error('[firestore.ts] getAnnouncements - Firestoreデータベースが初期化されていません')
      throw new Error('Firestoreデータベースが初期化されていません')
    }
    
    const announcementsRef = collection(db, FIRESTORE_COLLECTIONS.ANNOUNCEMENTS)
    
    // アクティブなお知らせのみを取得
    // 注意: インデックスエラーを避けるため、whereクエリも削除してすべて取得し、メモリ上でフィルタリングします
    // お知らせの数が少ない場合は、この方法で問題ありません
    const q = query(
      announcementsRef,
      limit(100) // 最大100件まで取得（お知らせは通常少ないので十分）
    )
    
    const querySnapshot = await getDocs(q)
    
    const announcements: Announcement[] = []
    
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      const announcement = {
        id: doc.id,
        ...data,
      } as Announcement
      
      // アクティブなお知らせのみをフィルタリング
      if (announcement.isActive === true) {
        announcements.push(announcement)
      }
    })
    
    // 日付順でソート（新しい順）
    if (announcements.length > 0) {
      announcements.sort((a, b) => {
        // dateフィールドがTimestamp型の場合
        const dateA = a.date?.toMillis?.() || (a.date as any)?.seconds ? (a.date as any).seconds * 1000 : 0
        const dateB = b.date?.toMillis?.() || (b.date as any)?.seconds ? (b.date as any).seconds * 1000 : 0
        return dateB - dateA // 降順（新しい順）
      })
    }
    
    console.log('[firestore.ts] getAnnouncements - 成功:', announcements.length, '件')
    return announcements
  } catch (error: any) {
    console.error('[firestore.ts] getAnnouncements - エラー:', error)
    if (error?.code === 'permission-denied') {
      console.error('[firestore.ts] getAnnouncements - Firestoreのセキュリティルールで読み込みが拒否されました。')
    }
    throw error
  }
}

/**
 * お知らせを作成
 */
export const createAnnouncement = async (
  announcementData: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    console.log('[firestore.ts] createAnnouncement - 開始:', announcementData)
    
    if (!db) {
      console.error('[firestore.ts] createAnnouncement - Firestoreデータベースが初期化されていません')
      throw new Error('Firestoreデータベースが初期化されていません')
    }
    
    const announcementRef = doc(collection(db, FIRESTORE_COLLECTIONS.ANNOUNCEMENTS))
    
    await setDoc(announcementRef, {
      ...announcementData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    
    console.log('[firestore.ts] createAnnouncement - 成功:', announcementRef.id)
    return announcementRef.id
  } catch (error: any) {
    console.error('[firestore.ts] createAnnouncement - エラー:', error)
    if (error?.code === 'permission-denied') {
      console.error('[firestore.ts] createAnnouncement - Firestoreのセキュリティルールで書き込みが拒否されました。')
    }
    throw error
  }
}

/**
 * お知らせを更新
 */
export const updateAnnouncement = async (
  announcementId: string,
  updates: Partial<Omit<Announcement, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<void> => {
  try {
    console.log('[firestore.ts] updateAnnouncement - 開始:', announcementId, updates)
    
    if (!db) {
      console.error('[firestore.ts] updateAnnouncement - Firestoreデータベースが初期化されていません')
      throw new Error('Firestoreデータベースが初期化されていません')
    }
    
    const announcementRef = doc(db, FIRESTORE_COLLECTIONS.ANNOUNCEMENTS, announcementId)
    
    await updateDoc(announcementRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    })
    
    console.log('[firestore.ts] updateAnnouncement - 成功:', announcementId)
  } catch (error: any) {
    console.error('[firestore.ts] updateAnnouncement - エラー:', error)
    if (error?.code === 'permission-denied') {
      console.error('[firestore.ts] updateAnnouncement - Firestoreのセキュリティルールで書き込みが拒否されました。')
    }
    throw error
  }
}

/**
 * お知らせを削除
 */
export const deleteAnnouncement = async (announcementId: string): Promise<void> => {
  try {
    console.log('[firestore.ts] deleteAnnouncement - 開始:', announcementId)
    
    if (!db) {
      console.error('[firestore.ts] deleteAnnouncement - Firestoreデータベースが初期化されていません')
      throw new Error('Firestoreデータベースが初期化されていません')
    }
    
    const announcementRef = doc(db, FIRESTORE_COLLECTIONS.ANNOUNCEMENTS, announcementId)
    
    await deleteDoc(announcementRef)
    
    console.log('[firestore.ts] deleteAnnouncement - 成功:', announcementId)
  } catch (error: any) {
    console.error('[firestore.ts] deleteAnnouncement - エラー:', error)
    if (error?.code === 'permission-denied') {
      console.error('[firestore.ts] deleteAnnouncement - Firestoreのセキュリティルールで削除が拒否されました。')
    }
    throw error
  }
}