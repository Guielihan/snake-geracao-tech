# 🧪 Checklist de Testes - Snake Geração Tech

Use este checklist para testar o site e marcar os itens conforme for testando.

## 📱 Funcionalidades Básicas

- [ ] **Login/Formulário**
  - [ ] Preencher apelido, idade e gênero
  - [ ] Salvar perfil no localStorage
  - [ ] Carregar perfil salvo automaticamente
  - [ ] Validar campos obrigatórios
  - [ ] Botão "INICIAR SESSÃO" funciona
  - [ ] Botão "RANKING" funciona

- [ ] **Jogo Snake**
  - [ ] Cobra aparece na tela
  - [ ] Maçã aparece aleatoriamente
  - [ ] Controles de teclado funcionam (setas/WASD)
  - [ ] Controles touch/swipe funcionam (mobile)
  - [ ] Cobra cresce ao comer maçã
  - [ ] Pontuação aumenta (+10 pontos por maçã)
  - [ ] Game Over ao bater na parede
  - [ ] Game Over ao bater no próprio corpo
  - [ ] Countdown antes de iniciar (3, 2, 1)
  - [ ] Pause/Resume funciona (barra de espaço ou P)
  - [ ] Botão de pause visual funciona

- [ ] **Dificuldades**
  - [ ] Seleção de dificuldade (Fácil, Médio, Difícil, Extremo)
  - [ ] Velocidade aumenta conforme dificuldade
  - [ ] Velocidade aumenta com pontuação (dependendo da dificuldade)

- [ ] **Sistema de Pontuação**
  - [ ] Pontuação atual exibida corretamente
  - [ ] Recorde salvo no localStorage
  - [ ] Recorde exibido corretamente
  - [ ] Novo recorde detectado e destacado
  - [ ] Progresso para próximo nível exibido
  - [ ] Nível atual exibido corretamente

- [ ] **Ranking**
  - [ ] Acessar ranking a partir do login
  - [ ] Ver top jogadores
  - [ ] Pontuações ordenadas corretamente
  - [ ] Informações do jogador exibidas (nickname, score, gênero, horário)
  - [ ] Botão voltar funciona

- [ ] **Tutorial**
  - [ ] Tutorial aparece na primeira vez
  - [ ] Navegação entre passos do tutorial
  - [ ] Tutorial não aparece novamente após ser visto

## 🎨 Interface e Design

- [ ] **Tema Claro/Escuro**
  - [ ] Botão de alternar tema funciona
  - [ ] Tema escuro aplicado corretamente
  - [ ] Tema claro aplicado corretamente
  - [ ] Preferência salva (se implementado)

- [ ] **Responsividade**
  - [ ] Layout funciona em desktop
  - [ ] Layout funciona em tablet
  - [ ] Layout funciona em mobile
  - [ ] Elementos não quebram em telas pequenas
  - [ ] Controles touch funcionam em mobile

- [ ] **Animações e Efeitos**
  - [ ] Partículas ao comer maçã
  - [ ] Texto flutuante "+10" ao comer maçã
  - [ ] Flash de tela ao comer maçã
  - [ ] Animação de shake no Game Over
  - [ ] Animação de countdown
  - [ ] Barra de progresso animada
  - [ ] Transições suaves entre telas

- [ ] **Sons**
  - [ ] Som ao mover cobra
  - [ ] Som ao comer maçã
  - [ ] Som no Game Over
  - [ ] Som no countdown
  - [ ] Som ao clicar em botões
  - [ ] Som de level up

## 🤖 Integração com IA (Gemini)

- [ ] **Geração de Títulos**
  - [ ] Título gerado para o jogador (se API key configurada)
  - [ ] Fallback funciona quando API não disponível

- [ ] **Comentários de Jogo**
  - [ ] Comentário ao iniciar jogo
  - [ ] Comentário no Game Over
  - [ ] Comentários em português

## 🔧 Funcionalidades Técnicas

- [ ] **Performance**
  - [ ] Jogo roda suavemente (60fps)
  - [ ] Sem travamentos ou lag
  - [ ] Memória não vaza após múltiplas partidas

- [ ] **Armazenamento Local**
  - [ ] Perfil salvo no localStorage
  - [ ] Recorde salvo no localStorage
  - [ ] Ranking salvo no localStorage
  - [ ] Tutorial visto salvo no localStorage

- [ ] **Navegação**
  - [ ] Logout funciona e volta para login
  - [ ] Transições entre telas suaves
  - [ ] Botões de voltar funcionam

## 🐛 Bugs e Problemas

- [ ] Verificar se há bugs visuais
- [ ] Verificar se há erros no console
- [ ] Verificar se há problemas de acessibilidade
- [ ] Verificar se há problemas de usabilidade

## 📝 Observações

_Use este espaço para anotar problemas encontrados ou sugestões de melhoria:_

- 
- 
- 

---

**Data do Teste:** _______________
**Testado por:** _______________
**Ambiente:** [ ] Desktop [ ] Mobile [ ] Tablet
**Navegador:** _______________

