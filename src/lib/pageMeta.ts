export interface PageMeta {
  title: string;
  description: string;
}

const setMeta = (selector: string, create: () => HTMLElement, content: string) => {
  let element = document.head.querySelector<HTMLElement>(selector);
  if (!element) {
    element = create();
    document.head.appendChild(element);
  }
  element.setAttribute(element.tagName === 'LINK' ? 'href' : 'content', content);
};

const namedMeta = (name: string) => () => {
  const element = document.createElement('meta');
  element.setAttribute('name', name);
  return element;
};

const propertyMeta = (property: string) => () => {
  const element = document.createElement('meta');
  element.setAttribute('property', property);
  return element;
};

export function applyPageMeta({ title, description }: PageMeta) {
  const canonicalUrl = `${window.location.origin}${window.location.pathname}`;

  document.title = title;
  setMeta('meta[name="description"]', namedMeta('description'), description);
  setMeta('meta[property="og:title"]', propertyMeta('og:title'), title);
  setMeta('meta[property="og:description"]', propertyMeta('og:description'), description);
  setMeta('meta[property="og:url"]', propertyMeta('og:url'), canonicalUrl);
  setMeta('meta[name="twitter:title"]', namedMeta('twitter:title'), title);
  setMeta('meta[name="twitter:description"]', namedMeta('twitter:description'), description);
  setMeta(
    'link[rel="canonical"]',
    () => {
      const element = document.createElement('link');
      element.setAttribute('rel', 'canonical');
      return element;
    },
    canonicalUrl
  );
}
