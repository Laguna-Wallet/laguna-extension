import styled from "styled-components";

const InactiveField = () => {
  return (
    <EmptyContent>
      <Title>No activity yet</Title>
      <Text>Stay tuned! Notifications about your activity will appear here.</Text>
    </EmptyContent>
  );
};

const EmptyContent = styled.div`
  height: calc(100% - 56px);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 44px;
  justify-content: center;
`;

const Title = styled.h2`
  font-family: "IBM Plex Sans";
  font-weight: 500;
  font-size: 22px;
  line-height: 40px;
  text-align: center;
  color: #777e91;
`;

const Text = styled.p`
  font-family: "Inter";
  font-weight: 400;
  font-size: 14px;
  line-height: 135%;
  color: #777e91;
  margin-top: 12px;
  max-width: 259px;
  text-align: center;
  width: 100%;
`;

export default InactiveField;
