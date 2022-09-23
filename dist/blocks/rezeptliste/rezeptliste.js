import { h, render } from '../../../scripts/preact.module.js';
import { readBlockConfig } from '../../../scripts/scripts.js';

const RezeptListe = props => {
  console.log('props', props);
  return h("div", {
    className: "rezeptliste block"
  }, h("span", null, "Hello Preact"));
};

export default function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';
  render(h(RezeptListe, cfg), block.parentNode, block);
}