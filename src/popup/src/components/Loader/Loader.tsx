import styled from 'styled-components';
import { ClassicSpinner } from 'react-spinners-kit';

import Popup from 'components/Popup/Popup';
import loadingTransactionBg from 'assets/imgs/loading-transaction.jpg';

const Loader = () => {
  return (
    <Popup justify="center" align="center" onClose={() => undefined}>
      <LoadingContainer bg={loadingTransactionBg}>
        <ClassicSpinner size={130} color="#fff" loading={true} />
      </LoadingContainer>
    </Popup>
  );
};

export default Loader;

const LoadingContainer = styled.div<{ bg: string }>`
  width: 100%;
  height: 100%;
  background-image: ${({ bg }) => `url(${bg})`};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  display: flex;
  align-items: center;
  justify-content: center;
  div {
    div {
      width: 2px;
      height: 10px;
    }
    :nth-child(4),
    :nth-child(8),
    :nth-child(12),
    :nth-child(16) {
      display: none;
    }
    :nth-child(2) {
      transform: rotate(30deg) translate(0, -65px);
    }
    :nth-child(3) {
      transform: rotate(60deg) translate(0, -65px);
    }
    :nth-child(6) {
      transform: rotate(120deg) translate(0, -65px);
    }
    :nth-child(7) {
      transform: rotate(150deg) translate(0, -65px);
    }
    :nth-child(10) {
      transform: rotate(210deg) translate(0, -65px);
    }
    :nth-child(11) {
      transform: rotate(240deg) translate(0, -65px);
    }
    :nth-child(14) {
      transform: rotate(300deg) translate(0, -65px);
    }
    :nth-child(15) {
      transform: rotate(330deg) translate(0, -65px);
    }
  }
`;
