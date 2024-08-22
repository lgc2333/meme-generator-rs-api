// #region alconna

/**
 * 节点触发的动作类型
 * @see https://github.com/ArcletProject/Alconna/blob/75196c3/src/arclet/alconna/action.py#L6
 */
export enum ActType {
  /**
   * 无 Args 时, 仅存储一个值, 默认为 Ellipsis; 有 Args 时, 后续的解析结果会覆盖之前的值
   */
  STORE = 0,
  /**
   * 无 Args 时, 将多个值存为列表, 默认为 Ellipsis; 有 Args 时, 每个解析结果会追加到列表中
   *
   * 当存在默认值并且不为列表时, 会自动将默认值变成列表, 以保证追加的正确性
   */
  APPEND = 1,
  /**
   * 无 Args 时, 计数器加一; 有 Args 时, 表现与 STORE 相同
   *
   * 当存在默认值并且不为数字时, 会自动将默认值变成 1, 以保证计数器的正确性
   */
  COUNT = 2,
}

/**
 * 节点触发的动作
 * @see https://github.com/ArcletProject/Alconna/blob/75196c3/src/arclet/alconna/action.py#L24
 */
export interface Action {
  type: ActType
  value: any
}

/**
 * 标识参数单元的特殊属性
 * @see https://github.com/ArcletProject/Alconna/blob/75196c3/src/arclet/alconna/args.py#L28
 */
export enum ArgFlag {
  OPTIONAL = '?',
  HIDDEN = '/',
  ANTI = '!',
}

// #endregion

// #region meme-generator

/**
 * @see https://github.com/MeetWq/meme-generator/blob/8bb9fba/meme_generator/meme.py#L23
 */
export type UserInfoGender = 'male' | 'female' | 'unknown'
export interface UserInfo {
  name?: string
  gender?: UserInfoGender
}

/**
 * @see https://github.com/MeetWq/meme-generator/blob/8bb9fba/meme_generator/meme.py#L44
 */
export interface ParserArg {
  name: string
  value: string
  default?: any | null
  flags?: ArgFlag[] | null
}

/**
 * @see https://github.com/MeetWq/meme-generator/blob/8bb9fba/meme_generator/meme.py#L51
 */
export interface ParserOption {
  names: string[]
  args?: ParserArg[] | null
  dest?: string | null
  default?: any | null
  action?: Action | null
  help_text?: string | null
  compact?: boolean | null
}

/**
 * @see https://github.com/MeetWq/meme-generator/blob/8bb9fba/meme_generator/meme.py#L81
 */
export interface CommandShortcut {
  key: string
  args?: string[] | null
  humanized?: string | null
}

/**
 * @see https://github.com/MeetWq/meme-generator/blob/8bb9fba/meme_generator/app.py#L24
 */
export interface MemeArgsResponse {
  args_model: Record<string, any>
  args_examples: Record<string, any>[]
  parser_options: ParserOption[]
}

/**
 * @see https://github.com/MeetWq/meme-generator/blob/8bb9fba/meme_generator/app.py#L30
 */
export interface MemeParamsResponse {
  min_images: number
  max_images: number
  min_texts: number
  max_texts: number
  default_texts: string[]
  args_type?: MemeArgsResponse | null
}

/**
 * @see https://github.com/MeetWq/meme-generator/blob/8bb9fba/meme_generator/app.py#L39
 */
export interface MemeInfoResponse {
  key: string
  params_type: MemeParamsResponse
  keywords: string[]
  shortcuts: CommandShortcut[]
  tags: string[]
  date_created: string
  date_modified: string
}

/**
 * @see https://github.com/MeetWq/meme-generator/blob/8bb9fba/meme_generator/app.py#L93
 */
export type MemeKeyWithPropertiesLabel = 'new' | 'hot'
export interface MemeKeyWithProperties {
  meme_key: string
  disabled?: boolean
  labels?: MemeKeyWithPropertiesLabel[]
}

/**
 * @see https://github.com/MeetWq/meme-generator/blob/8bb9fba/meme_generator/app.py#L105
 */
export interface RenderMemeListRequest {
  meme_list?: MemeKeyWithProperties[]
  text_template?: string
  add_category_icon?: boolean
}

/**
 * @see https://github.com/pydantic/pydantic-core/blob/4113638/python/pydantic_core/__init__.py#L73
 */
export interface PyDanticErrorDetails {
  type: string
  loc: (string | number)[]
  msg: string
  input: any
  ctx?: Record<string, any>
}

export interface MemeErrorResponse {
  detail: PyDanticErrorDetails[] | string
}

// #endregion
