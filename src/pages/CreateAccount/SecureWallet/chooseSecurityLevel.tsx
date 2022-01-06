import ArrowSmRightIcon from '@heroicons/react/outline/ArrowSmRightIcon';
import RightArrow from 'assets/svgComponents/RightArrow';
import Button from 'components/primitives/Button';
import { PageContainer } from 'components/ui';
import { useState } from 'react';
import styled from 'styled-components';
import { SecurityOptions, SecurityOptionsEnum } from 'utils/types';
import SecurityInfo from './securityInfo';
import PopupContainer from './securityInfo';

export default function ChooseSecurityLevel() {
  const [securityType, setSecurityType] = useState<SecurityOptions>(undefined);

  const handleClick = (level: SecurityOptions) => {
    setSecurityType(level);
  };

  return (
    <Container>
      <SecurityInfo securityType={securityType} />
      <Title>SECURE YOUR WALLET</Title>
      <IconContainer>
        <Icon></Icon>
      </IconContainer>
      <TextContainer className="mt-10 text-base">
        <span>
          To secure your wallet you will be given a <span className="underline"> seed phrase.</span>{' '}
          Store this in a safe place. Its the only way to recover your wallet if you get locked out
          of the app or get a new device.
        </span>
      </TextContainer>
      <Buttons>
        <Button
          onClick={() => handleClick(SecurityOptionsEnum.None)}
          Icon={<RightArrow width={23} />}
          text={'Remind me Later'}
          borderColor="#ececec"
          bgColor="#ececec"
          color={'#111'}
        />
        <Button
          onClick={() => handleClick(SecurityOptionsEnum.Secured)}
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
  margin-top: 60px;
  font-family: 'SFCompactDisplayRegular';
  color: #767e93;
`;

const Buttons = styled.div`
  margin-top: auto;
`;
