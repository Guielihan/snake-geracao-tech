# 🚀 Guia de Deploy - Snake Game

## Hospedagem Recomendada: Vercel (100% Gratuito)

O Vercel é a melhor opção porque:
- ✅ Suporta React/Vite perfeitamente
- ✅ Suporta áudio e animações
- ✅ Suporta variáveis de ambiente (para API do Gemini)
- ✅ Deploy automático via GitHub
- ✅ HTTPS gratuito
- ✅ CDN global (site rápido no mundo todo)

## 📋 Passo a Passo para Deploy

### Opção 1: Deploy via GitHub (Recomendado)

1. **Crie uma conta no GitHub** (se não tiver):
   - Acesse: https://github.com
   - Crie uma conta gratuita

2. **Faça upload do projeto para o GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
   git push -u origin main
   ```

3. **Crie uma conta no Vercel**:
   - Acesse: https://vercel.com
   - Clique em "Sign Up"
   - Escolha "Continue with GitHub"

4. **Faça o Deploy**:
   - No Vercel, clique em "Add New Project"
   - Selecione seu repositório do GitHub
   - Configure:
     - **Framework Preset**: Vite
     - **Root Directory**: ./
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
   - Clique em "Deploy"

5. **Configure a Variável de Ambiente (Opcional - para API do Gemini)**:
   - No projeto no Vercel, vá em "Settings" > "Environment Variables"
   - Adicione:
     - **Name**: `VITE_GEMINI_API_KEY`
     - **Value**: Sua chave da API do Gemini
   - Clique em "Save"
   - Vá em "Deployments" e faça um novo deploy

6. **Pronto!** Seu site estará online em uma URL como:
   `https://seu-projeto.vercel.app`

### Opção 2: Deploy Manual via Vercel CLI

1. **Instale o Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Faça login**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Siga as instruções** no terminal

## 🔧 Configuração de Variáveis de Ambiente

Se você quiser usar a API do Gemini (opcional):

1. Obtenha uma chave da API em: https://makersuite.google.com/app/apikey
2. No Vercel, vá em Settings > Environment Variables
3. Adicione: `VITE_GEMINI_API_KEY` com sua chave
4. Faça um novo deploy

**Nota**: O jogo funciona perfeitamente SEM a API do Gemini. Ela é apenas para recursos extras de IA.

## 🌐 Alternativas Gratuitas

Se preferir outras opções:

### Netlify
- Similar ao Vercel
- https://netlify.com
- Também suporta tudo que você precisa

### Cloudflare Pages
- https://pages.cloudflare.com
- Muito rápido e gratuito

## ✅ Verificação Pós-Deploy

Após o deploy, verifique:
- ✅ Site carrega corretamente
- ✅ Sons funcionam
- ✅ Animações funcionam
- ✅ Jogo funciona em mobile e desktop
- ✅ Ranking salva localmente (funciona mesmo sem backend)

## 📱 Compartilhando com a Sala de Aula

Após o deploy, você terá uma URL como:
`https://snake-game.vercel.app`

Compartilhe essa URL com seus alunos! O site funciona em:
- 💻 Computadores
- 📱 Celulares
- 📱 Tablets

## 🆘 Problemas Comuns

**Site não carrega?**
- Verifique se o build foi bem-sucedido no Vercel
- Verifique os logs de deploy

**Sons não funcionam?**
- Verifique se o navegador permite áudio
- Alguns navegadores bloqueiam áudio até interação do usuário

**Animações lentas?**
- Normal em dispositivos mais antigos
- O Vercel usa CDN global, então deve ser rápido

---

**Desenvolvido com ❤️ para Geração Tech**

