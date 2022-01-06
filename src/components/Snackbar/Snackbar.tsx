import { useEffect, useState, memo } from 'react';
import styled from 'styled-components';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import '../../App.css';

type Props = {
  children: React.ReactNode;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  isOpen: boolean;
  close: () => void;
  type: 'error' | 'success' | 'warning';
};

function detectColor(type: string) {
  if (type === 'error') return '#fb5a5a';
  if (type === 'warning') return '#ecd335';
  return '#fff';
}

function Snackbar({ children, type, top, bottom, left, right, isOpen, close }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      close();
    }, 3000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  return (
    <div>
      <CSSTransition in={isOpen} timeout={200} classNames="my-node" unmountOnExit>
        <Container type={type} top={top} bottom={bottom} left={left} right={right}>
          {children}
        </Container>
      </CSSTransition>
    </div>
  );
}

export default memo(Snackbar);

const Container = styled.div<{
  type: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  isSnackbarOpen?: boolean;
}>`
  width: 100%;
  height: 46px;
  display: flex;
  align-items: center;
  background-color: ${({ type }) => detectColor(type)};
  border-radius: 5px;
  padding: 10px;
  box-sizing: border-box;
  position: absolute;
  top: ${({ top }) => top && top};
  bottom: ${({ bottom }) => bottom && bottom};
  left: ${({ left }) => left && left};
  right: ${({ right }) => right && right};
`;
