import styled from 'styled-components';

type Props = {
  value: any;
  onChange: (value: any) => void;
};

export default function Checkbox({ value, onChange }: Props) {
  return (
    <Container>
      <Input value={value} onChange={() => onChange(!value)} type="checkbox" />
    </Container>
  );
}

const Container = styled.div`
  /* width: 24px;
  height: 24px;
  background-color: #111; */
`;

const Input = styled.input`
  accent-color: #111;
  border-radius: 3px;
  outline: none;
  height: 15px; /* not needed */
  width: 15px; /* not needed */

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
