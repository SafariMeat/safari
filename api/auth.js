// Step 1 of the GitHub OAuth handshake for Decap CMS.
// Decap opens a popup pointed at this endpoint when someone clicks
// "Login with GitHub" on /admin/. It redirects them into GitHub's own
// authorization screen.
export default function handler(req, res) {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  const host = req.headers.host;
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const redirectUri = `${protocol}://${host}/api/callback`;

  const authUrl =
    `https://github.com/login/oauth/authorize` +
    `?client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=repo,user`;

  res.writeHead(302, { Location: authUrl });
  res.end();
}
