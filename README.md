# Orbital Lab — Space Mission Design Game

A Vite-based space mission design game with an arcade-style launch and flight-control challenge.

## Run locally

```bash
npm install
npm run dev
```

## Build for production

```bash
npm run build
npm run preview
```

## Arcade flight controls

- `Space`: ignite engines / boost
- `W` / `S`: increase / decrease throttle
- `A` / `D`: steer left / right to dodge
- `P`: pause / resume
- On-screen buttons support touch and mouse controls.

During flight, dodge orbital debris, collect glowing science beacons, build score multipliers, and reach 100 km before fuel or hull integrity runs out.

## Deploy to Vercel

Import this project with the project root set to this folder. Vercel uses `npm run build` and the `dist` output directory.
