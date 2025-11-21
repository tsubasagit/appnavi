# GitHub Pages Setup Instructions

## Quick Setup (Recommended)

1. Go to your GitHub repository: https://github.com/tsubasagit/appnavi
2. Click on **Settings** tab
3. Scroll down to **Pages** section in the left sidebar
4. Under **Source**, select:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **Save**
6. Wait a few minutes for GitHub Pages to build
7. Your app will be available at: `https://tsubasagit.github.io/appnavi/`

## Alternative: Using GitHub Actions (Automatic)

If you want automatic deployment on every push, you can use GitHub Actions (see `.github/workflows/deploy.yml` if created).

## Notes

- The `.nojekyll` file has been added to disable Jekyll processing
- The app entry point is `index.html` which is already in the root directory
- Changes may take a few minutes to appear after pushing to GitHub

## Troubleshooting

### Page not loading?
- Check if GitHub Pages is enabled in Settings > Pages
- Verify the branch is set to `main` and folder is `/ (root)`
- Wait 5-10 minutes after enabling for the first time

### 404 errors?
- Make sure `index.html` exists in the root directory
- Check that the file paths in your HTML are relative (not absolute)
- Verify `.nojekyll` file exists in the root

### Custom Domain (Optional)

If you want to use a custom domain:
1. Add a `CNAME` file to the root with your domain name
2. Configure DNS settings for your domain
3. Enable custom domain in GitHub Pages settings

