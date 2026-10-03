import { API_BASE_URL, DEFAULT_TIMEOUT_MS } from "@/lib/constants"
import type { ApiResult, FetchOptions } from "@/types/api"

export class ApiRequestError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiRequestError"
    this.status = status
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResult<T>> {
  const {
    params,
    timeout = DEFAULT_TIMEOUT_MS,
    headers,
    ...restOptions
  } = options

  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`
  const url = new URL(`${API_BASE_URL}${normalizedEndpoint}`)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.append(key, String(value))
      }
    })
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url.toString(), {
      ...restOptions,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...headers,
      },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      let errorMessage = `Request failed with status ${response.status} (${response.statusText})`
      try {
        const errorBody = await response.json()
        if (typeof errorBody === "string") {
          errorMessage = errorBody
        } else if (errorBody?.message) {
          errorMessage = errorBody.message
        }
      } catch {
        // Not a JSON response
      }

      if (response.status === 404) {
        errorMessage = "The requested resource could not be found."
      } else if (response.status >= 500) {
        errorMessage =
          "Fake Store API service is currently unavailable. Please try again later."
      }

      return {
        ok: false,
        message: errorMessage,
        status: response.status,
      }
    }

    const data = (await response.json()) as T
    return {
      ok: true,
      data,
      status: response.status,
    }
  } catch (error: unknown) {
    clearTimeout(timeoutId)

    if (error instanceof Error && error.name === "AbortError") {
      return {
        ok: false,
        message:
          "Request timed out while contacting Fake Store API. Please check your network connection.",
        status: 408,
      }
    }

    const message =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred while communicating with the server."

    return {
      ok: false,
      message,
      status: 0,
    }
  }
}

export async function fetchFromApi<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const result = await apiClient<T>(endpoint, options)
  if (!result.ok) {
    throw new ApiRequestError(result.message, result.status)
  }
  return result.data
}
