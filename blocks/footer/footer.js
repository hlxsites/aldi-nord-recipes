import { readBlockConfig, decorateMain, loadBlocks } from '../../scripts/scripts.js';

/**
 * loads and decorates the footer
 * @param {Element} block The header block element
 */

export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  const footerPath = cfg.footer || '/footer';
  const resp = await fetch(`${footerPath}.plain.html`);
  const html = await resp.text();
  const footerFragment = document.createRange().createContextualFragment(html);
  const footer = document.createElement('div');
  footer.append(footerFragment);
  decorateMain(footer);
  await loadBlocks(footer);
  block.append(footer);
}
