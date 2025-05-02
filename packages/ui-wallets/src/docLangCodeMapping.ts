const docLangCodeMapping: Record<string, string> = {
  it: 'italian',
  ja: 'japanese',
  fr: 'french',
  tr: 'turkish',
  vi: 'vietnamese',
  id: 'indonesian',
  'zh-cn': 'chinese',
  'pt-br': 'portuguese-brazilian',
}

export const getDocLink = (code: string) =>
  docLangCodeMapping[code]
    ? `https://9mm-pro.gitbook.io/9mm-pro/v/${docLangCodeMapping[code]}/get-started/connection-guide`
    : `https://9mm-pro.gitbook.io/9mm-pro/get-started/connection-guide`
