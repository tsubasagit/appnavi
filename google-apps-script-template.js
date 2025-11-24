// Google Apps Script テンプレート
// このスクリプトをスプレッドシートに追加することで、AppNaviから認証不要でデータを書き込めます
//
// 使い方:
// 1. スプレッドシートを開く
// 2. 拡張機能 > Apps Script をクリック
// 3. このコードをコピー&ペースト
// 4. 「デプロイ」>「新しいデプロイ」をクリック
// 5. 種類の選択で「ウェブアプリ」を選択
// 6. 説明を入力して「デプロイ」をクリック
// 7. 表示されたURLをコピーして、AppNaviの設定に貼り付け

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    if (data.action === 'append') {
      // 新しい行を追加
      const row = data.values || [];
      sheet.appendRow(row);
      return ContentService.createTextOutput(JSON.stringify({success: true, message: 'データを追加しました'}))
        .setMimeType(ContentService.MimeType.JSON);
    } else if (data.action === 'update') {
      // 行を更新
      const rowIndex = data.rowIndex;
      const values = data.values || [];
      if (rowIndex && rowIndex > 0) {
        sheet.getRange(rowIndex, 1, 1, values.length).setValues([values]);
        return ContentService.createTextOutput(JSON.stringify({success: true, message: 'データを更新しました'}))
          .setMimeType(ContentService.MimeType.JSON);
      }
    } else if (data.action === 'delete') {
      // 行を削除
      const rowIndex = data.rowIndex;
      if (rowIndex && rowIndex > 0) {
        sheet.deleteRow(rowIndex);
        return ContentService.createTextOutput(JSON.stringify({success: true, message: 'データを削除しました'}))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({success: false, message: '不明なアクション'}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({success: false, message: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({success: true, message: 'Google Apps Script is running'}))
    .setMimeType(ContentService.MimeType.JSON);
}

