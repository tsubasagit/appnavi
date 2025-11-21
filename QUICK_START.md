# Quick Start - Move to English Path and Deploy

## Step 1: Copy Files to English Path

**Option A: Use Windows Explorer (Easiest)**
1. Create folder: `C:\Users\tsuba\OneDrive\Documents\Github-make\AppNavi`
2. Copy all files from current folder to the new folder
3. Skip the `.git` folder if it exists

**Option B: Use Batch Script**
1. Double-click `copy-to-english-path.bat`
2. Wait for files to copy

## Step 2: Deploy to GitHub

**Using Git Bash (Recommended):**

1. Right-click in the new folder: `C:\Users\tsuba\OneDrive\Documents\Github-make\AppNavi`
2. Select "Git Bash Here"
3. Run these commands:

```bash
git init
git add .
git commit -m "Initial commit: AppNavi - Excel to Web App tool"
git branch -M main
git remote add origin https://github.com/tsubasagit/appnavi.git
git push -u origin main
```

**Using Command Prompt:**

1. Open CMD
2. Navigate to: `cd C:\Users\tsuba\OneDrive\Documents\Github-make\AppNavi`
3. Run the same git commands as above

## Step 3: Authenticate

When prompted:
- Username: Your GitHub username
- Password: Your GitHub Personal Access Token (create at: https://github.com/settings/tokens)

## That's it!

Your code is now on GitHub at: https://github.com/tsubasagit/appnavi

