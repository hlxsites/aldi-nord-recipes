import { decorateIcons } from '../../../scripts/scripts.js';

// extract the infos from the block
function getCfg(block) {
  let cfg = { rezeptinfo: {}, zutaten: [], zubereitung: "" };
  let active = "rezeptinfo";

  [...block.children].forEach(element => {

    // check for table section change
    switch (element.children[0].innerText) {
      case 'Zutaten':
        active = 'zutaten';
        return;
      case 'Zubereitung':
        active = 'zubereitung';
        return;
    }

    // fil content for different sections
    switch (active) {
      case 'rezeptinfo':
        // recipe info as object
        cfg[active][element.children[0].innerText] = element.children[1].innerText;
        break;
      case 'zutaten':
        // incredients as 2 dim array
        if (element.children.length === 2) {
          cfg[active].push([element.children[0].innerText, element.children[1].innerText]);
        } else {
          cfg[active].push([element.children[0].innerText]);
        }
        break;
      case 'zubereitung':
        // description as plain DOM object
        cfg[active] = element.children[0];
        break;
      }
  });
  return cfg;
}

// create dom for level, prepare and cook time info
function getRecipeInfoDOM(cfg) {
  // calc prep and cook time in hours and minutes
  let prepTime = `${cfg.Vorbereitung % 60}Min`;
  const prepHrs = Math.floor(cfg.Vorbereitung / 60);
  if (prepHrs > 0) {
    prepTime = `${prepHrs}Std ${prepTime}`;
  }

  let cookTime = `${cfg.Kochzeit % 60}Min`;
  const cookHrs = Math.floor(cfg.Kochzeit / 60);
  if (cookHrs > 0) {
    cookTime = `${cookHrs}Std ${cookTime}`;
  }

  return document.createRange().createContextualFragment(`
    <div class='recipe-info'>
      <div class='recipe-icon'>
        <div class='recipe-level-icons'>
          <span class='icon icon-recipe-level'></span>  
          <span class='icon icon-recipe-level'></span>  
          <span class='icon icon-recipe-level'></span>  
        </div>
        <p class='recipe-level-descr'>${cfg.Level}</p>
      </div>
      <div class='recipe-icon'>
        <div class='recipe-prep-icon'>
          <span class='icon icon-recipe-prep'></span>
        </div>
        <p>${prepTime}</p>
      </div>
      <div class='recipe-icon'>
        <div class='recipe-cook-icon'>
          <span class='icon icon-recipe-cook'></span>
        </div>
        <p>${cookTime}</p>
      </div>
    </div>
  `);
}

// create table for list of ingredients and addtional infos
function getIngredientsDOM(cfg, portions,saisonal) {
  // start table
  const table = document.createRange().createContextualFragment(`
  <table class='recipe-list'>
    <tbody>
      <tr>
        <th colspan='2' class='h4'>${portions} Portionen</th>
      </tr>
    </tbody>
  </table>
  `);

  const tbody = table.children[0].querySelector('tbody');
  let row,cell,th;
  // go through list of ingredients
  cfg.forEach(element => {
    row = tbody.insertRow();
    // if its a subtitle
    if (element.length === 1) {
      th = document.createElement('th');
      th.setAttribute('class','h4')
      th.setAttribute('colspan','2')
      th.innerHTML = element[0];
      row.append(th)
      
    } else {
      // ingredient entry
      cell = row.insertCell();
      cell.innerHTML = element[0];
      cell = row.insertCell();
      cell.innerHTML = element[1];
    }
  });

  // if season text is required
  if (saisonal.toLowerCase() === "ja") {
    row = tbody.insertRow();
    th = document.createElement('th');
    th.setAttribute('class','h4')
    th.setAttribute('colspan','2')
    th.innerHTML = 'Saisonbedingt sind leider nicht alle Artikel dauerhaft in unserem Sortiment verfügbar';
    row.append(th)
  }

  return table;
}

// render the DOM structure required for tab switching
function getSwitcherDOM(ingredientsContent, descriptionContent) {
  const tabs = document.createRange().createContextualFragment(`
  <div class='switch'>

      <input name="tab" type="radio"  id='ingredients' checked="checked">
      <label for='ingredients'>Zutaten</label>
      <div class='ingredients-content'>


    </div>

      <input name="tab" type="radio" id='description' >
      <label for='description' >Zubereitung</label>

      <div class='description-content'>
      </div>

  </div
  `);
  tabs.children[0].querySelector('.ingredients-content').appendChild(ingredientsContent)
  tabs.children[0].querySelector('.description-content').appendChild(descriptionContent)
  return tabs;
}

// render the DOM for the description text
function getDescriptionDOM(cfg) {
  cfg.setAttribute('class', 'recipe-description');
  return cfg;
}

export default function decorate(block) {
  // extract the 3 blocks
  const cfg = getCfg(block);
  // clean the block
  block.textContent = '';

  // render the recipe info
  block.append(getRecipeInfoDOM(cfg.rezeptinfo));

  // render the tab switcher 
  block.append(getSwitcherDOM(
    getIngredientsDOM(cfg.zutaten, cfg.rezeptinfo.Portionen, cfg.rezeptinfo.Saisonal),
    getDescriptionDOM(cfg.zubereitung)));

  // render footer with links
  block.append(document.createRange().createContextualFragment(`
    <div class='cta'>
      <button class="secondary" href="">
        <span class='icon icon-mail'></span>
        Per E-Mail versenden
      </button>
      <button type="button" class="primary">
        <span class="icon icon-print"></span>
        Drucken
      </button>
    </div>
  `))
  decorateIcons(block);
}


