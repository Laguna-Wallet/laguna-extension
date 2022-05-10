import { memo, useRef } from 'react';
import styled from 'styled-components/macro';
import { truncateString } from 'utils';
import { AccountMeta } from 'utils/types';

type InputProps = {
  id: string;
  type: 'text' | 'password' | 'textarea';
  placeholder?: string;
  label?: string;
  value: string;
  color?: string;
  // Todo formik doesn't provides types, check for better solution
  onChange: any;
  error?: string | undefined;
  errorColor?: string;
  errorBorderColor?: string;
  showError?: boolean;
  touched?: boolean | undefined;
  borderColor?: string;
  placeholderColor?: string;
  height?: string;
  marginTop?: string;
  marginBottom?: string;
  fontSize?: string;
  textAlign?: string;
  bgColor?: string;
  hideErrorMsg?: boolean;
  autoFocus?: boolean;
  input?: any;
  truncate?: boolean;
  copy?: boolean;
  handleClickCopy?: (value: string) => void;
  rightLabel?: string;
  // todo asap
  Icon?: any;
  IconAlignment?: 'left' | 'right';
  accountMeta?: AccountMeta;
  readOnly?: boolean;
};

function HumbleInput({
  id,
  type,
  placeholder,
  label,
  value,
  onChange,
  error,
  errorColor,
  errorBorderColor,
  touched,
  marginTop,
  marginBottom,
  borderColor = '#f4f4f6',
  height,
  fontSize,
  textAlign,
  bgColor,
  hideErrorMsg,
  autoFocus,
  color,
  input,
  copy,
  handleClickCopy,
  showError,
  truncate,
  rightLabel,
  placeholderColor,
  Icon,
  IconAlignment,
  accountMeta,
  readOnly
}: InputProps) {
  const handleValue = (value: string) => {
    if (!value) return '';
    if (truncate) {
      return truncateString(value, 5);
    }
    return value;
  };

  return (
    <Container marginBottom={marginBottom} marginTop={marginTop}>
      <InputContainer
        error={!touched && !!error}
        errorBorderColor={errorBorderColor}
        borderColor={borderColor}
        bgColor={bgColor}
        color={color}
        height={height}>
        {IconAlignment === 'left' && Icon && <IconContainer>{Icon}</IconContainer>}
        {type === 'textarea' ? (
          <StyledTextarea
            id={id}
            value={value || input?.value}
            onChange={onChange || input?.onChange}
            placeholder={placeholder}
            fontSize={fontSize}
            placeholderColor={placeholderColor}
            textAlign={textAlign}
            bgColor={bgColor}
            color={color}
          />
        ) : (
          <>
            {IconAlignment === 'left' && accountMeta && <AccountAvatar img={accountMeta.img} />}
            <StyledInput
              id={id}
              value={handleValue(value || input?.value)}
              onChange={onChange || input?.onChange}
              type={type}
              placeholder={placeholder}
              fontSize={fontSize}
              bgColor={bgColor}
              placeholderColor={placeholderColor}
              autoFocus={!!autoFocus}
              color={color}
              disabled={readOnly}
            />
            {IconAlignment === 'right' && Icon && <IconContainer>{Icon}</IconContainer>}
            {copy && handleClickCopy && (
              <Copy onClick={() => handleClickCopy(value || input?.value)}>Copy</Copy>
            )}
            {rightLabel && <RightLabel>{rightLabel}</RightLabel>}

            {/* </Paste> */}
            {/* <Paste
              onClick={async () => {
                try {
                  const text = await navigator.clipboard.readText();
                  console.log('~ text', text);
                } catch (err) {
                  console.log('err', err);
                }
              }}>
              Paste
            </Paste> */}
          </>
        )}
      </InputContainer>

      {error && showError && (
        <ErrorContainer>
          <ErrorMessage errorColor={errorColor}>{error}</ErrorMessage>
        </ErrorContainer>
      )}
    </Container>
  );
}

export default memo(HumbleInput);

const Container = styled.div<{ marginBottom?: string; marginTop?: string }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: ${({ marginBottom }) => marginBottom || '0px'};
  margin-top: ${({ marginTop }) => marginTop};
`;

const InputContainer = styled.div<{
  borderColor?: string;
  error: boolean;
  height?: string;
  bgColor?: string;
  errorBorderColor?: string;
}>`
  width: 100%;
  height: ${({ height }) => (height ? height : 'auto')};
  display: flex;
  align-items: center;
  /* flex-direction: column; */
  padding: 8px 8px 5px 16px;
  box-sizing: border-box;
  border: 1px solid;
  border-color: ${({ error, borderColor, errorBorderColor }) =>
    error && errorBorderColor ? errorBorderColor : borderColor};
  border-radius: 5px;
  background-color: ${({ bgColor }) => bgColor || '#fff'};
  position: relative;
`;

const IconContainer = styled.div`
  margin-right: 5px;
`;

const StyledInput = styled.input<{
  fontSize?: string;
  bgColor?: string;
  color?: string;
  placeholderColor?: string;
  fontWeight?: string;
}>`
  flex: 1;
  height: 100%;
  border: none;
  font-size: ${({ fontSize }) => (fontSize ? fontSize : '14.8px')};
  padding: 0;
  appearance: none;
  outline: none;
  background-color: ${({ bgColor }) => (bgColor ? bgColor : '#fff')};
  color: ${({ color }) => (color ? color : '#111')};
  font-family: Inter;
  font-weight: ${({ fontWeight }) => fontWeight || 400};
  :-webkit-autofill,
  :-webkit-autofill:hover, 
  :-webkit-autofill:focus, 
  :-webkit-autofill:active{
    -webkit-box-shadow: 0 0 0 30px #303030 inset !important;
    -webkit-text-fill-color: #fff !important;
    font-size: ${({ fontSize }) => (fontSize ? fontSize : '14.8px')} !important;
}
  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${({ placeholderColor }) => placeholderColor || '#111'};
  }
`;

const StyledTextarea = styled.textarea<{
  fontSize?: string;
  bgColor?: string;
  color?: string;
  placeholderColor?: string;
  fontWeight?: string;
  textAlign?: string;
}>`
  width: 100%;
  height: 100%;
  border: none;
  color: ${({ color }) => (color ? color : '#111')};
  font-size: ${({ fontSize }) => (fontSize ? fontSize : '20px')};
  font-weight: ${({ fontWeight }) => fontWeight || 400};
  text-align: ${({ textAlign }) => (textAlign ? textAlign : 'left')};
  background-color: ${({ bgColor }) => bgColor || '#fff'};
  padding: 0;
  appearance: none;
  outline: none;
  resize: none;
  font-family: Inter;

  &::placeholder {
    color: ${({ placeholderColor }) => placeholderColor || '#111'};
  }
`;

const AccountAvatar = styled.div<{ img: string }>`
  width: 24px;
  height: 24px;
  border-radius: 100%;
  background-color: #ccc;
  background-image: ${({ img }) => `url(${img})`};
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  margin-right: 5px;
`;

const Paste = styled.div``;

const Copy = styled.div`
  width: 95px;
  height: 30px;
  background-image: linear-gradient(to right, #1cc3ce, #b9e260);
  position: absolute;
  right: 10px;
  border-radius: 5px;
  color: #fff;
  font-size: 16px;
  font-family: Inter;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const RightLabel = styled.span`
  position: absolute;
  right: 10px;
  top: 12px;
  color: #828282;
  font-size: 16px;
`;

const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 3px;
`;

const ErrorMessage = styled.div<{ errorColor?: string }>`
  color: ${({ errorColor }) => errorColor || '#353945'};
  font-size: 12px;
  margin-left: 16px;
`;
