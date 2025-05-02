import React from "react";
import { SvgProps } from "../types";

const Logo: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <>
      <img src="/logo.png" alt="9MM Exchange" width="62px" />
    </>
  );
};

export default Logo;
