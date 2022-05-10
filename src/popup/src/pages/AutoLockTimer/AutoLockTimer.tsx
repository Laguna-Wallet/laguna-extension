import TimerIcon from 'assets/svgComponents/TimerIcon';
import MenuHeader from 'components/MenuHeader/MenuHeader';
import Button from 'components/primitives/Button';
import HumbleInput from 'components/primitives/HumbleInput';
import Snackbar from 'components/Snackbar/Snackbar';
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

  const [snackbarError, setSnackbarError] = useState<string>('');
  const [isChangeValue, setIsChangeValue] =useState<boolean>(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);

  const handleSetTimeout = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChangeValue(true);
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
          <TimerIcon/>
        </IconContainer>
        <Text>How many minutes should pass before the wallet automatically locks?</Text>
        <HumbleInput
          id="auto-lock-timer"
          type="text"
          value={timeout || ''}
          onChange={handleSetTimeout}
          bgColor="#221d1d"
          borderColor="#303030"
          color= {isChangeValue ? "#fff" : '#777E91'} 
          height="48px"
          marginTop="22px"
          rightLabel="minutes"
          fontSize='16px'
        />
        <ButtonContainer>
          <StyledLink component={Wallet} props={{ closeAction: () => goTo(Wallet) }}>
            <Button
              text="Cancel"
              bgColor="#414141"
              color="#fff"
              justify="center"
              margin="auto 10px 0 0"
              borderColor='transparent'
              width='154px'
            />
          </StyledLink>
          <Button
            onClick={handleSave}
            text="Save"
            color="#23262F"
            justify="center"
            margin="0 0 0 15px"
            bgColor='#fff'
            borderColor='transparent'
            width='154px'
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
  padding: 0 17.5px 44px;
  box-sizing: border-box;
  background-color: #111111;
  z-index: 99999;
`;

const Content = styled.div`
  height: 100%;
  display: flex;
  padding: 0 8.5px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 8.5px;
`;

const IconContainer = styled.div`
  width: 122px;
  height: 122px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  background-color: #000;
  margin-top: 36px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  width: 100%;
  margin-top: auto;
  width: 154px;
`;

const Text = styled.div`
  color: #dfdfdf;
  margin-top: 30px;
  text-align: center;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 23px;
  display: flex;
  align-items: center;
  text-align: center;
  max-width: 303px;
  width: 100%;
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  margin-top: auto;
`;
