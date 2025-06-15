import { ref, onMounted, onBeforeUnmount, computed, toRaw } from 'vue'
import EditorJS, { type OutputData } from '@editorjs/editorjs'
import { useToastStore } from '@/shared/store/useToastStore'
// Editor.js tools
import Header from '@editorjs/header'
import List from '@editorjs/list'
import Quote from '@editorjs/quote'
import Table from '@editorjs/table'
import Image from '@editorjs/image'
import Marker from '@editorjs/marker'
import Delimiter from '@editorjs/delimiter'
import Embed from '@editorjs/embed'
import Warning from '@editorjs/warning'
import Underline from '@editorjs/underline'
import Paragraph from '@editorjs/paragraph'
import { i18n } from './i18n-dictionary'

export function useEditorJsWrapperModel(initialDataProp?: OutputData, readonlyProp?: boolean) {
  const { addToast } = useToastStore()
  const initialData = ref(initialDataProp)
  const readonly = ref(readonlyProp)

  const editorInstance = ref<EditorJS | null>(null)

  // Некоторый хак, вычисляющий установлена ли сейчас темная тема в primeVue
  // Необходимо для темизации editor.js
  const isDark = computed(() => window.matchMedia('(prefers-color-scheme: dark)').matches)

  onMounted(() => {
    editorInstance.value = new EditorJS(editorJsConfig.value)
  })

  onBeforeUnmount(() => {
    editorInstance.value?.destroy()
  })

  async function saveAndGetEditorJsContent(): Promise<OutputData> {
    if (!editorInstance.value) {
      addToast({
        severity: 'error',
        summary: 'Ошибка инициализации',
        detail: `Экземпляр Editor.js не инициализирован`,
        life: 20e3,
      })
      throw new Error('Экземпляр Editor.js не инициализирован')
    }

    try {
      const data = await editorInstance.value.save()
      return data
    } catch (error) {
      addToast({
        severity: 'error',
        summary: 'Ошибка сохранения',
        detail: `Не удалось сохранить контент Editor.js \n Сообщение: ${(error as Error).message}`,
        life: 20e3,
      })
      throw new Error(
        `Не удалось сохранить контент Editor.js \n Сообщение: ${(error as Error).message}`,
      )
    }
  }

  // TODO: вынести бы куда
  const editorJsConfig = computed(() => ({
    holder: 'editorjs',
    data: toRaw(initialData.value),
    readOnly: readonly.value || false,
    i18n,
    tools: {
      header: {
        class: Header,
        config: {
          placeholder: 'Введите заголовок',
        },
      },
      list: {
        class: List,
        inlineToolbar: true,
        config: {
          defaultStyle: 'unordered',
          placeholder: {
            unordered: 'Маркированный список',
            ordered: 'Нумерованный список',
          },
        },
      },
      quote: {
        class: Quote,
        config: {
          quotePlaceholder: 'Введите цитату',
          captionPlaceholder: 'Автор цитаты',
        },
      },
      table: {
        class: Table,
        inlineToolbar: true,
        config: {
          rows: 2,
          cols: 3,
          placeholder: 'Таблица',
        },
      },
      warning: {
        class: Warning,
        config: {
          titlePlaceholder: 'Заголовок предупреждения',
          messagePlaceholder: 'Текст предупреждения',
        },
      },
      delimiter: {
        class: Delimiter,
      },
      embed: {
        class: Embed,
        config: {
          placeholder: 'Вставьте ссылку (YouTube, Vimeo и др.)',
        },
      },
      marker: {
        class: Marker,
        shortcut: 'CMD+SHIFT+M',
      },
      underline: {
        class: Underline,
        shortcut: 'CMD+SHIFT+U',
      },
      paragraph: {
        class: Paragraph,
        inlineToolbar: true,
        config: {
          placeholder: 'Начните вводить текст...',
        },
      },
      image: {
        class: Image,
        config: {
          features: {
            caption: 'optional',
          },
          endpoints: {
            // TODO: можно написать кастомный метод, чтобы не в обход apiClient было
            byFile: import.meta.env.VITE_API_URL + import.meta.env.VITE_API_IMAGE_UPLOAD_ENDPOINT,
          },
          field: 'image',
          captionPlaceholder: 'Подпись к изображению',
          buttonContent: 'Загрузить изображение',
        },
      },
    },
  }))
  return {
    isDark,
    saveAndGetEditorJsContent,
  }
}
