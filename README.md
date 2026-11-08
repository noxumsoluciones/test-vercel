# test-vercel

Express mínimo para probar si un mismo repo público puede desplegarse en **dos cuentas de Vercel** distintas, y luego con **CI/CD por rama**.

`/` y `/api/info` muestran la cuenta (`DEPLOY_ACCOUNT`), el entorno, la rama y el commit del despliegue.

## Local
```bash
npm install
npm run dev   # http://localhost:3000
```

## Pruebas
1. **CLI, cuenta A**: `vercel login` (cuenta A) → `vercel --prod`. Definir `DEPLOY_ACCOUNT=A` en el proyecto.
2. **CLI, cuenta B**: `vercel logout`, `vercel login` (cuenta B), borrar `.vercel/` → `vercel --prod`. `DEPLOY_ACCOUNT=B`.
3. **Integración Git**: importar el repo público desde el dashboard en cada cuenta y ver si ambas despliegan al hacer push.
4. **GitHub Actions** (`.github/workflows/deploy.yml`):
   - `main` → producción en cuenta A
   - `develop` → producción en cuenta B
   - PR a `main` → preview en cuenta A

   Secrets: `VERCEL_TOKEN_A/B`, `VERCEL_ORG_ID_A/B`, `VERCEL_PROJECT_ID_A/B` (los IDs salen de `.vercel/project.json` tras `vercel link`).
   Para esta fase, desconectar la integración Git en los proyectos (o añadir `"git": {"deploymentEnabled": false}` a `vercel.json`) para no desplegar dos veces.
