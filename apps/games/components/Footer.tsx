import { ChainId } from '@pancakeswap/chains'
import { languageList, useTranslation } from '@pancakeswap/localization'
import { footerLinks } from '@pancakeswap/uikit'
import Footer from '@pancakeswap/uikit/components/Footer'
import { useCakePrice } from 'hooks/useCakePrice'
import { useTheme } from 'next-themes'
import { useMemo } from 'react'

const FooterPage = () => {
  const { setTheme, resolvedTheme } = useTheme()
  const { currentLanguage, setLanguage, t } = useTranslation()
  const { data: cakePrice } = useCakePrice()

  const isDark = resolvedTheme === 'dark'

  const toggleTheme = useMemo(() => {
    return () => setTheme(isDark ? 'light' : 'dark')
  }, [setTheme, isDark])

  const getFooterLinks = useMemo(() => {
    return footerLinks(t)
  }, [t])

  return (
    <Footer
      chainId={ChainId.PULSECHAIN}
      items={getFooterLinks}
      isDark={isDark}
      toggleTheme={toggleTheme}
      langs={languageList}
      setLang={setLanguage}
      currentLang={currentLanguage.code}
      cakePriceUsd={cakePrice ? Number(cakePrice) : undefined}
      buyCakeLabel={t('Buy 9MM')}
      buyCakeLink="https://dex.9mm.pro/swap?outputCurrency=0x7b39712Ef45F7dcED2bBDF11F3D5046bA61dA719&chainId=369"
    />
  )
}

export default FooterPage
