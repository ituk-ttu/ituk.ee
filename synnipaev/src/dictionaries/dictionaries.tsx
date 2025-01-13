import 'server-only'

const dictionaries = {
  et: () => import('@/dictionaries/et.json').then((module) => module.default),
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
}

export const getDictionary = async (locale: 'et' | 'en') =>
  dictionaries[locale]?.() ?? dictionaries.en();
