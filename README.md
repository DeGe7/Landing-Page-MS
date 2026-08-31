# MS Hair Studio — Landing Page

Landing page institucional desenvolvida para a MS Hair Studio, com foco em beleza, identidade e prótese capilar.

## Destaques

- Experiência visual premium e responsiva
- Hero com galeria de imagens e composição adaptada para mobile
- Galerias com transição automática para resultados, próteses e MS Academy
- Seções de serviços, atendimento, resultados e sobre o estúdio
- Formulário de contato integrado ao WhatsApp
- Favicon criado a partir do monograma da marca
- Estrutura preparada para hospedagem estática

## Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React

## Executar localmente

Requer Node.js 20+ e pnpm.

```bash
pnpm install
pnpm dev
```

O servidor inicia na porta 5173.

## Build

```bash
pnpm install
pnpm build
```

O resultado é gerado em `dist/`.

## Estrutura

- `src/pages/Home.tsx` — página principal e seções da landing page
- `src/components/ui/` — componentes reutilizáveis
- `public/images/` — imagens da marca e das galerias
- `public/favicon*` — ícones da marca
