# Rosi Trattoria - Agent Guidelines

## Commands
- **Dev server**: `npm run dev`
- **Build**: `npm run build` (includes TypeScript compilation, Vite build, and prerendering)
- **Lint**: `npm run lint`
- **Type check**: `tsc --noEmit`

## Architecture
- **Framework**: React 18 + TypeScript + Vite
- **Routing**: React Router DOM v7 with trailing slash redirects
- **Styling**: SCSS modules with CSS custom properties
- **Key libraries**: Three.js, Swiper, React PDF, EmailJS, Cloudinary
- **Structure**: `/src/components/[PageName]/[ComponentName]/` pattern

## Code Style
- **Imports**: Relative imports, React imports at top
- **Components**: PascalCase files/folders, function components with React.JSX.Element return type
- **CSS**: SCSS with BEM-like naming, CSS custom properties for theming
- **Naming**: French page names (nos-valeurs, carte, recrutement, contact)
- **Files**: lowercase with extensions (.tsx for components, .scss for styles)
- **TypeScript**: Strict mode enabled, no implicit any

## Notes
- All routes require trailing slashes with automatic redirects
- Global scroll-to-top on route changes in App.tsx
