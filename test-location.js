const { JSDOM } = require('jsdom');
const dom = new JSDOM();
const window = dom.window;

Object.defineProperty(window, 'location', {
  value: { href: 'http://localhost/' },
  writable: true
});

window.location.href = "/login";
console.log(window.location.href);
