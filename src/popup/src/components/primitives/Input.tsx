import ErrorIcon from 'assets/svgComponents/ErrorIcon';
import styled from 'styled-components/macro';

type InputProps = {
  id: string;
  type: 'text' | 'password' | 'textarea';
  placeholder?: string;
  label?: string;
  value: string;
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
};

export default function Input({
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
  autoFocus
}: InputProps) {
  return (
    <Container marginBottom={marginBottom}>
      <InputContainer
        borderColor={borderColor}
        marginTop={marginTop}
        error={!!touched && !!error}
        bgColor={bgColor}
        height={height}>
        {label && <Label>{label}</Label>}
        {type === 'textarea' ? (
          <StyledTextarea
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            fontSize={fontSize}
            textAlign={textAlign}
            bgColor={bgColor}
            autoFocus={autoFocus}
          />
        ) : (
          <StyledInput
            id={id}
            value={value}
            onChange={onChange}
            type={type}
            autoFocus={autoFocus}
            // placeholder={placeholder}
            fontSize={fontSize}
          />
        )}
      </InputContainer>
      {!!error && !!touched && !hideErrorMsg && (
        <ErrorContainer>
          <ErrorIcon />
          <ErrorMessage>{error}</ErrorMessage>
        </ErrorContainer>
      )}
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
`;

const Label = styled.label`
  width: 100%;
  font-size: 12px;
  color: #afb4c0;
  text-align: left;
`;

const StyledInput = styled.input<{ fontSize?: string }>`
  width: 100%;
  height: 100%;
  border: none;
  font-size: ${({ fontSize }) => (fontSize ? fontSize : '12px')};
  padding: 0;
  appearance: none;
  outline: none;
  &:focus {
    outline: none;
  }
  ::-webkit-input-placeholder {
    white-space: pre-line;
    position: relative;
    top: -7px;
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
  font-family: 'Inter';
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
