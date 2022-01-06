import React, { MouseEventHandler } from 'react';
import styled from 'styled-components';

type Props = {
  onClose: () => void;
  children: React.ReactChild | React.ReactChildren;
};

export default function Popup({ children, onClose }: Props) {
  const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <Container onClick={(e: React.MouseEvent<HTMLDivElement>) => handleClose(e)}>
      {children}
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(26, 26, 26, 0.7);
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9999;
  /* top: 45px;
  left: 50%;
  transform: translate(-50%); */
`;
