# GitHub Deployment Instructions

## Manual Deployment Steps

If you encounter issues with the automated script, please follow these steps manually:

### 1. Open Command Prompt or Git Bash

Navigate to the project directory:
```bash
cd "C:\Users\tsuba\OneDrive\ドキュメント\Github-make\Cursor-OpenDX"
```

Or use Git Bash (recommended for Japanese paths):
```bash
cd "/c/Users/tsuba/OneDrive/ドキュメント/Github-make/Cursor-OpenDX"
```

### 2. Initialize Git Repository (if not already done)

```bash
git init
```

### 3. Add All Files

```bash
git add .
```

### 4. Create Initial Commit

```bash
git commit -m "Initial commit: AppNavi - Excel to Web App tool"
```

### 5. Set Branch to Main

```bash
git branch -M main
```

### 6. Add Remote Repository

```bash
git remote add origin https://github.com/tsubasagit/appnavi.git
```

If remote already exists, remove it first:
```bash
git remote remove origin
git remote add origin https://github.com/tsubasagit/appnavi.git
```

### 7. Push to GitHub

```bash
git push -u origin main
```

You will be prompted for your GitHub username and password/token.

### Alternative: Using Personal Access Token

If you have two-factor authentication enabled, use a Personal Access Token:

1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Generate a new token with `repo` scope
3. Use the token as your password when pushing

### Troubleshooting

#### If you get "fatal: could not read Username"

Use this format for remote URL:
```bash
git remote set-url origin https://YOUR_USERNAME@github.com/tsubasagit/appnavi.git
```

#### If you get authentication errors

Try using SSH instead:
```bash
git remote set-url origin git@github.com:tsubasagit/appnavi.git
```

Make sure you have SSH keys set up with GitHub.

#### Using the Batch Script

Double-click `deploy-to-github.bat` in Windows Explorer to run the automated deployment script.

