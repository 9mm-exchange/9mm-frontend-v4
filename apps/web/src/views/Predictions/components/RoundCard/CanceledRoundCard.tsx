import { useTranslation } from '@pancakeswap/localization'
import { BetPosition } from '@pancakeswap/prediction'
import { BlockIcon, Card, CardBody, Flex, LinkExternal, Text } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import { NodeRound } from 'state/types'
import useIsRefundable from '../../hooks/useIsRefundable'
import ReclaimPositionButton from '../ReclaimPositionButton'
import { RoundResultBox } from '../RoundResult'
import CardHeader, { getBorderBackground } from './CardHeader'
import MultiplierArrow from './MultiplierArrow'

interface CanceledRoundCardProps {
  round: NodeRound
}

const CanceledRoundCard: React.FC<React.PropsWithChildren<CanceledRoundCardProps>> = ({ round }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { isRefundable, setIsRefundable } = useIsRefundable(round.epoch)
  const { epoch } = round

  const handleSuccess = async () => {
    setIsRefundable(false)
  }

  return (
    <Card borderBackground={getBorderBackground(theme, 'canceled')}>
      <CardHeader
        status="canceled"
        icon={<BlockIcon mr="4px" width="21px" />}
        title={t('Cancelled')}
        epoch={round.epoch}
      />
      <CardBody p="16px">
        <MultiplierArrow isDisabled />
        <RoundResultBox>
          <Flex flexDirection="column" alignItems="center">
            <Text bold color={isRefundable ? 'text' : 'textDisabled'}>
              {t('Round Cancelled')}
            </Text>
            {isRefundable && <ReclaimPositionButton epoch={epoch} onSuccess={handleSuccess} width="100%" my="8px" />}
            <LinkExternal href="https://9mm-pro.gitbook.io/9mm-pro/products/prediction" external>
              {t('Learn More')}
            </LinkExternal>
          </Flex>
        </RoundResultBox>
        <MultiplierArrow betPosition={BetPosition.BEAR} isDisabled />
      </CardBody>
    </Card>
  )
}

export default CanceledRoundCard
