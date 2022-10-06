import { useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { Field } from "redux-form";
import { parseNumeric } from "utils/validations";
import SelectSmallIcon from "assets/svgComponents/SelectSmallIcon";
import useOnClickOutside from "hooks/useOnClickOutside";
// import debounce from 'lodash.debounce';
import { useEffect } from "react";
import debounce from "lodash.debounce";
import { CurrencyType } from "utils/types";

type Props = {
  Icon: any;
  tokens: string[];
  fiatList: string[];
  value?: string;
  currencyType: CurrencyType;
  onChangeCallback: () => void;
};

export default function TokenAndAmountSelect({
  tokens,
  fiatList,
  Icon,
  value,
  currencyType,
  onChangeCallback,
}: Props) {
  const optionContainerRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useOnClickOutside(optionContainerRef, () => setIsOpen(false));

  const selectOptions = currencyType === CurrencyType.Crypto ? tokens : fiatList;

  const renderSelect = () => {
    return (
      <StyledSelect>
        <StyledOption onClick={() => setIsOpen(true)}>
          {selectOptions[0].toUpperCase()}
          <IconContainer>
            <SelectSmallIcon />
          </IconContainer>
        </StyledOption>
        {selectOptions && isOpen && (
          <OptionContainer ref={optionContainerRef}>
            {selectOptions.map((symbol: string) => (
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
      {/* {value && } */}
      {Icon}
      <Field
        name="amount"
        type="text"
        label="amount"
        component={Input}
        onChangeCallback={onChangeCallback}
      />
      <Field name="token" label="token" component={renderSelect} />
      {/* <IconContainer>
        <SelectSmallIcon />
      </IconContainer> */}
    </Container>
  );
}

const Input = ({ input: { value, onChange }, onChangeCallback }: any) => {
  const changeHandler = (event: any) => {
    onChange(parseNumeric(event.target.value));
  };

  const debouncedChangeHandler = useMemo(() => debounce(changeHandler, 3000), []);

  useEffect(() => {
    return () => {
      // debouncedChangeHandler.cancel();
    };
  }, []);

  return (
    <StyledInput
      type="text"
      isvalue={!value}
      // value={value}
      // onChange={(e) => {
      //   if (parseNumeric(e, e.target.value)) {
      //     onChange(e.target.value);
      //   }
      // }}
      // todo proper typing
      onChange={(e) => {
        // onChange(e);
        onChangeCallback();
        debouncedChangeHandler(e);
      }}
      placeholder="Amount"
      // debounceTimeout={600}
    />
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
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

const StyledInput = styled.input<{ isvalue: boolean }>`
  width: ${({ isvalue }) => (isvalue ? "100%" : "calc(100% - 40px)")};
  padding-right: 12px;
  height: 48px;
  /* margin-left: ${({ isvalue }) => (isvalue ? "2px" : "14px")}; */
  margin-left: 10px;
  border: 0;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  background-color: #f2f2f2;
  font-family: Inter;
  font-size: 16px;
  color: #18191a;
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    appearance: none;
  }

  &::placeholder {
    color: #b1b5c3;
    font-size: 14px;
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
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  &:focus {
    outline: none;
  }
`;

const StyledOption = styled.div`
  display: flex;
  align-items: center;
`;
