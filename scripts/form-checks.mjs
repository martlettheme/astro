import assert from 'node:assert/strict';
import AxeBuilder from '@axe-core/playwright';
// Assertions deliberately fail the process; observations alone are not acceptance.
export async function formChecks(browser, base) {
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  const active = id => page.waitForFunction(id => document.activeElement?.id === id, id);
  const status = text => page.waitForFunction(text => document.querySelector('#status').textContent.includes(text), text);
  const fits = async () => assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), 'Form has no horizontal overflow');
  const axe = async label => {
    const { violations } = await new AxeBuilder({ page }).analyze();
    assert.deepEqual(violations.map(v => ({ id:v.id, nodes:v.nodes.map(n=>n.target) })), [], label);
  };
  try {
    await page.goto(base + '/form/');
    await page.locator('h1').waitFor(); await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('#submit').evaluate(e=>e.type), 'submit');
    assert.equal(await page.locator('#reset').evaluate(e=>e.type), 'reset');
    assert.equal(await page.locator('#default-button').evaluate(e=>e.type), 'button');
    assert.equal(await page.locator('#summary').isVisible(), false, 'Hidden summary stays hidden');
    assert.equal(await page.locator('#discard').isVisible(), false, 'Closed dialog stays closed');
    await page.locator('#default-button').click(); assert.equal(await page.locator('#summary').isVisible(), false, 'Default button does not submit');
    for (const mode of ['light', 'dark']) {
      if (mode === 'dark') await page.locator('#appearance').click();
      assert.equal(await page.locator('html').getAttribute('data-martlet'), mode);
      const colors = async selector => page.locator(selector).evaluate(e => ({ color:getComputedStyle(e).color, background:getComputedStyle(e).backgroundColor }));
      const primary = await colors('#submit'), secondary = await colors('#reset');
      assert.notDeepEqual(primary, secondary, 'Source profile preserves secondary action material');
      assert.notEqual(primary.color, primary.background, 'Primary text and background differ');
      assert.equal((await colors('#anchor-button')).color, primary.color, 'Anchor button retains on-action text');
      assert.equal(await page.locator('#disabled-button').evaluate(e=>getComputedStyle(e).backgroundColor), await page.locator('#disabled-button').evaluate(e=>{const probe=document.createElement('button');probe.className='martlet-button';probe.disabled=true;e.after(probe);const color=getComputedStyle(probe).backgroundColor;probe.remove();return color;}), 'Disabled secondary keeps disabled material');
      for (const type of ['checkbox', 'radio']) assert.ok(await page.locator(`input[type="${type}"]`).first().evaluate(e=>getComputedStyle(e).minHeight === '0px' && e.getBoundingClientRect().height < 32), 'Native choice geometry');
      await axe(mode+' form');
      for (const width of [320,360,1280]) { await page.setViewportSize({width,height:900}); await fits(); }
      await page.addStyleTag({content:'html{font-size:200% !important}'}); await fits();
      await page.screenshot({path:`artifacts/qa/form-${mode}-200pct.png`,fullPage:true});
      await page.reload(); if (mode === 'dark') await page.locator('#appearance').click();
    }
    await page.setViewportSize({width:1280,height:900}); await page.reload();
    await page.locator('#notes').fill('Keep this access requirement.');
    await page.locator('#submit').click(); await active('summary');
    assert.equal(await page.locator('#summary-errors a').count(),3);
    assert.equal(await page.locator('[aria-invalid="true"]').count(),3);
    assert.equal(await page.locator('#name').getAttribute('aria-describedby'),'name-hint name-error');
    await axe('Validation state');
    await page.locator('#summary a[href="#attendance-group"]').click(); await active('attendance-group');
    await page.locator('#summary a[href="#email"]').click(); await active('email');
    await page.locator('#name').fill('Alex Example'); await page.locator('#email').fill('alex@example.org');
    await page.locator('input[value="studio"]').check(); await page.locator('#reminder').check();
    await page.locator('#submit').click(); await status('Registering');
    assert.equal(await page.locator('#registration').getAttribute('aria-busy'),'true');
    assert.ok(await page.locator('#details').isDisabled()); await active('submit');
    await page.locator('#submit').dispatchEvent('click'); // duplicate activation is ignored by the controller
    await active('summary'); await status('failed');
    assert.equal(await page.locator('#notes').inputValue(),'Keep this access requirement.');
    assert.equal(await page.locator('#name').inputValue(),'Alex Example');
    assert.ok(await page.locator('#reminder').isChecked());
    await page.keyboard.press('Tab'); await active('retry'); await page.keyboard.press('Enter');
    await status('recorded'); await active('submit');
    assert.equal(await page.locator('#summary').isVisible(),false);
    await page.locator('#name').fill('Changed draft');
    await page.locator('#reset').click();
    await page.waitForFunction(()=>document.querySelector('#discard').matches(':modal'));
    assert.equal(await page.evaluate(()=>document.activeElement.textContent.trim()),'Keep editing');
    await page.keyboard.press('Escape'); await active('reset');
    assert.equal(await page.locator('#name').inputValue(),'Changed draft');
    await page.locator('#reset').click(); await page.locator('#discard button[value="keep"]').click(); await active('reset');
    assert.equal(await page.locator('#name').inputValue(),'Changed draft');
    await page.locator('#reset').click(); await page.locator('#discard button[value="discard"]').click(); await active('reset');
    assert.equal(await page.locator('#name').inputValue(),''); assert.equal(await page.locator('#notes').inputValue(),'');
    assert.equal(await page.locator('#summary').isVisible(),false);
    await page.emulateMedia({reducedMotion:'reduce'}); await axe('Reset form with reduced motion');
    assert.deepEqual(errors, [], 'No page errors');
    console.log('Form assertions passed: native types, source-profile contrast, both appearances, choice geometry, reflow, axe, validation/focus, duplicate-submit guard, retained failure/retry, native dialog reset.');
  } finally { await context.close(); }
}
