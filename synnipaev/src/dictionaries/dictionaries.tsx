import 'server-only'
 
const dictionaries = {
  est: () => import('@/dictionaries/est.json').then((module) => module.default),
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
}
 
export const getDictionary = async (locale: 'est' | 'en') =>
  dictionaries[locale]?.() ?? dictionaries.est();
