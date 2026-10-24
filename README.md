# v-bpm-calc • [Demo](https://v-bpm-calc.vinayakkulkarni.dev)

> Tap tempo BPM calculator made with ❤️ and Vue.js

Tap the pad or press any key to the beat. After five taps the page shows the
tempo in beats per minute, averaged over the last four gaps. Press **Play
click** to hear a metronome at that tempo. **Esc** resets the count; a pause of
two seconds starts a new one.

Live demo: <https://v-bpm-calc.vinayakkulkarni.dev>

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

## License

MIT
