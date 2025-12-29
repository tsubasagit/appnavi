# フォルダ名変更手順

ローカルのフォルダ名を `Cursor-OpenDX` から `Cursor-AppNavi` に変更する手順：

## 方法1: フォルダ名を直接変更（推奨）

1. 現在のプロジェクトフォルダを閉じる（エディタやターミナルを閉じる）
2. エクスプローラーで `C:\Users\tsuba\dev\` に移動
3. `Cursor-OpenDX` フォルダを右クリック → 「名前の変更」
4. `Cursor-AppNavi` に変更
5. 新しいフォルダ名でプロジェクトを再度開く

## 方法2: 新しい場所にクローン

```powershell
# 現在のディレクトリから移動
cd C:\Users\tsuba\dev

# 新しいフォルダ名でクローン
git clone https://github.com/tsubasagit/appnavi.git Cursor-AppNavi

# 新しいフォルダに移動
cd Cursor-AppNavi

# 依存関係をインストール
npm install
```

## 注意事項

- フォルダ名の変更は、プロジェクトの動作には影響しません
- Gitリポジトリの設定やリモートURLは変更されません
- エディタ（Cursor）でプロジェクトを再度開く必要があります

