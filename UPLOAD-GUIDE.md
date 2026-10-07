# Replace the old website on GitHub and Vercel

This folder is the complete Vercel website. It includes the latest consultation navigation fix, email submission, formatted emails and WhatsApp alternative. Do not upload the ZIP itself. Extract it and use its contents.

## Replace in one commit with GitHub Desktop

1. In GitHub Desktop, choose File > Clone repository and select hisabkitabnepal/hisabkitab-site. Use the main branch.
2. Choose Repository > Show in Explorer.
3. Move the existing website files into a backup folder outside the repository. Preserve the .git folder. Do not delete the GitHub repository or Vercel project.
4. Put all files and folders from this extracted package directly in the cloned repository. Do not place an extra Hisab-Kitab-Latest-Vercel folder inside the repository.
5. GitHub Desktop should show both the old files being removed and the new files being added. Commit with the summary "Replace old website with latest Hisab Kitab site", then click Push origin.

The old website files visible in your screenshot are about.html, audit.html, business-registration.html, consulting.html, contact.html, index.html, services.html, style.css and tax-filing.html. Any old website assets or CSS folders also belong in the backup rather than in the new app. Preserve unrelated repository automation if it exists.

## Vercel settings

Use the existing hisabkitab-site project and custom domain. Set Framework Preset to Next.js, Root Directory to the repository root, Build Command to npm run build and Output Directory to the Next.js default. Remove any old output-directory override. The package includes vercel.json declaring Next.js.

The new commit on main should trigger deployment. In the deployment details, check that it uses the new commit rather than the old September 15 commit 944562d.

## Direct inquiry email

In Production environment variables, set RESEND_API_KEY to your private key and INQUIRY_FROM_EMAIL to a sender at your verified Resend domain. Example sender: Hisab Kitab <inquiries@hisabkitabnepal.com.np>. The recipient is hisabkitabnepal@outlook.com. Never add the key to GitHub or the website source files.

The form checks whether these variables exist. Email submission becomes available when both are configured. Resend still needs the sender domain to be verified. A confirmation means the provider accepted delivery, not a guarantee of inbox placement. After deployment, submit a real inquiry and check Outlook, including Junk.

These variables configure the Vercel website. The separate ChatGPT preview uses separate hosting settings.
