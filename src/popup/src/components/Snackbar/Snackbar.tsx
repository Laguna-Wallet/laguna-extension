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
};

function detectColor(type: string) {
  if (type === 'error') return '#fb5a5a';
  if (type === 'warning') return '#ecd335';
  return '#fff';
}

function Snackbar({ children, type, top, bottom, left, right, isOpen, close, message }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      close();
    }, 3000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  return (
    <Container top={top} bottom={bottom} left={left} right={right}>
      <CSSTransition in={isOpen} timeout={200} classNames="my-node" unmountOnExit>
        <Content type={type}>
          {children || (
            <>
              <CloseIconContainer>
                <CloseIcon stroke="#111" />
              </CloseIconContainer>
              <ErrorMessage>{message}</ErrorMessage>
            </>
          )}
        </Content>
      </CSSTransition>
    </Container>
  );
}

export default memo(Snackbar);

const Container = styled.div<{ top?: string; bottom?: string; left?: string; right?: string }>`
  width: 100%;
  height: 46px;
  padding: 15px;
  box-sizing: border-box;
  position: absolute;
  border-radius: 5px;
  top: ${({ top }) => top && top};
  bottom: ${({ bottom }) => bottom && bottom};
  left: ${({ left }) => left && left};
  right: ${({ right }) => right && right};
`;

const Content = styled.div<{
  type: string;
  isSnackbarOpen?: boolean;
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

const ErrorMessage = styled.div`
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  margin-left: 5px;
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
