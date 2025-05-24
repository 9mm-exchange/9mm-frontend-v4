import { useTranslation } from '@pancakeswap/localization'
import { Button, FlexGap, Tab, TabMenu, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from '@pancakeswap/widgets-internal'
import Page from 'components/Layout/Page'
import { useRouter } from 'next/router'
import { PropsWithChildren, useMemo } from 'react'
import styled from 'styled-components'
import { PoolsBanner } from './components'
import { AddLiquidityButton } from './components/AddLiquidityButton'
import { PositionPage } from './PositionPage'

const StyledTab = styled(Tab)`
  padding: 0;
  & > a {
    padding: 8px;
  }
`

const ButtonContainer = styled.div`
  @media (max-width: 967px) {
    min-width: 200px;
    button {
      width: 100%;
      height: 50px;
    }
  }
`

const PAGES_LINK = {
  POOLS: '/liquidity/pools',
  POSITIONS: '/liquidity/positions',
  HISTORY: '/farms/history',
}

const usePageInfo = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const PAGES_MAP = useMemo(
    () => ({
      [PAGES_LINK.POSITIONS]: {
        tabIdx: 0,
        oldLink: '/liquidity',
        oldLinkText: t('Legacy Liquidity Page'),
      },
    }),
    [t],
  )
  return useMemo(() => PAGES_MAP[router.pathname] ?? {}, [PAGES_MAP, router.pathname])
}

const LegacyPage = () => {
  const { t } = useTranslation()
  const { oldLink, oldLinkText } = usePageInfo()

  if (!oldLink || !oldLinkText) {
    return null
  }
  return (
    <NextLinkFromReactRouter to={oldLink} prefetch={false}>
      <Button p="0" variant="text">
        <Text color="primary" bold fontSize="16px" mr="4px">
          {t(oldLinkText)}
        </Text>
      </Button>
    </NextLinkFromReactRouter>
  )
}

export const UniversalFarms: React.FC<PropsWithChildren> = () => {
  const { t } = useTranslation()
  const { tabIdx } = usePageInfo()
  const { isMobile, isMd } = useMatchBreakpoints()

  const tabsConfig = useMemo(() => {
    return {
      0: {
        menu: () => (
          <StyledTab key="positions">
            <NextLinkFromReactRouter to={PAGES_LINK.POSITIONS}>{t('My Positions')}</NextLinkFromReactRouter>
          </StyledTab>
        ),
        page: () => <PositionPage />,
      },
    }
  }, [t])

  return (
    <>
      <PoolsBanner additionLink={<LegacyPage />} />
      <Page style={isMobile ? { padding: '0 16px 16px 16px' } : undefined}>
        <FlexGap width="100%" alignItems="flex-end" justifyContent="space-between">
          <TabMenu gap="8px" activeIndex={tabIdx} isShowBorderBottom={false}>
            {Object.values(tabsConfig).map(({ menu }) => menu())}
          </TabMenu>
          {!isMobile && !isMd && (
            <ButtonContainer>
              <AddLiquidityButton scale="md" mb="12px" />
            </ButtonContainer>
          )}
        </FlexGap>
        {tabsConfig[tabIdx].page()}
      </Page>
    </>
  )
}
