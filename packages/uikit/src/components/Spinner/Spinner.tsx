import React from "react";
import { Image } from "../Image";
import { SpinnerProps } from "./types";

const Spinner: React.FC<React.PropsWithChildren<SpinnerProps>> = ({ size = 128 }) => {
  return (
    <div
      style={{
        width: size,
        height: size * 1.197,
        position: "relative",
      }}
    >
      <style>{`
        @keyframes zoomInOut {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      `}</style>
      <Image
        src="/loading.png"
        alt="9mm-3d-spinner"
        width={500}
        height={500}
        style={{
          animation: "zoomInOut 1.5s ease-in-out infinite",
          transformOrigin: "center center",
        }}
      />
    </div>
  );
};

export default Spinner;
