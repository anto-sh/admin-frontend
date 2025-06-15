<script setup lang="ts">
import { Button } from 'primevue'
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
import ConfirmPopup from 'primevue/confirmpopup'
import { useServicesListModel } from '../model/useServicesListModel'

const {
  serviceCategoryStore: scStore,
  confirmDeleteService,
  goToServiceCreate,
  goToServiceEdit,
  goToServiceView,
} = useServicesListModel()
</script>

<template>
  <Button
    @click="goToServiceCreate()"
    label="Добавить новую услугу"
    size="large"
    icon="pi pi-plus"
  />
  <template v-if="scStore.serviceCategories?.length">
    <Accordion :value="['0']" multiple class="mt-10">
      <AccordionPanel
        v-for="sc in scStore.serviceCategories"
        :key="sc.id"
        :value="sc.id"
        class="my-3"
      >
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

<style scoped lang="scss"></style>
