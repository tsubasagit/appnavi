// Google Sheets API連携機能
// 注意: 実際のプロジェクトでは、OAuth 2.0認証を適切に実装してください

class GoogleSheetsService {
    constructor() {
        this.apiKey = null; // Google Sheets API Key（環境変数から取得）
        this.accessToken = null; // OAuth 2.0アクセストークン
        this.isAuthenticated = false;
    }

    // Google認証を初期化（OAuth 2.0）
    async initAuth() {
        // 注意: 実際の実装では、Google API Client Libraryを使用
        // ここでは簡易的な実装例を示します
        
        try {
            // gapiが読み込まれているか確認
            if (typeof gapi !== 'undefined' && gapi.auth2) {
                await gapi.load('client:auth2', () => {
                    gapi.auth2.init({
                        client_id: 'YOUR_CLIENT_ID' // Google Cloud Consoleから取得
                    });
                });
                this.isAuthenticated = true;
                return true;
            }
            
            // gapiが利用できない場合は、手動認証用のURLを返す
            console.warn('Google API Client Library not loaded');
            return false;
        } catch (error) {
            console.error('Error initializing Google Auth:', error);
            return false;
        }
    }

    // Google認証を実行
    async signIn() {
        try {
            if (typeof gapi !== 'undefined' && gapi.auth2) {
                const authInstance = gapi.auth2.getAuthInstance();
                const user = await authInstance.signIn();
                this.accessToken = user.getAuthResponse().access_token;
                this.isAuthenticated = true;
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error signing in:', error);
            throw error;
        }
    }

    // Google認証を解除
    async signOut() {
        try {
            if (typeof gapi !== 'undefined' && gapi.auth2) {
                const authInstance = gapi.auth2.getAuthInstance();
                await authInstance.signOut();
                this.accessToken = null;
                this.isAuthenticated = false;
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    }

    // スプレッドシートIDをURLから抽出
    extractSpreadsheetId(url) {
        try {
            // URL形式: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
            const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
            if (match && match[1]) {
                return match[1];
            }
            throw new Error('Invalid Google Sheets URL');
        } catch (error) {
            console.error('Error extracting spreadsheet ID:', error);
            throw error;
        }
    }

    // スプレッドシートのデータを取得
    async fetchSpreadsheetData(spreadsheetUrl, sheetName = null) {
        try {
            if (!this.isAuthenticated && !this.apiKey) {
                throw new Error('Google認証が必要です。');
            }

            const spreadsheetId = this.extractSpreadsheetId(spreadsheetUrl);
            let url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/`;
            
            if (sheetName) {
                url += encodeURIComponent(sheetName);
            } else {
                url += 'A:Z'; // デフォルト範囲
            }

            const headers = {};
            if (this.accessToken) {
                headers['Authorization'] = `Bearer ${this.accessToken}`;
            } else if (this.apiKey) {
                url += `?key=${this.apiKey}`;
            }

            const response = await fetch(url, { headers });
            
            if (!response.ok) {
                throw new Error(`Google Sheets API error: ${response.statusText}`);
            }

            const data = await response.json();
            
            // データをパース（最初の行をヘッダーとして使用）
            if (!data.values || data.values.length === 0) {
                return { headers: [], rows: [] };
            }

            const headers = data.values[0];
            const rows = data.values.slice(1).map(row => {
                const rowObj = {};
                headers.forEach((header, index) => {
                    rowObj[header] = row[index] || '';
                });
                return rowObj;
            });

            return { headers, rows };
        } catch (error) {
            console.error('Error fetching spreadsheet data:', error);
            throw error;
        }
    }

    // スプレッドシートにデータを書き込み
    async writeToSpreadsheet(spreadsheetUrl, sheetName, data, range = null) {
        try {
            if (!this.isAuthenticated) {
                throw new Error('Google認証が必要です。');
            }

            const spreadsheetId = this.extractSpreadsheetId(spreadsheetUrl);
            const writeRange = range || `${sheetName}!A1`;
            
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(writeRange)}:append?valueInputOption=RAW`;
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    values: [data] // 配列形式のデータ
                })
            });

            if (!response.ok) {
                throw new Error(`Google Sheets API error: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error writing to spreadsheet:', error);
            throw error;
        }
    }

    // スプレッドシートの構造を分析（列数、行数など）
    async analyzeSpreadsheet(spreadsheetUrl, sheetName = null) {
        try {
            const { headers, rows } = await this.fetchSpreadsheetData(spreadsheetUrl, sheetName);
            
            return {
                rowCount: rows.length,
                columnCount: headers.length,
                headers: headers,
                sampleRows: rows.slice(0, 5), // 最初の5行をサンプルとして返す
                dataTypes: this.detectDataTypes(headers, rows)
            };
        } catch (error) {
            console.error('Error analyzing spreadsheet:', error);
            throw error;
        }
    }

    // データ型を検出
    detectDataTypes(headers, rows) {
        const dataTypes = {};
        
        headers.forEach(header => {
            const columnValues = rows.map(row => row[header]).filter(v => v);
            const uniqueValues = [...new Set(columnValues)];
            
            let detectedType = 'text';
            
            // 日付判定
            const datePattern = /^\d{4}[-\/]\d{1,2}[-\/]\d{1,2}/;
            if (columnValues.some(v => datePattern.test(String(v)))) {
                detectedType = 'date';
            }
            // 数値判定
            else if (columnValues.every(v => !isNaN(Number(v)) && v !== '')) {
                detectedType = 'number';
            }
            // 選択肢判定（ユニーク値が少ない場合）
            else if (uniqueValues.length <= 10 && uniqueValues.length >= 2) {
                detectedType = 'select';
            }

            dataTypes[header] = {
                type: detectedType,
                options: detectedType === 'select' ? uniqueValues : null
            };
        });

        return dataTypes;
    }

    // リアルタイム同期の設定（WebhookやPollingを実装）
    setupRealtimeSync(spreadsheetUrl, callback, interval = 60000) {
        // 注意: 実際の実装では、Google Sheets APIのwebhookやpush notificationを使用
        // ここでは簡易的なポーリング実装
        
        const syncInterval = setInterval(async () => {
            try {
                const { rows } = await this.fetchSpreadsheetData(spreadsheetUrl);
                callback(rows);
            } catch (error) {
                console.error('Error syncing data:', error);
            }
        }, interval);

        return () => clearInterval(syncInterval); // 停止関数を返す
    }
}

// グローバルインスタンス
const googleSheetsService = new GoogleSheetsService();

