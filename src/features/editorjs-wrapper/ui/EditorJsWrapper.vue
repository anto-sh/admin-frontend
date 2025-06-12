<script lang="ts" setup>
import type { OutputData } from '@editorjs/editorjs'
import { useEditorJsWrapperModel } from '../model/useEditorJsWrapperModel'

const props = defineProps<{
  initialData?: OutputData
  readonly?: boolean
}>()

const { isDark, saveAndGetEditorJsContent } = useEditorJsWrapperModel(
  props.initialData,
  props.readonly,
)

defineExpose({
  saveAndGetEditorJsContent,
})
</script>

<template>
  <div id="editorjs" class="editorjs-container" :class="isDark ? 'editorjs-container--dark' : ''" />
</template>

<style lang="scss">
// TODO: проинспектировать решение, возможно упростить, убрать лишнее
// темизация editor.js для темной темы

.editorjs-container {
  &--dark {
    background: var(--p-surface-ground);
    color: var(--p-text-color);

    // Основной редактор и блоки
    .codex-editor,
    .ce-block,
    .ce-block__content {
      background: var(--p-surface-ground);
      color: var(--p-text-color);

      // Drag handle
      .ce-block__drag-handle {
        color: var(--p-text-color);
      }

      // Фокусировка блока
      &.ce-block--focused {
        background: var(--p-surface-900);
        box-shadow: 0 0 0 2px var(--p-surface-700);
      }
    }

    .cdx-button {
      background-color: var(--p-blue-100);
    }

    // Плейсхолдеры и подсказки
    .ce-paragraph[data-placeholder]:empty:before {
      color: var(--p-text-color);
      opacity: 0.7;
    }

    // Toolbar
    .ce-toolbar__content,
    .ce-toolbar__plus,
    .ce-toolbar__settings-btn {
      background: var(--p-surface-900);
      color: var(--p-text-color);
      border-color: var(--p-surface-700);

      &:hover {
        background: var(--p-surface-800);
        color: var(--p-highlight-color);
      }
    }

    // Inline toolbar
    .ce-inline-toolbar {
      background: var(--p-surface-900);
      color: var(--p-text-color);
      border-color: var(--p-surface-700);
      box-shadow: 0 2px 8px var(--p-shadow-6);

      .ce-inline-tool,
      .ce-popover-item {
        color: var(--p-text-color);
        background: transparent;

        &--active {
          background: var(--p-surface-800);
          color: var(--p-highlight-color);
        }
      }

      .ce-popover-item--active .ce-popover-item__icon {
        background: var(--p-surface-800);
        color: var(--p-highlight-color);
      }
    }

    // Поповер
    .ce-popover {
      background: var(--p-surface-900);
      color: var(--p-text-color);
      border-color: var(--p-surface-700);
      box-shadow: 0 2px 8px var(--p-shadow-6);

      &__container {
        background-color: var(--p-surface-900);
        border-color: var(--p-surface-700);
      }

      &-item:not(.ce-popover-item--confirmation) {
        color: var(--p-text-color);
        background: transparent;

        &:hover {
          background: var(--p-surface-800);
          color: var(--p-highlight-color);
        }
      }
    }

    // Поисковое поле в поповере
    .cdx-search-field {
      color: var(--p-text-color);
      background-color: var(--p-surface-900);
    }

    // Inputs и формы
    input,
    textarea {
      background: var(--p-surface-900);
      color: var(--p-text-color);
      border: 1px solid var(--p-surface-700);
    }

    // Selection/highlight
    ::selection {
      background: var(--p-highlight-bg);
      color: var(--p-highlight-color);
    }

    // Error и предупреждения
    .cdx-notify--error {
      background: var(--p-error-surface);
      color: var(--p-error-text);
    }
    .cdx-notify--warning {
      background: var(--p-warning-surface);
      color: var(--p-warning-text);
    }

    // Divider/line tool
    .ce-delimiter {
      border-color: var(--p-surface-700);
    }

    // Link tool
    .cdx-link-tool__input {
      background: var(--p-surface-900);
      color: var(--p-text-color);
      border: 1px solid var(--p-surface-700);
    }

    // Image tool
    .cdx-image__caption {
      background: var(--p-surface-900);
      color: var(--p-text-color);
    }

    // Table tool
    .tc-wrap,
    .tc-table,
    .tc-row,
    .tc-row::after,
    .tc-cell,
    .tc-add-column,
    .tc-add-row {
      border-color: var(--p-surface-700);
    }

    .tc-cell--selected {
      background-color: var(--p-surface-600);
    }

    .tc-add-column,
    .tc-add-row {
      color: var(--p-text-color);
      svg {
        background-color: var(--p-surface-700);
      }
      &:hover,
      &:hover:before {
        background-color: var(--p-surface-600);
      }
    }

    .tc-toolbox {
      &__toggler {
        color: var(--p-text-color);
        &:hover {
          color: var(--p-highlight-color);
        }
      }
    }

    .tc-popover {
      background-color: var(--p-surface-900);
      border-color: var(--p-surface-700);
      &__item {
        &-icon {
          background-color: var(--p-surface-900);
          border-color: var(--p-surface-700);
        }
        &:hover {
          background-color: var(--p-surface-800);
        }
      }
    }
  }
}
</style>
