import { handleProgressApi } from '../server/src/services/accountStore.js';

function jsonResponse(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

export default {
  async fetch(request: Request): Promise<Response> {
    let body: unknown;
    if (request.method === 'PUT') {
      try {
        body = await request.json();
      } catch {
        return jsonResponse(400, { success: false, message: 'Request body must be valid JSON.' });
      }
    }

    const result = await handleProgressApi(request.method, request.headers.get('cookie'), body);
    return jsonResponse(result.status, result.body);
  },
};
