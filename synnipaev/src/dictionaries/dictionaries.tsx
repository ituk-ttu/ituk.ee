import 'server-only'
import type { Locale } from "../../i18nConfig"

const dictionaries = {
  et: () => import('@/dictionaries/et.json').then((module) => module.default),
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
}

export const getDictionary = async (locale: Locale) =>
  dictionaries[locale]?.() ?? dictionaries.en();
