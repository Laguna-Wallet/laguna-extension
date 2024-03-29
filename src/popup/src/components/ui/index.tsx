import styled from 'styled-components';

export const PageContainer = styled.div<{
  paddingTop?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
  bgColor?: string;
  bgImage?: string;
}>`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-top: ${({ paddingTop }) => paddingTop || '10px'};
  padding-bottom: ${({ paddingBottom }) => paddingBottom || '20px'};
  padding-left: ${({ paddingLeft }) => paddingLeft || '26px'};
  padding-right: ${({ paddingRight }) => paddingRight || '26px'};
  box-sizing: border-box;
  background-color: ${({ bgColor }) => bgColor || '#f8f8f8'};
  background-image: ${({ bgImage }) => `url(${bgImage})` || 'none'};
`;
