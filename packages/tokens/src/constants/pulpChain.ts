import { ChainId } from '@pancakeswap/chains'
import { ERC20Token, WETH9 } from '@pancakeswap/sdk'

export const pulpTokens = {
  weth: WETH9[ChainId.PULPCHAIN],

  pls: new ERC20Token(ChainId.PULPCHAIN, '0xed22410bF8e1F0Fc7b556d556C9428f359FC37Af', 18, 'WTPLS', 'Test Pulse'),

  dai: new ERC20Token(ChainId.PULPCHAIN, '0xB3112fdA56C1109029D2151a847566c2d814199C', 18, 'DAI', 'DAI from Ethereum'),

  usdt: new ERC20Token(
    ChainId.PULPCHAIN,
    '0x6B2A32f4B3ed3d86ba64b594ADb906d296c5774E',
    18,
    'USDT',
    'USDT from Ethereum',
  ),

  nineMM: new ERC20Token(ChainId.PULPCHAIN, '0xF856b792526FB3192992ff916d97Ef38E1b5F74b', 18, '9mm', '9mm', ''),

  pussy: new ERC20Token(ChainId.PULPCHAIN, '0x4CB4eDdE04772332a42ECb039f3790e17733B4B8', 18, 'PUSSY', 'PUSSY (HOAX)'),

  dwb: new ERC20Token(ChainId.PULPCHAIN, '0xAEbcD0F8f69ECF9587e292bdfc4d731c1abedB68', 18, 'DWB', 'dickwifbutt'),

  hex: new ERC20Token(ChainId.PULPCHAIN, '0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39', 18, 'HEX', 'HEX'),

  usdc: new ERC20Token(
    ChainId.PULPCHAIN,
    '0x36653868210124Af5db4A777BB717f91C095C994',
    18,
    'USDC',
    'USDC from Ethereum',
  ),
}
