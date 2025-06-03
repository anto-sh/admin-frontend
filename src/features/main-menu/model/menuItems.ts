import type { MenuItem } from 'primevue/menuitem'

export const menuItems: MenuItem[] = [
  {
    label: 'Главная',
    icon: 'pi pi-cloud-upload',
    route: '/',
  },
  {
    label: 'Cloud',
    icon: 'pi pi-cloud',
    items: [
      {
        label: 'Список "Что лечим"',
        icon: 'pi pi-cloud-upload',
        route: '/treatments',
      },
    ],
  },
]
