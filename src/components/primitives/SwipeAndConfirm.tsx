import styled from 'styled-components';
import { useSwipeable } from 'react-swipeable';
import { useRef } from 'react';

export default function SwipeAndConfirm() {
  const handlers = useSwipeable({
    onSwiped: (eventData) => console.log('User Swiped!', eventData),
    onSwipeStart: (eventData) => console.log('User Swiped!', eventData)
  });

  const myRef = useRef();

  const refPassthrough = (el: any) => {
    handlers.ref(el);
    myRef.current = el;
  };

  return (
    <Container {...handlers}>
      <SwipeItem ref={refPassthrough}></SwipeItem>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
`;

const SwipeItem = styled.div`
  width: 50px;
  height: 50px;
  background: rebeccapurple;
`;
