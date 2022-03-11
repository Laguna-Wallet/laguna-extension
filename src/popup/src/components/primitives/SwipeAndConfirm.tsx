import styled from 'styled-components';
import { useSwipeable } from 'react-swipeable';
import { useEffect, useRef, useState } from 'react';
import RightArrow from 'assets/svgComponents/RightArrow';
import { useMousePosition } from 'hooks/useMousePosition';
import Bg from '../../assets/imgs/SwipeAndConfirmBg.png';

type Props = {
  handleConfirm: () => void;
  loading: boolean;
  confirmed: boolean;
};

export default function SwipeAndConfirm({ handleConfirm, loading, confirmed }: Props) {
  const [width, setWidth] = useState<number>(56);
  const [isDragging, setIsDragging] = useState(false);
  const position = useMousePosition();

  // const [confirmed, setConfirmed] = useState(false);
  // const [confirming, setConfirming] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const swipeItemRef = useRef<HTMLDivElement>(null);
  const swipeToItemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef?.current?.offsetLeft) {
      const mousePosInsideContainer: number = position.x - containerRef?.current?.offsetLeft + 15;

      if (isDragging) {
        setWidth(mousePosInsideContainer);
      } else {
        setWidth(56);
      }
    }
  }, [position.x, isDragging]);

  useEffect(() => {
    if (loading || confirmed) return;

    async function go() {
      if (
        swipeToItemRef.current?.getBoundingClientRect().right ===
        swipeItemRef.current?.getBoundingClientRect().right
      ) {
        // setConfirming(true);
        await handleConfirm();
        // setConfirmed(true);
      }
    }

    go();
  }, [position.x]);

  const handleConfirmStatus = (confirmed: boolean, loading: boolean) => {
    if (confirmed) return <span style={{ color: '#fff' }}>Confirmed</span>;
    if (loading) return <span style={{ color: '#fff' }}>Confirming...</span>;

    return (
      <>
        Slide to Confirm <RightArrow width={20} height={20} />
      </>
    );
  };

  return (
    <Container ref={containerRef}>
      <SwipeItem
        confirmed={confirmed}
        confirming={loading}
        ref={swipeItemRef}
        width={width}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}>
        <RightArrow width={20} height={20} stroke="#fff" />
      </SwipeItem>

      <Text>{handleConfirmStatus(confirmed, loading)}</Text>

      <SwipeTo ref={swipeToItemRef} Bg={Bg}>
        <SwipeToContent></SwipeToContent>
      </SwipeTo>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 56px;
  background-color: #f3f3f3;
  border-radius: 100px;
  margin-top: 10px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SwipeItem = styled.div<{ width: number; confirmed: boolean; confirming: boolean }>`
  width: ${({ width, confirmed, confirming }) =>
    confirmed || confirming ? '345px' : `${width}px`};
  min-width: 56px;
  max-width: 345px;
  height: 56px;
  padding: 20px;
  box-sizing: border-box;
  border-radius: 100px;
  background-image: linear-gradient(to right, #1cc3ce, #b9e260);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: absolute;
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9;
`;

const SwipeTo = styled.div<{ Bg: string }>`
  width: 56px;
  height: 56px;
  border-radius: 100px;
  position: absolute;
  right: 0;
  pointer-events: none;
  background-image: ${({ Bg }) => `url(${Bg})`};
  padding: 4px;
  box-sizing: border-box;
  /* z-index: 99; */
`;

const SwipeToContent = styled.div`
  width: 100%;
  height: 100%;
  background-color: #f3f3f3;
  border-radius: 100px;
`;

const Text = styled.div`
  font-size: 13.4px;
  font-weight: 500;
  color: #000;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 999;
  pointer-events: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
`;
