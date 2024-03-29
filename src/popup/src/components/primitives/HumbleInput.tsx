import { memo, ReactElement, useCallback, useEffect, useState, useMemo } from 'react';
import styled from 'styled-components/macro';
import { truncateString } from 'utils';
import { AccountMeta } from 'utils/types';
import CopyIcon from 'assets/svgComponents/CopyIcon';
import TextareaAutosize from 'react-textarea-autosize';
import WarningMark from 'assets/svgComponents/WarningMark';

type InputProps = {
  id: string;
  type: 'text' | 'password' | 'textarea';
  placeholder?: string;
  label?: string;
  value: string;
  color?: string;
  // Todo formik doesn't provides types, check for better solution
  onChange?: (e?: any) => void;
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
  fontWeight?: string;
  textAlign?: string;
  bgColor?: string;
  autoFocus?: boolean;
  input?: any;
  padding?: string;
  truncate?: boolean;
  copy?: boolean;
  handleClickCopy?: (value: string) => void;
  rightLabel?: string;
  // todo asap
  Icon?: ReactElement;
  IconAlignment?: 'left' | 'right';
  accountMeta?: AccountMeta;
  readOnly?: boolean;
  meta?: any;
  isPassword?: boolean;
};

function HumbleInput({
  id,
  type,
  placeholder,
  value,
  onChange,
  error,
  errorColor,
  errorBorderColor,
  marginTop,
  marginBottom,
  borderColor = '#f4f4f6',
  height,
  fontSize,
  fontWeight,
  textAlign,
  bgColor,
  autoFocus,
  color,
  input,
  copy,
  touched,
  handleClickCopy,
  showError,
  truncate,
  rightLabel,
  placeholderColor,
  Icon,
  padding,
  IconAlignment,
  accountMeta,
  readOnly,
  meta,
  isPassword
}: InputProps) {
  const [dummyText, setDummyText] = useState<string>('');

  useEffect(() => {
    const changeDummyText = Array(input?.value?.length).fill('*').join('');
    setDummyText(changeDummyText);
  }, [input?.value]);
  // debounce
  const handleValue = (value: string) => {
    if (!value) return '';
    if (truncate) {
      return truncateString(value, 8);
    }
    return value;
  };

  return (
    <Container marginBottom={marginBottom} marginTop={marginTop}>
      <InputContainer
        error={(!touched && !!error) || (meta?.touched && meta?.error)}
        errorBorderColor={errorBorderColor}
        borderColor={borderColor}
        bgColor={bgColor}
        color={color}
        padding={padding}
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
              isPassword={isPassword}
              {...input}
              id={id}
              value={handleValue(value || input?.value)}
              onChange={onChange || input?.onChange}
              type={type}
              placeholder={placeholder}
              fontSize={fontSize}
              fontWeight={fontWeight}
              bgColor={bgColor}
              placeholderColor={placeholderColor}
              autoFocus={!!autoFocus}
              color={color}
              disabled={readOnly}
            />
            {isPassword && <DummyElement>{dummyText}</DummyElement>}
            {IconAlignment === 'right' && Icon && <IconContainer>{Icon}</IconContainer>}
            {copy && handleClickCopy && (
              <Copy onClick={() => handleClickCopy(value || input?.value)}>
                <CopyIcon />
                <Text>Copy</Text>
              </Copy>
            )}
            {rightLabel && <RightLabel>{rightLabel}</RightLabel>}
          </>
        )}
      </InputContainer>

      {(meta?.error || error) && showError && (
        <ErrorContainer>
          <ErrorMessage errorColor={errorColor}>
            {error || (meta?.touched && meta?.error && <WarningMark />)}
            <ErrorText>{error || (meta?.touched && meta?.error)}</ErrorText>
          </ErrorMessage>
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
  padding?: string;
  errorBorderColor?: string;
}>`
  width: 100%;
  height: ${({ height }) => (height ? height : 'auto')};
  display: flex;
  /* display: grid; */
  align-items: center;
  /* flex-direction: column; */
  padding: ${({ padding }) => padding || '8px 8px 5px 16px'};
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
  display: flex;
  align-items: center;
`;

const DummyElement = styled.span`
  position: absolute;
  display: flex;
  align-items: center;
  top: 15px;
  left: 15px;
  max-width: 295px;
  background: transparent;
  font-family: Inter;
  font-size: 16.82px;
  line-height: 1.35;
  color: #fff;
  overflow: hidden;
  z-index: 2;
`;

const StyledInput = styled.input<{
  fontSize?: string;
  bgColor?: string;
  color?: string;
  placeholderColor?: string;
  fontWeight?: string;
  isPassword?: boolean;
}>`
  flex: 1;
  height: 100%;
  border: none;
  font-size: ${({ fontSize }) => (fontSize ? fontSize : '14.8px')};
  padding: 0;
  appearance: none;
  outline: none;
  background-color: ${({ bgColor, isPassword }) =>
    isPassword ? 'transparent' : bgColor || '#fff'};
  color: ${({ color, isPassword }) => (isPassword ? 'transparent' : color || '#111')};
  font-family: Inter;
  font-weight: ${({ fontWeight }) => fontWeight || 400};
  caret-color: ${({ color }) => color || '#111'};
  z-index: 3;
  :-webkit-autofill,
  :-webkit-autofill:hover,
  :-webkit-autofill:focus,
  :-webkit-autofill:active {
    -webkit-box-shadow: ${({ bgColor }) => `0 0 0 30px ${bgColor}` || '0 0 0 30px #303030'} inset !important;
    -webkit-text-fill-color: ${({ color }) => color || '#fff'} !important;
    font-size: ${({ fontSize }) => (fontSize ? fontSize : '14.8px')} !important;
  }
  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${({ placeholderColor }) => placeholderColor || '#111'};
  }
`;

const StyledTextarea = styled(TextareaAutosize)<{
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
  overflow: hidden;

  &::placeholder {
    color: ${({ placeholderColor }) => placeholderColor || '#111'};
  }

  &:after {
    border: 1px solid black;
    padding: 0.5rem;
    font: inherit;

    /* Place on top of each other */
    grid-area: 1 / 1 / 2 / 2;
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
  position: absolute;
  right: 16px;
  z-index: 3;
  border-radius: 5px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 4.5px 12px;
  background-color: #18191a;
  border-radius: 20px;
  z-index: 444;
`;

const Text = styled.p`
  font-family: 'IBMPlexSans';
  font-size: 12px;
  line-height: 1.35;
  display: flex;
  align-items: center;
  text-align: center;
  color: #ffffff;
  margin-left: 4px;
  font-family: 'IBM Plex Sans';

`;

const RightLabel = styled.span`
  position: absolute;
  right: 22px;
  z-index: 3;
  top: 12px;
  color: #777e90;
  font-size: 16px;
  backdrop-filter: blur(16px);
`;

const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 3px;
`;

const ErrorMessage = styled.div<{ errorColor?: string }>`
  display: flex;
  align-items: center;
  color: ${({ errorColor }) => errorColor || '#353945'};
  font-size: 12px;
  margin-left: 2px;
`;

const ErrorText = styled.div`
  margin-left: 4px;
`;
