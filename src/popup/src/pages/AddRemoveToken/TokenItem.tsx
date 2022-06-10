import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

import WrongSwitch from 'react-switch';
const Switch: any = WrongSwitch;

import { Network, StorageKeys, Token } from 'utils/types';
import { saveToStorage } from 'utils/chrome';

import { changeDisabledTokens } from 'redux/actions';

import NetworkIcons from 'components/primitives/NetworkIcons';
import { State } from 'redux/store';

import Bg from 'assets/imgs/avatars/avatar-1.png';
import { url } from 'inspector';

type Props = {
  network: Network;
  balance: string | undefined;
};

export default function TokenItem({ network, balance }: Props) {
  const dispatch = useDispatch();
  const { disabledTokens } = useSelector((state: State) => state.wallet);

  const handleChange = (token: Token) => {
    // todo, better solution will be to persist state via redux, maybe from store.subscribe or in middleware

    if (disabledTokens.includes(token)) {
      const newItems = disabledTokens.filter((item: string) => item !== token);
      saveToStorage({ key: StorageKeys.DisabledTokens, value: JSON.stringify(newItems) });
      dispatch(changeDisabledTokens(newItems));
    } else {
      const newItems = [...disabledTokens, token];
      saveToStorage({ key: StorageKeys.DisabledTokens, value: JSON.stringify(newItems) });
      dispatch(changeDisabledTokens(newItems));
    }
  };

  return (
    <Container>
      <NetworkIcons chain={network.chain} />
      <Text>
        <ChainTitle>{network.chain}</ChainTitle>
        {/* <Balance>{balances && balances[network.chain]?.toFixed(4)}</Balance> */}
        <Balance>{balance && balance}</Balance>
      </Text>
      <SwitchContainer>
        <Switch
          width={49}
          height={20}
          onChange={() => handleChange(network.symbol)}
          checked={!disabledTokens.includes(network.symbol)}
          onColor="#23262f"
          offColor="#b1b5c3"
          checkedIcon={
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontFamily: 'IBM Plex Sans',
                height: '100%',
                fontSize: 12,
                color: '#fff',
                paddingLeft: 2
              }}>
              ON
            </div>
          }
          uncheckedIcon={
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontFamily: 'IBM Plex Sans',
                height: '100%',
                fontSize: 12,
                color: '#fff',
                paddingRight: 2
              }}>
              OFF
            </div>
          }
          // backgroundImage: `url(${Bg})`,
        />
      </SwitchContainer>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 63px;
  padding: 0 16px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  cursor: pointer;
  text-decoration: none;
  color: #111;
  background-color: #f2f2f2;
  border-radius: 4px;
  margin-bottom: 12px;
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 8px;
`;

const ChainTitle = styled.span`
  font-family: 'IBM Plex Sans';
  font-size: 14px;
  font-weight: 500;
  color: #000;
  text-transform: capitalize;
`;

const Balance = styled.span`
  font-family: 'IBM Plex Sans';
  font-size: 10px;
  color: #23262f;
`;

const SwitchContainer = styled.div`
  margin-left: auto;
`;
