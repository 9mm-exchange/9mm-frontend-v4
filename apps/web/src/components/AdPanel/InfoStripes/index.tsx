import { CloseIcon, Flex, IconButton, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { usePhishingBanner } from '@pancakeswap/utils/user'
import { CSSProperties, useCallback, useEffect, useMemo, useState } from 'react'
import { styled } from 'styled-components'
import 'swiper/css'
import 'swiper/css/effect-fade'

import { ASSET_CDN } from 'config/constants/endpoints'
import { Countdown } from './Countdown'

import { AdsIds, useAdsConfigs } from '../hooks/useAdsConfig'
import { InfoStripeCommon } from './InfoStripeCommon'
import { Step1 } from './Step1'
import { Step2 } from './Step2'
import { Step3 } from './Step3'

const Container = styled(Flex).withConfig({ shouldForwardProp: (prop) => !['$background'].includes(prop) })<{
  $background?: string
}>`
  overflow: hidden;
  height: 100%;
  padding: 12px;
  align-items: center;
  background: #280d5f;

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 0px;
    background: #7a6eaa;
    ${({ $background }) => $background && `background: ${$background};`}
  }
`

const InnerContainer = styled(Flex)`
  width: 100%;
  height: 100%;
  align-items: center;
`

const SpeechBubble = styled(Flex)`
  position: relative;
  border-radius: 5px;
  width: 100%;
  height: 80%;
  align-items: center;
  justify-content: space-between;

  & ${Text} {
    flex-shrink: 0;
    margin-right: 4px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    width: 800px;
    padding: 8px;
    margin-left: 8px;
    background: #280d5f;

    &:before {
      content: '';
      position: absolute;
      top: 50%;
      left: -7px;
      transform: translateY(-50%);
      width: 0;
      height: 0;
      border-top: 8px solid transparent;
      border-bottom: 8px solid transparent;
      border-right: 8px solid #280d5f;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    width: 900px;
  }
`
const AnimationContainer = styled(Flex)<{ $showAnimation?: boolean }>`
  width: 100%;
  justify-content: center;
  animation: ${({ $showAnimation }) => ($showAnimation ? `fadeIn 1s linear;` : 'none')};

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`

const DISPLAY_TIMER = 13000

type BannerConfig = {
  component: React.ReactNode
  stripeImage: string
  stripeImageWidth: string | number
  stripeImageAlt: string
  background?: string
  customStyle?: CSSProperties
}

const useBannerConfigs = () => {
  const configs = useAdsConfigs()
  const commonAdConfigs = useMemo(() => {
    return Object.entries(configs)
      .map(([key, value]) => {
        if (value.infoStripe) {
          return {
            component: <InfoStripeCommon id={key as AdsIds} />,
            stripeImage: `${ASSET_CDN}/web/phishing-warning/${value.infoStripe.img}.png`,
            stripeImageWidth: '92px',
            stripeImageAlt: value.id,
          }
        }
        return undefined
      })
      .filter(Boolean) as BannerConfig[]
  }, [configs])
  const CONFIG: BannerConfig[] = useMemo(
    () => [
      ...commonAdConfigs,
      {
        component: <Step1 />,
        stripeImage: `${ASSET_CDN}/web/phishing-warning/phishing-warning-bunny-1.png`,
        stripeImageWidth: '92px',
        stripeImageAlt: 'Phishing Warning',
      },
      {
        component: <Step2 />,
        stripeImage: `${ASSET_CDN}/web/phishing-warning/phishing-warning-bunny-2.png`,
        stripeImageWidth: '92px',
        stripeImageAlt: 'Phishing Warning',
      },
      {
        component: <Step3 />,
        stripeImage: `${ASSET_CDN}/web/banners/pcsx/pcsx-bg-medium.png`,
        stripeImageWidth: '92px',
        stripeImageAlt: 'PCSX',
      },
    ],
    [commonAdConfigs],
  )
  return CONFIG
}

const InfoStripes: React.FC<React.PropsWithChildren> = () => {
  const [, hideBanner] = usePhishingBanner()
  const { isDesktop, isLg } = useMatchBreakpoints()
  const showInBigDevice = isDesktop || isLg
  const [step, setStep] = useState(0)
  const [showAnimation, setShowAnimation] = useState(true)
  const CONFIG = useBannerConfigs()
  const banner = CONFIG[step]

  const nextItem = useMemo(() => (step < CONFIG.length - 1 ? step + 1 : 0), [step, CONFIG.length])

  const handleClickNext = useCallback(() => {
    setStep(nextItem)
    setShowAnimation(true)
  }, [nextItem])

  useEffect(() => {
    if (showAnimation) {
      const timeoutId = setTimeout(() => setShowAnimation(false), 1000)
      return () => clearTimeout(timeoutId)
    }
    return undefined
  }, [showAnimation])

  return (
    <Container className="warning-banner" $background={banner.background}>
      <AnimationContainer $showAnimation={showAnimation}>
        <Flex justifyContent="center" alignItems="center">
          {showInBigDevice && (
            <img
              style={banner.customStyle}
              width={banner.stripeImageWidth}
              alt={banner.stripeImageAlt}
              src={banner.stripeImage}
            />
          )}
          <SpeechBubble>
            <InnerContainer>
              {banner.component}
              {/* <banner.component /> */}
            </InnerContainer>
            <Countdown step={step} duration={DISPLAY_TIMER} onClick={handleClickNext} />
          </SpeechBubble>
        </Flex>
      </AnimationContainer>
      <IconButton onClick={hideBanner} variant="text">
        <CloseIcon color="#FFFFFF" />
      </IconButton>
    </Container>
  )
}

export default InfoStripes
