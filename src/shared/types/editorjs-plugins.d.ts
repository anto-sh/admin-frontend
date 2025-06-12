// лучшее из найденных мной решений проблемы
// соответствия типов плагинов Editor.js

// BlockTools
declare module '@editorjs/header' {
  import { BlockToolConstructable } from '@editorjs/editorjs'
  const Header: BlockToolConstructable
  export default Header
}

declare module '@editorjs/list' {
  import { BlockToolConstructable } from '@editorjs/editorjs'
  const List: BlockToolConstructable
  export default List
}

declare module '@editorjs/quote' {
  import { BlockToolConstructable } from '@editorjs/editorjs'
  const Quote: BlockToolConstructable
  export default Quote
}

declare module '@editorjs/table' {
  import { BlockToolConstructable } from '@editorjs/editorjs'
  const Table: BlockToolConstructable
  export default Table
}

declare module '@editorjs/delimiter' {
  import { BlockToolConstructable } from '@editorjs/editorjs'
  const Delimiter: BlockToolConstructable
  export default Delimiter
}

declare module '@editorjs/embed' {
  import { BlockToolConstructable } from '@editorjs/editorjs'
  const Embed: BlockToolConstructable
  export default Embed
}

declare module '@editorjs/warning' {
  import { BlockToolConstructable } from '@editorjs/editorjs'
  const Warning: BlockToolConstructable
  export default Warning
}

declare module '@editorjs/paragraph' {
  import { BlockToolConstructable } from '@editorjs/editorjs'
  const Paragraph: BlockToolConstructable
  export default Paragraph
}

declare module '@editorjs/image' {
  import { BlockToolConstructable } from '@editorjs/editorjs'
  const Image: BlockToolConstructable
  export default Image
}

declare module '@weekwood/editorjs-video' {
  import { BlockToolConstructable } from '@editorjs/editorjs'
  const VideoTool: BlockToolConstructable
  export default VideoTool
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
