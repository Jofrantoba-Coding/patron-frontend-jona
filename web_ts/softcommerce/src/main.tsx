import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'jona-ui/index.css';
import { App } from './App';
import { composeServices } from './services/serviceComposer';
import { createSessionStore } from './session/sessionStore';

const root = ReactDOM.createRoot(document.getElementById('root')!);

try {
  const store = createSessionStore(sessionStorage);
  // A configuration error (bad VITE_API_*) throws here, before any request.
  const services = composeServices(import.meta.env, {
    getSession: store.getContext,
    getRequestContext: store.getRequestContext,
    getGrants: () => store.getSnapshot().session?.grants,
  });
  root.render(
    <React.StrictMode>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App services={services} store={store} />
      </BrowserRouter>
    </React.StrictMode>,
  );
} catch (error) {
  root.render(<pre role="alert">{error instanceof Error ? error.message : String(error)}</pre>);
}
