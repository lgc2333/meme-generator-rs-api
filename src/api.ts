import { HTTP } from '@cordisjs/plugin-http'

import { MemeError } from './error'
import { MemeInfoResponse, RenderMemeListRequest, UserInfo } from './types'

// const defaultOptions: Required<MemeAPI.Options> = {}

async function reqCatchWrapper<T>(fn: () => Promise<HTTP.Response<T>>): Promise<T> {
  return (await MemeError.catchWrapper(fn)).data
}

export class MemeAPI {
  // public options: Required<MemeAPI.Options>

  constructor(
    public readonly http: HTTP,
    // options: MemeAPI.Options = {},
  ) {
    // this.options = { ...defaultOptions, ...options }
  }

  public async renderList(data?: RenderMemeListRequest): Promise<Blob> {
    return reqCatchWrapper(() =>
      this.http('/memes/render_list', { method: 'POST', responseType: 'blob', data }),
    )
  }

  public async getKeys(): Promise<string[]> {
    return reqCatchWrapper(() =>
      this.http('/memes/keys', { method: 'GET', responseType: 'json' }),
    )
  }

  public async getInfo(key: string): Promise<MemeInfoResponse> {
    return reqCatchWrapper(() =>
      this.http(`/memes/${key}/info`, { method: 'GET', responseType: 'json' }),
    )
  }

  public async renderPreview(key: string): Promise<Blob> {
    return reqCatchWrapper(() =>
      this.http(`/memes/${key}/preview`, { method: 'GET', responseType: 'blob' }),
    )
  }

  public async renderMeme(key: string, options?: MemeAPI.RenderOptions): Promise<Blob> {
    const { images, texts, args } = options || {}

    const data = new FormData()
    images?.forEach((image) => data.append('images', image))
    texts?.forEach((text) => data.append('texts', text))
    if (args) data.append('args', JSON.stringify(args))

    return reqCatchWrapper(() =>
      this.http(`/memes/${key}/`, { method: 'POST', responseType: 'blob', data }),
    )
  }
}
export namespace MemeAPI {
  // export interface Options {
  // }

  export interface RenderOptions {
    images?: Blob[]
    texts?: string[]
    args?: { user_infos?: UserInfo[] } & Record<string, any>
  }
}
