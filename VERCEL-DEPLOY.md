# Deploy Manifest Texas to Vercel

This folder is ready to deploy as a static website. No build command or framework is required.

## Recommended: GitHub and Vercel

1. Create a free account at https://github.com/signup if you do not already have one.
2. Go to https://github.com/new and create a repository named `manifest-texas`.
3. On the repository page, choose **uploading an existing file**.
4. Open the unzipped `manifest-texas-vercel` folder on your computer.
5. Drag all files and folders inside it into GitHub. Upload the contents, not the outer folder.
6. Commit the files.
7. Go to https://vercel.com/new and sign in.
8. Choose **Import Git Repository**, select `manifest-texas`, then choose **Import**.
9. Leave Framework Preset as **Other**.
10. Leave Build Command and Output Directory blank.
11. Choose **Deploy**.

## Connect a Squarespace-owned domain

1. In Vercel, open the deployed project.
2. Open **Settings → Domains**.
3. Add `manifesttexas.com`, then also add `www.manifesttexas.com`.
4. Vercel will show the DNS records it needs.
5. In Squarespace, open the Domains dashboard, select the domain, then open **DNS**.
6. Replace only the website-hosting A/CNAME records with the values Vercel provides.
7. Do not delete MX records. They control business email.
8. Return to Vercel and wait for both domains to show as valid.
9. Set the preferred domain as primary and redirect the other version to it.

Squarespace explains how to edit a Squarespace-managed domain’s records at:
https://support.squarespace.com/hc/en-us/articles/360002101888-Edit-your-domain-s-DNS-records

## Future updates

Edit or replace files in the GitHub repository and commit them. Vercel will deploy the update automatically.
