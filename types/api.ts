export interface ApiResponse<T> {
  data: T
  status: number
  ok: true
}

export interface ApiError {
  message: string
  status: number
  ok: false
}

export type ApiResult<T> = ApiResponse<T> | ApiError

export interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>
  timeout?: number
}
