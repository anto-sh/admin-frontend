<script setup lang="ts">
import {
  FileUpload,
  Gallery,
  GalleryContent,
  GalleryItem,
  GalleryFullScreen,
  Message,
} from 'primevue'
import AppLoadingIndicator from '@/shared/ui/app-loading-indicator/AppLoadingIndicator.vue'
import { useFieldImageUploadModel } from './useFieldImageUploadModel'

const props = defineProps<{
  alt: string
  disabled?: boolean
  readonly?: boolean
  errors?: string[]
}>()
const imageUrl = defineModel<string>({ required: true })
const { isUploading, uploadImage } = useFieldImageUploadModel(imageUrl, props)
</script>

<template>
  <div class="relative w-max">
    <div v-if="!readonly" class="flex justify-start mb-2">
      <FileUpload
        mode="basic"
        :disabled="disabled"
        :chooseButtonProps="{ loading: isUploading }"
        @select="uploadImage"
        customUpload
        auto
        accept="image/*"
        :maxFileSize="200 * 1024 * 1024"
        :chooseLabel="imageUrl ? 'Выбрать другое изображение' : 'Выбрать изображение'"
        chooseIcon="pi pi-image"
        class="mb-0"
      />
    </div>

    <Message v-if="errors?.length" severity="error" variant="simple" size="small">
      <span v-for="message in errors" :key="message" class="block">{{ message }}</span>
    </Message>

    <Gallery
      v-if="imageUrl"
      :key="imageUrl"
      class="mb-10 h-[250px]! w-[250px]! bg-surface-0 data-[fullscreen]:h-screen! data-[fullscreen]:w-screen!"
    >
      <GalleryContent>
        <GalleryItem class="h-full w-full">
          <img :src="imageUrl" :alt="alt" class="h-full w-full object-contain" />
        </GalleryItem>
      </GalleryContent>
      <GalleryFullScreen v-slot="{ isFullscreen }" class="absolute right-2 top-2 z-10">
        <i
          :class="isFullscreen ? 'pi pi-window-minimize' : 'pi pi-window-maximize'"
          aria-hidden="true"
        />
        <span class="sr-only">
          {{
            isFullscreen ? 'Выйти из полноэкранного просмотра' : 'Открыть изображение на весь экран'
          }}
        </span>
      </GalleryFullScreen>
    </Gallery>

    <AppLoadingIndicator :is-show="isUploading" />
  </div>
</template>
