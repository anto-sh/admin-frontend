import type { MenuItem } from 'primevue/menuitem'

export const menuItems: MenuItem[] = [
  {
    label: 'Главная',
    icon: 'pi pi-cloud-upload',
    route: '/',
  },
  {
    label: 'Список "Что лечим"',
    icon: 'pi pi-cloud-upload',
    route: '/treatments',
  },
  {
    label: 'Упражнения',
    icon: 'pi pi-cloud',
    items: [
      {
        label: 'Категории упражнений',
        icon: 'pi pi-cloud-upload',
        route: '/exercise-categories',
      },
    ],
  },
]
