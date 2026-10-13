import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const source = await readFile('analytics.js', 'utf8');
const configuration = { window: {} };
vm.runInNewContext(await readFile('analytics-config.js', 'utf8'), configuration);
assert.match(configuration.window.COZ_ANALYTICS.measurementId, /^G-[A-Z0-9]+$/);
assert.equal(configuration.window.COZ_ANALYTICS.enabled, true);
function run({ hostname = 'cozcos.com', protocol = 'https:', enabled = true, measurementId = 'G-TEST123', choice = null } = {}) {
  const nodes = [];
  const scripts = [];
  const settings = ['declined', 'accepted'].map(value => element('button', value));
  function element(tag, choiceValue) {
    return { tag, children: [], listeners: {}, dataset: { analyticsChoice: choiceValue },
      append(...items) { this.children.push(...items); },
      setAttribute() {}, addEventListener(name, callback) { this.listeners[name] = callback; },
      remove() { this.removed = true; } };
  }
  const values = new Map(choice ? [['coz-analytics-choice', choice]] : []);
  const window = { COZ_ANALYTICS: { enabled, measurementId } };
  const sandbox = { window, URL, Date, location: { protocol, hostname, href: `${protocol}//${hostname}/?email=private@example.com#contact` },
    localStorage: { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) },
    document: { documentElement: { lang: 'zh-Hant' }, referrer: 'https://example.com/?secret=123', cookie: '',
      head: { append: node => scripts.push(node) }, body: { append: node => nodes.push(node) },
      createElement: element, querySelectorAll: () => settings, getElementById: () => null } };
  vm.runInNewContext(source, sandbox);
  return { window, nodes, scripts, settings, values };
}
for (const options of [{ enabled: false }, { measurementId: '' }, { hostname: 'localhost', protocol: 'http:' }, { hostname: 'stellar-pothos-be4f0b.netlify.app' }]) {
  const result = run({ ...options, choice: 'accepted' });
  assert.equal(result.scripts.length, 0);
  assert.equal(result.nodes.length, 0);
}
assert.equal(run({ choice: 'declined' }).scripts.length, 0);
const firstVisit = run();
assert.equal(firstVisit.scripts.length, 0, 'No Google request before consent');
assert.equal(firstVisit.nodes.length, 1);
firstVisit.nodes[0].children.find(node => node.tag === 'button' && node.textContent === '允許').listeners.click();
assert.equal(firstVisit.scripts.length, 1);
const config = firstVisit.window.dataLayer.find(args => args[0] === 'config');
assert.equal(config[2].page_location, 'https://cozcos.com/');
assert.equal(config[2].page_referrer, 'https://example.com/');
assert.equal(config[2].allow_google_signals, false);
assert.equal(firstVisit.window.dataLayer.filter(args => args[0] === 'config').length, 1);
assert.equal(firstVisit.window.dataLayer.filter(args => args[0] === 'event' && args[1] === 'page_view').length, 0);
firstVisit.settings[0].listeners.click();
assert.equal(firstVisit.window['ga-disable-G-TEST123'], true);
firstVisit.settings[1].listeners.click();
assert.equal(firstVisit.window['ga-disable-G-TEST123'], false);
assert.equal(firstVisit.scripts.length, 1, 'Preference changes must not duplicate scripts');
assert.equal(run({ hostname: 'www.cozcos.com', choice: 'accepted' }).scripts.length, 1);
const actual = run({ ...configuration.window.COZ_ANALYTICS, choice: 'accepted' });
assert.equal(actual.scripts[0].src, 'https://www.googletagmanager.com/gtag/js?id=' + configuration.window.COZ_ANALYTICS.measurementId);
for (const page of ['index.html','en.html','zh.html','about.html','about-zh.html','faq.html','faq-zh.html','privacy.html','pricing.html','pricing-zh.html','characters.html','characters-zh.html','events.html','events-zh.html']) {
  const html = await readFile(page, 'utf8');
  assert.ok(html.includes('src="/analytics-config.js" defer'));
  assert.ok(html.includes('src="/analytics.js" defer'));
  assert.ok(html.indexOf('src="/analytics-config.js"') < html.indexOf('src="/analytics.js"'));
}
console.log('Analytics: production guard, opt-in, opt-out, sanitized URLs and single initialization OK');
