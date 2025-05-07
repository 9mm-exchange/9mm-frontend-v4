import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { Box, Link, Message, MessageText, Text } from '@pancakeswap/uikit'
import SubgraphHealthIndicator from 'components/SubgraphHealthIndicator'
import { useRef } from 'react'
import { createPortal } from 'react-dom'
import { usePotteryFetch } from 'state/pottery/hook'
import Banner from 'views/Pottery/components/Banner/index'
import Pot from 'views/Pottery/components/Pot/index'

import { GRAPH_API_POTTERY } from 'config/constants/endpoints'

import FAQ from './components/FAQ'
import FinishedRounds from './components/FinishedRounds'
import HowToPlay from './components/HowToPlay'
import PrizeFunds from './components/PrizeFunds'

const Pottery: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()

  usePotteryFetch()
  const potWrapperEl = useRef<HTMLDivElement>(null)

  const handleScroll = () => {
    window.scrollTo({
      top: potWrapperEl?.current?.offsetTop,
      behavior: 'smooth',
    })
  }

  return (
    <Box position="relative">
      <Box padding="0 16px" margin="10px auto" width={['100%', '100%', '100%', '800px']}>
        <Message variant="warning">
          <MessageText>
            <Text as="span">{t('9mm Pottery (BETA) is indefinitely halted. Please refer')}</Text>
            <Link
              style={{ display: 'inline-block' }}
              m="0 4px"
              external
              href="https://blog.pancakeswap.finance/articles/idefinitely-halt-of-pancake-swap-pottery-beta-product"
            >
              {t('here')}
            </Link>
            <Text as="span">{t('for more details')}</Text>
          </MessageText>
        </Message>
      </Box>
      <Banner handleScroll={handleScroll} />
      <Box ref={potWrapperEl}>
        <Pot />
      </Box>
      <FinishedRounds />
      <HowToPlay />
      <PrizeFunds />
      <FAQ />
      {createPortal(
        <>
          <SubgraphHealthIndicator chainId={ChainId.BSC} subgraph={GRAPH_API_POTTERY} />
        </>,
        document.body,
      )}
    </Box>
  )
}

export default Pottery
