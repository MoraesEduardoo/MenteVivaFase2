import crypto from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(crypto.scrypt);
const keyLength = 64;

export async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const key = await scrypt(password, salt, keyLength);
  return `${salt}:${key.toString('hex')}`;
}

export async function verifyPassword(password, hash) {
  const [salt, stored] = hash.split(':');
  const key = await scrypt(password, salt, keyLength);
  const storedBuffer = Buffer.from(stored, 'hex');
  return storedBuffer.length === key.length && crypto.timingSafeEqual(storedBuffer, key);
}
