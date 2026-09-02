export const languages = {
  fr: 'Français',
  en: 'English',
};

export const defaultLang = 'fr';

export const ui = {
  fr: {
    'nav.gallery': 'Galerie',
    'nav.contact': 'Contact',
    'hero.badge': 'Portfolio Professionnel',
    'hero.title': "Capturer l'instant, révéler l'émotion.",
    'hero.subtitle': 'Une sélection de travaux photographiques et vidéographiques, entre projets exclusifs et regards artistiques.',
    'footer.rights': 'Tous droits réservés.',
  },
  en: {
    'nav.gallery': 'Gallery',
    'nav.contact': 'Contact',
    'hero.badge': 'Professional Portfolio',
    'hero.title': 'Capturing the moment, revealing emotion.',
    'hero.subtitle': 'A selection of photographic and videographic works, between exclusive projects and artistic views.',
    'footer.rights': 'All rights reserved.',
  },
} as const;

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  }
}