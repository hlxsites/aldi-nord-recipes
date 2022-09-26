import { decorateIcons } from '../../../scripts/scripts.js'; // extract the infos from the block

function getCfg(block) {
  let cfg = {
    rezeptinfo: {},
    zutaten: [],
    zubereitung: ""
  };
  let active = "rezeptinfo";
  [...block.children].forEach(element => {
    if (element.children[0].innerText === "Zutaten") {
      active = "zutaten";
      return;
    }

    if (element.children[0].innerText === "Zubereitung") {
      active = "zubereitung";
      return;
    } // recipe info as object


    if (active === "rezeptinfo") {
      cfg[active][element.children[0].innerText] = element.children[1].innerText;
    } // incredients as 2 dim array


    if (active === "zutaten") {
      if (element.children.length === 2) {
        cfg[active].push([element.children[0].innerText, element.children[1].innerText]);
      } else {
        cfg[active].push([element.children[0].innerText]);
      }
    } // description as plain DOM object


    if (active === "zubereitung") {
      cfg[active] = element.children[0];
    }
  });
  console.log(cfg);
  return cfg;
}

function getRecipeInfoDOM(cfg) {
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

  return document.createRange().createContextualFragment(`<div class='recipe-info'>
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
    </div>`);
}
/* function getIngredientsDOM(cfg, portions){
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

  let row;
  // go through list of ingredients
  cfg.forEach(element => {
    // if its a subtitle
    if (element.length === 1) {
      row = document.createRange().createContextualFragment(`
      <tr><th class='h4' colspan='2'>${element[0]}</th></tr>`);
    } else {
      row = document.createRange().createContextualFragment(`
      <tr>
        <td>${element[0]}</td>
        <td>${element[1]}</td>
      </tr>
      `);
    }
    ......
  });

  return table;
}
 */


function getIngredientsDOM(cfg, portions) {
  // start table
  const listTable = document.createElement("table");
  listTable.setAttribute('class', 'recipe-list');
  const tBody = document.createElement('tbody');
  listTable.append(tBody); // first entry is number of portions

  let tr = document.createElement('tr');
  let th = document.createElement('th');
  th.setAttribute('class', 'h4');
  th.setAttribute('colspan', '2');
  th.append(`${portions} Portionen`);
  tr.append(th);
  tBody.append(tr); // go through list of ingridients

  cfg.forEach(element => {
    let tr = document.createElement('tr'); // if its a subtitle

    if (element.length === 1) {
      let th = document.createElement('th');
      th.setAttribute('class', 'h4');
      th.setAttribute('colspan', '2');
      th.append(element[0]);
      tr.append(th);
    } else {
      // add ingredient 
      let amount = document.createElement('td');
      amount.innerHTML = element[0];
      let descr = document.createElement('td');
      descr.innerHTML = element[1];
      tr.append(amount, descr);
    }

    tBody.append(tr);
  });
  return listTable;
}

function getSwitcherDOM(ingredientsContent, descriptionContent) {
  const tabs = document.createRange().createContextualFragment(`
  <div class='switch'>
    <div class='switch-ingredients'>
      <input name="tab" type="radio" checked="checked">
      <label>Zutaten<label>
      <div class='ingredients-content'>
      </div>
    </div>
    <div class='switch-prepare'>
      <input name="tab" type="radio" checked="checked">
      <label>Zubereitung<label>
      <div class='description-content'>
      </div>
    </div>
  </div`); // tabs.children[0].querySelector('ingredients-content').appendChild(ingredientsContent)
  // tabs.children[0].querySelector('description-content').appendChild(descriptionContent)

  return tabs;
}

function getDescriptionDOM(cfg) {
  cfg.setAttribute('class', 'recipe-description');
  return cfg;
}

export default function decorate(block) {
  // extract the 3 blocks
  const cfg = getCfg(block); // clean the block

  block.textContent = ''; // render the recipe info

  block.append(getRecipeInfoDOM(cfg.rezeptinfo)); // render the switcher 

  block.append(getSwitcherDOM(getIngredientsDOM(cfg.zutaten, cfg.rezeptinfo.Portionen, cfg.rezeptinfo.Saisonal), getDescriptionDOM(cfg.zubereitung)));
  block.append(getIngredientsDOM(cfg.zutaten, cfg.rezeptinfo.Portionen, cfg.rezeptinfo.Saisonal));
  block.append(getDescriptionDOM(cfg.zubereitung)); // render footer with links

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
  `));
  decorateIcons(block);
}