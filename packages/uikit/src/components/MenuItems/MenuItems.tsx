/* eslint-disable @typescript-eslint/no-explicit-any */
import { createElement, memo } from "react";
import { findMenuItemsStatusColor } from "../../util/findMenuItemsStatusColor";
import isTouchDevice from "../../util/isTouchDevice";
import { Flex } from "../Box";
import DropdownMenu from "../DropdownMenu/DropdownMenu";
import MenuItem from "../MenuItem/MenuItem";
import { MenuItemsProps, MenuItemsType } from "./types";

const MenuItems: React.FC<React.PropsWithChildren<MenuItemsProps>> = ({
  items = [] as MenuItemsType[],
  activeItem,
  activeSubItem,
  activeSubItemChildItem,
  ...props
}) => {
  return (
    <Flex {...props}>
      {items.map(({ label, items: menuItems = [], href, icon, disabled, onClick }) => {
        const statusColor = findMenuItemsStatusColor(menuItems);
        const isActive = activeItem === href;
        const linkProps = isTouchDevice() && menuItems && menuItems.length > 0 ? {} : { href };
        const Icon = icon;
        return (
          <DropdownMenu
            key={`${label}#${href}`}
            items={menuItems}
            py={1}
            activeItem={activeSubItem}
            activeSubItemChildItem={activeSubItemChildItem}
            isDisabled={disabled}
          >
            {label === "9x" || label === "Docs" ? (
              <MenuItem
                {...{ target: "_blank", ...linkProps }}
                isActive={isActive}
                statusColor={statusColor}
                isDisabled={disabled}
              >
                {label} 1{icon && createElement(Icon as any, { color: isActive ? "secondary" : "textSubtle" })}
              </MenuItem>
            ) : (
              <MenuItem {...linkProps} isActive={isActive} statusColor={statusColor} isDisabled={disabled}>
                2 {label || (icon && createElement(Icon as any, { color: isActive ? "secondary" : "textSubtle" }))}
              </MenuItem>
            )}
          </DropdownMenu>
        );
      })}
    </Flex>
  );
};

export default memo(MenuItems);
