# HoriChat - Chat Horizontal p/ Twitch

**Exemplos de uso**:

-   `https://submarcus.github.io/horichat/?user=alanzoka`
-   `https://submarcus.github.io/horichat/?user=alanzoka&theme=2`
-   `https://submarcus.github.io/horichat/?user=alanzoka&theme=3`

## 🎨 Temas Disponíveis

-   **Tema 1** (`theme=1`): Simples - apenas texto sem background (padrão)
-   **Tema 2** (`theme=2`): Minimalista - com fundo preto translúcido e bordas
-   **Tema 3** (`theme=3`): Terminal - estilo hacker com efeitos verdes

### 🚀 Configuração no OBS

#### Opção 1: Usando GH Pages (Recomendado)

1. **Adicionar fonte** → Browser Source
2. **URL**: `https://submarcus.github.io/horichat/?user=SEU_CANAL&theme=NUMERO_DO_TEMA`
3. **Largura**: 1920 | **Altura**: 1080

**Exemplos de URLs:**

-   Tema simples: `https://submarcus.github.io/horichat/?user=SEU_CANAL`
-   Tema escuro: `https://submarcus.github.io/horichat/?user=SEU_CANAL&theme=2`
-   Tema matrix: `https://submarcus.github.io/horichat/?user=SEU_CANAL&theme=3`

#### Opção 2: Local

1. Execute `npm run dev` no projeto
2. **URL**: `http://localhost:5173/horichat/?user=SEU_CANAL&theme=NUMERO_DO_TEMA`
3. Configure como acima

### 🛠️ Tecnologias

[![React](https://img.shields.io/badge/React-61DAFB?style=plastic&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=plastic&logo=vite&logoColor=white)](https://vitejs.dev/)
[![tmi.js](https://img.shields.io/badge/tmi.js-9146FF?style=plastic&logo=javascript&logoColor=white)](https://tmijs.com/)
