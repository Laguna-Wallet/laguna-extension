import { ArrowSmRightIcon } from '@heroicons/react/outline';
import ButtonsIcon from 'assets/svgComponents/ButtonsIcon';
import Dnd from 'components/Dnd/Dnd';
import Button from 'components/primitives/Button';
import Input from 'components/primitives/Input';
import { useFormik } from 'formik';
import { useWizard } from 'react-use-wizard';
import styled from 'styled-components';
import { importJson, seedValidate } from 'utils/polkadot';
import { KeyringPair$Json } from '@polkadot/keyring/types';
import { KeyringPairs$Json } from '@polkadot/ui-keyring/types';
import { useState } from 'react';
import RightArrow from 'assets/svgComponents/RightArrow';

export default function ImportFromJson() {
  const { nextStep } = useWizard();
  const [file, setFile] = useState<KeyringPair$Json | KeyringPairs$Json>();

  const formik = useFormik({
    initialValues: {
      password: ''
    },
    // validationSchema: welcomeBackSchema,
    onSubmit: async ({ password }) => {
      await importJson(file, password);
      nextStep();
    }
  });

  return (
    <Container>
      <Form onSubmit={formik.handleSubmit}>
        <Dnd setFile={setFile} />

        <Input
          id="password"
          type="password"
          value={formik.values['password']}
          onChange={formik.handleChange}
          error={formik.errors['password']}
          touched={formik.touched['password']}
          height="50px"
          borderColor="#ccc"
          label="Password for json"
        />

        <Button type="submit" text="import" Icon={<RightArrow width={23} fill="#fff" />} />

        {/* <Input /> */}
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
