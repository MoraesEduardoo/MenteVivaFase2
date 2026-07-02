# Mente Viva

## Integrantes da equipe

- Eduardo Moraes
- Newton Chagas
- Samuel Barreto
- Paulo Vithor
- Ane Dourado

## Descricao do aplicativo

Mente Viva e um aplicativo mobile voltado para cuidado mental, acompanhamento emocional e treino cognitivo. O usuario pode criar uma conta, fazer login, registrar entradas no diario emocional, acessar recomendacoes de bem-estar e jogar o jogo da memoria. O desempenho do jogo da memoria e calculado a partir das tentativas, tempo e historico de partidas do usuario.

## Requisitos atendidos

- App mobile em React Native com Expo Router.
- Backend proprio em Node.js, Express e Mongoose.
- Banco de dados MongoDB Atlas configurado por `MONGODB_URI`.
- Persistencia real no banco para usuarios, diario emocional e resultados do jogo da memoria.
- CRUD completo da entidade principal `diary`:
  - `GET /api/entries`
  - `POST /api/entries`
  - `PATCH /api/entries/:id`
  - `DELETE /api/entries/:id`
- Comunicacao HTTP do app com a API via `frontend/src/services/api.js`.
- Tratamento basico de erros no backend e no app:
  - validacao de campos obrigatorios;
  - erro para token ausente/invalido;
  - erro para ID invalido;
  - erro para JSON invalido;
  - mensagem no app quando a API esta fora do ar.

As collections usadas atualmente sao:

```txt
MenteViva
  user
  diary
  memoryGame
```

## Tecnologias utilizadas

- React Native
- Expo
- Expo Router
- Node.js
- Express
- MongoDB Atlas
- Mongoose
- Token JWT para autenticacao
- Helmet, CORS e Morgan no backend

## Funcionalidades implementadas

- Cadastro de usuario.
- Login com token.
- Senha salva por hash.
- Perfil do usuario com dados da conta e botao sair.
- Diario emocional salvo no MongoDB com criar, listar, editar e excluir.
- Tela de bem-estar com orientacoes de cuidado.
- Tela Viva integrada ao backend para chamada opcional da OpenAI.
- Jogo da memoria funcional.
- Salvamento dos resultados do jogo da memoria no MongoDB.
- Dashboard de desempenho baseado nos resultados persistidos.
- Menu de navegacao.

## Estrutura do projeto

```txt
Mente_Viva_f2/
  backend/
    src/
      config/          Configuracao de ambiente e banco
      controllers/     Regras das rotas
      middleware/      Autenticacao e tratamento de erros
      models/          Models do MongoDB
      routes/          Rotas da API
      utils/           Senha, token e erros
    package.json

  frontend/
    app/               Rotas do Expo Router
    src/
      components/      Componentes reutilizaveis
      constants/       Tema visual
      screens/         Telas do aplicativo
      services/        API e sessao local
    package.json
```

## Como executar

### 1. Backend

Entre na pasta do backend:

```bash
cd Mente_Viva_f2/backend
```

Instale as dependencias:

```bash
npm install
```

Configure `backend/.env` com a URI real do MongoDB e uma chave segura:

```env
PORT=3000
MONGODB_URI=mongodb+srv://USUARIO:SENHA@cluster0.xxxxx.mongodb.net/MenteViva?appName=Cluster0
JWT_SECRET=uma_chave_grande_e_segura
TOKEN_EXPIRES_IN_DAYS=7
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5.2
```

Inicie o backend:

```bash
npm run dev
```

Teste:

```txt
http://localhost:3000/api/health
```

### 2. Frontend

Abra outro terminal:

```bash
cd Mente_Viva_f2/frontend
```

Instale as dependencias:

```bash
npm install
```

Configure `frontend/.env` apontando para o computador onde o backend esta rodando:

```env
EXPO_PUBLIC_API_URL=http://SEU_IP_DO_COMPUTADOR:3000/api
```

Exemplo:

```env
EXPO_PUBLIC_API_URL=http://192.168.0.10:3000/api
```

Inicie o Expo:

```bash
npx expo start
```

Leia o QR Code com o Expo Go. O celular e o computador precisam estar na mesma rede Wi-Fi, e o `EXPO_PUBLIC_API_URL` deve apontar para o IP correto do computador.
