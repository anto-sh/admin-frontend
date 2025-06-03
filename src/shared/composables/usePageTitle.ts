import { inject, onMounted, type Ref } from 'vue'

// устанавливает переданный заголовок в контекстную переменную pageTitle компонента MainLayout.vue
// использовать только в script setup
export function usePageTitle(pageTitleProp: string): void {
  const injectedPageTitle = inject<Ref<string>>('pageTitle')

  if (!injectedPageTitle) throw new Error('Не найден провайдер pageTitle')

  onMounted(() => (injectedPageTitle.value = pageTitleProp))
}
