// лучшее из найденных мной решений проблемы
// соответствия типов плагинов Editor.js

// BlockTools

declare module '@editorjs/table' {
  import { BlockToolConstructable } from '@editorjs/editorjs'
  const Table: BlockToolConstructable
  export default Table
}

declare module '@editorjs/embed' {
  import { BlockToolConstructable } from '@editorjs/editorjs'
  const Embed: BlockToolConstructable
  export default Embed
}

declare module '@editorjs/paragraph' {
  import { BlockToolConstructable } from '@editorjs/editorjs'
  const Paragraph: BlockToolConstructable
  export default Paragraph
}

// InlineTools
declare module '@editorjs/marker' {
  import { InlineToolConstructable } from '@editorjs/editorjs'
  const Marker: InlineToolConstructable
  export default Marker
}

declare module '@editorjs/underline' {
  import { InlineToolConstructable } from '@editorjs/editorjs'
  const Underline: InlineToolConstructable
  export default Underline
}
