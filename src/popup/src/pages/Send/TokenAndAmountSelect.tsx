import { FormikProps } from 'formik/dist/types';
import { Field } from 'redux-form';
import styled from 'styled-components';
import { Asset } from 'utils/types';

type Props = {
  tokens: string[];
};

export default function TokenAndAmountSelect({ tokens }: Props) {
  return (
    <Container>
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
  <StyledInput value={value} onChange={onChange} placeholder="Enter Amount" />
);

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
