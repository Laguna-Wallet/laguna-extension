import { useEffect, useRef, useState } from 'react';
import { ArrowSmRightIcon } from '@heroicons/react/outline';
import { Settings } from 'react-slick';
import Slider from 'components/Slider/Slider';
import { Link } from 'react-router-dom';
import Button from 'components/primitives/Button';
import SignUp from 'pages/SignUp/SignUp';
import { PageContainer } from 'components/ui';
import { saveToStorage } from 'utils/chrome';
import RightArrow from 'assets/svgComponents/RightArrow';
import styled from 'styled-components';
import { router } from 'router/router';

export default function ProductIntro() {
  const [activeIndex, setIndex] = useState<number>(0);

  const sliderSettings: Settings = {
    autoplay: true,
    autoplaySpeed: 2000,
    appendDots: (dots: JSX.Element[]) => {
      return (
        <div>
          <Menu>
            {dots.map((item, index) => {
              return (
                <MenuItem onClick={() => setIndex(index)} key={index}>
                  {item.props.children}
                </MenuItem>
              );
            })}
          </Menu>
        </div>
      );
    },
    customPaging: (index: number) => {
      return <PagingItem active={index === activeIndex}>.</PagingItem>;
    },
    beforeChange: (prev, next) => {
      setIndex((prev) => next);
    }
  };

  const handleClick = () => {
    saveToStorage({ key: 'user-intro', value: 'true' });
  };

  return (
    <PageContainer paddingTop={'90px'}>
      <Slider settings={sliderSettings}>
        <SliderItem>
          <SliderContent>
            <IconContainer></IconContainer>
            <Text>Ultra Stable. Ultra Safe.</Text>
          </SliderContent>
        </SliderItem>
        <SliderItem>
          <SliderContent>
            <IconContainer></IconContainer>
            <Text>Build Your Wealth</Text>
          </SliderContent>
        </SliderItem>
        <SliderItem>
          <SliderContent>
            <IconContainer></IconContainer>
            <Text>Open Source</Text>
          </SliderContent>
        </SliderItem>
        <SliderItem>
          <SliderContent>
            <IconContainer></IconContainer>
            <Text>Stake & Earn %</Text>
          </SliderContent>
        </SliderItem>
      </Slider>

      <MainSection>
        <Title>HydroX</Title>
        <Description>The future of Banking</Description>
        {/* todo button separate shared component */}
        <StyledLink to={router.signUp}>
          <Button onClick={handleClick} Icon={<RightArrow width={23} />} text={'Get Started'} />
        </StyledLink>
      </MainSection>
    </PageContainer>
  );
}

const SliderItem = styled.div`
  width: 100%;
`;

const SliderContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const IconContainer = styled.div`
  width: 192px;
  height: 192px;
  border-radius: 100%;
  background-color: #ccc;
`;

const Text = styled.span`
  font-family: 'Inter', fantasy;
  font-size: 24px;
  font-weight: 600;
  color: #313131;
  margin-top: 60px;
`;

const MainSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Title = styled.div`
  font-family: 'Inter', fantasy;
  font-weight: 600;
  font-size: 24px;
  color: #313131;
`;

const Description = styled.div`
  margin-top: 5px;
  font-size: 14px;
  font-family: 'Inter', fantasy;
  color: #313131;
  opacity: 0.7;
`;

const StyledLink = styled(Link)`
  width: 100%;
  text-decoration: none;
`;

const Menu = styled.div`
  display: flex;
  position: absolute;
  left: 50%;
  transform: translate(-50%);
  font-size: 110px;
  top: -188px;
  /* absolute left-2/4 transform -translate-x-1/2	-top-36 */
`;

const MenuItem = styled.div<{ active?: boolean }>`
  /* width: 50px;
  height: 50px; */
  cursor: pointer;
`;

const PagingItem = styled.div<{ active?: boolean }>`
  cursor: pointer;
  color: ${({ active }) => (active ? '#111' : '#DFDFDF')};
`;
