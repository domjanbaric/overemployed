# 🎨 STYLE\_GUIDE.md — UI, UX, and Theming Standards for PersonaForge

This guide defines the **visual design principles**, **Tailwind conventions**, and **component architecture** for a unified and scalable frontend in PersonaForge.

---

## 🌐 1. Visual & UX Philosophy

Our UI should be:

- **Clarity-driven**: Focus on readability, hierarchy, and whitespace
- **Intentionally minimal**: Avoid noise, highlight what's relevant
- **Reusable-first**: Prefer composable, self-contained components
- **Theme-aware**: Every element supports both light and dark themes
- **Accessible by design**: All components must support keyboard navigation and screen readers

---

## 🎨 2. Theming & Color System

### 2.1. Semantic Tokens (Tailwind Config)

Use semantic names, not raw colors, for consistent branding and easier theme switching:

```ts
// tailwind.config.js
colors: {
  primary: {
    DEFAULT: '#3B82F6',   // blue-500
    dark: '#60A5FA',      // blue-400
  },
  surface: {
    DEFAULT: '#ffffff',
    dark: '#1f2937',      // gray-800
  },
  onSurface: {
    DEFAULT: '#111827',   // gray-900
    dark: '#e5e7eb',      // gray-200
  },
  error: {
    DEFAULT: '#EF4444',   // red-500
    dark: '#F87171',
  },
}
```

Access via `bg-surface`, `text-onSurface`, etc.

### 2.2. Theme Support

Wrap the app in a provider (`next-themes` or equivalent):

```tsx
<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  <App />
</ThemeProvider>
```

Use `dark:` Tailwind modifiers for conditional styles.

---

## ✍️ 3. Typography

Typography follows a consistent scale with Tailwind utilities and semantic class use:

| Element         | Classes                                    | Notes                     |
| --------------- | ------------------------------------------ | ------------------------- |
| Page Title      | `text-2xl font-semibold`                   |                           |
| Section Heading | `text-lg font-medium`                      |                           |
| Body Text       | `text-base text-onSurface`                 | Global text color handled |
| Caption/Label   | `text-sm text-gray-500 dark:text-gray-400` |                           |
| Code/Mono       | `font-mono text-sm text-primary`           | Inline or block           |

Override global defaults via:

```css
/* styles/globals.css */
@layer base {
  body {
    @apply text-base text-onSurface bg-surface;
  }
}
```

---

## 📀 4. Layout & Spacing

Use Tailwind layout primitives consistently:

- Prefer `flex`, `grid` for all containers
- Use spacing tokens like `gap-4`, `p-6`, `mt-2`
- Use `max-w-screen-lg` or `max-w-prose` to constrain widths
- Apply `rounded-2xl`, `shadow-md` for cards

Avoid fixed pixel widths.

---

## 🧱 5. Components

### 5.1. Structure & Location

- All UI components reside in `components/`
- One file per component (`PascalCase.tsx`)
- Domain-specific components may be grouped in folders (`/components/persona/`)

### 5.2. Conventions

- Functional components only (`const MyComponent = () => {}`)
- Accept typed props (use `interface` or `PropsWithChildren`)
- Prop names should be semantic (`variant`, `intent`, `disabled`)
- Don't embed API logic — use hooks or external utilities

### 5.3. Styling Rules

- Tailwind only, no inline styles unless dynamic
- Responsive by default: use `sm:`, `md:`, `lg:`
- Support both themes via `dark:` modifiers
- Always accessible (keyboard, screen readers)

### 5.4. Icons

Use [`lucide-react`](https://lucide.dev/icons):

- All icons must inherit text color via `stroke="currentColor"`
- Normalize size via `size={18}` or `24`
- Example:

```tsx
<SettingsIcon className="w-5 h-5 stroke-current" />
```

---

## 🎭 6. Component Variants & State

Use `clsx`, `cva` (class variance authority), or `tailwind-variants` for variants:

```ts
const button = cva('rounded px-4 py-2 font-medium', {
  variants: {
    intent: {
      primary: 'bg-primary text-white',
      secondary: 'bg-surface text-onSurface border',
    },
    size: {
      sm: 'text-sm',
      md: 'text-base',
    },
  },
  defaultVariants: {
    intent: 'primary',
    size: 'md',
  },
})
```

### State Handling

- Disabled: `opacity-50 cursor-not-allowed`
- Loading: Use a spinner + `aria-busy`
- Error: Red border, accessible error label

---

## 🎞️ 7. Animations

Use [`framer-motion`](https://www.framer.com/motion/) for transitions:

- Use shared animation config from `utils/animations.ts`
- Always define `initial`, `animate`, `exit` props
- Example:

```tsx
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: 10 }}
  transition={{ duration: 0.2 }}
>
  ...
</motion.div>
```

---

## ♿ 8. Accessibility (a11y)

- Never remove focus outlines unless replaced (`focus-visible`)
- All interactive components must support keyboard navigation
- Use semantic HTML (`<button>`, `<label>`)
- Apply ARIA roles as needed (`aria-expanded`, `aria-label`, etc.)
- Use `role="alert"` for error messages

---

## 📁 9. Project Structure

```bash
/web
  components/
    ui/              # Primitives like Button, Input
    persona/         # Domain-specific widgets
  pages/
    index.tsx
    dashboard.tsx
  styles/
    globals.css
  theme/
    index.ts         # tokens and utilities
  utils/
    hooks.ts
    api.ts
    animations.ts    # framer config
```

---

## 🥪 10. Testing & Storybook

- Use **Storybook** for all UI components
- Test critical components with **Jest + React Testing Library**
- Run `yarn test` before each merge
- Storybook should show at least:
  - Normal state
  - Hover/focus
  - Disabled
  - Dark mode

---

## 📝 11. Codex & Modification Logging

All significant changes to UI behavior, component structure, or style rules must be logged in `NOTEBOOK.md`.

Log format:

```md
## [2025-08-03] — Add Tooltip Variants
Updated `Tooltip.tsx` to support `intent="info" | "warning"` and dark mode contrast fix.
```

---

## ✅ Summary Checklist

-

---

This guide is a **living document**. Propose additions or changes via pull requests or log them in `NOTEBOOK.md`.

