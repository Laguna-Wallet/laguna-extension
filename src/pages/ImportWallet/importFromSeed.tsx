import ButtonsIcon from 'assets/svgComponents/ButtonsIcon';
import RightArrow from 'assets/svgComponents/RightArrow';
import Button from 'components/primitives/Button';
import Input from 'components/primitives/Input';
import { useFormik } from 'formik';
import { useWizard } from 'react-use-wizard';
import styled from 'styled-components';
import { seedValidate } from 'utils/polkadot';

export default function ImportFromSeed() {
  const { nextStep } = useWizard();

  const formik = useFormik({
    initialValues: {
      seedPhase: ''
    },
    // validationSchema: welcomeBackSchema,
    onSubmit: async ({ seedPhase }) => {
      const data = await seedValidate(seedPhase, 'ed25519');
      nextStep();
    }
  });

  return (
    <Container>
      <Form onSubmit={formik.handleSubmit}>
        <Input
          type="textarea"
          id="seedPhase"
          placeholder="Enter your 12 or 24 word mnemonic seed phrase, raw private key or Polkadot address (watch only)..."
          onChange={formik.handleChange}
          value={formik.values['seedPhase']}
          height={'120px'}
          fontSize="20px"
        />
        <HelpButton>
          <ButtonsIcon fill="#111" />
          <span>Help</span>
        </HelpButton>
        <Button type="submit" text="import" Icon={<RightArrow width={23} fill="#fff" />} />
      </Form>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  margin-top: 24px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const Form = styled.form``;

const HelpButton = styled.div`
  width: 70px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: auto;
  margin-top: 5px;
  border-radius: 20px;
  background-color: #eeeeee;
  color: #111;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;

  span {
    margin-left: 5px;
  }
`;
