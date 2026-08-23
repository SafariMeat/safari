// Step 2 of the GitHub OAuth handshake for Decap CMS.
// GitHub redirects back here with a one-time `code` after the admin
// approves access. This exchanges that code for an access token, then
// hands the token back to the /admin/ popup's opener window via
// postMessage — this exact message format/handshake is what Decap CMS
// expects from any custom OAuth provider, regardless of host.
export default async function handler(req, res) {
  const { code, error, error_description: errorDescription } = req.query;

  if (error) {
    res.status(401).send(`Authorization failed: ${errorDescription || error}`);
    return;
  }

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.OAUTH_GITHUB_CLIENT_ID,
        client_secret: process.env.OAUTH_GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      res.status(401).send(`Error: ${tokenData.error_description}`);
      return;
    }

    const payload = { token: tokenData.access_token, provider: 'github' };

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(`
      <!doctype html>
      <html><body>
      <script>
        (function() {
          function receiveMessage(e) {
            window.opener.postMessage(
              'authorization:github:success:${JSON.stringify(payload)}',
              e.origin
            );
            window.removeEventListener('message', receiveMessage, false);
          }
          window.addEventListener('message', receiveMessage, false);
          window.opener.postMessage('authorizing:github', '*');
        })();
      </script>
      </body></html>
    `);
  } catch (err) {
    res.status(500).send('Something went wrong during authentication.');
  }
}
