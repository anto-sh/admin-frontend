<script setup lang="ts">
import { Button, InputText, Select, FloatLabel, FileUpload, Image, useConfirm } from 'primevue'
import ConfirmPopup from 'primevue/confirmpopup'
import { useExpertEditorPageModel } from './useExpertEditorPageModel'
import EditorJsWrapper from '@/features/editorjs-wrapper/EditorJsWrapper.vue'
import { usePageTitle } from '@/shared/composables/usePageTitle'

const {
  expertId,
  readonly,
  formData,
  categoriesSelectOptions,
  isShowEditorJs,
  uploadExpertImage,
  saveExpert,
  deleteExpert,
  cancelEditor,
} = useExpertEditorPageModel()

if (expertId) {
  if (readonly) usePageTitle(`Просмотр специалиста #${expertId}`)
  else usePageTitle(`Редактирование специалиста #${expertId}`)
} else usePageTitle('Добавление нового специалиста')

const confirmService = useConfirm()
const confirmDeleteExpert = (event: MouseEvent) => {
  confirmService.require({
    target: event.target as HTMLElement,
    message: `Вы уверены, что хотите удалить специалиста?`,
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
    accept: deleteExpert,
  })
}
</script>

<template>
  <form
    @submit.prevent
    class="mt-4 space-y-8"
  >
    <FloatLabel>
      <InputText
        id="fullName"
        v-model.trim="formData.fullName"
        :disabled="readonly"
        class="w-full"
      />
      <label for="fullName">ФИО специалиста</label>
    </FloatLabel>

    <FloatLabel>
      <InputText
        id="description"
        v-model.trim="formData.description"
        :disabled="readonly"
        class="w-full"
      />
      <label for="description">Описание</label>
    </FloatLabel>

    <FloatLabel>
      <Select
        id="category"
        v-model="formData.categoryId"
        :disabled="readonly"
        :options="categoriesSelectOptions"
        option-label="name"
        option-value="id"
        class="w-full"
      />
      <label for="category">Категория</label>
    </FloatLabel>

    <div
      :class="formData.imageUrl ? 'mb-2' : 'mb-10'"
      class="flex justify-start"
    >
      <FileUpload
        @select="uploadExpertImage"
        :max-file-size="200 * 1024 * 1024"
        :choose-label="
          formData.imageUrl ? 'Выбрать другое фото специалиста' : 'Выбрать фото специалиста'
        "
        mode="basic"
        custom-upload
        auto
        accept="image/*"
        choose-icon="pi pi-image"
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
        severity="secondary"
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
    :pt="{
      message: { style: 'white-space: pre-line;' },
    }"
    class="w-[200px]"
  />
</template>
