how to deploy 

## Add these scripts to `package.json`

```json
"start": "node dist/server.js",
"dev": "tsx watch ./src/server.ts",
"build": "tsc"
```

---

## Command

```bash
npm i tsup
```

---

## `tsup.config.ts`

```ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["esm", "cjs"], // Keep this as ESM
  target: "esnext",
  outDir: "dist",
  clean: true,
  bundle: true,
  splitting: false,
  sourcemap: true,

  // Add this banner to shim require() for CJS dependencies
  banner: {
    js: `
      import { createRequire } from 'module';
      const require = createRequire(import.meta.url);
    `,
  },
});
```

---

## Add these lines to `tsconfig.json`

```json
"include": ["src/**/*"],
"exclude": []
```

---

## Command

```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## `vercel.json`

```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/server.js"
    }
  ]
}
```
