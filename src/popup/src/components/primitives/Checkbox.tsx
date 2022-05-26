import CheckBoxCheckMarkIcon from 'assets/svgComponents/CheckboxCheckmarkIcon';
import styled from 'styled-components';

type Props = {
  value: any;
  onChange: (value: any) => void;
};

export default function Checkbox({ value, onChange }: Props) {
  return (
    <Container>
      {/* <Input value={value} onChange={() => onChange(!value)} type="checkbox" /> */}
      <CheckboxContainer onClick={() => onChange(!value)}>
        {value && <CheckBoxCheckMarkIcon />}
      </CheckboxContainer>
    </Container>
  );
}

const Container = styled.div`
  /* width: 24px;
  height: 24px;
  background-color: #111; */
`;

const CheckboxContainer = styled.div`
  width: 15px;
  height: 15px;
  background-color: #111;
  border-radius: 3px;
  margin-top: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Input = styled.input`
  accent-color: #111;
  border-radius: 3px;
  outline: none;
  height: 15px; /* not needed */
  width: 15px; /* not needed */
  background-color: #111;
  color: #111;
  &:checked:before {
    background-color: green;
  }

  &:focus {
    color: #111;
    background-color: #111;
    outline: 0;
  }
  &:focus label::before {
    outline: none;
  }
  &:checked {
    color: #111;
  }
`;
