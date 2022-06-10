import React, { MouseEventHandler } from 'react';
import styled from 'styled-components';

type Props = {
  onClose: () => void;
  children: React.ReactChild;
  justify?: string;
  align?: string;
  bg?: string;
};

export default function Popup({ children, onClose, ...rest }: Props) {
  const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <Container {...rest} onClick={(e: React.MouseEvent<HTMLDivElement>) => handleClose(e)}>
      {children}
    </Container>
  );
}

const Container = styled.div<{ justify?: string; align?: string; bg?: string }>`
  width: 100%;
  height: 100vh;
  background: ${({ bg }) => bg || 'rgba(26, 26, 26, 0.7)'};
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9999;
  display: flex;
  justify-content: ${({ justify }) => justify || 'inherit'};
  align-items: ${({ align }) => align || 'inherit'};
  /* top: 45px;
  left: 50%;
  transform: translate(-50%); */
`;
