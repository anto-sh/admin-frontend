<script setup lang="ts">
import { Button, InputText, Select, FloatLabel, InputNumber, FileUpload, Image } from 'primevue'
import ConfirmPopup from 'primevue/confirmpopup'
import { useServiceEditorModel } from '../model/useServiceEditorModel'
import { usePageTitle } from '@/shared/composables/usePageTitle'

const {
  serviceId,
  readonly,
  formData,
  categoriesSelectList,
  addNewProcedure,
  removeProcedure,
  uploadServiceImage,
  saveService,
  cancelEditor,
  confirmDeleteService,
} = useServiceEditorModel()

if (serviceId) {
  if (readonly) usePageTitle(`Просмотр услуги #${serviceId}`)
  else usePageTitle(`Редактирование услуги #${serviceId}`)
} else usePageTitle('Добавление новой услуги')
defineExpose({ serviceId, readonly })
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
        :options="categoriesSelectList"
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
    <div class="flex justify-start" :class="formData.imageUrl ? 'mb-2' : 'mb-10'">
      <FileUpload
        mode="basic"
        @select="uploadServiceImage"
        customUpload
        auto
        accept="image/*"
        :maxFileSize="200 * 1024 * 1024"
        :chooseLabel="
          formData.imageUrl
            ? 'Выбрать другое изображение для услуги'
            : 'Выбрать изображение для услуги'
        "
        chooseIcon="pi pi-image"
        class="mb-0"
      />
    </div>
    <Image
      v-if="formData.imageUrl"
      :src="formData.imageUrl"
      alt="Изображение услуги"
      width="250"
      preview
      class="mb-10"
    />

    <p class="text-xl mb-2">Список входящих в услугу процедур</p>
    <div
      v-for="(procedure, index) in formData.procedures"
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
        :disabled="formData.procedures.length === 1"
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
          v-if="serviceId"
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
