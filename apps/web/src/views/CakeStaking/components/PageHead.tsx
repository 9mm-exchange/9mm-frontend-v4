import { useTranslation } from '@pancakeswap/localization'
import { ArrowForwardIcon, Box, Button, Flex, Grid, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from '@pancakeswap/widgets-internal'
import { AdPlayer } from 'components/AdPanel/AdPlayer'
import PinnedFAQButton from 'components/PinnedFAQButton'
import { useMemo } from 'react'
import styled, { css } from 'styled-components'
import faqConfig from '../faqConfig'
import { useCakeLockStatus } from '../hooks/useVeCakeUserInfo'
import { CakeLockStatus } from '../types'
import { HeadBunny, MobileHeadBunny } from './HeadImage'

export const PageHead = () => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  return (
    <>
      {isMobile && (
        <Box mb="16px">
          <AdPlayer />
        </Box>
      )}

      <Flex justifyContent="space-between" flexDirection="row">
        {isMobile ? (
          <Heading />
        ) : (
          <Flex flex="1" flexDirection="column" mr={[0, 0, '8px']}>
            <Heading />
            <Description />
            <NextLinkFromReactRouter
              to="/swap?chain=pulse&inputCurrency=PLS&outputCurrency=0x7b39712Ef45F7dcED2bBDF11F3D5046bA61dA719"
              prefetch={false}
              style={{ width: 'fit-content' }}
            >
              <Button p="0" variant="text" mt="4px">
                <Text color="primary" bold fontSize="16px" mr="4px">
                  {t('Get CAKE')}
                </Text>
                <ArrowForwardIcon color="primary" />
              </Button>
            </NextLinkFromReactRouter>
          </Flex>
        )}
        {/* <Box>{!isMobile && <AdPanel.AdPlayer />}</Box> */}
        <Box>
          <HeadBunny />
        </Box>
      </Flex>
    </>
  )
}

const Heading = () => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const { status } = useCakeLockStatus()
  const staking = useMemo(() => status === CakeLockStatus.Locking, [status])

  return (
    <Flex alignItems="baseline" width="100%" justifyContent={staking || isMobile ? 'space-between' : undefined}>
      <Text lineHeight="110%" bold color="secondary" mb="0px" fontSize={['32px', '32px', '64px', '64px']}>
        {t('CAKE Staking')}
      </Text>
      {isMobile ? (
        <PinnedFAQButton
          faqConfig={faqConfig}
          docLink="https://9mm-pro.gitbook.io/9mm-pro/products/vecake/what-is-vecake"
        />
      ) : null}
    </Flex>
  )
}

const DescriptionContent = styled(Box).withConfig({
  shouldForwardProp: (props) => props !== 'fullSize',
})<{
  fullSize?: boolean
}>`
  max-width: 196px;

  @media screen and (min-width: 360px) {
    max-width: 243px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    max-width: 537px;
  }

  ${({ fullSize }) =>
    fullSize
      ? css`
          max-width: 100% !important;
        `
      : null}
`

const Description = () => {
  const { t } = useTranslation()
  const { status } = useCakeLockStatus()
  const { isMobile } = useMatchBreakpoints()
  const staking = useMemo(() => status === CakeLockStatus.Locking, [status])
  return (
    <Grid justifyContent="space-between" gridTemplateColumns={staking ? '1fr' : ['4fr 1fr', '4fr 1fr', '1fr']}>
      <DescriptionContent fullSize={staking}>
        <Text color="textSubtle" lineHeight="120%">
          {t(
            'Enjoy the benefits of weekly CAKE yield, revenue share, gauges voting, farm yield boosting, participating in IFOs, and so much more!',
          )}
        </Text>
      </DescriptionContent>
      {isMobile && !staking ? <MobileHeadBunny /> : null}
    </Grid>
  )
}
