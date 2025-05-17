import dayjs from 'dayjs'

export const SUBGRAPH_START_BLOCK = 1745785979

/**
 * Returns UTC timestamps for 24h ago, 48h ago, 7d ago, 14d ago, and 30d ago relative to current date and time.
 * Ensures no timestamp is earlier than SUBGRAPH_START_BLOCK.
 */
export const getDeltaTimestamps = (): [number, number, number, number, number] => {
  const currentTime = dayjs()
  const t24h = Math.max(currentTime.subtract(1, 'days').startOf('minutes').unix(), SUBGRAPH_START_BLOCK)
  const t48h = Math.max(currentTime.subtract(2, 'days').startOf('minutes').unix(), SUBGRAPH_START_BLOCK)
  const t7d = Math.max(currentTime.subtract(1, 'weeks').startOf('minutes').unix(), SUBGRAPH_START_BLOCK)
  const t14d = Math.max(currentTime.subtract(2, 'weeks').startOf('minutes').unix(), SUBGRAPH_START_BLOCK)
  const t30d = Math.max(currentTime.subtract(30, 'days').startOf('minute').unix(), SUBGRAPH_START_BLOCK)
  return [t24h, t48h, t7d, t14d, t30d]
}
