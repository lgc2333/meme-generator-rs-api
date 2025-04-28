import { HTTP } from '@cordisjs/plugin-http'

import { MemeErrorResp, errorCodeDesc } from './types'

export class MemeError extends Error {
  constructor(
    public readonly httpStatus: number,
    public readonly data: string,
  ) {
    super(data)
    this.name = 'MemeError'
  }
}

export class MemeDetailedError extends MemeError {
  readonly detail: MemeErrorResp

  constructor(public readonly data: string) {
    const detail = JSON.parse(data) as MemeErrorResp
    super(
      MemeError.errorHttpCode,
      `(${detail.code}) [${errorCodeDesc[detail.code]}] ${detail.message}`,
    )
    this.name = 'MemeDetailedError'
    this.detail = detail
  }
}

export namespace MemeError {
  export const errorHttpCode = 500

  export function constructFromHTTPError(error: HTTP.Error): MemeError | undefined {
    const { response } = error
    if (!response || !('detail' in response.data)) return undefined
    const errResp = response as HTTP.Response<string>
    if (errResp.status === errorHttpCode) {
      return new MemeDetailedError(errResp.data)
    }
    return new MemeError(errResp.status, errResp.data)
  }

  export function promiseCatchHandler(e: unknown): never {
    if (HTTP.Error.is(e)) {
      const memeError = constructFromHTTPError(e)
      if (memeError) throw memeError
    }
    throw e
  }

  export async function catchWrapper<T>(func: () => Promise<T> | T): Promise<T> {
    try {
      return await func()
    } catch (e) {
      MemeError.promiseCatchHandler(e)
    }
  }
}
