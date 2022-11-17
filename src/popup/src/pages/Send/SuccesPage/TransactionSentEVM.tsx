import { useState } from "react";
// import RightArrow from "assets/svgComponents/RightArrow";
// import SuccessfullySentIcon from "assets/svgComponents/SuccesfullySentIcon";
import bg from "assets/imgs/ethSendSuccessBg.png";
import Button from "components/primitives/Button";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { reset } from "redux-form";
import { useHistory, useLocation } from "react-router-dom";
import { router } from "router/router";
import browser from "webextension-polyfill";
import EthSuccessIcon from "assets/svgComponents/EthSuccessIcon";
import CopyIcon from "assets/svgComponents/CopyIcon";
import { copyToClipboard } from "utils";
import Snackbar from "components/Snackbar/Snackbar";

type LocationState = {
  block?: string;
  amountToSend: string;
};

export default function TransactionSentEVM() {
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);

  const history = useHistory();
  const location = useLocation<LocationState>();

  const sendToken = useSelector((state: any) => state.sendToken);
  const dispatch = useDispatch();

  // const chain = useSelector((state: any) => state.sendToken.selectedAsset.chain);
  const onClick = (hash: string) => {
    browser.windows.create({ url: `https://etherscan.io/tx/${hash}` });
  };

  const handleClick = () => {
    dispatch(reset("sendToken"));
    history.push(router.home);
  };

  return (
    <Container bg={bg}>
      <Content>
        <IconContainer>
          <EthSuccessIcon />
        </IconContainer>
        <Text>TRANSACTION SENT</Text>
        <Amount>{location?.state?.amountToSend} ETH</Amount>
        <Address>
          <span>[{sendToken?.to}]</span>
          <CopyBtnContainer
            onClick={() => {
              copyToClipboard(location?.state?.amountToSend);
              setIsSnackbarOpen(true);
            }}>
            <CopyIcon fill="#11171D" />
          </CopyBtnContainer>
        </Address>
        <Snackbar
          width="194.9px"
          isOpen={isSnackbarOpen}
          close={() => setIsSnackbarOpen(false)}
          message={"Address Copied"}
          type="success"
          // left="110px"
          bottom="130px"
        />
      </Content>
      <ButtonsContainer>
        <Button
          onClick={() => onClick(location?.state?.block as string)}
          text="Check on Etherscan"
          bgColor="#fff"
          color="#18191A"
          borderColor="#fff"
          justify="center"
        />
        <Button
          onClick={handleClick}
          text="Okay"
          margin="12px 0 0 0"
          justify="center"
          bgColor="#18191A"
        />
      </ButtonsContainer>
    </Container>
  );
}

const Container = styled.div<{ bg: string }>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-image: ${({ bg }) => `url(${bg})`};
  box-sizing: border-box;
  position: relative;
  position: relative;
  background-size: cover;
  padding-bottom: 18px;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  padding: 0 15px;
  box-sizing: border-box;
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const IconContainer = styled.div`
  width: 225px;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Text = styled.div`
  margin-top: 10px;
  font-family: "Inter";
  font-weight: 600;
  font-size: 18px;
  letter-spacing: 0.8px;
  color: #313131;
`;

const Amount = styled.div`
  margin-top: 65px;
  font-weight: 500;
  font-size: 16px;
  font-family: "Inter";
  color: #11171d;
`;
const Address = styled.div`
  display: flex;
  align-items: center;
  margin-top: 7px;
  font-size: 14px;
  color: #62768a;
`;

const CopyBtnContainer = styled.div`
  margin-left: 5px;
  cursor: pointer;
`;

const ButtonsContainer = styled.div`
  display: flex;
  margin-top: auto;
  flex-direction: column;
  padding: 0 15px;
  box-sizing: border-box;
`;
