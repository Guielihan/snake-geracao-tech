# 📋 Guia Passo a Passo: Configurar Vercel KV

## Passo 1: Acessar a aba Storage
1. No painel da Vercel, você está na aba **"Overview"**
2. Clique na aba **"Storage"** que está no topo (ao lado de "Logs")

## Passo 2: Criar o banco de dados KV
1. Na página Storage, clique no botão **"Create Database"** (geralmente no canto superior direito)
2. Uma janela/modal aparecerá com opções de banco de dados

## Passo 3: Selecionar KV
1. Na lista de opções, selecione **"KV"** (Redis)
2. Você verá uma tela para configurar o KV

## Passo 4: Configurar e Conectar
1. **Nome do banco**: Dê um nome (ex: `snake-ranking-kv` ou `ranking-db`)
2. **Região**: Escolha a região mais próxima (ex: `Washington, D.C. (US East)` ou `São Paulo (BR)`)
3. **Plan**: Escolha o plano gratuito (Free tier)
4. Clique em **"Create"** ou **"Create Database"**

## Passo 5: Conectar ao Projeto
1. Após criar, você verá opções para conectar ao projeto
2. Clique no botão **"Connect Project"** (com seta dropdown)
3. Um modal aparecerá com opções de configuração:
   - **Environments**: Mantenha marcados **Development**, **Preview** e **Production** ✅
   - **Custom Prefix**: ⚠️ **DEIXE VAZIO** (remova "STORAGE" se estiver preenchido)
     - Se você usar um prefixo, as variáveis terão nomes diferentes e o código não funcionará
     - O código espera variáveis como `KV_REST_API_URL`, `KV_REST_API_TOKEN`, etc.
4. Clique em **"Connect"** (botão no canto inferior direito)
5. ✅ As variáveis de ambiente serão configuradas automaticamente pela Vercel!

## Passo 6: Instalar o SDK do Vercel KV
Após conectar o projeto, você precisa instalar o pacote `@vercel/kv`:

1. Abra o terminal no diretório do projeto
2. Execute o comando:
```bash
npm install @vercel/kv
```

## Passo 7: Verificar Variáveis de Ambiente
As variáveis já foram configuradas automaticamente, mas você pode verificar:
1. Vá em **Settings** → **Environment Variables**
2. Você verá variáveis como:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`
   - `KV_URL`
   - `REDIS_URL`

## Passo 8: Fazer Deploy
1. Após instalar o pacote, faça commit e push das mudanças:
```bash
git add package.json package-lock.json
git commit -m "Add Vercel KV dependency"
git push
```
2. OU faça um redeploy manual:
   - Vá para a aba **"Deployments"**
   - Clique nos três pontos (...) do último deployment
   - Selecione **"Redeploy"**

## ✅ Verificação
- Após o deploy, acesse seu site
- Jogue uma partida e termine com pontuação > 0
- Vá ao ranking e verifique se sua pontuação aparece
- O ranking agora será global para todos os usuários!

## 🆘 Problemas?
- Se não encontrar a opção "Create Database", verifique se você está na aba "Storage"
- Certifique-se de estar na organização/projeto correto
- O plano gratuito do KV oferece 256 MB, suficiente para o ranking

