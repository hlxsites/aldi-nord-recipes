import { h, Fragment, render } from '../../../scripts/preact.module.js';
import { fetchIndex, readBlockConfig } from '../../../scripts/scripts.js';
import { useEffect, useState } from '../../../scripts/hooks.module.js';

const Image = (props) => {
  const {
    breakpoints = [{ media: '(min-width: 400px)', width: '2000' }, { width: '750' }], src, alt = '', eager = false,
  } = props;

  const url = new URL(src, window.location.href);
  const { pathname } = url;
  const ext = pathname.substring(pathname.lastIndexOf('.') + 1);

  const optimizedSources = [];
  breakpoints.forEach((breakpoint) => {
    optimizedSources.push(<source media={breakpoint.media} type="image/webp" srcSet={`${pathname}?width=${breakpoint.width}&format=webply&optimize=medium`} />);
  });

  const fallbackSources = [];
  breakpoints.forEach((breakpoint, i) => {
    if (i < breakpoints.length - 1) {
      fallbackSources.push(<source media={breakpoint.media} srcSet={`${pathname}?width=${breakpoint.width}&format=${ext}&optimize=medium`} />);
    } else {
      fallbackSources.push(<img src={`${pathname}?width=${breakpoint.width}&format=${ext}&optimize=medium`} alt={alt} loading={eager ? 'eager' : 'lazy'} />);
    }
  });

  return <picture>
    {optimizedSources}
    {fallbackSources}
  </picture>;
};

const Icon = ({ name, className = '' }) => {
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
    return <span className={`icon icon-${name} ${className}`}><img src={src} /></span>;
  }

  return <span className={`icon icon-${name} ${className}`} dangerouslySetInnerHTML={{ __html: icon }} />;
};

const PreparationTime = (props) => {
  const { time } = props;
  const hours = Math.floor(time / 60);
  const minutes = time % 60;
  let formattedTime = '';
  if (hours > 0) {
    formattedTime += `${hours}Std `;
  }
  if (minutes > 0) {
    formattedTime += `${minutes}Min`;
  }

  return <Fragment><Icon name="time" /><span>{formattedTime}</span></Fragment>;
};

const Level = (props) => {
  const { level } = props;

  let count = 3;
  if (level === 'einfach') {
    count = 1;
  } else if (level === 'mittel') {
    count = 2;
  }

  const icons = [];
  for (let i = 0; i < count; i += 1) {
    icons.push(<Icon key={i} name="recipe-level" />);
  }
  while (icons.length < 3) {
    icons.push(<Icon key={icons.length} name="recipe-level" className="icon-recipe-level-empty" />);
  }

  return <Fragment>{icons}</Fragment>;
};

const Recipe = (props) => {
  const {
    path, thumbnail, title, level, preparationTime,
  } = props;

  return (<div className="rezeptliste-item">
    <a href={path}>
      <div className="rezeptliste-item-image">
        <Image src={thumbnail} alt={title} breakpoints={[{ width: '286' }]} />
      </div>
      <div className="rezeptliste-item-content">
        <div className="rezeptliste-item-title">
          {title}
        </div>
        <div className="rezeptliste-item-meta">
          <div className="rezeptliste-item-level">
            <Level level={level} />
          </div>
          <div className="rezeptliste-item-time">
            <PreparationTime time={preparationTime} />
          </div>
        </div>
      </div>
    </a>
  </div>);
};

const RezeptListe = (props) => {
  const { kategorie, limit, sortieren } = props;
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    (async () => {
      // Read index
      const recipesIndex = await fetchIndex('rezept-index');

      let rawRecipes = recipesIndex.data;

      // Filter by category
      if (kategorie) {
        rawRecipes = rawRecipes.filter((recipe) => recipe.categories.includes(kategorie));
      }

      // Limit
      if (limit) {
        rawRecipes = rawRecipes.slice(0, limit);
      }

      // Sorting
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

  return <div className="rezeptliste block">
    <div className="rezeptliste-content">
      {recipes.map((recipe) => <Recipe key={recipe.path} {...recipe} />)}
    </div>
  </div>;
};

export default function decorate(block) {
  const cfg = readBlockConfig(block);

  block.textContent = '';
  render(<RezeptListe {...cfg} />, block.parentNode, block);
}
