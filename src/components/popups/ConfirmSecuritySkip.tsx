import ArrowSmRightIcon from '@heroicons/react/outline/ArrowSmRightIcon';
import Button from 'components/primitives/Button';
import Checkbox from 'components/primitives/Checkbox';
import styled from 'styled-components';

export function ConfirmSecuritySkip() {
  return (
    <Container>
      <MainContent>
        <Title>Skip Account Security?</Title>

        <Description>
          <Checkbox />
          <span> I understand that without a seed phrase I cannot restore my wallet</span>
        </Description>

        <ButtonContainer>
          <Button Icon={<ArrowSmRightIcon className="w-5 h-5 text-white" />} text={'Secure Now'} />
          <Gap />
          <Button
            bgColor="transparent"
            color="#111"
            Icon={<ArrowSmRightIcon className="w-5 h-5 text-black" />}
            text={'Skip'}
          />
        </ButtonContainer>
      </MainContent>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  box-sizing: border-box;
  background-color: rgba(0, 0, 0, 0.6);
  position: absolute;
  top: 0;
  left: 0;
`;

const MainContent = styled.div`
  width: 100%;
  height: 242px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 14px 24px;
  background-color: #f8f8f9;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
`;

const Title = styled.h3`
  width: 100%;
  font-size: 18px;
  /* font-family: "SFCompactDisplay"; */
  font-weight: 600;
  line-height: 1.35;
  text-align: left;
  color: #090a0b;
`;

const Description = styled.div`
  display: flex;
  margin-top: 42px;
  color: #767e93;
  line-height: 1.45;
  span {
    margin-left: 11px;
  }
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  margin-top: 30px;
`;

const Gap = styled.div`
  width: 20px;
`;
