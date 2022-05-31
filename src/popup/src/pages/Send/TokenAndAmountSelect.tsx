import styled from 'styled-components';
import { Field } from 'redux-form';
import { parseNumeric } from 'utils/validations';
import SelectSmallIcon from 'assets/svgComponents/SelectSmallIcon';
import { useRef, useState } from 'react';
import useOnClickOutside from 'hooks/useOnClickOutside';

type Props = {
  Icon: any;
  tokens: string[];
  value?: string;
};

export default function TokenAndAmountSelect({ tokens, Icon, value }: Props) {
  const optionContainerRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useOnClickOutside(optionContainerRef, () => setIsOpen(false));

  const renderSelect = () => {
    return (
      <StyledSelect>
        <StyledOption onClick={() => setIsOpen(true)}>
          {tokens[0].toUpperCase()}
          <IconContainer>
            <SelectSmallIcon />
          </IconContainer>
        </StyledOption>
        {tokens && isOpen && (
          <OptionContainer ref={optionContainerRef}>
            {tokens.map((symbol: string) => (
              <StyledOption key={symbol} onClick={() => setIsOpen(false)}>
                {/* {symbol.toUpperCase()} */}
              </StyledOption>
            ))}
          </OptionContainer>
        )}
      </StyledSelect>
    );
  };

  return (
    <Container>
      {value && Icon}
      <Field name="amount" type="text" label="amount" component={Input} />
      <Field name="token" label="token" component={renderSelect} />
      {/* <IconContainer>
        <SelectSmallIcon />
      </IconContainer> */}
    </Container>
  );
}

const Input = ({ input: { value, onChange } }: any) => (
  <StyledInput
    type="number"
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
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    margin-left: 9px;

    min-width: 13px;
    min-height: 8px;
  }
`;

const OptionContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 8px;
  border-radius: 4px;
  box-shadow: 0 4px 33px 0 rgba(30, 35, 53, 0.15);
  position: absolute;
  width: 40px;
  top: 38px;
  z-index: 5;
  background-color: rgba(30, 35, 53, 0.15);
  color: #fff;
`;

const StyledInput = styled.input<{ isValue: boolean }>`
  width: ${({ isValue }) => (isValue ? '100%' : 'calc(100% - 40px)')};
  padding-right: 12px;
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

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    appearance: none;
  }

  &::placeholder {
    color: #b1b5c3;
  }

  &:focus {
    outline: none;
  }
`;

const StyledSelect = styled.div`
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
  position: relative;
  display:flex
  align-items: center;
  flex-direction: column;
  
  &:focus {
    outline: none;
  }
`;

const StyledOption = styled.div`
  display: flex;
  align-items: center;
`;
