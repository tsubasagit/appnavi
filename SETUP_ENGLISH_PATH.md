# Setup in English Path - Quick Guide

## Option 1: Use Migration Script (Easiest)

1. Double-click `migrate-to-english-path.bat` in the current folder
2. Follow the on-screen instructions
3. Navigate to the new folder and run `deploy-to-github.bat`

## Option 2: Manual Copy (Recommended)

### Step 1: Create New Folder

Create this folder in Windows Explorer:
```
C:\Users\tsuba\OneDrive\Documents\Github-make\AppNavi
```

### Step 2: Copy All Files

Copy all files from current folder to the new folder:
- Select all files (Ctrl+A)
- Copy (Ctrl+C)
- Paste into new folder (Ctrl+V)

**Exclude these folders** (don't copy):
- `.git` folder (if exists)

### Step 3: Open Git Bash in New Folder

1. Right-click in the new folder
2. Select "Git Bash Here"

### Step 4: Run Git Commands

In Git Bash, run:

```bash
git init
git add .
git commit -m "Initial commit: AppNavi - Excel to Web App tool"
git branch -M main
git remote add origin https://github.com/tsubasagit/appnavi.git
git push -u origin main
```

### Step 5: Enter GitHub Credentials

When prompted, enter:
- Username: your GitHub username
- Password: your GitHub personal access token (not password if 2FA enabled)

## Option 3: Use Command Prompt

1. Open Command Prompt (CMD)
2. Run these commands:

```cmd
mkdir C:\Users\tsuba\OneDrive\Documents\Github-make\AppNavi
xcopy /E /I /Y "%~dp0*" "C:\Users\tsuba\OneDrive\Documents\Github-make\AppNavi\"
cd C:\Users\tsuba\OneDrive\Documents\Github-make\AppNavi
git init
git add .
git commit -m "Initial commit: AppNavi - Excel to Web App tool"
git branch -M main
git remote add origin https://github.com/tsubasagit/appnavi.git
git push -u origin main
```

## Notes

- After migration, you can delete the old Japanese path folder
- The new path is: `C:\Users\tsuba\OneDrive\Documents\Github-make\AppNavi`
- All future development should use the English path folder

