function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import { h, Fragment, render } from '../../../scripts/preact.module.js';
import { fetchIndex, readBlockConfig } from '../../../scripts/scripts.js';
import { useEffect, useState } from '../../../scripts/hooks.module.js';

const Image = props => {
  const {
    breakpoints = [{
      media: '(min-width: 400px)',
      width: '2000'
    }, {
      width: '750'
    }],
    src,
    alt = '',
    eager = false,
    ...otherProps
  } = props;
  const url = new URL(src, window.location.href);
  const {
    pathname
  } = url;
  const ext = pathname.substring(pathname.lastIndexOf('.') + 1);
  const optimizedSources = [];
  breakpoints.forEach(breakpoint => {
    optimizedSources.push(h("source", {
      media: breakpoint.media,
      type: "image/webp",
      srcSet: `${pathname}?width=${breakpoint.width}&format=webply&optimize=medium`
    }));
  });
  const fallbackSources = [];
  breakpoints.forEach((breakpoint, i) => {
    if (i < breakpoints.length - 1) {
      fallbackSources.push(h("source", {
        media: breakpoint.media,
        srcSet: `${pathname}?width=${breakpoint.width}&format=${ext}&optimize=medium`
      }));
    } else {
      fallbackSources.push(h("img", _extends({
        src: `${pathname}?width=${breakpoint.width}&format=${ext}&optimize=medium`,
        alt: alt,
        loading: eager ? 'eager' : 'lazy'
      }, otherProps)));
    }
  });
  return h("picture", null, optimizedSources, fallbackSources);
};

const Icon = ({
  name,
  className = ''
}) => {
  const ICON_ROOT = '/icons';
  const [icon, setIcon] = useState(null);
  useEffect(() => {
    (async () => {
      const resp = await fetch(`${window.hlx.codeBasePath}${ICON_ROOT}/${name}.svg`);
      const iconHTML = await resp.text();
      setIcon(iconHTML);
    })();
  }, []);

  if (!icon) {
    return null;
  }

  if (icon.match(/<style/i)) {
    const src = `data:image/svg+xml,${encodeURIComponent(icon)}`;
    return h("span", {
      className: `icon icon-${name} ${className}`
    }, h("img", {
      src: src
    }));
  }

  return h("span", {
    className: `icon icon-${name} ${className}`,
    dangerouslySetInnerHTML: {
      __html: icon
    }
  });
};

const PreparationTime = props => {
  const {
    time
  } = props;
  const hours = Math.floor(time / 60);
  const minutes = time % 60;
  let formattedTime = '';

  if (hours > 0) {
    formattedTime += `${hours}Std `;
  }

  if (minutes > 0) {
    formattedTime += `${minutes}Min`;
  }

  return h(Fragment, null, h(Icon, {
    name: "time"
  }), h("span", null, formattedTime));
};

const Level = props => {
  const {
    level
  } = props;
  let count = 3;

  if (level === 'einfach') {
    count = 1;
  } else if (level === 'mittel') {
    count = 2;
  }

  const icons = [];

  for (let i = 0; i < count; i += 1) {
    icons.push(h(Icon, {
      key: i,
      name: "recipe-level"
    }));
  }

  while (icons.length < 3) {
    icons.push(h(Icon, {
      key: icons.length,
      name: "recipe-level",
      className: "icon-recipe-level-empty"
    }));
  }

  return h(Fragment, null, icons);
};

const Recipe = props => {
  const {
    path,
    thumbnail,
    title,
    level,
    preparationTime,
    enhanced
  } = props;
  const width = enhanced ? 388 : 286;
  const height = enhanced ? 290 : 215;
  return h("div", {
    className: "rezeptliste-item"
  }, h("a", {
    href: path
  }, h("div", {
    className: "rezeptliste-item-image"
  }, h(Image, {
    src: thumbnail,
    alt: title,
    breakpoints: [{
      width
    }],
    width: width,
    height: height
  })), h("div", {
    className: "rezeptliste-item-content"
  }, h("div", {
    className: "rezeptliste-item-title"
  }, title), h("div", {
    className: "rezeptliste-item-meta"
  }, h("div", {
    className: "rezeptliste-item-level"
  }, h(Level, {
    level: level
  })), h("div", {
    className: "rezeptliste-item-time"
  }, h(PreparationTime, {
    time: preparationTime
  }))), h("div", {
    className: "rezeptliste-item-button",
    href: "{path}"
  }, "Zum Rezept"))));
};

const RezeptListe = props => {
  const {
    kategorie,
    limit,
    sortieren,
    ernaehrungsform,
    classes
  } = props;
  const [recipes, setRecipes] = useState([]);
  const enhanced = classes.includes('enhanced');
  useEffect(() => {
    (async () => {
      // Read index
      const recipesIndex = await fetchIndex('rezept-index');
      let rawRecipes = recipesIndex.data; // Filter by category

      if (kategorie) {
        rawRecipes = rawRecipes.filter(recipe => recipe.categories.includes(kategorie));
      } // Filter by nutrition


      if (ernaehrungsform) {
        rawRecipes = rawRecipes.filter(recipe => recipe.nutritionforms.includes(ernaehrungsform));
      } // Limit


      if (limit) {
        rawRecipes = rawRecipes.slice(0, limit);
      } // Sorting


      if (sortieren && sortieren.includes('Datum')) {
        // Sort by date
        if (sortieren.includes('aufsteigend')) {
          rawRecipes = rawRecipes.sort((a, b) => a.date - b.date);
        } else {
          rawRecipes = rawRecipes.sort((a, b) => b.date - a.date);
        }
      }

      setRecipes(rawRecipes);
    })();
  }, []);
  return h("div", {
    className: classes.join(' ')
  }, h("div", {
    className: "rezeptliste-content"
  }, recipes.length === 0 && h("div", {
    className: "rezeptliste-empty"
  }, "Keine Rezepte gefunden"), recipes.map(recipe => h(Recipe, _extends({
    key: recipe.path
  }, recipe, {
    enhanced: enhanced
  })))));
};

export default function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';
  render(h(RezeptListe, _extends({}, cfg, {
    classes: Array.from(block.classList)
  })), block.parentNode, block);
}