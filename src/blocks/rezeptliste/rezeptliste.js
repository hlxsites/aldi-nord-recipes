import { h, render } from '../../../scripts/preact.module.js';
import { readBlockConfig } from '../../../scripts/scripts.js';

const RezeptListe = (props) => {
  console.log('props', props);
  return <div className="rezeptliste block">
    <span>Hello Preact</span>
  </div>;
};

export default function decorate(block) {
  const cfg = readBlockConfig(block);

  block.textContent = '';
  render(<RezeptListe {...cfg} />, block.parentNode, block);
}
