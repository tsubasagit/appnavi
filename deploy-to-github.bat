@echo off
chcp 65001 > nul
cd /d "%~dp0"

echo ====================================
echo AppNavi - GitHub Deployment Script
echo ====================================
echo.

echo [1/5] Adding files to Git...
git add .
if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to add files
    pause
    exit /b 1
)

echo [2/5] Committing changes...
git commit -m "Initial commit: AppNavi - Excel to Web App tool"
if %ERRORLEVEL% NEQ 0 (
    echo Warning: Commit failed or no changes to commit
)

echo [3/5] Setting branch to main...
git branch -M main

echo [4/5] Adding remote origin...
git remote remove origin 2>nul
git remote add origin https://github.com/tsubasagit/appnavi.git

echo [5/5] Pushing to GitHub...
echo Please enter your GitHub credentials when prompted.
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ====================================
    echo Success! Code pushed to GitHub
    echo Repository: https://github.com/tsubasagit/appnavi
    echo ====================================
) else (
    echo.
    echo ====================================
    echo Error: Failed to push to GitHub
    echo Please check your credentials and try again
    echo ====================================
)

pause

