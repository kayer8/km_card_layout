# km-card-layout-h5-component

A responsive Vue 3 component that renders business-card layouts defined by `@km/card-schema`.

## Usage

```bash
pnpm add km-card-layout-h5-component @km/card-schema vue
```

```vue
<script setup>
import { CardLayout } from 'km-card-layout-h5-component'
</script>

<template>
  <CardLayout :layout="schema" :data="payload" />
</template>
```

## Development

```bash
pnpm install
pnpm --filter km-card-layout-h5-component build
```

The build script emits ES and UMD bundles plus type declarations under `dist/` so the package can be published to npm.
