import { ContextApi } from '@pancakeswap/localization'
import { SUPPORTED_CHAIN_IDS as POOL_SUPPORTED_CHAINS } from '@pancakeswap/pools'
import {
  BridgeIcon,
  DropdownMenuItems,
  DropdownMenuItemType,
  EarnFillIcon,
  EarnIcon,
  LineGraphIcon,
  LinkExternal,
  MenuItemsType,
  SwapFillIcon,
  SwapIcon,
} from '@pancakeswap/uikit'
import { SUPPORT_FARMS } from 'config/constants/supportChains'

export type ConfigMenuDropDownItemsType = DropdownMenuItems & {
  hideSubNav?: boolean
  overrideSubNavItems?: DropdownMenuItems['items']
  matchHrefs?: string[]
}
export type ConfigMenuItemsType = Omit<MenuItemsType, 'items'> & {
  hideSubNav?: boolean
  image?: string
  items?: ConfigMenuDropDownItemsType[]
  overrideSubNavItems?: ConfigMenuDropDownItemsType[]
}

export const addMenuItemSupported = (item, chainId) => {
  if (!chainId || !item.supportChainIds) {
    return item
  }
  if (item.supportChainIds?.includes(chainId)) {
    return item
  }
  return {
    ...item,
    disabled: true,
  }
}

const config: (
  t: ContextApi['t'],
  isDark: boolean,
  languageCode?: string,
  chainId?: number,
) => ConfigMenuItemsType[] = (t, isDark, languageCode, chainId) =>
  [
    {
      label: t('Trade'),
      icon: SwapIcon,
      fillIcon: SwapFillIcon,
      href: '/swap',
      hideSubNav: true,
      items: [
        {
          label: t('Swap'),
          href: '/swap',
        },
        {
          label: t('Buy Crypto'),
          href: '/buy-crypto',
        },
      ].map((item) => addMenuItemSupported(item, chainId)),
    },
    {
      label: t('Earn'),
      href: '/liquidity/pools',
      icon: EarnIcon,
      fillIcon: EarnFillIcon,
      image: '/images/decorations/pe2.png',
      supportChainIds: SUPPORT_FARMS,
      overrideSubNavItems: [
        {
          label: t('Liquidity Manager'),
          href: '/liquidity/pools',
          supportChainIds: SUPPORT_FARMS,
        },
        {
          label: t('Syrup Pools'),
          href: '/pools',
          supportChainIds: POOL_SUPPORTED_CHAINS,
        },
      ].map((item) => addMenuItemSupported(item, chainId)),
      items: [
        {
          label: t('Manage Liquidity'),
          href: '/liquidity/pools',
          matchHrefs: ['/liquidity/positions', '/farms'],
          supportChainIds: SUPPORT_FARMS,
        },
        {
          label: t('Syrup Pools'),
          href: '/pools',
          matchHrefs: ['/pools'],
          supportChainIds: POOL_SUPPORTED_CHAINS,
        },
      ].map((item) => addMenuItemSupported(item, chainId)),
    },
    {
      label: t('Bridge'),
      href: '/bridge',
      icon: BridgeIcon,
      type: DropdownMenuItemType.EXTERNAL_LINK,
      image: '/images/decorations/pe2.png',
    },
    {
      label: t('Stats & Graphs'),
      href: '/info/v3',
      icon: LineGraphIcon,
      fillIcon: LineGraphIcon,
    },
    {
      label: t('9x'),
      href: 'https://9x.9mm.pro',
      icon: LinkExternal,
      fillIcon: LinkExternal,
    },
    {
      label: t('Docs'),
      href: 'https://9mm-pro.gitbook.io/9mm-pro/',
      icon: LinkExternal,
      fillIcon: LinkExternal,
    },
  ].map((item) => addMenuItemSupported(item, chainId))

export default config
