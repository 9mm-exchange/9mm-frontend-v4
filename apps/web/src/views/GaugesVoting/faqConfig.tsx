import { Link } from '@pancakeswap/uikit'
import { FaqConfig } from 'components/PinnedFAQButton'
import Trans from 'components/Trans'
import { styled } from 'styled-components'

const InlineLink = styled(Link)`
  display: inline;
`

const faqConfig: FaqConfig[] = [
  {
    title: <Trans>What is Gauges Voting?</Trans>,
    description: [
      <Trans key="gauges-voting-desc">
        Gauges voting allows veCAKE holders to vote on the distribution of CAKE emissions among liquidity pools, with
        pools receiving more votes distributing a larger share of CAKE emissions.
      </Trans>,
    ],
  },
  {
    title: <Trans>What is veCAKE?</Trans>,
    description: [
      <>
        <Trans key="vecake-desc">
          veCAKE, obtained by staking CAKE, is key to PancakeSwap&apos;s governance, allowing you to vote on governance
          proposals and the allocation of CAKE emissions in liquidity pools.
        </Trans>
        <InlineLink ml="4px" external href="https://9mm-pro.gitbook.io/9mm-pro/products/vecake/what-is-vecake">
          <Trans>Learn more here</Trans>
        </InlineLink>
      </>,
    ],
  },
  {
    title: <Trans>How does gauges voting benefit me?</Trans>,
    description: [
      <Trans key="gauges-benefits">By voting with veCAKE, you can:</Trans>,
      <ul>
        <li>
          <Trans>Direct CAKE emissions to your preferred liquidity pools</Trans>
        </li>
        <li>
          <>
            <Trans>Earn voting incentives (</Trans>
            <InlineLink external href="https://9mm-pro.gitbook.io/9mm-pro/products/vecake/bribes-vote-incentives">
              <Trans>BRIBES</Trans>
            </InlineLink>
            <Trans>) from external bribing markets</Trans>
          </>
        </li>
      </ul>,
    ],
  },
  {
    title: <Trans>How do I participate in gauge voting?</Trans>,
    description: [
      <ul key="participate-steps">
        <li>
          <Trans>Lock CAKE to receive veCAKE.</Trans>
        </li>
        <li>
          <Trans>Use veCAKE to vote for your preferred liquidity pools.</Trans>
        </li>
        <li>
          <Trans>
            Gauges Voting results are concluded every 2 weeks, with each voting cycle determining emissions for the next
            - Once you vote in the first cycle, your votes will carry over to the next cycle.
          </Trans>
        </li>
        <li>
          <Trans>You can change your votes once every 10 days.</Trans>
        </li>
      </ul>,
    ],
  },
  {
    title: <Trans>What is a boosted gauge?</Trans>,
    description: [
      <>
        <Trans key="boosted-gauge-desc">
          Boosted gauges feature vote count multipliers from 1x to 2x to encourage votes and liquidity for important
          trading pairs.
        </Trans>
      </>,
    ],
  },
]

export default faqConfig
