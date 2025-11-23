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
        try {
            // Google Identity Services (新しい方式) を使用
            if (typeof google !== 'undefined' && google.accounts) {
                // Google Identity Servicesが利用可能
                return true;
            }
            
            // フォールバック: 公開スプレッドシートの場合はAPIキーでアクセス可能
            // ただし、認証が必要な場合はエラーを返す
            console.warn('Google Identity Services not loaded. Using public spreadsheet access.');
            return false;
        } catch (error) {
            console.error('Error initializing Google Auth:', error);
            return false;
        }
    }

    // Google認証を実行（公開スプレッドシート用：認証不要）
    async signIn() {
        try {
            // 公開スプレッドシートの場合は認証不要
            // スプレッドシートを「リンクを知っている全員」に共有すれば、認証なしでアクセス可能
            // 認証が必要なスプレッドシートの場合は、fetchSpreadsheetDataでエラーが発生し、
            // ユーザーに共有設定を変更してもらうメッセージが表示される
            this.isAuthenticated = true;
            return true;
        } catch (error) {
            console.error('Error signing in:', error);
            throw new Error('スプレッドシートの共有設定を確認してください。「リンクを知っている全員」に共有されている必要があります。');
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

    // スプレッドシートのデータを取得（公開スプレッドシート用）
    async fetchSpreadsheetData(spreadsheetUrl, sheetName = null) {
        try {
            const spreadsheetId = this.extractSpreadsheetId(spreadsheetUrl);
            
            // CSV形式でエクスポート（公開スプレッドシートの場合）
            // スプレッドシートIDからCSVエクスポートURLを生成
            // 注意: gidパラメータなしで最初のシートを取得
            let exportUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv`;
            if (sheetName) {
                exportUrl += `&gid=${sheetName}`;
            }
            // gidパラメータなしの場合、最初のシートが自動的にエクスポートされる

            // CORS対応: まず直接アクセスを試行
            let response;
            try {
                response = await fetch(exportUrl, {
                    method: 'GET',
                    mode: 'cors',
                    credentials: 'omit',
                    headers: {
                        'Accept': 'text/csv'
                    }
                });
            } catch (corsError) {
                console.warn('直接アクセスがCORSでブロックされました。', corsError);
                // CORSエラーの場合、別の方法を試行
                // 注意: ローカルサーバー（http://localhost）を使用している場合、CORSエラーは発生しません
                // file://プロトコルを使用している場合は、ローカルサーバーを起動してください
                throw new Error('CORSエラーが発生しました。ローカルサーバー（http://localhost:8000）を使用してアクセスしてください。\n\n【解決方法】\n1. ターミナルで「python -m http.server 8000」を実行\n2. ブラウザで「http://localhost:8000」を開く\n3. もう一度「連携を開始する」をクリック');
            }
            
            if (!response.ok) {
                if (response.status === 400) {
                    throw new Error('スプレッドシートURLが正しくありません。完全なURLをコピー&ペーストしてください。\n\n【確認してください】\n・URLが完全か（https://docs.google.com/spreadsheets/d/...で始まる）\n・スプレッドシートが存在するか\n・スプレッドシートが削除されていないか');
                } else if (response.status === 403) {
                    throw new Error('スプレッドシートへのアクセスが拒否されました。スプレッドシートの共有設定を「リンクを知っている全員」に変更してください。');
                } else if (response.status === 404) {
                    throw new Error('スプレッドシートが見つかりませんでした。URLが正しいか確認してください。');
                }
                throw new Error(`スプレッドシートの読み込みに失敗しました（エラーコード: ${response.status}）。スプレッドシートが公開されているか確認してください。`);
            }

            const csvText = await response.text();
            
            // CSVをパース
            if (!csvText || csvText.trim().length === 0) {
                throw new Error('スプレッドシートにデータが含まれていません。1行目に見出し、2行目以降にデータがあるか確認してください。');
            }

            // BOMを削除（UTF-8 BOM対応）
            const cleanCsvText = csvText.replace(/^\uFEFF/, '');
            
            // CSVパース（引用符で囲まれたカンマを含むセルに対応）
            const parseCSVLine = (line) => {
                const result = [];
                let current = '';
                let inQuotes = false;
                
                for (let i = 0; i < line.length; i++) {
                    const char = line[i];
                    if (char === '"') {
                        if (inQuotes && line[i + 1] === '"') {
                            // エスケープされた引用符
                            current += '"';
                            i++; // 次の文字をスキップ
                        } else {
                            inQuotes = !inQuotes;
                        }
                    } else if (char === ',' && !inQuotes) {
                        result.push(current.trim().replace(/^"|"$/g, ''));
                        current = '';
                    } else {
                        current += char;
                    }
                }
                result.push(current.trim().replace(/^"|"$/g, ''));
                return result;
            };

            // 行を分割（CRLF、LF、CRのいずれにも対応）
            const lines = cleanCsvText.split(/\r?\n|\r/).filter(line => line.trim().length > 0);
            
            console.log('CSVパース前:', {
                totalLines: lines.length,
                firstLine: lines[0],
                secondLine: lines[1],
                csvTextLength: csvText.length
            });
            
            if (lines.length === 0) {
                throw new Error('スプレッドシートにデータが含まれていません。');
            }

            const headers = parseCSVLine(lines[0]);
            console.log('パースされたヘッダー:', headers);
            
            const rows = lines.slice(1).map((line, lineIndex) => {
                const values = parseCSVLine(line);
                const rowObj = {};
                headers.forEach((header, index) => {
                    rowObj[header] = values[index] || '';
                });
                
                // デバッグ: 最初の数行をログ出力
                if (lineIndex < 3) {
                    console.log(`行 ${lineIndex + 1}:`, {
                        rawLine: line,
                        parsedValues: values,
                        rowObj: rowObj
                    });
                }
                
                return rowObj;
            }).filter(row => {
                // 空行を除外（すべての値が空でない行を保持）
                const hasData = Object.values(row).some(v => v && String(v).trim().length > 0);
                if (!hasData) {
                    console.log('空行を除外:', row);
                }
                return hasData;
            });
            
            console.log('パース後のデータ:', {
                headerCount: headers.length,
                rowCount: rows.length,
                sampleRows: rows.slice(0, 3)
            });

            if (rows.length === 0) {
                throw new Error('スプレッドシートにデータ行がありません。2行目以降にデータがあるか確認してください。');
            }

            return { headers, rows };
        } catch (error) {
            console.error('Error fetching spreadsheet data:', error);
            // エラーメッセージを改善
            if (error.message) {
                throw error;
            }
            throw new Error('スプレッドシートの読み込みに失敗しました。スプレッドシートの共有設定を確認してください。');
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

    // データ型を検出（訪問管理記録に最適化）
    detectDataTypes(headers, rows) {
        const dataTypes = {};
        
        // 訪問管理記録でよく使われる列名のパターン
        const dateColumnPatterns = ['日時', '日付', '訪問日', '訪問日時', 'date', 'datetime', '訪問日付', '実施日'];
        const selectColumnPatterns = ['担当者', '訪問目的', '結果', 'ステータス', '状態', '目的', 'status', 'result', '目的', '成約', '商談', '訪問結果'];
        const numberColumnPatterns = ['金額', '売上', '価格', '数量', '回数', 'amount', 'price', 'quantity', 'count'];
        
        headers.forEach(header => {
            const columnValues = rows.map(row => row[header]).filter(v => v && String(v).trim().length > 0);
            const uniqueValues = [...new Set(columnValues)];
            const headerLower = header.toLowerCase();
            
            let detectedType = 'text';
            let options = null;
            
            // 列名ベースの判定（訪問管理記録に最適化）
            if (dateColumnPatterns.some(pattern => header.includes(pattern) || headerLower.includes(pattern.toLowerCase()))) {
                detectedType = 'date';
            } else if (numberColumnPatterns.some(pattern => header.includes(pattern) || headerLower.includes(pattern.toLowerCase()))) {
                detectedType = 'number';
            } else if (selectColumnPatterns.some(pattern => header.includes(pattern) || headerLower.includes(pattern.toLowerCase()))) {
                // 選択肢として判定
                if (uniqueValues.length <= 20 && uniqueValues.length >= 2) {
                    detectedType = 'select';
                    options = uniqueValues.slice(0, 20); // 最大20個まで
                }
            } else {
                // 値ベースの判定
                // 日付判定（複数のパターンに対応）
                const datePatterns = [
                    /^\d{4}[-\/]\d{1,2}[-\/]\d{1,2}/,  // 2024/01/01
                    /^\d{4}-\d{2}-\d{2}/,              // 2024-01-01
                    /^\d{1,2}\/\d{1,2}\/\d{4}/,        // 01/01/2024
                    /^\d{4}年\d{1,2}月\d{1,2}日/        // 2024年1月1日
                ];
                if (columnValues.some(v => datePatterns.some(pattern => pattern.test(String(v))))) {
                    detectedType = 'date';
                }
                // 数値判定
                else if (columnValues.length > 0 && columnValues.every(v => !isNaN(Number(v)) && v !== '' && String(v).trim().length > 0)) {
                    detectedType = 'number';
                }
                // 選択肢判定（ユニーク値が少ない場合）
                else if (uniqueValues.length <= 15 && uniqueValues.length >= 2 && columnValues.length >= 3) {
                    // 値の種類が少なく、データが3件以上ある場合
                    detectedType = 'select';
                    options = uniqueValues;
                }
            }

            dataTypes[header] = {
                type: detectedType,
                options: detectedType === 'select' ? options : null
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

