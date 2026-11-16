import { handleAuthApi, requestIsSecure } from '../server/src/services/accountStore.js';

function jsonResponse(status: number, body: Record<string, unknown>, cookie?: string): Response {
  const headers = new Headers({
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  if (cookie) headers.set('Set-Cookie', cookie);
  return new Response(JSON.stringify(body), { status, headers });
}

export default {
  async fetch(request: Request): Promise<Response> {
    let body: unknown;
    if (request.method === 'POST') {
      try {
        body = await request.json();
      } catch {
        return jsonResponse(400, { success: false, message: 'Request body must be valid JSON.' });
      }
    }

    const result = await handleAuthApi(
      request.method,
      request.headers.get('cookie'),
      body,
      requestIsSecure(request.headers.get('x-forwarded-proto'), request.url),
    );
    return jsonResponse(result.status, result.body, result.cookie);
  },
};
