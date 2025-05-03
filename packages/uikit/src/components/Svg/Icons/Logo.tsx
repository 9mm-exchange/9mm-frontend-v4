import React from "react";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return <img src="/logo.png?hash=178d" alt="9MM Exchange" width="32px" />;
};

export default Icon;
