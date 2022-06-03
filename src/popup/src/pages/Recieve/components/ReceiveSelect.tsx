import NetworkIcons from 'components/primitives/NetworkIcons';
import styled from 'styled-components';
import { Network } from 'utils/types';
import SelectArrowIcon from 'assets/svgComponents/SelectArrowIcon';

type Props = {
  options: string[] | undefined;
  selectedToken: string | undefined;
  setSelectedToken: (token: string) => void;
  selectedNetwork: Network | undefined;
};

export default function Select({ options, selectedToken, selectedNetwork }: Props) {
  const handleChange = async (e: any) => {
    // todo implement
  };

  return (
    <Container>
      <NetworkIcons
        width="28px"
        height="28px"
        fill="#18191A"
        isSmallIcon
        chain={selectedNetwork?.chain as string}
      />
      <StyledSelect
        defaultValue={selectedToken}
        onChange={(e) => handleChange(e)}
        value={selectedToken}
        name="dots"
        id="dots">
        {options &&
          options.map((token) => (
            <StyledOption key={token} value={selectedToken}>
              {token.toUpperCase()} ({selectedNetwork?.chain} Chain)
            </StyledOption>
          ))}
      </StyledSelect>
      <IconContainer>
        <SelectArrowIcon />
      </IconContainer>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 10px;
  background-color: #f3f3f3;
  box-sizing: border-box;
  border-radius: 4px;
  position: relative;
`;

const IconContainer = styled.div`
  position: absolute;
  right: 18px;
  top: 20px;
`;

const StyledSelect = styled.select`
  flex: 1;
  height: 48px;
  border: 0;
  background-color: #f3f3f3;
  font-size: 16px;
  appearance: none;
  font-family: 'Inter';
  font-weight: 400;
  display: flex;
  align-items: center;
  color: #18191a;
  margin-left: 8px;
  text-transform: capitalize;
  &:focus {
    outline: none;
  }
`;

const StyledOption = styled.option``;
