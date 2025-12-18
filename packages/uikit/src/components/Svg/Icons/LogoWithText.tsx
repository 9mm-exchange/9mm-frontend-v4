import React from "react";
import { useTheme } from "styled-components";
import { SvgProps } from "../types";

const Logo: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  const theme = useTheme();

  const logoSrc = theme.isDark ? "/logo.png" : "/logo-light.png";

  return (
    <>
      <img src={logoSrc} alt="9MM Exchange" width="62px" />
    </>
  );
};

export default Logo;
