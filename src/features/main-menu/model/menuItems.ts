import type { MenuItem } from 'primevue/menuitem'

//TODO: подумать насчет верного места для этого списка
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
      {
        label: 'Упражнения',
        icon: 'pi pi-cloud-upload',
        route: '/exercises',
      },
    ],
  },
  {
    label: 'Услуги',
    icon: 'pi pi-cloud',
    items: [
      {
        label: 'Категории услуг',
        icon: 'pi pi-cloud-upload',
        route: '/service-categories',
      },
      {
        label: 'Услуги',
        icon: 'pi pi-cloud-upload',
        route: '/services',
      },
    ],
  },
  {
    label: 'Специалисты',
    icon: 'pi pi-cloud-upload',
    route: '/experts',
  },
]
