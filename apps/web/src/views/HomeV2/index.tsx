import { Box, domAnimation, LazyAnimatePresence, MotionBox, Skeleton, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useAtomValue } from 'jotai'
import { Suspense } from 'react'
import styled from 'styled-components'
import SimpleSwapForHomePage from 'views/SwapSimplify/SimpleSwapForHomePage'
import { homePageDataAtom } from './atom/homePageDataAtom'
import { RowLayout } from './component/RowLayout'
import { ScrollableFullScreen } from './component/ScrollableFullScreen'
import { FavoriteDEXBanner } from './FavoriteDEXBanner'

const MobileContainer = styled(Box)`
  scroll-snap-align: start;
`

// Helper functions for tablet layout
const getSidePadding = (isMobile: boolean, isTablet: boolean) => {
  if (isMobile) return '16px'
  if (isTablet) return '20px'
  return '24px'
}

const getMarginTopForBanner = (isMobile: boolean, isTablet: boolean) => {
  if (isMobile) return `40px`
  if (isTablet) return `160px`
  return `200px`
}

const getMarginTop = (isMobile: boolean, isTablet: boolean, base: number) => {
  if (isMobile) return base
  if (isTablet) return base * 1.2
  return base * 1.5
}

const BgBox = styled(Box)`
  background: ${({ theme }) => theme.colors.gradientBubblegum};
`

const StyledSkeleton = styled(Skeleton)`
  background: ${({ theme }) => theme.colors.gradientBubblegum};
  opacity: 0.01;
`
export const HomeV2 = () => {
  return (
    <Suspense
      fallback={
        <BgBox
          style={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <StyledSkeleton animation="waves" width="80%" height="50vh" variant="round" borderRadius="0" />
        </BgBox>
      }
    >
      <BgBox>
        <HomeV2Inner />
      </BgBox>
    </Suspense>
  )
}
const HomeV2Inner = () => {
  const { tokens, chains } = useAtomValue(homePageDataAtom)

  const { isMobile, isTablet } = useMatchBreakpoints()
  const Container = isTablet || isMobile ? MobileContainer : ScrollableFullScreen

  return (
    <>
      <Container>
        <RowLayout sidePadding="0">
          <LazyAnimatePresence features={domAnimation}>
            <FavoriteDEXBanner chains={chains} />
            <MotionBox
              style={{
                willChange: 'transform, opacity',
                flexShrink: 0,
                flex: 1,
                width: '100%',
              }}
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 30 }}
              transition={{ type: 'spring', stiffness: 60, damping: 20 }}
            >
              <SimpleSwapForHomePage />
            </MotionBox>
          </LazyAnimatePresence>
        </RowLayout>
      </Container>
    </>
  )
}
