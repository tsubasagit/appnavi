// Firebase接続状態チェック機能

class FirebaseStatusChecker {
    constructor() {
        this.status = {
            sdkLoaded: false,
            configSet: false,
            initialized: false,
            firestoreAvailable: false,
            authAvailable: false,
            connectionTest: null
        };
    }

    // Firebase SDKが読み込まれているか確認
    checkSDKLoaded() {
        this.status.sdkLoaded = typeof firebase !== 'undefined';
        return this.status.sdkLoaded;
    }

    // Firebase設定が有効か確認
    checkConfigSet() {
        if (!firebaseConfig) {
            this.status.configSet = false;
            return false;
        }
        
        const hasValidConfig = 
            firebaseConfig.apiKey && 
            firebaseConfig.apiKey !== 'YOUR_API_KEY' &&
            firebaseConfig.projectId && 
            firebaseConfig.projectId !== 'YOUR_PROJECT_ID' &&
            firebaseConfig.authDomain &&
            firebaseConfig.authDomain !== 'YOUR_PROJECT_ID.firebaseapp.com';
        
        this.status.configSet = hasValidConfig;
        return hasValidConfig;
    }

    // Firebase初期化状態を確認
    checkInitialized() {
        this.status.initialized = db !== null && auth !== null;
        return this.status.initialized;
    }

    // Firestoreが利用可能か確認
    checkFirestoreAvailable() {
        this.status.firestoreAvailable = db !== null && typeof db !== 'undefined';
        return this.status.firestoreAvailable;
    }

    // Authが利用可能か確認
    checkAuthAvailable() {
        this.status.authAvailable = auth !== null && typeof auth !== 'undefined';
        return this.status.authAvailable;
    }

    // 接続テストを実行
    async testConnection() {
        if (!this.checkSDKLoaded()) {
            this.status.connectionTest = {
                success: false,
                error: 'Firebase SDKが読み込まれていません'
            };
            return this.status.connectionTest;
        }

        if (!this.checkConfigSet()) {
            this.status.connectionTest = {
                success: false,
                error: 'Firebase設定が未設定です。firebase-config.jsを確認してください。'
            };
            return this.status.connectionTest;
        }

        if (!this.checkInitialized()) {
            this.status.connectionTest = {
                success: false,
                error: 'Firebaseが初期化されていません。initFirebase()を実行してください。'
            };
            return this.status.connectionTest;
        }

        try {
            // Firestore接続テスト（簡単な読み取り）
            const testCollection = db.collection('_test');
            await testCollection.limit(1).get();
            
            this.status.connectionTest = {
                success: true,
                message: 'Firebase接続に成功しました'
            };
            return this.status.connectionTest;
        } catch (error) {
            this.status.connectionTest = {
                success: false,
                error: `Firebase接続エラー: ${error.message}`
            };
            return this.status.connectionTest;
        }
    }

    // すべての状態をチェック
    async checkAll() {
        this.checkSDKLoaded();
        this.checkConfigSet();
        this.checkInitialized();
        this.checkFirestoreAvailable();
        this.checkAuthAvailable();
        await this.testConnection();
        return this.status;
    }

    // 状態を人間が読める形式で取得
    getStatusReport() {
        const report = {
            sdk: this.status.sdkLoaded ? '✅ 読み込み済み' : '❌ 未読み込み',
            config: this.status.configSet ? '✅ 設定済み' : '❌ 未設定（プレースホルダーのまま）',
            initialized: this.status.initialized ? '✅ 初期化済み' : '❌ 未初期化',
            firestore: this.status.firestoreAvailable ? '✅ 利用可能' : '❌ 利用不可',
            auth: this.status.authAvailable ? '✅ 利用可能' : '❌ 利用不可',
            connection: this.status.connectionTest 
                ? (this.status.connectionTest.success ? '✅ 接続成功' : `❌ 接続失敗: ${this.status.connectionTest.error}`)
                : '⏳ 未テスト'
        };
        return report;
    }
}

// グローバルインスタンス
const firebaseStatusChecker = new FirebaseStatusChecker();

