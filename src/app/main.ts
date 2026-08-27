import { createApp } from 'vue'
import { createPinia } from 'pinia'

import PrimeVue from 'primevue/config'
import Ripple from 'primevue/ripple'
import Aura from '@primeuix/themes/aura'
import { ConfirmationService } from 'primevue'
import ToastService from 'primevue/toastservice'

import App from './App.vue'
import { router } from './router'

import i18n from '@/shared/lib/i18n/index.ts'

import '@/index.scss'
import { isAbortRequestError } from '@/shared/lib/network-utils/isAbortRequestError.ts'

const app = createApp(App)

app.use(i18n)
app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  // Default theme configuration
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: 'system',
      cssLayer: false,
    },
  },
  ripple: true,
})
app.use(ConfirmationService)
app.use(ToastService)

app.directive('ripple', Ripple)

app.mount('#app')

// global error handler to filter some meaningless errors
window.addEventListener('unhandledrejection', (event) => {
  if (isAbortRequestError(event.reason)) {
    event.preventDefault()
    console.debug('Запрос был отменён, ошибка проигнорирована')
  }
})
