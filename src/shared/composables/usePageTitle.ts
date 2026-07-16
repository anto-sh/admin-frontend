import { inject, onMounted, toValue, type MaybeRefOrGetter, type Ref } from 'vue'

// устанавливает переданный заголовок в контекстную переменную pageTitle компонента MainLayout.vue
export function usePageTitle(pageTitleProp: MaybeRefOrGetter<string> | string): void {
  const pageTitle = toValue(pageTitleProp)
  const injectedPageTitle = inject<Ref<string>>('pageTitle')

  if (!injectedPageTitle) throw new Error('Не найден провайдер pageTitle')

  onMounted(() => (injectedPageTitle.value = pageTitle))
}
