let swapSound: HTMLAudioElement

const swapSoundURL = '/sound.mpeg'

export const getSwapSound = () => {
  if (!swapSound) {
    swapSound = new Audio(swapSoundURL)
  }
  return swapSound
}
