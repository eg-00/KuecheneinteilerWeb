# 📚 GitHub Pages Deployment Guide

## Step-by-Step Tutorial: Publish Kücheneinteilung to GitHub Pages

This guide walks you through deploying the Kücheneinteilung Web app to GitHub Pages with automatic updates via GitHub Actions.

---

## Prerequisites

- GitHub account (free tier works fine)
- Git installed on your computer
- Node.js 18+ (for local testing)

---

## Step 1: Create a GitHub Repository

### 1.1 Go to GitHub
1. Open [https://github.com/new](https://github.com/new)
2. Sign in with your GitHub account

### 1.2 Create New Repository
1. **Repository name:** `KuecheneinteilerWeb`
2. **Description:** "Vue 3 kitchen duty assignment system with fair rotation algorithm"
3. **Visibility:** Select **Public** (required for free GitHub Pages)
4. **Initialize repository:** Leave unchecked (we'll push existing code)
5. Click **Create repository**

### 1.3 Copy Repository URL
After creation, you'll see the URL. Copy it (looks like: `https://github.com/YOUR_USERNAME/KuecheneinteilerWeb.git`)

---

## Step 2: Prepare Your Local Repository

### 2.1 Navigate to Project Directory
```bash
cd /Users/XXX/Documents/playground/KuecheneinteilerWeb
```

### 2.2 Verify Git is Initialized
```bash
git status
```
You should see output like:
```
On branch master

No commits yet
```

### 2.3 Add All Files
```bash
git add .
```

### 2.4 Create Initial Commit
```bash
git commit -m "Initial commit: Kücheneinteilung Web app with GitHub Pages setup"
```

### 2.5 Rename Branch to 'main'
```bash
git branch -M main
```

### 2.6 Add Remote Repository
Replace `YOUR_USERNAME` with your GitHub username:
```bash
git remote add origin https://github.com/YOUR_USERNAME/KuecheneinteilerWeb.git
```

### 2.7 Verify Remote
```bash
git remote -v
```
Should show:
```
origin  https://github.com/YOUR_USERNAME/KuecheneinteilerWeb.git (fetch)
origin  https://github.com/YOUR_USERNAME/KuecheneinteilerWeb.git (push)
```

---

## Step 3: Push Code to GitHub

### 3.1 Push to GitHub
```bash
git push -u origin main
```

You'll be prompted for authentication:
- **Username:** Your GitHub username
- **Password:** Use a Personal Access Token (PAT), not your password

### 3.2 Generate Personal Access Token (if needed)

If you get an authentication error:

1. Go to [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. Click **Generate new token (classic)**
3. **Token name:** `GitHub Pages Deployment`
4. **Expiration:** 90 days (or longer)
5. **Scopes:** Check `repo` (full control of private repositories)
6. Click **Generate token**
7. **Copy the token** (you won't see it again!)
8. Use this token as your password when pushing

### 3.3 Verify Push Success
Go to your GitHub repository URL and you should see all your files there.

---

## Step 4: Enable GitHub Pages

### 4.1 Go to Repository Settings
1. Open your repository on GitHub: `https://github.com/YOUR_USERNAME/KuecheneinteilerWeb`
2. Click **Settings** tab (top right)

### 4.2 Navigate to Pages Section
1. In the left sidebar, click **Pages**
2. You should see "GitHub Pages" section

### 4.3 Configure Pages
1. **Source:** Select "Deploy from a branch"
2. **Branch:** Select `gh-pages` and `/(root)`
3. **Enforce HTTPS:** Check (recommended)
4. Click **Save**

**Note:** The `gh-pages` branch will be created automatically by GitHub Actions on first deployment.

---

## Step 5: Verify GitHub Actions Workflow

### 5.1 Check Workflow Status
1. Go to your repository
2. Click **Actions** tab
3. You should see a workflow named "Deploy to GitHub Pages"
4. Wait for it to complete (usually 1-2 minutes)
5. Look for a green checkmark ✅ (success) or red ✗ (failed)

### 5.2 If Workflow Fails
1. Click on the failed workflow
2. Click the job name to see logs
3. Common issues:
   - **Node.js installation failed:** The server is temporarily down, wait 5 minutes and retry
   - **Build failed:** There's an error in the code (fix locally and push again)
   - **Deploy failed:** GitHub Pages permissions issue (contact GitHub support)

### 5.3 Monitor Deployment Progress
Look at the workflow steps:
1. ✅ **Checkout code** - Download your code
2. ✅ **Setup Node.js** - Install Node environment
3. ✅ **Install dependencies** - Install npm packages
4. ✅ **Build project** - Run `npm run build`
5. ✅ **Upload artifact** - Upload dist/ folder
6. ✅ **Deploy to GitHub Pages** - Publish to GitHub Pages

---

## Step 6: Access Your Deployed App

### 6.1 Your Deployment URL
Your app is now live at:
```
https://YOUR_USERNAME.github.io/KuecheneinteilerWeb/
```

Example:
```
https://john-doe.github.io/KuecheneinteilerWeb/
```

### 6.2 Test the App
1. Open the URL in your browser
2. Try loading example data: Click "📚 Beispieldaten"
3. Upload CSV files: Test the drag-drop upload
4. Export data: Test text, HTML, and CSV exports
5. Check localStorage: Refresh the page - data should persist
6. Test on mobile: Use browser's responsive design mode

### 6.3 Verify All Features Work
- [ ] Example data loads correctly
- [ ] CSV upload/download works
- [ ] Exports generate correctly
- [ ] localStorage persists data
- [ ] No console errors (F12 → Console tab)
- [ ] Responsive on mobile

---

## Step 7: Update Your Code

### 7.1 Make Local Changes
Make any code changes locally and test with:
```bash
npm run dev
```

### 7.2 Commit and Push
```bash
git add .
git commit -m "Your descriptive commit message"
git push origin main
```

### 7.3 Automatic Deployment
The GitHub Actions workflow will automatically:
1. Detect your push
2. Build the project
3. Deploy to GitHub Pages
4. Your changes go live in 1-2 minutes!

You can monitor the deployment in the **Actions** tab.

---

## Step 8: Share Your App

### 8.1 Add URL to README
Edit `README.md` and add:
```markdown
## Live Demo

🚀 **[Try Kücheneinteilung Online](https://YOUR_USERNAME.github.io/KuecheneinteilerWeb/)**

(Replace YOUR_USERNAME with your GitHub username)
```

### 8.2 Commit the Update
```bash
git add README.md
git commit -m "Add live demo link"
git push origin main
```

### 8.3 Share URL
Your app is now live and shareable! Send the URL to anyone who needs it.

---

## Troubleshooting

### Issue: 404 Error (Page Not Found)

**Cause:** GitHub Pages not properly configured

**Solution:**
1. Go to Settings → Pages
2. Verify source is set to `gh-pages` branch
3. Check that `/(root)` folder is selected
4. Wait 5 minutes for DNS propagation
5. Try in incognito/private browser

### Issue: Styles Not Loading (White Page)

**Cause:** Base path not configured correctly

**Solution:**
1. Verify `vite.config.ts` has: `base: '/KuecheneinteilerWeb/',`
2. Run `npm run build` locally
3. Check `dist/index.html` for correct paths
4. Push changes: `git push origin main`

### Issue: localStorage Not Working

**Cause:** App not persisting data between refreshes

**Solution:**
1. Open browser DevTools (F12)
2. Go to **Application** → **Local Storage**
3. Look for `kuecheneinteilung_data_v1` key
4. If empty: Try uploading data again
5. If storage quota exceeded: Clear other site data

### Issue: CSV Downloads Not Working

**Cause:** Relative paths issue

**Solution:**
1. Files should be in `public/` folder
2. Build should copy to `dist/`
3. Verify with: `ls dist/people_example.csv`
4. Rebuild and push if missing

### Issue: GitHub Actions Workflow Not Running

**Cause:** Not pushed to `main` branch or workflow file missing

**Solution:**
1. Verify you pushed to `main`: `git push origin main`
2. Check `.github/workflows/deploy.yml` exists in your repo
3. Check **Actions** tab for any errors
4. Try pushing again: `git push origin main`

---

## Advanced: Custom Domain (Optional)

If you want to use a custom domain (e.g., `kuecheneinteilung.example.com`):

1. Go to Settings → Pages
2. Under "Custom domain," enter your domain
3. Follow GitHub's DNS configuration instructions
4. Wait for DNS verification (usually 24 hours)

---

## Maintenance

### Keep Dependencies Updated
Every few months, update dependencies:
```bash
npm update
npm run build
git add package-lock.json
git commit -m "Update dependencies"
git push origin main
```

### Monitor Workflow Status
1. Check **Actions** tab regularly
2. If a workflow fails, fix the issue and push again
3. GitHub will automatically retry on push

### Backup Your Data
1. Your data is stored locally in browser localStorage
2. Export important data using the **Export** button
3. GitHub Pages hosting is free but can be discontinued
4. Keep a backup locally or on another service

---

## FAQ

**Q: Is this free?**  
A: Yes! GitHub Pages is completely free for public repositories.

**Q: How much data can I store?**  
A: Your Git repository is limited to ~100 GB. Data is stored in browser localStorage (~5-10 MB).

**Q: Can I use a private repository?**  
A: Only if you upgrade to GitHub Pro ($4/month). Public repos are free.

**Q: What if I need to delete the site?**  
A: Go to Settings → General → Danger Zone → Delete this repository.

**Q: Can I have multiple sites?**  
A: Yes! Create multiple repositories. Each gets its own GitHub Pages site.

**Q: How long until changes go live?**  
A: Usually 1-2 minutes after push. Check **Actions** tab to monitor.

---

## Next Steps

1. ✅ Create GitHub repository
2. ✅ Push code to GitHub
3. ✅ Enable GitHub Pages
4. ✅ Test your live app
5. ✅ Share with others!

**Your app is now deployed! 🎉**

For issues or questions, check the [GitHub Pages documentation](https://docs.github.com/en/pages).
