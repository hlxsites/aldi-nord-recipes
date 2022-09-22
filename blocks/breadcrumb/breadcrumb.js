import { readBlockConfig, decorateIcons } from '../../scripts/scripts.js';

export default function decorate(block) {
    block.textContent = '';

    let paths = document.location.pathname.split('/');
    console.log(paths)
    // replace first item, /, with home text
    paths[0] = "startseite"
    let href = "";
    let ul = document.createElement('ul');
    // go through the path segments
    paths.forEach((element, i) => {
        let li = document.createElement('li');

        // arrow icon, unless root
        if (i != 0) {
            let span = document.createElement('span');
            span.setAttribute("class", "icon icon-arrow-right");
            li.append(span);
        }

        // add link
        if (i !== paths.length -1) {
            let a = document.createElement('a');
            if (i != 0) {
                href += "/" + element;
                a.setAttribute("href", href + ".html");
            } else {
                a.setAttribute("href", "/");
            }

            a.innerText = element;
            li.append(a)
        } else {
            li.append(element)
        }

        ul.append(li);
    });
    block.append(ul);
    decorateIcons(block);
}