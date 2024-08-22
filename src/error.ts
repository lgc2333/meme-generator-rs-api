import { HTTP } from '@cordisjs/plugin-http'

import { MemeErrorResponse } from './types'

export class MemeError extends Error {
  constructor(
    public readonly type: MemeError.Types | undefined,
    public readonly response: HTTP.Response<MemeErrorResponse>,
  ) {
    super(
      `(${response.status}) [${type ?? 'unknown-error'}]` +
        ` ${MemeError.formatMessage(response)}`,
    )
    this.name = 'MemeGeneratorError'
  }

  get memeMessage() {
    return MemeError.formatMessage(this.response)
  }
}
export namespace MemeError {
  export const types = [
    'no-such-meme',
    'text-over-length',
    'open-image-failed',
    'params-mismatch',
    'image-number-mismatch',
    'text-number-mismatch',
    'text-or-name-not-enough',
    'arg-mismatch',
    'arg-parser-mismatch',
    'arg-model-mismatch',
    'meme-feedback',
  ] as const
  export type Types = (typeof types)[number]

  export const codeCond: Record<Types, [number, number] | number> = {
    'no-such-meme': 531,
    'text-over-length': 532,
    'open-image-failed': 533,
    'image-number-mismatch': 541,
    'text-number-mismatch': 542,
    'text-or-name-not-enough': 543,
    'params-mismatch': [540, 549],
    'arg-parser-mismatch': 551,
    'arg-model-mismatch': 552,
    'arg-mismatch': [550, 559],
    'meme-feedback': [560, 569],
  }

  export function formatMessage(response: HTTP.Response<MemeErrorResponse>): string {
    const {
      data: { detail },
    } = response
    return typeof detail === 'string'
      ? detail
      : detail
          .map(
            ({ type, loc, msg, input }) =>
              `${loc.join('.')} [type=${type}, input=${input}]: ${msg}`,
          )
          .join('\n')
  }

  export function getTypeFromCode(code: number): Types | undefined {
    const entries = Object.entries(codeCond) as [
      keyof typeof codeCond,
      (typeof codeCond)[keyof typeof codeCond],
    ][]
    for (const [type, cond] of entries) {
      if (Array.isArray(cond)) {
        if (code >= cond[0] && code <= cond[1]) return type
      } else if (code === cond) {
        return type
      }
    }
  }

  export function constructFromHTTPError(error: HTTP.Error): MemeError | undefined {
    const { response } = error
    if (!response || !('detail' in response.data)) return undefined
    const errResp = response as HTTP.Response<MemeErrorResponse>
    const type = getTypeFromCode(errResp.status)
    return new MemeError(type, errResp)
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
