export default function decorate(block) {
    // hero title is embeddd in the image itself
    // so only take the image
    const picture = block.querySelector('picture');
    block.textContent = '';
    block.append(picture);
}