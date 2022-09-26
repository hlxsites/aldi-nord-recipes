import { decorateIcons } from '../../../scripts/scripts.js';
export default function decorate(block) {
  block.textContent = '';
  const paths = document.location.pathname.split('/').filter(p => p);
  const ul = document.createElement('ul');
  const li = document.createElement('li');
  const a = document.createElement('a');
  a.append('Startseite');
  a.setAttribute('href', '/');
  li.append(a);
  ul.append(li); // go through the path segments

  let href = '';
  paths.forEach((element, i) => {
    const liEntry = document.createElement('li'); // arrow icon, unless root

    const span = document.createElement('span');
    span.setAttribute('class', 'icon icon-arrow-right');
    liEntry.append(span); // add link, if not page itself

    if (i === paths.length - 1) {
      // Take page name from metadata, if available
      const name = document.querySelector('head > meta[name="name"]').getAttribute('content') || element;
      liEntry.append(name.replace('ernaehrungsform', 'ernährungsform'));
    } else {
      const link = document.createElement('a');
      href += `/${element}`;
      link.setAttribute('href', href);
      link.innerText = element.replace('ernaehrungsform', 'ernährungsform');
      liEntry.append(link);
    }

    ul.append(liEntry);
  });
  block.append(ul);
  decorateIcons(block);
}