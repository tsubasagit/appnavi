# Migrate to English Path - Instructions

## Step 1: Create New English Path Directory

Open Command Prompt or PowerShell and run:

```powershell
mkdir C:\Users\tsuba\OneDrive\Documents\Github-make\AppNavi
```

Or manually create the folder:
`C:\Users\tsuba\OneDrive\Documents\Github-make\AppNavi`

## Step 2: Copy All Files

Copy all files from:
`C:\Users\tsuba\OneDrive\ドキュメント\Github-make\Cursor-OpenDX`

To:
`C:\Users\tsuba\OneDrive\Documents\Github-make\AppNavi`

You can do this by:
- Using Windows Explorer to copy-paste all files
- Or using the command line:

```powershell
xcopy "C:\Users\tsuba\OneDrive\ドキュメント\Github-make\Cursor-OpenDX\*" "C:\Users\tsuba\OneDrive\Documents\Github-make\AppNavi\" /E /I /Y
```

## Step 3: Navigate to New Directory

```powershell
cd C:\Users\tsuba\OneDrive\Documents\Github-make\AppNavi
```

## Step 4: Initialize Git and Deploy

```powershell
git init
git add .
git commit -m "Initial commit: AppNavi - Excel to Web App tool"
git branch -M main
git remote add origin https://github.com/tsubasagit/appnavi.git
git push -u origin main
```

## Alternative: Use Git Bash

Git Bash handles Japanese paths better:

```bash
cd "/c/Users/tsuba/OneDrive/Documents/Github-make/AppNavi"
git init
git add .
git commit -m "Initial commit: AppNavi - Excel to Web App tool"
git branch -M main
git remote add origin https://github.com/tsubasagit/appnavi.git
git push -u origin main
```

