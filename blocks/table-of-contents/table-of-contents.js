export default function decorate(block) {
  const flexDiv = document.createElement('div');

  [...block.children].forEach((row) => {
    const anchor = row.children[1].children[0].getAttribute('href');
    const title = row.children[0].innerHTML;
    const a = document.createElement('a');
    a.setAttribute('class', 'toc-button');
    a.setAttribute('href', anchor);
    const span = document.createElement('span');
    span.setAttribute('class', 'toc-title');
    span.innerText = title;
    a.append(span);
    flexDiv.append(a);
  });

  block.textContent = '';
  block.append(flexDiv);
}
