# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

```sh
C:\sources\py_src>pnpm create vite py-note
.../1994f6e67ff-1988                     |   +1 +
.../1994f6e67ff-1988                     | Progress: resolved 1, reused 0, downloaded 1, added 1, done
|
o  Select a framework:
|  React
|
o  Select a variant:
|  TypeScript
|
o  Scaffolding project in C:\sources\py_src\py-note...
|
—  Done. Now run:

  cd py-note
  pnpm install
  pnpm run dev


C:\sources\py_src>
```



```
uv init
```

## pyproject.toml
```toml
...
dependencies = [
  "pyinstaller",
  "flask",
  "pywebview",
  "setuptools"
]
```

```sh
uv sync
```




## vite-tsconfig-paths

```sh
pnpm add -D vite-tsconfig-paths
```

- vite.config.ts
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'  // add

export default defineConfig({
  plugins: [react(), viteTsconfigPaths()],   // add
})
```

- package.json
```
// "build": "tsc -b && vite build",
```

- build-windows.spec

- package.json
```json
  "scripts": {
    "dev": "vite",
    
    "build": "pnpm run clean && pnpm run frontend:prod && uv run pyinstaller build-windows.spec",
    "lint": "eslint .",
    "preview": "vite preview",
    "clean": "if exist dist rd /S /Q dist & if exist build rd /S /Q build & if exist gui rd /S /Q gui",
    "frontend:dev": "vite build --outDir gui --emptyOutDir",
    "frontend:prod": "vite build --outDir gui --emptyOutDir --minify",
    "frontend:preview": "vite preview --outDir gui --emptyOutDir",
    "start": "pnpm run frontend:dev && uv run src/index.py"
  },
```

```sh
pnpm add -D @types/node
```