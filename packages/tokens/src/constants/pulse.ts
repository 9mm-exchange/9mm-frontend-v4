import { ChainId } from '@pancakeswap/chains'
import { ERC20Token, WETH9 } from '@pancakeswap/sdk'

export const pulseTokens = {
  weth: WETH9[ChainId.PULSECHAIN],

  pls: new ERC20Token(ChainId.PULSECHAIN, '0xA1077a294dDE1B09bB078844df40758a5D0f9a27', 18, 'PLS', 'Pulse'),

  dai: new ERC20Token(ChainId.PULSECHAIN, '0xefD766cCb38EaF1dfd701853BFCe31359239F305', 18, 'DAI', 'DAI from Ethereum'),

  usdt: new ERC20Token(
    ChainId.PULSECHAIN,
    '0x0Cb6F5a34ad42ec934882A05265A7d5F59b51A2f',
    6,
    'USDT',
    'USDT from Ethereum',
  ),

  ninemm: new ERC20Token(ChainId.PULSECHAIN, '0x7b39712Ef45F7dcED2bBDF11F3D5046bA61dA719', 18, '9MM', '9MM'),

  pussy: new ERC20Token(ChainId.PULSECHAIN, '0x4CB4eDdE04772332a42ECb039f3790e17733B4B8', 18, 'PUSSY', 'PUSSY (HOAX)'),

  dwb: new ERC20Token(ChainId.PULSECHAIN, '0xAEbcD0F8f69ECF9587e292bdfc4d731c1abedB68', 18, 'DWB', 'dickwifbutt'),

  hex: new ERC20Token(ChainId.PULSECHAIN, '0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39', 18, 'HEX', 'HEX'),

  usdc: new ERC20Token(
    ChainId.PULSECHAIN,
    '0x15D38573d2feeb82e7ad5187aB8c1D52810B1f07',
    18,
    'USDC',
    'USDC from Ethereum',
  ),
}
