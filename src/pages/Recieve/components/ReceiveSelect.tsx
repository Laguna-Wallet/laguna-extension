import { FormikProps } from 'formik/dist/types';
import { SendTokenFormikValues } from 'pages/Send/Send';
import styled from 'styled-components';
import { Asset } from 'utils/types';

type Props = {
  options: Asset[];
};

export default function Select({ options }: Props) {
  const handleChange = (e: any) => {
    const asset = options.find(
      (item) => item.symbol.toLowerCase() === e.target.value.toLowerCase()
    );
  };

  return (
    <Container>
      <StyledSelect
        defaultValue={selectedAsset?.symbol}
        onChange={handleChange}
        name="dots"
        id="dots">
        {options.map((asset) => (
          <StyledOption key={asset.symbol} value={asset.symbol}>
            {asset.symbol.toUpperCase()}
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
  width: 70px;
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
