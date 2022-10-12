import styled from "styled-components/macro";
import { PlusIcon } from "@heroicons/react/outline";
import keyring from "@polkadot/ui-keyring";
import AddressBookIcon from "assets/svgComponents/AdressBookIcon";
import ContactsIcon from "assets/svgComponents/ContactsIcon";
import LoopIcon from "assets/svgComponents/loopIcon";
import Button from "components/primitives/Button";
import HumbleInput from "components/primitives/HumbleInput";
import AddAddress from "pages/AddressBook/AddAddress";
import Header from "pages/Wallet/Header";
import { useEffect, useState } from "react";
import { truncateString } from "utils";
import BackIcon from "assets/svgComponents/CopyIcon";
import LeftArrowIcon from "assets/svgComponents/LeftArrowIcon";
import CloseIcon from "assets/svgComponents/CloseIcon";
import HintIcon from "assets/svgComponents/HintIcon";

type Props = { onClose: () => void };

export default function GasSettings({ onClose }: Props) {
  return (
    <Container>
      <InnerContainer>
        <Heading>
          <BackButtonContainer>
            <LeftArrowIcon />
          </BackButtonContainer>
          <Title>Advanced</Title>
          <HeadingRight>
            <HintIconContainer>
              <HintIcon />
            </HintIconContainer>
            <CloseButtonContainer>
              <CloseIcon />
            </CloseButtonContainer>
          </HeadingRight>
        </Heading>
        <TextRow>
          <TextRowRight>Current gas price</TextRowRight>
          <span>14.234 Gwei</span>
        </TextRow>
        <Form></Form>
        {/* <Button /> */}
      </InnerContainer>
    </Container>
  );
}

const Container = styled.div<{ bg?: string }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: rgba(26, 26, 26, 0.7);
  background-size: cover;
  padding-top: 92px;
  position: absolute;
  overflow: hidden;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
`;

const InnerContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  padding: 20px 24px 16px;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 10px 10px 0px 0px;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
`;

const Heading = styled.div`
  display: flex;
  justify-content: space-between;
`;

const BackButtonContainer = styled.div`
  cursor: pointer;
`;

const Title = styled.span`
  font-family: "Inter";
  font-weight: 500;
  font-size: 18px;
  letter-spacing: 0.25px;
  color: #11171d;
`;

const HeadingRight = styled.div`
  display: flex;
  align-items: center;
`;

const CloseButtonContainer = styled.div`
  cursor: pointer;
  margin-left: 5px;
`;

const HintIconContainer = styled.div`
  cursor: pointer;
`;

const TextRow = styled.div`
    display: 0 ;
`;

const TextRowRight = styled.div``;

const Form = styled.div``;
