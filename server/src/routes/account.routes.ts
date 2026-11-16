import { Router, Request, Response } from 'express';
import { handleAuthApi, handleProgressApi, requestIsSecure } from '../services/accountStore.js';

function sendResult(res: Response, result: Awaited<ReturnType<typeof handleAuthApi>>) {
  if (result.cookie) res.setHeader('Set-Cookie', result.cookie);
  res.setHeader('Cache-Control', 'no-store');
  res.status(result.status).json(result.body);
}

function secureRequest(req: Request): boolean {
  const forwardedProto = req.headers['x-forwarded-proto'];
  const protocol = Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto;
  return req.secure || requestIsSecure(protocol ?? null, `http://${req.headers.host ?? 'localhost'}`);
}

export function createAccountRouter(): Router {
  const router = Router();

  router.get('/auth', async (req, res) => {
    sendResult(res, await handleAuthApi('GET', req.headers.cookie ?? null, undefined, secureRequest(req)));
  });
  router.post('/auth', async (req, res) => {
    sendResult(res, await handleAuthApi('POST', req.headers.cookie ?? null, req.body, secureRequest(req)));
  });
  router.get('/progress', async (req, res) => {
    sendResult(res, await handleProgressApi('GET', req.headers.cookie ?? null, undefined));
  });
  router.put('/progress', async (req, res) => {
    sendResult(res, await handleProgressApi('PUT', req.headers.cookie ?? null, req.body));
  });

  return router;
}
