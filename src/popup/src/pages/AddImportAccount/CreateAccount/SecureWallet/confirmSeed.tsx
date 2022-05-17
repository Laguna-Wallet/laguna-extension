import styled from 'styled-components';
import { useEffect, useMemo, useState } from 'react';
import {
  copyToClipboard,
  generateNumberAbbreviation,
  generateThreeRandomMnemonicIndexes,
  validateMnemonicChoice
} from 'utils';
import Button from 'components/primitives/Button';
import { useAccount } from 'context/AccountContext';
import { MnemonicsTriple } from 'utils/types';
import RightArrow from 'assets/svgComponents/RightArrow';
import arrayShuffle from 'array-shuffle';
import Snackbar from 'components/Snackbar/Snackbar';

const calculateWordColor = (index: number, mnemonicIndexToChoose: number) => {
  if (index === mnemonicIndexToChoose) return '#F9F7CD';
  if (index < mnemonicIndexToChoose) return '#CDF9D0';
  return '#F9F9F9';
};

type Props = {
  handleNextSection: () => void;
};

export default function ConfirmSeed({ handleNextSection }: Props) {
  const { mnemonics } = useAccount();
  const [mnemonicIndexes, setMnemonicIndexes] = useState<MnemonicsTriple>();
  const [chosenMnemonics, setChosenMnemonics] = useState<string[] | []>([]);
  const [mnemonicIndexToChoose, setMnemonicIndexToChoose] = useState<number>(0);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);

  useEffect(() => {
    setMnemonicIndexes(generateThreeRandomMnemonicIndexes());
  }, []);

  const handleClick = (name: string) => {
    if (chosenMnemonics.length === 3) return;
    setChosenMnemonics((prev) => [...prev, name]);
    setMnemonicIndexToChoose((prev) => prev + 1);
  };

  const handleWrittenClick = () => {
    if (
      validateMnemonicChoice(mnemonics, chosenMnemonics, mnemonicIndexes as MnemonicsTriple) &&
      !isSnackbarOpen
    ) {
      console.log('here');
      handleNextSection();
      copyToClipboard('');
    }
  };

  useEffect(() => {
    if (chosenMnemonics.length === 3) {
      const isValid = validateMnemonicChoice(
        mnemonics,
        chosenMnemonics,
        mnemonicIndexes as MnemonicsTriple
      );

      if (isValid) {
        // handleNextSection();
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
          <Title>Confirm Your Backup</Title>

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
          message="Please select words in provided order"
          close={() => setIsSnackbarOpen(false)}
          type="error"
          left='26px'
          bottom="80px"
          transform='translateX(0)'
        />

        <Button
          onClick={handleWrittenClick}
          disabled={
            !validateMnemonicChoice(mnemonics, chosenMnemonics, mnemonicIndexes as MnemonicsTriple)
          }
          text={'I’ve Written it Down'}
          Icon={<RightArrow width={23} fill="#fff" />}
          bgColor={'#000000'}
          borderColor="#000000"
          justify="center"
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
`;
const MainContent = styled.div``;

const SelectWords = styled.div`
  width: 100%;
  height: 130px;
  background-color: #fff;
  border-radius: 5px;
  padding: 12px;
  box-sizing: border-box;
  margin-top: 12px;
`;

const Title = styled.div`
  font-family: 'IBM Plex Sans';
  font-size: 22px;
  font-weight: 500;
  color: #18191a;
  margin-top: 30px;
`;

const Description = styled.div`
  font-family: Inter;
  font-size: 16px;
  line-height: 1.45;
  text-align: left;
  color: #18191a;
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
  margin-top: 28px;
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
