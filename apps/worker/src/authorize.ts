function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderAuthorizePage(
  clientInfo: OAuthClientInfo,
  oauthReqInfo: OAuthRequestInfo,
): Response {
  const clientName = escapeHtml(
    clientInfo.clientName || oauthReqInfo.clientId,
  );
  const redirectUri = escapeHtml(oauthReqInfo.redirectUri);
  const scope = escapeHtml(oauthReqInfo.scope?.join(", ") || "wishlist");
  // encodeURIComponent ensures non-ASCII characters (e.g. in state) are safe for btoa
  const oauthReqBase64 = btoa(encodeURIComponent(JSON.stringify(oauthReqInfo)));

  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>認可リクエスト</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f5f5f5; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
    .card { background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 2rem; max-width: 420px; width: 100%; }
    h1 { font-size: 1.25rem; margin-bottom: 1rem; }
    dl { margin: 1rem 0; }
    dt { font-weight: 600; color: #555; font-size: 0.875rem; margin-top: 0.75rem; }
    dd { margin: 0.25rem 0 0; word-break: break-all; }
    code { background: #f0f0f0; padding: 0.125rem 0.375rem; border-radius: 4px; font-size: 0.85rem; }
    .actions { display: flex; gap: 0.75rem; margin-top: 1.5rem; }
    button { flex: 1; padding: 0.625rem; border: none; border-radius: 8px; font-size: 0.9375rem; font-weight: 600; cursor: pointer; }
    .approve { background: #2563eb; color: #fff; }
    .approve:hover { background: #1d4ed8; }
    .deny { background: #e5e7eb; color: #374151; }
    .deny:hover { background: #d1d5db; }
  </style>
</head>
<body>
  <div class="card">
    <h1>認可リクエスト</h1>
    <p><strong>${clientName}</strong> があなたのアカウントへのアクセスを要求しています。</p>
    <dl>
      <dt>リダイレクト先</dt>
      <dd><code>${redirectUri}</code></dd>
      <dt>スコープ</dt>
      <dd>${scope}</dd>
    </dl>
    <form method="POST" action="/authorize">
      <input type="hidden" name="oauthReqInfo" value="${oauthReqBase64}" />
      <div class="actions">
        <button type="submit" name="action" value="approve" class="approve">承認する</button>
        <button type="submit" name="action" value="deny" class="deny">拒否する</button>
      </div>
    </form>
  </div>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Security-Policy":
        "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'",
    },
  });
}
