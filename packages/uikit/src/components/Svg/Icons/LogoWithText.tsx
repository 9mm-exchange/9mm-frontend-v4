import React from "react";
import { SvgProps } from "../types";

const Logo: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <>
      <img src="/logo.png?hash=178d" alt="9MM Exchange" width="62px" />
    </>
  );
};

export default Logo;
