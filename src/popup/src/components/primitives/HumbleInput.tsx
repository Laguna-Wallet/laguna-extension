import ErrorIcon from 'assets/svgComponents/ErrorIcon';
import { useRef } from 'react';
import styled from 'styled-components/macro';
import { truncateString } from 'utils';

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
  touched?: boolean | undefined;
  borderColor?: string;
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
  rightLabel?: string;
};

export default function HumbleInput({
  id,
  type,
  placeholder,
  label,
  value,
  onChange,
  error,
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
  truncate,
  rightLabel
}: InputProps) {
  const handleValue = (value: string) => {
    if (!value) return '';
    if (truncate) {
      return truncateString(value, 9);
    }
    return value;
  };

  return (
    <Container marginBottom={marginBottom}>
      <InputContainer
        borderColor={borderColor}
        marginTop={marginTop}
        error={!!touched && !!error}
        bgColor={bgColor}
        color={color}
        height={height}>
        {type === 'textarea' ? (
          <StyledTextarea
            id={id}
            value={value || input?.value}
            onChange={onChange || input?.onChange}
            placeholder={placeholder}
            fontSize={fontSize}
            textAlign={textAlign}
            bgColor={bgColor}
            color={color}
          />
        ) : (
          <>
            <StyledInput
              id={id}
              value={handleValue(value || input?.value)}
              onChange={onChange || input?.onChange}
              type={type}
              placeholder={placeholder}
              fontSize={fontSize}
              bgColor={bgColor}
              autoFocus={!!autoFocus}
              color={color}
            />
            {copy && (
              <Copy
                onClick={() => {
                  navigator.clipboard.writeText(value || input?.value);
                }}>
                Copy
              </Copy>
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
    </Container>
  );
}

const Container = styled.div<{ marginBottom?: string }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: ${({ marginBottom }) => marginBottom || '0px'};
`;

const InputContainer = styled.div<{
  borderColor?: string;
  marginTop?: string;
  error: boolean;
  height?: string;
  bgColor?: string;
}>`
  width: 100%;
  height: ${({ height }) => (height ? height : 'auto')};
  display: flex;
  flex-direction: column;
  padding: 8px 8px 5px 16px;
  box-sizing: border-box;
  border: 1px solid;
  border-color: ${({ error, borderColor }) => (error ? '#F05353' : borderColor)};
  border-radius: 5px;
  background-color: ${({ bgColor }) => bgColor || '#fff'};
  margin-top: ${({ marginTop }) => marginTop || marginTop};
  position: relative;
`;

const StyledInput = styled.input<{ fontSize?: string; bgColor?: string; color?: string }>`
  width: 100%;
  height: 100%;
  border: none;
  font-size: ${({ fontSize }) => (fontSize ? fontSize : '14px')};
  padding: 0;
  appearance: none;
  outline: none;
  background-color: ${({ bgColor }) => (bgColor ? bgColor : '#fff')};
  color: ${({ color }) => (color ? color : '#111')};

  &:focus {
    outline: none;
  }
`;

const StyledTextarea = styled.textarea<{
  fontSize?: string;
  textAlign?: string;
  bgColor?: string;
}>`
  width: 100%;
  height: 100%;
  border: none;
  font-size: ${({ fontSize }) => (fontSize ? fontSize : '12px')};
  text-align: ${({ textAlign }) => (textAlign ? textAlign : 'left')};
  background-color: ${({ bgColor }) => bgColor || '#fff'};
  padding: 0;
  appearance: none;
  outline: none;
  resize: none;
  font-size: 20px;
  font-family: 'SFCompactDisplayRegular';
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
  font-family: 'SFCompactDisplayRegular';
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

const ErrorMessage = styled.div`
  color: #fb5a5a;
  font-size: 12px;
  margin-left: 5px;
`;
