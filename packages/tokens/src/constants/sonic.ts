import { ChainId } from '@pancakeswap/chains'
import { ERC20Token, WETH9 } from '@pancakeswap/sdk'

export const sonicTokens = {
  weth: WETH9[ChainId.SONIC],
  sonic: new ERC20Token(ChainId.SONIC, '0x039e2fB66102314Ce7b64Ce5Ce3E5183bc94aD38', 18, 'WS', 'Wrapped Sonic', ''),
  usdt: new ERC20Token(
    ChainId.SONIC,
    '0x6047828dc181963ba44974801FF68e538dA5eaF9',
    6,
    'USDT',
    'USDT from Ethereum',
    '',
  ),
  nineMM: new ERC20Token(ChainId.SONIC, '0xC5cB0B67D24d72b9D86059344c88Fb3cE93BF37C', 18, '9MM', '9MM', ''),
  pussy: new ERC20Token(ChainId.SONIC, '0x195f4682237D52292a293f2D33E94d911Bc1F85E', 18, 'PUSSY', 'PUSSY (HOAX)', ''),
  usdc: new ERC20Token(
    ChainId.SONIC,
    '0x29219dd400f2Bf60E5a23d13Be72B486D4038894',
    18,
    'USDC.e',
    'Usdc from Ethereum',
    '',
  ),
}
