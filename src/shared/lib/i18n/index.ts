import { createI18n, type LocaleMessages } from 'vue-i18n'

// Собираем все JSON-файлы из папок locales рекурсивно
const localesModules = import.meta.glob('../../**/locales/*.json', {
  eager: true, // загружаем статически, потом можно сделать и динамически (асинхронно)
  import: 'default',
})

const messages: LocaleMessages<Record<string, any>> = {}

for (const path in localesModules) {
  // Извлекаем язык из пути - e.g., /locales/en.json -> 'en'
  const lang = path.match(/locales\/(\w+)\.json$/)?.[1]
  if (!lang) continue

  // Мержим переводы
  if (!messages[lang]) messages[lang] = {}
  Object.assign(messages[lang], localesModules[path])
}

const i18n = createI18n({
  legacy: false, // т.к. Composition API
  locale: 'ru', // язык по умолчанию
  fallbackLocale: 'ru',
  messages,
})

export default i18n
