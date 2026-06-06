import { createApp } from './app.js';
import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';

async function bootstrap() {
  await connectDatabase();
  const app = createApp();
  app.listen(env.port, () => console.log(`API MenteViva rodando na porta ${env.port}`));
}

bootstrap().catch((error) => {
  console.error('Não foi possível iniciar a API:', error);
  process.exit(1);
});
