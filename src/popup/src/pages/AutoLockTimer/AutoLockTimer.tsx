import TimerIcon from 'assets/svgComponents/TimerIcon';
import MenuHeader from 'components/MenuHeader/MenuHeader';
import Button from 'components/primitives/Button';
import HumbleInput from 'components/primitives/HumbleInput';
import Snackbar from 'components/Snackbar/Snackbar';
import { millisecondsToSeconds } from 'date-fns';
import Wallet from 'pages/Wallet/Wallet';
import { memo, useState } from 'react';
import { goTo, Link } from 'react-chrome-extension-router';
import { useDispatch, useSelector } from 'react-redux';
import { changeIdleTimeout } from 'redux/actions';
import styled from 'styled-components';
import { saveToStorage } from 'utils/chrome';
import { Messages, SnackbarMessages, StorageKeys } from 'utils/types';

function AutoLockTimer() {
  const [isOpen, setOpen] = useState<boolean>(true);

  const dispatch = useDispatch();
  const { idleTimeout } = useSelector((state: any) => state.wallet);
  const [timeout, changeTimeout] = useState<string>(idleTimeout || '');

  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [snackbarError, setSnackbarError] = useState<string>('');

  const handleSetTimeout = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (new RegExp(/[^0-9]+/g).test(e.target.value)) return;

    changeTimeout(e.target.value);
  };

  const handleSave = () => {
    if (!Number(timeout)) {
      setIsSnackbarOpen(true);
      setSnackbarError("Timer can't be empty");
      return;
    }

    dispatch(changeIdleTimeout(timeout));
    saveToStorage({ key: StorageKeys.IdleTimeout, value: timeout });
    chrome.runtime.sendMessage({ type: Messages.ChangeInterval, payload: { timeout } });
    goTo(Wallet, { snackbar: { show: true, message: SnackbarMessages.AutoLockUpdated } });
  };

  return (
    <Container>
      <MenuHeader
        isOpen={isOpen}
        setOpen={setOpen}
        title="AUTO-LOCK TIMER"
        onClose={() => goTo(Wallet)}
        backAction={() => goTo(Wallet, { isMenuOpen: true })}
      />
      <Content>
        <IconContainer>
          <TimerIcon stroke="#999999" />
        </IconContainer>
        <Text>How many minutes should pass before the wallet automatically locks?</Text>
        <HumbleInput
          id="auto-lock-timer"
          type="text"
          value={timeout || ''}
          onChange={handleSetTimeout}
          bgColor="#221d1d"
          borderColor="#303030"
          color="#828282"
          height="48px"
          marginTop="30px"
          rightLabel="minutes"
        />
        <ButtonContainer>
          <StyledLink component={Wallet} props={{ closeAction: () => goTo(Wallet) }}>
            <Button
              text="Cancel"
              bgColor="#fff"
              color="#111"
              justify="center"
              margin="auto 10px 0 0"
            />
          </StyledLink>
          <Button
            onClick={handleSave}
            text="Save"
            color="#111"
            justify="center"
            margin="auto 0 0 0"
            bgImage="linear-gradient(to right,#1cc3ce,#b9e260);"
          />
        </ButtonContainer>
      </Content>
      <Snackbar
        isOpen={isSnackbarOpen}
        close={() => setIsSnackbarOpen(false)}
        message={snackbarError}
        type="error"
        left="0px"
        bottom="110px"
      />
    </Container>
  );
}

export default memo(AutoLockTimer);

const Container = styled.div`
  width: 100%;
  height: 600px;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  padding: 15px 15px 40px 15px;
  box-sizing: border-box;
  background-color: #111111;
  z-index: 99999;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const IconContainer = styled.div`
  width: 129px;
  height: 129px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  background-color: #000;
  margin-top: auto;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  width: 100%;
  margin-top: auto;
`;

const Text = styled.div`
  font-family: SFCompactDisplayRegular;
  font-size: 18px;
  color: #dfdfdf;
  margin-top: 30px;
  text-align: center;
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  margin-top: auto;
`;
