import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, Card, Flex, Grid, Tab, TabMenu, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import Divider from 'components/Divider'
import PinnedFAQButton from 'components/PinnedFAQButton'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useCakeLockStatus } from 'views/CakeStaking/hooks/useVeCakeUserInfo'
import faqConfig from '../faqConfig'
import { useGauges } from '../hooks/useGauges'
import { useGaugesQueryFilter } from '../hooks/useGaugesFilter'
import { useGaugesTotalWeight } from '../hooks/useGaugesTotalWeight'
import { useUserVoteGauges } from '../hooks/useUserVoteGauges'
import { CurrentEpoch } from './CurrentEpoch'
import { FilterFieldByTypeMobile, FilterFieldInput, FilterFieldSort } from './GaugesFilter'
import { GaugesList, VoteTable } from './Table'
import { WeightsPieChart } from './WeightsPieChart'

export const StyledGaugesVotingPage = styled.div`
  background: transparent;

  ${({ theme }) => theme.mediaQueries.lg} {
    background: ${({ theme }) => theme.colors.gradientBubblegum};
  }
`

const GaugesVotingMobileView = () => {
  const { t } = useTranslation()
  const totalGaugesWeight = useGaugesTotalWeight()
  const { isDesktop, isMobile } = useMatchBreakpoints()
  const { data: gauges, isLoading } = useGauges()
  const { filterGauges, setSearchText, searchText, filter, setFilter, sort, setSort } = useGaugesQueryFilter(gauges)
  const [activeTab, setActiveTab] = useState(0)
  const { cakeLockedAmount } = useCakeLockStatus()
  const { data: userVotedGauges } = useUserVoteGauges()

  useEffect(() => {
    // If user has stake (veCake) or votes, default to "My veCake/Votes" tab
    if (cakeLockedAmount > 0n || (userVotedGauges && userVotedGauges.length > 0)) {
      setActiveTab(1)
    }
  }, [cakeLockedAmount, userVotedGauges])

  return (
    <StyledGaugesVotingPage>
      <Flex alignItems="baseline" width="100%" justifyContent="space-between" px="16px" py="16px">
        <Text lineHeight="110%" bold color="secondary" fontSize="32px">
          {t('Gauges Voting')}
        </Text>
        <PinnedFAQButton docLink=" https://9mm-pro.gitbook.io/9mm-pro/products/vecake" faqConfig={faqConfig} />
      </Flex>

      <Box px="40px">
        <TabMenu activeIndex={activeTab} onItemClick={setActiveTab} fullWidth={isMobile} isShowBorderBottom={false}>
          <Tab>
            {t('Gauges')} ({gauges?.length || 0})
          </Tab>
          <Tab>{t('My veCAKE/Votes')}</Tab>
        </TabMenu>
      </Box>

      <Box pl="16px" pr="16px" mt="0px" pb="32px">
        {activeTab === 0 ? (
          <>
            <Card
              style={{ overflow: 'initial' }}
              innerCardProps={{
                pb: '64px',
              }}
            >
              <Grid gridTemplateColumns={isDesktop ? '2.2fr 3fr' : '1fr'}>
                <CurrentEpoch />

                <Divider />

                <Box ml="0" mt={0} padding="8px 24px 8px 24px">
                  <Text color="secondary" textTransform="uppercase" bold>
                    {t('proposed weights')}
                  </Text>
                  <Box mt="0" mb={0}>
                    <WeightsPieChart
                      data={filterGauges}
                      totalGaugesWeight={Number(totalGaugesWeight)}
                      isLoading={isLoading}
                    />
                  </Box>
                </Box>
              </Grid>

              <Divider />

              <Text px={16} bold fontSize="24px">
                {t('Gauges')} ({filterGauges?.length || 0})
              </Text>

              <Grid
                backgroundColor="backgroundAlt"
                p={16}
                gridTemplateColumns="1fr"
                gridGap="1em"
                position="sticky"
                top="0"
                zIndex="100"
                borderBottom="1px solid"
                borderColor="cardBorder"
              >
                <Grid gridTemplateColumns="2fr 1fr" gridGap="8px">
                  <FilterFieldByTypeMobile onFilterChange={setFilter} value={filter} />
                  <FilterFieldSort onChange={setSort} />
                </Grid>

                <FilterFieldInput placeholder={t('Search')} initialValue={searchText} onChange={setSearchText} />
              </Grid>

              <GaugesList
                key={sort}
                data={filterGauges}
                isLoading={isLoading}
                totalGaugesWeight={Number(totalGaugesWeight)}
              />
            </Card>
            <Box width="100%" px="32px" position="absolute" bottom="64px" left="0" right="0">
              <Button
                width="100%"
                onClick={() => {
                  setActiveTab(1)
                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                  })
                }}
              >
                {t('Vote now')}
              </Button>
            </Box>
          </>
        ) : (
          <VoteTable />
        )}
      </Box>
    </StyledGaugesVotingPage>
  )
}

export default GaugesVotingMobileView
