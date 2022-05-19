import styled from 'styled-components';
import { Field } from 'redux-form';
import { parseNumeric } from 'utils/validations';
import SelectSmallIcon from 'assets/svgComponents/SelectSmallIcon';

type Props = {
  Icon: any;
  tokens: string[];
  value?: string;
};

export default function TokenAndAmountSelect({ tokens, Icon, value }: Props) {
  return (
    <Container>
      {value && Icon}
      <Field name="amount" type="text" label="amount" component={Input} />
      <Field name="token" label="token" options={tokens} component={renderSelect} />
      <IconContainer>
        <SelectSmallIcon />
      </IconContainer>
    </Container>
  );
}

const renderSelect = (props: any) => {
  return (
    <StyledSelect
      name={props?.input?.name}
      value={props?.input?.value || props.options[0]}
      onChange={props?.input?.onChange}
      onBlur={() => props?.input?.onBlur(props?.input?.value)}>
      {props?.options &&
        props?.options.map((symbol: string) => (
          <StyledOption key={symbol} value={symbol}>
            {symbol.toUpperCase()}
          </StyledOption>
        ))}
    </StyledSelect>
  );
};

const Input = ({ input: { value, onChange } }: any) => (
  <StyledInput
    isValue={!value}
    value={value}
    onChange={(e) => onChange(parseNumeric(e.target.value))}
    placeholder="Enter Amount"
  />
);

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin-top: 8px;
  padding: 0 20px 0 14px;
  border-radius: 5px;
  background-color: #f2f2f2;
  box-sizing: border-box;
  position: relative;

  svg {
    min-width: 28px;
    min-height: 28px;
  }
`;

const IconContainer = styled.div`
  position: absolute;
  right: 20px;
  top: 16px;

  svg {
    min-width: auto;
    min-height: auto;
  }
`;

const StyledInput = styled.input<{ isValue: boolean }>`
  flex: 1;
  height: 48px;
  margin-left: ${({ isValue }) => (isValue ? '2px' : '14px')};
  border: 0;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  background-color: #f2f2f2;
  color: #b1b5c3;
  font-family: Inter;
  font-size: 16px;
  color: #18191a;

  &::placeholder {
    color: #b1b5c3;
  }

  &:focus {
    outline: none;
  }
`;

const StyledSelect = styled.select`
  min-width: 56px;
  height: 48px;
  border: 0;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  background-color: #f3f3f3;
  font-family: Inter;
  font-size: 16px;
  font-weight: 600;
  color: #18191a;
  appearance: none;
  padding-right: 22px;


  &:focus {
    outline: none;
  }
`;

const StyledOption = styled.option``;
