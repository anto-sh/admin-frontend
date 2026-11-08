<script setup lang="ts">
import { Button, InputText, Message } from 'primevue'
import { useField } from 'vee-validate'
import { useId } from 'vue'

const props = defineProps<{
  name: string
  index: number
  disabled: boolean
  readonly: boolean
  submitted: boolean
  errors?: string[]
}>()
const emit = defineEmits<{ remove: [] }>()
const errorsId = `procedure-${useId()}-errors`
const { value, handleChange, handleBlur } = useField<string>(() => props.name, undefined, {
  validateOnValueUpdate: false,
  keepValueOnUnmount: true,
})
</script>

<template>
  <div class="mb-2">
    <div class="flex items-center gap-2">
      <InputText
        :disabled="disabled"
        :modelValue="value"
        @update:modelValue="handleChange($event, submitted)"
        @blur="handleBlur($event, submitted)"
        :invalid="submitted && !!errors?.length"
        :aria-label="`Название процедуры ${index + 1}`"
        :aria-describedby="errorsId"
        aria-required="true"
        placeholder="Введите название процедуры"
        class="w-full"
      />
      <Button
        v-if="!readonly"
        type="button"
        :disabled="disabled"
        @click="emit('remove')"
        :aria-label="`Удалить процедуру ${index + 1}`"
        severity="danger"
        icon="pi pi-trash"
      />
    </div>
    <Message
      v-if="submitted && errors?.length"
      :id="errorsId"
      severity="error"
      variant="simple"
      size="small"
      class="mt-1"
    >
      <span v-for="message in errors" :key="message" class="block">{{ message }}</span>
    </Message>
  </div>
</template>
