import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg viewBox="0 0 96 96" {...props}>
      <circle cx={48} cy={48} r={48} fill="#000000" />
      <image
        height={74}
        width={74}
        x={11}
        y={11}
        href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAY1BMVEVHcEz///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////80LMUcAAAAIHRSTlMA9Tr6BhLj2AttquwBzsUitxlVRCoymE5foXmPhGZyvFL/uFoAAAMuSURBVEjHjVaJloMgDBRBQFCxeOHN/3/lRhG09tq8t1urJMxMJtIoehs8HtelzqL/BqnTVVqLad89/pXw0EKinGKK4R8bK/5jfVK1DNO2imnZyb6eS4mKoSEf1/NmypEURkVRi6r9jzRDgWQ5q7e0FBBAxVJvJSvUZlFNV75vPLKNVvKSUTOcT7EDzktaw8eAZ0+vp7i9wyM9MqGOwcNOLGfKP1Y96m4pOxSvWZ47cTWeTtyseIaWrDsUFxPWhx5CNuFuitOnlBkv4bqhwsOOZbiMkiLAvO8KrLrEx5VBh8aL1AHKzgqzENRea8n4hCIFP1lJcUZfXhg0J0wiLukbqyxzCODjicEJ5gryYJWpqnLWujzMHp7ym0KPkWIsRX1n4IVNX+Amwu6RqxvRw0mKXkRxrAwsRzBkdnyVE2Bm44v0WW+t1E0B22zFHiwPw0laWUGD+3uDSWltQaLRWqouLnWGpwVYz4Tvy8GqhV1MnFvLtvIZvxiQlAjYTS+20Ri4IOBSkrvNkzwHpOL4erLih2I29Qxgpg9gsoed8sTbNrB6TDm1By7HoOReMigzSuVL68sAAR8/x9vQ2YNxuu03H5tqZM+ewV1re37qgg6h203ECs3H9LZBPL5ARqFOZdfUzTRZC6ij5N7jAZsw85ESyLIwwxmwJyVt9rb22SbbJuX+0jp7xuMpvr5KyCFOI7cVmWDJXmh3HZR6VNC4uqpi4i6dF10LtPPbJGtX6NBZm7lpZjPo7pF2SwaO3ysruibR4F45BnfEmdqV6mq1LKrRiZniZM6Ud+UCoveuVTFaAgnwDO+ARzXEetbN1BgSvA+mrYt177aiZZBqmzdIGQZIMdMAKZdXmUaCtk6dwqLQd76yoTJKzZUxda3j9PLC3OYo9Vd0SH0IS9mapgVj+TALBufBEp61GB/2TMFO6D/hZw7ATJjO8e9oLev8oJBU5vHPc3qRxXVRR6n5fsonLRbq6U6co+Hbca1KPN5PSyVwm3zMgIrLy1GeJSMu1YcMTal+zw+9F+HjA9jofbFv2zvInDzHd5IwWSUuyudgaCDffyeNxS1W/etnWcbvcV/xB1rzPNUt1VAGAAAAAElFTkSuQmCC"
      />
      <defs>
        <linearGradient id="paint0_linear_10493" x1={48} y1={0} x2={48} y2={96} gradientUnits="userSpaceOnUse">
          <stop stopColor="#53DEE9" />
          <stop offset={1} stopColor="#22c55e" />
        </linearGradient>
      </defs>
    </Svg>
  );
};

export default Icon;
