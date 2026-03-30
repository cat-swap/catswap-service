import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';
import {
  APP_ROUTES,
  SITE_DESCRIPTION,
  SITE_NAME,
  createJsonLd,
  getRouteMetaForPath,
} from './seo/routeMeta';

export function render(url: string) {
  const meta = getRouteMetaForPath(url);
  const appHtml = renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  );

  return {
    appHtml,
    meta,
    structuredData: createJsonLd(meta),
  };
}

export {
  APP_ROUTES,
  SITE_DESCRIPTION,
  SITE_NAME,
  createJsonLd,
  getRouteMetaForPath,
};
