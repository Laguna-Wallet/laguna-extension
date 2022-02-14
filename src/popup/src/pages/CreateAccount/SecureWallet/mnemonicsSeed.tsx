import styled from 'styled-components';
import { mnemonicGenerate } from '@polkadot/util-crypto';
import { useEffect, useState } from 'react';
import { copyToClipboard } from 'utils';
import ButtonsIcon from 'assets/svgComponents/ButtonsIcon';
import Button from 'components/primitives/Button';
import { ArrowSmRightIcon } from '@heroicons/react/outline';
import { useWizard } from 'react-use-wizard';
import { useAccount } from 'context/AccountContext';
import RightArrow from 'assets/svgComponents/RightArrow';
import WizardHeader from 'pages/AddImportForExistingUsers/WizardHeader';
import { goTo } from 'react-chrome-extension-router';
import Wallet from 'pages/Wallet/Wallet';
import SignUp from 'pages/SignUp/SignUp';

type Props = {
  redirectedFromSignUp?: boolean;
};

export default function MnemonicsSeed({ redirectedFromSignUp }: Props) {
  const { nextStep, previousStep } = useWizard();

  const handleClick = () => {
    nextStep();
  };

  const { mnemonics } = useAccount();

  return (
    <Container>
      <WizardHeader
        title={'SECURE YOUR WALLET'}
        onClose={() => {
          if (redirectedFromSignUp) {
            goTo(SignUp);
          } else {
            goTo(Wallet);
          }
        }}
        onBack={() => {
          previousStep();
        }}
      />
      <MainContent>
        <Description>
          Please write this 12 word mnemonic seed phrase down in the exact order that it is shown
          below. Do not reveal this information to anyone.
        </Description>
        <MnemonicsContainer>
          {mnemonics?.map((name, index) => (
            <Mnemonic key={`seed-mnemonic-${index}`}>
              <MnemonicIndex> {index + 1}</MnemonicIndex>
              <MnemonicName>{name}</MnemonicName>
            </Mnemonic>
          ))}
        </MnemonicsContainer>

        {mnemonics && (
          <CopyBtn onClick={() => copyToClipboard(mnemonics?.join(' '))}>
            <span>Copy</span> <ButtonsIcon fill="#fff" />
          </CopyBtn>
        )}
      </MainContent>

      <Button
        onClick={handleClick}
        text={'I’ve Written it Down'}
        Icon={<RightArrow width={23} />}
      />
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #f8f8f8;
  padding: 30px 16px 38px 16px;
  box-sizing: border-box;
`;

const MainContent = styled.div``;

const Title = styled.div`
  font-size: 17px;
  margin-top: 28px;
  font-family: 'Sequel100Wide55Wide';
`;

const Description = styled.div`
  margin-top: 20px;
  color: #767e93;
  line-height: 1.45;
  font-family: 'SFCompactDisplayRegular';
  font-size: 16px;
  text-align: left;
`;

const MnemonicsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 60px;
`;

const Mnemonic = styled.div`
  width: 97px;
  height: 34px;
  background-color: #fff;
  border-radius: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  margin-right: 10px;
  font-size: 13.4px;
  &:nth-child(3n + 3) {
    margin-right: 0;
  }
`;

const MnemonicName = styled.span`
  font-weight: 500;
  font-family: 'SFCompactDisplayRegular';
`;

const MnemonicIndex = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: #9f9f9f;
  margin-right: 5px;
`;

const CopyBtn = styled.div`
  width: 70px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: auto;
  margin-top: 5px;
  border-radius: 20px;
  background-color: #111;
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  font-family: 'SFCompactDisplayRegular';

  span {
    margin-right: 5px;
  }
`;
