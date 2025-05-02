import { Link } from '@pancakeswap/uikit'
import { FaqConfig } from 'components/PinnedFAQButton'
import Trans from 'components/Trans'
import { styled } from 'styled-components'

const InlineLink = styled(Link)`
  display: inline;
`

const faqConfig: FaqConfig[] = [
  {
    title: <Trans>What are Syrup Pools?</Trans>,
    description: [
      <Trans key="syrup-pools-desc">
        Syrup Pools let you stake CAKE to earn rewards. By depositing CAKE into a Syrup Pool, you can receive tokens
        from partner projects, depending on the pool.
      </Trans>,
    ],
  },
  {
    title: <Trans>How do I stake CAKE in Syrup Pools?</Trans>,
    description: [
      <>
        <Trans>Go to the</Trans> <strong>Syrup Pools</strong>{' '}
        <Trans>
          section on PancakeSwap, choose a pool, and deposit CAKE. Your rewards will start accumulating automatically.
          You can unstake your CAKE anytime.
        </Trans>
      </>,
    ],
  },
  {
    title: <Trans>What rewards can I earn from Syrup Pools?</Trans>,
    description: [
      <ul key="rewards-list">
        <li>
          <strong>Partner Token Pools</strong>:{' '}
          <Trans>Earn tokens from partner projects by staking CAKE (e.g., Stake CAKE to earn PEPE)</Trans>
        </li>
        <li>
          <Trans>
            Rewards must be claimed manually by clicking the &quot;Harvest&quot; button under &quot;Details&quot; for
            each pool.
          </Trans>
        </li>
      </ul>,
    ],
  },
  {
    title: <Trans>Are there any fees for staking or unstaking?</Trans>,
    description: [
      <>
        <Trans key="fees-description-part1">There are</Trans>{' '}
        <strong>
          <Trans>no platform fees</Trans>
        </strong>{' '}
        <Trans key="fees-description-part2">for staking or unstaking in Syrup Pools. However,</Trans>{' '}
        <strong>
          <Trans>standard blockchain gas fees</Trans>
        </strong>{' '}
        <Trans key="fees-description-part3">
          will still apply when making transactions, such as depositing, harvesting rewards, or unstaking CAKE.
        </Trans>
      </>,
    ],
  },
  {
    title: <Trans>What happens if I don&apos;t claim my rewards?</Trans>,
    description: [
      <>
        <Trans key="unclaimed-rewards-part1">
          Your rewards will continue to accumulate while your CAKE remains staked. You can claim them at any time by
          clicking the
        </Trans>
        {' "'}
        <strong>
          <Trans>Harvest</Trans>
        </strong>
        {'" '}
        <Trans key="unclaimed-rewards-part2">button.</Trans>
      </>,
    ],
  },
  {
    title: <Trans>I still have CAKE staked in the old Auto or Manual CAKE Pools. What should I do?</Trans>,
    description: [
      <>
        <Trans key="legacy-pools-part1">The</Trans>{' '}
        <strong>
          <Trans>Auto CAKE and Manual CAKE Pools</Trans>
        </strong>{' '}
        <Trans key="legacy-pools-part2">have been upgraded to</Trans>{' '}
        <strong>
          <Trans>veCAKE</Trans>
        </strong>{' '}
        <Trans key="legacy-pools-part3">
          staking. If you still have CAKE staked in the legacy pools, you&apos;ll need to
        </Trans>{' '}
        <strong>
          <Trans>migrate to veCAKE</Trans>
        </strong>{' '}
        <Trans key="legacy-pools-part4">to continue earning rewards.</Trans>{' '}
        <InlineLink
          target="_blank"
          rel="noreferrer"
          href="https://9mm-pro.gitbook.io/9mm-pro/products/vecake/migrate-from-cake-pool"
        >
          <Trans>Learn how to migrate here</Trans>
        </InlineLink>
      </>,
    ],
  },
]

export default faqConfig
