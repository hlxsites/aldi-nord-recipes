import { decorateIcons } from '../../scripts/scripts.js';

export default function decorate(block) {
    block.textContent = '';

    let paths = document.location.pathname.split('/');
    let ul = document.createElement('ul');

    // DEMO: we have no homepage, rezepte is the root page
    paths.shift();
    paths[0] = "rezepte"
    let li = document.createElement('li')
    let a = document.createElement('a')
    a.append("Startseite");
    a.setAttribute("href", "/")
    li.append(a);
    ul.append(li);

    // go through the path segments
    let href = "";
    paths.forEach((element, i) => {
        let li = document.createElement('li');

        // arrow icon, unless root

        let span = document.createElement('span');
        span.setAttribute("class", "icon icon-arrow-right");
        li.append(span);


        // add link, if not page itself
        if (i !== paths.length - 1) {
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