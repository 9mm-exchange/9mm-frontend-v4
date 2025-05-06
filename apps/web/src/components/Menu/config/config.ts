import { ContextApi } from '@pancakeswap/localization'
import {
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
      type: DropdownMenuItemType.EXTERNAL_LINK,
      showItemsOnMobile: false,
    },
    {
      label: t('Liquidity'),
      href: '/liquidity',
      icon: EarnIcon,
      fillIcon: EarnFillIcon,
      showItemsOnMobile: false,
    },
    {
      label: t('Stats & Graphs'),
      href: '/info/v3',
      icon: LineGraphIcon,
      fillIcon: LineGraphIcon,
      type: DropdownMenuItemType.EXTERNAL_LINK,
      showItemsOnMobile: false,
    },
    {
      label: t('9x'),
      href: 'https://9x.9mm.pro',
      icon: LinkExternal,
      fillIcon: LinkExternal,
      type: DropdownMenuItemType.EXTERNAL_LINK,
      showItemsOnMobile: false,
    },
    {
      label: t('Docs'),
      href: 'https://9mm-pro.gitbook.io/9mm-pro/',
      icon: LinkExternal,
      fillIcon: LinkExternal,
      type: DropdownMenuItemType.EXTERNAL_LINK,
      showItemsOnMobile: false,
    },
  ].map((item) => addMenuItemSupported(item, chainId))

export default config
