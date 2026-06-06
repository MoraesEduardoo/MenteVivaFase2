import crypto from 'crypto';

import { env } from '../config/env.js';

function encode(value) {
  return Buffer.from(JSON.stringify(value)).toString('base64url');
}

function sign(value) {
  return crypto.createHmac('sha256', env.jwtSecret).update(value).digest('base64url');
}

export function createToken(payload) {
  const now = Math.floor(Date.now() / 1000);
  const body = encode({ ...payload, iat: now, exp: now + env.tokenExpiresInDays * 86400 });
  const header = encode({ alg: 'HS256', typ: 'JWT' });
  return `${header}.${body}.${sign(`${header}.${body}`)}`;
}

export function verifyToken(token) {
  const [header, body, signature] = token.split('.');
  if (!header || !body || !signature) return null;
  if (sign(`${header}.${body}`) !== signature) return null;
  const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  if (payload.exp < Math.floor(Date.now() / 1000)) return null;
  return payload;
}
