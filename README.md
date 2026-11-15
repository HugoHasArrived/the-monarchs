# Orbital Lab — Space Mission Design Game

## Deploy to Vercel
1. Extract this ZIP so that `package.json`, `index.html`, and `src/` are at the project root.
2. Import the project into Vercel (or upload the extracted project to your Git repository).
3. Set **Root Directory** to the folder containing `package.json` (not its parent).
4. Use the defaults in `vercel.json`: `npm run build` and output directory `dist`.
5. Deploy.

## Run locally
```bash
npm install
npm run dev
```

## Important
The Vite entry point is `src/main.js`, imported by the root `index.html`.
Make sure `src/main.js` is committed/present in the same Vercel project root.
The `npm warn Unknown env config "cache-dir"` message is an environment configuration warning;
it is separate from the fatal missing-entry-point build error.
