<script setup lang="ts">
import { Button, InputText, Select, FloatLabel } from 'primevue'
import ConfirmPopup from 'primevue/confirmpopup'
import { useExerciseEditorModel } from '../model/useExerciseEditorModel'
import EditorJsWrapper from '@/features/editorjs-wrapper/ui/EditorJsWrapper.vue'
import { usePageTitle } from '@/shared/composables/usePageTitle'

const {
  exerciseId,
  readonly,
  formData,
  categoriesSelectList,
  isShowEditorJs,
  saveExercise,
  cancelEditor,
  confirmDeleteExercise,
} = useExerciseEditorModel()

// TODO: по хорошему это делать в слое page, но как-то слишком запарно, стоит подумать
if (exerciseId) {
  if (readonly) usePageTitle(`Просмотр упражнения #${exerciseId}`)
  else usePageTitle(`Редактирование упражнения #${exerciseId}`)
} else usePageTitle('Добавление нового упражнения')
defineExpose({ exerciseId, readonly })
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
        :options="categoriesSelectList"
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
