import NetworkIcons from 'components/primitives/NetworkIcons';
import { Field } from 'redux-form';
import styled from 'styled-components';
import { parseNumeric } from 'utils/validations';

type Props = {
  tokens: string[];
  Icon: any;
};

export default function TokenAndAmountSelect({ tokens, Icon }: Props) {
  return (
    <Container>
      {Icon}
      <Field name="amount" type="text" label="amount" component={Input} />
      <Field name="token" label="token" options={tokens} component={renderSelect} />
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
    // <StyledSelect
    //   {...props.input}
    //   onBlur={() => {
    //     props.input.onBlur(props.input.value);
    //   }}
    //   options={props.options}
    //   placeholder={props.label}
    //   resetValue={props.meta.initial}
    //   simpleValue
    // />
  );
};

const Input = ({ input: { value, onChange } }: any) => (
  <StyledInput
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
  padding: 0 10px;
  border-radius: 5px;
  background-color: #f2f2f2;
  box-sizing: border-box;
`;

const StyledInput = styled.input`
  flex: 1;
  height: 48px;
  margin-left: 4px;
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
  width: 70px;
  height: 48px;
  border: 0;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  background-color: #f3f3f3;
  font-family: Inter;
  font-size: 16px;
  font-weight: 600;
  color: #18191a;

  &:focus {
    outline: none;
  }
`;

const StyledOption = styled.option``;
