import { useEffect, useState, memo } from 'react';
import styled from 'styled-components';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import '../../App.css';
import CloseIcon from 'assets/svgComponents/CloseIcon';

type Props = {
  children?: React.ReactNode;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  isOpen: boolean;
  close: () => void;
  type: 'error' | 'success' | 'warning';
  message?: string;
  align?: string;
};

function detectColor(type: string) {
  if (type === 'error') return '#fb5a5a';
  if (type === 'warning') return '#ecd335';
  return '#fff';
}

function Snackbar({
  children,
  type,
  top,
  bottom,
  left,
  right,
  isOpen,
  close,
  message,
  align
}: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      close();
    }, 3000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  return (
    <Container top={top} bottom={bottom} left={left} right={right} isOpen={isOpen}>
      <CSSTransition in={isOpen} timeout={200} classNames="my-node" unmountOnExit>
        <Content type={type}>
          {children || (
            <>
              <CloseIconContainer>
                <CloseIcon stroke="#fb5a5a" />
              </CloseIconContainer>
              <ErrorMessage align={align}>{message}</ErrorMessage>
            </>
          )}
        </Content>
      </CSSTransition>
    </Container>
  );
}

export default memo(Snackbar);

const Container = styled.div<{
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  isOpen?: boolean;
  padding?: string;
}>`
  width: 100%;
  height: 46px;
  /* padding: 15px; */
  box-sizing: border-box;
  position: absolute;
  border-radius: 5px;
  /* 0 16px */
  padding: ${({ padding }) => padding || '0px'};
  box-sizing: border-box;
  top: ${({ top }) => top && top};
  bottom: ${({ bottom }) => bottom && bottom};
  left: ${({ left }) => left && left};
  right: ${({ right }) => right && right};
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
`;

const Content = styled.div<{
  type: string;
}>`
  width: 100%;
  height: 46px;
  padding: 0 10px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  background-color: ${({ type }) => detectColor(type)};
  border-radius: 5px;
`;

const ErrorMessage = styled.div<{ align?: string }>`
  flex: 1;
  font-family: 'Work Sans';
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  margin-left: 10px;
  text-align: ${({ align }) => align || 'center'};
`;

const CloseIconContainer = styled.div`
  width: 24px;
  height: 24px;
  background-color: #fff;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
