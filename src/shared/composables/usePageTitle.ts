import { inject, onMounted, toValue, type MaybeRefOrGetter, type Ref } from 'vue'

// устанавливает переданный заголовок в контекстную переменную pageTitle компонента MainLayout.vue
export function usePageTitle(pageTitle: MaybeRefOrGetter<string> | string) {
  const appPageTitle = inject<Ref<string>>('pageTitle')
  if (!appPageTitle) throw new Error('Не найден провайдер pageTitle')
  onMounted(() => (appPageTitle.value = toValue(pageTitle)))

  return {
    appPageTitle,
  }
}
