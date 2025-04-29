import { HTTP } from '@cordisjs/plugin-http'

import { MemeError } from './error'
import {
  ImageID,
  ImageIDs,
  ImgOps,
  MemeInfo,
  RenderMemeListRequest,
  RenderMemeRequest,
  RenderStatisticsRequest,
  UploadImageRequest,
} from './types'

export async function reqCatchWrapper<T>(
  fn: () => Promise<HTTP.Response<T>>,
): Promise<T> {
  return (await MemeError.catchWrapper(fn)).data
}

export class MemeAPI {
  public readonly imgOps: MemeAPI.ImageOperations

  constructor(public readonly http: HTTP) {
    this.imgOps = new MemeAPI.ImageOperations(http)
  }

  public async uploadImage(data: UploadImageRequest): Promise<ImageID> {
    return reqCatchWrapper(() =>
      this.http(`image/upload`, {
        method: 'POST',
        responseType: 'text',
        data,
      }),
    ).then((res) => JSON.parse(res) as ImageID)
  }

  public async getImage(imageId: string): Promise<Blob> {
    return reqCatchWrapper(() =>
      this.http(`image/${imageId}`, {
        method: 'GET',
        responseType: 'blob',
      }),
    )
  }

  public async getVersion(): Promise<string> {
    return reqCatchWrapper(() =>
      this.http(`meme/version`, { method: 'GET', responseType: 'text' }),
    )
  }

  public async getKeys(): Promise<string[]> {
    return reqCatchWrapper(() =>
      this.http(`meme/keys`, { method: 'GET', responseType: 'text' }),
    ).then((res) => JSON.parse(res) as string[])
  }

  public async getInfos(): Promise<MemeInfo[]> {
    return reqCatchWrapper(() =>
      this.http(`meme/infos`, { method: 'GET', responseType: 'text' }),
    ).then((res) => JSON.parse(res) as MemeInfo[])
  }

  public async searchMemes(query: string, includeTags?: boolean): Promise<string[]> {
    return reqCatchWrapper(() =>
      this.http(`meme/search`, {
        method: 'GET',
        params: { query, include_tags: includeTags },
        responseType: 'text',
      }),
    ).then((res) => JSON.parse(res) as string[])
  }

  public async getInfo(key: string): Promise<MemeInfo> {
    return reqCatchWrapper(() =>
      this.http(`memes/${key}/info`, { method: 'GET', responseType: 'text' }),
    ).then((res) => JSON.parse(res) as MemeInfo)
  }

  public async renderPreview(key: string): Promise<ImageID> {
    return reqCatchWrapper(() =>
      this.http(`memes/${key}/preview`, {
        method: 'GET',
        responseType: 'text',
      }),
    ).then((res) => JSON.parse(res) as ImageID)
  }

  public async renderMeme(key: string, data: RenderMemeRequest): Promise<ImageID> {
    return reqCatchWrapper(() =>
      this.http(`memes/${key}`, {
        method: 'POST',
        responseType: 'text',
        data,
      }),
    ).then((res) => JSON.parse(res) as ImageID)
  }

  public async renderList(data?: RenderMemeListRequest): Promise<ImageID> {
    return reqCatchWrapper(() =>
      this.http(`tools/render_list`, {
        method: 'POST',
        responseType: 'text',
        data,
      }),
    ).then((res) => JSON.parse(res) as ImageID)
  }

  public async renderStatistics(data: RenderStatisticsRequest): Promise<ImageID> {
    return reqCatchWrapper(() =>
      this.http(`tools/render_statistics`, {
        method: 'POST',
        responseType: 'text',
        data,
      }),
    ).then((res) => JSON.parse(res) as ImageID)
  }
}

export namespace MemeAPI {
  export class ImageOperations {
    constructor(public readonly http: HTTP) {}

    public async inspect(imageId: string): Promise<ImgOps.InspectResponse> {
      return reqCatchWrapper(() =>
        this.http(`tools/image_operations/inspect`, {
          method: 'POST',
          responseType: 'text',
          data: { image_id: imageId },
        }),
      ).then((res) => JSON.parse(res) as ImgOps.InspectResponse)
    }

    public async flipHorizontal(imageId: string): Promise<ImageID> {
      return reqCatchWrapper(() =>
        this.http(`tools/image_operations/flip_horizontal`, {
          method: 'POST',
          responseType: 'text',
          data: { image_id: imageId },
        }),
      ).then((res) => JSON.parse(res) as ImageID)
    }

    public async flipVertical(imageId: string): Promise<ImageID> {
      return reqCatchWrapper(() =>
        this.http(`tools/image_operations/flip_vertical`, {
          method: 'POST',
          responseType: 'text',
          data: { image_id: imageId },
        }),
      ).then((res) => JSON.parse(res) as ImageID)
    }

    public async rotate(
      imageId: string,
      extra: ImgOps.RotateRequestExtra,
    ): Promise<ImageID> {
      return reqCatchWrapper(() =>
        this.http(`tools/image_operations/rotate`, {
          method: 'POST',
          responseType: 'text',
          data: { image_id: imageId, ...extra },
        }),
      ).then((res) => JSON.parse(res) as ImageID)
    }

    public async resize(
      imageId: string,
      extra: ImgOps.ResizeRequestExtra,
    ): Promise<ImageID> {
      return reqCatchWrapper(() =>
        this.http(`tools/image_operations/resize`, {
          method: 'POST',
          responseType: 'text',
          data: { image_id: imageId, ...extra },
        }),
      ).then((res) => JSON.parse(res) as ImageID)
    }

    public async crop(
      imageId: string,
      extra: ImgOps.CropRequestExtra,
    ): Promise<ImageID> {
      return reqCatchWrapper(() =>
        this.http(`tools/image_operations/crop`, {
          method: 'POST',
          responseType: 'text',
          data: { image_id: imageId, ...extra },
        }),
      ).then((res) => JSON.parse(res) as ImageID)
    }

    public async grayscale(imageId: string): Promise<ImageID> {
      return reqCatchWrapper(() =>
        this.http(`tools/image_operations/grayscale`, {
          method: 'POST',
          responseType: 'text',
          data: { image_id: imageId },
        }),
      ).then((res) => JSON.parse(res) as ImageID)
    }

    public async invert(imageId: string): Promise<ImageID> {
      return reqCatchWrapper(() =>
        this.http(`tools/image_operations/invert`, {
          method: 'POST',
          responseType: 'text',
          data: { image_id: imageId },
        }),
      ).then((res) => JSON.parse(res) as ImageID)
    }

    public async mergeHorizontal(imageIds: string[]): Promise<ImageID> {
      return reqCatchWrapper(() =>
        this.http(`tools/image_operations/merge_horizontal`, {
          method: 'POST',
          responseType: 'text',
          data: { image_ids: imageIds },
        }),
      ).then((res) => JSON.parse(res) as ImageID)
    }

    public async mergeVertical(imageIds: string[]): Promise<ImageID> {
      return reqCatchWrapper(() =>
        this.http(`tools/image_operations/merge_vertical`, {
          method: 'POST',
          responseType: 'text',
          data: { image_ids: imageIds },
        }),
      ).then((res) => JSON.parse(res) as ImageID)
    }

    public async gifSplit(imageId: string): Promise<ImageIDs> {
      return reqCatchWrapper(() =>
        this.http(`tools/image_operations/gif_split`, {
          method: 'POST',
          responseType: 'text',
          data: { image_id: imageId },
        }),
      ).then((res) => JSON.parse(res) as ImageIDs)
    }

    public async gifMerge(
      imageIds: string[],
      extra: ImgOps.GifMergeRequestExtra,
    ): Promise<ImageID> {
      return reqCatchWrapper(() =>
        this.http(`tools/image_operations/gif_merge`, {
          method: 'POST',
          responseType: 'text',
          data: { image_ids: imageIds, ...extra },
        }),
      ).then((res) => JSON.parse(res) as ImageID)
    }

    public async gifReverse(imageId: string): Promise<ImageID> {
      return reqCatchWrapper(() =>
        this.http(`tools/image_operations/gif_reverse`, {
          method: 'POST',
          responseType: 'text',
          data: { image_id: imageId },
        }),
      ).then((res) => JSON.parse(res) as ImageID)
    }

    public async gifChangeDuration(
      imageId: string,
      extra: ImgOps.GifChangeDurationRequestExtra,
    ): Promise<ImageID> {
      return reqCatchWrapper(() =>
        this.http(`tools/image_operations/gif_change_duration`, {
          method: 'POST',
          responseType: 'text',
          data: { image_id: imageId, ...extra },
        }),
      ).then((res) => JSON.parse(res) as ImageID)
    }
  }
}
