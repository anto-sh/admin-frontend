<script setup lang="ts">
import { Button, InputText, Select, FloatLabel, InputNumber, Message, useConfirm } from 'primevue'
import ConfirmPopup from 'primevue/confirmpopup'
import { FieldImageUpload } from '@/features/field-image-upload'
import { useServiceEditorPageModel } from '../model/useServiceEditorPageModel'
import ServiceProcedureField from './ServiceProcedureField.vue'
import { usePageTitle } from '@/shared/composables/usePageTitle'

const {
  serviceId,
  readonly,
  form,
  formFields,
  isDeleting,
  editorDisabled,
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
  <form @submit.prevent novalidate class="mt-4 space-y-8">
    <div>
      <FloatLabel>
        <InputText
          :disabled="editorDisabled"
          id="name"
          v-model="formFields.name.field"
          v-bind="formFields.name.attrs"
          :invalid="form.submitCount > 0 && !!form.errorBag.name?.length"
          aria-required="true"
          aria-describedby="name-errors"
          class="w-full"
        />
        <label for="name">Название услуги</label>
      </FloatLabel>
      <Message
        v-if="form.submitCount > 0 && form.errorBag.name?.length"
        id="name-errors"
        severity="error"
        variant="simple"
        size="small"
        class="mt-1"
      >
        <span v-for="message in form.errorBag.name" :key="message" class="block">{{
          message
        }}</span>
      </Message>
    </div>

    <div>
      <FloatLabel>
        <Select
          :disabled="editorDisabled"
          inputId="category"
          v-model="formFields.categoryId.field"
          v-bind="formFields.categoryId.attrs"
          :options="categoriesSelectOptions"
          optionLabel="name"
          optionValue="id"
          :invalid="form.submitCount > 0 && !!form.errorBag.categoryId?.length"
          aria-required="true"
          aria-describedby="category-errors"
          class="w-full"
        />
        <label for="category">Категория</label>
      </FloatLabel>
      <Message
        v-if="form.submitCount > 0 && form.errorBag.categoryId?.length"
        id="category-errors"
        severity="error"
        variant="simple"
        size="small"
        class="mt-1"
      >
        <span v-for="message in form.errorBag.categoryId" :key="message" class="block">{{
          message
        }}</span>
      </Message>
    </div>

    <div>
      <FloatLabel>
        <InputNumber
          currency="RUB"
          locale="ru-RU"
          :min="formFields.price.min"
          :max="formFields.price.max"
          :disabled="editorDisabled"
          inputId="price"
          v-model="formFields.price.field"
          v-bind="formFields.price.attrs"
          :invalid="form.submitCount > 0 && !!form.errorBag.price?.length"
          aria-required="true"
          aria-describedby="price-errors"
          class="w-full"
          :step="1"
        />
        <label for="price">Стоимость</label>
      </FloatLabel>
      <Message
        v-if="form.submitCount > 0 && form.errorBag.price?.length"
        id="price-errors"
        severity="error"
        variant="simple"
        size="small"
        class="mt-1"
      >
        <span v-for="message in form.errorBag.price" :key="message" class="block">{{
          message
        }}</span>
      </Message>
    </div>

    <FieldImageUpload
      v-model="formFields.imageUrl.field"
      :disabled="editorDisabled"
      :readonly="readonly"
      :errors="form.submitCount > 0 ? form.errorBag.imageUrl : undefined"
      alt="Изображение услуги"
    />

    <p class="text-xl mb-2">Список входящих в услугу процедур</p>
    <Message
      v-if="form.submitCount > 0 && form.errorBag.procedures?.length"
      severity="error"
      variant="simple"
      size="small"
    >
      <span v-for="message in form.errorBag.procedures" :key="message" class="block">{{
        message
      }}</span>
    </Message>
    <ServiceProcedureField
      v-for="(procedure, index) in formFields.procedures.fields"
      :key="procedure.key"
      :name="`procedures[${index}]`"
      :index="index"
      :disabled="editorDisabled"
      :readonly="readonly"
      :submitted="form.submitCount > 0"
      :errors="form.errorBag[`procedures[${index}]`]"
      @remove="removeProcedure(index)"
    />
    <Button
      v-if="!readonly"
      :disabled="editorDisabled"
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
          :disabled="editorDisabled"
          :loading="isDeleting"
          @click="confirmDeleteService($event)"
          severity="danger"
          label="Удалить"
          icon="pi pi-trash"
          size="large"
          class="mr-7"
        />
        <Button
          v-if="!readonly"
          @click="saveService"
          :disabled="editorDisabled"
          :loading="form.isSubmitting"
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
