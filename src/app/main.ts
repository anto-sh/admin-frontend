import { createApp } from 'vue'
import { createPinia } from 'pinia'

import PrimeVue from 'primevue/config'
import Ripple from 'primevue/ripple'
import Aura from '@primeuix/themes/aura'
import { ConfirmationService } from 'primevue'
import ToastService from 'primevue/toastservice';

import App from './App.vue'
import router from './router'

import '@/index.scss'

const app = createApp(App)

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
app.use(ToastService);

app.directive('ripple', Ripple)

app.mount('#app')
