# Blog CMS (Keystatic) setup

Admin lives at /keystatic. Every save is a commit to `main`, so Vercel redeploys
automatically. Uploaded cover images are committed to `public/blog/`.

## 1. Add the files
Copy the files from this package into the repo at the same paths, then run:

    npm install @keystatic/core @keystatic/next

Only one existing file changes: `lib/reference/articles.ts` (one line).
`lib/reference/articles.json` is the same content wrapped in `{ "articles": [ ... ] }`
with each article's slug inside it (this rewrites the whole file once in git).
No component or CSS changes: `cover` was already supported by the site.

## 2. Try it locally
    npm run dev
Open http://localhost:3000/keystatic, edit an article, upload a cover, save.
Check that it shows on /blog and the article page.

## 3. Create the GitHub app (one time)
    KEYSTATIC_STORAGE=github npm run dev
Open http://localhost:3000/keystatic and follow the setup prompts. It creates a
GitHub app and saves 4 values to `.env.local`. Then in GitHub > Settings >
Developer settings > GitHub Apps > your app, add this callback URL:

    https://hisabkitabnepal.com.np/api/keystatic/github/oauth/callback

and make sure the app is installed on hisabkitabnepal/hisabkitab-site.

## 4. Vercel environment variables (Production)
    KEYSTATIC_GITHUB_CLIENT_ID
    KEYSTATIC_GITHUB_CLIENT_SECRET
    KEYSTATIC_SECRET
    NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG
Redeploy, then open https://hisabkitabnepal.com.np/keystatic and sign in with GitHub.
Until these are set, the admin API returns 404 and the site builds normally.

## Owner workflow
1. Go to /keystatic > Blog articles.
2. Add a new article at the bottom of the list (first three are the featured ones).
3. Upload a cover (landscape ~1600x900, under 500 KB), or leave it empty for the gradient.
4. Save. Live after the Vercel deploy finishes (about a minute).

The owner needs write access to the GitHub repo (add them as a collaborator).
