/**
 * Auto-login callback - Cloudflare Function
 *
 * Receives auth data via URL hash from the activation page on saabuildingblocks.com,
 * stores it in localStorage, and redirects to /agent-portal.
 *
 * This is a Cloudflare Function (NOT Next.js) so it bypasses the PWA service worker cache.
 */
export async function onRequestGet() {
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Signing you in...</title>
  <style>
    body { background: #000; color: #e5e4dd; font-family: sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
    .container { text-align: center; }
    .spinner { width: 40px; height: 40px; border: 3px solid rgba(255,215,0,0.3); border-top-color: #ffd700; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="container">
    <div class="spinner"></div>
    <p>Signing you in...</p>
  </div>
  <script>
    try {
      var hash = window.location.hash;
      if (hash && hash.indexOf('#auth=') === 0) {
        var payload = JSON.parse(atob(hash.slice(6)));
        if (payload.access_token && payload.user) {
          var u = payload.user;
          var userData = {
            id: u.id,
            email: u.email,
            username: u.username,
            firstName: u.first_name || (u.fullName ? u.fullName.split(' ')[0] : ''),
            lastName: u.last_name || (u.fullName ? u.fullName.split(' ').slice(1).join(' ') : ''),
            fullName: u.fullName || u.full_name || ((u.first_name || '') + ' ' + (u.last_name || '')).trim(),
            role: u.role,
            profilePictureUrl: u.profile_picture_url || null,
            gender: u.gender || 'male',
            isLeader: u.is_leader || false,
            state: u.state || null
          };
          localStorage.setItem('agent_portal_user', JSON.stringify(userData));
          localStorage.setItem('agent_portal_token', payload.access_token);
          window.location.replace('/agent-portal');
        } else {
          window.location.replace('/agent-portal/login?activated=true');
        }
      } else {
        window.location.replace('/agent-portal/login');
      }
    } catch (e) {
      window.location.replace('/agent-portal/login?activated=true');
    }
  </script>
</body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html;charset=utf-8',
      'Cache-Control': 'no-store, no-cache',
    },
  });
}
