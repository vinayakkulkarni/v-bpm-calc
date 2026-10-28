# v-bpm-calc • [Demo](https://v-bpm-calc.vinayakkulkarni.dev?utm_source=github&utm_medium=readme&utm_campaign=v-bpm-calc)

> Tap tempo BPM calculator made with ❤️ and Vue.js

Tap the pad or press any key to the beat. After five taps the page shows the
tempo in beats per minute, averaged over the last four gaps. Press **Play
click** to hear a metronome at that tempo. **Esc** resets the count; a pause of
two seconds starts a new one.

**[Live demo](https://v-bpm-calc.vinayakkulkarni.dev?utm_source=github&utm_medium=readme&utm_campaign=v-bpm-calc)**

## Stack

- [Nuxt](https://nuxt.com) on the `cloudflare_module` preset (Cloudflare
  Workers, Worker `v-bpm-calc-demo`)
- Tailwind CSS v4, `@nuxtjs/color-mode` for light and dark mode
- Node 26 and pnpm (see `devEngines` and `packageManager` in `package.json`)

## Develop

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

## Checks

```bash
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm build
```

## Deploy

```bash
pnpm deploy         # nuxt build && wrangler deploy
```

## More from the author

- [v-tweakpane](https://v-tweakpane.vinayakkulkarni.dev?utm_source=github&utm_medium=readme&utm_campaign=v-bpm-calc) — Vue 3 wrapper for Tweakpane GUI panels
- [v-clappr](https://v-clappr.vinayakkulkarni.dev?utm_source=github&utm_medium=readme&utm_campaign=v-bpm-calc) — Vue 3 wrapper for the Clappr media player
- [v-rating](https://v-rating.vinayakkulkarni.dev?utm_source=github&utm_medium=readme&utm_campaign=v-bpm-calc) — star rating component for Vue
- [v-spotlight](https://v-spotlight.vinayakkulkarni.dev?utm_source=github&utm_medium=readme&utm_campaign=v-bpm-calc) — Vue 3 spotlight overlay for product tours
- [nxui](https://nxui.geoql.in?utm_source=github&utm_medium=readme&utm_campaign=v-bpm-calc) — animated copy-paste UI components for Vue 3 and Nuxt
- [shadscan-vue](https://shadscan-vue.geoql.in?utm_source=github&utm_medium=readme&utm_campaign=v-bpm-calc) — UI-fundamentals audit for shadcn-vue apps

See every project at [vinayakkulkarni.dev/projects](https://vinayakkulkarni.dev/projects?utm_source=github&utm_medium=readme&utm_campaign=v-bpm-calc) and [geoql.in](https://geoql.in?utm_source=github&utm_medium=readme&utm_campaign=v-bpm-calc).

## License

MIT
