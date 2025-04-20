// using a currency library here in case we want to add more in future
export const formatDollarAmount = (num: number | undefined, digits = 2, round = true) => {
  if (num === undefined) return '-'
  if (num <= 0) return '$0.00'

  // Handle very small numbers (less than 0.00000001)
  if (num < 0.00000001) {
    return `<$${num.toFixed(8)}`
  }

  // For numbers between 0.00000001 and 0.1, use fixed notation with up to 8 digits
  if (num < 0.1) {
    // Count significant decimal places without trailing zeros
    const decimalPlaces = Math.max(digits, 8) // Show at least 8 digits for very small amounts
    return `$${num.toFixed(decimalPlaces).replace(/(\.\d*?[1-9])0+$|\.0+$/, '$1')}`
  }

  return Intl.NumberFormat('en-US', {
    notation: round ? 'compact' : 'standard',
    minimumFractionDigits: num > 1000 ? 2 : digits,
    maximumFractionDigits: num > 1000 ? 2 : digits,
    style: 'currency',
    currency: 'USD',
  }).format(num)
}

// using a currency library here in case we want to add more in future
export const formatAmount = (num: number | undefined, digits = 2) => {
  if (num !== undefined && num <= 0) return '0'
  if (!num) return '-'
  if (num < 0.001) {
    return '<0.001'
  }

  return Intl.NumberFormat('en-US', {
    notation: 'compact',
    minimumFractionDigits: num > 1000 ? 2 : digits,
    maximumFractionDigits: num > 1000 ? 2 : digits,
  }).format(num)
}
