<script setup lang="ts">
import { Button, InputText, Select, FloatLabel, InputNumber, useConfirm } from 'primevue'
import ConfirmPopup from 'primevue/confirmpopup'
import { FieldImageUpload } from '@/features/field-image-upload'
import { useServiceEditorPageModel } from '../model/useServiceEditorPageModel'
import { usePageTitle } from '@/shared/composables/usePageTitle'

const {
  serviceId,
  readonly,
  formData,
  categoriesSelectOptions,
  addNewProcedure,
  removeProcedure,
  saveService,
  deleteService,
  cancelEditor,
} = useServiceEditorPageModel()

if (serviceId) {
  if (readonly) usePageTitle(`Просмотр услуги #${serviceId}`)
  else usePageTitle(`Редактирование услуги #${serviceId}`)
} else usePageTitle('Добавление новой услуги')

const confirmService = useConfirm()
const confirmDeleteService = (event: MouseEvent) => {
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
    accept: deleteService,
  })
}
</script>

<template>
  <form @submit.prevent class="mt-4 space-y-8">
    <FloatLabel>
      <InputText :disabled="readonly" id="name" v-model.trim="formData.name" class="w-full" />
      <label for="name">Название услуги</label>
    </FloatLabel>

    <FloatLabel>
      <Select
        :disabled="readonly"
        id="category"
        v-model="formData.categoryId"
        :options="categoriesSelectOptions"
        optionLabel="name"
        optionValue="id"
        class="w-full"
      />
      <label for="category">Категория</label>
    </FloatLabel>

    <FloatLabel>
      <InputNumber
        currency="RUB"
        locale="ru-RU"
        :minFractionDigits="0"
        :disabled="readonly"
        id="price"
        v-model="formData.price"
        class="w-full"
        type="number"
        :min="0"
        :step="1"
      />
      <label for="price">Стоимость</label>
    </FloatLabel>

    <FieldImageUpload
      v-model="formData.imageUrl"
      :disabled="readonly"
      :readonly="readonly"
      alt="Изображение услуги"
    />

    <p class="text-xl mb-2">Список входящих в услугу процедур</p>
    <div
      v-for="(_procedure, index) in formData.procedures"
      :key="index"
      class="flex items-center gap-2 mb-2"
    >
      <InputText
        :disabled="readonly"
        v-model.trim="formData.procedures[index]"
        placeholder="Введите название процедуры"
        class="w-full"
      />
      <Button
        v-if="!readonly"
        @click="removeProcedure(index)"
        severity="danger"
        icon="pi pi-trash"
      />
    </div>
    <Button
      v-if="!readonly"
      @click="addNewProcedure()"
      label="Добавить процедуру"
      icon="pi pi-plus"
    />

    <div class="flex justify-between mt-10">
      <Button
        @click="cancelEditor()"
        severity="info"
        label="Назад"
        icon="pi pi-arrow-left"
        size="large"
      />
      <div>
        <Button
          v-if="serviceId && !readonly"
          @click="confirmDeleteService($event)"
          severity="danger"
          label="Удалить"
          icon="pi pi-trash"
          size="large"
          class="mr-7"
        />
        <Button
          @click="saveService()"
          :disabled="readonly"
          label="Сохранить"
          icon="pi pi-check"
          size="large"
        />
      </div>
    </div>
  </form>

  <ConfirmPopup
    class="w-[200px]"
    :pt="{
      message: { style: 'white-space: pre-line;' },
    }"
  />
</template>
