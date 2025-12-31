# 🚀 Guia Rápido de Início

## ⚠️ Importante: A aplicação precisa rodar via servidor

Esta aplicação usa **Vite** e **módulos ES6**, então **NÃO** funciona ao abrir o arquivo `index.html` diretamente no navegador. Você **DEVE** usar o servidor de desenvolvimento.

---

## 📋 Como Iniciar a Aplicação

### Pré-requisitos
- Node.js instalado (versão 14 ou superior)

### Passos

1. **Instalar dependências** (se ainda não instalou):
   ```bash
   npm install
   ```

2. **Configurar variável de ambiente** (opcional, mas recomendado):
   - Crie um arquivo `.env.local` na raiz do projeto
   - Adicione sua chave da API Gemini:
     ```
     VITE_GEMINI_API_KEY=sua_chave_aqui
     ```

3. **Iniciar o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

4. **Acessar a aplicação**:
   - O Vite iniciará um servidor local
   - Abra seu navegador e acesse a URL exibida no terminal (geralmente `http://localhost:5173` ou `http://localhost:3000`)

---

## 🗑️ Como Limpar o Ranking

### Método 1: Via Console do Navegador (Recomendado)

1. **Certifique-se de que a aplicação está rodando** (via `npm run dev`)

2. **Abra o Console do navegador**:
   - Pressione `F12` ou `Ctrl+Shift+I` (Windows/Linux)
   - Ou `Cmd+Option+I` (Mac)
   - Vá para a aba "Console"

3. **Execute um dos comandos abaixo**:

   **Opção A - Usando fetch direto:**
   ```javascript
   await fetch('https://snake-geracaotech.vercel.app/api/ranking', {
     method: 'DELETE'
   })
   .then(r => r.json())
   .then(r => alert('✅ Ranking limpo com sucesso!'))
   .catch(e => alert('❌ Erro: ' + e.message));
   ```

   **Opção B - Usando o serviço (se já estiver carregado):**
   ```javascript
   await rankingService.clearRankings();
   alert('✅ Ranking limpo com sucesso!');
   ```

### Método 2: Via API Diretamente

Você também pode usar ferramentas como Postman, Insomnia ou curl:

```bash
curl -X DELETE https://snake-geracaotech.vercel.app/api/ranking
```

---

## ❓ Problemas Comuns

### A página está em branco ao abrir `index.html` diretamente

**Solução**: Isso é esperado! A aplicação precisa rodar via servidor. Use `npm run dev` conforme as instruções acima.

### Erro de CORS ao tentar limpar o ranking

**Solução**: Certifique-se de que está executando a aplicação via `npm run dev` e não abrindo arquivos HTML diretamente. Arquivos locais (`file://`) bloqueiam requisições para APIs externas.

### A API retorna erro "Database not configured"

**Solução**: O ranking global requer Vercel KV configurado. Para desenvolvimento local, você pode usar o ranking local ou configurar Vercel KV seguindo as instruções em `VERCEL_KV_SETUP.md`.

---

## 📚 Mais Informações

- Para mais detalhes sobre o projeto, consulte o [README.md](./README.md)
- Para configurar o ranking global, consulte [VERCEL_KV_SETUP.md](./VERCEL_KV_SETUP.md)
- Para informações sobre compatibilidade, consulte [COMPATIBILIDADE.md](./COMPATIBILIDADE.md)

