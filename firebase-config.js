// Firebase設定ファイル
// 注意: 実際のプロジェクトでは、これらの値を環境変数または別の設定ファイルで管理してください

// Firebase設定
const firebaseConfig = {
    apiKey: "AIzaSyAO03XP5TKpt5E8zgnzW2p3VdsQ1eLU1-Y",
    authDomain: "appnavi-add7e.firebaseapp.com",
    projectId: "appnavi-add7e",
    storageBucket: "appnavi-add7e.firebasestorage.app",
    messagingSenderId: "917670325982",
    appId: "1:917670325982:web:8aa33731e865529c6a5c4f",
    measurementId: "G-BFP5JSG5RD" // Analytics用（オプション）
};

// Firebaseの初期化（Firebase SDKが読み込まれている場合）
let db = null;
let auth = null;

// Firebase初期化関数
async function initFirebase() {
    try {
        // Firebase SDKが読み込まれているか確認
        if (typeof firebase !== 'undefined') {
            // Firebase設定が有効かチェック（プレースホルダーでないか）
            if (firebaseConfig.apiKey && 
                firebaseConfig.apiKey !== 'YOUR_API_KEY' && 
                firebaseConfig.projectId && 
                firebaseConfig.projectId !== 'YOUR_PROJECT_ID') {
                try {
                    firebase.initializeApp(firebaseConfig);
                    db = firebase.firestore();
                    auth = firebase.auth();
                    console.log('Firebase initialized successfully');
                    return true;
                } catch (initError) {
                    console.warn('Firebase initialization failed, using localStorage fallback:', initError);
                    return false;
                }
            } else {
                console.warn('Firebase config not set. Using localStorage fallback.');
                return false;
            }
        } else {
            console.warn('Firebase SDK not loaded. Using localStorage fallback.');
            return false;
        }
    } catch (error) {
        console.error('Firebase initialization error:', error);
        return false;
    }
}

// Firestoreが利用可能かチェック
function isFirebaseAvailable() {
    return db !== null && typeof db !== 'undefined';
}

// データベース操作クラス（Firebase/Firestore + localStorage fallback）
class DatabaseService {
    constructor() {
        this.useFirebase = false;
        this.storageType = null; // 'local' or 'firebase' - 一度設定したら変更不可
        this.init();
    }

    // 保存方法を取得（一度設定したら変更不可）
    getStorageType() {
        if (this.storageType) {
            return this.storageType;
        }
        // localStorageから保存方法を取得
        const savedStorageType = localStorage.getItem('appnavi_storage_type');
        if (savedStorageType === 'firebase' || savedStorageType === 'local') {
            this.storageType = savedStorageType;
            return this.storageType;
        }
        // デフォルトはlocal
        return 'local';
    }

    // 保存方法を設定（初回のみ可能）
    setStorageType(type) {
        const currentType = this.getStorageType();
        if (currentType && currentType !== 'local' && currentType !== type) {
            // 既に設定されている場合は変更不可
            throw new Error(`データ保存方法は既に「${currentType === 'firebase' ? 'Firebase' : 'ローカル'}」に設定されています。変更することはできません。`);
        }
        if (type === 'firebase' || type === 'local') {
            this.storageType = type;
            localStorage.setItem('appnavi_storage_type', type);
            return true;
        }
        return false;
    }

    async init() {
        // 既に初期化中の場合は待つ
        if (this._initPromise) {
            return this._initPromise;
        }

        this._initPromise = (async () => {
            try {
                // 保存方法を取得
                const storageType = this.getStorageType();
                
                // Firebaseが設定されている場合のみFirebaseを使用
                if (storageType === 'firebase') {
                    this.useFirebase = await initFirebase();
                    if (this.useFirebase) {
                        console.log('Using Firebase Firestore');
                    } else {
                        console.log('Firebase設定が不完全です。localStorageを使用します。');
                        this.useFirebase = false;
                        // Firebaseが使えない場合はlocalにフォールバック
                        this.setStorageType('local');
                    }
                } else {
                    // ローカルストレージを使用
                    this.useFirebase = false;
                    console.log('Using localStorage');
                }
                return this.useFirebase;
            } catch (error) {
                console.error('Error initializing database service:', error);
                this.useFirebase = false;
                console.log('Using localStorage fallback (error fallback)');
                return false;
            }
        })();

        return this._initPromise;
    }

    // アプリコレクションの参照を取得
    appsCollection() {
        if (this.useFirebase && db) {
            return db.collection('apps');
        }
        return null;
    }

    // アプリリストを取得（現在のユーザーのアプリのみ）
    async getApps() {
        const userId = await this.getCurrentUserId();
        
        if (this.useFirebase && db) {
            try {
                // ユーザーIDでフィルタリング
                const snapshot = await db.collection('apps')
                    .where('userId', '==', userId)
                    .orderBy('createdAt', 'desc')
                    .get();
                return snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
            } catch (error) {
                console.error('Error getting apps from Firestore:', error);
                // fallback to localStorage
                return this.getAppsFromLocalStorage();
            }
        }
        return this.getAppsFromLocalStorage();
    }

    // localStorageからアプリリストを取得（現在のユーザーのアプリのみ）
    async getAppsFromLocalStorage() {
        const userId = await this.getCurrentUserId();
        const savedApps = localStorage.getItem('apps');
        if (savedApps) {
            const allApps = JSON.parse(savedApps);
            // ユーザーIDでフィルタリング
            return allApps.filter(app => app.userId === userId);
        }
        return [];
    }

    // アプリを追加
    async addApp(appData) {
        try {
            // storageTypeが指定されていない場合は、現在の設定に基づいて決定
            const storageType = appData.storageType || (this.useFirebase ? 'firebase' : 'local');
            
            // storageTypeに基づいて保存先を決定
            if (storageType === 'firebase') {
                // Firebaseに保存する場合
                if (!this.useFirebase && !this._initPromise) {
                    await this.init();
                } else if (this._initPromise) {
                    await this._initPromise;
                }
                
                if (!db || typeof firebase === 'undefined') {
                    throw new Error('Firebaseが設定されていません。設定画面でFirebaseを設定してください。');
                }
            } else {
                // localStorageに保存する場合（初期化は不要）
            }

            const timestamp = new Date().toISOString();
            const userId = await this.getCurrentUserId();

            const newApp = {
                name: appData.name || '新しいアプリ',
                description: appData.description || 'Excelから作成されたアプリです。',
                icon: appData.icon || 'document',
                color: appData.color || 'blue',
                createdAt: timestamp,
                updatedAt: timestamp,
                columns: appData.columns || [],
                data: appData.data || [],
                userId: userId,
                storageType: storageType, // 保存方法を記録（変更不可）
                // Googleスプレッドシート連携情報
                googleSheetsUrl: appData.googleSheetsUrl || null,
                googleAccessToken: appData.googleAccessToken || null,
                googleSheetsLastSynced: appData.googleSheetsLastSynced || null,
                googleAppsScriptUrl: appData.googleAppsScriptUrl || null
            };

            // storageTypeに基づいて保存先を決定
            if (storageType === 'firebase' && db && typeof firebase !== 'undefined') {
                try {
                    const firestoreApp = {
                        ...newApp,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    };
                    const docRef = await db.collection('apps').add(firestoreApp);
                    return { id: docRef.id, ...newApp };
                } catch (error) {
                    console.error('Error adding app to Firestore:', error);
                    throw new Error('Firebaseへの保存に失敗しました。Firebase設定を確認してください。');
                }
            }
            
            // localStorageに追加（storageType === 'local'の場合）
            return this.addAppToLocalStorage(newApp);
        } catch (error) {
            console.error('Error in addApp:', error);
            // エラー時はlocalStorageにフォールバック（storageTypeがlocalの場合のみ）
            if (appData.storageType === 'local' || !appData.storageType) {
                const timestamp = new Date().toISOString();
                const fallbackUserId = await this.getCurrentUserId();
                const newApp = {
                    id: 'app-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
                    name: appData.name || '新しいアプリ',
                    description: appData.description || 'Excelから作成されたアプリです。',
                    icon: appData.icon || 'document',
                    color: appData.color || 'blue',
                    createdAt: timestamp,
                    updatedAt: timestamp,
                    columns: appData.columns || [],
                    data: appData.data || [],
                    userId: fallbackUserId,
                    storageType: 'local',
                    // Googleスプレッドシート連携情報
                    googleSheetsUrl: appData.googleSheetsUrl || null,
                    googleAccessToken: appData.googleAccessToken || null,
                    googleSheetsLastSynced: appData.googleSheetsLastSynced || null,
                    googleAppsScriptUrl: appData.googleAppsScriptUrl || null
                };
                return this.addAppToLocalStorage(newApp);
            }
            throw error; // Firebaseの場合はエラーを再スロー
        }
    }

    // localStorageにアプリを追加
    async addAppToLocalStorage(appData) {
        const userId = await this.getCurrentUserId();
        const newApp = {
            id: 'app-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
            ...appData,
            userId: userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        const allApps = JSON.parse(localStorage.getItem('apps') || '[]');
        allApps.push(newApp);
        localStorage.setItem('apps', JSON.stringify(allApps));
        return newApp;
    }

    // アプリを更新
    async updateApp(appId, updates) {
        // storageTypeの変更を防ぐ
        if (updates.storageType) {
            delete updates.storageType;
            console.warn('storageTypeは変更できません。変更は無視されました。');
        }
        
        // アプリの現在のstorageTypeを取得
        const app = await this.getApp(appId);
        if (!app) {
            throw new Error('アプリが見つかりません');
        }
        
        const storageType = app.storageType || 'local';
        const updateData = {
            ...updates,
            updatedAt: storageType === 'firebase' ? firebase.firestore.FieldValue.serverTimestamp() : new Date().toISOString()
        };

        // storageTypeに基づいて適切な保存先を更新
        if (storageType === 'firebase' && db && typeof firebase !== 'undefined') {
            try {
                await db.collection('apps').doc(appId).update(updateData);
                const doc = await db.collection('apps').doc(appId).get();
                return { id: doc.id, ...doc.data() };
            } catch (error) {
                console.error('Error updating app in Firestore:', error);
                throw new Error('Firebaseの更新に失敗しました。Firebase設定を確認してください。');
            }
        }
        return this.updateAppInLocalStorage(appId, updateData);
    }

    // localStorageでアプリを更新
    updateAppInLocalStorage(appId, updates) {
        const apps = this.getAppsFromLocalStorage();
        const appIndex = apps.findIndex(app => app.id === appId);
        if (appIndex !== -1) {
            apps[appIndex] = {
                ...apps[appIndex],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            localStorage.setItem('apps', JSON.stringify(apps));
            return apps[appIndex];
        }
        return null;
    }

    // アプリを取得（現在のユーザーのアプリのみ）
    async getApp(appId) {
        const userId = await this.getCurrentUserId();
        
        // まずFirebaseから検索
        if (this.useFirebase && db) {
            try {
                const doc = await db.collection('apps').doc(appId).get();
                if (doc.exists) {
                    const app = { id: doc.id, ...doc.data() };
                    // ユーザーIDをチェック
                    if (app.userId === userId) {
                        return app;
                    }
                    return null; // 他のユーザーのアプリは返さない
                }
            } catch (error) {
                console.error('Error getting app from Firestore:', error);
            }
        }
        // localStorageから検索
        const apps = await this.getAppsFromLocalStorage();
        return apps.find(app => app.id === appId) || null;
    }

    // アプリを削除（現在のユーザーのアプリのみ）
    async deleteApp(appId) {
        // アプリの現在のstorageTypeを取得
        const app = await this.getApp(appId);
        if (!app) {
            throw new Error('アプリが見つかりません');
        }
        
        const storageType = app.storageType || 'local';
        
        // storageTypeに基づいて適切な保存先から削除
        if (storageType === 'firebase' && db && typeof firebase !== 'undefined') {
            try {
                await db.collection('apps').doc(appId).delete();
                return true;
            } catch (error) {
                console.error('Error deleting app from Firestore:', error);
                throw new Error('Firebaseからの削除に失敗しました。Firebase設定を確認してください。');
            }
        }
        return this.deleteAppFromLocalStorage(appId);
    }

    // localStorageからアプリを削除
    async deleteAppFromLocalStorage(appId) {
        const userId = await this.getCurrentUserId();
        const allApps = JSON.parse(localStorage.getItem('apps') || '[]');
        // 現在のユーザーのアプリのみを保持
        const filteredApps = allApps.filter(app => !(app.id === appId && app.userId === userId));
        localStorage.setItem('apps', JSON.stringify(filteredApps));
        return true;
    }

    // すべてのアプリを削除（現在のユーザーのアプリのみ）
    async deleteAllApps() {
        try {
            const userId = await this.getCurrentUserId();
            const allApps = await this.getApps();
            
            // Firebaseに保存されているアプリを削除
            const firebaseApps = allApps.filter(app => app.storageType === 'firebase');
            if (firebaseApps.length > 0 && db && typeof firebase !== 'undefined') {
                const batch = db.batch();
                firebaseApps.forEach(app => {
                    const appRef = db.collection('apps').doc(app.id);
                    batch.delete(appRef);
                });
                await batch.commit();
            }
            
            // localStorageから現在のユーザーのアプリのみを削除
            const allLocalApps = JSON.parse(localStorage.getItem('apps') || '[]');
            const filteredApps = allLocalApps.filter(app => app.userId !== userId);
            localStorage.setItem('apps', JSON.stringify(filteredApps));
            
            // 最近開いたアプリもクリア
            localStorage.removeItem('appnavi_recent_apps');
            
            return true;
        } catch (error) {
            console.error('Error deleting all apps:', error);
            throw error;
        }
    }

    // アプリデータを取得
    async getApp(appId) {
        if (this.useFirebase && db) {
            try {
                const doc = await db.collection('apps').doc(appId).get();
                if (doc.exists) {
                    return { id: doc.id, ...doc.data() };
                }
                return null;
            } catch (error) {
                console.error('Error getting app from Firestore:', error);
                // fallback to localStorage
                return this.getAppFromLocalStorage(appId);
            }
        }
        return this.getAppFromLocalStorage(appId);
    }

    // localStorageからアプリを取得（現在のユーザーのアプリのみ）
    async getAppFromLocalStorage(appId) {
        const apps = await this.getAppsFromLocalStorage();
        return apps.find(app => app.id === appId) || null;
    }

    // 現在のユーザーIDを取得（AppNaviID必須）
    async getCurrentUserId() {
        // AppNaviIDサービスが読み込まれているか確認
        if (typeof appNaviIDService === 'undefined') {
            throw new Error('AppNaviIDサービスが読み込まれていません。appnavi-id.jsを読み込んでください。');
        }

        // AppNaviIDを取得
        const appNaviID = appNaviIDService.getAppNaviID();
        
        if (!appNaviID || !appNaviIDService.isValidAppNaviID(appNaviID)) {
            throw new Error('AppNaviIDが設定されていません。AppNaviIDを登録してください。');
        }

        return appNaviID;
    }
    
    // 認証状態をチェック（AppNaviID必須）
    async checkAuth() {
        // AppNaviIDサービスが読み込まれているか確認
        if (typeof appNaviIDService === 'undefined') {
            throw new Error('AppNaviIDサービスが読み込まれていません。appnavi-id.jsを読み込んでください。');
        }

        // AppNaviIDが設定されているか確認
        if (!appNaviIDService.hasAppNaviID()) {
            throw new Error('AppNaviIDが設定されていません。AppNaviIDを登録してください。');
        }

        return true;
    }

    // リアルタイムリスナー（Firebaseのみ、現在のユーザーのアプリのみ）
    async onAppsChange(callback) {
        const userId = await this.getCurrentUserId();
        
        if (this.useFirebase && db) {
            return db.collection('apps')
                .where('userId', '==', userId)
                .orderBy('createdAt', 'desc')
                .onSnapshot(snapshot => {
                    const apps = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    callback(apps);
                }, error => {
                    console.error('Error listening to apps:', error);
                });
        }
        // localStorage fallbackでは、手動でリフレッシュが必要
        return null;
    }
}

// グローバルインスタンス
const databaseService = new DatabaseService();

