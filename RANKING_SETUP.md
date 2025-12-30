# 📊 Configuração do Ranking Global

O ranking agora está configurado para ser **global e compartilhado entre todos os dispositivos** que acessam o site.

## ⚙️ Configuração Necessária na Vercel

Para que o ranking funcione corretamente em produção, você precisa configurar o **Vercel KV** (Redis) no painel da Vercel:

### Passo a Passo:

1. **Acesse o painel da Vercel**: https://vercel.com
2. **Selecione seu projeto**: `snake-geracaotech`
3. **Vá em "Storage"** no menu lateral
4. **Clique em "Create Database"**
5. **Selecione "KV"** (Redis)
6. **Dê um nome** (ex: `snake-ranking-kv`)
7. **Selecione o projeto** `snake-geracaotech`
8. **Clique em "Create"**

A Vercel configurará automaticamente as variáveis de ambiente necessárias (`KV_REST_API_URL`, `KV_REST_API_TOKEN`, etc.).

### Após a Configuração:

1. Faça um novo deploy do projeto na Vercel
2. O ranking funcionará globalmente para todos os usuários!

## 🔧 Como Funciona

- **Salvar Ranking**: Quando um jogador termina uma partida, a pontuação é salva na API `/api/ranking`
- **Buscar Ranking**: O componente de ranking busca os dados da API a cada 5 segundos
- **Persistência**: Todos os dados são armazenados no Vercel KV (Redis), compartilhado globalmente

## 📝 Notas

- O ranking mantém os **top 100** jogadores
- A exibição mostra os **top 15** no componente de ranking
- Os dados são ordenados por pontuação (maior para menor)
- O ranking atualiza automaticamente a cada 5 segundos

## 🐛 Desenvolvimento Local

Para desenvolvimento local, as API routes não funcionarão completamente (precisam do Vercel KV). 
O código irá funcionar normalmente, mas os rankings não serão persistidos localmente.

Para testar localmente:
1. Use o Vercel CLI: `npx vercel dev`
2. Ou teste diretamente na versão de produção

