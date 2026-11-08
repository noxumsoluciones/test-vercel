import express from 'express';

const app = express();

// Muestra desde qué cuenta / entorno / rama se desplegó, para comparar las pruebas.
const info = () => ({
  cuenta: process.env.DEPLOY_ACCOUNT || 'no-definida',
  entorno: process.env.VERCEL_ENV || 'local',
  rama: process.env.VERCEL_GIT_COMMIT_REF || process.env.GIT_BRANCH || 'n/a',
  commit: (process.env.VERCEL_GIT_COMMIT_SHA || process.env.GIT_SHA || 'n/a').slice(0, 7),
  url: process.env.VERCEL_URL || 'localhost',
  region: process.env.VERCEL_REGION || 'local',
  fecha: new Date().toISOString(),
});

app.get('/', (_req, res) => {
  const i = info();
  res.type('html').send(`<!doctype html><meta charset="utf-8"><title>test-vercel</title>
<body style="font-family:system-ui;max-width:640px;margin:40px auto;padding:0 16px">
<h1>test-vercel</h1>
<table>${Object.entries(i).map(([k, v]) => `<tr><td><b>${k}</b></td><td>${v}</td></tr>`).join('')}</table>
<p><a href="/api/info">/api/info</a> · <a href="/api/health">/api/health</a></p></body>`);
});

app.get('/api/info', (_req, res) => res.json(info()));
app.get('/api/health', (_req, res) => res.json({ ok: true }));

export default app;
