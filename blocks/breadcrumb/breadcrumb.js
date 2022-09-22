import { decorateIcons } from '../../scripts/scripts.js';

export default function decorate(block) {
  block.textContent = '';

  const paths = document.location.pathname.split('/');
  const ul = document.createElement('ul');
  // DEMO: we have no homepage, rezepte is the root page
  paths.shift();
  paths[0] = 'rezepte';
  const li = document.createElement('li');
  const a = document.createElement('a');
  a.append('Startseite');
  a.setAttribute('href', '/');
  li.append(a);
  ul.append(li);

  // go through the path segments
  let href = '';
  paths.forEach((element, i) => {
    const liEntry = document.createElement('li');

    // arrow icon, unless root
    const span = document.createElement('span');
    span.setAttribute('class', 'icon icon-arrow-right');
    liEntry.append(span);

    // add link, if not page itself
    if (i !== paths.length - 1) {
      const link = document.createElement('a');
      if (i !== 0) {
        href += '/' + element;
        link.setAttribute('href', href + '.html');
      } else {
        link.setAttribute('href', '/');
      }

      link.innerText = element;
      liEntry.append(a);
    } else {
      liEntry.append(element);
    }

    ul.append(liEntry);
  });
  block.append(ul);
  decorateIcons(block);
}
