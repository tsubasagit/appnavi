// Google Sheets API連携機能
// 注意: 実際のプロジェクトでは、OAuth 2.0認証を適切に実装してください

class GoogleSheetsService {
    constructor() {
        this.apiKey = null; // Google Sheets API Key（環境変数から取得）
        this.accessToken = null; // OAuth 2.0アクセストークン
        this.isAuthenticated = false;
        this.tokenClient = null; // Google Identity Servicesのトークンクライアント
        this.refreshTokenPromise = null; // リフレッシュ中のPromise（重複リクエストを防ぐ）
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

    // Google認証を実行（OAuth 2.0）
    async signIn() {
        try {
            // Google Identity Services (新しい方式) を使用
            if (typeof google !== 'undefined' && google.accounts && google.accounts.oauth2) {
                return await this.signInWithGoogleIdentityServices();
            }
            
            // フォールバック: gapi (旧方式) を使用
            if (typeof gapi !== 'undefined' && gapi.auth2) {
                return await this.signInWithGapi();
            }
            
            // 認証ライブラリが読み込まれていない場合
            throw new Error('Google認証ライブラリが読み込まれていません。');
        } catch (error) {
            console.error('Error signing in:', error);
            throw error;
        }
    }

    // Google Identity Services (新しい方式) で認証
    async signInWithGoogleIdentityServices() {
        return new Promise((resolve, reject) => {
            try {
                // クライアントIDの優先順位: 1. this.clientId 2. localStorage 3. デフォルト値
                const DEFAULT_CLIENT_ID = '509155102966-d1caj0trqoakrmi2tju5mvicdlj2qb1f.apps.googleusercontent.com';
                const clientId = this.clientId || 
                                localStorage.getItem('google_client_id') || 
                                DEFAULT_CLIENT_ID;
                
                if (!clientId || clientId === 'YOUR_CLIENT_ID') {
                    reject(new Error('Google Client IDが設定されていません。設定画面で設定してください。'));
                    return;
                }
                
                const client = google.accounts.oauth2.initTokenClient({
                    client_id: clientId,
                    scope: 'https://www.googleapis.com/auth/spreadsheets',
                    callback: (response) => {
                        if (response.error) {
                            reject(new Error(response.error));
                            return;
                        }
                        this.accessToken = response.access_token;
                        this.isAuthenticated = true;
                        // トークンクライアントを保存（リフレッシュ用）
                        this.tokenClient = client;
                        resolve(true);
                    },
                });
                this.tokenClient = client; // リフレッシュ用に保存
                client.requestAccessToken();
            } catch (error) {
                reject(error);
            }
        });
    }

    // gapi (旧方式) で認証
    async signInWithGapi() {
        return new Promise((resolve, reject) => {
            try {
                // クライアントIDの優先順位: 1. this.clientId 2. localStorage 3. デフォルト値
                const DEFAULT_CLIENT_ID = '509155102966-d1caj0trqoakrmi2tju5mvicdlj2qb1f.apps.googleusercontent.com';
                const clientId = this.clientId || 
                                localStorage.getItem('google_client_id') || 
                                DEFAULT_CLIENT_ID;
                
                if (!clientId || clientId === 'YOUR_CLIENT_ID') {
                    reject(new Error('Google Client IDが設定されていません。設定画面で設定してください。'));
                    return;
                }
                
                gapi.load('auth2', () => {
                    gapi.auth2.init({
                        client_id: clientId,
                    }).then(() => {
                        const authInstance = gapi.auth2.getAuthInstance();
                        authInstance.signIn({
                            scope: 'https://www.googleapis.com/auth/spreadsheets'
                        }).then(() => {
                            const user = authInstance.currentUser.get();
                            const authResponse = user.getAuthResponse();
                            this.accessToken = authResponse.access_token;
                            this.isAuthenticated = true;
                            resolve(true);
                        }).catch(reject);
                    }).catch(reject);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    // アクセストークンを設定（外部から設定する場合）
    setAccessToken(token) {
        this.accessToken = token;
        this.isAuthenticated = true;
    }

    // トークンをリフレッシュ
    async refreshAccessToken() {
        // 既にリフレッシュ中の場合は、そのPromiseを返す
        if (this.refreshTokenPromise) {
            return this.refreshTokenPromise;
        }

        this.refreshTokenPromise = new Promise((resolve, reject) => {
            try {
                // クライアントIDを取得
                const DEFAULT_CLIENT_ID = '509155102966-d1caj0trqoakrmi2tju5mvicdlj2qb1f.apps.googleusercontent.com';
                const clientId = this.clientId || 
                                localStorage.getItem('google_client_id') || 
                                DEFAULT_CLIENT_ID;
                
                if (!clientId || clientId === 'YOUR_CLIENT_ID') {
                    this.refreshTokenPromise = null;
                    reject(new Error('Google Client IDが設定されていません。設定画面で設定してください。'));
                    return;
                }

                // 新しいトークンクライアントを作成してリフレッシュ
                const refreshClient = google.accounts.oauth2.initTokenClient({
                    client_id: clientId,
                    scope: 'https://www.googleapis.com/auth/spreadsheets',
                    callback: (response) => {
                        if (response.error) {
                            this.refreshTokenPromise = null;
                            reject(new Error(`トークンのリフレッシュに失敗しました: ${response.error}`));
                            return;
                        }
                        this.accessToken = response.access_token;
                        this.isAuthenticated = true;
                        this.tokenClient = refreshClient; // 新しいトークンクライアントを保存
                        this.refreshTokenPromise = null;
                        resolve(this.accessToken);
                    },
                });
                
                // リフレッシュトークンを要求（prompt: ''でサイレントリフレッシュ）
                refreshClient.requestAccessToken({ prompt: '' });
            } catch (error) {
                this.refreshTokenPromise = null;
                reject(error);
            }
        });

        return this.refreshTokenPromise;
    }

    // 認証エラーを検出してトークンをリフレッシュ
    async handleAuthError(originalRequest) {
        try {
            // トークンをリフレッシュ
            await this.refreshAccessToken();
            
            // 元のリクエストを再実行
            return await originalRequest();
        } catch (refreshError) {
            // リフレッシュに失敗した場合は、再認証が必要
            throw new Error('認証の有効期限が切れました。再度ログインしてください。');
        }
    }

    // クライアントIDを設定
    setClientId(clientId) {
        this.clientId = clientId;
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

    // Google Apps ScriptのWebアプリURLを設定
    setAppsScriptUrl(url) {
        this.appsScriptUrl = url;
    }

    // スプレッドシートにデータを書き込み（Google Sheets API直接書き込み、認証あり）
    async writeToSpreadsheet(spreadsheetUrl, sheetName, data, rowIndex = null) {
        try {
            // 認証がある場合はGoogle Sheets APIに直接書き込む
            if (this.isAuthenticated && this.accessToken) {
                return await this.writeToSpreadsheetDirect(spreadsheetUrl, sheetName, data, rowIndex);
            }
            
            // 認証がない場合はGoogle Apps Script経由
            if (this.appsScriptUrl) {
                return await this.writeToSpreadsheetViaAppsScript(spreadsheetUrl, sheetName, data, rowIndex);
            }
            
            throw new Error('認証またはGoogle Apps ScriptのURLが必要です。');
        } catch (error) {
            console.error('Error writing to spreadsheet:', error);
            throw error;
        }
    }

    // Google Sheets APIに直接書き込み（認証あり）
    async writeToSpreadsheetDirect(spreadsheetUrl, sheetName, data, rowIndex = null) {
        try {
            if (!this.accessToken) {
                throw new Error('アクセストークンが設定されていません。先にGoogle認証を実行してください。');
            }

            const spreadsheetId = this.extractSpreadsheetId(spreadsheetUrl);
            const sheet = sheetName || 'Sheet1';
            const values = Array.isArray(data) ? data : Object.values(data);
            
            let url;
            let method;
            let body;

            if (rowIndex !== null && rowIndex !== undefined) {
                // 行を更新
                const range = `${sheet}!A${rowIndex + 2}`; // 行番号は1から始まり、ヘッダー行を考慮して+2
                url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?valueInputOption=RAW`;
                method = 'PUT';
                body = {
                    values: [values]
                };
            } else {
                // 新しい行を追加
                const range = `${sheet}!A:Z`;
                url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=RAW`;
                method = 'POST';
                body = {
                    values: [values]
                };
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                // レスポンスボディをテキストとして取得（JSON解析に失敗する場合があるため）
                const responseText = await response.clone().text().catch(() => '');
                let errorData = {};
                try {
                    errorData = JSON.parse(responseText);
                } catch (e) {
                    // JSON解析に失敗した場合は、テキストをそのまま使用
                    errorData = { error: { message: responseText } };
                }
                
                // 401エラー（認証エラー）の処理
                const is401Error = response.status === 401 || errorData.error?.code === 401;
                const isUnauthorized = errorData.error?.status === 'UNAUTHENTICATED';
                // エラーメッセージを複数の場所から取得
                const authErrorMessage = errorData.error?.message || errorData.message || responseText || '';
                const fullAuthErrorMessage = authErrorMessage + ' ' + JSON.stringify(errorData);
                const hasInvalidAuth = authErrorMessage.includes('invalid authentication credentials') ||
                                      authErrorMessage.includes('invalid_token') ||
                                      authErrorMessage.includes('token expired') ||
                                      authErrorMessage.includes('Request had invalid authentication credentials') ||
                                      authErrorMessage.includes('Expected OAuth 2 access token') ||
                                      fullAuthErrorMessage.includes('invalid authentication credentials') ||
                                      fullAuthErrorMessage.includes('Expected OAuth 2 access token');
                
                console.log('エラーレスポンス解析:', {
                    status: response.status,
                    is401Error,
                    isUnauthorized,
                    hasInvalidAuth,
                    authErrorMessage,
                    errorData
                });
                
                // 認証エラーの場合、トークンをリフレッシュして再試行
                if (is401Error || isUnauthorized || hasInvalidAuth) {
                    try {
                        console.log('認証エラーを検出。トークンをリフレッシュします...');
                        await this.refreshAccessToken();
                        
                        // リフレッシュ後、元のリクエストを再実行
                        const retryResponse = await fetch(url, {
                            method: method,
                            headers: {
                                'Authorization': `Bearer ${this.accessToken}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(body)
                        });
                        
                        if (retryResponse.ok) {
                            return await retryResponse.json();
                        }
                        
                        // 再試行後もエラーの場合は、通常のエラーハンドリングに進む
                        const retryErrorData = await retryResponse.json().catch(() => ({}));
                        throw new Error(`認証エラーが続いています。再認証が必要です: ${retryErrorData.error?.message || retryResponse.statusText}`);
                    } catch (refreshError) {
                        // リフレッシュに失敗した場合は、再認証を促す
                        throw new Error('認証の有効期限が切れました。再度ログインしてください。\n\n【解決方法】\n1. ダッシュボードで「Googleでログイン」ボタンをクリックしてください\n2. 認証後、再度お試しください');
                    }
                }
                
                // 403エラーまたはPERMISSION_DENIEDエラーの場合は常に詳細なメッセージを提供
                const is403Error = response.status === 403 || errorData.error?.code === 403;
                const isPermissionDenied = errorData.error?.status === 'PERMISSION_DENIED';
                const hasServiceDisabled = errorData.error?.details?.some(detail => 
                    detail.reason === 'SERVICE_DISABLED' || 
                    detail['@type']?.includes('ErrorInfo')
                );
                
                // 400エラー（INVALID_ARGUMENT）の処理
                const is400Error = response.status === 400 || errorData.error?.code === 400;
                const isInvalidArgument = errorData.error?.status === 'INVALID_ARGUMENT';
                const invalidArgErrorMessage = errorData.error?.message || responseText || '';
                
                if (is400Error || isInvalidArgument) {
                    let detailedMessage = '';
                    
                    // 範囲パースエラーの場合
                    if (invalidArgErrorMessage.includes('Unable to parse range') || invalidArgErrorMessage.includes('parse range')) {
                        detailedMessage = 'スプレッドシートの範囲指定エラーが発生しました。\n\n';
                        detailedMessage += '【原因】\n';
                        detailedMessage += 'スプレッドシートのシート名または範囲の指定に問題があります。\n\n';
                        detailedMessage += '【解決方法】\n';
                        detailedMessage += '1. スプレッドシートのシート名を確認してください\n';
                        detailedMessage += '   - シート名に特殊文字（/, ?, *, [, ], \\）が含まれていないか確認\n';
                        detailedMessage += '   - シート名にスペースが含まれている場合は、シート名を変更してください\n';
                        detailedMessage += '2. スプレッドシートのURLを確認してください\n';
                        detailedMessage += '   - 正しいスプレッドシートのURLが設定されているか確認\n';
                        detailedMessage += '   - スプレッドシートが削除されていないか確認\n';
                        detailedMessage += '3. アプリの設定画面で、スプレッドシートURLを再設定してください\n';
                        detailedMessage += '4. それでもエラーが続く場合は、スプレッドシートのシート名を「Sheet1」に変更してください\n';
                    } else {
                        // その他の400エラーの場合
                        detailedMessage = 'Google Sheets APIでエラーが発生しました。\n\n';
                        detailedMessage += '【エラー内容】\n';
                        detailedMessage += `${invalidArgErrorMessage}\n\n`;
                        detailedMessage += '【解決方法】\n';
                        detailedMessage += '1. スプレッドシートのURLが正しいか確認してください\n';
                        detailedMessage += '2. スプレッドシートへのアクセス権限があるか確認してください\n';
                        detailedMessage += '3. スプレッドシートが削除されていないか確認してください\n';
                        detailedMessage += '4. アプリの設定画面で、スプレッドシートURLを再設定してください\n';
                    }
                    
                    throw new Error(detailedMessage);
                }
                
                if (is403Error || isPermissionDenied || hasServiceDisabled) {
                    const errorDetails = errorData.error?.details || [];
                    
                    // プロジェクト番号とアクティベーションURLを抽出
                    let projectNumber = '';
                    let activationUrl = '';
                    
                    // エラーディテールからメタデータを取得
                    for (const detail of errorDetails) {
                        if (detail.metadata) {
                            const metadata = detail.metadata;
                            // containerInfoにプロジェクト番号が含まれている
                            if (metadata.containerInfo && !projectNumber) {
                                projectNumber = metadata.containerInfo;
                            }
                            // consumerにプロジェクト番号が含まれている（projects/509155102966形式）
                            if (metadata.consumer && !projectNumber) {
                                projectNumber = metadata.consumer.replace('projects/', '');
                            }
                            // activationUrlが含まれている
                            if (metadata.activationUrl && !activationUrl) {
                                activationUrl = metadata.activationUrl;
                            }
                            // その他のメタデータからプロジェクト番号を取得
                            if (!projectNumber) {
                                projectNumber = metadata['service.googleapis.com/project_number'] || '';
                            }
                        }
                    }
                    
                    // メタデータから取得できない場合は、エラーメッセージから抽出
                    if (!projectNumber) {
                        projectNumber = errorMessage.match(/project\s+(\d+)/i)?.[1] ||
                                      errorMessage.match(/project\s*(\d+)/i)?.[1] ||
                                      errorMessage.match(/(\d{12})/)?.[1] || '';
                    }
                    
                    if (!activationUrl) {
                        activationUrl = errorMessage.match(/https:\/\/console\.developers\.google\.com\/apis\/api\/sheets\.googleapis\.com\/overview\?project=\d+/)?.[0] || '';
                    }
                    
                    // 403エラーの場合は常に詳細メッセージを表示
                    // アクティベーションURLが取得できた場合は、それを含める
                    if (!activationUrl && projectNumber) {
                        activationUrl = `https://console.developers.google.com/apis/api/sheets.googleapis.com/overview?project=${projectNumber}`;
                    }
                    
                    let detailedMessage = 'Google Sheets APIが有効化されていません。';
                    
                    // アクティベーションURLを含める（フロントエンドで抽出できるように）
                    if (activationUrl) {
                        detailedMessage += ` ACTIVATION_URL:${activationUrl}`;
                    }
                    
                    detailedMessage += '\n\n【解決方法】\n';
                    
                    if (activationUrl) {
                        // アクティベーションURLが取得できた場合
                        detailedMessage += `1. 以下のURLをクリックしてGoogle Sheets APIを有効化してください:\n`;
                        detailedMessage += `   ${activationUrl}\n\n`;
                    } else {
                        // プロジェクト番号が取得できない場合
                        detailedMessage += `1. Google Cloud Console（https://console.cloud.google.com/）にアクセスしてください\n`;
                        detailedMessage += `2. プロジェクトを選択してください\n`;
                        detailedMessage += `3. 「APIとサービス」>「ライブラリ」を開いてください\n`;
                        detailedMessage += `4. 「Google Sheets API」を検索して「有効にする」をクリックしてください\n\n`;
                    }
                    
                    detailedMessage += '2. 有効化後、数分待ってから再度お試しください\n';
                    detailedMessage += '3. それでもエラーが続く場合は、ブラウザを再読み込みしてください';
                    throw new Error(detailedMessage);
                }
                
                throw new Error(`Google Sheets API error: ${response.statusText} - ${JSON.stringify(errorData)}`);
            }

            const result = await response.json();
            return {
                success: true,
                message: rowIndex !== null ? 'データを更新しました' : 'データを追加しました',
                result: result
            };
        } catch (error) {
            console.error('Error writing to spreadsheet directly:', error);
            throw error;
        }
    }

    // Google Apps Script経由で書き込み（認証不要）
    async writeToSpreadsheetViaAppsScript(spreadsheetUrl, sheetName, data, rowIndex = null) {
        try {
            if (!this.appsScriptUrl) {
                throw new Error('Google Apps ScriptのURLが設定されていません。');
            }

            const action = rowIndex !== null && rowIndex !== undefined ? 'update' : 'append';
            const payload = {
                action: action,
                values: Array.isArray(data) ? data : Object.values(data),
                rowIndex: rowIndex
            };

            const response = await fetch(this.appsScriptUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Google Apps Script error: ${response.statusText}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error writing via Apps Script:', error);
            throw error;
        }
    }

    // スプレッドシートの行を更新
    async updateSpreadsheetRow(spreadsheetUrl, sheetName, rowIndex, data) {
        try {
            // 認証がある場合はGoogle Sheets APIに直接書き込む
            if (this.isAuthenticated && this.accessToken) {
                return await this.updateSpreadsheetRowDirect(spreadsheetUrl, sheetName, rowIndex, data);
            }
            
            // 認証がない場合はGoogle Apps Script経由
            if (this.appsScriptUrl) {
                return await this.updateSpreadsheetRowViaAppsScript(spreadsheetUrl, sheetName, rowIndex, data);
            }
            
            throw new Error('認証またはGoogle Apps ScriptのURLが必要です。');
        } catch (error) {
            console.error('Error updating spreadsheet row:', error);
            throw error;
        }
    }

    // Google Sheets APIに直接行を更新（認証あり）
    async updateSpreadsheetRowDirect(spreadsheetUrl, sheetName, rowIndex, data) {
        try {
            if (!this.accessToken) {
                throw new Error('アクセストークンが設定されていません。');
            }

            const spreadsheetId = this.extractSpreadsheetId(spreadsheetUrl);
            const sheet = sheetName || 'Sheet1';
            const values = Array.isArray(data) ? data : Object.values(data);
            const range = `${sheet}!A${rowIndex + 2}`; // 行番号は1から始まり、ヘッダー行を考慮して+2
            
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?valueInputOption=RAW`;
            
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    values: [values]
                })
            });

            if (!response.ok) {
                // レスポンスボディをテキストとして取得（JSON解析に失敗する場合があるため）
                const responseText = await response.clone().text().catch(() => '');
                let errorData = {};
                try {
                    errorData = JSON.parse(responseText);
                } catch (e) {
                    // JSON解析に失敗した場合は、テキストをそのまま使用
                    errorData = { error: { message: responseText } };
                }
                
                // 401エラー（認証エラー）の処理
                const is401Error = response.status === 401 || errorData.error?.code === 401;
                const isUnauthorized = errorData.error?.status === 'UNAUTHENTICATED';
                // エラーメッセージを複数の場所から取得
                const authErrorMessage = errorData.error?.message || errorData.message || responseText || '';
                const fullAuthErrorMessage = authErrorMessage + ' ' + JSON.stringify(errorData);
                const hasInvalidAuth = authErrorMessage.includes('invalid authentication credentials') ||
                                      authErrorMessage.includes('invalid_token') ||
                                      authErrorMessage.includes('token expired') ||
                                      authErrorMessage.includes('Request had invalid authentication credentials') ||
                                      authErrorMessage.includes('Expected OAuth 2 access token') ||
                                      fullAuthErrorMessage.includes('invalid authentication credentials') ||
                                      fullAuthErrorMessage.includes('Expected OAuth 2 access token');
                
                console.log('エラーレスポンス解析:', {
                    status: response.status,
                    is401Error,
                    isUnauthorized,
                    hasInvalidAuth,
                    authErrorMessage,
                    errorData
                });
                
                // 認証エラーの場合、トークンをリフレッシュして再試行
                if (is401Error || isUnauthorized || hasInvalidAuth) {
                    try {
                        console.log('認証エラーを検出。トークンをリフレッシュします...');
                        await this.refreshAccessToken();
                        
                        // リフレッシュ後、元のリクエストを再実行
                        const retryResponse = await fetch(url, {
                            method: method,
                            headers: {
                                'Authorization': `Bearer ${this.accessToken}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(body)
                        });
                        
                        if (retryResponse.ok) {
                            return await retryResponse.json();
                        }
                        
                        // 再試行後もエラーの場合は、通常のエラーハンドリングに進む
                        const retryErrorData = await retryResponse.json().catch(() => ({}));
                        throw new Error(`認証エラーが続いています。再認証が必要です: ${retryErrorData.error?.message || retryResponse.statusText}`);
                    } catch (refreshError) {
                        // リフレッシュに失敗した場合は、再認証を促す
                        throw new Error('認証の有効期限が切れました。再度ログインしてください。\n\n【解決方法】\n1. ダッシュボードで「Googleでログイン」ボタンをクリックしてください\n2. 認証後、再度お試しください');
                    }
                }
                
                // 403エラーまたはPERMISSION_DENIEDエラーの場合は常に詳細なメッセージを提供
                const is403Error = response.status === 403 || errorData.error?.code === 403;
                const isPermissionDenied = errorData.error?.status === 'PERMISSION_DENIED';
                const hasServiceDisabled = errorData.error?.details?.some(detail => 
                    detail.reason === 'SERVICE_DISABLED' || 
                    detail['@type']?.includes('ErrorInfo')
                );
                
                // 400エラー（INVALID_ARGUMENT）の処理
                const is400Error = response.status === 400 || errorData.error?.code === 400;
                const isInvalidArgument = errorData.error?.status === 'INVALID_ARGUMENT';
                const invalidArgErrorMessage = errorData.error?.message || responseText || '';
                
                if (is400Error || isInvalidArgument) {
                    let detailedMessage = '';
                    
                    // 範囲パースエラーの場合
                    if (invalidArgErrorMessage.includes('Unable to parse range') || invalidArgErrorMessage.includes('parse range')) {
                        detailedMessage = 'スプレッドシートの範囲指定エラーが発生しました。\n\n';
                        detailedMessage += '【原因】\n';
                        detailedMessage += 'スプレッドシートのシート名または範囲の指定に問題があります。\n\n';
                        detailedMessage += '【解決方法】\n';
                        detailedMessage += '1. スプレッドシートのシート名を確認してください\n';
                        detailedMessage += '   - シート名に特殊文字（/, ?, *, [, ], \\）が含まれていないか確認\n';
                        detailedMessage += '   - シート名にスペースが含まれている場合は、シート名を変更してください\n';
                        detailedMessage += '2. スプレッドシートのURLを確認してください\n';
                        detailedMessage += '   - 正しいスプレッドシートのURLが設定されているか確認\n';
                        detailedMessage += '   - スプレッドシートが削除されていないか確認\n';
                        detailedMessage += '3. アプリの設定画面で、スプレッドシートURLを再設定してください\n';
                        detailedMessage += '4. それでもエラーが続く場合は、スプレッドシートのシート名を「Sheet1」に変更してください\n';
                    } else {
                        // その他の400エラーの場合
                        detailedMessage = 'Google Sheets APIでエラーが発生しました。\n\n';
                        detailedMessage += '【エラー内容】\n';
                        detailedMessage += `${invalidArgErrorMessage}\n\n`;
                        detailedMessage += '【解決方法】\n';
                        detailedMessage += '1. スプレッドシートのURLが正しいか確認してください\n';
                        detailedMessage += '2. スプレッドシートへのアクセス権限があるか確認してください\n';
                        detailedMessage += '3. スプレッドシートが削除されていないか確認してください\n';
                        detailedMessage += '4. アプリの設定画面で、スプレッドシートURLを再設定してください\n';
                    }
                    
                    throw new Error(detailedMessage);
                }
                
                if (is403Error || isPermissionDenied || hasServiceDisabled) {
                    const errorDetails = errorData.error?.details || [];
                    
                    // プロジェクト番号とアクティベーションURLを抽出
                    let projectNumber = '';
                    let activationUrl = '';
                    
                    // エラーディテールからメタデータを取得
                    for (const detail of errorDetails) {
                        if (detail.metadata) {
                            const metadata = detail.metadata;
                            // containerInfoにプロジェクト番号が含まれている
                            if (metadata.containerInfo && !projectNumber) {
                                projectNumber = metadata.containerInfo;
                            }
                            // consumerにプロジェクト番号が含まれている（projects/509155102966形式）
                            if (metadata.consumer && !projectNumber) {
                                projectNumber = metadata.consumer.replace('projects/', '');
                            }
                            // activationUrlが含まれている
                            if (metadata.activationUrl && !activationUrl) {
                                activationUrl = metadata.activationUrl;
                            }
                            // その他のメタデータからプロジェクト番号を取得
                            if (!projectNumber) {
                                projectNumber = metadata['service.googleapis.com/project_number'] || '';
                            }
                        }
                    }
                    
                    // メタデータから取得できない場合は、エラーメッセージから抽出
                    if (!projectNumber) {
                        projectNumber = errorMessage.match(/project\s+(\d+)/i)?.[1] ||
                                      errorMessage.match(/project\s*(\d+)/i)?.[1] ||
                                      errorMessage.match(/(\d{12})/)?.[1] || '';
                    }
                    
                    if (!activationUrl) {
                        activationUrl = errorMessage.match(/https:\/\/console\.developers\.google\.com\/apis\/api\/sheets\.googleapis\.com\/overview\?project=\d+/)?.[0] || '';
                    }
                    
                    // 403エラーの場合は常に詳細メッセージを表示
                    // アクティベーションURLが取得できた場合は、それを含める
                    if (!activationUrl && projectNumber) {
                        activationUrl = `https://console.developers.google.com/apis/api/sheets.googleapis.com/overview?project=${projectNumber}`;
                    }
                    
                    let detailedMessage = 'Google Sheets APIが有効化されていません。';
                    
                    // アクティベーションURLを含める（フロントエンドで抽出できるように）
                    if (activationUrl) {
                        detailedMessage += ` ACTIVATION_URL:${activationUrl}`;
                    }
                    
                    detailedMessage += '\n\n【解決方法】\n';
                    
                    if (activationUrl) {
                        // アクティベーションURLが取得できた場合
                        detailedMessage += `1. 以下のURLをクリックしてGoogle Sheets APIを有効化してください:\n`;
                        detailedMessage += `   ${activationUrl}\n\n`;
                    } else {
                        // プロジェクト番号が取得できない場合
                        detailedMessage += `1. Google Cloud Console（https://console.cloud.google.com/）にアクセスしてください\n`;
                        detailedMessage += `2. プロジェクトを選択してください\n`;
                        detailedMessage += `3. 「APIとサービス」>「ライブラリ」を開いてください\n`;
                        detailedMessage += `4. 「Google Sheets API」を検索して「有効にする」をクリックしてください\n\n`;
                    }
                    
                    detailedMessage += '2. 有効化後、数分待ってから再度お試しください\n';
                    detailedMessage += '3. それでもエラーが続く場合は、ブラウザを再読み込みしてください';
                    throw new Error(detailedMessage);
                }
                
                throw new Error(`Google Sheets API error: ${response.statusText} - ${JSON.stringify(errorData)}`);
            }

            const result = await response.json();
            return {
                success: true,
                message: 'データを更新しました',
                result: result
            };
        } catch (error) {
            console.error('Error updating spreadsheet row directly:', error);
            throw error;
        }
    }

    // Google Apps Script経由で行を更新
    async updateSpreadsheetRowViaAppsScript(spreadsheetUrl, sheetName, rowIndex, data) {
        try {
            if (!this.appsScriptUrl) {
                throw new Error('Google Apps ScriptのURLが設定されていません。');
            }

            const payload = {
                action: 'update',
                rowIndex: rowIndex + 1, // スプレッドシートの行番号は1から始まる
                values: Array.isArray(data) ? data : Object.values(data)
            };

            const response = await fetch(this.appsScriptUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Google Apps Script error: ${response.statusText}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error updating via Apps Script:', error);
            throw error;
        }
    }

    // スプレッドシートの行を削除
    async deleteSpreadsheetRow(spreadsheetUrl, sheetName, rowIndex) {
        try {
            // 認証がある場合はGoogle Sheets APIに直接削除
            if (this.isAuthenticated && this.accessToken) {
                return await this.deleteSpreadsheetRowDirect(spreadsheetUrl, sheetName, rowIndex);
            }
            
            // 認証がない場合はGoogle Apps Script経由
            if (this.appsScriptUrl) {
                return await this.deleteSpreadsheetRowViaAppsScript(spreadsheetUrl, sheetName, rowIndex);
            }
            
            throw new Error('認証またはGoogle Apps ScriptのURLが必要です。');
        } catch (error) {
            console.error('Error deleting spreadsheet row:', error);
            throw error;
        }
    }

    // Google Sheets APIに直接行を削除（認証あり）
    async deleteSpreadsheetRowDirect(spreadsheetUrl, sheetName, rowIndex) {
        try {
            if (!this.accessToken) {
                throw new Error('アクセストークンが設定されていません。');
            }

            const spreadsheetId = this.extractSpreadsheetId(spreadsheetUrl);
            const sheet = sheetName || 'Sheet1';
            const actualRowIndex = rowIndex + 2; // 行番号は1から始まり、ヘッダー行を考慮して+2
            
            // Google Sheets APIで行を削除するには、batchUpdateを使用
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`;
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    requests: [{
                        deleteDimension: {
                            range: {
                                sheetId: 0, // 最初のシート（実際のsheetIdを取得する必要がある場合は別途実装）
                                dimension: 'ROWS',
                                startIndex: actualRowIndex - 1,
                                endIndex: actualRowIndex
                            }
                        }
                    }]
                })
            });

            if (!response.ok) {
                // レスポンスボディをテキストとして取得（JSON解析に失敗する場合があるため）
                const responseText = await response.clone().text().catch(() => '');
                let errorData = {};
                try {
                    errorData = JSON.parse(responseText);
                } catch (e) {
                    // JSON解析に失敗した場合は、テキストをそのまま使用
                    errorData = { error: { message: responseText } };
                }
                
                // 401エラー（認証エラー）の処理
                const is401Error = response.status === 401 || errorData.error?.code === 401;
                const isUnauthorized = errorData.error?.status === 'UNAUTHENTICATED';
                // エラーメッセージを複数の場所から取得
                const authErrorMessage = errorData.error?.message || errorData.message || responseText || '';
                const fullAuthErrorMessage = authErrorMessage + ' ' + JSON.stringify(errorData);
                const hasInvalidAuth = authErrorMessage.includes('invalid authentication credentials') ||
                                      authErrorMessage.includes('invalid_token') ||
                                      authErrorMessage.includes('token expired') ||
                                      authErrorMessage.includes('Request had invalid authentication credentials') ||
                                      authErrorMessage.includes('Expected OAuth 2 access token') ||
                                      fullAuthErrorMessage.includes('invalid authentication credentials') ||
                                      fullAuthErrorMessage.includes('Expected OAuth 2 access token');
                
                console.log('エラーレスポンス解析:', {
                    status: response.status,
                    is401Error,
                    isUnauthorized,
                    hasInvalidAuth,
                    authErrorMessage,
                    errorData
                });
                
                // 認証エラーの場合、トークンをリフレッシュして再試行
                if (is401Error || isUnauthorized || hasInvalidAuth) {
                    try {
                        console.log('認証エラーを検出。トークンをリフレッシュします...');
                        await this.refreshAccessToken();
                        
                        // リフレッシュ後、元のリクエストを再実行
                        const retryResponse = await fetch(url, {
                            method: method,
                            headers: {
                                'Authorization': `Bearer ${this.accessToken}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(body)
                        });
                        
                        if (retryResponse.ok) {
                            return await retryResponse.json();
                        }
                        
                        // 再試行後もエラーの場合は、通常のエラーハンドリングに進む
                        const retryErrorData = await retryResponse.json().catch(() => ({}));
                        throw new Error(`認証エラーが続いています。再認証が必要です: ${retryErrorData.error?.message || retryResponse.statusText}`);
                    } catch (refreshError) {
                        // リフレッシュに失敗した場合は、再認証を促す
                        throw new Error('認証の有効期限が切れました。再度ログインしてください。\n\n【解決方法】\n1. ダッシュボードで「Googleでログイン」ボタンをクリックしてください\n2. 認証後、再度お試しください');
                    }
                }
                
                // 403エラーまたはPERMISSION_DENIEDエラーの場合は常に詳細なメッセージを提供
                const is403Error = response.status === 403 || errorData.error?.code === 403;
                const isPermissionDenied = errorData.error?.status === 'PERMISSION_DENIED';
                const hasServiceDisabled = errorData.error?.details?.some(detail => 
                    detail.reason === 'SERVICE_DISABLED' || 
                    detail['@type']?.includes('ErrorInfo')
                );
                
                // 400エラー（INVALID_ARGUMENT）の処理
                const is400Error = response.status === 400 || errorData.error?.code === 400;
                const isInvalidArgument = errorData.error?.status === 'INVALID_ARGUMENT';
                const invalidArgErrorMessage = errorData.error?.message || responseText || '';
                
                if (is400Error || isInvalidArgument) {
                    let detailedMessage = '';
                    
                    // 範囲パースエラーの場合
                    if (invalidArgErrorMessage.includes('Unable to parse range') || invalidArgErrorMessage.includes('parse range')) {
                        detailedMessage = 'スプレッドシートの範囲指定エラーが発生しました。\n\n';
                        detailedMessage += '【原因】\n';
                        detailedMessage += 'スプレッドシートのシート名または範囲の指定に問題があります。\n\n';
                        detailedMessage += '【解決方法】\n';
                        detailedMessage += '1. スプレッドシートのシート名を確認してください\n';
                        detailedMessage += '   - シート名に特殊文字（/, ?, *, [, ], \\）が含まれていないか確認\n';
                        detailedMessage += '   - シート名にスペースが含まれている場合は、シート名を変更してください\n';
                        detailedMessage += '2. スプレッドシートのURLを確認してください\n';
                        detailedMessage += '   - 正しいスプレッドシートのURLが設定されているか確認\n';
                        detailedMessage += '   - スプレッドシートが削除されていないか確認\n';
                        detailedMessage += '3. アプリの設定画面で、スプレッドシートURLを再設定してください\n';
                        detailedMessage += '4. それでもエラーが続く場合は、スプレッドシートのシート名を「Sheet1」に変更してください\n';
                    } else {
                        // その他の400エラーの場合
                        detailedMessage = 'Google Sheets APIでエラーが発生しました。\n\n';
                        detailedMessage += '【エラー内容】\n';
                        detailedMessage += `${invalidArgErrorMessage}\n\n`;
                        detailedMessage += '【解決方法】\n';
                        detailedMessage += '1. スプレッドシートのURLが正しいか確認してください\n';
                        detailedMessage += '2. スプレッドシートへのアクセス権限があるか確認してください\n';
                        detailedMessage += '3. スプレッドシートが削除されていないか確認してください\n';
                        detailedMessage += '4. アプリの設定画面で、スプレッドシートURLを再設定してください\n';
                    }
                    
                    throw new Error(detailedMessage);
                }
                
                if (is403Error || isPermissionDenied || hasServiceDisabled) {
                    const errorDetails = errorData.error?.details || [];
                    
                    // プロジェクト番号とアクティベーションURLを抽出
                    let projectNumber = '';
                    let activationUrl = '';
                    
                    // エラーディテールからメタデータを取得
                    for (const detail of errorDetails) {
                        if (detail.metadata) {
                            const metadata = detail.metadata;
                            // containerInfoにプロジェクト番号が含まれている
                            if (metadata.containerInfo && !projectNumber) {
                                projectNumber = metadata.containerInfo;
                            }
                            // consumerにプロジェクト番号が含まれている（projects/509155102966形式）
                            if (metadata.consumer && !projectNumber) {
                                projectNumber = metadata.consumer.replace('projects/', '');
                            }
                            // activationUrlが含まれている
                            if (metadata.activationUrl && !activationUrl) {
                                activationUrl = metadata.activationUrl;
                            }
                            // その他のメタデータからプロジェクト番号を取得
                            if (!projectNumber) {
                                projectNumber = metadata['service.googleapis.com/project_number'] || '';
                            }
                        }
                    }
                    
                    // メタデータから取得できない場合は、エラーメッセージから抽出
                    if (!projectNumber) {
                        projectNumber = errorMessage.match(/project\s+(\d+)/i)?.[1] ||
                                      errorMessage.match(/project\s*(\d+)/i)?.[1] ||
                                      errorMessage.match(/(\d{12})/)?.[1] || '';
                    }
                    
                    if (!activationUrl) {
                        activationUrl = errorMessage.match(/https:\/\/console\.developers\.google\.com\/apis\/api\/sheets\.googleapis\.com\/overview\?project=\d+/)?.[0] || '';
                    }
                    
                    // 403エラーの場合は常に詳細メッセージを表示
                    // アクティベーションURLが取得できた場合は、それを含める
                    if (!activationUrl && projectNumber) {
                        activationUrl = `https://console.developers.google.com/apis/api/sheets.googleapis.com/overview?project=${projectNumber}`;
                    }
                    
                    let detailedMessage = 'Google Sheets APIが有効化されていません。';
                    
                    // アクティベーションURLを含める（フロントエンドで抽出できるように）
                    if (activationUrl) {
                        detailedMessage += ` ACTIVATION_URL:${activationUrl}`;
                    }
                    
                    detailedMessage += '\n\n【解決方法】\n';
                    
                    if (activationUrl) {
                        // アクティベーションURLが取得できた場合
                        detailedMessage += `1. 以下のURLをクリックしてGoogle Sheets APIを有効化してください:\n`;
                        detailedMessage += `   ${activationUrl}\n\n`;
                    } else {
                        // プロジェクト番号が取得できない場合
                        detailedMessage += `1. Google Cloud Console（https://console.cloud.google.com/）にアクセスしてください\n`;
                        detailedMessage += `2. プロジェクトを選択してください\n`;
                        detailedMessage += `3. 「APIとサービス」>「ライブラリ」を開いてください\n`;
                        detailedMessage += `4. 「Google Sheets API」を検索して「有効にする」をクリックしてください\n\n`;
                    }
                    
                    detailedMessage += '2. 有効化後、数分待ってから再度お試しください\n';
                    detailedMessage += '3. それでもエラーが続く場合は、ブラウザを再読み込みしてください';
                    throw new Error(detailedMessage);
                }
                
                throw new Error(`Google Sheets API error: ${response.statusText} - ${JSON.stringify(errorData)}`);
            }

            const result = await response.json();
            return {
                success: true,
                message: 'データを削除しました',
                result: result
            };
        } catch (error) {
            console.error('Error deleting spreadsheet row directly:', error);
            throw error;
        }
    }

    // Google Apps Script経由で行を削除
    async deleteSpreadsheetRowViaAppsScript(spreadsheetUrl, sheetName, rowIndex) {
        try {
            if (!this.appsScriptUrl) {
                throw new Error('Google Apps ScriptのURLが設定されていません。');
            }

            const payload = {
                action: 'delete',
                rowIndex: rowIndex + 1 // スプレッドシートの行番号は1から始まる
            };

            const response = await fetch(this.appsScriptUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Google Apps Script error: ${response.statusText}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error deleting via Apps Script:', error);
            throw error;
        }
    }

    // スプレッドシートの構造を分析（列数、行数など）
    async analyzeSpreadsheet(spreadsheetUrl, sheetName = null) {
        try {
            const { headers, rows } = await this.fetchSpreadsheetData(spreadsheetUrl, sheetName);
            
            console.log('analyzeSpreadsheet内:', {
                headers: headers,
                rowsLength: rows.length,
                sampleRows: rows.slice(0, 3)
            });
            
            const result = {
                rowCount: rows.length,
                columnCount: headers.length,
                headers: headers,
                rows: rows, // rowsを明示的に含める
                sampleRows: rows.slice(0, 5), // 最初の5行をサンプルとして返す
                dataTypes: this.detectDataTypes(headers, rows)
            };
            
            console.log('analyzeSpreadsheet返り値:', result);
            
            return result;
        } catch (error) {
            console.error('Error analyzing spreadsheet:', error);
            throw error;
        }
    }

    // スプレッドシートに全データを書き込み（ヘッダーとデータ行を一括更新）
    async syncAllDataToSpreadsheet(spreadsheetUrl, sheetName, headers, dataRows) {
        try {
            if (!this.isAuthenticated || !this.accessToken) {
                throw new Error('認証が必要です。先にGoogle認証を実行してください。');
            }

            const spreadsheetId = this.extractSpreadsheetId(spreadsheetUrl);
            const sheet = sheetName || 'Sheet1';
            
            // ヘッダー行とデータ行を結合
            const allRows = [
                headers, // ヘッダー行
                ...dataRows.map(row => headers.map(header => row[header] || '')) // データ行
            ];
            
            // 列名を生成する関数（A-Z, AA-ZZ, AAA-ZZZなどに対応）
            const getColumnName = (colIndex) => {
                let result = '';
                colIndex++; // 0ベースから1ベースに変換
                while (colIndex > 0) {
                    colIndex--;
                    result = String.fromCharCode(65 + (colIndex % 26)) + result;
                    colIndex = Math.floor(colIndex / 26);
                }
                return result;
            };
            
            // 範囲を指定（A1から始まり、データの行数と列数に基づいて範囲を決定）
            // シート名に特殊文字が含まれている場合はシングルクォートで囲む
            const columnCount = headers.length;
            const lastColumn = getColumnName(columnCount - 1); // 0ベースなので-1
            const rowCount = allRows.length;
            // シート名をシングルクォートで囲む（特殊文字やスペースを含む場合に対応）
            const range = `'${sheet}'!A1:${lastColumn}${rowCount}`;
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?valueInputOption=RAW`;
            
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    values: allRows
                })
            });

            if (!response.ok) {
                // レスポンスボディをテキストとして取得（JSON解析に失敗する場合があるため）
                const responseText = await response.clone().text().catch(() => '');
                let errorData = {};
                try {
                    errorData = JSON.parse(responseText);
                } catch (e) {
                    // JSON解析に失敗した場合は、テキストをそのまま使用
                    errorData = { error: { message: responseText } };
                }
                
                // 401エラー（認証エラー）の処理（エラーメッセージをより広く検索）
                const is401Error = response.status === 401 || errorData.error?.code === 401;
                const isUnauthorized = errorData.error?.status === 'UNAUTHENTICATED';
                // エラーメッセージを複数の場所から取得
                const authErrorMessage = errorData.error?.message || errorData.message || responseText || '';
                const fullAuthErrorMessage = authErrorMessage + ' ' + JSON.stringify(errorData);
                const hasInvalidAuth = authErrorMessage.includes('invalid authentication credentials') ||
                                      authErrorMessage.includes('invalid_token') ||
                                      authErrorMessage.includes('token expired') ||
                                      authErrorMessage.includes('Request had invalid authentication credentials') ||
                                      authErrorMessage.includes('Expected OAuth 2 access token') ||
                                      fullAuthErrorMessage.includes('invalid authentication credentials') ||
                                      fullAuthErrorMessage.includes('Expected OAuth 2 access token');
                
                console.log('エラーレスポンス解析:', {
                    status: response.status,
                    is401Error,
                    isUnauthorized,
                    hasInvalidAuth,
                    authErrorMessage,
                    fullAuthErrorMessage,
                    errorData,
                    responseText
                });
                
                // 認証エラーの場合、トークンをリフレッシュして再試行
                if (is401Error || isUnauthorized || hasInvalidAuth) {
                    try {
                        console.log('認証エラーを検出。トークンをリフレッシュします...', { is401Error, isUnauthorized, hasInvalidAuth, authErrorMessage, fullAuthErrorMessage });
                        await this.refreshAccessToken();
                        
                        // リフレッシュ後、元のリクエストを再実行
                        const retryResponse = await fetch(url, {
                            method: 'PUT',
                            headers: {
                                'Authorization': `Bearer ${this.accessToken}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                values: allRows
                            })
                        });
                        
                        if (retryResponse.ok) {
                            const retryResult = await retryResponse.json();
                            return {
                                success: true,
                                message: 'データを同期しました',
                                result: retryResult
                            };
                        }
                        
                        // 再試行後もエラーの場合は、通常のエラーハンドリングに進む
                        const retryErrorData = await retryResponse.json().catch(() => ({}));
                        throw new Error(`認証エラーが続いています。再認証が必要です: ${retryErrorData.error?.message || retryResponse.statusText}`);
                    } catch (refreshError) {
                        console.error('トークンリフレッシュエラー:', refreshError);
                        // リフレッシュに失敗した場合は、再認証を促す
                        throw new Error('認証の有効期限が切れました。再度ログインしてください。\n\n【解決方法】\n1. ダッシュボードで「Googleでログイン」ボタンをクリックしてください\n2. 認証後、再度お試しください');
                    }
                }
                
                // 403エラーまたはPERMISSION_DENIEDエラーの場合は常に詳細なメッセージを提供
                const is403Error = response.status === 403 || errorData.error?.code === 403;
                const isPermissionDenied = errorData.error?.status === 'PERMISSION_DENIED';
                const hasServiceDisabled = errorData.error?.details?.some(detail => 
                    detail.reason === 'SERVICE_DISABLED' || 
                    detail['@type']?.includes('ErrorInfo')
                );
                
                // 400エラー（INVALID_ARGUMENT）の処理
                const is400Error = response.status === 400 || errorData.error?.code === 400;
                const isInvalidArgument = errorData.error?.status === 'INVALID_ARGUMENT';
                const invalidArgErrorMessage = errorData.error?.message || responseText || '';
                
                if (is400Error || isInvalidArgument) {
                    let detailedMessage = '';
                    
                    // 範囲パースエラーの場合
                    if (invalidArgErrorMessage.includes('Unable to parse range') || invalidArgErrorMessage.includes('parse range')) {
                        detailedMessage = 'スプレッドシートの範囲指定エラーが発生しました。\n\n';
                        detailedMessage += '【原因】\n';
                        detailedMessage += 'スプレッドシートのシート名または範囲の指定に問題があります。\n\n';
                        detailedMessage += '【解決方法】\n';
                        detailedMessage += '1. スプレッドシートのシート名を確認してください\n';
                        detailedMessage += '   - シート名に特殊文字（/, ?, *, [, ], \\）が含まれていないか確認\n';
                        detailedMessage += '   - シート名にスペースが含まれている場合は、シート名を変更してください\n';
                        detailedMessage += '2. スプレッドシートのURLを確認してください\n';
                        detailedMessage += '   - 正しいスプレッドシートのURLが設定されているか確認\n';
                        detailedMessage += '   - スプレッドシートが削除されていないか確認\n';
                        detailedMessage += '3. アプリの設定画面で、スプレッドシートURLを再設定してください\n';
                        detailedMessage += '4. それでもエラーが続く場合は、スプレッドシートのシート名を「Sheet1」に変更してください\n';
                    } else {
                        // その他の400エラーの場合
                        detailedMessage = 'Google Sheets APIでエラーが発生しました。\n\n';
                        detailedMessage += '【エラー内容】\n';
                        detailedMessage += `${invalidArgErrorMessage}\n\n`;
                        detailedMessage += '【解決方法】\n';
                        detailedMessage += '1. スプレッドシートのURLが正しいか確認してください\n';
                        detailedMessage += '2. スプレッドシートへのアクセス権限があるか確認してください\n';
                        detailedMessage += '3. スプレッドシートが削除されていないか確認してください\n';
                        detailedMessage += '4. アプリの設定画面で、スプレッドシートURLを再設定してください\n';
                    }
                    
                    throw new Error(detailedMessage);
                }
                
                if (is403Error || isPermissionDenied || hasServiceDisabled) {
                    const errorDetails = errorData.error?.details || [];
                    
                    // プロジェクト番号とアクティベーションURLを抽出
                    let projectNumber = '';
                    let activationUrl = '';
                    
                    // エラーディテールからメタデータを取得
                    for (const detail of errorDetails) {
                        if (detail.metadata) {
                            const metadata = detail.metadata;
                            // containerInfoにプロジェクト番号が含まれている
                            if (metadata.containerInfo && !projectNumber) {
                                projectNumber = metadata.containerInfo;
                            }
                            // consumerにプロジェクト番号が含まれている（projects/509155102966形式）
                            if (metadata.consumer && !projectNumber) {
                                projectNumber = metadata.consumer.replace('projects/', '');
                            }
                            // activationUrlが含まれている
                            if (metadata.activationUrl && !activationUrl) {
                                activationUrl = metadata.activationUrl;
                            }
                            // その他のメタデータからプロジェクト番号を取得
                            if (!projectNumber) {
                                projectNumber = metadata['service.googleapis.com/project_number'] || '';
                            }
                        }
                    }
                    
                    // メタデータから取得できない場合は、エラーメッセージから抽出
                    if (!projectNumber) {
                        projectNumber = errorMessage.match(/project\s+(\d+)/i)?.[1] ||
                                      errorMessage.match(/project\s*(\d+)/i)?.[1] ||
                                      errorMessage.match(/(\d{12})/)?.[1] || '';
                    }
                    
                    if (!activationUrl) {
                        activationUrl = errorMessage.match(/https:\/\/console\.developers\.google\.com\/apis\/api\/sheets\.googleapis\.com\/overview\?project=\d+/)?.[0] || '';
                    }
                    
                    // 403エラーの場合は常に詳細メッセージを表示
                    // アクティベーションURLが取得できた場合は、それを含める
                    if (!activationUrl && projectNumber) {
                        activationUrl = `https://console.developers.google.com/apis/api/sheets.googleapis.com/overview?project=${projectNumber}`;
                    }
                    
                    let detailedMessage = 'Google Sheets APIが有効化されていません。';
                    
                    // アクティベーションURLを含める（フロントエンドで抽出できるように）
                    if (activationUrl) {
                        detailedMessage += ` ACTIVATION_URL:${activationUrl}`;
                    }
                    
                    detailedMessage += '\n\n【解決方法】\n';
                    
                    if (activationUrl) {
                        // アクティベーションURLが取得できた場合
                        detailedMessage += `1. 以下のURLをクリックしてGoogle Sheets APIを有効化してください:\n`;
                        detailedMessage += `   ${activationUrl}\n\n`;
                    } else {
                        // プロジェクト番号が取得できない場合
                        detailedMessage += `1. Google Cloud Console（https://console.cloud.google.com/）にアクセスしてください\n`;
                        detailedMessage += `2. プロジェクトを選択してください\n`;
                        detailedMessage += `3. 「APIとサービス」>「ライブラリ」を開いてください\n`;
                        detailedMessage += `4. 「Google Sheets API」を検索して「有効にする」をクリックしてください\n\n`;
                    }
                    
                    detailedMessage += '2. 有効化後、数分待ってから再度お試しください\n';
                    detailedMessage += '3. それでもエラーが続く場合は、ブラウザを再読み込みしてください';
                    throw new Error(detailedMessage);
                }
                
                throw new Error(`Google Sheets API error: ${response.statusText} - ${JSON.stringify(errorData)}`);
            }

            const result = await response.json();
            return {
                success: true,
                message: `データをスプレッドシートに反映しました（${dataRows.length}行）`,
                result: result
            };
        } catch (error) {
            console.error('Error syncing all data to spreadsheet:', error);
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

