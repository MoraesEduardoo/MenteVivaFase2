import dotenv from 'dotenv';

dotenv.config();

for (const key of ['MONGODB_URI', 'JWT_SECRET']) {
  if (!process.env[key]) throw new Error(`Variável obrigatória ausente: ${key}`);
}

export const env = {
  port: Number(process.env.PORT || 3000),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  tokenExpiresInDays: Number(process.env.TOKEN_EXPIRES_IN_DAYS || 7),
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  openaiModel: process.env.OPENAI_MODEL || 'gpt-5.2',
  corsOrigins: (process.env.CORS_ORIGIN || '').split(',').map((item) => item.trim()).filter(Boolean),
};
