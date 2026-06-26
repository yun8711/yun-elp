export const siteOrigin = process.env.YUN_ELP_SITE_ORIGIN || 'https://yun8711.github.io';
export const siteBase = normalizeBase(process.env.YUN_ELP_SITE_BASE || '/yun-elp/');
export const siteUrl = `${siteOrigin}${siteBase}`;

export function normalizeBase(base: string) {
  const withStart = base.startsWith('/') ? base : `/${base}`;
  return withStart.endsWith('/') ? withStart : `${withStart}/`;
}

export function joinUrl(path: string) {
  const cleanPath = path.replace(/^\//, '');
  return `${siteUrl}${cleanPath}`;
}
