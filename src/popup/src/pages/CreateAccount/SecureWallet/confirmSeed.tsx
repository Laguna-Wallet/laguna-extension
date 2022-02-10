import styled from 'styled-components';
import { useEffect, useMemo, useState } from 'react';
import {
  calculatePasswordCheckerColor,
  generateNumberAbbreviation,
  generateThreeRandomMnemonicIndexes,
  mnemonicsAreChecked,
  validateMnemonicChoice
} from 'utils';
import Button from 'components/primitives/Button';
import { ArrowSmRightIcon } from '@heroicons/react/outline';
import { useAccount } from 'context/AccountContext';
import { MnemonicsTriple } from 'utils/types';
import RightArrow from 'assets/svgComponents/RightArrow';
import arrayShuffle from 'array-shuffle';
import Snackbar from 'components/Snackbar/Snackbar';
import CloseIcon from 'assets/svgComponents/CloseIcon';
import WizardHeader from 'pages/AddImportForExistingUsers/WizardHeader';
import { goTo } from 'react-chrome-extension-router';
import Wallet from 'pages/Wallet/Wallet';
import SignUp from 'pages/SignUp/SignUp';
import { useWizard } from 'react-use-wizard';

const calculateWordColor = (index: number, mnemonicIndexToChoose: number) => {
  if (index === mnemonicIndexToChoose) return '#F9F7CD';
  if (index < mnemonicIndexToChoose) return '#CDF9D0';
  return '#F9F9F9';
};

type Props = {
  handleNextSection: () => void;
  redirectedFromSignUp?: boolean;
};

export default function ConfirmSeed({ handleNextSection, redirectedFromSignUp }: Props) {
  const { mnemonics } = useAccount();
  const { previousStep } = useWizard();
  const [mnemonicIndexes, setMnemonicIndexes] = useState<MnemonicsTriple>();
  const [chosenMnemonics, setChosenMnemonics] = useState<string[] | []>([]);
  const [mnemonicIndexToChoose, setMnemonicIndexToChoose] = useState<number>(0);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);

  useEffect(() => {
    setMnemonicIndexes(generateThreeRandomMnemonicIndexes());
  }, []);

  const handleClick = (name: string) => {
    setChosenMnemonics((prev) => [...prev, name]);
    setMnemonicIndexToChoose((prev) => prev + 1);
  };

  useEffect(() => {
    if (chosenMnemonics.length === 3) {
      const isValid = validateMnemonicChoice(
        mnemonics,
        chosenMnemonics,
        mnemonicIndexes as MnemonicsTriple
      );

      if (isValid) {
        handleNextSection();
      } else {
        setTimeout(() => {
          setChosenMnemonics([]);
          setMnemonicIndexToChoose(0);
          setIsSnackbarOpen(true);
        }, 300);
      }
    }
  }, [chosenMnemonics]);

  const shuffledMnemonics: string[] = useMemo(() => arrayShuffle([...mnemonics]), []);

  return (
    <Container>
      <MainContent>
        <WizardHeader
          title={'CONFIRM YOUR SEED'}
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

        <SelectWords>
          <Description>Select each word in the order it was presented to you:</Description>
          <WordsContainer>
            {mnemonicIndexes &&
              mnemonicIndexes.map((num, index) => {
                return (
                  <Word key={num} bgColor={calculateWordColor(index, mnemonicIndexToChoose)}>
                    <MnemonicName>{generateNumberAbbreviation(num + 1)}</MnemonicName>
                  </Word>
                );
              })}
          </WordsContainer>
        </SelectWords>

        <MnemonicsContainer>
          {shuffledMnemonics?.map((name, index) => (
            <Mnemonic
              active={chosenMnemonics.includes(name as never)}
              key={name}
              onClick={() => handleClick(name)}>
              <MnemonicName active={false}>{name}</MnemonicName>
            </Mnemonic>
          ))}
        </MnemonicsContainer>
      </MainContent>

      <Snackbar
        isOpen={isSnackbarOpen}
        close={() => setIsSnackbarOpen(false)}
        type="warning"
        bottom="50px">
        <CloseIconContainer>
          <CloseIcon stroke="#111" />
        </CloseIconContainer>
        <ErrorMessage>Please choose words in provided order</ErrorMessage>
      </Snackbar>

      <Button
        onClick={() => handleNextSection()}
        disabled={!mnemonicsAreChecked({})}
        text={'I’ve Written it Down'}
        Icon={<RightArrow width={23} fill="#fff" />}
        bgColor={'#000000'}
        borderColor="#000000"
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
  position: relative;
  background-color: #f8f8f8;
  padding: 30px 16px 38px 16px;
  box-sizing: border-box;
`;

const MainContent = styled.div``;

const SelectWords = styled.div`
  width: 100%;
  height: 130px;
  background-color: #fff;
  border-radius: 5px;
  margin-top: 20px;
  padding: 12px;
  box-sizing: border-box;
`;

const Title = styled.div`
  margin-top: 28px;
  font-size: 17px;
  font-family: 'Sequel100Wide55Wide';
`;

const Description = styled.div`
  font-size: 16px;
  line-height: 1.45;
  color: #767e93;
  font-family: 'SFCompactDisplayRegular';
`;

const WordsContainer = styled.div`
  display: flex;
  margin-top: 15px;
`;

const MnemonicsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 60px;
`;

const Mnemonic = styled.div<{ indexesHt?: Record<string, string>; active: boolean }>`
  width: 97px;
  height: 34px;
  border-radius: 3px;
  background-color: ${({ active }) => (active ? '#eee' : '#fff')};
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  margin-right: 10px;
  font-size: 13.4px;
  cursor: pointer;
  font-family: 'SFCompactDisplayRegular';
  &:nth-child(3n + 3) {
    margin-right: 0;
  }
`;

const Word = styled.div<{ bgColor: string }>`
  width: 97px;
  height: 34px;
  background-color: ${({ bgColor }) => bgColor};
  border-radius: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  margin-right: 10px;
  font-size: 13.4px;
  cursor: pointer;
  font-family: 'SFCompactDisplayRegular';
  &:nth-child(3n + 3) {
    margin-right: 0;
  }
`;

const MnemonicName = styled.span<{ active?: boolean }>`
  font-weight: 500;
  opacity: ${({ active }) => (active ? '0.6' : '1')};
`;

const CloseIconContainer = styled.div`
  width: 24px;
  height: 24px;
  background-color: #fff;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ErrorMessage = styled.div`
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  margin-left: 5px;
`;
