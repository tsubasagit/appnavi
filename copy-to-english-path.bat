@echo off
chcp 65001 > nul
echo ====================================
echo AppNavi - Copy to English Path
echo ====================================
echo.

set "TARGET_DIR=C:\Users\tsuba\OneDrive\Documents\Github-make\AppNavi"

echo Creating target directory: %TARGET_DIR%
if not exist "%TARGET_DIR%" (
    mkdir "%TARGET_DIR%"
    echo Directory created.
) else (
    echo Directory already exists.
)

echo.
echo Copying files...
echo Please wait...

REM Copy all files except .git
for %%F in (*.*) do (
    if not exist "%TARGET_DIR%\%%F" (
        copy "%%F" "%TARGET_DIR%\" >nul
    )
)

REM Copy subdirectories (excluding .git)
for /D %%D in (*) do (
    if /I not "%%D"==".git" (
        if not exist "%TARGET_DIR%\%%D" (
            xcopy "%%D" "%TARGET_DIR%\%%D\" /E /I /Y >nul
        )
    )
)

echo.
echo ====================================
echo Files copied successfully!
echo.
echo Target location: %TARGET_DIR%
echo.
echo Next steps:
echo 1. Open Git Bash in the new folder
echo 2. Run the following commands:
echo.
echo    cd "%TARGET_DIR%"
echo    git init
echo    git add .
echo    git commit -m "Initial commit: AppNavi - Excel to Web App tool"
echo    git branch -M main
echo    git remote add origin https://github.com/tsubasagit/appnavi.git
echo    git push -u origin main
echo.
echo ====================================
pause

