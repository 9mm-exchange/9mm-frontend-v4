import React from "react";
import { Box } from "../Box";
import { Image } from "../Image";
import { SpinnerProps } from "./types";

const Spinner: React.FC<React.PropsWithChildren<SpinnerProps>> = ({ size = 128 }) => {
  return (
    <Box width={size} height={size * 1.197} position="relative">
      <Image width={size} height={size * 1.197} src="/images/loader.png" alt="9mm-3d-spinner" />
    </Box>
  );
};

export default Spinner;
