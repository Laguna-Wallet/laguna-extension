import KusamaIcon from 'assets/svgComponents/KusamaIcon';
import MoonriverIcon from 'assets/svgComponents/MoonriverIcon';
import PolkadotIcon from 'assets/svgComponents/PolkadotIcon';
import AstarIcon from '../../assets/imgs/NetworkIcons/AstarIcon.png';
import styled from 'styled-components';

type Props = {
  width?: string;
  height?: string;
  chain: string;
};

export default function NetworkIcons({ width, height, chain }: Props) {
  if (chain === 'polkadot' || chain === 'westend') {
    return <PolkadotIcon />;
  }

  if (chain === 'kusama') {
    return <KusamaIcon />;
  }

  if (chain === 'moonriver') {
    return <MoonriverIcon />;
  }

  if (chain === 'astar') {
    return <IconContainer width={width} height={height} img={AstarIcon} />;
  }

  return <PlaceHolder />;
}

const PlaceHolder = styled.div`
  width: 36px;
  height: 36px;
  background-color: #111;
  border-radius: 100%;
`;

const IconContainer = styled.div<{ width?: string; height?: string; img: string }>`
  width: ${({ width }) => width || '36px'};
  height: ${({ height }) => height || '36px'};
  background-image: ${({ img }) => `url(${img})`};
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
`;
