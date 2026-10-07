# Weather

Aplicação web de previsão do tempo construída para consultar cidades, acompanhar as condições atuais e explorar a previsão diária e por hora. A interface adapta suas cores ao clima atual e mantém as preferências de cada pessoa no próprio navegador.

## Funcionalidades

- Busca de cidades com sugestões e histórico recente salvo localmente.
- Visão do tempo atual: temperatura, sensação térmica, umidade, vento e condição.
- Previsão para os próximos dias, com seleção de um dia para ver o detalhamento por hora.
- Gráficos horários de temperatura, probabilidade de chuva e vento.
- Escala de chuva fiel a 0–100% e escala de temperatura calculada a partir dos dados exibidos.
- Idiomas em inglês, português e espanhol.
- Escolha de unidades: Celsius, Fahrenheit ou Kelvin; vento em m/s ou km/h.
- Seleção do provedor climático: Open-Meteo é o padrão e Tomorrow.io é usado como alternativa.
- Fallback automático entre provedores e timeout para evitar carregamentos infinitos.
- Layout responsivo para desktop e dispositivos móveis.

## Tecnologias

| Camada | Escolhas |
| --- | --- |
| Interface | React 18 + TypeScript |
| Build e desenvolvimento | Vite |
| Estilos | Sass |
| Dados e HTTP | Axios + APIs Open-Meteo e Tomorrow.io |
| Datas e localização | date-fns com locales |
| Qualidade | ESLint e compilação TypeScript |

## Arquitetura e decisões de engenharia

O projeto organiza cada responsabilidade em uma camada pequena e previsível:

```text
src/
├── components/    # Componentes de interface reutilizáveis
├── hooks/         # Orquestração de busca do clima e histórico de cidades
├── services/      # Provedores de API, timeout e fallback
├── i18n/          # Contexto, traduções e formatação por idioma
├── units/         # Contexto e conversão centralizada de unidades
├── utils/         # Formatações, ícones, status e persistência local
├── constants/     # Chaves e constantes compartilhadas
├── types/         # Contratos TypeScript dos dados meteorológicos
├── App.tsx        # Composição da tela e estado principal
└── style.scss     # Estilos globais e responsividade
```

### Provedores e resiliência

As APIs são normalizadas em um mesmo contrato de dados em `src/services/weather`. O aplicativo tenta o provedor selecionado, aplica um timeout de 3,5 segundos e, caso necessário, usa o próximo da lista. Isso permite que a interface continue funcionando quando um serviço estiver indisponível.

Por padrão, a prioridade é **Open-Meteo → Tomorrow.io**. A preferência escolhida nas configurações é persistida no `localStorage` e respeitada nas próximas visitas.

### Preferências do usuário

Idioma, unidade de temperatura, unidade de vento, cidade atual, cidades recentes e prioridade de provedores são persistidos no navegador. Não há conta, banco de dados ou dados pessoais enviados pelo aplicativo para esse fim.

### Dados por hora e gráficos

O componente `HourlyForecast` apresenta temperatura, chuva e vento em abas. A chuva é desenhada com sua porcentagem real na escala de 0 a 100. A temperatura usa uma faixa com respiro calculada a partir dos valores do dia, deixando variações pequenas mais fáceis de comparar. O gráfico de vento preserva sua escala atual.

## Pré-requisitos

- Node.js 20 ou superior
- npm 10 ou superior
- Uma chave da Tomorrow.io apenas se desejar usar esse provedor como alternativa

Open-Meteo funciona sem chave de API.

## Como executar

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Crie um arquivo `.env` a partir do exemplo abaixo, se quiser habilitar a alternativa Tomorrow.io:

   ```env
   VITE_REACT_API_URL=https://api.tomorrow.io/v4/weather
   VITE_REACT_API_KEY=sua_chave_aqui
   ```

3. Inicie o ambiente de desenvolvimento:

   ```bash
   npm run start
   ```

4. Abra [http://localhost:3000](http://localhost:3000).

O Vite também encaminha, durante o desenvolvimento, as rotas do Open-Meteo por um proxy local. Isso evita dependência de configuração de CORS no navegador.

## Variáveis de ambiente

| Variável | Obrigatória | Finalidade |
| --- | --- | --- |
| `VITE_REACT_API_URL` | Para Tomorrow.io | URL base da API Tomorrow.io |
| `VITE_REACT_API_KEY` | Para Tomorrow.io | Chave da API Tomorrow.io |
| `VITE_WEATHER_PROVIDER_PRIORITY` | Não | Prioridade inicial separada por vírgulas, por exemplo `open-meteo,tomorrow` |

> Nunca versione o arquivo `.env` nem publique chaves de API no cliente. Em uma implantação, configure essas variáveis no provedor de hospedagem.

## Scripts

| Comando | Descrição |
| --- | --- |
| `npm run start` | Inicia o servidor Vite em `http://localhost:3000` |
| `npm run build` | Executa a checagem TypeScript e gera a versão de produção em `dist/` |
| `npm run lint` | Analisa o código com ESLint |
| `npm run preview` | Serve localmente a versão gerada em `dist/` |

Antes de enviar uma alteração, execute:

```bash
npm run lint
npm run build
```

## Fluxo de contribuição

1. Atualize sua `main` local.
2. Crie uma branch de funcionalidade, como `feature/hourly-forecast`.
3. Mantenha as alterações focadas e faça commits descritivos.
4. Rode lint e build antes de abrir o pull request.
5. Descreva no PR o comportamento alterado e como ele foi validado.

## Licença

Este projeto está sob a licença [MIT](LICENSE).
