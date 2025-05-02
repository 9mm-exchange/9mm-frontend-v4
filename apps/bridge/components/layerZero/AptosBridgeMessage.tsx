import { Box, Flex, Link, Message, MessageText, WarningIcon } from '@pancakeswap/uikit'
import { styled } from 'styled-components'

const InlineLink = styled(Link)`
  display: inline-block;
  margin: 0 4px;
`

const AptosBridgeMessage = () => {
  return (
    <Box width={['100%', null, '420px']} padding={['24px 24px 0 24px', '24px 24px 0 24px', '0']}>
      <Message
        mt={['24px', '24px', '24px', '0']}
        mb={['0', '0', '24px']}
        variant="warning"
        icon={<WarningIcon color="#D67E0A" style={{ minWidth: '24px' }} />}
      >
        <Flex flexDirection="column">
          <MessageText>
            Outbound transfers are subject to 500.000 block confirmations, estimated to last ~2 days.
          </MessageText>
          <MessageText mb="5px">
            Learn more in the
            <InlineLink ml="4px" external href="https://9mm-pro.gitbook.io/9mm-pro/products/cake-bridging/faq">
              FAQ.
            </InlineLink>
          </MessageText>
        </Flex>
      </Message>
    </Box>
  )
}

export default AptosBridgeMessage
