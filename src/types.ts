// #region base / response

export interface ImageID {
  image_id: string
}

export interface ImageIDs {
  image_ids: string[]
}

export interface MemeParams {
  min_images: number
  max_images: number
  min_texts: number
  max_texts: number
  default_texts: string[]
  options: MemeOption[]
}

export type MemeOptionType = 'boolean' | 'integer' | 'float' | 'string'
export interface MemeOption {
  type: MemeOptionType
  name: string
  default: boolean | number | string | null
  description?: string | null
  parser_flags: ParserFlags
  choices?: string[] | null
  minimum?: number | null
  maximum?: number | null
}

export interface ParserFlags {
  short: boolean
  long: boolean
  short_aliases: string[]
  long_aliases: string[]
}

export interface MemeShortcut {
  pattern: string
  humanized: string | null
  names: string[]
  texts: string[]
  options: Record<string, any>
}

export interface MemeInfo {
  key: string
  params: MemeParams
  keywords: string[]
  shortcuts: MemeShortcut[]
  tags: string[]
  date_created: string
  date_modified: string
}

// #endregion

// #region request

export interface UploadImageByUrlRequest {
  type: 'url'
  url?: string
  headers?: Record<string, string>
}

export interface UploadImageByPathRequest {
  type: 'path'
  path?: string
}

export interface UploadImageByDataRequest {
  type: 'data'
  data?: string
}

export type UploadImageRequest =
  | UploadImageByUrlRequest
  | UploadImageByPathRequest
  | UploadImageByDataRequest

export interface MemeImage {
  name: string
  id: string
}

export interface RenderMemeRequest {
  images: MemeImage[]
  texts: string[]
  options: Record<string, any>
}

export interface MemeProperties {
  disabled?: boolean
  hot?: boolean
  new?: boolean
}

export type MemeListSortBy =
  | 'key'
  | 'keywords'
  | 'keywords_pinyin'
  | 'date_created'
  | 'date_modified'
export interface RenderMemeListRequest {
  meme_properties?: MemeProperties
  exclude_memes?: string[]
  sort_by?: MemeListSortBy
  sort_reverse?: boolean
  text_template?: string
  add_category_icon: boolean
}

export type MemeStatisticsType = 'meme_count' | 'time_count'
export interface RenderStatisticsRequest {
  title: string
  statistics_type: MemeStatisticsType
  data: [string, number][]
}

// #endregion

// #region error

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
export const possibleMemeErrorCodes = Object.keys(errorCodeDesc).map((v) =>
  parseInt(v, 10),
) as PossibleMemeErrorCode[]

export interface BaseMemeErrorResponse<
  C extends PossibleMemeErrorCode,
  D extends Record<string, any> = {},
> {
  code: C
  message: string
  data: D
}

export interface MemeCommonErrorData {
  error: string
}

export interface MemePathErrorData {
  path: string
}

export interface MemeNumberMismatchData {
  min: number
  max: number
  actual: number
}

export interface MemeTextErrorData {
  text: string
}

export interface MemeFeedbackErrorData {
  feedback: string
}

export interface ImageDecodeErrorResp
  extends BaseMemeErrorResponse<510, MemeCommonErrorData> {}

export interface ImageEncodeErrorResp
  extends BaseMemeErrorResponse<520, MemeCommonErrorData> {}

export interface ImageAssetMissingErrorResp
  extends BaseMemeErrorResponse<530, MemePathErrorData> {}

export interface DeserializeErrorResp
  extends BaseMemeErrorResponse<540, MemeCommonErrorData> {}

export interface ImageNumberMismatchErrorResp
  extends BaseMemeErrorResponse<550, MemeNumberMismatchData> {}

export interface TextNumberMismatchErrorResp
  extends BaseMemeErrorResponse<551, MemeNumberMismatchData> {}

export interface TextOverLengthErrorResp
  extends BaseMemeErrorResponse<560, MemeTextErrorData> {}

export interface MemeFeedbackErrorResp
  extends BaseMemeErrorResponse<570, MemeFeedbackErrorData> {}

export type MemeErrorResp =
  | ImageDecodeErrorResp
  | ImageEncodeErrorResp
  | ImageAssetMissingErrorResp
  | DeserializeErrorResp
  | ImageNumberMismatchErrorResp
  | TextNumberMismatchErrorResp
  | TextOverLengthErrorResp
  | MemeFeedbackErrorResp

// #endregion

export namespace ImgOps {
  export interface RotateRequestExtra {
    degrees?: number | null
  }

  export interface ResizeRequestExtra {
    width?: number | null
    height?: number | null
  }

  export interface CropRequestExtra {
    left?: number | null
    top?: number | null
    right?: number | null
    bottom?: number | null
  }

  export interface GifMergeRequestExtra {
    duration?: number | null
  }

  export interface GifChangeDurationRequestExtra {
    duration?: number | null
  }

  export interface InspectResponse {
    width: number
    height: number
    is_multi_frame: boolean
    frame_count: number | null
    average_duration: number | null
  }
}
