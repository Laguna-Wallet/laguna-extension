import ArrowSmRightIcon from '@heroicons/react/outline/ArrowSmRightIcon';
import RightArrow from 'assets/svgComponents/RightArrow';
import { ConfirmSecuritySkip } from 'components/popups/ConfirmSecuritySkip';
import { MnemonicsDescription } from 'components/popups/MnemonicsDescription';
import Button from 'components/primitives/Button';
import { PageContainer } from 'components/ui';
import { useState } from 'react';
import { useWizard } from 'react-use-wizard';
import styled from 'styled-components';
import { SecurityOptions, SecurityOptionsEnum } from 'utils/types';
import SecurityInfo from './securityInfo';
import PopupContainer from './securityInfo';

export default function ChooseSecurityLevel() {
  const [securityType, setSecurityType] = useState<SecurityOptions>(undefined);
  const { nextStep } = useWizard();

  const [isMnemonicDescriptionOpen, setIsMnemonicDescriptionOpen] = useState<boolean>();
  const [isConfirmSkipOpen, setConfirmSkipOpen] = useState<boolean>();

  return (
    <Container>
      {isMnemonicDescriptionOpen && (
        <MnemonicsDescription onClose={() => setIsMnemonicDescriptionOpen(false)} />
      )}
      {isConfirmSkipOpen && <ConfirmSecuritySkip />}

      <Title>SECURE YOUR WALLET</Title>
      <IconContainer>
        <Icon></Icon>
      </IconContainer>
      <TextContainer>
        To secure your wallet you&apos;ll be given a 12 word{' '}
        <span onClick={() => setIsMnemonicDescriptionOpen(true)}>Mnemonic seed phrase.</span> Store
        this in a safe place. It&apos;s the only way to recover your wallet if you get locked out or
        get a new device.
      </TextContainer>
      <Buttons>
        <Button
          onClick={() => setConfirmSkipOpen(true)}
          Icon={<RightArrow width={23} />}
          text={'Remind me Later'}
          borderColor="#ececec"
          bgColor="#ececec"
          color={'#111'}
        />
        <Button
          onClick={() => nextStep()}
          Icon={<RightArrow width={23} fill="#fff" />}
          text={'Start'}
          margin="14px 0px 0px 0px"
        />
      </Buttons>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const Title = styled.span`
  font-family: 'Sequel100Wide55Wide';
  font-size: 17px;
  letter-spacing: 0.85px;
  margin-top: 30px;
`;

const IconContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 24px;
`;

const Icon = styled.div`
  width: 153px;
  height: 153px;
  border-radius: 100%;
  background-color: #efefef;
`;

const TextContainer = styled.div`
  font-size: 16px;
  margin-top: auto;
  font-family: 'SFCompactDisplayRegular';
  color: #767e93;
  line-height: 1.45;

  span {
    cursor: pointer;
    color: #111;
  }
`;

const Buttons = styled.div`
  /* margin-top: auto; */
`;
