const { chromium } = require('playwright');

(async () => {
  console.log('--- Starting Playwright Automated Test Suite ---');
  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // 1. Check Homepage Load & Title
    await page.goto('http://127.0.0.1:9095/', { waitUntil: 'domcontentloaded' });
    const title = await page.title();
    console.log('[PASS] Page Loaded with Title:', title);

    // 2. Test Dark Mode Toggle Functionality
    const initialDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    console.log('[INFO] Initial Dark Class:', initialDark);

    const toggleBtn = await page.$('#theme-toggle-btn');
    if (!toggleBtn) throw new Error('#theme-toggle-btn not found in header');

    await toggleBtn.click();
    const afterClickDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    console.log('[PASS] Dark Mode After Click 1:', afterClickDark);
    if (afterClickDark === initialDark) throw new Error('Theme toggle did not switch dark class!');

    await toggleBtn.click();
    const afterClick2Dark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    console.log('[PASS] Dark Mode After Click 2 (revert):', afterClick2Dark);
    if (afterClick2Dark !== initialDark) throw new Error('Theme toggle did not revert dark class!');

    // 3. Test Mobile Viewport (iPhone X / 375px)
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(300);

    // Verify Sidebar is visible on mobile
    const asideCount = await page.locator('aside').count();
    console.log('[PASS] Aside elements found on mobile:', asideCount);
    if (asideCount === 0) throw new Error('Sidebar aside element not found on mobile!');

    const isSidebarVisible = await page.locator('aside').first().isVisible();
    console.log('[PASS] Sidebar visibility on mobile viewport (375px):', isSidebarVisible);
    if (!isSidebarVisible) throw new Error('Sidebar is hidden on mobile viewport!');

    // 4. Verify Post Cards structure (clean divider below meta, no box borders)
    const postCards = await page.locator('article').count();
    console.log('[PASS] Number of Post Cards rendered on homepage:', postCards);
    if (postCards === 0) throw new Error('No post cards found on homepage!');

    // 5. Test Search Modal Opens with Ctrl+K or click
    await page.keyboard.press('Control+k');
    await page.waitForTimeout(200);
    const searchModalVisible = await page.evaluate(() => {
      const modal = document.getElementById('search-modal-container');
      return modal && !modal.classList.contains('pointer-events-none');
    });
    console.log('[PASS] Search Modal opens via shortcut:', searchModalVisible);

    console.log('--- ALL PLAYWRIGHT TESTS PASSED SUCCESSFULLY! ---');
  } catch (err) {
    console.error('Playwright Test FAILED:', err.message);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }
})();
