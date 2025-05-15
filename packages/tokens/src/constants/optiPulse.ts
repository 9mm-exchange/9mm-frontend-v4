import { ChainId } from '@pancakeswap/chains'
import { ERC20Token, WETH9 } from '@pancakeswap/sdk'

export const optiTokens = {
  weth: WETH9[ChainId.OPTIPULSE],

  pls: new ERC20Token(ChainId.OPTIPULSE, '0xed22410bF8e1F0Fc7b556d556C9428f359FC37Af', 18, 'PLS', 'Pulse'),

  dai: new ERC20Token(ChainId.OPTIPULSE, '0xefD766cCb38EaF1dfd701853BFCe31359239F305', 18, 'DAI', 'DAI from Ethereum'),

  usdt: new ERC20Token(
    ChainId.OPTIPULSE,
    '0x0Cb6F5a34ad42ec934882A05265A7d5F59b51A2f',
    6,
    'USDT',
    'USDT from Ethereum',
  ),

  ninemm: new ERC20Token(ChainId.OPTIPULSE, '0xB3112fdA56C1109029D2151a847566c2d814199C', 18, 'TST', 'Test', ''),

  pussy: new ERC20Token(ChainId.OPTIPULSE, '0x4CB4eDdE04772332a42ECb039f3790e17733B4B8', 18, 'PUSSY', 'PUSSY (HOAX)'),

  dwb: new ERC20Token(ChainId.OPTIPULSE, '0xAEbcD0F8f69ECF9587e292bdfc4d731c1abedB68', 18, 'DWB', 'dickwifbutt'),

  hex: new ERC20Token(ChainId.OPTIPULSE, '0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39', 18, 'HEX', 'HEX'),

  usdc: new ERC20Token(
    ChainId.OPTIPULSE,
    '0x15D38573d2feeb82e7ad5187aB8c1D52810B1f07',
    18,
    'USDC',
    'USDC from Ethereum',
  ),
}
