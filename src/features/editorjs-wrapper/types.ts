import type { OutputData } from '@editorjs/editorjs'

// TODO: проинспектировать решение, при необходимости доработать
// вспомогательный тип для типизации при использовании template ref в родительских компонентах
export interface EditorJsWrapperExposed {
  saveAndGetEditorJsContent: () => Promise<OutputData>
}
