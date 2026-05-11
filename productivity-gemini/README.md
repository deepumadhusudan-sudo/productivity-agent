# Productivity Assistant — Powered by Google Gemini (Free!)

No credit card. No paid API. 100% free.

---

## STEP 1 — Get your FREE Gemini API Key (2 minutes)

1. Go to: https://aistudio.google.com
2. Sign in with your Google account
3. Click "Get API Key" → "Create API Key"
4. Copy the key (looks like: AIzaSy...)

---

## STEP 2 — Put this project on GitHub (3 minutes)

1. Go to https://github.com and sign up (free)
2. Click "+" → "New repository"
3. Name it: productivity-agent
4. Click "Create repository"
5. Click "uploading an existing file"
6. Drag and drop ALL these files (keep the folder structure!)
7. Click "Commit changes"

---

## STEP 3 — Deploy on Netlify (2 minutes)

1. Go to https://netlify.com and sign up (free, use Google)
2. Click "Add new site" → "Import an existing project"
3. Click "GitHub" → authorize → select "productivity-agent"
4. Leave all settings as-is (netlify.toml handles everything)
5. Click "Deploy site"

---

## STEP 4 — Add your Gemini API Key (1 minute)

1. In Netlify, go to your site
2. Click "Site configuration" → "Environment variables"
3. Click "Add a variable":
   - Key:   GEMINI_API_KEY
   - Value: AIzaSy... (your key from Step 1)
4. Click "Save"
5. Go to "Deploys" → "Trigger deploy" → "Deploy site"

---

## Done! 🎉

Your app is live at a URL like: https://your-app-name.netlify.app
Share it with anyone — it's completely free to use!

---

## How it works
User types → Netlify Function adds your secret key → Gemini AI responds
Your API key is NEVER visible to users.
