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
  color?: string;
  borderColor?: string;
  margin?: string;
  fontFamily?: string;
  fontSize?: string;
  boxShadow?: string;
};

export default function Button({ Icon, text, bgColor = '#111', ...rest }: Props) {
  return (
    <StyledButton {...rest} bgColor={bgColor}>
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
  borderColor?: string;
  margin?: string;
  fontFamily?: string;
  fontSize?: string;
  width?: string;
  boxShadow?: string;
}>`
  width: ${({ width }) => width || '100%'};
  display: flex;
  flex-direction: ${({ direction }) => direction || 'row'};
  justify-content: ${({ justify }) => justify || 'space-between'};
  align-items: center;
  font-family: ${({ fontFamily }) => fontFamily || 'Inter'};
  font-size: ${({ fontSize }) => fontSize || '14px'};
  font-weight: 500;
  height: 46px;
  margin-top: 20px;
  padding: 0 14px;
  border-radius: 4px;
  background-image: ${({ bgImage }) => bgImage};
  background-color: ${({ disabled, bgColor }) => (disabled ? '#adadad' : bgColor)};
  box-shadow: ${({ boxShadow }) => boxShadow || 'none'};
  /* 0 4px 33px 0 rgba(30, 35, 53, 0.15); */
  /* pointer-events: ${({ disabled }) => (disabled ? 'none' : 'initial')}; */
  color: ${({ color }) => (color ? color : '#fff')};
  border: 1px solid;
  border-color: ${({ disabled, borderColor }) => (disabled ? '#adadad' : borderColor)};
  margin: ${({ margin }) => margin};
  cursor: pointer;
`;

const Text = styled.div`
  margin: 0 5px;
`;
