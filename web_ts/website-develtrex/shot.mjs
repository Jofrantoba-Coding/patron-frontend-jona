import { chromium } from 'playwright';

const BASE = 'http://localhost:5173';
const shots = [
  { path: '/', name: 'home-full', full: true },
  { path: '/', name: 'home-hero', full: false, clip: { x: 0, y: 0, width: 1440, height: 900 } },
  { path: '/contacto', name: 'contacto-full', full: true },
];

const browser = await chromium.launch({ args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });

// mobile page for responsive check
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });

for (const s of shots) {
  await page.goto(BASE + s.path, { waitUntil: 'networkidle' });
  await page.waitForTimeout(700);
  await page.screenshot({ path: `shots/${s.name}.png`, fullPage: s.full, ...(s.clip ? { clip: s.clip } : {}) });
  console.log('shot:', s.name);
}

await mobile.goto(BASE + '/', { waitUntil: 'networkidle' });
await mobile.waitForTimeout(600);
await mobile.screenshot({ path: 'shots/home-mobile.png', fullPage: false });
console.log('shot: home-mobile');

// console errors on home
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
console.log('CONSOLE_ERRORS:', errors.length ? errors.join(' | ') : 'none');

await browser.close();
