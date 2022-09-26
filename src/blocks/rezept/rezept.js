import { decorateIcons } from '../../../scripts/scripts.js';

// extract the infos from the block
function getCfg(block) {
  let cfg = { rezeptinfo: {}, zutaten: [], zubereitung: "" };
  let active = "rezeptinfo";

  [...block.children].forEach(element => {
    if (element.children[0].innerText === "Zutaten") {
      active = "zutaten";
      return;
    }
    if (element.children[0].innerText === "Zubereitung") {
      active = "zubereitung";
      return;
    }
    if (active === "rezeptinfo") {
      cfg[active][element.children[0].innerText] = element.children[1].innerText;
    }
    if (active === "zutaten") {
      if (element.children.length === 2) {
        cfg[active].push([element.children[0].innerText, element.children[1].innerText]);
      } else {
        cfg[active].push([element.children[0].innerText]);
      }
    }
    if(active === "zubereitung") {
        cfg[active] = element.children[0];
    }
  });
  console.log(cfg);
  return cfg;
}

function getRecipeInfoDOM(cfg) {
  return document.createRange().createContextualFragment(
    `<div class='recipe-info'>
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
        <p>${cfg.Vorbereitung}</p>
      </div>
      <div class='recipe-icon'>
        <div class='recipe-cook-icon'>
          <span class='icon icon-recipe-cook'></span>
        </div>
        <p>${cfg.Kochzeit}</p>
      </div>
    </div>`
  );


  const kochzeitDiv = document.createElement("div");
  kochzeitDiv.setAttribute('class', 'recipe-icon');
  kochzeitDiv.append(cfg.Kochzeit)
  infoDiv.append(kochzeitDiv);

  return infoDiv;
}

function getIngredientsDOM(cfg, portions){
  // start table
  const listTable = document.createElement("table");
  listTable.setAttribute('class','recipe-list');
  const tBody = document.createElement('tbody');
  listTable.append(tBody);
  // first entry is number of portions
  let tr = document.createElement('tr');
  let th = document.createElement('th');
  th.setAttribute('class','h4');
  th.setAttribute('colspan','2');
  th.append(`${portions} Portionen` )
  tr.append(th); 
  tBody.append(tr);

  // go through list of ingridients
  cfg.forEach(element => {
    let tr = document.createElement('tr');
    // if its a subtitle
    if (element.length === 1) {
      let th = document.createElement('th');
      th.setAttribute('class','h4');
      th.setAttribute('colspan','2');
      th.append(element[0])
      tr.append(th);
    } else {
      // add ingredient 
      let amount = document.createElement('td');
      amount.innerHTML = element[0];
      let descr = document.createElement('td');
      descr.innerHTML = element[1];
      tr.append(amount,descr);
    }
    tBody.append(tr);
  });
  return listTable;

}

function getSwitcherDOM() {
  return document.createRange().createContextualFragment("<div><div>Zutaten</div><div>Zubereitung</div></div");
}

function getDescriptionDOM(cfg){
  cfg.setAttribute('class','recipe-description');
  return cfg;
}

export default function decorate(block) {
  // extract the 3 blocks
  const cfg = getCfg(block);
  // clean the block
  block.textContent = '';
  // render the recipe info
  block.append(getRecipeInfoDOM(cfg.rezeptinfo));
  // render the switcher 
  block.append(getSwitcherDOM());
  // render list of ingedients
  block.append(getIngredientsDOM(cfg.zutaten,cfg.rezeptinfo.Portionen));
  // render the description
  block.append(getDescriptionDOM(cfg.zubereitung));
  // render footer with links
  decorateIcons(block);
}


