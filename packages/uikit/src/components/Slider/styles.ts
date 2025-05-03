import { InputHTMLAttributes } from "react";
import { styled } from "styled-components";
import Text from "../Text/Text";

interface SliderLabelProps {
  progress: string;
}

interface StyledInputProps extends InputHTMLAttributes<HTMLInputElement> {
  $isMax: boolean;
}

interface DisabledProp {
  disabled?: boolean;
}

const getCursorStyle = ({ disabled = false }: DisabledProp) => {
  return disabled ? "not-allowed" : "cursor";
};
const bunnyHeadMax = `"data:image/png;base64,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"`;
const bunnyHeadMain = `"data:image/png;base64,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"`;
const bunnyButt = `"data:image/svg+xml,%3Csvg width='15' height='32' viewBox='0 0 15 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M9.58803 20.8649C7.72935 21.3629 8.02539 24.0334 8.76388 26.7895C9.50238 29.5456 10.5812 32.0062 12.4399 31.5082C14.2986 31.0102 15.2334 28.0099 14.4949 25.2538C13.7564 22.4978 11.4467 20.3669 9.58803 20.8649Z' fill='%230098A1'/%3E%3Cpath d='M1 24.4516C1 20.8885 3.88849 18 7.45161 18H15V28H4.54839C2.58867 28 1 26.4113 1 24.4516Z' fill='%231FC7D4'/%3E%3Cpath d='M6.11115 17.2246C6.79693 18.4124 5.77784 19.3343 4.52793 20.0559C3.27802 20.7776 1.97011 21.1992 1.28433 20.0114C0.598546 18.8236 1.1635 17.1151 2.41341 16.3935C3.66332 15.6718 5.42537 16.0368 6.11115 17.2246Z' fill='%2353DEE9'/%3E%3Cpath d='M1.64665 23.6601C0.285995 25.0207 1.87759 27.1854 3.89519 29.203C5.91279 31.2206 8.07743 32.8122 9.43808 31.4515C10.7987 30.0909 10.1082 27.0252 8.09058 25.0076C6.07298 22.99 3.0073 22.2994 1.64665 23.6601Z' fill='%231FC7D4'/%3E%3C/svg%3E"`;

const getBaseThumbStyles = ({ $isMax, disabled }: StyledInputProps) => `
  -webkit-appearance: none;
  background-image: url(${$isMax ? bunnyHeadMax : bunnyHeadMain});
  background-color: transparent;
  box-shadow: none;
  border: 0;
  cursor: ${getCursorStyle};
  width: 51px;
  height: 65px;
  filter: ${disabled ? "grayscale(100%)" : "none"};
  transform: translate(-2px, -2px);
  transition: 200ms transform;
  &:hover {
    transform: ${disabled ? "scale(1) translate(-2px, -2px)" : "scale(1.1) translate(-3px, -3px)"};
  }
`;

export const SliderLabelContainer = styled.div`
  bottom: 0;
  position: absolute;
  left: 14px;
  width: calc(100% - 30px);
`;

export const SliderLabel = styled(Text)<SliderLabelProps>`
  bottom: 0;
  font-size: 12px;
  left: ${({ progress }) => progress};
  position: absolute;
  text-align: center;
  min-width: 24px; // Slider thumb size
`;

export const BunnyButt = styled.div<DisabledProp>`
  background: url(${bunnyButt}) no-repeat;
  height: 32px;
  filter: ${({ disabled, theme }) => (disabled ? "grayscale(100%)" : `brightness(${theme.isDark ? 50 : 100})`)};
  position: absolute;
  width: 15px;
`;

export const BunnySlider = styled.div`
  position: absolute;
  left: 14px;
  width: calc(100% - 14px);
`;

export const StyledInput = styled.input<StyledInputProps>`
  cursor: ${getCursorStyle};
  height: 32px;
  position: relative;
  &::-webkit-slider-thumb {
    ${getBaseThumbStyles}
  }
  &::-moz-range-thumb {
    ${getBaseThumbStyles}
  }
  &::-ms-thumb {
    ${getBaseThumbStyles}
  }
`;

export const BarBackground = styled.div<DisabledProp>`
  background-color: ${({ theme, disabled }) => theme.colors[disabled ? "textDisabled" : "inputSecondary"]};
  height: 2px;
  position: absolute;
  top: 18px;
  width: 100%;
`;

export const BarProgress = styled.div<DisabledProp>`
  background-color: ${({ theme }) => theme.colors.primary};
  filter: ${({ disabled }) => (disabled ? "grayscale(100%)" : "none")};
  height: 10px;
  position: absolute;
  top: 18px;
`;
