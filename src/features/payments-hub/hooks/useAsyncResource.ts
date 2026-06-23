import { useCallback, useEffect, useState } from 'react'

interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useAsyncResource<T>(loader: () => Promise<T>) {
  const [refreshKey, setRefreshKey] = useState(0)
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false

    loader()
      .then((data) => {
        if (!cancelled) {
          setState({ data, loading: false, error: null })
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({
            data: null,
            loading: false,
            error: err instanceof Error ? err.message : 'Ocurrió un error inesperado.',
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [loader, refreshKey])

  const reload = useCallback(() => {
    setState({ data: null, loading: true, error: null })
    setRefreshKey((key) => key + 1)
  }, [])

  return { ...state, reload }
}
