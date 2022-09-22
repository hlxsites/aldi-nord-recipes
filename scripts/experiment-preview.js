/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* eslint-disable no-console */
// eslint-disable-next-line import/no-cycle
import {
  loadCSS,
  toClassName,
  getMetadata,
} from './scripts.js';

const createVariant = (variantName, config) => {
  const variant = config.variants[variantName];
  const split = +variant.percentageSplit
    || 1 - config.variantNames.reduce((c, vn) => c + +config.variants[vn].percentageSplit, 0);
  const percentage = Math.round(split * 10000) / 100;
  const div = document.createElement('div');

  const experimentURL = new URL(window.location.href);
  // this will retain other query params such as ?rum=on
  experimentURL.searchParams.set('experiment', `${config.id}/${variantName}`);

  div.id = variantName;
  div.className = `hlx-variant${config.selectedVariant === variantName ? ' hlx-variant-selected' : ' '}`;
  div.innerHTML = `<div>
  <h5>${variantName}</h5>
    <p>${variant.label}</p>
    <p>${percentage}%</p>
    <p class="performance"></p>
  </div>
  <div class="hlx-button"><a href="${experimentURL.href}">Simulate</a></div>`;
  return (div);
};

function getExperimentVariantPopup(config) {
  const popup = document.createElement('div');
  popup.className = 'hlx-experiment hlx-popup hlx-hidden';
  popup.innerHTML = `
    <div class="hlx-popup-header">
      <div>
        <h4>${config.experimentName}</h4>
        <div class="hlx-details">${config.status}, ${config.audience}</div>
      </div>
      <div>
        <div class="hlx-button"><a href="${config.manifest}">Manifest</a></div>
      </div>
    </div>
    <div class="hlx-variants"></div>`;

  const variants = popup.querySelector('.hlx-variants');
  config.variantNames.forEach((vname) => {
    const variantDiv = createVariant(vname, config);
    variants.append(variantDiv);
  });
  return popup;
}

function getExperimentVariantSelectorInSidekick(config) {
  const div = document.createElement('div');
  div.className = 'experiment dropdown';

  const button = document.createElement('button');
  button.className = 'dropdown-toggle';
  button.innerHTML = 'Experiment';
  if (toClassName(config.status) === 'active') {
    button.style.backgroundColor = '#280';
  }
  div.append(button);

  const container = document.querySelector('helix-sidekick').shadowRoot.querySelector('.feature-container');
  container.prepend(div);

  return div;
}

/**
 * Create Badge if a Page is enlisted in a Helix Experiment
 * @return {Object} returns a badge or empty string
 */
function getExperimentVariantSelectorInOverlay(config) {
  const button = document.createElement('button');
  button.className = 'hlx-experiment hlx-badge';
  button.classList.add(`hlx-experiment-status-${toClassName(config.status)}`);
  button.innerHTML = 'Experiment <span class="hlx-open"></span>';
  return button;
}

function registerClickHandler(button, popup, config) {
  button.addEventListener('click', async () => {
    popup.classList.toggle('hlx-hidden');

    const sidekick = document.querySelector('helix-sidekick');
    if (sidekick) {
      const { x, width } = button.getBoundingClientRect();
      popup.style.right = `${window.innerWidth - x - width - 40}px`;
    }

    // the query is a bit slow, so I'm only fetching the results when the popup is opened
    const resultsURL = new URL('https://helix-pages.anywhere.run/helix-services/run-query@v2/rum-experiments');
    resultsURL.searchParams.set('experiment', config.experimentName);
    if (window.hlx.sidekickConfig && window.hlx.sidekickConfig.host) {
      // restrict results to the production host, this also reduces query cost
      resultsURL.searchParams.set('domain', window.hlx.sidekickConfig.host);
    }
    const resp = await fetch(resultsURL.href);
    const { results } = await resp.json();
    results.forEach((result) => {
      const nf = {
        format: (num) => `${Math.floor(num)}%`,
      };
      const variant = document.querySelector(`#${result.variant}`);
      if (variant) {
        const performance = variant.querySelector('.performance');
        performance.innerHTML = `
          <span>click rate: ${nf.format(100 * Number.parseFloat(result.variant_conversion_rate))}</span>
          <span>vs. ${nf.format(100 * Number.parseFloat(result.control_conversion_rate))}</span>
          <span>significance: ${nf.format(100 * Number.parseFloat(result.p_value))}</span> <!-- everything below 95% is not good enough for the social sciences to be considered significant --->
        `;
      }
    });
  });
}

async function createPreviewOverlay() {
  const experiment = toClassName(getMetadata('experiment'));
  if (!experiment) {
    return;
  }

  const config = window.hlx && window.hlx.experiment;
  if (!config) {
    return;
  }

  const sidekick = document.querySelector('helix-sidekick');

  loadCSS('/styles/experiment-preview.css');
  const overlay = document.createElement('div');
  overlay.className = 'hlx-preview-overlay';

  const popup = getExperimentVariantPopup(config);
  const button = sidekick
    ? getExperimentVariantSelectorInSidekick(config)
    : getExperimentVariantSelectorInOverlay(config);

  if (!button || !popup) {
    return;
  }

  registerClickHandler(button, popup, config);
  if (!sidekick) {
    overlay.append(button);
  } else {
    overlay.classList.add('hlx-preview-overlay-sidekick');
  }
  overlay.append(popup);

  document.body.append(overlay);
}

try {
  createPreviewOverlay();
} catch (e) {
  console.log(e);
}
