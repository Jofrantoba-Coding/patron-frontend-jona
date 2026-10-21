import { fileURLToPath } from 'node:url';
import { createApp } from './http/app.js';

const port = Number(process.env.PORT ?? 4020);
const dataDir = process.env.MOCK_DATA_DIR ?? fileURLToPath(new URL('./data', import.meta.url));

const { server } = createApp({ dataDir });
server.listen(port, () => {
  console.log(`SoftCommerce mock server on http://localhost:${port} (seed: ${dataDir})`);
});
