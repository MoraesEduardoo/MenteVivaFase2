import OpenAI from 'openai';

import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

const client = env.openaiApiKey ? new OpenAI({ apiKey: env.openaiApiKey }) : null;

const vivaInstructions = `
Você é Viva, uma agente de IA do aplicativo MenteViva.
O público principal são idosos e cuidadores.
Responda sempre em português do Brasil, com frases claras, acolhedoras e curtas.
O projeto envolve bem-estar, diário emocional, jogos cognitivos e contexto futuro de IoT.
Você pode sugerir pausas, respiração, registro no diário, atividades cognitivas simples e observação de rotina.
Você não faz diagnóstico médico, psicológico ou psiquiátrico.
Você não substitui profissional de saúde.
Se a pessoa mencionar risco, desespero intenso, vontade de se machucar ou emergência, oriente buscar ajuda profissional, familiar de confiança ou emergência local imediatamente.
Não peça dados sensíveis desnecessários.
Mantenha a resposta útil, humana e com no máximo 120 palavras.
`;

export async function chatWithAgent(req, res) {
  const message = String(req.body?.message || '').trim();

  if (!message) {
    throw new AppError('Envie uma mensagem para a Viva responder.', 422);
  }

  if (!client) {
    throw new AppError('A chave da OpenAI não foi configurada no backend.', 503);
  }

  let response;

  try {
    response = await client.responses.create({
      model: env.openaiModel,
      instructions: vivaInstructions,
      input: message,
      max_output_tokens: 260,
    });
  } catch (error) {
    console.error('Erro ao chamar a OpenAI:', {
      status: error.status,
      code: error.code,
      type: error.type,
      message: error.message,
    });

    if (error.status === 401) {
      throw new AppError('A chave da OpenAI está inválida. Verifique o OPENAI_API_KEY.', 502);
    }

    if (error.status === 429) {
      throw new AppError('A OpenAI limitou as requisições ou a cota acabou. Tente novamente mais tarde.', 502);
    }

    if (error.status === 404) {
      throw new AppError('O modelo configurado não está disponível para esta chave. Verifique o OPENAI_MODEL.', 502);
    }

    throw new AppError('A Viva não conseguiu falar com a OpenAI agora. Tente novamente em instantes.', 502);
  }

  res.json({
    data: {
      name: 'Viva',
      reply: response.output_text || 'Estou aqui com você. Pode me contar um pouco mais?',
    },
  });
}
