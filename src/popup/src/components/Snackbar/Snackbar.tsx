import { useEffect, useState, memo } from 'react';
import styled from 'styled-components';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import '../../App.css';
import CloseIcon from 'assets/svgComponents/CloseIcon';
import CheckMarkIcon from 'assets/svgComponents/CheckMarkIcon';
import CheckedIcon from 'assets/svgComponents/CheckedIcon';

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
  width?: string;
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
  align,
  width
}: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      close();
    }, 3000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const renderContent = (type: 'error' | 'success' | 'warning') => {
    if (type === 'error') {
      return (
        <>
          <CloseIconContainer>
            <CloseIcon stroke="#111" />
          </CloseIconContainer>
          <ErrorMessage align={align}>{message}</ErrorMessage>
        </>
      );
    } else if (type === 'success') {
      return (
        <>
          <CheckIconContainer>
            <CheckedIcon fill="#fff" />
          </CheckIconContainer>
          <Message>{message}</Message>
        </>
      );
    } else if (type === 'warning') {
      return (
        <>
          <WarningContainer>
            <CloseIcon stroke="#ecd335" />
          </WarningContainer>
          <Message>{message}</Message>
        </>
      );
    }
  };

  return (
    <Container width={width} type={type} top={top} bottom={bottom} left={left} right={right}>
      <CSSTransition in={isOpen} out={isOpen} timeout={200} classNames="my-node" unmountOnExit>
        <Content type={type}>{children ? children : renderContent(type)}</Content>
      </CSSTransition>
    </Container>
  );
}

export default memo(Snackbar);

const Container = styled.div<{
  width?: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  padding?: string;
  type?: 'error' | 'success' | 'warning';
}>`
  width: ${({ width }) => width || '100%'};
  display: block;
  /* width: ${({ type }) => (type === 'error' ? '100%' : type === 'success' ? '195px' : '100%')}; */
  /* height: ${({ type }) => (type === 'error' ? '48px' : type === 'success' ? '48px' : '46px')}; */
  height: 48px;
  box-sizing: border-box;
  position: absolute;
  border-radius: 5px;
  padding: ${({ padding }) => padding || '0px'};
  box-sizing: border-box;
  top: ${({ top }) => top && top};
  bottom: ${({ bottom }) => bottom && bottom};
  left: ${({ left }) => left || '50%'};
  transform: translateX(-50%);
  right: ${({ right }) => right && right};
`;
/* display: ${({ isOpen }) => (isOpen ? 'block' : 'none')}; */

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
  box-shadow: 0 4px 33px 0 rgba(30, 35, 53, 0.15);
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

const Message = styled.div`
  font-family: 'IBM Plex Sans';
  font-size: 14px;
  font-weight: 500;
  color: #000;
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

const CheckIconContainer = styled.div`
  width: 24px;
  height: 24px;
  background-color: #45b26b;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 5px;
`;

const WarningContainer = styled.div`
  width: 24px;
  height: 24px;
  background-color: #111;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 5px;
`;
