import { readBlockConfig, createOptimizedPicture, fetchIndex } from '../../../scripts/scripts.js';

export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  const index = cfg.typ === 'Kategorie' ? 'kategorie-index' : 'ernaehrungsform-index';

  block.textContent = '';

  // Fetch items from index
  const indexContent = await fetchIndex(index);

  // TODO: Limit to one row and add buttons to navigate between items
  // and to toggle display of one row or all items

  const carousel = document.createRange().createContextualFragment('<div class="carousel-content"></div>');

  indexContent.data.forEach((item) => {
    const card = document.createRange().createContextualFragment(`<div class="carousel-item">
        <a href="${item.path}">
          <div class="carousel-item-image">
            <picture>
              <img src="${item.thumbnail}" alt="${item.title}" />
            </picture>
          </div>
          <div class="carousel-item-title">
            ${item.name}
          </div>
        </a>
      </div>`);

    carousel.firstChild.appendChild(card);
  });

  carousel.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '158' }])));

  block.appendChild(carousel);
}
