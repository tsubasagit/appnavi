// AppNaviID管理システム
// AppNaviIDはユーザー識別のための必須IDです

class AppNaviIDService {
    constructor() {
        this.storageKey = 'appnavi_user_id';
        this.idFormat = /^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}$/;
    }

    // AppNaviIDを生成（UUID v4形式）
    generateAppNaviID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // 保存されているAppNaviIDを取得
    getAppNaviID() {
        return localStorage.getItem(this.storageKey);
    }

    // AppNaviIDを保存（Firebase UID、ゲストIDも受け入れる）
    setAppNaviID(id) {
        if (!id || typeof id !== 'string') {
            throw new Error('AppNaviIDが指定されていません');
        }
        
        // Firebase UIDの場合はそのまま保存（形式チェックをスキップ）
        if (id.length === 28 && /^[a-zA-Z0-9]+$/.test(id)) {
            // Firebase UID形式（28文字の英数字）の場合はそのまま保存
            localStorage.setItem(this.storageKey, id);
            return id;
        }
        
        // ゲストID形式（guest- + UUID）の場合はそのまま保存
        if (id.startsWith('guest-') && id.length > 6) {
            const uuidPart = id.substring(6);
            // UUID形式を簡易チェック（36文字、ハイフンを含む）
            if (uuidPart.length >= 32 && /^[a-f0-9-]+$/i.test(uuidPart)) {
                localStorage.setItem(this.storageKey, id);
                return id;
            }
        }
        
        // 通常のAppNaviID形式の場合は検証
        if (!this.isValidAppNaviID(id)) {
            throw new Error('無効なAppNaviID形式です');
        }
        localStorage.setItem(this.storageKey, id);
        return id;
    }

    // AppNaviIDの形式を検証
    isValidAppNaviID(id) {
        if (!id || typeof id !== 'string') {
            return false;
        }
        return this.idFormat.test(id);
    }

    // AppNaviIDが設定されているか確認（Firebase UID、ゲストIDも有効）
    hasAppNaviID() {
        const id = this.getAppNaviID();
        if (!id) return false;
        
        // Firebase UID形式（28文字の英数字）も有効
        if (id.length === 28 && /^[a-zA-Z0-9]+$/.test(id)) {
            return true;
        }
        
        // ゲストID形式（guest- + UUID）も有効
        if (id.startsWith('guest-') && id.length > 6) {
            const uuidPart = id.substring(6);
            // UUID形式を簡易チェック（32文字以上、英数字とハイフン）
            if (uuidPart.length >= 32 && /^[a-f0-9-]+$/i.test(uuidPart)) {
                return true;
            }
        }
        
        // 通常のAppNaviID形式
        return this.isValidAppNaviID(id);
    }

    // AppNaviIDを削除（ログアウト）
    clearAppNaviID() {
        localStorage.removeItem(this.storageKey);
    }

    // 新しいAppNaviIDを発行して保存
    issueNewAppNaviID() {
        const newID = this.generateAppNaviID();
        this.setAppNaviID(newID);
        return newID;
    }
}

// グローバルインスタンス
const appNaviIDService = new AppNaviIDService();

