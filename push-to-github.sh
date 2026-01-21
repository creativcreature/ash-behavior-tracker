#!/bin/bash
echo "🚀 Pushing Ash Behavior Tracker to GitHub..."
echo ""

# Add GitHub remote
git remote add origin https://github.com/creativcreature/ash-behavior-tracker.git

# Push to main branch
git branch -M main
git push -u origin main

echo ""
echo "✅ Code pushed to GitHub!"
echo "📍 Repository: https://github.com/creativcreature/ash-behavior-tracker"
echo ""
echo "🌐 Next: Deploy to Vercel at https://vercel.com/new"
