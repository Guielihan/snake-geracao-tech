# 🐍 Snake Geração Tech - Demonstrativo do Projeto

## 📋 Sobre o Projeto

Este repositório contém o desenvolvimento completo de um **jogo da cobrinha (Snake) interativo e moderno**, criado especialmente para proporcionar momentos de diversão e competição entre os colegas de turma do **Geração Tech 3.0**.

O projeto foi desenvolvido por **Guilherme Queiroz (guielihan)**, aluno do **Professor Luan**, como uma forma de unir os colegas através de uma experiência de jogo divertida e competitiva, com sistema de ranking e integração de inteligência artificial para personalização da experiência.

## 🎯 Objetivo

O intuito principal deste site é criar um ambiente de entretenimento e interação entre os alunos do **G.T 3.0**, permitindo que todos possam competir, comparar pontuações e se divertir juntos através de um jogo clássico reinventado com tecnologias modernas.

## 🛠️ Tecnologias e Linguagens Utilizadas

### Linguagens de Programação
- **TypeScript** - Linguagem principal para desenvolvimento com tipagem estática
- **JavaScript/JSX** - Para componentes React e lógica de interface

### Frameworks e Bibliotecas
- **React 19.2.3** - Framework JavaScript para construção da interface de usuário
- **React DOM 19.2.3** - Para renderização dos componentes React

### Ferramentas de Desenvolvimento
- **Vite 6.2.0** - Build tool moderna e rápida para desenvolvimento frontend
- **TypeScript 5.8.2** - Compilador TypeScript para verificação de tipos

### Estilização
- **Tailwind CSS** - Framework CSS utility-first para design responsivo e moderno
- **CSS3** - Estilos customizados e animações

### Integração de IA
- **Google Generative AI (@google/generative-ai 0.21.0)** - Biblioteca para integração com a API do Google Gemini
- **Gemini 1.5 Flash** - Modelo de IA utilizado para gerar títulos personalizados e comentários dinâmicos durante o jogo

### Outras Tecnologias
- **HTML5** - Estrutura base da aplicação
- **LocalStorage API** - Para persistência de dados localmente (ranking, recordes, preferências)
- **Web APIs** - Para controle de áudio, touch events e animações

## 🎮 Funcionalidades Principais

### Sistema de Jogo
- Jogo Snake clássico com múltiplos níveis de dificuldade (Fácil, Médio, Difícil, Extremo)
- Sistema de pontuação progressivo
- Controles responsivos para desktop (teclado) e mobile (touch/swipe)
- Efeitos visuais e sonoros imersivos
- Sistema de níveis que aumenta a cada 50 pontos

### Sistema de Usuários
- Login personalizado com nickname, idade e gênero
- Geração automática de títulos épicos para cada jogador usando IA
- Perfil de jogador personalizado

### Sistema de Ranking
- Ranking global que armazena as melhores pontuações
- Exibição dos top 50 jogadores
- Histórico de partidas com timestamps
- Sistema de recordes pessoais

### Integração com IA
- Geração dinâmica de títulos personalizados para cada jogador
- Comentários contextuais durante o jogo (início, game over, recordes)
- Experiência única e personalizada para cada usuário

### Interface e Design
- Tema claro/escuro com alternância dinâmica
- Design totalmente responsivo (mobile e desktop)
- Animações suaves e efeitos visuais modernos
- Tutorial interativo para novos jogadores
- Sistema de partículas e efeitos visuais durante o jogo

## 📁 Estrutura do Projeto

```
snake-geracaotech/
├── components/          # Componentes React
│   ├── LoginForm.tsx   # Formulário de login
│   ├── SnakeGame.tsx   # Componente principal do jogo
│   └── Ranking.tsx     # Tela de ranking
├── services/           # Serviços externos
│   └── geminiService.ts # Integração com Google Gemini AI
├── utils/              # Utilitários
│   ├── audioUtils.ts   # Sistema de áudio
│   └── gameUtils.ts    # Lógica do jogo
├── App.tsx             # Componente raiz da aplicação
├── types.ts            # Definições de tipos TypeScript
└── index.tsx           # Ponto de entrada da aplicação
```

## 🚀 Como Funciona

1. **Login**: O jogador faz login com seu nickname, idade e gênero
2. **Personalização**: A IA gera um título épico personalizado para o jogador
3. **Jogo**: O jogador escolhe a dificuldade e começa a jogar
4. **Competição**: As pontuações são salvas no ranking global
5. **Socialização**: Todos os colegas podem ver e competir no ranking

## 👨‍💻 Desenvolvedor

**Guilherme Queiroz (guielihan)**  
Aluno do **Professor Luan**  
Turma: **Geração Tech 3.0**

## 📝 Notas Técnicas

- O projeto utiliza **Vite** como ferramenta de build, proporcionando desenvolvimento rápido e hot-reload
- A aplicação é uma **Single Page Application (SPA)** construída com React
- Os dados são armazenados localmente no navegador usando **LocalStorage**
- A integração com IA é opcional e funciona apenas se uma chave de API do Gemini estiver configurada
- O projeto está configurado para deploy em plataformas como Vercel

## 🎓 Contexto Educacional

Este projeto foi desenvolvido no contexto do **Geração Tech 3.0**, um programa educacional focado em tecnologia e programação, sob a orientação do **Professor Luan**. O objetivo é aplicar os conhecimentos aprendidos em sala de aula em um projeto prático e divertido que promova a interação entre os colegas de turma.

---

*Desenvolvido com dedicação e entusiasmo para a turma do G.T 3.0! 🚀*

