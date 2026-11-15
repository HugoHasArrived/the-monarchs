# Orbital Lab — 100-Level Campaign Edition

A Vite-powered browser space-mission design and arcade flight game.

## Features
- Serious Mode and Chaos Mode.
- Spacecraft builder with launcher, orbit, bus, power, communications, science payloads, and upgrades.
- Interactive rocket flight with keyboard, mouse, and touch controls.
- 100-level campaign across 10 sectors.
- 10 rotating challenge types: beacon hunt, debris dodger, endurance run, shield specialist, score attack, salvage hunter, deep scan, combo master, clean flight, and fuel conservation.
- Increasing altitude targets and obstacle pressure as sectors progress.
- Level unlocks and campaign completion saved in browser local storage.
- Failed levels can be retried immediately; cleared levels unlock the next stage.

## Controls
- `Space`: Ignite / boost throttle
- `W` / `S`: Increase / decrease throttle
- `A` / `D` or arrow keys: Steer
- `E`: Deploy shield
- `Q`: Scanner pulse
- `Shift`: Boost
- `P`: Pause / resume
- Mouse or touch: Steer across the flight canvas

## Run locally
```bash
npm install
npm run dev
```

## Production build
```bash
npm run build
```

## Deploy to Vercel
Import the project folder containing `package.json`. The included `vercel.json` uses `npm run build` and publishes the `dist` directory.

Campaign progress is stored in the browser used to play the game. Clearing browser site data resets local progress.
