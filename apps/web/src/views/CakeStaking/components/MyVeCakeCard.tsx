import { useTranslation } from '@pancakeswap/localization'
import { AutoColumn, AutoRow, Box, Flex, Text } from '@pancakeswap/uikit'
import { formatNumber, getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useVeCakeBalance } from 'hooks/useTokenBalance'
import styled from 'styled-components'

export const StyledBox = styled(Box)`
  border-radius: 16px;
  background: linear-gradient(229deg, #22c55e -13.69%, #22c55e 91.33%);
  padding-top: 16px;
  padding-bottom: 16px;
  display: flex;
  flex-direction: row;
`

export const MyVeCakeCardMobile: React.FC<{
  value?: string
}> = ({ value }) => {
  const { t } = useTranslation()
  const { balance } = useVeCakeBalance()

  return (
    <AutoRow justifyContent="space-between" alignItems="center" mb="8px">
      <Flex alignItems="center">
        <img src="/images/cake-staking/token-vecake.png" alt="token-vecake" width="32px" />

        <Text fontSize="14px" ml="4px">
          {t('You will get')}
        </Text>
      </Flex>

      <Text fontSize="16px" bold>
        {value ?? formatNumber(getBalanceNumber(balance))} veCAKE
      </Text>
    </AutoRow>
  )
}

export const MyVeCakeCard: React.FC<{
  type?: 'row' | 'column'
  value?: string
}> = ({ type = 'column', value }) => {
  const { t } = useTranslation()
  const { balance } = useVeCakeBalance()

  return (
    <StyledBox px={type === 'row' ? '16px' : '24px'}>
      <img src="/images/cake-staking/token-vecake.png" alt="token-vecake" width="58px" />
      {type === 'column' ? (
        <AutoColumn gap="2px" ml="6px">
          <Text fontSize="12px" bold color="white" lineHeight="120%">
            {t('MY veCAKE')}
          </Text>
          <Text fontSize="24px" bold color="white" lineHeight="110%">
            {value ?? formatNumber(getBalanceNumber(balance))}
          </Text>
        </AutoColumn>
      ) : null}
      {type === 'row' ? (
        <AutoRow justifyContent="space-between" ml="8px">
          <Text fontSize="20px" bold color="white" lineHeight="120%">
            {t('MY veCAKE')}
          </Text>

          <Text fontSize="20px" bold color="white" lineHeight="110%">
            {value ?? formatNumber(getBalanceNumber(balance))}
          </Text>
        </AutoRow>
      ) : null}
    </StyledBox>
  )
}
