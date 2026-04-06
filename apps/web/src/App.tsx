// dCredit Web App — apps/web/src/App.tsx
// This is the entry point for the production React + NestJS full-stack version.
// For the Replit preview, see artifacts/dcredit/ which is the standalone frontend MVP.
//
// To integrate with the NestJS API:
// 1. Copy business logic from packages/core and packages/i18n
// 2. Replace mock data with real API calls to /api/* routes
// 3. Add React Router routes for authentication, dashboard, etc.

function App() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ color: '#0f766e' }}>dCredit</h1>
      <p style={{ color: '#475569' }}>
        <em>Your debt, made clear.</em>
      </p>
      <hr style={{ borderColor: '#e2e8f0', margin: '1.5rem 0' }} />
      <p>
        This is the <strong>apps/web</strong> scaffold — the production React frontend that connects
        to the NestJS API backend.
      </p>
      <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
        To see the working dCredit MVP (frontend-only with mock data), switch to the{' '}
        <strong>dCredit</strong> artifact in the preview pane.
      </p>
      <h2 style={{ fontSize: '1.1rem', marginTop: '2rem' }}>Next steps:</h2>
      <ol style={{ lineHeight: 2, color: '#334155' }}>
        <li>Spin up the Docker stack: <code>pnpm docker:up</code></li>
        <li>Start the NestJS API: <code>pnpm dev:api</code></li>
        <li>Start this web app: <code>pnpm dev:web</code></li>
        <li>Check Mailpit UI at <a href="http://localhost:8025">http://localhost:8025</a></li>
      </ol>
    </div>
  );
}

export default App;
