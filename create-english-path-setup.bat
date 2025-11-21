@echo off
chcp 65001 > nul
echo ====================================
echo AppNavi - Setup in English Path
echo ====================================
echo.

set "ENGLISH_PATH=C:\Users\tsuba\OneDrive\Documents\Github-make\AppNavi"

echo Creating directory structure...
if not exist "%ENGLISH_PATH%" (
    mkdir "%ENGLISH_PATH%"
    echo Created: %ENGLISH_PATH%
) else (
    echo Directory already exists: %ENGLISH_PATH%
)

echo.
echo ====================================
echo Directory created successfully!
echo.
echo Please manually copy all files from:
echo %~dp0
echo.
echo To:
echo %ENGLISH_PATH%
echo.
echo Then navigate to the new directory and run Git commands.
echo ====================================
pause

