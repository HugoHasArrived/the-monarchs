# Orbital Lab — Space Mission Design Game

A Vite-powered, browser-based educational space mission design game. Players choose a science objective, configure a launch vehicle and trajectory, build a spacecraft, select instruments, review resource constraints, and run a mission simulation.

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

## Deploy to Vercel

1. Upload this project to a GitHub repository.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Vercel should detect Vite automatically. Use:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`
4. Click **Deploy**.

## Game features

- Four mission scenarios: Moon Mapper, Earth Watch, Red Planet Scout, and Solar Storm Sentinel.
- Three difficulty levels with different budgets.
- Launcher, orbit, spacecraft bus, power, communications, instrument, and upgrade selections.
- Live budget, mass, power, and communications telemetry.
- Engineering validation before launch.
- Mission event timeline, performance score, and printable report.
- Responsive desktop and mobile layout.

## Educational note

All numerical values and the simulation model are simplified for learning and gameplay. They are not flight-design data, engineering recommendations, or a substitute for NASA mission-analysis tools such as GMAT.
