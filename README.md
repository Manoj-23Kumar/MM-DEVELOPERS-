# MM DEVELOPERS — Production Starter

Architecture:
Browser → MM DEVELOPERS → Express/Node API → MongoDB Atlas

## Deploy
1. Create a MongoDB Atlas database and copy its connection string.
2. Push this folder to GitHub.
3. Deploy `backend` as a Node web service on Render (or another Node host).
4. Add environment variable `MONGODB_URI` on the host.
5. The backend serves the frontend, so the public service URL becomes the website URL.
6. Add a custom domain such as `mmdevelopers.in` after the service is live.
7. For Google search, add the domain to Google Search Console and submit a sitemap/robots configuration.

Never put the MongoDB password in frontend code or commit `.env`.
