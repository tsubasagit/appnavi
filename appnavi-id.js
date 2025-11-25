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

    // AppNaviIDを保存
    setAppNaviID(id) {
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

    // AppNaviIDが設定されているか確認
    hasAppNaviID() {
        const id = this.getAppNaviID();
        return id !== null && this.isValidAppNaviID(id);
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

