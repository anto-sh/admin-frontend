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
  license:
    'eyJpZCI6ImZjNDg3Njc3LWRlZWItNGYxZi1iOTBjLTA3OTVjZGU5NzZkNSIsInByb2R1Y3QiOiJwcmltZXVpIiwidGllciI6ImNvbW11bml0eSIsInR5cGUiOiJkZXYiLCJpYXQiOjE3OTE1NDI4MjksImV4cCI6MTgyMzA3ODgyOX0.10nOIosTujo_LbljVxSkja9KYv3_FBCy36e5n4EdhT4EAXKvTWGRwhaii7385a_ym5EnLoDgRJKoMqTGszxBBQ',
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
    console.debug('Request was cancelled, error is ignored')
  }
})
