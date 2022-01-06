import Slider, { Settings } from 'react-slick';

interface Props {
  children: React.ReactNode[];
  settings?: Settings;
}

export default function SimpleSlider({ children, settings }: Props) {
  const defaultSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <Slider {...defaultSettings} {...settings}>
      {children}
    </Slider>
  );
}
