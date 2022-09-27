import { createOptimizedPicture } from '../../../scripts/scripts.js';
export default function decorate(block) {
  const cols = [...block.firstElementChild.children];

  if (cols.length === 2) {
    const apps = cols[0];
    const form = cols[1];
    apps.classList.add('newsletter-apps');
    form.classList.add('newsletter-form'); // Apps

    const appContent = document.createElement('div');
    appContent.classList.add('newsletter-apps-content');
    const left = document.createElement('div');
    const right = document.createElement('div');
    appContent.appendChild(left);
    appContent.appendChild(right); // Move image to left

    const appImageContainer = apps.querySelector('.newsletter-apps > p');
    left.appendChild(appImageContainer.querySelector('picture'));
    left.querySelectorAll('img').forEach(img => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{
      width: '80'
    }])));
    left.querySelector('img').setAttribute('width', 80);
    left.querySelector('img').setAttribute('height', 80);
    apps.removeChild(appImageContainer); // Move remaining content to right

    apps.childNodes.forEach(elem => {
      apps.removeChild(elem);
      right.appendChild(elem);
    });
    right.querySelectorAll('img').forEach((img, i) => {
      const parent = img.parentNode.parentNode;
      const width = i === 0 ? 120 : 133;
      const height = 40;
      img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{
        width
      }]));
      parent.querySelector('img').setAttribute('width', width);
      parent.querySelector('img').setAttribute('height', height);
    });
    apps.appendChild(appContent); // Newsletter Form

    const formContainer = document.createRange().createContextualFragment(`<form>
      <label aria-hidden="false" for="email">E-Mail-Adresse eingeben</label>
      <input type="email" name="email" placeholder="E-Mail-Adresse eingeben">
      <button type="submit">ZUR ANMELDUNG</button>
    </form>`);
    form.appendChild(formContainer);
  }
}