export default function decorate(block) {

    let flexDiv = document.createElement('div');

    [...block.children].forEach(row => {
        let anchor = row.children[1].children[0].getAttribute('href')
        let title = row.children[0].innerHTML;
        console.log(anchor, title);
        let a = document.createElement('a');
        a.setAttribute('class', 'tocButton');
        a.setAttribute('href', anchor)
        let span = document.createElement('span');
        span.setAttribute('class', "tocTitle");
        span.innerText = title;
        a.append(span);
        flexDiv.append(a);
    });

    block.textContent = '';
    block.append(flexDiv)
}