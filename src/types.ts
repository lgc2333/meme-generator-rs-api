export interface ParserFlags {
  short: boolean
  long: boolean
  short_aliases: string[]
  long_aliases: string[]
}

export interface MemeOption {
  type: 'boolean' | 'integer' | 'float' | 'string'
  name: string
  default: boolean | number | string | null
  description?: string | null
  parser_flags: ParserFlags
  choices?: string[] | null
  minimum?: number | null
  maximum?: number | null
}

export interface MemeShortcut {
  pattern: string
  humanized?: string | null
  names: string[]
  texts: string[]
  options: Record<string, any>
}

export interface MemeInfo {
  key: string
  params: {
    min_images: number
    max_images: number
    min_texts: number
    max_texts: number
    default_texts: string[]
    options: MemeOption[]
  }
  keywords: string[]
  shortcuts: MemeShortcut[]
  tags: string[]
  date_created: string
  date_modified: string
}

export type MemeKeyWithPropertiesLabel = 'new' | 'hot'
export interface MemeKeyWithProperties {
  meme_key: string
  disabled?: boolean
  labels?: MemeKeyWithPropertiesLabel[]
}

export interface RenderMemeListRequest {
  meme_list?: MemeKeyWithProperties[]
  text_template?: string
  add_category_icon?: boolean
}

export interface UploadImageRequest {
  type: 'url' | 'path' | 'data'
  url?: string
  headers?: Record<string, string>
  path?: string
  data?: string
}

export interface ImageID {
  image_id: string
}

export interface ImageIDs {
  image_ids: string[]
}

export interface ImageInspectResponse {
  width: number
  height: number
  is_multi_frame: boolean
  frame_count: number | null
  average_duration: number | null
}

export interface GifMergeRequest {
  image_ids: string[]
  duration?: number
}

export interface RenderStatisticsRequest {
  title: string
  statistics_type: 'meme_count' | 'time_count'
  data: [string, number][]
}

export interface RenderMemeRequestImage {
  name: string
  id: string
}

export interface RenderMemeRequest {
  images: RenderMemeRequestImage[]
  texts: string[]
  options: Record<string, any>
}

export const errorCodeDesc = {
  510: 'ImageDecodeError',
  520: 'ImageEncodeError',
  530: 'ImageAssetMissingError',
  540: 'DeserializeError',
  550: 'ImageNumberMismatchError',
  551: 'TextNumberMismatchError',
  560: 'TextOverLengthError',
  570: 'MemeFeedbackError',
}
export type PossibleMemeErrorCode = keyof typeof errorCodeDesc
export const possibleMemeErrorCodes = <PossibleMemeErrorCode[]>(
  Object.keys(errorCodeDesc).map((v) => parseInt(v, 10))
)

export interface BaseMemeErrorResp<
  C extends PossibleMemeErrorCode,
  D extends Record<string, any> = {},
> {
  code: C
  message: string
  data: D
}

export interface ImageDecodeErrorData {
  error: string
}

export interface ImageDecodeErrorResp
  extends BaseMemeErrorResp<510, ImageDecodeErrorData> {}

export interface ImageEncodeErrorData {
  error: string
}

export interface ImageEncodeErrorResp
  extends BaseMemeErrorResp<520, ImageEncodeErrorData> {}

export interface ImageAssetMissingData {
  path: string
}

export interface ImageAssetMissingErrorResp
  extends BaseMemeErrorResp<530, ImageAssetMissingData> {}

export interface DeserializeErrorData {
  error: string
}

export interface DeserializeErrorResp
  extends BaseMemeErrorResp<540, DeserializeErrorData> {}

export interface ImageNumberMismatchData {
  min: number
  max: number
  actual: number
}

export interface ImageNumberMismatchErrorResp
  extends BaseMemeErrorResp<550, ImageNumberMismatchData> {}

export interface TextNumberMismatchData {
  min: number
  max: number
  actual: number
}

export interface TextNumberMismatchErrorResp
  extends BaseMemeErrorResp<551, TextNumberMismatchData> {}

export interface TextOverLengthData {
  text: string
}

export interface TextOverLengthErrorResp
  extends BaseMemeErrorResp<560, TextOverLengthData> {}

export interface MemeFeedbackData {
  feedback: string
}

export interface MemeFeedbackErrorResp
  extends BaseMemeErrorResp<570, MemeFeedbackData> {}

export type MemeErrorResp =
  | ImageDecodeErrorResp
  | ImageEncodeErrorResp
  | ImageAssetMissingErrorResp
  | DeserializeErrorResp
  | ImageNumberMismatchErrorResp
  | TextNumberMismatchErrorResp
  | TextOverLengthErrorResp
  | MemeFeedbackErrorResp
