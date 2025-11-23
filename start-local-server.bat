@echo off
echo AppNavi ローカルサーバーを起動しています...
echo.
echo ブラウザで以下のURLを開いてください:
echo http://localhost:8000
echo.
echo サーバーを停止するには、Ctrl+C を押してください
echo.

REM Python 3がインストールされているか確認
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo Python 3を使用してサーバーを起動します...
    python -m http.server 8000
) else (
    REM Node.jsがインストールされているか確認
    node --version >nul 2>&1
    if %errorlevel% == 0 (
        echo Node.jsを使用してサーバーを起動します...
        npx serve -p 8000
    ) else (
        echo エラー: Python 3またはNode.jsがインストールされていません。
        echo.
        echo 以下のいずれかをインストールしてください:
        echo - Python 3: https://www.python.org/downloads/
        echo - Node.js: https://nodejs.org/
        pause
    )
)


