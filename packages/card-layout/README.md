# @km/card-layout

A responsive Vue 3 component that renders business-card layouts defined by `@km/card-schema`.

## Usage

```bash
pnpm add @km/card-layout @km/card-schema vue
```

```vue
<script setup>
import { CardLayout } from '@km/card-layout'
</script>

<template>
  <CardLayout :layout="schema" :data="payload" />
</template>
```

## Development

```bash
pnpm install
pnpm --filter @km/card-layout build
```

The build script emits ES and UMD bundles plus type declarations under `dist/` so the package can be published to npm.

### Local demo playground

Run the bundled Vite playground to test the component without publishing:

```bash
cd packages/card-layout
pnpm run demo:install
pnpm run demo:dev
```

The playground imports the component directly from `src` for rapid iteration.
