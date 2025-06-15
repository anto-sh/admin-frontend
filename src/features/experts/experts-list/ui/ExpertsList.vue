<script setup lang="ts">
import { Button } from 'primevue'
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
import ConfirmPopup from 'primevue/confirmpopup'
import { useExpertsListModel } from '../model/useExpertsListModel'

const {
  expertCategoryStore: ecStore,
  confirmDeleteExpert,
  goToExpertCreate,
  goToExpertEdit,
  goToExpertView,
} = useExpertsListModel()
</script>

<template>
  <Button
    @click="goToExpertCreate()"
    label="Добавить нового специалиста"
    size="large"
    icon="pi pi-plus"
  />
  <template v-if="ecStore.expertCategories?.length">
    <Accordion :value="['0']" multiple class="mt-10">
      <AccordionPanel
        v-for="ec in ecStore.expertCategories"
        :key="ec.id"
        :value="ec.id"
        class="my-3"
      >
        <AccordionHeader>
          <div>
            <span class="text-2xl">{{ ec.name }}</span>
            <br />
            <span class="text-gray-600">/{{ ec.url }}/</span>
          </div>
          <Button
            @click.stop="goToExpertCreate(ec.id)"
            icon="pi pi-plus"
            class="ml-auto mr-4"
            label="Добавить специалиста в категорию"
          />
        </AccordionHeader>
        <AccordionContent>
          <ul v-if="ec.experts?.length">
            <li v-for="expert in ec.experts" :key="expert.id" class="accordion-entity-list-item">
              <span class="accordion-entity-list-item__name">{{ expert.fullName }}</span>
              <span class="accordion-entity-list-item__actions">
                <Button
                  @click="goToExpertView(expert.id)"
                  variant="text"
                  icon="pi pi-eye"
                  title="Просмотреть"
                />
                <Button
                  @click="goToExpertEdit(expert.id)"
                  variant="text"
                  icon="pi pi-pencil"
                  title="Редактировать"
                />
                <Button
                  @click="confirmDeleteExpert(expert.id, $event)"
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
