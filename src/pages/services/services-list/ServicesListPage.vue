<script setup lang="ts">
import { usePageTitle } from '@/shared/composables/usePageTitle'
import { Button, useConfirm } from 'primevue'
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
import ConfirmPopup from 'primevue/confirmpopup'
import { useServicesListPageModel } from './useServicesListPageModel'

usePageTitle('Услуги')

const {
  categoriesWithServices,
  deleteService,
  goToServiceCreate,
  goToServiceEdit,
  goToServiceView,
} = useServicesListPageModel()

const confirmService = useConfirm()
const confirmDeleteService = (id: number, event: MouseEvent) => {
  confirmService.require({
    target: event.target as HTMLElement,
    message: `Вы уверены?`,
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: 'Нет',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Да',
      severity: 'danger',
    },
    accept: () => deleteService(id),
  })
}
</script>

<template>
  <Button
    @click="goToServiceCreate()"
    label="Добавить новую услугу"
    size="large"
    icon="pi pi-plus"
  />
  <template v-if="categoriesWithServices.length">
    <Accordion :value="['0']" multiple class="mt-10">
      <AccordionPanel v-for="sc in categoriesWithServices" :key="sc.id" :value="sc.id" class="my-3">
        <AccordionHeader>
          <div>
            <span class="text-2xl">{{ sc.name }}</span>
            <br />
            <span class="text-gray-600">/{{ sc.url }}/</span>
          </div>
          <Button
            @click.stop="goToServiceCreate(sc.id)"
            icon="pi pi-plus"
            class="ml-auto mr-4"
            label="Добавить услугу в категорию"
          />
        </AccordionHeader>

        <AccordionContent>
          <ul v-if="sc.services?.length">
            <li v-for="service in sc.services" :key="service.id" class="accordion-entity-list-item">
              <span class="accordion-entity-list-item__name">{{ service.name }}</span>
              <span class="accordion-entity-list-item__actions">
                <Button
                  @click="goToServiceView(service.id)"
                  variant="text"
                  icon="pi pi-eye"
                  title="Просмотреть"
                />
                <Button
                  @click="goToServiceEdit(service.id)"
                  variant="text"
                  icon="pi pi-pencil"
                  title="Редактировать"
                />
                <Button
                  @click="confirmDeleteService(service.id, $event)"
                  severity="danger"
                  variant="text"
                  icon="pi pi-trash"
                  title="Удалить"
                />
              </span>
            </li>
          </ul>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  </template>

  <ConfirmPopup
    class="w-[200px]"
    :pt="{
      message: { style: 'white-space: pre-line;' },
    }"
  />
</template>
