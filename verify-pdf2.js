const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  const consoleErrors = [];
  const consoleWarnings = [];
  page.on('console', m => {
    if (m.type() === 'error') consoleErrors.push(m.text());
    if (m.type() === 'warning' && m.text().includes('oklab')) consoleWarnings.push(m.text());
  });

  await page.goto('http://localhost:3000/reportes', { timeout: 20000 });
  await page.waitForSelector('text=Reporte de Exportación', { timeout: 10000 });
  await page.waitForTimeout(1500);

  // Click export — watch for the spinner then success
  await page.click('button:has-text("Exportar PDF")');
  console.log('PDF generation started…');

  // Wait for spinner to appear
  await page.waitForSelector('text=Generando...', { timeout: 5000 })
    .catch(() => console.log('(spinner not detected — may be fast)'));

  // Wait for button to return to normal (export done)
  await page.waitForSelector('text=Exportar PDF', { timeout: 40000 });
  console.log('PDF button restored — export finished.');

  // Let any remaining events settle
  await page.waitForTimeout(1000);

  const oklab = consoleErrors.filter(e => e.includes('oklab') || e.includes('oklch'));
  const other = consoleErrors.filter(e => !e.includes('oklab') && !e.includes('oklch'));

  if (oklab.length > 0) {
    console.error('❌ oklab errors still present:', oklab.slice(0, 3));
    process.exit(1);
  }
  if (other.length > 0) {
    console.log('⚠ Other console errors:', other.slice(0, 3));
  }
  console.log('✅ No oklab/oklch errors during PDF export!');

  // Screenshot showing PDF button is back to normal state
  await page.screenshot({ path: '/tmp/pdf-after-export.png' });

  await browser.close();
})().catch(e => { console.error('FAIL:', e.message); process.exit(1); });
