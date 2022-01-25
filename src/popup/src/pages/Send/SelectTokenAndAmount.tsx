import { FormikProps } from 'formik/dist/types';
import { SendTokenFormikValues } from 'pages/Send/Send';
import styled from 'styled-components';
import { Asset } from 'utils/types';

type Props = {
  options: string[];
  token: string;
  onChangeToken: (token: string) => void;
  amount: string;
  onChangeAmount: (amount: string) => void;
  defaultValue: string;
};

export default function SelectTokenAndMount({
  amount,
  onChangeAmount,
  token,
  onChangeToken,
  options,
  defaultValue
}: Props) {
  const handleChange = (e: any) => {
    onChangeToken(e.target.value);
  };

  return (
    <Container>
      <StyledInput
        value={amount}
        onChange={(e) => onChangeAmount(e.target.value)}
        placeholder="Enter Amount"
      />
      <StyledSelect defaultValue={defaultValue} onChange={handleChange} name="dots" id="dots">
        {options.map((symbol) => (
          <StyledOption key={symbol} value={symbol}>
            {symbol.toUpperCase()}
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

const StyledInput = styled.input`
  width: 100%;
  height: 53px;
  border: 0;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  background-color: #f3f3f3;
  color: #898989;
  font-family: 'SFCompactDisplayRegular';
  font-size: 16px;

  &:focus {
    outline: none;
  }
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
