# Deployment Guide for Ash Behavior Tracker

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `ash-behavior-tracker`
3. Description: `Privacy-first behavior tracking for children with autism and developmental delays`
4. Public or Private: Choose your preference (Public recommended for portfolio)
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## Step 2: Push to GitHub

GitHub will show you commands. Use these instead (already configured):

```bash
git remote add origin https://github.com/creativcreature/ash-behavior-tracker.git
git branch -M main
git push -u origin main
```

If you have SSH keys set up, use:
```bash
git remote add origin git@github.com:creativcreature/ash-behavior-tracker.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

### Option A: Via Vercel Website (Recommended)

1. Go to https://vercel.com/new
2. Sign in with GitHub
3. Click "Import Project"
4. Find `creativcreature/ash-behavior-tracker`
5. Click "Import"
6. Configuration will auto-detect:
   - Framework Preset: **Next.js**
   - Build Command: `next build` ✓
   - Output Directory: `.next` ✓
   - Install Command: `npm install` ✓
7. Click "Deploy"
8. Wait ~2 minutes ⏱️
9. Get your live URL: `https://ash-behavior-tracker.vercel.app`

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - What's your project name? ash-behavior-tracker
# - In which directory is your code located? ./
# - Want to override settings? No

# Production deployment
vercel --prod
```

## Step 4: Verify Deployment

Once deployed, test these features:

1. ✅ Create a child profile
2. ✅ Log a behavior (Quick Mode)
3. ✅ View dashboard stats
4. ✅ Check insights/charts
5. ✅ Export CSV file
6. ✅ Test on mobile device
7. ✅ Test keyboard navigation

## Environment Variables

None required for MVP! Everything runs client-side.

## Custom Domain (Optional)

In Vercel dashboard:
1. Go to your project settings
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration steps

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Run `npm run build` locally first
- Ensure all dependencies are in package.json

### Database Issues
- IndexedDB only works in browser (not during build)
- All database code is client-side only

### Performance
- First load is optimized (static generation)
- Charts lazy load on demand
- IndexedDB operations are async

## Success Metrics

After deployment, you should see:
- ✅ Lighthouse Performance: 90+
- ✅ Lighthouse Accessibility: 95+
- ✅ First Contentful Paint: < 1.5s
- ✅ Time to Interactive: < 3s

## Next Steps

1. Share the URL with beta testers
2. Gather feedback
3. Monitor Vercel analytics
4. Plan Phase 2 features

---

**Your app will be live at:**
`https://ash-behavior-tracker.vercel.app`

(or your custom domain)
