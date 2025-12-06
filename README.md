# Tech Blog

Blog pessoal focado em tecnologia com posts escritos em Markdown.

## Propósito

Plataforma para compartilhar conhecimento sobre design de sistemas, arquitetura de software e desenvolvimento frontend.

## Stack

### Backend

- Laravel 11
- MySQL
- Laravel Sanctum (autenticação API)
- Laravel Socialite (OAuth Google)
- Spatie Laravel Permission (roles e permissões)

### Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS 4
- React Router
- React Markdown (renderização de posts)
- Syntax Highlighter (highlight de código)

## Funcionalidades

- Posts salvos e escritos em Markdown
- Autenticação via Google OAuth
- Sistema de comentários com moderação
- Analytics de visitantes
- Painel administrativo completo
- Syntax highlighting para código
- Design responsivo
- Sistema de roles e permissões

## Roles e Permissões

| Role       | Comentar | Criar Post | Editar Post | Aprovar Comentários | Gerenciar Usuários |
| ---------- | -------- | ---------- | ----------- | ------------------- | ------------------ |
| reader     | ✅       | ❌         | ❌          | ❌                  | ❌                 |
| editor     | ✅       | ✅         | Próprios    | ❌                  | ❌                 |
| admin      | ✅       | ✅         | ✅          | ✅                  | ❌                 |
| superadmin | ✅       | ✅         | ✅          | ✅                  | ✅                 |

## Requisitos

- PHP 8.2+
- Composer
- Node.js 18+
- pnpm
- MySQL 8.0+
- Google Cloud Console (OAuth credentials)
