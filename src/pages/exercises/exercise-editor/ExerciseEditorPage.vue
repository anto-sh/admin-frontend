<script setup lang="ts">
import { Button, InputText, Select, FloatLabel, useConfirm } from 'primevue'
import ConfirmPopup from 'primevue/confirmpopup'
import { useExerciseEditorPageModel } from './useExerciseEditorPageModel'
import EditorJsWrapper from '@/features/editorjs-wrapper/EditorJsWrapper.vue'
import { usePageTitle } from '@/shared/composables/usePageTitle'

const {
  exerciseId,
  readonly,
  formData,
  categoriesSelectOptions,
  isShowEditorJs,
  saveExercise,
  deleteExercise,
  cancelEditor,
} = useExerciseEditorPageModel()

if (exerciseId) {
  if (readonly) usePageTitle(`Просмотр упражнения #${exerciseId}`)
  else usePageTitle(`Редактирование упражнения #${exerciseId}`)
} else usePageTitle('Добавление нового упражнения')

// TODO: for what we exposing?
defineExpose({ exerciseId, readonly })

const confirmService = useConfirm()
const confirmDeleteExercise = (event: MouseEvent) => {
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
    accept: deleteExercise,
  })
}
</script>

<template>
  <form @submit.prevent class="mt-4 space-y-8">
    <FloatLabel>
      <InputText :disabled="readonly" id="name" v-model.trim="formData.name" class="w-full" />
      <label for="name">Название упражнения</label>
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
          v-if="exerciseId"
          @click="confirmDeleteExercise($event)"
          severity="danger"
          label="Удалить"
          icon="pi pi-trash"
          size="large"
          class="mr-7"
        />
        <Button
          @click="saveExercise()"
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
