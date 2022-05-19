import styled from 'styled-components';

type Props = {
  onClick?: (e?: any) => void;
  //todo proper typing
  width?: string;
  Icon?: any;
  text: string;
  bgColor?: string;
  bgImage?: string;
  textColor?: string;
  justify?: string;
  direction?: string;
  type?: 'button' | 'submit' | 'reset' | undefined;
  disabled?: boolean;
  falseDisable?: boolean;
  color?: string;
  borderColor?: string;
  margin?: string;
  marginText?: string;
  fontFamily?: string;
  fontSize?: string;
  boxShadow?: string;
  disabledBgColor?: string;
  fontWeight?: string;
};

export default function Button({ Icon, text, bgColor = '#111', ...rest }: Props) {
  return (
    <StyledButton bgColor={bgColor} {...rest}>
      <Text>{text}</Text>
      {Icon && Icon}
    </StyledButton>
  );
}

const StyledButton = styled.button<{
  justify?: string;
  direction?: string;
  bgColor?: string;
  bgImage?: string;
  disabled?: boolean;
  falseDisable?: boolean;
  borderColor?: string;
  margin?: string;
  fontFamily?: string;
  fontSize?: string;
  width?: string;
  boxShadow?: string;
  disabledBgColor?: string;
  fontWeight?: string;
}>`
  width: ${({ width }) => width || '100%'};
  display: flex;
  flex-direction: ${({ direction }) => direction || 'row'};
  justify-content: ${({ justify }) => justify || 'space-between'};
  align-items: center;
  font-family: ${({ fontFamily }) => fontFamily || 'Inter'};
  font-size: ${({ fontSize }) => fontSize || '14px'};
  font-weight: 500;
  height: 45px;
  margin-top: 20px;
  padding: 0 14px;
  box-sizing: border-box;
  border-radius: 4px;
  background-image: ${({ bgImage }) => bgImage};
  background-color: ${({ disabled, falseDisable, bgColor, disabledBgColor }) =>
    disabled || falseDisable ? disabledBgColor || 'rgba(24, 25, 26, 0.25)' : bgColor};
  box-shadow: ${({ boxShadow }) => boxShadow || 'none'};
  color: ${({ color }) => (color ? color : '#fff')};
  border: 1px solid;
  border-color: ${({ disabled, falseDisable, borderColor }) =>
    disabled || falseDisable ? 'transparent' : borderColor};
  margin: ${({ margin }) => margin};
  // cursor: ${({ disabled, falseDisable }) => (disabled || falseDisable ? 'default' : 'pointer')};
  font-weight: ${({ fontWeight }) => fontWeight || '500'};
`;

const Text = styled.span<{
  marginText?: string;
}>`
  margin: ${({ marginText }) => marginText || '0 5px'};
`;
