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

// Color por cuenta para distinguir a simple vista dónde cayó el despliegue.
const temas = {
  A: { fondo: '#0f172a', tarjeta: '#1e293b', acento: '#38bdf8', texto: '#e2e8f0' },
  B: { fondo: '#1a0f2e', tarjeta: '#2d1b4e', acento: '#f472b6', texto: '#f3e8ff' },
  default: { fondo: '#111', tarjeta: '#222', acento: '#a3e635', texto: '#eee' },
};

app.get('/', (_req, res) => {
  const i = info();
  const t = temas[i.cuenta] || temas.default;
  res.type('html').send(`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>test-vercel · cuenta ${i.cuenta}</title>
<style>
  body{margin:0;min-height:100vh;display:grid;place-items:center;background:${t.fondo};color:${t.texto};font-family:system-ui,sans-serif}
  .card{background:${t.tarjeta};border:1px solid ${t.acento}55;border-radius:16px;padding:28px 32px;width:min(560px,calc(100vw - 32px));box-shadow:0 0 40px ${t.acento}22}
  h1{margin:0 0 4px;font-size:1.6rem}
  .badge{display:inline-block;background:${t.acento};color:${t.fondo};font-weight:700;border-radius:999px;padding:4px 14px;margin-bottom:18px}
  table{width:100%;border-collapse:collapse}
  td{padding:6px 0;border-bottom:1px solid ${t.texto}15}
  td:first-child{color:${t.acento};width:35%}
  a{color:${t.acento}}
</style>
<div class="card">
  <h1>test-vercel</h1>
  <span class="badge">Cuenta ${i.cuenta} · ${i.entorno}</span>
  <table>${Object.entries(i).map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('')}</table>
  <p><a href="/api/info">/api/info</a> · <a href="/api/health">/api/health</a></p>
</div>`);
});

app.get('/api/info', (_req, res) => res.json(info()));
app.get('/api/health', (_req, res) => res.json({ ok: true }));

export default app;
