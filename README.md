# Plano de Treino — PLANO/7

Site estático e responsivo para mostrar o meu plano de treino semanal
(Upper A · Lower A · Upper B · Lower B · Aesthetics). É só para consulta: não guarda progresso nem cargas.

**Site:** https://plano-de-treino.tomaspereira.chatgpt.site

Construído com **Vite + JavaScript (sem framework)**. As fontes são empacotadas localmente (Fontsource), por isso não há pedidos a CDNs externos.

## Requisitos

- Node.js 18+ (testado com Node 24) e npm

## Comandos

```bash
npm install        # instalar dependências
npm run dev        # servidor de desenvolvimento (http://localhost:5173)
npm run build      # gera dist/ pronto a publicar
npm run preview    # serve dist/ localmente para verificação
```

## Publicação

- Publica **o conteúdo da pasta `dist/`** (`index.html`, ícones, `site.webmanifest` e `assets/`).
- Todos os caminhos são relativos (`base: './'` no `vite.config.js`): funciona na raiz de um domínio ou numa subpasta.
- Cada dia tem um link próprio por hash (`#/segunda`, `#/sabado`…), por isso **não é preciso configurar rewrites** no servidor.
- Não existem chaves, segredos, variáveis de ambiente nem backend.

## Estrutura

```
index.html            estrutura da página
public/               ícones (favicon.svg, apple-touch-icon.png, icon-192/512.png) e site.webmanifest
src/data/plan.js      ← o plano de treino (editar aqui para mudar exercícios, séries ou pausas)
src/lib/store.js      guarda só a preferência de tema claro/escuro no browser
src/main.js           interface
src/styles.css        estilos (tema claro/escuro, responsivo)
```

## O que o site mostra

- **Hoje**: o treino do dia atual em destaque (ou o próximo treino, se for dia de descanso) e um anel com a semana; cada dia do anel é clicável.
- **A semana**: números gerais (treinos, descanso, séries, exercícios diferentes, horas por treino e por semana) e os 7 dias — lista vertical no telemóvel, grelha no tablet e no computador.
- **Os treinos**: separadores por dia com a lista de exercícios, equipamento, músculos, séries × repetições e pausa.
- **Volume semanal**: séries por grupo muscular, repartidas por tipo de sessão.
- **Exercícios**: todos os exercícios do plano e os dias em que aparecem.
- Botão **Partilhar** no topo (menu de partilha do iPhone ou copiar o link) e tema claro/escuro.

## iPhone

- Pensado primeiro para iPhone: verificado em larguras de 320 px (iPhone SE) a 390 px (iPhone 15) sem deslocamento horizontal (emulação de ecrã no browser; convém confirmar num iPhone real depois de publicar).
- Respeita as zonas seguras do notch/Dynamic Island (`viewport-fit=cover` + `env(safe-area-inset-*)`).
- Sem efeitos de hover "presos" depois de tocar; alvos de toque com pelo menos ~44 px nos botões do topo.
- "Adicionar ao ecrã principal" no Safari usa `apple-touch-icon.png` e abre em ecrã inteiro com o nome "Treino".
- A cor da barra do Safari acompanha o tema claro/escuro.

## Notas

- O "dia de hoje" é calculado no browser de quem visita, com o relógio do dispositivo dessa pessoa.
- A duração de cada treino é uma estimativa (~45 s por série mais a pausa indicada).
- Copiar o link exige HTTPS (normal em qualquer alojamento atual). Em HTTP o site pede para copiar o link da barra de endereço.
