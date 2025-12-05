import { Flex } from "@pancakeswap/uikit";
import { styled } from "styled-components";

export const SwapFormWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  max-width: 480px;
  margin: 0 auto 56px;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  box-shadow: 0 0 15px rgba(54, 56, 56, 0.5);
  padding: 1rem;
`;

export const InputPanelWrapper = styled(Flex)`
  position: relative;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
`;

export const SwapTabAndInputPanelWrapper = styled(Flex)`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  align-items: center;
  will-change: transform;
  transition: transform 0.2 ease;
  transform: translateY(0px);
  width: 100%;
`;
