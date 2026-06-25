# Mente Viva

## Integrantes da equipe

- Eduardo Moraes
- Newton Chagas
- Samuel Barreto
- Paulo Vithor
- Ane Dourado

## Descrição do aplicativo

Mente Viva é um aplicativo mobile voltado para cuidado mental, acompanhamento emocional e treino cognitivo. O usuário pode criar uma conta, fazer login, registrar entradas no diário emocional, acessar recomendações de bem-estar e jogar o jogo da memória. O desempenho do jogo da memória é calculado a partir das tentativas, tempo e histórico de partidas do usuário.

O aplicativo utiliza backend próprio para autenticar usuários e salvar dados no MongoDB Atlas. As collections usadas atualmente são:

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
- JWT para autenticação
- Helmet, CORS e Morgan no backend

## Funcionalidades implementadas

- Tela inicial com login.
- Cadastro de usuário.
- Login com token JWT.
- Senha salva de forma protegida por hash.
- Perfil do usuário com dados da conta e botão SAIR.
- Diário emocional salvo no banco de dados.
- Tela de bem-estar com orientações de cuidado.
- Tela Viva reservada para futura agente.
- Jogo da memória funcional.
- Salvamento dos resultados do jogo da memória no MongoDB.
- Dashboard de desempenho com:
  - média de tentativas do jogo da memória;
  - quantidade de partidas;
  - avaliação de desempenho;
  - jogos futuros exibidos como sem dados.
- Menu de navegação pelo botão de três traços.

## Estrutura do projeto

```txt
Mente_Viva_f2/
  backend/
    src/
      config/          Configuração de ambiente e banco
      controllers/     Regras das rotas
      middleware/      Autenticação e tratamento de erros
      models/          Models do MongoDB
      routes/          Rotas da API
      utils/           Senha, token e erros
    package.json

  frontend/
    app/               Rotas do Expo Router
    src/
      components/      Componentes reutilizáveis
      constants/       Tema visual
      screens/         Telas do aplicativo
      services/        API e sessão local
    package.json
```

## Instruções para execução do app

### 1. Configurar o backend

Entre na pasta do backend:

```bash
cd Mente_Viva_f2/backend
```

Instale as dependências:

```bash
npm install
```

## Observação
Cria um arquivo ```.env```, na pasta ```backend```, e coloque as credenciais abaixo.

Confira o arquivo `backend/.env`. A variável `MONGODB_URI` deve apontar para o banco `MenteViva`:

```env
PORT=3000
MONGODB_URI=mongodb+srv://USUARIO:SENHA@cluster0.xxxxx.mongodb.net/MenteViva?appName=Cluster0
JWT_SECRET=uma_chave_grande_e_segura
TOKEN_EXPIRES_IN_DAYS=7
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5.2
```

Observação: a agente Viva ainda está reservada para implementação futura, por isso `OPENAI_API_KEY` pode ficar vazia no momento.

Inicie o backend:

```bash
npm run dev
```

Teste no navegador:

```txt
http://localhost:3000/api/health
```

### 2. Configurar o frontend

Abra outro terminal e entre na pasta do frontend:

```bash
cd Mente_Viva_f2/frontend
```

Instale as dependências:

```bash
npm install
```

## Observação
Cria um arquivo ```.env```, na pasta ```frontend```, e coloque as credenciais abaixo.

Confira o arquivo `frontend/.env`. Ele deve apontar para o IP do computador onde o backend está rodando:

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

Leia o QR Code com o aplicativo Expo Go.

Se o celular não conectar, rode:

```bash
npx expo start --tunnel
```

O celular e o computador precisam estar na mesma rede Wi-Fi. Mesmo usando tunnel, o backend continua rodando no computador, então o `EXPO_PUBLIC_API_URL` deve apontar para o IP correto do computador.
