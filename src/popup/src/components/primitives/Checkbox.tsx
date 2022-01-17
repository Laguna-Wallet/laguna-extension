import styled from 'styled-components';

export default function Checkbox() {
  return (
    <Container>
      <Input type="checkbox" />
    </Container>
  );
}

const Container = styled.div`
  /* width: 24px;
  height: 24px;
  background-color: #111; */
`;

const Input = styled.input`
  background-color: #111;
  border-radius: 3px;
  outline: none;
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
