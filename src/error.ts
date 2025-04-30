import { HTTP } from '@cordisjs/plugin-http'

import { MemeErrorResponse, errorCodeDesc } from './types'

export class MemeError extends Error {
  constructor(
    public readonly httpStatus: number,
    public readonly message: string,
  ) {
    super(`(${httpStatus}) ${message}`)
    this.name = 'MemeError'
  }
}

export class MemeDetailedError extends MemeError {
  constructor(public readonly data: MemeErrorResponse) {
    super(
      MemeDetailedError.httpStatus,
      `${errorCodeDesc[data.code] ?? 'UnknownError'} (${data.code}): ${data.message}`,
    )
    this.name = 'MemeDetailedError'
  }
}

export namespace MemeDetailedError {
  export const httpStatus = 500
}

export namespace MemeError {
  export const Detailed = MemeDetailedError
  export type Detailed = MemeDetailedError

  export function constructFromHTTPError(error: HTTP.Error): MemeError | undefined {
    const { response } = error
    if (!response) return undefined
    const errResp = response as HTTP.Response<any>
    const dataIsObj = typeof errResp.data === 'object'
    if (errResp.status === Detailed.httpStatus && dataIsObj) {
      try {
        return new MemeDetailedError(errResp.data)
      } catch (_) {}
    }
    return new MemeError(
      errResp.status,
      dataIsObj ? JSON.stringify(errResp.data) : errResp.data,
    )
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
