# Orbital Lab — Interactive Space Mission Simulator

A Vite-powered browser game where you design a spacecraft, configure a science mission, and pilot a rocket through an arcade-style ascent simulation.

## Run locally

```bash
npm install
npm run dev
```

## Build for production

```bash
npm run build
```

The production site is generated in `dist/`. The included `vercel.json` configures Vercel to use the Vite build and `dist` output directory.

## Flight controls

- `Space`: ignite / add thrust
- `W` / `S`: throttle up / down
- `A` / `D` or arrow keys: steer
- `E`: deploy shield
- `Q`: scan pulse (collect nearby science and salvage)
- `Shift`: boost
- `P`: pause / resume
- Mouse / touch: move over the flight window to steer; tap the window to launch
- On-screen buttons: hold to steer, throttle, and boost

## Game modes

- **Serious:** precision flight, controlled ascent, and solar-wind events.
- **Chaos:** faster hazards, alien-party flight events, and bigger arcade rewards.

## Interactive flight features

- Science beacons, fuel cells, repair kits, and bonus caches
- Scan pulse with a cooldown
- Deployable defensive shield
- Boost energy and throttle management
- Asteroid collisions, hull damage, and combo scoring
- Dynamic flight events, mission scoring, and local high-score tracking

This is an educational game simulation, not a real spacecraft flight model.
