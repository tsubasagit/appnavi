@echo off
chcp 65001 > nul
echo ====================================
echo AppNavi - Migrate to English Path
echo ====================================
echo.

set "SOURCE_DIR=%~dp0"
set "TARGET_DIR=C:\Users\tsuba\OneDrive\Documents\Github-make\AppNavi"

echo Source: %SOURCE_DIR%
echo Target: %TARGET_DIR%
echo.

echo Creating target directory...
if not exist "%TARGET_DIR%" (
    mkdir "%TARGET_DIR%"
    echo Directory created.
) else (
    echo Directory already exists.
)

echo.
echo Copying files...
echo Excluding .git folder...
xcopy "%SOURCE_DIR%*" "%TARGET_DIR%\" /E /I /Y /EXCLUDE:%TEMP%\xcopy-exclude.txt
if %ERRORLEVEL% GEQ 1 (
    echo Warning: Some files may not have been copied. Continuing...
)

REM Create exclude file for .git
echo .git> %TEMP%\xcopy-exclude.txt
echo .git\>> %TEMP%\xcopy-exclude.txt

echo.
echo ====================================
echo Migration complete!
echo.
echo Next steps:
echo 1. Navigate to: %TARGET_DIR%
echo 2. Run: deploy-to-github.bat
echo.
echo Or use Git Bash:
echo cd "%TARGET_DIR%"
echo git init
echo git add .
echo git commit -m "Initial commit: AppNavi - Excel to Web App tool"
echo git branch -M main
echo git remote add origin https://github.com/tsubasagit/appnavi.git
echo git push -u origin main
echo ====================================
pause

