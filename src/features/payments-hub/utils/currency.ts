import type { CurrencyCode } from '../types'

const localeMap: Record<CurrencyCode, string> = {
  USD: 'en-US',
  COP: 'es-CO',
  MXN: 'es-MX',
  EUR: 'de-DE',
  GBP: 'en-GB',
  JPY: 'ja-JP',
}

export function formatCurrency(amount: number, currency: CurrencyCode): string {
  return new Intl.NumberFormat(localeMap[currency], {
    style: 'currency',
    currency,
    minimumFractionDigits: currency === 'JPY' ? 0 : 2,
    maximumFractionDigits: currency === 'JPY' ? 0 : 2,
  }).format(amount)
}

export function isForeignCurrency(currency: CurrencyCode, base: CurrencyCode = 'COP'): boolean {
  return currency !== base
}
