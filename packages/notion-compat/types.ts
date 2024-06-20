import type { Client } from '@notionhq/client'

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never

export type PartialPage = Awaited<
  ReturnType<InstanceType<typeof Client>['pages']['retrieve']>
>

export type Page = Extract<
  Awaited<ReturnType<InstanceType<typeof Client>['pages']['retrieve']>>,
  { url: string }
>

export type PartialBlock = Awaited<
  ReturnType<InstanceType<typeof Client>['blocks']['retrieve']>
>

export type Block = Extract<PartialBlock, { type: string }> & {
  created_by?: {
    object: string,
    id: string,
  },
  last_edited_by?: {
    object: string,
    id: string,
  },
  paragraph?: {
    rich_text: unknown[],
  }
}

export type BlockChildren = Awaited<
  ReturnType<InstanceType<typeof Client>['blocks']['children']['list']>
>['results']


export type RichText = Extract<
  Block,
  { type: 'paragraph' }
>['paragraph']['rich_text']

export type RichTextItem = ArrayElement<RichText> & {
  annotations: {
    bold: boolean,
    italic: boolean,
    strikethrough: boolean,
    underline: boolean,
    code: boolean,
    color: string,
  },
  type: string,
  text: {
    content: string,
  },
  equation?: {
    expression: string,
  },
  mention?: {
    type: string,
    link_preview?: {
      url: string,
    },
    page?: {
      id: string,
    },
    database?: {
      id: string,
    },
    date?: {
      start: string,
      end: string,
      time_zone: string,
    },
    user?: {
      id: string,
    }
  },
  plain_text?: string,
}

export type PageMap = Record<string, PartialPage>
export type BlockMap = Record<string, PartialBlock>
export type BlockChildrenMap = Record<string, Array<string>>

export type ParentMap = Record<string, string>
