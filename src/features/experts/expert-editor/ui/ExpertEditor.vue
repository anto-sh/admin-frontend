<script setup lang="ts">
import { Button, InputText, Select, FloatLabel, FileUpload, Image } from 'primevue'
import ConfirmPopup from 'primevue/confirmpopup'
import { useExpertEditorModel } from '../model/useExpertEditorModel'
import EditorJsWrapper from '@/features/editorjs-wrapper/ui/EditorJsWrapper.vue'
import { usePageTitle } from '@/shared/composables/usePageTitle'

const {
  expertId,
  readonly,
  formData,
  categoriesSelectList,
  isShowEditorJs,
  uploadExpertImage,
  saveExpert,
  cancelEditor,
  confirmDeleteExpert,
} = useExpertEditorModel()

if (expertId) {
  if (readonly) usePageTitle(`Просмотр специалиста #${expertId}`)
  else usePageTitle(`Редактирование специалиста #${expertId}`)
} else usePageTitle('Добавление нового специалиста')
defineExpose({ expertId, readonly })
</script>

<template>
  <form @submit.prevent class="mt-4 space-y-8">
    <FloatLabel>
      <InputText
        :disabled="readonly"
        id="fullName"
        v-model.trim="formData.fullName"
        class="w-full"
      />
      <label for="fullName">ФИО специалиста</label>
    </FloatLabel>
    <FloatLabel>
      <InputText
        :disabled="readonly"
        id="description"
        v-model.trim="formData.description"
        class="w-full"
      />
      <label for="description">Описание</label>
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
    <div class="flex justify-start" :class="formData.imageUrl ? 'mb-2' : 'mb-10'">
      <FileUpload
        mode="basic"
        @select="uploadExpertImage"
        customUpload
        auto
        accept="image/*"
        :maxFileSize="200 * 1024 * 1024"
        :chooseLabel="
          formData.imageUrl ? 'Выбрать другое фото специалиста' : 'Выбрать фото специалиста'
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

    <EditorJsWrapper
      v-if="isShowEditorJs"
      ref="editorjs"
      :initial-data="formData.contentJson"
      :readonly
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
          v-if="expertId"
          @click="confirmDeleteExpert($event)"
          severity="danger"
          label="Удалить"
          icon="pi pi-trash"
          size="large"
          class="mr-7"
        />
        <Button
          @click="saveExpert()"
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
