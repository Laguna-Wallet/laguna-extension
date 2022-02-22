import { FormikProps } from 'formik/dist/types';
import styled from 'styled-components';
import { getApiInstance } from 'utils/polkadot';
import { Asset, Network } from 'utils/types';

type Props = {
  options: string[] | undefined;
  selectedToken: string | undefined;
  setSelectedToken: (token: string) => void;
  selectedNetwork: Network | undefined;
};

export default function Select({
  options,
  selectedToken,
  setSelectedToken,
  selectedNetwork
}: Props) {
  const handleChange = async (e: any) => {
    // todo implement
  };

  return (
    <Container>
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
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  display: flex;
  margin-top: 5px;
  padding: 0 10px;
  background-color: #f3f3f3;
  box-sizing: border-box;
`;

const StyledSelect = styled.select`
  width: 100%;
  height: 53px;
  border: 0;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  background-color: #f3f3f3;
  font-size: 16px;
  font-weight: 600;
  color: #141414;
  font-family: 'SFCompactDisplayRegular';

  &:focus {
    outline: none;
  }
`;

const StyledOption = styled.option``;
