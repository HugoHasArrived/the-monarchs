# Orbital Lab — Space Mission Design Game

A Vite-based interactive space mission design game with two distinct play styles and an arcade flight challenge.

## Play styles

- **Serious Mode:** mission-control presentation, controlled ascent, resource management, and a more restrained visual theme.
- **Chaos Mode:** faster debris and beacon spawns, playful flight callouts, and a brighter arcade theme.

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

## Flight controls

- `Space`: ignite engines / boost throttle
- `W` / `S`: increase / decrease throttle
- `A` / `D` or left/right arrows: steer
- `Shift`: use boost energy while held
- `E`: deploy the defensive shield (2.5 seconds, 9-second recharge)
- `P`: pause / resume
- On-screen controls support mouse and touch, including shield and boost.

Dodge debris, collect science beacons, build score multipliers, protect the vehicle with your shield, and reach 100 km before fuel or hull integrity runs out. Your best flight score is saved in the browser on that device.

## Deploy to Vercel

Import this project with the project root set to this folder. Vercel uses `npm run build` and the `dist` output directory.
