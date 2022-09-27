import { decorateIcons, createOptimizedPicture } from '../../../scripts/scripts.js';

export default async function decorate(block) {
  const resp = await fetch('/header.plain.html');
  const html = await resp.text();
  const headerSource = document.createRange().createContextualFragment(html);

  // Extract logo from header
  const logo = headerSource.querySelector('picture');

  // Hardcode complete header
  const headerFragment = document.createRange().createContextualFragment(`
    <div class="header-meta-wrapper">
      <div class="header-meta">
        <div class="header-meta-usp">Beste Qualität zum Original ALDI Preis.</div>
        <div class="header-meta-navigation">
          <ul>
            <li>
                <a href="/tools/kontakt.html">Kontakt</a>
            </li>
            <li>
                <a href="/karriere">Karriere</a>
            </li>
            <li>
                <a href="/unternehmen">Unternehmen</a>
            </li>
        </ul>
      </div>
    </div>
  </div>
  <div class="header-tools-wrapper">
    <div class="header-tools">
      <div class="header-tools-logo"></div>
      <div class="header-tools-search">
        <form>
          <div class="searchbox">
            <input autocomplete="off" autocorrect="off" autocapitalize="off" enterkeyhint="search" spellcheck="false" placeholder="Produkte und Angebote finden" maxlength="512" type="search" />
            <span class="icon icon-search"></span>
          </div>
        </form>
      </div>
      <div class="header-tools-storepicker">
        <a href="/filialen-und-oeffnungszeiten.html">
          <span class="icon icon-storefinder"></span>
          <span>Filialsuche</span>
        </a>
      </div>
      <div class="header-tools-cart">
        <a href="/einkaufsliste.html">
          <span class="icon icon-list"></span>
          <span>Einkaufsliste</span>
        </a>
      </div>
    </div>
  </div>
  <div class="header-navigation-wrapper">
    <div class="header-navigation">
      <ul>
        <li>
          <a href="/angebote.html">
            <span class="icon icon-offers"></span>
            <span>Angebote</span>
          </a>
        </li>
        <li>
          <a href="https://www.aldi-onlineshop.de">
            <span class="icon icon-cart"></span>
            <span>ALDI ONLINESHOP</span>
          </a>
        </li>
        <li>
          <a href="/prospekte.html">
            <span class="icon icon-magazine"></span>
            <span>Prospekte</span>
          </a>
        </li>
        <li>
          <a href="/sortiment.html">
            <span class="icon icon-products"></span>
            <span>Produkte</span>
          </a>
        </li>
        <li>
          <a href="/rezepte.html">
            <span class="icon icon-recipe"></span>
            <span>Rezepte</span>
          </a>
        </li>
        <li>
          <a href="/ratgeber-tipps.html">
            <span class="icon icon-themes"></span>
            <span>Ratgeber &amp; Tipps</span>
          </a>
        </li>
      </ul>
    </div>
  </div>`);

  block.innerHTML = '';
  const logoContainer = headerFragment.querySelector('.header-tools-logo');
  logoContainer.appendChild(logo);
  logoContainer.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '80', height: '84' }])));
  logoContainer.querySelector('img').setAttribute('width', 80);
  logoContainer.querySelector('img').setAttribute('height', 84);
  block.appendChild(headerFragment);
  decorateIcons(block);
}
