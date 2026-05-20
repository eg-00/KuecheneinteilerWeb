# 🚀 Quick Start: Deploy to GitHub Pages in 5 Minutes

Don't have time for the full guide? Here's the fastest way to get your app live:

## Prerequisites
- GitHub account (free)
- Git installed

## Step 1: Create GitHub Repo (1 min)
```bash
# Go to https://github.com/new
# Name it: KuecheneinteilerWeb
# Make it PUBLIC
# Click "Create repository"
```

## Step 2: Push Your Code (2 min)
```bash
cd /Users/XXX/Documents/playground/KuecheneinteilerWeb

git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/KuecheneinteilerWeb.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username!

## Step 3: Enable GitHub Pages (1 min)
1. Go to your repo on GitHub
2. Click **Settings** → **Pages**
3. Under "Build and deployment"
   - Source: Select "Deploy from a branch"
   - Branch: Select `gh-pages` (it will appear after first deploy)
   - Folder: Select `/(root)`
4. Click **Save**

## Step 4: Wait for Deployment (1-2 min)
1. Click **Actions** tab
2. Wait for the "Deploy to GitHub Pages" workflow to finish
3. You'll see a green checkmark ✅ when done

## Step 5: Visit Your App! 
```
https://YOUR_USERNAME.github.io/KuecheneinteilerWeb/
```

---

## Common Issues

**404 Error?**
- Wait 5 minutes (DNS propagation)
- Try in incognito mode
- Make sure `gh-pages` branch is selected in Settings → Pages

**Styles not loading?**
- This is normal - takes 1-2 minutes to deploy
- Refresh the page (Ctrl+F5 or Cmd+Shift+R)
- Check Actions tab to see if workflow passed

**How do I update my app?**
```bash
git add .
git commit -m "Your changes"
git push origin main
```
Your app updates automatically in 1-2 minutes!

---

👉 **Need more help?** See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for the full tutorial.
