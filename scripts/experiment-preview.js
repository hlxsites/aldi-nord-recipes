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

/**
 * Create Badge if a Page is enlisted in a Helix Experiment
 * @return {Object} returns a badge or empty string
 */
async function getExperimentVariantSelector() {
  const experiment = toClassName(getMetadata('experiment'));
  if (!experiment) {
    return null;
  }

  const config = window.hlx && window.hlx.experiment;
  if (!config) {
    return null;
  }

  const div = document.createElement('div');
  div.className = 'hlx-experiment hlx-badge';
  div.classList.add(`hlx-experiment-status-${toClassName(config.status)}`);
  div.innerHTML = `Experiment <span class="hlx-open"></span>
    <div class="hlx-popup hlx-hidden">
      <div class="hlx-popup-header">
        <div>
          <h4>${config.experimentName}</h4>
          <div class="hlx-details">${config.status}, ${config.audience}</div>
        </div>
        <div>
          <div class="hlx-button"><a href="${config.manifest}">Manifest</a></div>
        </div>
      </div>
      <div class="hlx-variants"></div>
    </div>`;
  const popup = div.querySelector('.hlx-popup');

  const variantMap = {};

  div.addEventListener('click', async () => {
    popup.classList.toggle('hlx-hidden');

    // the query is a bit slow, so I'm only fetching the results when the popup is opened
    const resultsURL = new URL('https://helix-pages.anywhere.run/helix-services/run-query@v2/rum-experiments');
    resultsURL.searchParams.set('experiment', experiment);
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
      const variant = variantMap[result.variant];
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

  const variants = div.querySelector('.hlx-variants');
  config.variantNames.forEach((vname) => {
    const variantDiv = createVariant(vname, config);
    variants.append(variantDiv);
    variantMap[vname] = variantDiv;
  });

  return div;
}

async function createPreviewOverlay() {
  const sidekick = document.querySelector('helix-sidekick');

  loadCSS('/styles/experiment-preview.css');
  const overlay = document.createElement('div');
  overlay.className = 'hlx-preview-overlay';

  if (sidekick) {
    overlay.classList.add('hlx-preview-overlay--sidekick');
  }

  const variantSelector = await getExperimentVariantSelector();
  if (variantSelector) {
    overlay.append(variantSelector);
  }

  document.body.append(overlay);
}

try {
  createPreviewOverlay();
} catch (e) {
  console.log(e);
}
